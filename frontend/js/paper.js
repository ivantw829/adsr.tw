document.addEventListener('DOMContentLoaded', async () => {
    const papersGrid = document.getElementById('papers-grid');
    const loadingMessage = document.getElementById('loading-message');
    const noPapersMessage = document.getElementById('no-papers-message');

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

    function getCategoryColorFromMeta() {
        const meta = document.querySelector('meta[name="tag"]');
        console.log('[paper.js] meta[name="tag"]:', meta);
        if (!meta) return null;
        let tag = meta.getAttribute('content');
        console.log('[paper.js] meta tag content:', tag);
        if (tag.startsWith('#')) tag = tag.slice(1);
        return categoryColors[tag] || '#ffffff';
    }
    window.getCategoryColorFromMeta = getCategoryColorFromMeta;

    try {
        loadingMessage.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>載入文章中...';
        loadingMessage.classList.remove('hidden');
        if (noPapersMessage) {
            noPapersMessage.hidden = true;
            noPapersMessage.style.display = 'none';
            noPapersMessage.classList.add('hidden');
            noPapersMessage.setAttribute('aria-hidden', 'true');
            noPapersMessage.style.visibility = 'hidden';
            noPapersMessage.style.opacity = '0';
        }

        const response = await fetch('/api/papers');
        if (!response.ok) throw new Error('無法取得文章列表');
        const papers = await response.json();

        papersGrid.innerHTML = '';
        papers.forEach((paper, index) => {
            let cat = paper.category;
            if (cat && cat.startsWith('#')) cat = cat.slice(1);
            const color = categoryColors[cat] || '#a32622';
            const card = document.createElement('div');
            card.classList.add('event-card', 'bg-gray-800', 'p-6', 'rounded-lg', 'shadow-lg', 'mb-4', 'flex', 'items-center');
            card.style.borderLeft = `4px solid ${color}`;
            card.style.maxWidth = '90%';
            card.style.marginLeft = 'auto';
            card.style.marginRight = 'auto';
            if (noPapersMessage) {
                noPapersMessage.hidden = true;
                noPapersMessage.style.display = 'none';
                noPapersMessage.classList.add('hidden');
                noPapersMessage.setAttribute('aria-hidden', 'true');
                noPapersMessage.style.visibility = 'hidden';
                noPapersMessage.style.opacity = '0';
            }

            card.innerHTML = `
                <div class="flex-1 min-w-0 pr-4">
                    <h3 class="text-xl font-bold text-red-700 font-montserrat animate-text">${paper.title}</h3>
                    <p class="text-gray-300 mt-2 font-source-han">${paper.description}</p>
                    <p class="text-gray-400 mt-2 font-roboto">${paper.date}</p>
                    <p class="text-sm text-gray-400 font-roboto">${paper.category}</p>
                    <a href="/papers/pages/${paper.filename}" class="text-red-700 hover:underline mt-4 inline-block font-source-han shine-effect">閱讀全文</a>
                </div>
            `;

            const thumbnail = paper.thumbnail;

            if (thumbnail) {
                const thumbDiv = document.createElement('div');
                thumbDiv.className = 'flex-shrink-0';
                const img = document.createElement('img');
                img.src = thumbnail;
                img.alt = '文章縮圖';
                img.style.maxWidth = '120px';
                img.style.maxHeight = '90px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '8px';
                img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                img.loading = 'lazy';
                thumbDiv.appendChild(img);
                card.appendChild(thumbDiv);
            }
            papersGrid.appendChild(card);

            gsap.set(card, { opacity: 1, x: 0 });
            gsap.from(card, {
                x: index % 2 === 0 ? 20 : -20,
                duration: 'ontouchstart' in window || navigator.maxTouchPoints > 0 ? 0.3 : 0.4,
                delay: index * 0.05,
                ease: 'power2.out'
            });

            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            if (!isTouchDevice) {
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
        loadingMessage.classList.add('hidden');
    } catch (error) {
        loadingMessage.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>載入文章時發生錯誤';
        setTimeout(() => {
            loadingMessage.classList.add('hidden');
            noPapersMessage.classList.remove('hidden');
        }, 2000);
    }
});