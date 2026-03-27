import { Link } from 'react-router-dom'
import { useState } from 'react'
import logoImg from '../assets/logoimg.png'
import logoBanner from '../assets/CamionSuf2Plan_de_travail_1-8__1_-removebg-preview (1).png'

export function Footer() {
  const [qrModal, setQrModal] = useState(null)

  const APP_LINKS = {
    ios: 'https://apps.apple.com/app/camionsuf',
    android: 'https://play.google.com/store/apps/details?id=com.camionsuf.app'
  }

  const openQrModal = (platform) => setQrModal(platform)
  const closeQrModal = () => setQrModal(null)

  const qrUrl = qrModal 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(APP_LINKS[qrModal])}`
    : null

  return (
    <>
      <footer className="landing__footer">
        <div className="landing__section-wrap">
          <div className="landing__footer-inner">
            <img src={logoBanner} alt="CamionSuf" className="landing__footer-logo-banner" />

            <div className="landing__footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="https://wa.me/221338000000" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              </a>
            </div>

            <div className="landing__footer-apps">
              <button onClick={() => openQrModal('ios')} className="landing__footer-app-btn" aria-label="Télécharger sur App Store">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </button>
              <button onClick={() => openQrModal('android')} className="landing__footer-app-btn" aria-label="Télécharger sur Google Play">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.203-.569V2.383a.995.995 0 0 1 .203-.569zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                </svg>
                Google Play
              </button>
            </div>

            <div className="landing__footer-meta">
              <p className="landing__footer-copy">
                © {new Date().getFullYear()} CamionSuf — Dakar, Sénégal
              </p>
              <p className="landing__footer-ref">
                Plateforme de mise en relation chargeurs/transporteurs • Version 1.0 • 1/4T, 4C
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal QR Code */}
      {qrModal && (
        <div className="qr-modal-overlay" onClick={closeQrModal}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="qr-modal-close" onClick={closeQrModal} aria-label="Fermer">✕</button>
            <h3>Scanner pour télécharger</h3>
            <p>Scannez ce QR code avec votre téléphone</p>
            <div className="qr-modal-qr">
              <img src={qrUrl} alt="QR Code" />
            </div>
            <p className="qr-modal-platform">
              {qrModal === 'ios' ? 'App Store (iOS)' : 'Google Play (Android)'}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
