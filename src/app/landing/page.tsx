'use client';

import { useEffect, useMemo, type CSSProperties } from 'react';
import { Cinzel, Cinzel_Decorative, Crimson_Pro } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { META_PIXEL_ID } from '@/app/meta-pixel';
import { ROUTES } from '@/util/paths';
import { useAuth } from '@/hooks/use-auth';

type ParticleStyle = CSSProperties & {
  ['--drift']?: string;
};

const cinzelDecorative = Cinzel_Decorative({
  weight: ['700', '900'],
  subsets: ['latin'],
});

const cinzel = Cinzel({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
});

const crimsonPro = Crimson_Pro({
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

type Particle = {
  left: number;
  duration: number;
  delay: number;
  drift: number;
  size: number;
  opacity: number;
};

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const ticketProductId = process.env.NEXT_PUBLIC_GAME_TICKET_PRODUCT_ID;
  const albumProductId = process.env.NEXT_PUBLIC_ALBUM_BUNDLE_PRODUCT_ID;
  const ticketPath = ticketProductId
    ? ROUTES.SHOP.DETAILS.replace(':id', ticketProductId)
    : ROUTES.SHOP.HOME;
  const albumPath = albumProductId
    ? ROUTES.SHOP.DETAILS.replace(':id', albumProductId)
    : ROUTES.SHOP.HOME;

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 40 }).map(() => ({
      left: Math.random() * 100,
      duration: 6 + Math.random() * 12,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 200,
      size: 1 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.5,
    }));
  }, []);

  const startEnterFieldFlow = (nextPath: string) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('bb_next', nextPath);
    }
    // If authenticated, go directly to the destination
    if (isAuthenticated) {
      router.push(nextPath);
      return;
    }
    // Otherwise, go to sign up (auth success will redirect to bb_next)
    router.push(ROUTES.AUTH.SIGN_UP);
  };

  const trackTicketClick = (placement: string) => {
    if (!META_PIXEL_ID || typeof window === 'undefined') {
      return;
    }

    const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
    fbq?.('trackCustom', 'GetYourTicketClick', { placement });
  };

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.bb-root .reveal'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`bb-root ${crimsonPro.className} ${cinzel.className} ${cinzelDecorative.className}`}>
      <div className="announce">
        <span className="announce-inner">
          ◈ &nbsp; THE BOX OPENS ONCE. ENTER AT YOUR OWN RISK. &nbsp; ◈ &nbsp; WHOEVER SEES THE CONTENT OF THE BOX CANNOT LEAVE THE FIELD. &nbsp; ◈ &nbsp; ONLY THE CHOSEN FEW WILL UNLOCK WHAT LIES BENEATH &nbsp; ◈ &nbsp; THE BOX OPENS ONCE. ENTER AT YOUR OWN RISK. &nbsp; ◈
        </span>
      </div>

      <nav>
        <a href="#" className="nav-brand">
          BLACKBOX
        </a>
        <ul className="nav-links">
          <li>
            <a href="#what">The Mystery</a>
          </li>
          <li>
            <a href="#how">How to Play</a>
          </li>
          <li>
            <a href="#tickets">Get Access</a>
          </li>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-bg" />
        <div className="diamond-bg" />

        <div className="particles" aria-hidden="true">
          {particles.map((p, idx) => (
            <div
              key={idx}
              className="particle"
              style={
                {
                  left: `${p.left}%`,
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                  ['--drift']: `${p.drift}px`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  opacity: p.opacity,
                } as ParticleStyle
              }
            />
          ))}
        </div>

        <div className="hero-content">
          <p className="eyebrow">DuGod Presents</p>
          <h1 className="hero-title">
            Albums.
            <br />
            Art. Apparel. A game. One mystery
          </h1>
          <p className="hero-subtitle">The Multiverse You Play</p>
          <p className="hero-tagline">
            a mystery hidden inside the creators creations.
            <br />
            Decode the clues. Follow the sound. Uncover what lies beneath.
          </p>
          <div className="hero-buttons">
            <button
              type="button"
              className="btn btn-gold"
              onClick={() => {
                trackTicketClick('hero');
                startEnterFieldFlow(ticketPath);
              }}
            >
              Get Your Ticket
            </button>
            <a href="#what" className="btn btn-outline">
              Learn the Mystery
            </a>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <div className="scroll-line" />
          <div className="scroll-text">Descend</div>
        </div>
      </section>

      <div id="what" className="what-wrapper">
        <div className="section">
          <p className="section-label reveal">Learn the mystery</p>
          <p className="section-body reveal reveal-delay-2">
            BLACKBOX is unlike anything you&apos;ve experienced. It&apos;s an interactive multiverse by DuGod. Hidden in the music, the art and apparel is a trail of cryptic clues leading to an ultimate secret.
            <br />
            <br />
            Think <em>Ready Player One</em> — but real. Play a text-based adventure game that lives within the music itself. Each song is a level. Each lyric is a key. The album is your map.
          </p>
        </div>
      </div>

      <div id="how" className="how-section">
        <div className="how-inner">
          <p className="section-label reveal">The Path</p>
          <h2 className="section-title reveal reveal-delay-1">
            How To Enter
            <br />
            The Box
          </h2>

          <div className="steps">
            <div className="step reveal reveal-delay-1">
              <div className="step-num">01</div>
              <div className="step-title">Get Access</div>
              <p className="step-body">
                Buy a game ticket or the full album. Both unlock the field — but the album holds deeper secrets.
              </p>
            </div>
            <div className="step reveal reveal-delay-2">
              <div className="step-num">02</div>
              <div className="step-title">Listen Closely</div>
              <p className="step-body">
                The music carries clues. Hidden in lyrics, frequencies, and song titles are fragments of the puzzle.
              </p>
            </div>
            <div className="step reveal reveal-delay-3">
              <div className="step-num">03</div>
              <div className="step-title">Play the Game</div>
              <p className="step-body">
                Enter the blackbox multiverse by text input. Your knowledge of the albums determines how far you go. Every answer unlocks a door.
              </p>
            </div>
            <div className="step reveal reveal-delay-3">
              <div className="step-num">04</div>
              <div className="step-title">Unlock the Box</div>
              <p className="step-body">
                The chosen few who reach the end will open the BLACKBOX and claim what waits inside. Are you one of them?
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="quote-section">
        <div className="quote-inner">
          <span className="quote-mark">&quot;</span>
          <p className="quote-text reveal">
            Whoever sees the content of the box cannot leave the field. Only the chosen few will unlock what lies beneath.
          </p>
          <p className="quote-attr reveal reveal-delay-1">— The BLACKBOX Covenant</p>
        </div>
      </div>

      <div id="tickets" className="tickets-section">
        <p className="section-label reveal tickets-label">Choose Your Path</p>
        <h2 className="section-title reveal reveal-delay-1">Enter The Field</h2>
        <p className="section-body reveal reveal-delay-2 tickets-sub">
          Two ways to enter the mystery. One destination.
        </p>

        <div className="cards">
          <div className="card reveal reveal-delay-1">
            <span className="card-icon">🎟️</span>
            <div className="card-title">Game Ticket</div>
            <div className="card-price">
              Access <span>the field</span>
            </div>
            <ul className="card-features">
              <li>Full access to the game</li>
              <li>Compete for the prize hidden in the box</li>
              <li>Leaderboard &amp; progress tracking</li>
              <li>Community access — collaborate or compete</li>
            </ul>
            <button
              type="button"
              className="btn btn-outline btn-full"
              onClick={() => {
                trackTicketClick('ticket-card');
                startEnterFieldFlow(ticketPath);
              }}
            >
              Buy Ticket
            </button>
          </div>

          <div className="card featured reveal reveal-delay-2">
            <span className="card-icon">💿</span>
            <div className="card-title">Album + Game</div>
            <div className="card-price">
              Full Bundle <span>deepest access</span>
            </div>
            <ul className="card-features">
              <li>The complete BLACKBOX albums, Books &amp; Ticket</li>
              <li>Album contains embedded in-game clues</li>
              <li>Full game ticket included</li>
              <li>Exclusive album-only puzzle layers</li>
              <li>Priority access &amp; early chapter unlocks</li>
            </ul>
            <button type="button" className="btn btn-gold btn-full" onClick={() => startEnterFieldFlow(albumPath)}>
              Get the Album
            </button>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title reveal">
            The Box Is Waiting.
            <br />
            Will You Open It?
          </h2>
          <p className="cta-body reveal reveal-delay-1">
            This is not just music. This is not just a game.
            <br />
            This is an experience that exists at the edge of both.
          </p>
          <div className="cta-buttons reveal reveal-delay-2">
            <a href="https://www.dugodofficial.com/home" target="_blank" rel="noreferrer" className="btn btn-gold">
              Play Now
            </a>
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-brand">BLACKBOX</div>
        <div className="footer-links">
          <a href="https://www.dugodofficial.com/home" target="_blank" rel="noreferrer">
            dugodofficial.com
          </a>
          <a href="#tickets">Get Access</a>
          <a href="#what">The Mystery</a>
        </div>
        <div className="footer-copy">© 2026 DuGod. All rights reserved.</div>
      </footer>

      <style jsx global>{`
        .bb-root {
          --gold: #2AC318;
          --gold-light: #F3FFF5;
          --gold-dim: rgba(42, 195, 24, 0.28);
          --blood: #D91313;
          --dark: #000000;
          --sand: #000000;
          --text: #EDEDED;
          --dim: #7B7B7B;

          background: var(--dark);
          color: var(--text);
          overflow-x: hidden;
          cursor: crosshair;
          min-height: 100vh;
        }

        .bb-root,
        .bb-root * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        .bb-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 999;
          opacity: 0.4;
        }

        .hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(42, 195, 24, 0.06) 0%, #000000 70%);
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 40% 40% at 20% 80%, rgba(42, 195, 24, 0.05) 0%, transparent 70%),
            radial-gradient(ellipse 30% 50% at 80% 20%, rgba(42, 195, 24, 0.035) 0%, transparent 60%);
        }

        .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          background: rgba(42, 195, 24, 0.18);
          border-radius: 50%;
          animation: drift linear infinite;
        }

        @keyframes drift {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-10vh) translateX(var(--drift));
            opacity: 0;
          }
        }

        .diamond-bg {
          position: absolute;
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, rgba(42, 195, 24, 0.03) 0%, transparent 60%);
          border: 1px solid rgba(0, 0, 0, 0.06);
          transform: rotate(45deg);
          top: 50%;
          left: 50%;
          translate: -50% -50%;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 2rem;
          max-width: 900px;
          animation: heroReveal 1.4s ease forwards;
          opacity: 0;
        }

        @keyframes heroReveal {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .eyebrow {
          font-family: ${cinzel.style.fontFamily};
          font-size: 0.7rem;
          letter-spacing: 0.5em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          opacity: 0.8;
        }

        .hero-title {
          font-family: ${cinzelDecorative.style.fontFamily};
          font-size: clamp(4rem, 12vw, 9rem);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.02em;
          color: var(--text);
          position: relative;
          margin-bottom: 0.2em;
        }

        .hero-subtitle {
          font-family: ${cinzel.style.fontFamily};
          font-size: clamp(0.7rem, 2vw, 1rem);
          letter-spacing: 0.35em;
          color: var(--dim);
          text-transform: uppercase;
          margin-bottom: 2.5rem;
        }

        .hero-tagline {
          font-family: ${crimsonPro.style.fontFamily};
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          font-style: italic;
          color: var(--text);
          opacity: 0.85;
          line-height: 1.7;
          max-width: 620px;
          margin: 0 auto 3rem;
          font-weight: 300;
        }

        .hero-buttons {
          display: flex;
          gap: 1.2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .scroll-cue {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          translate: -50% 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          z-index: 2;
          opacity: 0.5;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        .scroll-line {
          width: 1px;
          height: 50px;
          background: linear-gradient(to bottom, var(--gold), transparent);
        }

        .scroll-text {
          font-family: ${cinzel.style.fontFamily};
          font-size: 0.55rem;
          letter-spacing: 0.4em;
          color: var(--gold);
          text-transform: uppercase;
        }

        .section {
          padding: 7rem 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .section-label {
          font-family: ${cinzel.style.fontFamily};
          font-size: 0.65rem;
          letter-spacing: 0.6em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, var(--gold-dim), transparent);
          max-width: 120px;
        }

        .section-title {
          font-family: ${cinzelDecorative.style.fontFamily};
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          color: var(--gold-light);
          line-height: 1.1;
          margin-bottom: 2rem;
        }

        .section-body {
          font-family: ${crimsonPro.style.fontFamily};
          font-size: 1.2rem;
          line-height: 1.9;
          color: var(--text);
          opacity: 0.85;
          max-width: 680px;
          font-weight: 300;
        }

        .how-section {
          padding: 7rem 2rem;
          background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.02) 50%, transparent);
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .how-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 3rem;
          margin-top: 4rem;
        }

        .step {
          position: relative;
          padding-left: 1.5rem;
          border-left: 1px solid rgba(0, 0, 0, 0.08);
          transition: border-color 0.3s;
        }

        .step:hover {
          border-left-color: rgba(42, 195, 24, 0.4);
        }

        .step-num {
          font-family: ${cinzelDecorative.style.fontFamily};
          font-size: 3rem;
          font-weight: 900;
          color: transparent;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(42, 195, 24, 0.6));
          -webkit-background-clip: text;
          background-clip: text;
          line-height: 1;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .step-title {
          font-family: ${cinzel.style.fontFamily};
          font-size: 1rem;
          letter-spacing: 0.1em;
          color: var(--gold-light);
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .step-body {
          font-family: ${crimsonPro.style.fontFamily};
          font-size: 1rem;
          line-height: 1.75;
          color: var(--text);
          opacity: 0.7;
          font-weight: 300;
        }

        .tickets-section {
          padding: 7rem 2rem;
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
          text-align: left;
        }

        .card {
          position: relative;
          padding: 2.5rem;
          background: rgba(0, 0, 0, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.12);
          overflow: hidden;
          transition: all 0.4s ease;
        }

        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(42, 195, 24, 0.05) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .card:hover::before {
          opacity: 1;
        }

        .card:hover {
          border-color: rgba(42, 195, 24, 0.35);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18), 0 0 30px rgba(42, 195, 24, 0.08);
        }

        .card.featured {
          border-color: rgba(42, 195, 24, 0.28);
          background: rgba(0, 0, 0, 0.65);
        }

        .card.featured::after {
          content: 'MOST POPULAR';
          position: absolute;
          top: 1.5rem;
          right: -1.5rem;
          font-family: ${cinzel.style.fontFamily};
          font-size: 0.55rem;
          letter-spacing: 0.3em;
          color: #0C0C0C;
          background: rgba(42, 195, 24, 0.16);
          padding: 0.3rem 2rem;
          transform: rotate(45deg) translateX(10px);
        }

        .card-icon {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .card-title {
          font-family: ${cinzelDecorative.style.fontFamily};
          font-size: 1.3rem;
          color: var(--gold-light);
          margin-bottom: 0.5rem;
        }

        .card-price {
          font-family: ${cinzel.style.fontFamily};
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--gold);
          margin-bottom: 1.5rem;
          line-height: 1;
        }

        .card-price span {
          font-size: 1rem;
          color: var(--dim);
          font-weight: 400;
        }

        .card-features {
          list-style: none;
          margin-bottom: 2rem;
          padding-left: 0;
        }

        .card-features li {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(201, 168, 76, 0.07);
          font-size: 0.95rem;
          color: var(--text);
          opacity: 0.75;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          line-height: 1.5;
        }

        .card-features li::before {
          content: '◈';
          color: var(--gold);
          font-size: 0.7rem;
          flex-shrink: 0;
          margin-top: 0.2rem;
        }

        .btn {
          display: inline-block;
          font-family: ${cinzel.style.fontFamily};
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 1rem 2.5rem;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-gold {
          background: rgba(0, 0, 0, 0.35);
          color: var(--text);
          border: 1px solid rgba(42, 195, 24, 0.35);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .btn-gold:hover {
          box-shadow: 0 10px 45px rgba(0, 0, 0, 0.16), 0 0 18px rgba(42, 195, 24, 0.12);
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        .btn-gold::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }

        .btn-gold:hover::after {
          transform: translateX(100%);
        }

        .btn-outline {
          background: transparent;
          color: var(--text);
          border: 1px solid rgba(255, 255, 255, 0.16);
        }

        .btn-outline:hover {
          border-color: rgba(42, 195, 24, 0.35);
          background: rgba(42, 195, 24, 0.04);
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.06);
        }

        .btn-full {
          width: 100%;
          text-align: center;
        }

        .quote-section {
          padding: 6rem 2rem;
          background: rgba(0, 0, 0, 0.35);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
        }

        .quote-inner {
          max-width: 800px;
          margin: 0 auto;
        }

        .quote-mark {
          font-family: ${cinzelDecorative.style.fontFamily};
          font-size: 5rem;
          color: var(--gold);
          opacity: 0.2;
          line-height: 0.5;
          margin-bottom: 1.5rem;
          display: block;
        }

        .quote-text {
          font-family: ${crimsonPro.style.fontFamily};
          font-size: clamp(1.3rem, 3vw, 1.8rem);
          font-style: italic;
          font-weight: 300;
          line-height: 1.7;
          color: var(--text);
          opacity: 0.9;
          margin-bottom: 1.5rem;
        }

        .quote-attr {
          font-family: ${cinzel.style.fontFamily};
          font-size: 0.7rem;
          letter-spacing: 0.4em;
          color: var(--gold);
          text-transform: uppercase;
          opacity: 0.6;
        }

        .cta-section {
          padding: 8rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: 'BLACKBOX';
          position: absolute;
          font-family: ${cinzelDecorative.style.fontFamily};
          font-size: 20vw;
          font-weight: 900;
          color: rgba(42, 195, 24, 0.03);
          top: 50%;
          left: 50%;
          translate: -50% -50%;
          white-space: nowrap;
          pointer-events: none;
          letter-spacing: -0.05em;
        }

        .cta-inner {
          position: relative;
          z-index: 1;
          max-width: 700px;
          margin: 0 auto;
        }

        .cta-title {
          font-family: ${cinzelDecorative.style.fontFamily};
          font-size: clamp(2rem, 5vw, 3rem);
          color: var(--gold-light);
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .cta-body {
          font-family: ${crimsonPro.style.fontFamily};
          font-size: 1.2rem;
          font-style: italic;
          opacity: 0.75;
          margin-bottom: 3rem;
          line-height: 1.7;
          font-weight: 300;
        }

        .cta-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        footer {
          padding: 3rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .footer-brand {
          font-family: ${cinzelDecorative.style.fontFamily};
          font-size: 1.2rem;
          color: var(--gold);
          opacity: 0.7;
        }

        .footer-links {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .footer-links a {
          font-family: ${cinzel.style.fontFamily};
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--dim);
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-links a:hover {
          color: var(--gold);
        }

        .footer-copy {
          font-family: ${crimsonPro.style.fontFamily};
          font-size: 0.8rem;
          color: var(--dim);
          opacity: 0.6;
        }

        .announce {
          background: linear-gradient(90deg, var(--dark) 0%, rgba(42, 195, 24, 0.07) 50%, var(--dark) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.75rem;
          text-align: center;
          font-family: ${cinzel.style.fontFamily};
          font-size: 0.65rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--gold);
          opacity: 0.8;
          overflow: hidden;
        }

        .announce-inner {
          animation: marquee 18s linear infinite;
          display: inline-block;
          white-space: nowrap;
        }

        @keyframes marquee {
          from {
            transform: translateX(30vw);
          }
          to {
            transform: translateX(-100%);
          }
        }

        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1.5rem 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.86), transparent);
          backdrop-filter: blur(4px);
        }

        .nav-brand {
          font-family: ${cinzelDecorative.style.fontFamily};
          font-size: 1.1rem;
          color: var(--gold);
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
          padding-left: 0;
          margin: 0;
        }

        .nav-links a {
          font-family: ${cinzel.style.fontFamily};
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--dim);
          text-decoration: none;
          transition: color 0.3s;
        }

        .nav-links a:hover {
          color: var(--gold-light);
        }

        .what-wrapper {
          background: linear-gradient(to bottom, var(--dark), var(--sand) 50%, var(--dark));
        }

        .tickets-label {
          justify-content: center;
        }

        .tickets-sub {
          margin: 0 auto 1rem;
          text-align: center;
        }

        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .reveal-delay-1 {
          transition-delay: 0.15s;
        }

        .reveal-delay-2 {
          transition-delay: 0.3s;
        }

        .reveal-delay-3 {
          transition-delay: 0.45s;
        }

        @media (max-width: 640px) {
          nav {
            padding: 1.5rem;
          }
          .nav-links {
            display: none;
          }
          .cards {
            grid-template-columns: 1fr;
          }
          .steps {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          footer {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
