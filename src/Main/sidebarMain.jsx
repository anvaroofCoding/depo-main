import { cn } from '@/lib/utils'
import { useGetProfileMeQuery } from '@/services/api'
import { DashboardFilled } from '@ant-design/icons'
import {
	Bell,
	BetweenHorizontalStart,
	ChartNoAxesGantt,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	FileText,
	LocateIcon,
	LogOut,
	NotebookTabs,
	Settings,
	TrainFront,
	Waypoints,
	Wrench,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const sidebarItems = [
	// { id: "home", label: "Home", icon: Home, isActive: true, path: "/" },
	{
		id: 'dashboard',
		label: 'Dashboard',
		icon: DashboardFilled,
		path: '/',
		badge: 1202,
	},
	{
		id: 'Royxatga olish',
		label: "Ro'yxatga olish",
		icon: TrainFront,
		badge: 1896,
		// path: "/mail",
		subItems: [
			{
				id: 'depo',
				label: 'Elektro depo',
				icon: ChartNoAxesGantt,
				badge: 3,
				path: '/deponi-royxatga-olish',
			},
			{
				id: 'Ehtiyotqismlari',
				label: 'Ehtiyot qismlari',
				icon: NotebookTabs,
				badge: 8556,
				path: '/ehtiyot-qismlarini-royxatga-olish',
			},
			{
				id: 'Harakattarkibi',
				label: 'Harakat tarkibi',
				icon: BetweenHorizontalStart,
				badge: 400,
				path: '/harakat-tarkibini-royxatga-olish',
			},
			{
				id: 'tamirlash',
				label: "Ta'mirlash",
				icon: Wrench,
				badge: 15,
				path: '/tamirlash-turi-royxatga-olish',
			},
			// { id: "trash", label: "Trash", icon: Trash2, path: "/mail/trash" },
		],
	},
	{
		id: 'harakatTarkibi',
		label: 'Harakat tarkibi',
		icon: Waypoints,
		subItems: [
			{
				id: 'chilonzor',
				label: 'Chilonzor (TCH-1)',
				icon: LocateIcon,
				path: '/depo-chilonzor',
			},
			{
				id: 'ozbekiston',
				label: "O'zbekiston (TCH-2)",
				icon: LocateIcon,
				path: '/depo-ozbekiston',
			},
		],
	},
	{
		id: 'texnikkorikjurnali',
		label: "Texnik ko'rik jurnali",
		icon: Wrench,
		subItems: [
			{
				id: "Texnik ko'rik qo'shish",
				label: "Texnik ko'rik qo'shish",
				icon: Wrench,
				path: "/texnik-ko'rik-qoshish",
			},
			{
				id: "Nosozlik qo'shish",
				label: "Nosozlik qo'shish",
				icon: Wrench,
				path: '/nosozliklar-qoshish',
			},
		],
	},
	{
		id: 'dastur',
		label: 'Dastur haqida',
		icon: FileText,
		path: '/dastur-haqida',
	},
	{
		id: 'notifications',
		label: 'Notifications',
		icon: Bell,
		badge: 12,
		path: '/dastur-haqida',
	},
	{
		id: 'settings',
		label: 'Settings',
		icon: Settings,
		path: '/dastur-haqida',
	},
]

export function AppleSidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [activeItem, setActiveItem] = useState('home')
	const [expandedItems, setExpandedItems] = useState(new Set())
	const [showExitConfirm, setShowExitConfirm] = useState(false)
	const navigate = useNavigate()
	const { data: profileData, isLoading, refetch } = useGetProfileMeQuery()

	const isLoggedIn = !!localStorage.getItem('token')

	useEffect(() => {
		// login tugagandan keyin chaqiring
		refetch()
	}, [isLoggedIn])

	const toggleExpanded = itemId => {
		const newExpanded = new Set(expandedItems)
		if (newExpanded.has(itemId)) {
			newExpanded.delete(itemId)
		} else {
			newExpanded.add(itemId)
		}
		setExpandedItems(newExpanded)
	}

	const handleNavigation = item => {
		setActiveItem(item.id)

		if (item.subItems && item.subItems.length > 0) {
			// agar bolalari bo'lsa faqat expand qilish
			toggleExpanded(item.id)
		} else {
			// bolalari bo'lmasa navigatsiya qilish
			navigate(item.path)
		}
	}

	const handleExitClick = () => {
		setShowExitConfirm(true)
	}

	const handleConfirmExit = () => {
		localStorage.removeItem('tokens')

		localStorage.clear()

		setShowExitConfirm(false)
		navigate('/login')
	}

	const handleCancelExit = () => {
		setShowExitConfirm(false)
	}

	return (
		<>
			<div
				className={cn(
					'flex flex-col bg-sidebar border-r border-sidebar-border   transition-all duration-300 ease-in-out',
					isCollapsed ? 'w-16' : 'w-64'
				)}
			>
				{/* Header */}
				<div className='flex items-center justify-between p-4 border-b border-sidebar-border'>
					{!isCollapsed && (
						<div className='flex items-center gap-2'>
							<div className='w-8 h-8  flex items-center justify-center'>
								<img src='/logos.png' alt='' />
							</div>
							<span className='font-semibold text-sidebar-foreground'>
								DEPO ERP
							</span>
						</div>
					)}
					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						className='p-1.5 rounded-md hover:bg-sidebar-accent transition-colors duration-200'
					>
						{isCollapsed ? (
							<ChevronRight className='w-4 h-4 text-sidebar-foreground' />
						) : (
							<ChevronLeft className='w-4 h-4 text-sidebar-foreground' />
						)}
					</button>
				</div>

				{/* Navigation Items */}
				<nav className='flex-1 p-2 space-y-1 overflow-hidden'>
					{sidebarItems.map(item => {
						const Icon = item.icon
						const isActive = activeItem === item.id
						const hasSubItems = item.subItems && item.subItems.length > 0
						const isExpanded = expandedItems.has(item.id)

						return (
							<div key={item.id} className='space-y-1'>
								{/* Main Item */}
								<button
									onClick={() => handleNavigation(item, hasSubItems)}
									className={cn(
										'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
										isActive
											? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
											: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
										isCollapsed && 'justify-center px-2'
									)}
								>
									<Icon
										className={cn(
											'flex-shrink-0 transition-transform duration-200',
											isActive ? 'w-5 h-5' : 'w-5 h-5 group-hover:scale-110',
											isCollapsed && 'w-6 h-6'
										)}
									/>

									{!isCollapsed && (
										<>
											<span className='font-medium text-sm truncate flex-1 text-left'>
												{item.label}
											</span>
											<div className='flex items-center gap-2'>
												{item.badge && (
													<span
														className={cn(
															'px-2 py-0.5 text-xs rounded-full font-medium',
															isActive
																? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground'
																: 'bg-sidebar-primary text-sidebar-primary-foreground'
														)}
													>
														{item.badge}
													</span>
												)}
												{hasSubItems && (
													<div className='transition-transform duration-200'>
														{isExpanded ? (
															<ChevronUp className='w-4 h-4' />
														) : (
															<ChevronDown className='w-4 h-4' />
														)}
													</div>
												)}
											</div>
										</>
									)}

									{/* Tooltip for collapsed state */}
									{isCollapsed && (
										<div className='absolute left-full ml-2 px-2 py-1 bg-sidebar-foreground text-sidebar text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'>
											{item.label}
											{item.badge && (
												<span className='ml-1 px-1.5 py-0.5 bg-sidebar-primary text-sidebar-primary-foreground rounded-full text-xs'>
													{item.badge}
												</span>
											)}
										</div>
									)}
								</button>

								{hasSubItems && !isCollapsed && (
									<div
										className={cn(
											'overflow-hidden transition-all duration-300 ease-in-out',
											isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
										)}
									>
										<div className='ml-6 space-y-1 pt-1'>
											{item.subItems?.map(subItem => {
												const SubIcon = subItem.icon
												const isSubActive = activeItem === subItem.id

												return (
													<button
														key={subItem.id}
														onClick={() => handleNavigation(subItem)}
														className={cn(
															'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm',
															isSubActive
																? 'bg-sidebar-primary/80 text-sidebar-primary-foreground shadow-sm'
																: 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
														)}
													>
														<SubIcon className='w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110' />
														<span className='font-medium truncate flex-1 text-left'>
															{subItem.label}
														</span>
														{subItem.badge && (
															<span
																className={cn(
																	'px-1.5 py-0.5 text-xs rounded-full font-medium',
																	isSubActive
																		? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground'
																		: 'bg-sidebar-primary/80 text-sidebar-primary-foreground'
																)}
															>
																{subItem.badge}
															</span>
														)}
													</button>
												)
											})}
										</div>
									</div>
								)}
							</div>
						)
					})}
				</nav>

				{/* Footer */}
				<div className='p-4 border-t border-sidebar-border space-y-3'>
					{/* Exit Button */}
					<button
						onClick={handleExitClick}
						className={cn(
							'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
							'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50',
							isCollapsed && 'justify-center px-2'
						)}
					>
						<LogOut
							className={cn(
								'flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
								isCollapsed ? 'w-6 h-6' : 'w-5 h-5'
							)}
						/>
						{!isCollapsed && (
							<span className='font-medium text-sm'>Logindan chiqish</span>
						)}

						{/* Tooltip for collapsed state */}
						{isCollapsed && (
							<div className='absolute left-full ml-2 px-2 py-1 bg-sidebar-foreground text-sidebar text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'>
								Dasturdan chiqish
							</div>
						)}
					</button>

					{/* User Profile */}
					<div
						className={cn(
							'flex items-center gap-3',
							isCollapsed && 'justify-center'
						)}
					>
						<div className='w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center'>
							<span className='text-sm font-medium text-sidebar-accent-foreground'>
								{isLoading
									? '...'
									: profileData?.username
									? profileData.username.charAt(0).toUpperCase() +
									  profileData.username
											.charAt(profileData.username.length - 1)
											.toUpperCase()
									: ''}
							</span>
						</div>
						{!isCollapsed && (
							<div className='flex-1 min-w-0'>
								<p className='text-sm font-medium text-sidebar-foreground truncate'>
									{/* {profileData.username} */}
									{isLoading ? 'Yuklanmoqda...' : profileData?.username}
								</p>
								<p className='text-xs text-sidebar-foreground/60 truncate'>
									<p className='text-xs text-sidebar-foreground/60 truncate'>
										{isLoading ? 'Yuklanmoqda...' : profileData?.role}
									</p>
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Exit Confirmation Modal with Animation */}
			{showExitConfirm && (
				<div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200'>
					<div className='bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-in zoom-in-95 duration-200'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
								Dasturdan rostan chiqasizmi
							</h3>
							<button
								onClick={handleCancelExit}
								className='p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
							>
								<X className='w-5 h-5 text-gray-500' />
							</button>
						</div>

						<p className='text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed'>
							Login parolingizni qayta yozib yana kirishingiz mumkin. Unutmang
							faqat o'zingizni login va parolingizdan foydalaning!
						</p>

						<div className='flex gap-3'>
							<button
								onClick={handleCancelExit}
								className='flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200'
							>
								Bekor qilish
							</button>
							<button
								onClick={handleConfirmExit}
								className='flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 active:scale-95'
							>
								Ha chiqaman
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
