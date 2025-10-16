import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useGetTamirForTexnikKorikQuery } from '@/services/api'
import { Loader2, Wrench } from 'lucide-react'
import { useParams } from 'react-router-dom'

export default function TexnikKorikProgness() {
	const { id } = useParams()

	const { data, isLoading } = useGetTamirForTexnikKorikQuery(id)

	const handleCardClick = () => {
		console.log('Card clicked')
		// Bu yerda kerakli logikani qo'shing
		// Masalan: modal ochish, batafsil ma'lumot ko'rsatish, va hokazo
	}

	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-muted/30'>
				<div className='flex flex-col items-center gap-3'>
					<Loader2 className='h-8 w-8 animate-spin text-primary' />
					<p className='text-sm text-muted-foreground'>Yuklanmoqda...</p>
				</div>
			</div>
		)
	}

	return (
		<div className=' bg-gradient-to-br from-background via-muted/20 to-background p-4'>
			<div className='mx-auto w-full'>
				<Card className='border-border/50 shadow-lg w-full'>
					<CardHeader className='space-y-1'>
						<div className='flex items-center gap-2'>
							<div className='rounded-lg bg-orange-500/10 p-2'>
								<Wrench className='h-5 w-5 text-orange-500' />
							</div>
							<CardTitle className='text-2xl font-bold'>
								Texnik Ko'rik Tarixi
							</CardTitle>
						</div>
						<CardDescription className='text-base'>
							Ta'mir turlari va ularning soni
						</CardDescription>
					</CardHeader>

					<CardContent className='w-full'>
						{data?.texnik_korik_soni_turi?.length ? (
							<div className='flex w-full justify-between items-center'>
								{data.texnik_korik_soni_turi.map((item, index) => (
									<Card
										key={index}
										className='group relative cursor-pointer overflow-hidden border-border/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-orange-500/50'
										onClick={() => handleCardClick(item, index)}
									>
										<CardContent className='flex flex-col items-center justify-center gap-4 p-6'>
											<div className='rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-4 transition-transform duration-300 group-hover:scale-110'>
												<Wrench className='h-6 w-6 text-orange-500' />
											</div>

											<div className='text-center space-y-2'>
												<h3 className='font-semibold text-base leading-tight text-foreground'>
													{item.tamir_turi}
												</h3>

												<div className='flex items-center justify-center'>
													<Badge className='bg-green-500/10 text-green-600 hover:bg-green-500/20 text-lg font-bold px-4 py-1'>
														{item.soni}
													</Badge>
												</div>
											</div>
										</CardContent>

										<div className='absolute inset-0 -z-10 bg-gradient-to-br from-orange-500/0 to-orange-500/0 transition-all duration-300 group-hover:from-orange-500/5 group-hover:to-orange-600/5' />
									</Card>
								))}
							</div>
						) : (
							<div className='flex flex-col items-center justify-center py-12 text-center'>
								<div className='rounded-full bg-muted p-4 mb-4'>
									<Wrench className='h-8 w-8 text-muted-foreground' />
								</div>
								<p className='text-muted-foreground text-base'>
									Hozircha ma'lumot mavjud emas
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
