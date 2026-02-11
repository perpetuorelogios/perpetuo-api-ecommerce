import { PrismaClient } from '../../generated/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const ensureSslMode = (url?: string) => {
	if (!url) return url
	try {
		const parsed = new URL(url)
		if (!parsed.searchParams.get('sslmode')) {
			parsed.searchParams.set('sslmode', 'require')
		}
		return parsed.toString()
	} catch {
		if (url.includes('sslmode=')) return url
		const separator = url.includes('?') ? '&' : '?'
		return `${url}${separator}sslmode=require`
	}
}

const connectionString = ensureSslMode(process.env.DATABASE_URL)
const adapter = new PrismaPg({ connectionString })
export const prisma = new PrismaClient({ adapter })