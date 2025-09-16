import Loading from '@/components/loading/loading'
import { useGetOneDepoQuery } from '@/services/api'
import { Card, Descriptions, Image } from 'antd'
import { useParams } from 'react-router-dom'

const Depos = () => {
	const { id } = useParams()
	const { data, isLoading, isError, error } = useGetOneDepoQuery(id)

	if (isLoading) {
		return (
			<div className='w-full h-full flex justify-center items-center'>
				<Loading />
			</div>
		)
	}

	if (isError) {
		console.log(error)
		return <div>Xatolik yuz berdi</div>
	}

	return (
		<div className='w-full h-screen overflow-y-auto p-6'>
			<Card className='shadow-lg rounded-xl'>
				<div className='flex flex-col md:flex-row gap-8'>
					{/* Image */}
					<div className='flex justify-center'>
						<Image
							src={data?.image}
							alt='Depo rasmi'
							height={465}
							width={600}
							className='rounded-lg shadow-md'
						/>
					</div>

					{/* Info */}
					<div className='flex-1'>
						<Descriptions
							title="Depo Ma'lumotlari"
							bordered
							column={1}
							size='middle'
						>
							<Descriptions.Item label='Harakat tarkibi raqami'>
								{data?.tarkib_raqami}
							</Descriptions.Item>
							<Descriptions.Item label='Turi'>{data?.turi}</Descriptions.Item>
							<Descriptions.Item label='Guruhi'>
								{data?.guruhi}
							</Descriptions.Item>
							<Descriptions.Item label='Holati'>
								{data?.holati}
							</Descriptions.Item>
							<Descriptions.Item label='Eksplutatsiya vaqti'>
								{data?.eksplutatsiya_vaqti} soat
							</Descriptions.Item>
							<Descriptions.Item label='Ishga tushgan vaqti'>
								{data?.ishga_tushgan_vaqti}
							</Descriptions.Item>
							<Descriptions.Item label='Depo'>
								{data?.depo} (ID: {data?.depo_id})
							</Descriptions.Item>
							<Descriptions.Item label='Yaratilgan sana'>
								{(() => {
									const date = new Date(data?.created_at)
									const day = String(date.getDate()).padStart(2, '0')
									const month = String(date.getMonth() + 1).padStart(2, '0') // 0 dan boshlanadi
									const year = date.getFullYear()
									return `${day}-${month}-${year}`
								})()}
							</Descriptions.Item>
							<Descriptions.Item label='Yaratgan shaxs'>
								{data?.created_by}
							</Descriptions.Item>
						</Descriptions>
					</div>
				</div>
			</Card>
		</div>
	)
}

export default Depos
