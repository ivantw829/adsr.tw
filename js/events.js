document.addEventListener('DOMContentLoaded', () => {
    fetch('../data/events.json')
        .then(response => response.json())
        .then(data => {
            // Sort events by date in descending order (latest first)
            data.sort((a, b) => new Date(b.date) - new Date(a.date));

            const eventsList = document.getElementById('events-list');
            data.forEach((event, index) => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card p-6 rounded-lg shadow-glass';
                eventCard.innerHTML = `
                    <h3 class="text-xl font-bold font-montserrat mb-2">${event.title}</h3>
                    <p class="text-gray-300 font-source-han mb-2">${event.date}</p>
                    <p class="text-gray-300 font-source-han mb-4">${event.description}</p>
                    <a href="${event.link}" class="text-red-700 hover:text-red-800 font-source-han">了解更多</a>
                `;
                eventsList.appendChild(eventCard);

                // GSAP animation for each card
                gsap.from(eventCard, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
                    delay: index * 0.2,
                    ease: 'power3.out',
                    onComplete: () => {
                        eventCard.classList.add('visible');
                    }
                });

                // Parallax effect
                gsap.from(eventCard, {
                    y: -10 * index,
                    scrollTrigger: {
                        trigger: eventCard,
                        start: 'top 80%',
                        scrub: 1
                    }
                });

                // Hover effect for touch devices
                eventCard.addEventListener('touchstart', () => {
                    gsap.to(eventCard, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
                eventCard.addEventListener('touchend', () => {
                    gsap.to(eventCard, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });
        })
        .catch(error => console.error('Error loading events:', error));
});