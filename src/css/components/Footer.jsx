import { Link } from 'react-router-dom'
import logoImg from '../assets/CamionSuf2Plan_de_travail_2-8__2_-removebg-preview.png'

export function Footer() {
  return (
    
    
    <footer className="landing__footer">
      <div className="landing__footer-grid">
        {/* Colonne 1 — Marque */}
        <div className="landing__footer-brand">
          <Link to="/" className="landing__footer-logo">
            <img src={logoImg} alt="CamionSuf" width="130" height="130" />
          </Link>
          <p className="landing__footer-desc">
            La plateforme de mise en relation entre chargeurs et transporteurs au Sénégal.
            Rejoignez des milliers de chauffeurs partenaires et développez votre activité.
          </p>
          {/* Réseaux sociaux */}
          <div className="landing__footer-socials">
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" aria-label="Twitter / X">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 2C6.477 2 2 6.478 2 12.001c0 1.767.466 3.463 1.321 4.951L2 22l5.233-1.297A9.953 9.953 0 0 0 12 22c5.523 0 10-4.478 10-10S17.522 2 12 2h-.001z" fillRule="evenodd" clipRule="evenodd"/></svg>
            </a>
          </div>
        </div>

        {/* Colonne 2 — Liens rapides */}
        <div className="landing__footer-col">
          <h4>Liens rapides</h4>
          <a href="#home">Accueil</a>
          <a href="#features">À propos</a>
          <Link to="/driver">Espace chauffeur</Link>
          <a href="#">Télécharger l'app</a>
        </div>

        {/* Colonne 3 — Contact */}
        <div className="landing__footer-col">
          <h4>Contact</h4>
          <a href="tel:+221338000000">📞 33 800 00 00</a>
          <a href="mailto:contact@camionsuf.sn">✉️ contact@camionsuf.sn</a>
          <span>📍 Dakar, Sénégal</span>
        </div>


      </div>

      <div className="landing__footer-bottom">
        <p>© {new Date().getFullYear()} CamionSuf — Tous droits réservés.</p>
        <div className="landing__footer-legal">
          <a href="#">Mentions légales</a>
          <a href="#">Confidentialité</a>
          <a href="#">CGU</a>
        </div>
      </div>
    </footer>
  )
}
