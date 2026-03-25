import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../assets/logoimg.png'
import heroImage from '../assets/pexels-rezwan-1116035.jpg'
import heroVisual from '../assets/Camion de chantier rempli de sable.png'

const FEATURES = [
  {
    icon: '📍',
    title: 'Suivi GPS en temps réel',
    desc: 'Le client sait exactement où en est sa livraison. Vous n\'avez pas à répondre aux appels pour donner votre position.',
  },
  {
    icon: '📦',
    title: 'Missions attribuées automatiquement',
    desc: 'Pas besoin de chercher. Dès que vous êtes disponible, les missions proches arrivent directement sur votre téléphone.',
  },
  {
    icon: '💰',
    title: 'Paiement après chaque livraison',
    desc: 'Votre gain est calculé et confirmé à la fin de chaque mission. Pas de surprise, pas d\'attente.',
  },
  {
    icon: '🗺️',
    title: 'Itinéraire pensé pour les camions',
    desc: 'Le GPS intégré tient compte du poids de votre véhicule et évite les routes inadaptées aux camions lourds.',
  },
  {
    icon: '📄',
    title: 'Bon de livraison numérique',
    desc: 'Plus de papiers à remplir sur le chantier. Le client valide la livraison depuis son téléphone, tout est enregistré.',
  },
  {
    icon: '📱',
    title: 'Application simple à utiliser',
    desc: 'Conçue pour fonctionner même avec une connexion limitée. Interface claire, sans écrans inutiles.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Créez votre compte',
    desc: 'Quelques minutes suffisent. Vous renseignez vos informations, votre véhicule et vos documents. Notre équipe vérifie et valide.',
  },
  {
    number: '02',
    title: 'Recevez des missions',
    desc: 'Une fois validé, les missions BTP (sable, béton, graviers) apparaissent selon votre zone et vos disponibilités.',
  },
  {
    number: '03',
    title: 'Livrez et encaissez',
    desc: 'Le GPS vous guide jusqu\'au chantier. À l\'arrivée, le client valide. Vous recevez votre confirmation de paiement.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Moussa Diallo',
    role: 'Chauffeur partenaire — 2 ans',
    text: 'Avant, je passais mon temps au téléphone pour coordonner. Maintenant tout vient automatiquement. J\'ai même commencé à planifier mes journées à l\'avance.',
  },
  {
    name: 'Abdou Ndiaye',
    role: 'Livreur béton, Dakar',
    text: 'Le GPS évite les routes que mon camion ne peut pas prendre. Ça m\'a évité plusieurs incidents et ça me fait gagner du carburant.',
  },
  {
    name: 'Ibrahima Sarr',
    role: 'Chauffeur indépendant',
    text: 'Ce qui m\'a convaincu, c\'est la transparence. Je vois exactement ce que je gagne sur chaque mission avant même de l\'accepter.',
  },
]

export function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="landing">

      {/* ══ HEADER ══════════════════════════════════════════ */}
      <header className={`landing__header${scrolled ? ' landing__header--scrolled' : ''}`}>
        <div className="landing__header-container">
          <Link to="/" className="landing__brand">
            <img src={logoImg} alt="CamionSuf" className="landing__logo-img" />
            <span>CamionSuf</span>
          </Link>

          <nav className={`landing__nav${menuOpen ? ' landing__nav--open' : ''}`}>
            <a href="#home"     onClick={() => setMenuOpen(false)}>Accueil</a>
            <a href="#how"      onClick={() => setMenuOpen(false)}>Comment ça marche</a>
            <a href="#about"    onClick={() => setMenuOpen(false)}>À propos</a>
          </nav>

          <div className="landing__header-actions">
            <a href="tel:+221338000000" className="landing__header-tel">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.9v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07A19.5 19.5 0 013.5 11.2 19.8 19.8 0 01.47 2.6 2 2 0 012.45.42h3a2 2 0 012 1.72c.13 1 .37 1.97.71 2.9a2 2 0 01-.45 2.11L6.53 8.38a16 16 0 006.2 6.2l1.23-1.24a2 2 0 012.11-.45c.93.34 1.9.58 2.9.71A2 2 0 0122 16.9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              33 800 00 00
            </a>
            <Link to="/driver" className="landing__btn-cta">
              Espace livreur
            </Link>
          </div>

          <button
            className={`landing__burger${menuOpen ? ' landing__burger--open' : ''}`}
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ══ HERO ════════════════════════════════════════════ */}
      <section className="landing__hero" id="home">
        <div className="landing__hero-bg">
          <div className="landing__hero-gradient" />
        </div>

        <div className="landing__hero-container">
          <div className="landing__hero-content">
            <p className="landing__hero-eyebrow">Livraison de matériaux BTP au Sénégal</p>

            <h1>
              Des chantiers approvisionnés,{' '}
              <span className="landing__hero-accent">sans attente.</span>
            </h1>

            <p className="landing__hero-subtitle">
              CamionSuf connecte les chauffeurs de camion aux chantiers qui ont besoin 
              de sable, béton ou graviers — avec GPS en temps réel, missions automatiques 
              et paiement à la livraison.
            </p>

            <div className="landing__hero-actions">
              <Link to="/driver" className="landing__btn-primary">
                Rejoindre comme livreur
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a href="#how" className="landing__btn-secondary">
                Comment ça marche
              </a>
            </div>

            <p className="landing__hero-note">
              Déjà plus de 500 chauffeurs partenaires à Dakar et ses environs.
            </p>
          </div>

          <div className="landing__hero-visual">
            <img src={heroVisual} alt="Camion de livraison BTP CamionSuf" className="landing__hero-image" />
          </div>
        </div>
      </section>

      {/* ══ BANDE STATS ────────────────────────────────────── */}
      <section className="landing__stats-band">
        <div className="landing__stats-inner">
          <div className="landing__stat">
            <strong>500+</strong>
            <span>Chauffeurs actifs</span>
          </div>
          <div className="landing__stat-divider" />
          <div className="landing__stat">
            <strong>10 000+</strong>
            <span>Livraisons effectuées</span>
          </div>
          <div className="landing__stat-divider" />
          <div className="landing__stat">
            <strong>Dakar</strong>
            <span>Zone de couverture principale</span>
          </div>
          <div className="landing__stat-divider" />
          <div className="landing__stat">
            <strong>Gratuit</strong>
            <span>Inscription sans frais</span>
          </div>
        </div>
      </section>

      {/* ══ COMMENT ÇA MARCHE ───────────────────────────────── */}
      <section className="landing__how" id="how">
        <div className="landing__section-wrap">
          <div className="landing__section-head">
            <span className="landing__kicker">Comment ça marche</span>
            <h2>Trois étapes pour commencer à livrer</h2>
          </div>
          <div className="landing__steps">
            {STEPS.map((step, i) => (
              <div key={step.number} className="landing__step">
                <div className="landing__step__num">{step.number}</div>
                <div className="landing__step__body">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && <div className="landing__step__connector" />}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ PHOTO DE CHANTIER ───────────────────────────────── */}
      <section className="landing__process">
        <img src={heroImage} alt="Chantier de construction au Sénégal" className="landing__process-image" />
        <div className="landing__process-overlay">
          <div className="landing__process-content">
            <h3>Conçu pour les réalités du terrain</h3>
            <p>Des chauffeurs sénégalais, des chantiers locaux, une application qui fonctionne même avec le réseau 3G.</p>
          </div>
        </div>
      </section>

      {/* ══ À PROPOS ────────────────────────────────────────── */}
      <section className="landing__about" id="about">
        <div className="landing__section-wrap">
          <div className="landing__about-layout">
            <div className="landing__about-text">
              <span className="landing__kicker">À propos</span>
              <h2>Une équipe sénégalaise au service des chantiers</h2>
              <p>
                CamionSuf est née d'un constat simple : la livraison de matériaux BTP à Dakar 
                repose encore sur des appels téléphoniques, des papiers remplis à la main et 
                des itinéraires improvvisés.
              </p>
              <p>
                Nous avons travaillé avec des chauffeurs locaux pour concevoir une plateforme 
                qui répond à leurs vraies contraintes — connexion instable, camions lourds, 
                chantiers mal indiqués. Pas un projet importé, une solution construite ici.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ───────────────────────────────────────── */}
      <section className="landing__cta-band">
        <div className="landing__section-wrap">
          <h2>Prêt à rejoindre CamionSuf&nbsp;?</h2>
          <p>Inscription gratuite. Première mission dès validation de votre profil.</p>
          <Link to="/driver" className="landing__btn-primary landing__btn-primary--large">
            Créer mon compte livreur
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <p className="landing__cta-tel">
            Vous préférez appeler ?{' '}
            <a href="tel:+221338000000">33 800 00 00</a>
          </p>
        </div>
      </section>

    </div>
  )
}
