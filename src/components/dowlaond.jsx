import styled from 'styled-components'
import pdf from '../../public/logo.png'

const DowloandsButton = () => {
	return (
		<StyledWrapper>
			<a href={pdf} download='marketing.pdf' className='buttonDownload'>
				Dastur haqidagi qo'llanmani saqlash
			</a>
		</StyledWrapper>
	)
}

const StyledWrapper = styled.div`
	.buttonDownload {
		display: inline-block;
		position: relative;
		padding: 10px 25px;
		background-color: #4cc713;
		color: white;
		font-family: sans-serif;
		text-decoration: none;
		font-size: 0.9em;
		text-align: center;
		text-indent: 15px;
		border: none;
		cursor: pointer;
		border-radius: 6px;
		transition: background 0.3s ease;
	}

	.buttonDownload:hover {
		background-color: #45a21a;
		color: white;
	}

	.buttonDownload:before,
	.buttonDownload:after {
		content: ' ';
		display: block;
		position: absolute;
		left: 15px;
		top: 52%;
	}

	.buttonDownload:before {
		width: 10px;
		height: 2px;
		border-style: solid;
		border-width: 0 2px 2px;
	}

	.buttonDownload:after {
		width: 0;
		height: 0;
		margin-left: 3px;
		margin-top: -7px;
		border-style: solid;
		border-width: 4px 4px 0 4px;
		border-color: transparent;
		border-top-color: inherit;
		animation: downloadArrow 1s linear infinite;
		animation-play-state: paused;
	}

	.buttonDownload:hover:before {
		border-color: #cdefbd;
	}

	.buttonDownload:hover:after {
		border-top-color: #cdefbd;
		animation-play-state: running;
	}

	@keyframes downloadArrow {
		0% {
			margin-top: -7px;
			opacity: 1;
		}
		0.001% {
			margin-top: -15px;
			opacity: 0.4;
		}
		50% {
			opacity: 1;
		}
		100% {
			margin-top: 0;
			opacity: 0.4;
		}
	}
`

export default DowloandsButton
