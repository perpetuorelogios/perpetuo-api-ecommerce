import 'dotenv/config'
import { app } from './infrastructure/http/server.js'

const port = Number(process.env.PORT) || 3000

app.listen({ port, host: '0.0.0.0' }, (error) => {
  if (error) {
    console.error('Failed to start API', {
      message: error.message,
      stack: error.stack,
      port,
    })
    process.exit(1)
  }

  console.log(`🚀 API running on ${port}`)
})
