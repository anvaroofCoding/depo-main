import Loading from '@/components/loading/loading'
import {
	useAddTexnikMutation,
	useGetehtiyotQuery,
	useGetTexnikAddQuery,
	useGetTexnikDetailsQuery,
	useLazyExportExcelTexnikQuery,
	useLazyExportPdftTexnikQuery,
} from '@/services/api'
import {
	CalendarOutlined,
	DownloadOutlined,
	EyeFilled,
	FileExclamationOutlined,
	PlusOutlined,
	UploadOutlined,
} from '@ant-design/icons'
import {
	Button,
	DatePicker,
	Empty,
	Form,
	Input,
	message,
	Modal,
	Select,
	Space,
	Switch,
	Table,
	Tooltip,
	Upload,
} from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function TexnikAdd() {
	const [messageApi, contextHolder] = message.useMessage()
	const [yakunlashChecked, setYakunlashChecked] = useState(false)

	const [isAddModal, SetIsAddModal] = useState(false)
	const [formAdd] = Form.useForm()
	const { Option } = Select
	const [search, setSearch] = useState('')
	const navigate = useNavigate()

	const params = useParams()
	const { ide } = params

	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0,
	})

	//get
	const { data, isLoading, isError, error } = useGetTexnikAddQuery()
	const { data: texnikdatas, isLoading: loadings } =
		useGetTexnikDetailsQuery(ide)

	console.log(texnikdatas)

	const filteredDatas = useMemo(() => {
		if (!texnikdatas?.steps?.results) return []

		return texnikdatas.steps.results.filter(
			item =>
				item.bartaraf_etilgan_kamchiliklar
					?.toLowerCase()
					.includes(search.toLowerCase()) ||
				item.kamchiliklar_haqida?.toLowerCase().includes(search.toLowerCase())
		)
	}, [texnikdatas, search])

	const paginatedDatas = useMemo(() => {
		const start = (pagination.current - 1) * pagination.pageSize
		const end = start + pagination.pageSize
		return filteredDatas.slice(start, end)
	}, [filteredDatas, pagination])

	console.log(paginatedDatas)

	// get ehtiyot qismlar for select
	const { data: dataEhtiyot, isLoading: isLoadingEhtiyot } =
		useGetehtiyotQuery()

	//post
	const [addTexnik, { isLoading: load, error: errr }] = useAddTexnikMutation()

	const [triggerExport, { isFetching }] = useLazyExportExcelTexnikQuery()
	// pdf
	const [exportPDF, { isFetching: ehtihoyFetching }] =
		useLazyExportPdftTexnikQuery()

	const handleExport = async () => {
		const blob = await triggerExport().unwrap()

		// Faylni yuklash
		const url = window.URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'texnik-korik.xlsx' // fayl nomi
		document.body.appendChild(a)
		a.click()
		a.remove()
	}
	const handlepdf = async () => {
		const blob = await exportPDF().unwrap()

		// Faylni yuklash
		const url = window.URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'texnik-korik.pdf' // fayl nomi
		document.body.appendChild(a)
		a.click()
		a.remove()
	}

	const handleEnd = async values => {
		try {
			const formData = new FormData()

			formData.append('kamchiliklar_haqida', values.kamchiliklar_haqida)

			if (values.ehtiyot_qismlar?.length) {
				values.ehtiyot_qismlar.forEach(item => {
					formData.append('ehtiyot_qismlar[]', item)
				})
			}

			formData.append(
				'bartaraf_etilgan_kamchiliklar',
				values.bartaraf_etilgan_kamchiliklar
			)

			formData.append('yakunlash', yakunlashChecked) // Yakunlash true/false

			// Yakunlash true bo‘lsa, qo‘shimcha ma’lumotlarni ham yuboramiz
			if (yakunlashChecked) {
				if (values.chiqqan_vaqti) {
					formData.append(
						'chiqqan_vaqti',
						values.chiqqan_vaqti.format('YYYY-MM-DD HH:mm')
					)
				}

				if (values.akt_file && values.akt_file.length > 0) {
					const file = values.akt_file[0].originFileObj
					formData.append('akt_file', file, file.name)
				}
			}

			// Har doim password jo‘natiladi
			formData.append('password', values.password)

			// API chaqiruv
			await addTexnik(formData).unwrap()

			messageApi.success('Texnik muvaffaqiyatli qo‘shildi!')
			SetIsAddModal(false)
			formAdd.resetFields()
			setYakunlashChecked(false)
		} catch (err) {
			console.error('Xato:', err)
			messageApi.error('Xatolik yuz berdi!')
		}
	}

	const handleSubmit = async values => {
		try {
			// 1) JSON payload
			const payload = {
				kamchiliklar_haqida: values.kamchiliklar_haqida,
				ehtiyot_qismlar: values.ehtiyot_qismlar || [],
				bartaraf_etilgan_kamchiliklar: values.bartaraf_etilgan_kamchiliklar,
				password: values.password,
				yakunlash: !!yakunlashChecked, // true/false
			}

			// 2) API chaqiruv
			await addTexnik(payload).unwrap()

			messageApi.success('Texnik muvaffaqiyatli qo‘shildi!')
			SetIsAddModal(false)
			formAdd.resetFields()
			setYakunlashChecked(false)
		} catch (err) {
			console.error('Xato:', err)

			if (err?.status === 'PARSING_ERROR' || err?.originalStatus === 500) {
				messageApi.error('Server xatosi (500). Backend JSON qaytarmadi.')
			} else {
				messageApi.error(err?.data?.message || 'Xatolik yuz berdi!')
			}
		}
	}

	if (isLoading || load || loadings || isLoadingEhtiyot) {
		return (
			<div className='w-full h-screen flex justify-center items-center'>
				<Loading />
			</div>
		)
	}

	if (errr) {
		console.log(errr)
	}

	if (isError) {
		// RTK Query dagi `error` obyekt
		console.log('Xato obyekt:', error)

		return (
			<div>
				<h3>Xato yuz berdi</h3>
				<pre>{JSON.stringify(error, null, 2)}</pre>
			</div>
		)
	}

	const handleAdd = () => {
		SetIsAddModal(true)
	}

	const handleDetails = ide => {
		navigate(`texnik-korik-details/${ide}/`)
	}

	const handleYakunlashChange = checked => {
		setYakunlashChecked(checked)
	}

	// datani filterlash get uchun
	const filterData = data.results.find(item => item.id == ide)
	console.log(filterData)

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 80,
			sorter: (a, b) => a.id - b.id,
		},

		{
			title: 'Holati',
			dataIndex: 'status',
			key: 'status',
			width: 130,
			render: (_, record) => (
				<span
					style={{
						backgroundColor:
							record.status === 'Yakunlandi'
								? '#D1FAE5'
								: record.status === 'Texnik_korikda' ||
								  record.status === 'Jarayonda' ||
								  record.status === 'Soz_holatda'
								? '#FEF3C7'
								: '#E5E7EB', // default
						color:
							record.status === 'Soz_holatda'
								? '#065F46'
								: record.status === 'Texnik_korikda'
								? '#78350F'
								: '#374151', // default
						padding: '2px 6px',
						borderRadius: '4px',
					}}
				>
					{record.status === 'Yakunlandi'
						? 'Yakunlandi'
						: record.status === 'Soz_holatda'
						? "Texnik ko'rikda"
						: record.status === 'Texnik_korikda'
						? "Texnik ko'rikda"
						: record.status === 'Jarayonda'
						? 'Jarayonda'
						: '-'}{' '}
					{/* default */}
				</span>
			),
		},
		{
			title: 'Kamchiliklar haqida',
			dataIndex: 'kamchiliklar_haqida',
			key: 'kamchiliklar_haqida',
			width: 200,
			render: text =>
				text && text.length > 20 ? text.substring(0, 30) + '...' : text,
		},
		{
			title: 'Bartaraf etilgan kamchiliklar',
			dataIndex: 'bartaraf_etilgan_kamchiliklar',
			key: 'bartaraf_etilgan_kamchiliklar',
			width: 220,
			render: text =>
				text && text.length > 20 ? text.substring(0, 30) + '...' : text,
		},

		{
			title: 'Yaratuvchi',
			key: 'created_by',
			width: 100,
			render: (_, record) => (
				<div className='space-y-1'>
					<div className='flex items-center gap-2 text-sm'>
						<span>{record.created_by}</span>
					</div>
				</div>
			),
		},
		{
			title: 'Yaratilgan sana',
			dataIndex: 'created_at',
			key: 'created_at',
			width: 100,
			render: date => (
				<div className='flex items-center gap-2'>
					<CalendarOutlined />
					<span>{dayjs(date).format('DD.MM.YYYY')}</span>
				</div>
			),
			sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
		},
		{
			title: 'Amallar',
			key: 'actions',
			width: 80,
			fixed: 'right',
			render: (_, record) => (
				<Space size='small'>
					<Tooltip title="Batafsil ko'rish">
						<Button
							type='text'
							icon={<EyeFilled />}
							onClick={() => handleDetails(record.id)}
							color='blue'
						/>
					</Tooltip>
					{/* <Tooltip title='Tahrirlash'>
						<Button
							type='text'
							icon={<EditOutlined />}
							// onClick={() => handleEdit(record)}
							onClick={() => handleEdit(record)}
						/>
					</Tooltip>
					<Tooltip title="O'chirish">
						<Button
							type='text'
							icon={<DeleteOutlined />}
							onClick={() => handleDelete(record)}
							danger
						/>
					</Tooltip> */}
				</Space>
			),
		},
	]

	return (
		<div className=' bg-gray-50 min-h-screen'>
			{contextHolder}
			<div className='bg-white rounded-lg shadow-sm'>
				<div className='p-4 border-b border-gray-200 w-full flex justify-between items-center'>
					<h1 className='text-2xl font-bold text-gray-900'>
						{filterData.tarkib_nomi} | {filterData.tamir_turi_nomi}
					</h1>
					<Input.Search
						placeholder='Tarkib raqami bo‘yicha qidirish...'
						allowClear
						onSearch={value => {
							setSearch(value)
							setPagination(prev => ({ ...prev, current: 1 }))
						}}
						style={{ width: 500 }}
					/>
					<div className='flex justify-center items-center gap-5'>
						<Button
							variant='solid'
							color='volcano'
							icon={<DownloadOutlined />}
							loading={ehtihoyFetching}
							onClick={handlepdf}
						>
							Export PDF
						</Button>
						<Button
							variant='solid'
							color='green'
							icon={<DownloadOutlined />}
							loading={isFetching}
							onClick={handleExport}
						>
							Export Excel
						</Button>
						<Button
							variant='solid'
							color='cyan'
							icon={<FileExclamationOutlined />}
							// onClick={handleAdd}
						>
							Yakunlash
						</Button>
						<Button
							variant='solid'
							color='primary'
							icon={<PlusOutlined />}
							onClick={handleAdd}
						>
							Qo'shish
						</Button>
					</div>
				</div>

				<div className='p-6'>
					<Table
						columns={columns}
						dataSource={paginatedDatas.map((item, index) => ({
							...item,
							key: item.id || index,
						}))}
						loading={isLoading}
						pagination={{
							current: pagination.current,
							pageSize: pagination.pageSize,
							total: filteredDatas.length, // backend emas, frontend bo‘yicha umumiy
							showSizeChanger: true,
							pageSizeOptions: ['5', '10', '20', '50'],
							showTotal: (total, range) =>
								`${range[0]}-${range[1]} dan jami ${total} ta`,
							onChange: (page, pageSize) => {
								setPagination({ current: page, pageSize })
							},
						}}
						scroll={{ x: 1200 }}
						locale={{
							emptyText: (
								<Empty
									image={Empty.PRESENTED_IMAGE_SIMPLE}
									description={
										<div className='text-center py-8'>
											<h3 className='text-lg font-medium text-gray-900 mb-2'>
												Hech narsa topilmadi
											</h3>
											<p className='text-gray-500'>
												Hozircha ma'lumotlar mavjud emas
											</p>
										</div>
									}
								/>
							),
						}}
						className='border border-gray-200 rounded-lg'
					/>
				</div>
			</div>

			{/* View Modal */}
			<Modal
				title="Texnik qo'shish"
				open={isAddModal}
				onCancel={() => {
					SetIsAddModal(false)
					formAdd.resetFields()
					setYakunlashChecked(false)
				}}
				width={700}
				footer={[
					!yakunlashChecked ? (
						<Button key='save' type='primary' onClick={() => formAdd.submit()}>
							Saqlash
						</Button>
					) : (
						<Button
							key='finish'
							type='primary'
							danger
							onClick={() => formAdd.submit()}
						>
							Yakunlash
						</Button>
					),
					<Button key='cancel' onClick={() => SetIsAddModal(false)}>
						Bekor qilish
					</Button>,
				]}
			>
				<Form
					form={formAdd}
					layout='vertical'
					onFinish={yakunlashChecked ? handleEnd : handleSubmit}
				>
					{/* Kamchiliklar haqida */}
					<Form.Item
						name='kamchiliklar_haqida'
						label='Kamchiliklar haqida'
						rules={[{ required: true, message: 'Kamchiliklarni kiriting!' }]}
					>
						<Input.TextArea rows={3} placeholder='Kamchiliklarni yozing...' />
					</Form.Item>

					{/* Ehtiyot qismlar */}

					<Form.Item
						name='ehtiyot_qismlar'
						label='Ehtiyot qismni kiriting'
						rules={[{ required: true, message: 'Ehtiyot qismlarni kiriting!' }]}
					>
						<Select
							mode='multiple'
							placeholder='Tarkib raqamini tanlang'
							showSearch
							optionFilterProp='children' // 👈 qidiruvni option ichidagi text bo‘yicha qiladi
							filterOption={(input, option) =>
								option?.children
									?.toString()
									.toLowerCase()
									.includes(input.toLowerCase())
							}
						>
							{dataEhtiyot?.results?.map(item => (
								<Option key={item.id} value={item.id}>
									{item.ehtiyotqism_nomi}
								</Option>
							))}
						</Select>
					</Form.Item>

					{/* Bartaraf etilgan kamchiliklar */}
					<Form.Item
						name='bartaraf_etilgan_kamchiliklar'
						label='Nosozlikbi tartaraf qilgan xulosasi'
						rules={[{ required: true, message: 'Malumot kiriting!' }]}
					>
						<Input.TextArea
							rows={3}
							placeholder='Nosozlikbi tartaraf qilgan xulosasini yozing'
						/>
					</Form.Item>

					{/* ✅ Yakunlash */}
					<Form.Item
						name='yakunlash'
						label='Yakunlashni xohlaysizmi?'
						valuePropName='checked'
					>
						<Switch
							checked={yakunlashChecked}
							onChange={handleYakunlashChange}
						/>
					</Form.Item>

					{/* Chiqqan vaqti va Akt file */}
					{yakunlashChecked && (
						<>
							<Form.Item
								name='chiqqan_vaqti'
								label='Chiqqan vaqti'
								rules={[
									{
										required: true,
										message: 'Chiqqan vaqtini tanlash majburiy!',
									},
								]}
							>
								<DatePicker
									style={{ width: '100%' }}
									showTime={{ format: 'HH:mm' }} // ⬅ soat va daqiqa ko‘rinishi
									format='DD-MM-YYYY HH:mm' // ⬅ umumiy format
								/>
							</Form.Item>

							<Form.Item
								name='akt_file'
								label='Akt fayl'
								valuePropName='fileList'
								getValueFromEvent={e =>
									Array.isArray(e) ? e : e && e.fileList
								}
								rules={[
									{ required: true, message: 'Akt fayl yuklash majburiy!' },
								]}
							>
								<Upload
									name='akt_file'
									listType='picture'
									maxCount={1}
									beforeUpload={() => false}
								>
									<Button icon={<UploadOutlined />}>Akt fayl yuklash</Button>
								</Upload>
							</Form.Item>
						</>
					)}

					{/* Password */}
					<Form.Item
						name='password'
						label='Parol'
						rules={[{ required: true, message: 'Parolni kiriting!' }]}
					>
						<Input.Password placeholder='Parol' />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}
