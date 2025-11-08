class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        nav {
          background: white;
          padding: 1rem 2rem;
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(to right, #27ae60, #f39c12);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .logo-icon {
          margin-right: 0.5rem;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-link {
          color: #4b5563;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.3s;
          position: relative;
        }
        .nav-link:hover {
          color: #27ae60;
        }
        .nav-link.active {
          color: #27ae60;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, #27ae60, #f39c12);
        }
      </style>
      <nav>
        <div class="container">
          <a href="index.html" class="logo">
            <img src="logo.jpg" alt="GEOSPECTRA Logo" class="h-8 mr-2">
            GEOSPECTRA
          </a>
          <div class="nav-links">
            <a href="tools.html" class="nav-link">Home</a>
            <a href="tools.html" class="nav-link">Tools</a>
            <a href="about.html" class="nav-link">About</a>
            <a href="team.html" class="nav-link">Meet Our Team</a>
          </div>
        </div>
      </nav>
    `;
  }
}
customElements.define('custom-navbar', CustomNavbar);
