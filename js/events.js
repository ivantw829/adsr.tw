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
                    <h3 class="text-xl font-bold text-red-700 font-montserrat">${title}</h3>
                    <p class="text-gray-300 mt-2 font-source-han">${content}</p>
                    <p class="text-gray-400 mt-2 font-roboto">${date}</p>
                    <p class="text-sm text-gray-400 font-roboto">${category}</p>
                    <a href="${link}" class="text-red-700 hover:underline mt-4 inline-block font-source-han">查看更多</a>
                `;
                eventsList.appendChild(eventCard);
            });

            // Animate event cards on scroll
            gsap.utils.toArray('.event-card').forEach(card => {
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        onEnter: () => card.classList.add('visible')
                    }
                });
            });
        });
});