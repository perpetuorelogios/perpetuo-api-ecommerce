import 'dotenv/config'
import { app } from './infrastructure/http/server'

const port = Number(process.env.PORT) || 3000

app.listen({ port }, () => {
  console.log(`🚀 API running on ${port}`)
})
