import { useMemo, useState } from 'react'
import './App.css'

const games = [
  {
    title: 'Cyber Stadium',
    mode: 'Battle Royale',
    online: 4213,
    ping: 18,
    status: 'Live',
    slug: 'cyber',
    tag: 'Action',
    accent: '#22d3ee',
  },
  {
    title: 'Desert Runner',
    mode: 'Runner',
    online: 2107,
    ping: 22,
    status: 'Live',
    slug: 'desert',
    tag: 'Arcade',
    accent: '#f97316',
  },
  {
    title: 'Mini Stack (demo)',
    mode: 'Clicker',
    online: 128,
    ping: 5,
    status: 'Demo',
    slug: 'mini',
    tag: 'Casual',
    accent: '#a855f7',
  },
  {
    title: 'Sorting Xmas Balls',
    mode: 'Balls',
    online: 2310,
    ping: 19,
    status: 'Live',
    url: 'https://html5.gamedistribution.com/a508edbaeb1d4213aecebbe4115670c2/index.html',
    tag: 'Balls',
    accent: '#38bdf8',
  },
  {
    title: 'Stick War Saga',
    mode: 'Action',
    online: 1804,
    ping: 23,
    status: 'Live',
    url: 'https://html5.gamedistribution.com/334714f0c010454faf2248793ba893be/index.html',
    tag: 'Action',
    accent: '#f97316',
  },
  {
    title: 'Athena Match 2',
    mode: 'Puzzle',
    online: 1420,
    ping: 16,
    status: 'New',
    url: 'https://html5.gamedistribution.com/4d700fb4689d48e2ad0f5072300cdb11/index.html',
    tag: 'Puzzle',
    accent: '#f472b6',
  },
  {
    title: 'Snow Ball Racing',
    mode: 'Arcade',
    online: 990,
    ping: 21,
    status: 'Live',
    url: 'https://html5.gamedistribution.com/061faa6d2cd34e89a507fd435d040946/index.html',
    tag: 'Arcade',
    accent: '#22c55e',
  },
  {
    title: 'Word Connect Puzzle',
    mode: 'Shooter',
    online: 1890,
    ping: 20,
    status: 'Hot',
    url: 'https://html5.gamedistribution.com/1b392a6ff2514ce48a70c90b349e5de5/index.html',
    tag: 'Action',
    accent: '#7dd3fc',
  },
  {
    title: 'Bubble Shooter HD 3',
    mode: 'Racing',
    online: 1650,
    ping: 18,
    status: 'Live',
    url: 'https://html5.gamedistribution.com/03e358cc3331480795d74a55e4283686/index.html',
    tag: 'Bubble',
    accent: '#fb923c',
  },
  {
    title: 'Magic and Wizards Mahjong',
    mode: 'Puzzle',
    online: 1320,
    ping: 17,
    status: 'New',
    url: 'https://html5.gamedistribution.com/769f3b2834b94b7ea57a8aa899d93272/index.html',
    tag: 'Puzzle',
    accent: '#f472b6',
  },
  {
    title: 'Twilight Solitaire TriPeaks',
    mode: 'Survival',
    online: 2205,
    ping: 23,
    status: 'Live',
    url: 'https://html5.gamedistribution.com/91eb12a4669543ea825a9e2469143b93/index.html',
    tag: 'Action',
    accent: '#f97316',
  },
  {
    title: 'Tropical Match 2',
    mode: 'Arcade',
    online: 980,
    ping: 15,
    status: 'Live',
    url: 'https://html5.gamedistribution.com/59719ccbc7764864bae2c4c7aea820b6/index.html',
    tag: 'Arcade',
    accent: '#34d399',
  },
  {
    title: 'Italian Brainrot Baby Clicker',
    mode: 'Runner',
    online: 1760,
    ping: 19,
    status: 'Hot',
    url: 'https://html5.gamedistribution.com/fe3c5c9d90f24f10a9e01cca22f5243f/index.html',
    tag: 'Action',
    accent: '#c084fc',
  },
  {
    title: 'Two Stunt Racers',
    mode: 'Puzzle',
    online: 1210,
    ping: 12,
    status: 'Live',
    url: 'https://html5.gamedistribution.com/bb65344d29f74da1bd1f41500d8b1dc2/index.html',
    tag: 'Puzzle',
    accent: '#22d3ee',
  },
  {
    title: 'Bubble Shooter Temple Jewels',
    mode: 'Racing',
    online: 2010,
    ping: 17,
    status: 'Top',
    url: 'https://html5.gamedistribution.com/8b43e10dbeb84f7c90e848fb8109d489/index.html',
    tag: 'Racing',
    accent: '#facc15',
  },
  {
    title: 'Vice City Driver',
    mode: 'Arcade',
    online: 1540,
    ping: 21,
    status: 'Live',
    url: 'https://html5.gamedistribution.com/b450025a35a0458493e9de730a67aff5/index.html',
    tag: 'Arcade',
    accent: '#fb7185',
  },
  {
    title: 'Tales of Lagoona',
    mode: 'Arcade',
    online: 1520,
    ping: 24,
    status: 'Live',
    url: 'https://html5.gamedistribution.com/93630196f06f465995df303524c3e706/index.html',
    tag: 'Arcade',
    accent: '#22c55e',
  },
  {
    title: 'Neon Drift',
    mode: 'Racing',
    online: 980,
    ping: 14,
    status: 'Live',
    slug: 'cyber',
    tag: 'Racing',
    accent: '#38bdf8',
  },
  {
    title: 'Puzzle Bloom',
    mode: 'Puzzle',
    online: 640,
    ping: 12,
    status: 'Live',
    slug: 'mini',
    tag: 'Puzzle',
    accent: '#f472b6',
  },
]

const tags = ['Barchasi', 'Action', 'Arcade', 'Casual', 'Puzzle', 'Racing']

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

  const handleSend = () => {
    if (!phone || phone.replace(/\D/g, '').length < 9) {
      setFlash('Telefon raqamni to‘liq kiriting')
      return
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    setSentCode(code)
    setStage('otp')
    setFlash(`SMS kod jo‘natildi. Demo uchun kod: ${code}`)
  }

  const handleVerify = () => {
    if (otp === sentCode) {
      setUser({ phone, role: 'Player' })
      setStage('play')
      setFlash('Tasdiqlandi. O‘yinlarni boshlash mumkin.')
    } else {
      setFlash('Kod noto‘g‘ri. Qayta urinib ko‘ring.')
    }
  }

  const handleResend = () => {
    if (!sentCode) return handleSend()
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    setSentCode(code)
    setFlash(`Yangi kod: ${code}`)
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
                <button onClick={handleSend}>SMS kod jo‘natish</button>
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
                <button onClick={handleVerify}>Tasdiqlash</button>
              </div>
              <div className="hint linkish" onClick={handleResend}>
                Kod kelmadimi? Qayta yuborish
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
