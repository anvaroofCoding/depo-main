'use client'

import {
	BookOutlined,
	DownloadOutlined,
	MessageOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Row, Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function CallToAction() {
	return (
		<div className='py-16 bg-gradient-to-r from-accent/10 to-accent/5'>
			<div className='max-w-4xl mx-auto px-6'>
				<Card className='text-center shadow-lg border-0'>
					<div className='py-8'>
						<Title level={2} className='!mb-4'>
							Ready to Get Started?
						</Title>
						<Paragraph className='text-lg text-muted-foreground max-w-2xl mx-auto !mb-8'>
							Download our program now and start your journey to increased
							productivity. Join thousands of satisfied users who have
							transformed their workflow.
						</Paragraph>

						<Row gutter={[16, 16]} justify='center'>
							<Col xs={24} sm={8}>
								<Button
									type='primary'
									size='large'
									icon={<DownloadOutlined />}
									className='w-full bg-accent hover:bg-accent/90 border-accent h-12'
								>
									Download Now
								</Button>
							</Col>
							<Col xs={24} sm={8}>
								<Button
									size='large'
									icon={<BookOutlined />}
									className='w-full h-12'
								>
									View Documentation
								</Button>
							</Col>
							<Col xs={24} sm={8}>
								<Button
									size='large'
									icon={<MessageOutlined />}
									className='w-full h-12'
								>
									Get Support
								</Button>
							</Col>
						</Row>

						<div className='mt-8 pt-6 border-t border-border'>
							<Paragraph className='text-sm text-muted-foreground !mb-0'>
								Free trial available • No credit card required • 30-day
								money-back guarantee
							</Paragraph>
						</div>
					</div>
				</Card>
			</div>
		</div>
	)
}
