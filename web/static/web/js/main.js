document.addEventListener('DOMContentLoaded', function() {
    
    // --- 0. REGISTER GSAP PLUGIN ---
    gsap.registerPlugin(Observer);
    
    // Init Feather Icons
    if (typeof feather !== 'undefined') feather.replace();

    // ===========================================
    // 1. PRELOADER SEQUENCE
    // ===========================================
    const circleLeft = document.getElementById('circle-left');
    const circleRight = document.getElementById('circle-right');
    const navIsland = document.getElementById('nav-island');
    const navContent = document.getElementById('nav-content');
    const preloader = document.getElementById('preloader');

    const tl = gsap.timeline({
        onComplete: () => {
            initFullPageScroll(); // Mulai scroll logic setelah loading
        }
    });

    const winHeight = window.innerHeight;
    const moveUpDistance = (winHeight / 2) - 40; 

    tl.fromTo([circleLeft, circleRight], 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }
    )
    .to(circleLeft, { x: -30, duration: 0.6, ease: "power2.inOut" })
    .to(circleRight, { x: 30, duration: 0.6, ease: "power2.inOut" }, "<")
    .to([circleLeft, circleRight], { x: 0, duration: 0.4, ease: "back.in(1.7)" })
    .to([circleLeft, circleRight], { y: -moveUpDistance, scale: 0.5, duration: 0.6, ease: "power4.inOut" })
    .to([circleLeft, circleRight], { opacity: 0, duration: 0.1 })
    .to(navIsland, { opacity: 1, scaleX: 1, duration: 0.8, ease: "expo.out" }, "<")
    .to(navContent, { opacity: 1, duration: 0.5 }, "-=0.4")
    .to(preloader, { opacity: 0, display: "none", duration: 0.5 }, "-=0.2");


    // ===========================================
    // 2. FULL PAGE SCROLL LOGIC (MOBILE OPTIMIZED)
    // ===========================================
    function initFullPageScroll() {
        const sections = document.querySelectorAll(".fp-section");
        const navLinks = document.querySelectorAll(".nav-link, .mobile-link, .nav-link-home");
        
        let currentIndex = 0;
        let isAnimating = false;
        const totalSections = sections.length;

        // Set Initial State
        gsap.set(sections, { autoAlpha: 0, zIndex: 0 });
        gsap.set(sections[0], { autoAlpha: 1, zIndex: 1 });
        updateNavbarState(0);

        // Fungsi Ganti Slide
        function gotoSection(index) {
            if (index === currentIndex || index < 0 || index >= totalSections || isAnimating) return;
            
            isAnimating = true;
            const currentSection = sections[currentIndex];
            const nextSection = sections[index];

            gsap.set(nextSection, { zIndex: 10 });
            gsap.set(currentSection, { zIndex: 1 });

            const tlTransition = gsap.timeline({
                onComplete: () => {
                    isAnimating = false;
                    currentIndex = index;
                    updateNavbarState(index);
                    gsap.set(currentSection, { autoAlpha: 0, zIndex: 0 });
                }
            });

            // Animasi Keluar
            tlTransition.to(currentSection, {
                autoAlpha: 0,
                scale: 0.95,
                filter: "blur(10px)",
                duration: 0.8,
                ease: "power3.inOut"
            }, 0);

            // Animasi Masuk
            tlTransition.fromTo(nextSection, {
                autoAlpha: 0,
                scale: 1.05,
                filter: "blur(10px)"
            }, {
                autoAlpha: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power3.inOut"
            }, 0);
        }

        // Observer (Scroll Handler)
        Observer.create({
            type: "wheel,touch,pointer",
            wheelSpeed: -1,
            onDown: () => !isAnimating && gotoSection(currentIndex - 1),
            onUp: () => !isAnimating && gotoSection(currentIndex + 1),
            // OPTIMASI MOBILE:
            tolerance: 50, // Perlu swipe agak panjang baru ganti slide (biar gak sensitif)
            preventDefault: true,
            ignore: ".scrollable-content" // PENTING: Biarkan user scroll teks di dalam konten dulu
        });

        // Navbar Click Handler
        const sectionIds = Array.from(sections).map(sec => sec.id);

        navLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if(!href || href === "#") return;
                
                const targetId = href.substring(1);
                const targetIndex = sectionIds.indexOf(targetId);

                if (targetIndex !== -1) {
                    e.preventDefault();
                    gotoSection(targetIndex);

                    // Tutup menu mobile jika sedang terbuka
                    if(document.body.classList.contains('menu-open')) {
                        toggleMenu(); 
                    }
                }
            });
        });

        function updateNavbarState(index) {
            document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('text-brand-yellow'));
            
            const activeId = sections[index].id;
            const activeLinks = document.querySelectorAll(`a[href="#${activeId}"]`);
            activeLinks.forEach(link => {
                if(link.classList.contains('nav-link')) {
                    link.classList.add('text-brand-yellow');
                }
            });

            // Efek Shrink Navbar
            if (index > 0) {
                document.body.classList.add('scrolled-mode');
            } else {
                document.body.classList.remove('scrolled-mode');
            }
        }
    }

    // ===========================================
    // 3. MOBILE MENU LOGIC
    // ===========================================
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const bar1 = document.getElementById('bar1');
    const bar2 = document.getElementById('bar2');
    let isMenuOpen = false;
    const initialHeight = "66px";

    window.toggleMenu = function() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            document.body.classList.add('menu-open');
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            
            gsap.to(bar1, { rotation: 45, y: 4, duration: 0.3 });
            gsap.to(bar2, { rotation: -45, y: -4, duration: 0.3 });
            gsap.to(navIsland, { height: "auto", borderRadius: "2rem", duration: 0.5, ease: "power3.out", backgroundColor: "rgba(10, 10, 10, 0.98)" });
            gsap.fromTo(".mobile-link", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.2 });
        } else {
            document.body.classList.remove('menu-open');
            gsap.to(bar1, { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(bar2, { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(navIsland, {
                height: initialHeight, duration: 0.4, ease: "power3.inOut", backgroundColor: "rgba(10, 10, 10, 0.85)",
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
    // 4. SPOTLIGHT CARD EFFECT
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
    // 5. TRANSLATION LOGIC (COMPLETE)
    // ===========================================
    
    if (typeof translations === 'undefined' || !translations) {
        console.error("Translation data MISSING from Django View!");
    } else {
        console.log("Translations loaded.");
    }

    let currentLang = localStorage.getItem('selected_lang') || 'id'; 
    
    window.switchLanguage = function(lang) {
        if (typeof translations === 'undefined') return;
        
        localStorage.setItem('selected_lang', lang);
        currentLang = lang;

        // 1. Update Tombol Navbar
        const btnText = lang.toUpperCase(); 
        const deskBtnText = document.getElementById('lang-btn-text');
        const mobBtnText = document.getElementById('mobile-lang-text');
        if(deskBtnText) deskBtnText.textContent = btnText;
        if(mobBtnText) mobBtnText.textContent = btnText;

        // 2. Toggle Konten Database (.lang-id vs .lang-en)
        const idElements = document.querySelectorAll('.lang-id');
        const enElements = document.querySelectorAll('.lang-en');

        if (lang === 'id') {
            enElements.forEach(el => el.classList.add('hidden'));
            idElements.forEach(el => el.classList.remove('hidden'));
        } else {
            idElements.forEach(el => el.classList.add('hidden'));
            enElements.forEach(el => el.classList.remove('hidden'));
        }

        // 3. Update Teks Statis (data-translate-key)
        const data = translations[lang];
        if (data) {
            const elements = document.querySelectorAll('[data-translate-key]');
            elements.forEach(el => {
                const key = el.getAttribute('data-translate-key');
                if (data[key]) {
                    gsap.to(el, { opacity: 0, duration: 0.15, onComplete: () => {
                        // Cek apakah elemen input form (placeholder) atau teks biasa
                        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                            el.setAttribute('placeholder', data[key]);
                        } else {
                            el.innerHTML = data[key];
                        }
                        gsap.to(el, { opacity: 1, duration: 0.15 });
                    }});
                }
            });
        }
        
        // Re-init feather icons
        setTimeout(() => { if (typeof feather !== 'undefined') feather.replace(); }, 200);
    };

    // Jalankan bahasa awal
    switchLanguage(currentLang);

    // Event Listener Tombol Bahasa
    const toggleLang = (e) => {
        e.preventDefault();
        const btn = e.currentTarget;
        const icon = btn.querySelector('svg');
        if(icon) gsap.fromTo(icon, {rotation: 0}, {rotation: 360, duration: 0.5, ease: "back.out(1.7)"});

        const newLang = currentLang === 'id' ? 'en' : 'id';
        switchLanguage(newLang);
    };

    const deskLangBtn = document.getElementById('lang-toggle-btn');
    const mobLangBtn = document.getElementById('mobile-lang-btn');
    if(deskLangBtn) deskLangBtn.addEventListener('click', toggleLang);
    if(mobLangBtn) mobLangBtn.addEventListener('click', toggleLang);


    // ===========================================
    // 6. FEEDBACK FORM (AJAX)
    // ===========================================
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btn = document.getElementById('fb_submit_btn');
            const btnText = document.getElementById('fb_btn_text');
            const statusMsg = document.getElementById('fb_status');
            const originalText = btnText.innerText;

            // State Loading
            btn.disabled = true;
            btnText.innerText = "Sending..."; 
            btn.classList.add('opacity-70', 'cursor-not-allowed');

            const formData = {
                name: document.getElementById('fb_name').value,
                email: document.getElementById('fb_email').value,
                message: document.getElementById('fb_message').value
            };

            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            // Helper ambil teks pesan sesuai bahasa
            const getTrans = (key, fallback) => {
                if (translations && translations[currentLang] && translations[currentLang][key]) {
                    return translations[currentLang][key];
                }
                return fallback;
            };

            const msgSuccess = getTrans('feedback_success', 'Terima kasih! Pesan terkirim.');
            const msgError = getTrans('feedback_error', 'Gagal mengirim pesan.');

            try {
                const response = await fetch('/api/submit-feedback/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                statusMsg.classList.remove('hidden', 'text-green-500', 'text-red-500');
                
                if (response.ok && result.status === 'success') {
                    // Sukses
                    statusMsg.innerText = msgSuccess;
                    statusMsg.classList.add('text-green-500');
                    feedbackForm.reset(); 
                } else {
                    // Gagal dari server
                    throw new Error(result.message || msgError);
                }

            } catch (error) {
                // Gagal koneksi
                statusMsg.innerText = msgError + " (" + error.message + ")";
                statusMsg.classList.add('text-red-500');
            } finally {
                // Reset Tombol
                btn.disabled = false;
                // Kembalikan teks tombol sesuai bahasa aktif dari database
                if (translations && translations[currentLang] && translations[currentLang]['footer_form_button']) {
                     btnText.innerText = translations[currentLang]['footer_form_button'];
                } else {
                     btnText.innerText = "Kirim Pesan"; 
                }
                
                btn.classList.remove('opacity-70', 'cursor-not-allowed');
                
                // Hilangkan pesan status setelah 5 detik
                setTimeout(() => { statusMsg.classList.add('hidden'); }, 5000);
            }
        });
    }

});