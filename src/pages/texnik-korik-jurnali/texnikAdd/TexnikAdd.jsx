import Loading from '@/components/loading/loading'
import {
	useAddTexnikMutation,
	useGetehtiyotQuery,
	useGetharakatQuery,
	useGettamirQuery,
	useGetTexnikAddQuery,
	useLazyExportExcelTexnikQuery,
	useLazyExportPdftTexnikQuery,
} from '@/services/api'
import {
	CalendarOutlined,
	DownloadOutlined,
	EyeFilled,
	PlusOutlined,
	UploadOutlined,
} from '@ant-design/icons'
import {
	Button,
	Empty,
	Form,
	Input,
	InputNumber,
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
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TexnikAdd() {
	const [formAdd] = Form.useForm()
	const [messageApi, contextHolder] = message.useMessage()
	const [yakunlashChecked, setYakunlashChecked] = useState(false)
	const selectedEhtiyot = Form.useWatch('ehtiyot_qismlar', formAdd) || []

	// const [isEditModal, setIsEditModal] = useState(false)
	// const [editingDepo, setEditingDepo] = useState(null) // tahrir qilinayotgan depo
	// const [formEdit] = Form.useForm()
	const [isAddModal, SetIsAddModal] = useState(false)

	const { Option } = Select
	const [search, setSearch] = useState('')
	const navigate = useNavigate()

	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0,
	})

	//get
	const { data, isLoading, isError, error } = useGetTexnikAddQuery({
		limit: pagination.pageSize,
		page: pagination.current,
		search,
	})

	useEffect(() => {
		if (data?.count !== undefined) {
			setPagination(prev => ({ ...prev, total: data.count }))
		}
	}, [data])

	const handleTableChange = newPagination => {
		setPagination(prev => ({
			...prev,
			// agar pageSize o'zgargan bo'lsa currentni 1 ga qaytarishni xohlasang:
			current: newPagination.current,
			pageSize: newPagination.pageSize,
		}))
	}

	// get ehtiyot qismlar for select
	const { data: dataEhtiyot, isLoading: isLoadingEhtiyot } =
		useGetehtiyotQuery()
	// get tamir turi for select
	const { data: dataTamir, isLoading: isLoadingTamir } = useGettamirQuery()
	// get harakat tarkibi for select
	const { data: dataHarakat, isLoading: isLoadingHarakat } =
		useGetharakatQuery()
	//post
	const [addTexnik, { isLoading: load, error: errr }] = useAddTexnikMutation()
	//edit
	// const [updateDepo, { isLoading: loadders }] = useUpdateHarakatMutation()
	// delete
	// const [deleteDep, { isLoading: loadder }] = useDeletetexnikKorikMutation()
	// get depo
	// const { data: dataDepo } = useGetDepQuery()

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

			// 🔹 PK qiymatlarni integer qilib yuboramiz
			if (values.tarkib) {
				if (Array.isArray(values.tarkib)) {
					values.tarkib.forEach(val => {
						formData.append('tarkib', Number(val))
					})
				} else {
					formData.append('tarkib', Number(values.tarkib))
				}
			}

			if (values.tamir_turi) {
				formData.append('tamir_turi', Number(values.tamir_turi))
			}

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
			const ehtiyotQismlar = (values.ehtiyot_qismlar || []).map(
				ehtiyotqism_nomi => ({
					id: ehtiyotqism_nomi, // yoki ehtiyotqism_nomi bo‘lsa, nomini yuborasiz
					miqdor: values.ehtiyot_qismlar_miqdor?.[ehtiyotqism_nomi] || 1,
				})
			)

			const payload = {
				tarkib: values.tarkib,
				tamir_turi: values.tamir_turi,
				kamchiliklar_haqida: values.kamchiliklar_haqida,
				ehtiyot_qismlar: ehtiyotQismlar,
				bartaraf_etilgan_kamchiliklar: values.bartaraf_etilgan_kamchiliklar,
				password: values.password,
				yakunlash: !!yakunlashChecked,
			}

			await addTexnik(payload).unwrap()
			message.success('Texnik muvaffaqiyatli qo‘shildi!')
		} catch (err) {
			console.error('Xato:', err)
			message.error('Xatolik yuz berdi!')
		}
	}

	// const handleDelete = async tarkib => {
	// 	try {
	// 		await deleteDep(tarkib.id).unwrap()
	// 		messageApi.success(
	// 			`Harakat tarkibi "${tarkib.tarkib_raqami}" muvaffaqiyatli o'chirildi!`
	// 		)
	// 	} catch (err) {
	// 		console.error(err)
	// 		messageApi.error('Xatolik yuz berdi!')
	// 	}
	// }

	if (
		isLoading ||
		load ||
		// loadders ||
		// loadder ||
		isLoadingHarakat ||
		isLoadingTamir ||
		isLoadingEhtiyot
	) {
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

	// const handleEdit = depo => {
	// 	setEditingDepo(depo)
	// 	formEdit.setFieldsValue({
	// 		depo_id: depo.depo_id,
	// 		ishla_tushgan_vaqti: depo.ishga_tushgan_vaqti
	// 			? dayjs(depo.ishga_tushgan_vaqti)
	// 			: null,
	// 		guruhi: depo.guruhi,
	// 		turi: depo.turi,
	// 		tarkib_raqami: depo.tarkib_raqami,
	// 		eksplutatsiya_vaqti: depo.eksplutatsiya_vaqti,
	// 		image: depo.image ? [{ url: depo.image }] : [],
	// 	})
	// 	setIsEditModal(true)
	// }

	const handleDetails = ide => {
		navigate(`texnik-korik-details/${ide}/`)
	}

	// clear bilan tozalashni bilasizmilarmi ozin nimalar qilyapsizkar

	const handleYakunlashChange = checked => {
		setYakunlashChecked(checked)
	}

	// datani filterlash
	const filteredData = dataHarakat?.results.filter(
		item => item.holati == 'Soz_holatda'
	)

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 80,
			sorter: (a, b) => a.id - b.id,
		},
		{
			title: 'Tarkib nomi',
			key: 'depo',
			width: 250,
			render: (_, record) => (
				<div className='flex items-center gap-3'>
					<div>
						<div className='font-medium'>{record.tarkib_nomi}</div>
					</div>
				</div>
			),
			sorter: (a, b) =>
				`${a.depo} ${a.depo}`.localeCompare(`${b.depo} ${b.depo}`),
		},
		{
			title: 'Tamir turi',
			dataIndex: 'tamir_turi_nomi',
			key: 'tamir_turi_nomi',
			width: 150,
			filters: [...new Set(data.results.map(item => item.tamir_turi_nomi))].map(
				g => ({
					text: g,
					value: g,
				})
			),
			onFilter: (value, record) => record.tamir_turi_nomi === value,
		},
		{
			title: 'Holati',
			dataIndex: 'status',
			key: 'status',
			width: 150,
			render: (_, record) => (
				<span
					style={{
						backgroundColor:
							record.status === 'Soz_holatda'
								? '#D1FAE5'
								: record.status === 'Texnik_korikda'
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
					{record.status === 'Nosozlikda'
						? 'Nosozlikda'
						: record.status === 'Soz_holatda'
						? 'Soz holatda'
						: record.status === 'Texnik_korikda'
						? "Texnik ko'rikda"
						: '-'}{' '}
					{/* default */}
				</span>
			),
		},
		{
			title: 'Kirgan vaqti',
			key: 'kirgan_vaqti',
			width: 150,
			render: (_, record) => (
				<div className='space-y-1'>
					<div className='flex items-center gap-2 text-sm'>
						<span>{dayjs(record.kirgan_vaqti).format('DD.MM.YYYY HH:mm')}</span>
					</div>
				</div>
			),
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
			width: 50,
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
						Texnik ko'rikni ro'yxatga olish
					</h1>
					<Input.Search
						placeholder='Tarkib raqami bo‘yicha qidirish...'
						allowClear
						onSearch={value => {
							setPagination(prev => ({ ...prev, current: 1 })) // 1-sahifaga qaytamiz
							setSearch(value)
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
						dataSource={data.results.map((item, index) => ({
							...item,
							key: item.id || index, // id bo‘lsa id, bo‘lmasa indexdan foydalanamiz
						}))}
						loading={isLoading}
						pagination={{
							current: pagination.current,
							pageSize: pagination.pageSize,
							total: pagination.total,
							showSizeChanger: true,
							pageSizeOptions: ['5', '10', '20', '50'],
							showTotal: (total, range) =>
								`${range[0]}-${range[1]} dan jami ${total} ta`,
						}}
						onChange={handleTableChange}
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

			{/* Edit Modal */}
			{/* <Modal
				title='Harakat tarkibini tahrirlash'
				open={isEditModal}
				onCancel={() => setIsEditModal(false)}
				okText='Saqlash'
				cancelText='Bekor qilish'
				onOk={() => formEdit.submit()} // OK bosilganda form submit bo‘ladi
			>
				<Form
					form={formEdit}
					layout='vertical'
					onFinish={async values => {
						const formData = new FormData()
						formData.append('depo_id', values.depo_id)
						if (values.ishga_tushgan_vaqti) {
							formData.append(
								'ishga_tushgan_vaqti',
								values.ishga_tushgan_vaqti.format('YYYY-MM-DD')
							)
						}
						formData.append('guruhi', values.guruhi)
						formData.append('turi', values.turi)
						formData.append('tarkib_raqami', values.tarkib_raqami)
						formData.append('eksplutatsiya_vaqti', values.eksplutatsiya_vaqti)

						if (values.rasm && values.rasm[0]) {
							const file = values.rasm[0].originFileObj
							formData.append('image', file, file.name)
						}
						formData.append('holati', values.holati)

						try {
							await updateDepo({ id: editingDepo.id, data: formData }).unwrap()
							messageApi.success('Harakat tarkibi muvaffaqiyatli tahrirlandi!')
							setIsEditModal(false)
						} catch (err) {
							console.error(err)
							messageApi.error('Xatolik yuz berdi!')
						}
					}}
				>
					<Form.Item
						name='depo_id'
						label='Depo nomi'
						rules={[{ required: true, message: 'Deponi tanlang!' }]}
					>
						<Select placeholder='Depo tanlash'>
							{dataDepo?.results?.map(item => (
								<Select.Option key={item.id} value={item.id}>
									{item.depo_nomi}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name='ishga_tushgan_vaqti'
						label='Ishga tushirilgan vaqt'
						rules={[{ required: true, message: 'Sana kiriting!' }]}
					>
						<DatePicker format='DD-MM-YYYY' style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name='guruhi'
						label='Guruhi'
						rules={[{ required: true, message: 'Guruhi kiriting!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name='turi'
						label='Turi'
						rules={[{ required: true, message: 'Turi kiriting!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name='tarkib_raqami'
						label='Tarkib raqami'
						rules={[{ required: true, message: 'Tarkib raqamini kiriting!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name='eksplutatsiya_vaqti'
						label='Eksplutatsiya masofasi (kmda)'
						rules={[{ required: true, message: 'Masofani kiriting!' }]}
					>
						<Input type='number' />
					</Form.Item>

					<Form.Item
						name='rasm'
						label='Rasm'
						valuePropName='fileList'
						getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
					>
						<Upload
							name='rasm'
							listType='picture'
							maxCount={1}
							beforeUpload={() => false}
						>
							<Button icon={<UploadOutlined />}>Rasm yuklash</Button>
						</Upload>
					</Form.Item>
				</Form>
			</Modal> */}

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
					{/* Tarkib */}
					<Form.Item
						name='tarkib'
						label='Tarkib raqami kiriting'
						rules={[{ required: true, message: 'Tarkib raqamini kiriting!' }]}
					>
						<Select
							placeholder='Tarkib raqamini tanlang'
							showSearch
							optionFilterProp='children'
							filterOption={(input, option) =>
								option?.children?.toLowerCase().includes(input.toLowerCase())
							}
						>
							{filteredData?.map(item => (
								<Option key={item.id} value={item.id}>
									{item.tarkib_raqami} {item.guruhi} {item.holati}
								</Option>
							))}
						</Select>
					</Form.Item>

					{/* Ta'mir turi */}
					<Form.Item
						name='tamir_turi'
						label="Ta'mir turini tanlang"
						rules={[{ required: true, message: "Ta'mir turini kiriting!" }]}
					>
						<Select placeholder="Ta'mir turini tanlang" showSearch>
							{dataTamir?.results?.map(item => (
								<Option key={item.id} value={item.id}>
									{item.tamir_nomi}
								</Option>
							))}
						</Select>
					</Form.Item>

					{/* Kamchiliklar */}
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
						label='Ehtiyot qismlarni tanlang'
						rules={[{ required: true, message: 'Ehtiyot qismlarni tanlang!' }]}
					>
						<Select mode='multiple' placeholder='Ehtiyot qismlarni tanlang'>
							{dataEhtiyot?.results?.map(item => (
								<Option key={item.id} value={item.id}>
									{item.ehtiyotqism_nomi} ({item.birligi})
								</Option>
							))}
						</Select>
					</Form.Item>

					{/* ✅ Tanlangan ehtiyot qismlarga qarab avtomatik miqdor inputlarini qo‘shish */}
					{selectedEhtiyot.map(id => {
						const selectedItem = dataEhtiyot?.results?.find(q => q.id === id)
						return (
							<Form.Item
								key={id}
								name={['ehtiyot_qismlar_miqdor', id]}
								label={`${selectedItem?.ehtiyotqism_nomi} miqdori`}
								rules={[{ required: true, message: 'Miqdor kiriting!' }]}
							>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>
						)
					})}

					{/* Bartaraf etilgan kamchiliklar */}
					<Form.Item
						name='bartaraf_etilgan_kamchiliklar'
						label='Nosozlikni tartaraf qilgan xulosasi'
						rules={[{ required: true, message: "Ma'lumot kiriting!" }]}
					>
						<Input.TextArea
							rows={3}
							placeholder='Nosozlikni tartaraf qilgan xulosasini yozing'
						/>
					</Form.Item>

					{/* Yakunlash */}
					<Form.Item
						name='yakunlash'
						label='Yakunlashni xoxlasangiz akt faylni yuklang?'
						valuePropName='checked'
					>
						<Switch
							checked={yakunlashChecked}
							onChange={handleYakunlashChange}
						/>
					</Form.Item>

					{/* Chiqqan vaqti va Akt file */}
					{yakunlashChecked && (
						<Form.Item
							name='akt_file'
							label='Akt fayl'
							valuePropName='fileList'
							getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
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
