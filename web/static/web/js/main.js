document.addEventListener('DOMContentLoaded', function() {
    
    // --- 0. SETUP & REGISTRASI ---
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    if (typeof feather !== 'undefined') feather.replace();

    // ===========================================
    // 1. DESKTOP: MAGNETIC MARKER (GLOWING PILL)
    // ===========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const navMarker = document.getElementById('nav-marker');
    const navContainer = document.querySelector('.nav-desktop-container');

    if (navLinks.length > 0 && navMarker) {
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const rect = e.target.getBoundingClientRect();
                const containerRect = navContainer.getBoundingClientRect();
                const left = rect.left - containerRect.left;
                const width = rect.width;

                gsap.to(navMarker, {
                    left: left, width: width, duration: 0.4,
                    ease: "elastic.out(1, 0.5)", opacity: 1
                });
            });
        });

        navContainer.addEventListener('mouseleave', () => {
            gsap.to(navMarker, { opacity: 0, duration: 0.3 });
        });
    }

// ===========================================
    // 2. NAVIGASI KLIK SMOOTH SCROLL (SUPER SAFE MODE)
    // ===========================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            const targetId = link.getAttribute("href");
            
            // LOGIC BARU:
            // 1. Pastikan targetId ada
            // 2. Pastikan panjangnya lebih dari 1 karakter (jadi '#' saja tidak akan lolos)
            // 3. Pastikan element tujuan benar-benar ada di HTML
            if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
                try {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault(); // Matikan lompatan kasar
                        
                        // Tutup menu mobile jika terbuka
                        if (document.body.classList.contains('menu-open')) {
                            const mobileBtn = document.getElementById('mobile-menu-btn');
                            if(mobileBtn) mobileBtn.click(); 
                        }

                        // Animasi Scroll GSAP
                        gsap.to(window, {
                            scrollTo: { y: targetId, offsetY: 80 }, 
                            duration: 1,
                            ease: "power2.inOut"
                        });
                    }
                } catch (error) {
                    // Jika selector tidak valid (misal link aneh), biarkan default click
                    console.warn("GSAP Scroll skipped for:", targetId);
                }
            }
            // Jika link cuma '#' atau link external, biarkan browser menanganinya secara normal
        });
    });

    // ===========================================
    // 3. LOGIC NAVBAR MENYUSUT (SHRINK ON SCROLL)
    // ===========================================
    const navWrapper = document.querySelector('.fixed.top-5');
    
    function checkScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            document.body.classList.add('scrolled-mode');
            if (navWrapper) navWrapper.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled-mode');
            if (navWrapper) navWrapper.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Cek saat load awal

    // ===========================================
    // 4. MOBILE MENU LOGIC
    // ===========================================
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navIsland = document.querySelector('.nav-island');
    const bar1 = document.getElementById('bar1');
    const bar2 = document.getElementById('bar2');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            document.body.classList.add('menu-open');
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');

            gsap.to(bar1, { rotation: 45, y: 4, duration: 0.3 });
            gsap.to(bar2, { rotation: -45, y: -4, duration: 0.3 });

            gsap.to(navIsland, {
                height: "auto", borderRadius: "2rem", duration: 0.6, ease: "power4.out"
            });

            gsap.fromTo(".mobile-link", 
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.2 }
            );
        } else {
            document.body.classList.remove('menu-open');
            gsap.to(bar1, { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(bar2, { rotation: 0, y: 0, duration: 0.3 });

            gsap.to(navIsland, {
                height: "60px", duration: 0.5, ease: "power3.inOut",
                onComplete: () => {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('flex');
                    navIsland.style.height = ''; 
                }
            });
        }
    }

    if (mobileBtn) mobileBtn.addEventListener('click', toggleMenu);

    // ===========================================
    // 5. ANIMASI SCROLL REVEAL
    // ===========================================
    gsap.utils.toArray('.gs-reveal').forEach(elem => {
        gsap.from(elem, {
            y: 50, opacity: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: elem, start: "top 85%" }
        });
    });

    // ===========================================
    // 6. SPOTLIGHT CARD EFFECT
    // ===========================================
    document.querySelectorAll('.spotlight-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ===========================================
    // 7. TRANSLATION LOGIC (DEFAULT EN)
    // ===========================================
    let currentLang = localStorage.getItem('selected_lang') || 'en';

    window.switchLanguage = function(lang) {
        if (typeof translations === 'undefined') return;
        const data = translations[lang];
        if (!data) return;

        localStorage.setItem('selected_lang', lang);
        currentLang = lang;

        const elements = document.querySelectorAll('[data-translate-key]');
        gsap.to(elements, {
            opacity: 0, y: -5, duration: 0.2,
            onComplete: () => {
                elements.forEach(el => {
                    const key = el.getAttribute('data-translate-key');
                    if (data[key]) el.innerHTML = data[key];
                });
                gsap.to(elements, { opacity: 1, y: 0, duration: 0.3 });
                if (typeof feather !== 'undefined') feather.replace();
            }
        });

        const text = lang.toUpperCase();
        const deskBtn = document.getElementById('lang-btn-text');
        const mobBtn = document.getElementById('mobile-lang-text');
        if(deskBtn) deskBtn.textContent = text;
        if(mobBtn) mobBtn.textContent = text;
    };

    // Jalankan saat load
    switchLanguage(currentLang);

    const toggleLang = (e) => {
        e.preventDefault();
        const newLang = currentLang === 'en' ? 'id' : 'en';
        switchLanguage(newLang);
    };

    const deskLangBtn = document.getElementById('lang-toggle-btn');
    const mobLangBtn = document.getElementById('mobile-lang-btn');
    
    if(deskLangBtn) deskLangBtn.addEventListener('click', toggleLang);
    if(mobLangBtn) mobLangBtn.addEventListener('click', toggleLang);
});