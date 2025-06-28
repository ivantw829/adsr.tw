document.addEventListener('DOMContentLoaded', () => {
    // Animate navigation links
    gsap.from('nav ul li', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Animate hero section content
    gsap.from('section h1, section h2, section p, section img', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: 'section',
            start: 'top 80%'
        }
    });

    // Animate navigation icons on hover
    gsap.utils.toArray('nav ul li a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link.querySelector('i'), {
                scale: 1.2,
                color: '#a32622',
                duration: 0.3
            });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(link.querySelector('i'), {
                scale: 1,
                color: '#ffffff',
                duration: 0.3
            });
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        gsap.to(mobileMenu, {
            height: mobileMenu.classList.contains('active') ? 'auto' : 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
});