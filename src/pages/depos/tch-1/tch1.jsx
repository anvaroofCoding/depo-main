import Loading from '@/components/loading/loading'
import {
	useGetharakatQuery,
	useLazyExportExcelhQuery,
	useLazyExportPdfhQuery,
} from '@/services/api'
import { CalendarOutlined, DownloadOutlined } from '@ant-design/icons'
import { Button, Empty, Image, Input, Space, Table, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Tch1() {
	const [search, setSearch] = useState('')
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 8,
		total: 0,
	})
	const navigate = useNavigate()

	//get
	const { data, isLoading, isError, error } = useGetharakatQuery({
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
			current: newPagination.current,
			pageSize: newPagination.pageSize,
		}))
	}

	const [triggerExport, { isFetching }] = useLazyExportExcelhQuery()
	// pdf
	const [exportPDF, { isFetching: ehtihoyFetching }] = useLazyExportPdfhQuery()

	const handleExport = async () => {
		const blob = await triggerExport().unwrap()

		// Faylni yuklash
		const url = window.URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'harakat_tarkibi.xlsx' // fayl nomi
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
		a.download = 'harakat_tarkibi.pdf' // fayl nomi
		document.body.appendChild(a)
		a.click()
		a.remove()
	}

	if (isLoading) {
		return (
			<div className='w-full h-screen flex justify-center items-center'>
				<Loading />
			</div>
		)
	}

	if (isError) {
		console.log('Xato obyekt:', error)

		return (
			<div>
				<h3>Xato yuz berdi</h3>
				<pre>{JSON.stringify(error, null, 2)}</pre>
			</div>
		)
	}

	const getDepoSinc = id => {
		console.log(id)
		navigate(`/depo/${id}/`)
	}

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 80,
			sorter: (a, b) => a.id - b.id,
		},
		{
			title: 'Depo nomi',
			key: 'depo',
			width: 150,
			render: (_, record) => (
				<div className='flex items-center gap-3'>
					<Image
						src={record.image}
						width={50}
						height={50}
						className='rounded-[50%]'
					/>
					<div>
						<div className='font-medium'>{record.depo}</div>
					</div>
				</div>
			),
			sorter: (a, b) =>
				`${a.depo} ${a.depo}`.localeCompare(`${b.depo} ${b.depo}`),
		},
		{
			title: 'Guruhi',
			dataIndex: 'guruhi',
			key: 'guruhi',
			width: 150,
			filters: [...new Set(data.results.map(item => item.guruhi))].map(g => ({
				text: g,
				value: g,
			})),
			onFilter: (value, record) => record.guruhi === value,
		},
		{
			title: 'Turi',
			dataIndex: 'turi',
			key: 'turi',
			width: 150,
			filters: [...new Set(data.results.map(item => item.guruhi))].map(g => ({
				text: g,
				value: g,
			})),
			onFilter: (value, record) => record.guruhi === value,
		},
		{
			title: 'Tarkib raqami ',
			dataIndex: 'tarkib_raqami',
			key: 'tarkib_raqami',
			width: 250,
		},
		{
			title: 'Ishga tushgan vaqti ',
			dataIndex: 'ishga_tushgan_vaqti',
			key: 'ishga_tushgan_vaqti',
			width: 150,
		},
		{
			title: 'Eksplutatsiya mosofasi (kmda)',
			dataIndex: 'eksplutatsiya_vaqti',
			key: 'eksplutatsiya_vaqti',
			width: 150,
		},
		{
			title: 'Holati',
			dataIndex: 'holati',
			key: 'holati',
			width: 150,
			render: (_, record) => (
				<span
					style={{
						backgroundColor:
							record.holati === 'Nosozlikda'
								? '#FEE2E2'
								: record.holati === 'Soz_holatda'
								? '#D1FAE5'
								: record.holati === 'Texnik_korikda'
								? '#FEF3C7'
								: '#E5E7EB', // default
						color:
							record.holati === 'Nosozlikda'
								? '#B91C1C'
								: record.holati === 'Soz_holatda'
								? '#065F46'
								: record.holati === 'Texnik_korikda'
								? '#78350F'
								: '#374151', // default
						padding: '2px 6px',
						borderRadius: '4px',
					}}
				>
					{record.holati === 'Nosozlikda'
						? 'Nosozlikda'
						: record.holati === 'Soz_holatda'
						? 'Soz holatda'
						: record.holati === 'Texnik_korikda'
						? "Texnik ko'rikda"
						: '-'}{' '}
					{/* default */}
				</span>
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
			width: 150,
			render: date => (
				<div className='flex items-center gap-2'>
					<CalendarOutlined />
					<span>{dayjs(date).format('DD.MM.YYYY')}</span>
				</div>
			),
			sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
		},
		{
			title: "Ko'rish",
			key: 'actions',
			width: 150,
			fixed: 'right',
			render: (_, record) => (
				<Space size='small'>
					<Tooltip title="Ko'rish">
						<Button
							type='text'
							icon={<Eye style={{ color: '#5E78D9' }} />}
							onClick={() => getDepoSinc(record.id)}
						/>
					</Tooltip>
				</Space>
			),
		},
	]

	return (
		<div className=' bg-gray-50 min-h-screen'>
			<div className='bg-white rounded-lg shadow-sm'>
				<div className='p-4 border-b border-gray-200 w-full flex justify-between items-center'>
					<h1 className='text-2xl font-bold text-gray-900'>
						Chilonzor (TCH-1) harakat tarkibi jadvali
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
		</div>
	)
}
