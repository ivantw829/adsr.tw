document.addEventListener('DOMContentLoaded', () => {
    const categoryColors = {
        "各校行動": "#8122a3",
        "升學主義": "#d97742",
        "心理健康": "#6b8f71",
        "網路霸凌": "#2a9d8f",
        "網路性犯罪": "#924e7d",
        "性少數困境": "#da7ba7",
        "倡議行動": "#a32622",
        "時事分析": "#cda434",
        "活動快報": "#4fa322",
        "手機管制": "#2e64be"
    };

    fetch('../data/events.json')
        .then(response => response.json())
        .then(events => {
            const eventsList = document.getElementById('events-list');
            events.forEach(([title, content, date, category, link]) => {
                const eventCard = document.createElement('div');
                eventCard.classList.add('event-card', 'bg-gray-800', 'p-6', 'rounded-lg', 'shadow-lg');
                eventCard.style.borderLeft = `4px solid ${categoryColors[category.replace('#', '')]}`;
                eventCard.innerHTML = `
                    <h3 class="text-xl font-bold text-red-700 font-montserrat animate-text">${title}</h3>
                    <p class="text-gray-300 mt-2 font-source-han">${content}</p>
                    <p class="text-gray-400 mt-2 font-roboto">${date}</p>
                    <p class="text-sm text-gray-400 font-roboto">${category}</p>
                    <a href="${link}" class="text-red-700 hover:underline mt-4 inline-block font-source-han shine-effect">查看更多</a>
                `;
                eventsList.appendChild(eventCard);
            });

            // Detect if the device is touch-enabled
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            // Animate event cards with parallax effect
            gsap.utils.toArray('.event-card').forEach((card, index) => {
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        onEnter: () => card.classList.add('visible')
                    },
                    y: -10 * index,
                    opacity: 1,
                    duration: isTouchDevice ? 0.3 : 0.5,
                    ease: 'power2.out'
                });

                if (!isTouchDevice) {
                    // Simplified hover effect for desktop
                    card.addEventListener('mouseenter', () => {
                        gsap.to(card, {
                            scale: 1.05,
                            backgroundColor: 'rgba(55, 65, 81, 0.7)',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    });
                    card.addEventListener('mouseleave', () => {
                        gsap.to(card, {
                            scale: 1,
                            backgroundColor: 'rgba(31, 41, 55, 0.2)',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    });
                } else {
                    // Touch interaction for mobile devices
                    card.addEventListener('touchstart', () => {
                        gsap.to(card, {
                            scale: 1.05,
                            duration: 0.2,
                            ease: 'power2.out'
                        });
                    });
                    card.addEventListener('touchend', () => {
                        gsap.to(card, {
                            scale: 1,
                            duration: 0.2,
                            ease: 'power2.out'
                        });
                    });
                }
            });
        });
});