import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 8000
const UCELL_TOKEN = process.env.UCELL_TOKEN || process.env.VITE_UCELL_TOKEN
const UCELL_BASE = process.env.UCELL_BASE || 'https://auth.ucell.uz:8880'
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'
const POSTGRES_URI = process.env.POSTGRES_URI

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(',').map((o) => o.trim()),
  }),
)

// Oddiy loglar: lokalda xatolarni tez ko‘rish uchun
app.use((req, res, next) => {
  if (req.path.startsWith('/api/ucell')) {
    const safeBody = { ...req.body }
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, safeBody)
  }
  next()
})

const distPath = path.join(__dirname, 'dist')
app.use(express.static(distPath))

const buildUrl = (pathPart) => `${UCELL_BASE}${pathPart}`
const logUpstream = (label, status, body) => {
  const preview = typeof body === 'string' ? body.slice(0, 400) : JSON.stringify(body)?.slice(0, 400)
  console.log(`[${new Date().toISOString()}] UCELL ${label} -> status ${status} body:`, preview)
}

// Postgres init
let pool = null
async function initDb() {
  if (!POSTGRES_URI) {
    console.warn('POSTGRES_URI topilmadi, DB saqlash o‘chirilgan.')
    return
  }
  pool = new pg.Pool({ connectionString: POSTGRES_URI })
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ucell_orders (
      id SERIAL PRIMARY KEY,
      order_id TEXT UNIQUE,
      msisdn TEXT,
      origin_order_id TEXT,
      created_at TIMESTAMP,
      price TEXT,
      status TEXT,
      validated_at TIMESTAMP,
      message TEXT,
      otp_code TEXT,
      otp_last_at TIMESTAMP,
      created_at_local TIMESTAMP DEFAULT now()
    );
  `)
  // If jadval allaqachon bor bo‘lsa, ustunlar mavjudligini ta’minlash
  await pool.query(`DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ucell_orders' AND column_name='otp_code') THEN
      ALTER TABLE ucell_orders ADD COLUMN otp_code TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ucell_orders' AND column_name='otp_last_at') THEN
      ALTER TABLE ucell_orders ADD COLUMN otp_last_at TIMESTAMP;
    END IF;
  END$$;`)
  console.log('Postgres ready')
}
initDb().catch((err) => console.error('DB init error', err))

async function saveOrder(order) {
  if (!pool) return
  const { order_id, msisdn, origin_order_id, created_at, price } = order
  const status = order.status || 'ok'
  await pool.query(
    `INSERT INTO ucell_orders (order_id, msisdn, origin_order_id, created_at, price, status)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (order_id) DO UPDATE
       SET msisdn = EXCLUDED.msisdn,
           origin_order_id = EXCLUDED.origin_order_id,
           created_at = EXCLUDED.created_at,
           price = EXCLUDED.price,
           status = EXCLUDED.status`,
    [order_id, msisdn, origin_order_id, created_at, price, status],
  )
}

async function markValidated(order_id, message = '') {
  if (!pool) return
  await pool.query(
    `UPDATE ucell_orders SET validated_at = now(), message = $2 WHERE order_id = $1`,
    [order_id, message],
  )
}

async function saveOtp(order_id, otp) {
  if (!pool) return
  await pool.query(
    `UPDATE ucell_orders SET otp_code = $2, otp_last_at = now() WHERE order_id = $1`,
    [order_id, otp],
  )
}

app.post('/api/ucell/open', async (req, res) => {
  try {
    const { msisdn, origin_order_id, language = 'uz' } = req.body || {}
    if (!UCELL_TOKEN) return res.status(500).json({ status: 'error', message: 'UCELL_TOKEN topilmadi' })
    if (!msisdn || String(msisdn).replace(/\D/g, '').length !== 12) {
      return res.status(400).json({ status: 'error', message: 'msisdn noto‘g‘ri' })
    }
    const payload = {
      msisdn,
      token: UCELL_TOKEN,
      origin_order_id: origin_order_id || (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
      language,
    }
    const upstream = await fetch(buildUrl('/v1/order/open'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const text = await upstream.text()
    const data = safeJson(text)
    logUpstream('open', upstream.status, data || text)
    if (!upstream.ok) {
      console.error('UCELL open error', upstream.status, text)
      return res.status(502).json({ status: 'error', message: `ucell open failed ${upstream.status}`, body: data || text })
    }
    if (data?.order?.order_id) {
      saveOrder(data.order).catch((err) => console.error('DB save order error', err))
    }
    return res.json(data || {})
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message })
  }
})

app.post('/api/ucell/validate', async (req, res) => {
  try {
    const { order_id, password } = req.body || {}
    if (!order_id || !password) return res.status(400).json({ status: 'error', message: 'order_id va password talab qilinadi' })
    const upstream = await fetch(buildUrl('/v1/order/validate-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id, password }),
    })
    const text = await upstream.text()
    const data = safeJson(text)
    logUpstream('validate', upstream.status, data || text)
    if (!upstream.ok) {
      console.error('UCELL validate error', upstream.status, text)
      return res.status(502).json({ status: 'error', message: `ucell validate failed ${upstream.status}`, body: data || text })
    }
    if (data?.status === 'ok') {
      markValidated(order_id, data.message || '').catch((err) => console.error('DB mark validate error', err))
      saveOtp(order_id, password).catch((err) => console.error('DB save otp error', err))
    }
    return res.json(data || {})
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message })
  }
})

app.get('/api/ucell/resend', async (req, res) => {
  try {
    const { order_id, language = 'uz' } = req.query
    if (!order_id) return res.status(400).json({ status: 'error', message: 'order_id talab qilinadi' })
    const url = new URL(buildUrl('/v1/order/resend-password'))
    url.searchParams.set('order_id', order_id)
    url.searchParams.set('language', language)
    const upstream = await fetch(url, { method: 'GET' })
    const text = await upstream.text()
    const data = safeJson(text)
    logUpstream('resend', upstream.status, data || text)
    if (!upstream.ok) {
      console.error('UCELL resend error', upstream.status, text)
      return res.status(502).json({ status: 'error', message: `ucell resend failed ${upstream.status}`, body: data || text })
    }
    return res.json(data || {})
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message })
  }
})

function safeJson(str) {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
