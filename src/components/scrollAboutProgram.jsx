import styled from 'styled-components'

const Card = () => {
	return (
		<StyledWrapper>
			<div className='marquee'>
				<div className='marquee__inner'>
					{/* 2 marta emas, 3–4 marta takrorlasak ham uzilmaydi */}
					<div className='marquee__group'>
						<span>
							<img src='/React.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Redux.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Python.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/PostgresSQL.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/ant.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/CSS3.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Django.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Git.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/GitHub.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/JavaScript.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Swagger.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Tailwind CSS.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Vite.js.png' alt='as' className='w-20' />
						</span>
					</div>
					<div className='marquee__group'>
						<span>
							<img src='/React.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Redux.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Python.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/PostgresSQL.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/ant.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/CSS3.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Django.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Git.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/GitHub.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/JavaScript.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Swagger.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Tailwind CSS.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Vite.js.png' alt='as' className='w-20' />
						</span>
					</div>
					<div className='marquee__group'>
						<span>
							<img src='/React.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Redux.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Python.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/PostgresSQL.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/ant.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/CSS3.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Django.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Git.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/GitHub.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/JavaScript.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Swagger.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Tailwind CSS.png' alt='as' className='w-20' />
						</span>
						<span>
							<img src='/Vite.js.png' alt='as' className='w-20' />
						</span>
					</div>
				</div>
			</div>
		</StyledWrapper>
	)
}

const StyledWrapper = styled.div`
	.marquee {
		overflow: hidden;
		width: 100%;
		-webkit-mask-image: linear-gradient(
			to right,
			transparent 0%,
			black 10%,
			black 90%,
			transparent 100%
		);
		mask-image: linear-gradient(
			to right,
			transparent 0%,
			black 10%,
			black 90%,
			transparent 100%
		);
	}

	.marquee_header {
		font-size: 35px;
		font-weight: 800;
		text-align: center;
		margin-bottom: 20px;
	}

	.marquee__inner {
		display: flex;
		width: max-content; /* nechta group bo‘lsa ham kengayadi */
		animation: marquee 15s linear infinite;
	}

	.marquee__group {
		display: flex;
	}

	.marquee__group span {
		margin: 0 1.5rem;
		white-space: nowrap;
		padding: 4px 16px 4px 12px;
		border-radius: 6px;
	}

	@keyframes marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-33.33%); /* 3 ta group => 1/3 qismi */
		}
	}
`

export default Card
