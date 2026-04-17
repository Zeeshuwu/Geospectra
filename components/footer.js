// components/footer.js
class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          margin-top: auto;
        }
        footer {
          background: linear-gradient(135deg, #27ae60 0%, #f39c12 100%);
          color: white;
          padding: 3rem 2rem 2rem;
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
        }
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .footer-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .footer-section p, .footer-section a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          line-height: 1.6;
        }
        .footer-section a:hover {
          color: white;
          text-decoration: underline;
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-links li {
          margin-bottom: 0.5rem;
        }
        
        /* Stakeholder Logos Section */
        .stakeholder-logos {
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2rem 0;
          margin-bottom: 2rem;
        }
        .stakeholder-title {
          text-align: center;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: rgba(255, 255, 255, 0.9);
        }
        .logos-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3rem;
          flex-wrap: wrap;
        }
        .logo-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.3s ease;
        }
        .logo-item:hover {
          transform: translateY(-5px);
        }
        .logo-image {
          width: 80px;
          height: 80px;
          object-fit: contain;
          background: white;
          border-radius: 50%;
          padding: 15px;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .logo-image:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          transform: scale(1.05);
        }
        .logo-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          max-width: 120px;
          line-height: 1.3;
        }
        
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 2rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
        }
        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          justify-content: flex-start;
        }
        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .social-link:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .logos-container {
            gap: 2rem;
          }
          .logo-image {
            width: 70px;
            height: 70px;
          }
          .footer-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .logos-container {
            gap: 1.5rem;
          }
          .logo-image {
            width: 60px;
            height: 60px;
            padding: 10px;
          }
          .logo-text {
            font-size: 0.8rem;
            max-width: 100px;
          }
        }
      </style>
      <footer>
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h3>GEOSPECTRA</h3>
              <p>Pioneering the next generation of spatial intelligence.</p>
              <div class="social-links">
                <a href="#" class="social-link" aria-label="LinkedIn">
                  <i data-feather="linkedin"></i>
                </a>
                <a href="#" class="social-link" aria-label="Twitter">
                  <i data-feather="twitter"></i>
                </a>
                <a href="#" class="social-link" aria-label="GitHub">
                  <i data-feather="github"></i>
                </a>
              </div>
            </div>
            
            <div class="footer-section">
              <h3>Analysis Tools</h3>
              <ul class="footer-links">
                <li><a href="tool1-segmentation.html">Building Segmentation</a></li>
                <li><a href="tool2-classification.html">Roof Classification</a></li>
                <li><a href="3d-viewer.html">3D Solar Analysis</a></li>
                <li><a href="tools.html">All Tools</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3>Resources</h3>
              <ul class="footer-links">
                <li><a href="about.html">About GEOSPECTRA</a></li>
                <li><a href="team.html">Meet Our Team</a></li>
                <li><a href="https://github.com/Zeeshuwu/Geospectra">Documentation</a></li>
                <li><a href="api.html">API Reference</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3>Contact</h3>
              <p>Email: zulfi.rhp22@gmail.com</p>
              <p>Address: Geodetic Engineering Department<br>Universitas Gadjah Mada</p>
              <p>Jl. Grafika Bulaksumur Street, Sendowo<br>Sinduadi, Mlati District, Sleman Regency<br>Special Region of Yogyakarta 55281</p>
            </div>
          </div>
          
          <!-- Stakeholder Logos Section -->
          <div class="stakeholder-logos">
            <div class="stakeholder-title">Our Partners & Stakeholders</div>
            <div class="logos-container">
              <div class="logo-item">
                <img src="images/logo Geospectra.png" alt="GEOSPECTRA Logo" class="logo-image">
                <div class="logo-text">GEOSPECTRA</div>
              </div>
              <div class="logo-item">
                <img src="images/Logo UGM.jpeg" alt="Universitas Gadjah Mada Logo" class="logo-image">
                <div class="logo-text">Universitas Gadjah Mada</div>
              </div>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; 2025 GEOSPECTRA. All rights reserved. | Department Of Geodetic Engineering, Universitas Gadjah Mada</p>
          </div>
        </div>
      </footer>
    `;
  }
}
customElements.define('custom-footer', CustomFooter);
