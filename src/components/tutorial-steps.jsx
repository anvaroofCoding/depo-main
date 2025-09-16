import {
	CheckCircleOutlined,
	DownloadOutlined,
	PlayCircleOutlined,
	RocketOutlined,
	SettingOutlined,
} from '@ant-design/icons'
import { Card, Col, Image, Row, Steps, Tag, Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function TutorialSteps() {
	const tutorialSteps = [
		{
			title: 'Download & Installation',
			description: 'Get the program installed on your system',
			icon: <DownloadOutlined />,
			content: {
				text: 'Download the latest version of our program from the official website. The installation process is straightforward and takes just a few minutes.',
				image: '/software-installation-wizard-interface.jpg',
				tips: [
					'System Requirements: Windows 10+, macOS 10.15+, or Linux',
					'Minimum 4GB RAM recommended',
					'Internet connection required for activation',
				],
			},
		},
		{
			title: 'Initial Setup',
			description: 'Configure your preferences and settings',
			icon: <SettingOutlined />,
			content: {
				text: 'Launch the program and complete the initial setup wizard. This includes setting your preferences, choosing themes, and configuring basic settings.',
				image: '/software-setup-wizard-with-preferences.jpg',
				tips: [
					'Choose your preferred theme',
					'Set up your workspace layout',
					'Configure auto-save settings',
				],
			},
		},
		{
			title: 'First Project',
			description: 'Create your first project to get familiar',
			icon: <PlayCircleOutlined />,
			content: {
				text: 'Start with a simple project to familiarize yourself with the interface. Follow our guided tutorial to create your first project step by step.',
				image: '/new-project-creation-dialog-interface.jpg',
				tips: [
					'Use the built-in templates',
					'Save your work frequently',
					'Explore the toolbar options',
				],
			},
		},
		{
			title: 'Advanced Features',
			description: 'Unlock the full potential of the program',
			icon: <RocketOutlined />,
			content: {
				text: 'Discover advanced features like automation, custom scripts, and integrations. These powerful tools will help you work more efficiently.',
				image: '/advanced-software-features-and-automation-panel.jpg',
				tips: [
					'Learn keyboard shortcuts',
					'Set up automation rules',
					'Explore plugin marketplace',
				],
			},
		},
		{
			title: 'Mastery & Optimization',
			description: 'Become a power user with expert tips',
			icon: <CheckCircleOutlined />,
			content: {
				text: 'Master the program with advanced techniques, optimization tips, and best practices. Join our community to share knowledge and get support.',
				image: '/expert-user-interface-with-advanced-tools.jpg',
				tips: [
					'Join the community forum',
					'Follow best practices',
					'Share your creations',
				],
			},
		},
	]

	return (
		<div className='space-y-8'>
			<Steps
				current={-1}
				direction='vertical'
				size='small'
				className='mb-8'
				items={tutorialSteps.map((step, index) => ({
					title: step.title,
					description: step.description,
					icon: step.icon,
				}))}
			/>

			{tutorialSteps.map((step, index) => (
				<Card
					key={index}
					className='shadow-sm hover:shadow-md transition-shadow'
				>
					<Row gutter={[24, 24]} align='middle'>
						<Col xs={24} lg={12}>
							<div className='flex items-center mb-4'>
								<div className='bg-accent text-accent-foreground p-3 rounded-lg mr-4 text-xl'>
									{step.icon}
								</div>
								<div>
									<Title level={3} className='!mb-1'>
										Step {index + 1}: {step.title}
									</Title>
									<Paragraph className='text-muted-foreground !mb-0'>
										{step.description}
									</Paragraph>
								</div>
							</div>

							<Paragraph className='text-base mb-4'>
								{step.content.text}
							</Paragraph>

							<div>
								<Title level={5} className='!mb-2'>
									Pro Tips:
								</Title>
								<div className='space-y-2'>
									{step.content.tips.map((tip, tipIndex) => (
										<Tag key={tipIndex} className='block w-fit mb-1 px-3 py-1'>
											{tip}
										</Tag>
									))}
								</div>
							</div>
						</Col>

						<Col xs={24} lg={12}>
							<div className='text-center'>
								<Image
									src={step.content.image || '/placeholder.svg'}
									alt={step.title}
									className='rounded-lg shadow-sm'
									preview={{
										mask: 'Click to enlarge',
									}}
								/>
							</div>
						</Col>
					</Row>
				</Card>
			))}
		</div>
	)
}
