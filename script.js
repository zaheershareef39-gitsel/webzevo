document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. Core Setup & Utilities
    // ==========================================
    
    document.getElementById('year').textContent = new Date().getFullYear();

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.5, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    const splitTextToSpans = (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const text = el.innerText;
            el.innerHTML = '';
            text.split(' ').forEach((word, i) => {
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.overflow = 'hidden';
                wordSpan.style.paddingRight = '0.2em';
                
                word.split('').forEach(char => {
                    const charSpan = document.createElement('span');
                    charSpan.innerText = char;
                    charSpan.style.display = 'inline-block';
                    charSpan.classList.add('char');
                    wordSpan.appendChild(charSpan);
                });
                
                el.appendChild(wordSpan);
            });
        });
    };

    splitTextToSpans('.split-text');

    // ==========================================
    // Mobile Menu Toggle Logic
    // ==========================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navPill = document.querySelector('.nav-pill');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && navPill) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navPill.classList.toggle('active');
            // Toggle body scroll
            if (navPill.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navPill.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================
    // 2. Custom Cursor & Magnetic Effects
    // ==========================================
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    const magneticElements = document.querySelectorAll('.hover-magnetic');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let followerX = window.innerWidth / 2;
    let followerY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const renderCursor = () => {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        follower.style.transform = `translate(${followerX}px, ${followerY}px)`;

        requestAnimationFrame(renderCursor);
    };
    renderCursor();

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.3)'
            });
        });

        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // ==========================================
    // 3. Initial Loading Sequence
    // ==========================================
    const loaderTL = gsap.timeline({
        onComplete: () => {
            document.body.classList.remove('loading');
            document.body.style.cursor = 'none'; 
        }
    });

    loaderTL.fromTo('.loader-text', { filter: 'blur(10px)', opacity: 0, y: 20 }, { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
            .fromTo('.loader-dot', { filter: 'blur(5px)', opacity: 0, scale: 0 }, { filter: 'blur(0px)', opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.5')
            .to('.loader-progress', { opacity: 1, duration: 0.5 }, '-=0.5')
            .to('.loader', { yPercent: -100, duration: 1.2, ease: 'power4.inOut', delay: 0.5 })
            .fromTo('.hero-badge', { filter: 'blur(10px)', y: 20, opacity: 0 }, { filter: 'blur(0px)', y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
            .fromTo('.hero-headline .split-text', { 
                filter: 'blur(15px)',
                y: 50, 
                opacity: 0
            }, {
                filter: 'blur(0px)',
                y: 0,
                opacity: 1,
                duration: 1, 
                stagger: 0.1, 
                ease: 'power3.out' 
            }, '-=0.6')
            .fromTo('.highlight-stroke', { strokeDasharray: '0, 500', opacity: 0 }, { strokeDasharray: '500, 0', opacity: 1, duration: 1.5, ease: 'power2.out' }, '-=0.5')
            .fromTo('.hero-subheadline', { filter: 'blur(10px)', y: 30, opacity: 0 }, { filter: 'blur(0px)', y: 0, opacity: 1, duration: 1 }, '-=0.8')
            .fromTo('.hero-cta .btn', { filter: 'blur(10px)', y: 30, opacity: 0 }, { filter: 'blur(0px)', y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, '-=0.6')
            .fromTo('.trust-section', { filter: 'blur(10px)', opacity: 0 }, { filter: 'blur(0px)', opacity: 1, duration: 1 }, '-=0.4')
            
            // Right Side Dashboard Animations
            .fromTo('.mockup-browser', { filter: 'blur(20px)', y: 100, opacity: 0 }, { filter: 'blur(0px)', y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }, '-=1.2')
            .fromTo('.mockup-mobile', { filter: 'blur(15px)', x: 50, y: 50, opacity: 0 }, { filter: 'blur(0px)', x: 0, y: 0, opacity: 1, duration: 1, ease: 'back.out(1.2)' }, '-=0.8')
            .fromTo('.mockup-tag', { filter: 'blur(10px)', scale: 0.8, opacity: 0 }, { filter: 'blur(0px)', scale: 1, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.6')
            .fromTo('.visual-orb', { opacity: 0, scale: 0.5 }, { opacity: 0.4, scale: 1, duration: 2, ease: 'power2.out' }, '-=1.5')
            
            .fromTo('.scroll-indicator', { filter: 'blur(5px)', opacity: 0 }, { filter: 'blur(0px)', opacity: 1, duration: 1 }, '-=0.4');

    ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: {className: 'scrolled', targets: '.navbar'}
    });

    // ==========================================
    // 4. Services Section Animations
    // ==========================================
    gsap.fromTo('.s-card', {
        y: 40,
        opacity: 0,
        filter: 'blur(15px)'
    }, {
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 85%',
        },
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // 3D Tilt Hover Effect for Service Cards
    const cards3d = document.querySelectorAll('.hover-3d');
    cards3d.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.4,
                ease: 'power1.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.7,
                ease: 'power2.out'
            });
        });
    });

    // ==========================================
    // 5. Storytelling Scroll Sequence
    // ==========================================
    const storyStages = document.querySelectorAll('.story-stage');
    const visuals = document.querySelectorAll('.s-visual');
    const totalStages = storyStages.length;

    gsap.set(visuals, { opacity: 0, scale: 0.8 });
    gsap.set(visuals[0], { opacity: 1, scale: 1, visibility: 'visible' });

    gsap.set(storyStages, { opacity: 0, y: 50 });
    gsap.set(storyStages[0], { opacity: 1, y: 0, visibility: 'visible' });

    const storyTL = gsap.timeline({
        scrollTrigger: {
            trigger: '.story-pin-container',
            start: 'top top',
            end: '+=4000', 
            pin: true,
            scrub: 1, 
        }
    });

    for(let i = 0; i < totalStages - 1; i++) {
        const currentStage = storyStages[i];
        const nextStage = storyStages[i + 1];
        const currentVisual = visuals[i];
        const nextVisual = visuals[i + 1];

        storyTL.to(currentStage, { opacity: 0, y: -50, duration: 1 })
               .to(currentVisual, { opacity: 0, scale: 1.2, duration: 1 }, '<')
               .set(currentStage, { visibility: 'hidden' })
               .set(currentVisual, { visibility: 'hidden' })
               
               .set(nextStage, { visibility: 'visible' })
               .set(nextVisual, { visibility: 'visible' })
               .to(nextStage, { opacity: 1, y: 0, duration: 1 })
               .to(nextVisual, { opacity: 1, scale: 1, duration: 1 }, '<')
               
               .to({}, { duration: 0.5 });
    }
    
    gsap.to('.grid-wireframe', {
        backgroundPosition: '0px 100px',
        duration: 5,
        repeat: -1,
        ease: 'none'
    });

    gsap.to('.mockup-frame', {
        y: -15,
        rotationX: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });

    gsap.to('.f-card-1', { y: -20, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.f-card-2', { y: 20, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
    gsap.to('.f-card-3', { y: -15, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });

    gsap.to('.nexus-core', {
        scale: 1.2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    // ==========================================
    // 6. Why WEBZEVO Section Animations
    // ==========================================
    
    // Vision Cards Stagger
    gsap.fromTo('.vision-card', {
        y: 40,
        opacity: 0,
        filter: 'blur(15px)'
    }, {
        scrollTrigger: {
            trigger: '.vision-grid',
            start: 'top 80%',
        },
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // Timeline Progress Line Scrub
    gsap.to('.timeline-progress', {
        scrollTrigger: {
            trigger: '.timeline-wrapper',
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: true
        },
        height: '100%',
        ease: 'none'
    });

    // Timeline Steps Stagger & Activation
    const tSteps = document.querySelectorAll('.t-step');
    tSteps.forEach((step, index) => {
        // Fade in
        gsap.fromTo(step, {
            x: 30,
            opacity: 0,
            filter: 'blur(10px)'
        }, {
            scrollTrigger: {
                trigger: step,
                start: 'top 75%',
            },
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.6,
            ease: 'power3.out'
        });

        // Activate Node
        ScrollTrigger.create({
            trigger: step,
            start: 'top 60%',
            onEnter: () => step.classList.add('active'),
            onLeaveBack: () => step.classList.remove('active')
        });
    });

    // ==========================================
    // 7. Process Section Animations
    // ==========================================
    
    // Journey Progress Line Scrub
    gsap.to('.journey-progress', {
        scrollTrigger: {
            trigger: '.process-journey',
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: true
        },
        height: '100%',
        ease: 'none'
    });

    // Process Steps Stagger & Activation
    const pSteps = document.querySelectorAll('.process-step');
    pSteps.forEach((step, index) => {
        // Fade in card
        gsap.fromTo(step.querySelector('.p-card'), {
            y: 40,
            opacity: 0,
            filter: 'blur(15px)'
        }, {
            scrollTrigger: {
                trigger: step,
                start: 'top 80%',
            },
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out'
        });

        // Activate Node
        ScrollTrigger.create({
            trigger: step,
            start: 'top 60%',
            onEnter: () => step.classList.add('active'),
            onLeaveBack: () => step.classList.remove('active')
        });
    });

    // ==========================================
    // 8. Contact Form Handling
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.querySelector('.form-status');
    const btnSubmit = document.querySelector('.btn-submit');
    const btnText = document.querySelector('.btn-text');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Loading State
            btnSubmit.style.pointerEvents = 'none';
            btnText.innerHTML = 'Sending... <span class="loader-dot" style="display:inline-block; margin-left:8px; width:8px; height:8px; background:#fff; border-radius:50%; animation: pulse 1s infinite alternate;"></span>';
            
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactForm.reset();
                    formStatus.style.display = 'block';
                    formStatus.innerHTML = 'Message sent successfully! We will be in touch shortly.';
                    
                    gsap.fromTo(formStatus, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
                } else {
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#ff4757';
                    formStatus.innerHTML = 'Oops! There was a problem submitting your form.';
                }
            } catch (error) {
                formStatus.style.display = 'block';
                formStatus.style.color = '#ff4757';
                formStatus.innerHTML = 'Oops! There was a problem submitting your form.';
            } finally {
                // Reset Button
                btnSubmit.style.pointerEvents = 'auto';
                btnText.innerHTML = 'Send Message';
                
                setTimeout(() => {
                    gsap.to(formStatus, { opacity: 0, y: 10, duration: 0.5, onComplete: () => formStatus.style.display = 'none' });
                }, 5000);
            }
        });
    }

});
