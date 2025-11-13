class CustomNavbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                nav {
                    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                    backdrop-filter: blur(10px);
                    padding: 1rem 0;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                }

                .container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .logo {
                    font-size: 1.75rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #27ae60, #f39c12, #e74c3c);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    transition: transform 0.3s ease;
                }

                .logo:hover {
                    transform: scale(1.05);
                }

                .logo img {
                    height: 40px;
                    width: 40px;
                    margin-right: 0.75rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .nav-links {
                    display: flex;
                    gap: 2.5rem;
                    align-items: center;
                }

                .nav-link {
                    color: #4b5563;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    position: relative;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-size: 0.95rem;
                }

                .nav-link:hover {
                    color: #27ae60;
                    background: rgba(39, 174, 96, 0.1);
                    transform: translateY(-2px);
                }

                .nav-link.active {
                    color: #27ae60;
                    background: rgba(39, 174, 96, 0.15);
                }

                .nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 6px;
                    height: 6px;
                    background: linear-gradient(135deg, #27ae60, #f39c12);
                    border-radius: 50%;
                }

                .nav-link.report-link {
                    background: linear-gradient(135deg, #e74c3c, #c0392b);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 25px;
                    font-weight: 700;
                    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
                    transition: all 0.3s ease;
                }

                .nav-link.report-link:hover {
                    background: linear-gradient(135deg, #c0392b, #a93226);
                    color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
                }

                .mobile-menu-btn {
                    display: none;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #4b5563;
                    padding: 0.5rem;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .mobile-menu-btn:hover {
                    background: rgba(75, 85, 99, 0.1);
                }

                @media (max-width: 768px) {
                    .container {
                        padding: 0 1rem;
                    }

                    .logo {
                        font-size: 1.5rem;
                    }

                    .logo img {
                        height: 32px;
                        width: 32px;
                        margin-right: 0.5rem;
                    }

                    .nav-links {
                        position: fixed;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: white;
                        flex-direction: column;
                        gap: 0;
                        padding: 1rem 0;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                        transform: translateY(-100%);
                        opacity: 0;
                        visibility: hidden;
                        transition: all 0.3s ease;
                    }

                    .nav-links.active {
                        transform: translateY(0);
                        opacity: 1;
                        visibility: visible;
                    }

                    .nav-link {
                        padding: 1rem 2rem;
                        width: 100%;
                        text-align: center;
                        border-radius: 0;
                    }

                    .nav-link.report-link {
                        margin: 1rem 2rem;
                        width: auto;
                        border-radius: 25px;
                    }

                    .mobile-menu-btn {
                        display: block;
                    }
                }
            </style>
            <nav>
                <div class="container">
                    <a href="index.html" class="logo">
                        <img src="images/logo Geospectra.png" alt="GEOSPECTRA Logo">
                        GEOSPECTRA
                    </a>
                    
                    <div class="nav-links" id="navLinks">
                        <a href="index.html" class="nav-link" data-page="index"> Home</a>
                        <a href="tools.html" class="nav-link" data-page="tools"> Tools</a>
                        <a href="about.html" class="nav-link" data-page="about"> About</a>
                        <a href="team.html" class="nav-link" data-page="team">   Meet Our Team</a>
                        <a href="report-issue.html" class="nav-link report-link" data-page="report-issue">🚨 Report an Issue</a>
                    </div>

                    <button class="mobile-menu-btn" id="mobileMenuBtn">
                        ☰
                    </button>
                </div>
            </nav>
        `;
    }

    setupEventListeners() {
        const mobileMenuBtn = this.shadowRoot.getElementById('mobileMenuBtn');
        const navLinks = this.shadowRoot.getElementById('navLinks');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            });

            // Close mobile menu when clicking on a link
            navLinks.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.textContent = '☰';
                }
            });
        }

        // Set active link based on current page
        this.setActiveLink();
    }

    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = this.shadowRoot.querySelectorAll('.nav-link');
        
        links.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (currentPage.includes(linkPage) || (currentPage === '' && linkPage === 'index')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

customElements.define('custom-navbar', CustomNavbar);
