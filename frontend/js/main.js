document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#a32622' },
                shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
                opacity: { value: 0.9, random: true, anim: { enable: true, speed: 1, opacity_min: 0.2, sync: false } },
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
                line_linked: { enable: true, distance: 150, color: '#a32622', opacity: 0.8, width: 1 },
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

    document.querySelectorAll('.nav-links').forEach(nav => {
        nav.style.display = 'flex';
        nav.style.opacity = '1';
    });

    gsap.from('.nav-link:not(.nav-link-home)', {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        onComplete: () => {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.style.opacity = '1';
                link.style.transform = 'scale(1)';
            });
        }
    });

    gsap.from('.nav-link-home', {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
            document.querySelectorAll('.nav-link-home').forEach(link => {
                link.style.opacity = '1';
                link.style.transform = 'scale(1)';
            });
        }
    });

    gsap.from('.nav-logo', {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('section h1, section h2, section p, section img', {
        y: 30,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: 'power3.out',
        onComplete: () => {
            document.querySelectorAll('section h1, section h2, section p, section img').forEach(el => {
                gsap.set(el, { autoAlpha: 1, opacity: 1 });
            });
        }
    });

    gsap.utils.toArray('.nav-link, .nav-logo').forEach(link => {
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
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = link.getAttribute('href');
        });
    });
});