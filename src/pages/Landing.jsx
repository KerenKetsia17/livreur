import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../assets/logoimg.png'
import heroImage from '../assets/pexels-rezwan-1116035.jpg'
import heroVisual from '../assets/Camion de chantier rempli de sable.png'

const QR_LINKS = {
  appstore:   'https://example.com/app-store',
  googleplay: 'https://example.com/google-play',
}

const FEATURES = [
  {
    icon: '📍',
    title: 'Suivi GPS en temps réel',
    desc: 'Suivez chaque livraison à la minute près avec la géolocalisation active. Le client voit votre position en direct.',
    color: '#4285f4'
  },
  {
    icon: '📦',
    title: 'Missions automatiques',
    desc: 'Recevez des missions attribuées automatiquement selon votre position et disponibilité.',
    color: '#ff6a1d'
  },
  {
    icon: '💰',
    title: 'Paiements instantanés',
    desc: 'Vos gains sont calculés et crédités automatiquement après chaque signature client.',
    color: '#00c27e'
  },
  {
    icon: '📄',
    title: 'Signature numérique & e-Ticket',
    desc: 'Le client signe sur votre écran. La facture PDF est générée instantanément pour tous.',
    color: '#9c27b0'
  },
  {
    icon: '🛡️',
    title: 'Itinéraire optimisé',
    desc: 'GPS intégré avec évitement du trafic et des ponts limités en poids pour vos camions.',
    color: '#ff9100'
  },
  {
    icon: '📱',
    title: 'Interface mobile-first',
    desc: 'Application pensée pour smartphones Android, rapide et fonctionnelle même avec réseau limité.',
    color: '#00bcd4'
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Inscrivez-vous',
    desc: 'Créez votre profil chauffeur en quelques minutes. Ajoutez votre véhicule, permis et documents.',
  },
  {
    number: '02',
    title: 'Recevez des missions',
    desc: 'Dès validation, les missions BTP (béton, sable) s\'affichent automatiquement près de vous.',
  },
  {
    number: '03',
    title: 'Livrez & encaissez',
    desc: 'GPS vous guide, client signe à l\'arrivée, facture générée, paiement reçu. Simple et rapide.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Moussa Diallo',
    role: 'Chauffeur depuis 2 ans',
    text: 'Avec CamionSuf, je gère tout depuis mon téléphone. Plus besoin de papiers, tout est digital. Les missions arrivent automatiquement.',
    rating: 5,
  },
  {
    name: 'Abdou Ndiaye',
    role: 'Livreur béton',
    text: 'Le GPS évite les routes difficiles pour mon camion. Ça me fait gagner du temps et du carburant. Excellent système!',
    rating: 5,
  },
  {
    name: 'Ibrahima Sarr',
    role: 'Chauffeur partenaire',
    text: 'Paiements rapides, missions claires, support réactif. C\'est la meilleure plateforme pour les chauffeurs de chantier.',
    rating: 5,
  },
]

const STATS = [
  { value: '500+', label: 'Chauffeurs actifs' },
  { value: '10K+', label: 'Livraisons réussies' },
  { value: '98%', label: 'Satisfaction client' },
  { value: '24/7', label: 'Support disponible' },
]


export function Landing() {
  const [qrModal,  setQrModal]  = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openQrModal  = (store) => setQrModal(store)
  const closeQrModal = () => setQrModal(null)

  const qrUrl = qrModal
    ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(QR_LINKS[qrModal])}`
    : null

  return (
    <div className="landing">

      {/* ══ HEADER ══════════════════════════════════════════ */}
      <header className={`landing__header${scrolled ? ' landing__header--scrolled' : ''}`}>
        <div className="landing__header-container">
          <div className="landing__header-left">
            <Link to="/" className="landing__brand">
              <img src={logoImg} alt="CamionSuf" className="landing__logo-img" />
              <span>CamionSuf</span>
            </Link>
            <div className="landing__contact">
              <span className="landing__contact-icon">📞</span>
              <a href="tel:+221338000000">33 800 00 00</a>
            </div>
          </div>

          <nav className={`landing__nav${menuOpen ? ' landing__nav--open' : ''}`}>
            <a href="#home"     onClick={() => setMenuOpen(false)}>Accueil</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>Fonctionnalités</a>
            <a href="#how"      onClick={() => setMenuOpen(false)}>Comment ça marche</a>
            <a href="#about"    onClick={() => setMenuOpen(false)}>À propos</a>
          </nav>

          <div className="landing__header-actions">
            <Link to="/driver" className="landing__btn-cta">
              Commencer →
            </Link>
          </div>

          {/* Burger mobile */}
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
        {/* Background overlay */}
        <div className="landing__hero-bg">
          <div className="landing__hero-gradient"></div>
        </div>

        <div className="landing__hero-container">
          <div className="landing__hero-content">
            <div className="landing__hero-badge">
              <span>🚛</span>
              <span>Plateforme N°1 pour livreurs BTP au Sénégal</span>
            </div>

            <h1>
              Livraison de béton et sable avec{' '}
              <span className="landing__hero-accent">CamionSuf</span>
            </h1>

            <p className="landing__hero-subtitle">
              Rejoignez des centaines de chauffeurs qui gèrent leurs missions de livraison BTP, 
              suivent leurs courses en temps réel et reçoivent leurs paiements rapidement — 
              tout depuis une seule application mobile.
            </p>

            <div className="landing__hero-actions">
              <Link to="/driver" className="landing__btn-primary">
                <span>Commencer à livrer</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a href="#how" className="landing__btn-secondary">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 18L28 24L20 30V18Z" fill="currentColor"/>
                </svg>
                <span>Voir comment ça marche</span>
              </a>
            </div>

            <div className="landing__hero-download">
              <span className="landing__download-label">Télécharger l'app :</span>
              <div className="landing__download-buttons">
                <button
                  type="button"
                  className="landing__download-btn landing__download-btn--apple"
                  onClick={() => openQrModal('appstore')}
                >
                  <svg viewBox="0 0 384 512" width="20" height="20">
                    <path fill="currentColor" d="M318.7 268.3c-11.7-15.5-23.5-29.8-43.1-29.8s-21.5 14.3-43.1 14.3c-21.6 0-30.2-14.3-53.2-14.3-23.5 0-38.9 14.3-49.8 29.8-28.9 40.3-24.7 103.9 21.1 141.3 14.3 12.1 31.8 19.1 52.2 19.1 21.5 0 29.8-14.3 49.8-14.3 20.1 0 28.2 14.3 49.8 14.3 20.7 0 38.9-6.8 53.2-19.1 45.8-37.4 49.8-100.1 20.1-140.8zM249.8 31.9c-24.8 2.9-51.2 18.9-67.6 40.1-14.9 19.1-27.8 44.7-24 70.7 25.4 2.1 51.4-13.6 67.6-34.6 14.3-18.5 26.8-45.7 24-70.1z" />
                  </svg>
                  <div>
                    <small>Télécharger sur</small>
                    <strong>App Store</strong>
                  </div>
                </button>
                <button
                  type="button"
                  className="landing__download-btn landing__download-btn--google"
                  onClick={() => openQrModal('googleplay')}
                >
                  <svg viewBox="0 0 512 512" width="20" height="20">
                    <polygon fill="currentColor" points="56,48 230,223 56,398" />
                    <polygon fill="currentColor" points="56,398 283,256 56,48" />
                    <polygon fill="currentColor" points="283,256 56,48 474,256" />
                    <polygon fill="currentColor" points="283,256 474,256 56,398" />
                  </svg>
                  <div>
                    <small>Disponible sur</small>
                    <strong>Google Play</strong>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="landing__hero-visual">
            <div className="landing__hero-image-wrapper">
              <img src={heroVisual} alt="Camion CamionSuf de livraison" className="landing__hero-image" />
              <div className="landing__hero-float landing__hero-float--1">
                <div className="landing__float-card">
                  <span className="landing__float-icon">📍</span>
                  <div>
                    <strong>GPS Actif</strong>
                    <p>Suivi en temps réel</p>
                  </div>
                </div>
              </div>
              <div className="landing__hero-float landing__hero-float--2">
                <div className="landing__float-card">
                  <span className="landing__float-icon">✅</span>
                  <div>
                    <strong>Mission en cours</strong>
                    <p>Livraison béton M350</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BANNER ════════════════════════════════════ */}
      <section className="landing__stats">
        <div className="landing__stats-container">
          {STATS.map((stat, idx) => (
            <div key={idx} className="landing__stat-item">
              <div className="landing__stat-value">{stat.value}</div>
              <div className="landing__stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════ */}
      <section className="landing__features" id="features">
        <div className="landing__features-container">
          <div className="landing__section-header">
            <span className="landing__section-kicker">Fonctionnalités</span>
            <h2>Tout ce dont vous avez besoin pour livrer efficacement</h2>
            <p className="landing__section-subtitle">
              Une application complète pensée pour les chauffeurs de camions BTP, 
              avec les outils professionnels pour gérer vos livraisons du début à la fin.
            </p>
          </div>

          <div className="landing__features-grid">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="landing__feature-card" style={{'--feature-color': feature.color}}>
                <div className="landing__feature-icon" style={{background: `${feature.color}15`, color: feature.color}}>
                  <span>{feature.icon}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* ══ HOW IT WORKS ════════════════════════════════════ */}
      <section className="landing__how" id="how">
        <div className="landing__how-container">
          <div className="landing__section-header">
            <span className="landing__section-kicker">Comment ça marche</span>
            <h2>Démarrez en 3 étapes simples</h2>
            <p className="landing__section-subtitle">
              De l'inscription à votre première livraison, le processus est simple et rapide.
            </p>
          </div>

          <div className="landing__steps">
            {STEPS.map((step, i) => (
              <div key={step.number} className="landing__step">
                <div className="landing__step-number">{step.number}</div>
                {i < STEPS.length - 1 && <div className="landing__step-connector" />}
                <div className="landing__step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="landing__how-cta">
            <Link to="/driver" className="landing__btn-primary">
              <span>S'inscrire gratuitement</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════ */}
      <section className="landing__testimonials">
        <div className="landing__testimonials-container">
          <div className="landing__section-header">
            <span className="landing__section-kicker">Témoignages</span>
            <h2>Ce que disent nos chauffeurs</h2>
          </div>

          <div className="landing__testimonials-grid">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={idx} className="landing__testimonial-card">
                <div className="landing__testimonial-stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p className="landing__testimonial-text">"{testimonial.text}"</p>
                <div className="landing__testimonial-author">
                  <div className="landing__testimonial-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <strong>{testimonial.name}</strong>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS PHOTO ═══════════════════════════════════ */}
      <section className="landing__process">
        <img src={heroImage} alt="Chantier et livraison" className="landing__process-image" />
        <div className="landing__process-overlay">
          <div className="landing__process-content">
            <h3>La plateforme qui connecte les chantiers aux chauffeurs</h3>
            <p>Géolocalisation en temps réel • Signature numérique • Paiement automatique</p>
          </div>
        </div>
      </section>
      
      {/* ══ ABOUT ═══════════════════════════════════════════ */}
      <section className="landing__about" id="about">
        <div className="landing__about-container">
          <div className="landing__section-header">
            <span className="landing__section-kicker">À propos</span>
            <h2>Plateforme de livraison BTP nouvelle génération</h2>
            <p className="landing__section-subtitle">
              CamionSuf relie les chantiers et les chauffeurs professionnels pour livrer 
              le sable, le béton et les matériaux de construction avec un suivi clair, 
              rapide et géolocalisé en temps réel.
            </p>
          </div>

          <div className="landing__about-cards">
            <div className="landing__about-card">
              <div className="landing__about-icon">🚀</div>
              <strong>Temps réel</strong>
              <p>Missions mises à jour instantanément selon votre position GPS. Le système vous attribue les livraisons les plus proches.</p>
            </div>
            <div className="landing__about-card">
              <div className="landing__about-icon">🔐</div>
              <strong>Accès réservé</strong>
              <p>Plateforme destinée uniquement aux livreurs validés et certifiés par notre équipe. Sécurité et professionnalisme garantis.</p>
            </div>
            <div className="landing__about-card">
              <div className="landing__about-icon">🏗️</div>
              <strong>Livraisons BTP</strong>
              <p>Spécialisé dans le transport de matériaux lourds : sable, béton, graviers. Organisation professionnelle des missions.</p>
            </div>
            <div className="landing__about-card">
              <div className="landing__about-icon">📊</div>
              <strong>Suivi complet</strong>
              <p>Tableau de bord professionnel pour suivre vos missions, vos gains, votre historique et vos statistiques de performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA BAND ════════════════════════════════════════ */}
      <section className="landing__cta-band">
        <div className="landing__cta-band-container">
          <div className="landing__cta-content">
            <h2>Prêt à rejoindre CamionSuf&nbsp;?</h2>
            <p>Inscrivez-vous gratuitement et recevez votre première mission dès aujourd'hui. 
            Rejoignez la communauté des chauffeurs professionnels du BTP.</p>
            <div className="landing__cta-actions">
              <Link to="/driver" className="landing__btn-primary landing__btn-primary--large">
                <span>Commencer maintenant</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <div className="landing__cta-download">
                <button type="button" className="landing__cta-app-btn" onClick={() => openQrModal('appstore')}>
                  <svg viewBox="0 0 384 512" width="16" height="16">
                    <path fill="currentColor" d="M318.7 268.3c-11.7-15.5-23.5-29.8-43.1-29.8s-21.5 14.3-43.1 14.3c-21.6 0-30.2-14.3-53.2-14.3-23.5 0-38.9 14.3-49.8 29.8-28.9 40.3-24.7 103.9 21.1 141.3 14.3 12.1 31.8 19.1 52.2 19.1 21.5 0 29.8-14.3 49.8-14.3 20.1 0 28.2 14.3 49.8 14.3 20.7 0 38.9-6.8 53.2-19.1 45.8-37.4 49.8-100.1 20.1-140.8zM249.8 31.9c-24.8 2.9-51.2 18.9-67.6 40.1-14.9 19.1-27.8 44.7-24 70.7 25.4 2.1 51.4-13.6 67.6-34.6 14.3-18.5 26.8-45.7 24-70.1z" />
                  </svg>
                  App Store
                </button>
                <button type="button" className="landing__cta-app-btn" onClick={() => openQrModal('googleplay')}>
                  <svg viewBox="0 0 512 512" width="16" height="16">
                    <polygon fill="currentColor" points="56,48 230,223 56,398" />
                    <polygon fill="currentColor" points="56,398 283,256 56,48" />
                    <polygon fill="currentColor" points="283,256 56,48 474,256" />
                    <polygon fill="currentColor" points="283,256 474,256 56,398" />
                  </svg>
                  Google Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* ══ QR MODAL ════════════════════════════════════════ */}
      {qrModal && (
        <div className="qr-modal" role="dialog" aria-modal="true">
          <div className="qr-modal__content">
            <div className="qr-modal__header">
              <h3>Téléchargez l'application</h3>
              <button className="qr-modal__close" onClick={closeQrModal} aria-label="Fermer">✕</button>
            </div>
            <p>Scannez ce QR code avec votre téléphone pour ouvrir le store :</p>
            <div className="qr-modal__qr">
              <img src={qrUrl} alt="QR code de téléchargement" />
            </div>
            <a
              href={QR_LINKS[qrModal]}
              className="button button--primary button--full"
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir dans le store
            </a>
          </div>
          <button className="qr-modal__backdrop" onClick={closeQrModal} aria-label="Fermer le modal" />
        </div>
      )}

    </div>
  )
}
