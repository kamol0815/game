import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 8000
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'
const SMS_API_URL = process.env.SMS_API_URL || 'http://94.158.51.173:8080/video/sms_send_code.php'
const SPECIAL_PREFIXES = new Set(['93', '94', '50'])

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(',').map((o) => o.trim()),
  }),
)

const distPath = path.join(__dirname, 'dist')
app.use(express.static(distPath))

function safeJson(str) {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

const normalizeMsisdn = (value = '') => String(value).replace(/\D/g, '')
const isSpecialSubscriber = (msisdn) => {
  const normalized = normalizeMsisdn(msisdn)
  return normalized.startsWith('998') && SPECIAL_PREFIXES.has(normalized.slice(3, 5))
}

function normalizeRemoteStatus(payload) {
  if (payload === null || payload === undefined) return ''
  if (typeof payload === 'string') return payload.trim().toLowerCase().replace(/[_-]+/g, ' ')
  if (typeof payload === 'number' || typeof payload === 'boolean') return String(payload).trim().toLowerCase()
  if (typeof payload === 'object') {
    for (const key of ['status', 'result', 'response', 'message', 'data']) {
      if (payload[key] !== undefined) {
        const normalized = normalizeRemoteStatus(payload[key])
        if (normalized) return normalized
      }
    }
  }
  return ''
}

app.get('/api/subscription/check', async (req, res) => {
  try {
    const msisdn = normalizeMsisdn(req.query.msisdn)
    if (!msisdn) {
      return res.status(400).json({ error: true, message: 'msisdn required' })
    }

    if (!isSpecialSubscriber(msisdn)) {
      return res.json({
        ok: true,
        msisdn,
        specialSubscriber: false,
        subscribed: true,
        status: 'bypass',
      })
    }

    const url = new URL(SMS_API_URL)
    url.searchParams.set('action', 'sub_status_game')
    url.searchParams.set('msisdn', msisdn)

    const upstream = await fetch(url)
    const text = await upstream.text()
    const data = safeJson(text)
    const raw = data ?? text
    const status = normalizeRemoteStatus(raw)

    if (!upstream.ok) {
      return res.status(502).json({ error: true, message: 'subscription check failed', body: raw })
    }

    return res.json({
      ok: true,
      msisdn,
      specialSubscriber: true,
      subscribed: status === 'ok',
      status: status || 'unknown',
      raw,
    })
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message })
  }
})

app.get('/api/subscription/send-sms', async (req, res) => {
  try {
    const msisdn = normalizeMsisdn(req.query.msisdn)
    if (!msisdn) {
      return res.status(400).json({ error: true, message: 'msisdn required' })
    }

    if (!isSpecialSubscriber(msisdn)) {
      return res.status(400).json({
        error: true,
        message: 'subscription sms faqat 93, 94 va 50 prefikslar uchun ishlaydi',
      })
    }

    const url = new URL(SMS_API_URL)
    url.searchParams.set('action', 'sms_game')
    url.searchParams.set('msisdn', msisdn)

    const upstream = await fetch(url)
    const text = await upstream.text()
    const data = safeJson(text)
    const raw = data ?? text

    if (!upstream.ok) {
      return res.status(502).json({ error: true, message: 'sms send failed', body: raw })
    }

    return res.json({
      ok: true,
      msisdn,
      sent: true,
      status: normalizeRemoteStatus(raw) || 'sent',
      raw,
    })
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message })
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
