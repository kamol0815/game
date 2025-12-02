import { useMemo, useState } from 'react'
import './App.css'

const gameBase = 'http://gamespot.uz:5050'
const games = [
  { title: 'Candy Crush Game', path: '01-Candy-Crush-Game', mode: 'Puzzle', tag: 'Puzzle', accent: '#f97316' },
  { title: 'Archery Game', path: '02-Archery-Game', mode: 'Arcade', tag: 'Action', accent: '#22c55e' },
  { title: 'Speed Typing Game', path: '03-Speed-Typing-Game', mode: 'Typing', tag: 'Arcade', accent: '#38bdf8' },
  { title: 'Breakout Game', path: '04-Breakout-Game', mode: 'Arcade', tag: 'Arcade', accent: '#facc15' },
  { title: 'Minesweeper Game', path: '05-Minesweeper-Game', mode: 'Logic', tag: 'Puzzle', accent: '#fb7185' },
  { title: 'Tower Blocks', path: '06-Tower-Blocks', mode: 'Stack', tag: 'Arcade', accent: '#a855f7' },
  { title: 'Ping Pong Game', path: '07-Ping-Pong-Game', mode: 'Sports', tag: 'Arcade', accent: '#34d399' },
  { title: 'Tetris Game', path: '08-Tetris-Game', mode: 'Puzzle', tag: 'Puzzle', accent: '#22d3ee' },
  { title: 'Tilting Maze Game', path: '09-Tilting-Maze-Game', mode: 'Maze', tag: 'Arcade', accent: '#fb923c' },
  { title: 'Memory Card Game', path: '10-Memory-Card-Game', mode: 'Memory', tag: 'Puzzle', accent: '#c084fc' },
  { title: 'Rock Paper Scissors', path: '11-Rock-Paper-Scissors', mode: 'Classic', tag: 'Arcade', accent: '#f472b6' },
  { title: 'Type Number Guessing', path: '12-Type-Number-Guessing-Game', mode: 'Typing', tag: 'Puzzle', accent: '#22c55e' },
  { title: 'Tic Tac Toe', path: '13-Tic-Tac-Toe', mode: 'Classic', tag: 'Arcade', accent: '#38bdf8' },
  { title: 'Snake Game', path: '14-Snake-Game', mode: 'Arcade', tag: 'Arcade', accent: '#f97316' },
  { title: 'Connect Four Game', path: '15-Connect-Four-Game', mode: 'Strategy', tag: 'Puzzle', accent: '#22d3ee' },
  { title: 'Insect Catch Game', path: '16-Insect-Catch-Game', mode: 'Arcade', tag: 'Arcade', accent: '#34d399' },
  { title: 'Typing Game', path: '17-Typing-Game', mode: 'Typing', tag: 'Puzzle', accent: '#a855f7' },
  { title: 'Hangman Game', path: '18-Hangman-Game', mode: 'Classic', tag: 'Puzzle', accent: '#fb7185' },
  { title: 'Flappy Bird Game', path: '19-Flappy-Bird-Game', mode: 'Arcade', tag: 'Arcade', accent: '#facc15' },
  { title: 'Crossy Road Game', path: '20-Crossy-Road-Game', mode: 'Arcade', tag: 'Arcade', accent: '#22c55e' },
  { title: '2048 Game', path: '21-2048-Game', mode: 'Puzzle', tag: 'Puzzle', accent: '#f472b6' },
  { title: 'Dice Roll Simulator', path: '22-Dice-Roll-Simulator', mode: 'Simulator', tag: 'Arcade', accent: '#38bdf8' },
  { title: 'Shape Clicker Game', path: '23-Shape-Clicker-Game', mode: 'Arcade', tag: 'Arcade', accent: '#34d399' },
  { title: 'Typing Game 2', path: '24-Typing-Game', mode: 'Typing', tag: 'Puzzle', accent: '#c084fc' },
  { title: 'Speak Number Guessing', path: '25-Speak-Number-Guessing-Game', mode: 'Voice', tag: 'Puzzle', accent: '#fb923c' },
  { title: 'Fruit Slicer Game', path: '26-Fruit-Slicer-Game', mode: 'Arcade', tag: 'Arcade', accent: '#22d3ee' },
  { title: 'Quiz Game', path: '27-Quiz-Game', mode: 'Trivia', tag: 'Puzzle', accent: '#facc15' },
  { title: 'Emoji Catcher Game', path: '28-Emoji-Catcher-Game', mode: 'Arcade', tag: 'Arcade', accent: '#22c55e' },
  { title: 'Whack-A-Mole Game', path: '29-Whack-A-Mole-Game', mode: 'Arcade', tag: 'Arcade', accent: '#a855f7' },
  { title: 'Simon Says Game', path: '30-Simon-Says-Game', mode: 'Memory', tag: 'Puzzle', accent: '#fb7185' },
].map((g) => ({
  ...g,
  online: Math.floor(800 + Math.random() * 3200),
  ping: Math.floor(12 + Math.random() * 12),
  status: 'Live',
  url: `${gameBase}/${g.path}/`,
}))

const tags = ['Barchasi', 'Action', 'Arcade', 'Puzzle', 'Typing', 'Memory', 'Strategy']

function App() {
  const [selectedGame, setSelectedGame] = useState(games[0])
  const [stage, setStage] = useState('phone')
  const [phone, setPhone] = useState('+998')
  const [otp, setOtp] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [flash, setFlash] = useState('')
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('Barchasi')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState({ send: false, verify: false, resend: false })

  const heroTitle = useMemo(() => {
    if (stage === 'play' && user) return `${user.phone} — start o'yin!`
    return "Onlayn o'yinlar universumi"
  }, [stage, user])

  const filteredGames = useMemo(() => {
    const term = search.toLowerCase()
    return games.filter((g) => {
      const tagOk = activeTag === 'Barchasi' || g.tag === activeTag
      const textOk = g.title.toLowerCase().includes(term) || g.mode.toLowerCase().includes(term)
      return tagOk && textOk
    })
  }, [search, activeTag])

  const apiBase = import.meta.env.VITE_API_BASE || ''
  const normalizeMsisdn = (raw) => raw.replace(/\D/g, '')

  const handleSend = async () => {
    const msisdn = normalizeMsisdn(phone)
    if (!msisdn || msisdn.length !== 12) {
      setFlash('Telefon raqamni to‘liq va +998 formatda kiriting')
      return
    }
    try {
      setLoading((p) => ({ ...p, send: true }))
      setFlash('SMS jo‘natilmoqda...')
      const res = await fetch(`${apiBase}/api/ucell/open`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          msisdn,
          origin_order_id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
          language: 'uz',
        }),
      })
      if (!res.ok) throw new Error(`Open order failed: ${res.status}`)
      const data = await res.json()
      if (data.status !== 'ok' || !data.order?.order_id) {
        throw new Error('Order ID olinmadi')
      }
      setOrderId(data.order.order_id)
      setStage('otp')
      setFlash(`SMS yuborildi. Order ID: ${data.order.order_id}`)
    } catch (err) {
      setFlash(`Xato: ${err.message}`)
    } finally {
      setLoading((p) => ({ ...p, send: false }))
    }
  }

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      setFlash('SMS kodni kiriting')
      return
    }
    if (!orderId) {
      setFlash('Order ID topilmadi. Qayta yuboring.')
      return
    }
    try {
      setLoading((p) => ({ ...p, verify: true }))
      setFlash('Tasdiqlanmoqda...')
      const res = await fetch(`${apiBase}/api/ucell/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          password: otp,
        }),
      })
      if (!res.ok) throw new Error(`Validate failed: ${res.status}`)
      const data = await res.json()
      if (data.status === 'ok') {
        setUser({ phone, role: 'Player' })
        setStage('play')
        setFlash('Tasdiqlandi. O‘yinlarni boshlash mumkin.')
      } else {
        throw new Error(data.message || 'Tasdiqlash muvaffaqiyatsiz')
      }
    } catch (err) {
      setFlash(`Xato: ${err.message}`)
    } finally {
      setLoading((p) => ({ ...p, verify: false }))
    }
  }

  const handleResend = async () => {
    if (!orderId) {
      setFlash('Order ID topilmadi. Qayta yuborishdan oldin telefonni kiriting.')
      return handleSend()
    }
    try {
      setLoading((p) => ({ ...p, resend: true }))
      setFlash('Kod qayta yuborilmoqda...')
      const url = new URL(`${apiBase}/api/ucell/resend`, window.location.origin)
      url.searchParams.set('order_id', orderId)
      url.searchParams.set('language', 'uz')
      const res = await fetch(url.toString(), { method: 'GET' })
      if (!res.ok) throw new Error(`Resend failed: ${res.status}`)
      const data = await res.json()
      if (data.status === 'ok') {
        setFlash('Yangi kod yuborildi.')
      } else {
        throw new Error(data.message || 'Qayta yuborishda xato')
      }
    } catch (err) {
      setFlash(`Xato: ${err.message}`)
    } finally {
      setLoading((p) => ({ ...p, resend: false }))
    }
  }

  const handleSelectGame = (game) => {
    setSelectedGame(game)
    if (stage !== 'play') {
      setFlash('Avval telefon raqamini tasdiqlang, keyin o‘yinlar ochiladi.')
    }
  }

  const openInNewTab = () => {
    if (!selectedGame) return
    const url = selectedGame.url || `/games/${selectedGame.slug}/index.html`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page">
      <div className="bg-glow glow-a" />
      <div className="bg-glow glow-b" />
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">GX</div>
          <div>
            <div className="brand-title">GameX Play</div>
            <div className="brand-sub">Telefon orqali tezkor kirish + online o‘yinlar</div>
          </div>
        </div>
        <div className="pill">
          <span className="dot" />
          O&apos;yinchilar uchun
        </div>
      </header>

      <main className="layout">
        <section className="card hero">
          <div className="label">Yangi davr</div>
          <h1>{heroTitle}</h1>
          <p>
            Telefon raqamini kiriting, SMS orqali tasdiqlang va darhol o‘yinlarga kiring.
            Hech qanday ortiqcha statistika — faqat ro‘yxatdan o‘tish va o‘ynash.
          </p>
          <div className="tagline">
            <span className="dot small" />
            Login → SMS → O‘yin
          </div>
        </section>

        <section className="card auth">
          <div className="pill muted">SMS orqali kirish</div>
          <h2>Telefon raqam bilan start</h2>
          <p className="muted">
            Telefon raqamni kiriting, SMS kodni tasdiqlang va o‘yinlarni oching. Bu UI to‘g‘ridan
            to‘g‘ri foydalanuvchilar uchun.
          </p>

            {stage === 'phone' && (
              <div className="form">
                <label>Telefon raqam</label>
                <div className="input-wrap">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                  />
                  <button onClick={handleSend} disabled={loading.send}>
                    {loading.send ? 'Yuborilmoqda...' : 'SMS kod jo‘natish'}
                  </button>
                </div>
                <div className="hint">Demo rejimida kod shu yerning o‘zida ko‘rinadi.</div>
              </div>
            )}

            {stage === 'otp' && (
              <div className="form">
                <label>SMS kod</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="4 xonali kod"
                  />
                  <button onClick={handleVerify} disabled={loading.verify}>
                    {loading.verify ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
                  </button>
                </div>
                <div className="hint linkish" onClick={loading.resend ? undefined : handleResend}>
                  {loading.resend ? 'Yuborilmoqda...' : 'Kod kelmadimi? Qayta yuborish'}
                </div>
              </div>
            )}

          {flash && <div className="flash">{flash}</div>}
        </section>

        <section className={`card player ${stage === 'play' ? '' : 'locked'}`}>
          {stage !== 'play' ? (
            <div className="lock-banner">Avval telefon raqamini tasdiqlang, keyin o‘yinlar ochiladi.</div>
          ) : null}
          <div className="pill muted">Kutubxona</div>
          <h2>O&apos;yinlarni tanlang</h2>
          <p className="muted">Qidiruv, janrlar, live indikatorlar va yorqin preview bilan qulay katalog.</p>

          <div className="filters">
            <div className="search">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="O‘yin yoki janrni qidiring"
              />
            </div>
          </div>

          <div className="player-layout">
            <div className="game-list">
              {filteredGames.map((g) => (
                <div
                  key={g.title}
                  className={`game-tile ${selectedGame.title === g.title ? 'active' : ''}`}
                  onClick={() => handleSelectGame(g)}
                >
                  <div className="tile-art" style={{ background: g.accent }}>
                    <span className="pill-soft">{g.tag}</span>
                  </div>
                  <div className="tile-body">
                    <div className="game-title">{g.title}</div>
                    <div className="muted small">{g.mode}</div>
                    <div className="meta-row">
                      <span className="pill-soft">{g.online} online</span>
                      <span className="pill-soft">{g.ping} ms</span>
                      <span className="status">{g.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="player-pane">
              <div className="row tight">
                <div>
                  <div className="row-title">{selectedGame.title}</div>
                  <div className="muted">{selectedGame.mode} · {selectedGame.tag}</div>
                </div>
                <div className="row-meta">
                  <span>{selectedGame.online} online</span>
                  <span className="pill-soft">{selectedGame.ping} ms</span>
                  <span className="status">{selectedGame.status}</span>
                </div>
              </div>
              <div className="cta-row">
                <button className="primary" onClick={openInNewTab}>Yangi oynada ochish</button>
                <button className="ghost" onClick={() => handleSelectGame(selectedGame)}>Inline</button>
              </div>
              <div
                className="poster"
                style={{
                  background: `radial-gradient(circle at 20% 20%, ${selectedGame.accent}, transparent 65%), linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
                }}
              >
                <div className="poster-chip">{selectedGame.tag}</div>
                <div className="poster-title">{selectedGame.title}</div>
                <div className="poster-sub">{selectedGame.mode}</div>
              </div>
              <div className="game-frame">
                <iframe
                  title="O'yin"
                  src={selectedGame.url || `/games/${selectedGame.slug}/index.html`}
                  allow="fullscreen; autoplay; clipboard-read; clipboard-write"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
