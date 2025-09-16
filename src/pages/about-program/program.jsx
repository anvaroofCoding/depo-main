import CallToAction from '@/components/call-to-action'
import ImageGallery from '@/components/image-gallery'
import ProgramHeader from '@/components/program-header'
import TutorialSteps from '@/components/tutorial-steps'
import {
	CheckCircleOutlined,
	DownloadOutlined,
	PlayCircleOutlined,
	RocketOutlined,
	SettingOutlined,
} from '@ant-design/icons'
import {
	Anchor,
	Button,
	Card,
	Col,
	Divider,
	Layout,
	Row,
	Space,
	Typography,
} from 'antd'

const { Content, Footer } = Layout
const { Title, Paragraph } = Typography

export default function Program() {
	return (
		<Layout className='min-h-screen '>
			<ProgramHeader />

			<Content className='bg-background'>
				{/* Hero Section */}
				<div className='bg-primary text-primary-foreground py-16'>
					<div className='max-w-6xl mx-auto px-6 text-center'>
						<Title
							level={1}
							className='!text-primary-foreground !mb-4 font-bold text-4xl md:text-5xl'
						>
							Master Our Program
						</Title>
						<Paragraph className='!text-primary-foreground/90 text-lg md:text-xl max-w-3xl mx-auto'>
							Learn how to use our powerful software with this comprehensive
							step-by-step guide. From installation to advanced features, we'll
							walk you through everything you need to know.
						</Paragraph>
						<Space size='large' className='mt-8'>
							<Button
								type='primary'
								size='large'
								icon={<PlayCircleOutlined />}
								className='bg-accent hover:bg-accent/90 border-accent'
							>
								Start Tutorial
							</Button>
							<Button
								size='large'
								icon={<DownloadOutlined />}
								className='text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary'
							>
								Download Program
							</Button>
						</Space>
					</div>
				</div>

				{/* Quick Navigation */}
				<div className='bg-secondary py-8'>
					<div className='max-w-6xl mx-auto px-6'>
						<Anchor
							direction='horizontal'
							className='flex justify-center'
							items={[
								{ key: 'overview', href: '#overview', title: 'Overview' },
								{
									key: 'installation',
									href: '#installation',
									title: 'Installation',
								},
								{
									key: 'getting-started',
									href: '#getting-started',
									title: 'Getting Started',
								},
								{ key: 'features', href: '#features', title: 'Features' },
								{ key: 'advanced', href: '#advanced', title: 'Advanced' },
							]}
						/>
					</div>
				</div>

				{/* Program Overview Section */}
				<div id='overview' className='py-16'>
					<div className='max-w-6xl mx-auto px-6'>
						<div className='text-center mb-12'>
							<Title level={2} className='!mb-4'>
								Program Overview
							</Title>
							<Paragraph className='text-lg text-muted-foreground max-w-3xl mx-auto'>
								Get familiar with the main interface and core concepts before
								diving into the detailed tutorial.
							</Paragraph>
						</div>

						<ImageGallery />
					</div>
				</div>

				<Divider />

				{/* Tutorial Steps Section */}
				<div id='installation' className='py-16 bg-secondary/30'>
					<div className='max-w-6xl mx-auto px-6'>
						<div className='text-center mb-12'>
							<Title level={2} className='!mb-4'>
								Step-by-Step Tutorial
							</Title>
							<Paragraph className='text-lg text-muted-foreground max-w-3xl mx-auto'>
								Follow these detailed instructions to master every aspect of the
								program.
							</Paragraph>
						</div>

						<TutorialSteps />
					</div>
				</div>

				{/* Features Showcase */}
				<div id='features' className='py-16'>
					<div className='max-w-6xl mx-auto px-6'>
						<div className='text-center mb-12'>
							<Title level={2} className='!mb-4'>
								Key Features
							</Title>
							<Paragraph className='text-lg text-muted-foreground max-w-3xl mx-auto'>
								Discover the powerful features that make our program stand out.
							</Paragraph>
						</div>

						<Row gutter={[24, 24]}>
							<Col xs={24} md={8}>
								<Card
									className='h-full text-center hover:shadow-lg transition-shadow'
									cover={
										<div className='p-8 bg-gradient-to-br from-blue-50 to-blue-100'>
											<RocketOutlined className='text-4xl text-blue-600' />
										</div>
									}
								>
									<Title level={4}>Fast Performance</Title>
									<Paragraph className='text-muted-foreground'>
										Lightning-fast processing with optimized algorithms for
										maximum efficiency.
									</Paragraph>
								</Card>
							</Col>

							<Col xs={24} md={8}>
								<Card
									className='h-full text-center hover:shadow-lg transition-shadow'
									cover={
										<div className='p-8 bg-gradient-to-br from-green-50 to-green-100'>
											<SettingOutlined className='text-4xl text-green-600' />
										</div>
									}
								>
									<Title level={4}>Customizable</Title>
									<Paragraph className='text-muted-foreground'>
										Extensive customization options to fit your specific
										workflow and preferences.
									</Paragraph>
								</Card>
							</Col>

							<Col xs={24} md={8}>
								<Card
									className='h-full text-center hover:shadow-lg transition-shadow'
									cover={
										<div className='p-8 bg-gradient-to-br from-purple-50 to-purple-100'>
											<CheckCircleOutlined className='text-4xl text-purple-600' />
										</div>
									}
								>
									<Title level={4}>Reliable</Title>
									<Paragraph className='text-muted-foreground'>
										Built with stability in mind, ensuring consistent
										performance every time.
									</Paragraph>
								</Card>
							</Col>
						</Row>
					</div>
				</div>

				{/* Call to Action */}
				<CallToAction />
			</Content>

			<Footer className='bg-primary text-primary-foreground text-center py-8'>
				<div className='max-w-6xl mx-auto px-6'>
					<Paragraph className='!text-primary-foreground/90 !mb-4'>
						© 2024 Your Program Name. All rights reserved.
					</Paragraph>
					<Space size='large'>
						<a
							href='#'
							className='text-primary-foreground/80 hover:text-primary-foreground'
						>
							Documentation
						</a>
						<a
							href='#'
							className='text-primary-foreground/80 hover:text-primary-foreground'
						>
							Support
						</a>
						<a
							href='#'
							className='text-primary-foreground/80 hover:text-primary-foreground'
						>
							Community
						</a>
					</Space>
				</div>
			</Footer>
		</Layout>
	)
}
