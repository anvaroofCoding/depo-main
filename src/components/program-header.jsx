import {
	BookOutlined,
	HomeOutlined,
	QuestionCircleOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, Space } from 'antd'

const { Header } = Layout

export default function ProgramHeader() {
	const menuItems = [
		{
			key: 'home',
			icon: <HomeOutlined />,
			label: 'Home',
		},
		{
			key: 'tutorial',
			icon: <BookOutlined />,
			label: 'Tutorial',
		},
		{
			key: 'help',
			icon: <QuestionCircleOutlined />,
			label: 'Help',
		},
	]

	return (
		<Header className='bg-primary border-b border-border px-6 flex items-center justify-between'>
			<div className='flex items-center'>
				<div className='text-primary-foreground font-bold text-xl mr-8'>
					Program Name
				</div>
				<Menu
					theme='dark'
					mode='horizontal'
					defaultSelectedKeys={['tutorial']}
					items={menuItems}
					className='bg-transparent border-none flex-1 min-w-0'
				/>
			</div>

			<Space>
				<Button
					type='primary'
					className='bg-accent hover:bg-accent/90 border-accent'
				>
					Get Started
				</Button>
			</Space>
		</Header>
	)
}
