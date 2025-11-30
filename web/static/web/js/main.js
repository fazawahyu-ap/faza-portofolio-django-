document.addEventListener('DOMContentLoaded', function() {
    
    // --- 0. SETUP & REGISTRASI ---
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    if (typeof feather !== 'undefined') feather.replace();

    // ===========================================
    // SUPER SMOOTH PRELOADER SEQUENCE
    // ===========================================
    const tl = gsap.timeline({
        onComplete: () => {
            document.body.style.overflow = "auto";
            document.getElementById('preloader').style.display = "none";
        }
    });

    const circleLeft = document.getElementById('circle-left');
    const circleRight = document.getElementById('circle-right');
    const navIsland = document.getElementById('nav-island');
    const navContent = document.getElementById('nav-content');
    const pageContent = document.getElementById('page-content');
    const preloader = document.getElementById('preloader');

    // Matikan scroll di awal
    document.body.style.overflow = "hidden";

    // Hitung posisi tengah layar ke posisi navbar
    const winHeight = window.innerHeight;
    const moveUpDistance = (winHeight / 2) - 40; 

    // 1. INTRO: Bola berdenyut di tengah
    tl.fromTo([circleLeft, circleRight], 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }
    )
    
    // 2. SPLIT: Membelah (Tension)
    .to(circleLeft, { x: -30, duration: 0.6, ease: "power2.inOut" })
    .to(circleRight, { x: 30, duration: 0.6, ease: "power2.inOut" }, "<")

    // 3. MERGE & SHOOT UP: Menyatu lalu melesat ke atas
    .to([circleLeft, circleRight], { 
        x: 0, 
        duration: 0.4, 
        ease: "back.in(1.7)" 
    })
    .to([circleLeft, circleRight], { 
        y: -moveUpDistance,
        scale: 0.5,
        duration: 0.6, 
        ease: "power4.inOut" 
    })

    // 4. NAVBAR EXPANSION: Ledakan menjadi navbar
    .to([circleLeft, circleRight], { opacity: 0, duration: 0.1 })
    .to(navIsland, { 
        opacity: 1, 
        scaleX: 1,
        duration: 0.8, 
        ease: "expo.out" 
    }, "<")

    // 5. NAVBAR CONTENT REVEAL
    .to(navContent, { opacity: 1, duration: 0.5 }, "-=0.4")

    // 6. FADE OUT PRELOADER BACKGROUND
    .to(preloader, { opacity: 0, duration: 0.5 }, "-=0.2")

    // 7. PAGE CONTENT REVEAL
    .to(pageContent, { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: "power3.out" 
    }, "-=0.3");


    // ===========================================
    // 1. DESKTOP: MAGNETIC MARKER
    // ===========================================
    const navLinks = document.querySelectorAll('.nav-desktop-container .nav-link'); 
    const navMarker = document.getElementById('nav-marker');
    const navContainer = document.querySelector('.nav-desktop-container');

    if (navLinks.length > 0 && navMarker && navContainer) {
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                if (window.getComputedStyle(navContainer).opacity === '0') return;
                const rect = e.target.getBoundingClientRect();
                const containerRect = navContainer.getBoundingClientRect();
                const left = rect.left - containerRect.left;
                const width = rect.width;
                gsap.to(navMarker, { left: left, width: width, duration: 0.4, ease: "elastic.out(1, 0.5)", opacity: 1 });
            });
        });
        navContainer.addEventListener('mouseleave', () => {
            gsap.to(navMarker, { opacity: 0, duration: 0.3 });
        });
    }

    // ===========================================
    // 2. NAVIGASI KLIK SMOOTH SCROLL - DIPERBAIKI
    // ===========================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            
            // Skip jika hanya '#' atau link external
            if (targetId === '#' || !targetId.startsWith('#')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Tutup menu mobile jika terbuka
                if (document.body.classList.contains('menu-open')) {
                    const mobileBtn = document.getElementById('mobile-menu-btn');
                    if(mobileBtn) mobileBtn.click(); 
                }

                // Smooth scroll dengan offset untuk navbar fixed
                const navbarHeight = document.getElementById('navbar-wrapper').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================================
    // 3. LOGIC NAVBAR MENYUSUT (SHRINK ON SCROLL)
    // ===========================================
    const navWrapper = document.getElementById('nav-island'); 
    
    function checkScroll() {
        if (document.body.classList.contains('menu-open')) return;
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            document.body.classList.add('scrolled-mode');
        } else {
            document.body.classList.remove('scrolled-mode');
        }
    }
    window.addEventListener('scroll', checkScroll);
    checkScroll(); 

    // ===========================================
    // 4. MOBILE MENU LOGIC
    // ===========================================
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const bar1 = document.getElementById('bar1');
    const bar2 = document.getElementById('bar2');
    let isMenuOpen = false;
    const initialHeight = "66px"; 

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            document.body.classList.add('menu-open');
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            gsap.to(bar1, { rotation: 45, y: 4, duration: 0.3 });
            gsap.to(bar2, { rotation: -45, y: -4, duration: 0.3 });
            gsap.to(navIsland, { height: "auto", borderRadius: "2rem", duration: 0.5, ease: "power3.out", backgroundColor: "rgba(10, 10, 10, 0.95)" });
            gsap.fromTo(".mobile-link", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.2 });
        } else {
            document.body.classList.remove('menu-open');
            gsap.to(bar1, { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(bar2, { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(navIsland, {
                height: initialHeight, duration: 0.4, ease: "power3.inOut", backgroundColor: "rgba(10, 10, 10, 0.7)",
                onComplete: () => {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('flex');
                    navIsland.style.height = ''; 
                }
            });
        }
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMenu);
    }

    // ===========================================
    // 5. ANIMASI SCROLL REVEAL
    // ===========================================
    gsap.utils.toArray('.gs-reveal').forEach(elem => {
        gsap.from(elem, {
            y: 50, opacity: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" }
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
    // 7. TRANSLATION LOGIC
    // ===========================================
    let currentLang = localStorage.getItem('selected_lang') || 'en';
    window.switchLanguage = function(lang) {
        if (typeof translations === 'undefined') return;
        const data = translations[lang];
        if (!data) return;
        localStorage.setItem('selected_lang', lang);
        currentLang = lang;
        const elements = document.querySelectorAll('[data-translate-key]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate-key');
            if (data[key]) {
                gsap.to(el, { opacity: 0, duration: 0.2, onComplete: () => {
                    el.innerHTML = data[key];
                    gsap.to(el, { opacity: 1, duration: 0.2 });
                    if (typeof feather !== 'undefined') feather.replace();
                }});
            }
        });
        const text = lang.toUpperCase();
        const deskBtn = document.getElementById('lang-btn-text');
        const mobBtn = document.getElementById('mobile-lang-text');
        if(deskBtn) deskBtn.textContent = text;
        if(mobBtn) mobBtn.textContent = text;
    };
    setTimeout(() => switchLanguage(currentLang), 100);
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