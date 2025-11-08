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
                <li><a href="tool1-segmentation.html">Roof Segmentation</a></li>
                <li><a href="tool2-classification.html">Roof Classification</a></li>
                <li><a href="result3.html">3D Solar Analysis</a></li>
                <li><a href="tools.html">All Tools</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3>Resources</h3>
              <ul class="footer-links">
                <li><a href="about.html">About GEOSPECTRA</a></li>
                <li><a href="team.html">Meet Our Team</a></li>
                <li><a href="documentation.html">Documentation</a></li>
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
          
          <div class="footer-bottom">
            <p>&copy; 2025 GEOSPECTRA. All rights reserved. | Master's Students in Geomatic Engineering, Universitas Gadjah Mada</p>
</div>
        </div>
      </footer>
    `;
  }
}
customElements.define('custom-footer', CustomFooter);
