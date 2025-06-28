document.addEventListener('DOMContentLoaded', () => {
    // Initialize Particles.js for Home Page
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#a32622' },
                shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
                opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
                line_linked: { enable: true, distance: 150, color: '#a32622', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });
    }

    // Animate navigation links with slide-in effect
    gsap.from('nav ul li', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Animate navigation logo and text
    gsap.from('nav a.text-2xl', {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Animate hero section content
    gsap.from('section h1, section h2, section p, section img', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: 'section',
            start: 'top 80%'
        }
    });

    // Animate navigation icons and logo on hover
    gsap.utils.toArray('nav ul li a, nav a.text-2xl').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link.querySelector('i') || link.querySelector('.logo-icon'), {
                scale: 1.2,
                color: '#a32622',
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(link, {
                color: '#a32622',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(link.querySelector('i') || link.querySelector('.logo-icon'), {
                scale: 1,
                color: '#ffffff',
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(link, {
                color: '#ffffff',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Mobile menu toggle with slide-in animation
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        gsap.to(mobileMenu, {
            height: mobileMenu.classList.contains('active') ? 'auto' : 0,
            duration: 0.5,
            ease: 'power3.out',
            onStart: () => {
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.style.display = 'flex';
                    gsap.from(mobileMenu.querySelectorAll('li'), {
                        x: -50,
                        opacity: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: 'power3.out'
                    });
                }
            },
            onComplete: () => {
                if (!mobileMenu.classList.contains('active')) {
                    mobileMenu.style.display = 'none';
                }
            }
        });
    });
});