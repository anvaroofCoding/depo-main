import { Card, Col, Image, Row, Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function ImageGallery() {
	const galleryItems = [
		{
			title: 'Main Dashboard',
			description:
				'The central hub where you can access all program features and monitor your progress.',
			image: '/modern-software-dashboard.png',
		},
		{
			title: 'Settings Panel',
			description:
				'Customize your experience with comprehensive settings and preferences.',
			image: '/software-settings-configuration-panel.jpg',
		},
		{
			title: 'Data Visualization',
			description:
				'Beautiful charts and graphs to help you understand your data better.',
			image: '/data-visualization-charts-and-graphs.jpg',
		},
		{
			title: 'Export Features',
			description:
				'Export your work in multiple formats with advanced export options.',
			image: '/export-dialog-with-file-format-options.jpg',
		},
	]

	return (
		<Row gutter={[24, 24]}>
			{galleryItems.map((item, index) => (
				<Col xs={24} md={12} key={index}>
					<Card
						className='h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
						cover={
							<div className='overflow-hidden'>
								<Image
									alt={item.title}
									src={item.image || '/placeholder.svg'}
									className='w-full h-64 object-cover transition-transform duration-300 hover:scale-105'
									preview={{
										mask: 'Click to preview',
									}}
								/>
							</div>
						}
					>
						<Title level={4} className='!mb-2'>
							{item.title}
						</Title>
						<Paragraph className='text-muted-foreground'>
							{item.description}
						</Paragraph>
					</Card>
				</Col>
			))}
		</Row>
	)
}
