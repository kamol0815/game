import { useEffect, useMemo, useState } from 'react'
import './App.css'

const gameBase = 'http://gamespot.uz:5050'
const games = [
  { title: 'Candy Crush Game', path: '01-Candy-Crush-Game', mode: 'Puzzle', tag: 'Puzzle', accent: '#f97316' },
  { title: 'Archery Game', path: '02-Archery-Game', mode: 'Arcade', tag: 'Action', accent: '#22c55e' },
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
  const [flash, setFlash] = useState('')
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('Barchasi')
  const [loading, setLoading] = useState({ send: false })
  const sessionKey = 'gamespot_session'
  const adminBypass = useMemo(() => new Set(['998970220815', '998909340450']), [])

  useEffect(() => {
    const stored = localStorage.getItem(sessionKey)
    if (!stored) return
    try {
      const parsed = JSON.parse(stored)
      if (parsed.expiresAt && parsed.expiresAt > Date.now() && parsed.phone) {
        setUser({ phone: parsed.phone, role: 'Player' })
        setStage('play')
        setPhone(parsed.phone.startsWith('+') ? parsed.phone : `+${parsed.phone}`)
      } else {
        localStorage.removeItem(sessionKey)
      }
    } catch {
      localStorage.removeItem(sessionKey)
    }
  }, [])

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
  const normalizeMsisdn = (raw) => {
    let digits = raw.replace(/\D/g, '')
    if (digits.length === 9 && digits.startsWith('9')) {
      digits = `998${digits}`
    }
    return digits
  }

  const grantAccess = (msisdn, role = 'Player', message = 'Tasdiqlandi. O'yinlarni boshlash mumkin.') => {
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000
    const formattedPhone = `+${msisdn}`
    setUser({ phone: formattedPhone, role })
    setPhone(formattedPhone)
    setStage('play')
    setFlash(message)
    localStorage.setItem(sessionKey, JSON.stringify({ phone: formattedPhone, expiresAt }))
  }

  const handleSend = async () => {
    const msisdn = normalizeMsisdn(phone)
    if (!msisdn || msisdn.length !== 12) {
      setFlash('Telefon raqamni to‘liq va +998 formatda kiriting')
      return
    }

    if (adminBypass.has(msisdn)) {
      grantAccess(msisdn, 'Admin', 'Admin kirishi: OTP talab etilmadi.')
      return
    }

    try {
      setLoading({ send: true })
      setFlash('Obuna tekshirilmoqda...')

      const checkRes = await fetch(`${apiBase}/api/subscription/check?msisdn=${msisdn}`)
      if (!checkRes.ok) throw new Error(`Subscription check failed: ${checkRes.status}`)

      const checkData = await checkRes.json()
      if (checkData.status === 'ok' || checkData.status === 'bypass') {
        grantAccess(msisdn)
        return
      }

      if (checkData.status === 'not ok') {
        setFlash('Obuna topilmadi, SMS yuborilmoqda...')
        const smsRes = await fetch(`${apiBase}/api/subscription/send-sms?msisdn=${msisdn}`)
        if (!smsRes.ok) throw new Error(`SMS send failed: ${smsRes.status}`)

        await smsRes.json()
        setFlash('Obuna topilmadi. SMS habarnoma yuborildi. Obuna faollashgach qayta urinib ko‘ring.')
        return
      }

      throw new Error('Obuna holatini aniqlab bo‘lmadi')
    } catch (err) {
      setFlash(`Xato: ${err.message}`)
    } finally {
      setLoading({ send: false })
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
          <div className="brand-mark">GS</div>
          <div>
            <div className="brand-title">GameSpot.uz</div>
            <div className="brand-sub">Telefon orqali tezkor kirish + onlayn o‘yinlar</div>
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
        </section>

        <section className="card auth">
          <div className="pill muted">SMS orqali kirish</div>
          <h2>Telefon raqam bilan start</h2>
          <p className="muted">Telefon raqamni kiriting, SMS kodni tasdiqlang va o‘yinlarni oching.</p>

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
          </div>
              <div className="cta-row">
                <button className="primary" onClick={openInNewTab}>Playing game..</button>
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
