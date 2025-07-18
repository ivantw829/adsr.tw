document.addEventListener('DOMContentLoaded', () => {
    const categoryColors = {
        "各校行動": "#8122a3",
        "升學主義": "#d97742",
        "心理健康": "#6b8f71",
        "校園霸凌": "#2a9d8f",
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
            events.forEach(([title, content, date, category, link], index) => {
                const eventCard = document.createElement('div');
                eventCard.classList.add('event-card', 'bg-gray-800', 'p-6', 'rounded-lg', 'shadow-lg');
                eventCard.style.borderLeft = `4px solid ${categoryColors[category.replace('#', '')] || '#a32622'}`;
                eventCard.innerHTML = `
                    <h3 class="text-xl font-bold text-red-700 font-montserrat animate-text">${title}</h3>
                    <p class="text-gray-300 mt-2 font-source-han">${content}</p>
                    <p class="text-gray-400 mt-2 font-roboto">${date}</p>
                    <p class="text-sm text-gray-400 font-roboto">${category}</p>
                    <a href="${link}" class="text-red-700 hover:underline mt-4 inline-block font-source-han shine-effect">查看更多</a>
                `;
                eventsList.appendChild(eventCard);

                gsap.set(eventCard, { opacity: 1, x: 0 });

                gsap.from(eventCard, {
                    x: index % 2 === 0 ? 20 : -20,
                    duration: 'ontouchstart' in window || navigator.maxTouchPoints > 0 ? 0.3 : 0.4,
                    delay: index * 0.05,
                    ease: 'power2.out'
                });

                const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

                if (!isTouchDevice) {
                    eventCard.addEventListener('mouseenter', () => {
                        gsap.to(eventCard, {
                            scale: 1.05,
                            backgroundColor: 'rgba(55, 65, 81, 0.7)',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    });
                    eventCard.addEventListener('mouseleave', () => {
                        gsap.to(eventCard, {
                            scale: 1,
                            backgroundColor: 'rgba(31, 41, 55, 0.2)',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    });
                } else {
                    eventCard.addEventListener('touchstart', () => {
                        gsap.to(eventCard, {
                            scale: 1.05,
                            duration: 0.2,
                            ease: 'power2.out'
                        });
                    });
                    eventCard.addEventListener('touchend', () => {
                        gsap.to(eventCard, {
                            scale: 1,
                            duration: 0.2,
                            ease: 'power2.out'
                        });
                    });
                }
            });
        })
        .catch(error => console.error('Error loading events:', error));
});