/* ==========================================================================
   RAÍ MORAES — main.js
   ========================================================================== */

'use strict';

/* =============================================================
   CONFIG
============================================================= */
const CONFIG = {
    socials: {
        instagram: 'https://www.instagram.com/rai.moraesht',
        telegram:  'https://t.me/Rayane_leite',
        x:         'https://x.com/raiane_leit',
        facebook:  'https://www.facebook.com/share/18UeksBW8A',
        tiktok:    'https://www.tiktok.com/@rayane.leit'
    },
    cards: [
        { id: 'privacy',     name: 'Privacy',       image: 'cards/privacy.webp',       url: 'http://privacy.com.br/@Rayanne_leite',   requiresAgeCheck: true },
        { id: 'vip',         name: 'Telegram VIP',  image: 'cards/telegram-vip.webp',  url: 'https://t.me/RaiLeite_bot',              requiresAgeCheck: true },
        { id: 'exclusivos',  name: 'Exclusivos',    image: 'cards/exclusivos.webp',    url: 'https://linkpriv.app/raianeleite',       requiresAgeCheck: true },
        { id: 'onlyfans',    name: 'OnlyFans',      image: 'cards/onlyfans.webp',      url: 'https://onlyfans.com/rayane.leit',       requiresAgeCheck: true },
        { id: 'fatalfans',        name: 'Fatal Fans', image: 'cards/fatalfans.webp', url: 'https://fatalfans.com/raiane_leite',              requiresAgeCheck: true },
        { id: 'free',        name: 'Telegram Free', image: 'cards/telegram-free.webp', url: 'https://t.me/Rayane_leite',              requiresAgeCheck: true }
    ],
    video: { src: 'imgs/desktop-background.mp4', breakpoint: 1000 }
};

const TIMINGS = {
    ROTATION_MS: 400,
    FADE_MS:     300,
    RIPPLE_MS:   600
};

/* =============================================================
   ÁUDIO — som de clique sintético
============================================================= */
let audioCtx = null;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function initAudio() {
    if (audioCtx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try { audioCtx = new Ctx(); } catch (_) { audioCtx = null; }
}

function playClickSound() {
    if (prefersReducedMotion.matches) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
}

/* =============================================================
   RIPPLE
============================================================= */
function createRipple(event, element) {
    if (prefersReducedMotion.matches) return;
    if (!element || element.querySelector('.ripple')) return;

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const cx   = (event && typeof event.clientX === 'number') ? event.clientX : rect.left + rect.width  / 2;
    const cy   = (event && typeof event.clientY === 'number') ? event.clientY : rect.top  + rect.height / 2;
    const x    = cx - rect.left - size / 2;
    const y    = cy - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width  = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left   = x + 'px';
    ripple.style.top    = y + 'px';

    element.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
}

/* =============================================================
   TAP HELPER
============================================================= */
const TAP_MAX_DISTANCE = 10;
const TAP_MAX_DURATION = 500;

function attachTapHandler(element, handler) {
    let startX = 0, startY = 0, startTime = 0;
    let isTap = false;
    let lastHandled = 0;

    const run = (event) => {
        const now = Date.now();
        if (now - lastHandled < 400) return;
        lastHandled = now;
        playClickSound();
        handler(event);
    };

    element.addEventListener('touchstart', (e) => {
        const t = e.changedTouches[0];
        startX = t.clientX;
        startY = t.clientY;
        startTime = Date.now();
        isTap = true;
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
        if (!isTap) return;
        const t = e.changedTouches[0];
        if (Math.abs(t.clientX - startX) > TAP_MAX_DISTANCE || Math.abs(t.clientY - startY) > TAP_MAX_DISTANCE) {
            isTap = false;
        }
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
        if (!isTap) return;
        if (Date.now() - startTime > TAP_MAX_DURATION) return;
        const t = e.changedTouches[0];
        if (Math.abs(t.clientX - startX) > TAP_MAX_DISTANCE || Math.abs(t.clientY - startY) > TAP_MAX_DISTANCE) return;

        e.preventDefault();
        run({ clientX: t.clientX, clientY: t.clientY, currentTarget: element, target: e.target });
    });

    element.addEventListener('click', (e) => {
        e.preventDefault();
        run({ clientX: e.clientX, clientY: e.clientY, currentTarget: element, target: e.target });
    });
}

/* =============================================================
   INIT
============================================================= */
document.addEventListener('DOMContentLoaded', () => {
    initSocialLinks();
    renderCards();
    initModal();
    initDesktopVideo();
});

function initSocialLinks() {
    document.querySelectorAll('.social-link[data-social]').forEach(link => {
        const platform = link.getAttribute('data-social');
        if (CONFIG.socials[platform]) link.href = CONFIG.socials[platform];
    });
}

function renderCards() {
    const container = document.getElementById('cards-container');
    if (!container) return;

    CONFIG.cards.forEach((card, index) => {
        const cardElement = document.createElement('a');
        cardElement.className = 'card-item';
        cardElement.href = card.url;
        cardElement.setAttribute('role', 'button');
        cardElement.setAttribute('aria-label', `Acessar ${card.name}`);
        cardElement.style.setProperty('--card-index', index);

        const img = document.createElement('img');
        img.src = card.image;
        img.alt = `Ir para ${card.name}`;
        img.loading = 'lazy';
        img.decoding = 'async';

        img.addEventListener('error', () => {
            console.warn('[cards] Falha ao carregar:', card.image);
            img.style.display = 'none';
            cardElement.style.minHeight = '72px';
            cardElement.style.display = 'flex';
            cardElement.style.alignItems = 'center';
            cardElement.style.justifyContent = 'center';
            cardElement.style.background = 'rgba(255,255,255,0.05)';
            cardElement.style.border = '1px solid rgba(180,180,180,0.25)';
            cardElement.style.borderRadius = '10px';
            cardElement.style.color = '#D5D5D5';
            cardElement.style.fontSize = '14px';
            cardElement.textContent = card.name;
        }, { once: true });

        cardElement.appendChild(img);

        attachTapHandler(cardElement, () => {
            handleCardClick(card.url, card.requiresAgeCheck, cardElement);
        });

        container.appendChild(cardElement);
    });
}

function handleCardClick(url, requiresCheck, cardElement) {
    if (cardElement && !prefersReducedMotion.matches) {
        cardElement.classList.add('card-pulse');
        cardElement.addEventListener('animationend', () => {
            cardElement.classList.remove('card-pulse');
        }, { once: true });
    }

    if (requiresCheck) {
        window.triggerAgeModal(url);
    } else {
        window.location.href = url;
    }
}

/* =============================================================
   MODAL +18
============================================================= */
function initModal() {
    const modal      = document.getElementById('age-modal');
    const closeBtn   = document.getElementById('modal-close');
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn  = document.getElementById('modal-cancel');

    if (!modal) return;

    let selectedDestination = null;
    let previouslyFocusedElement = null;
    let closeTimer = null;

    function calculateScrollbarWidth() {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.setProperty('--scrollbar-compensation', scrollbarWidth + 'px');
    }

    const openModal = () => {
        previouslyFocusedElement = document.activeElement;
        calculateScrollbarWidth();

        if (closeBtn) closeBtn.classList.remove('is-closing');
        modal.classList.remove('is-closing');
        modal.classList.remove('active');

        modal.hidden = false;
        document.body.classList.add('modal-active');

        void modal.offsetHeight;
        modal.classList.add('active');

        if (confirmBtn) confirmBtn.focus();
    };

    const closeModal = () => {
        if (modal.hidden || modal.classList.contains('is-closing')) return;

        modal.classList.add('is-closing');
        modal.classList.remove('active');
        document.body.classList.remove('modal-active');

        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
            modal.hidden = true;
            modal.classList.remove('is-closing');
            if (closeBtn) closeBtn.classList.remove('is-closing');

            if (previouslyFocusedElement && previouslyFocusedElement.focus) {
                previouslyFocusedElement.focus();
            }
        }, TIMINGS.FADE_MS);

        selectedDestination = null;
    };

    const closeBtnHandler = () => {
        if (closeBtn.classList.contains('is-closing')) return;
        closeBtn.classList.add('is-closing');
        setTimeout(() => { closeModal(); }, TIMINGS.ROTATION_MS);
    };

    const confirmAndGo = () => {
        if (!selectedDestination) { closeModal(); return; }
        const url = selectedDestination;
        closeModal();
        setTimeout(() => { window.location.href = url; }, TIMINGS.FADE_MS + 50);
    };

    if (closeBtn) attachTapHandler(closeBtn, closeBtnHandler);

    if (cancelBtn) {
        attachTapHandler(cancelBtn, (e) => {
            createRipple(e, cancelBtn);
            closeModal();
        });
    }

    if (confirmBtn) {
        attachTapHandler(confirmBtn, (e) => {
            createRipple(e, confirmBtn);
            confirmAndGo();
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    window.triggerAgeModal = (url) => {
        selectedDestination = url;
        openModal();
    };
}

/* =============================================================
   VÍDEO DE FUNDO — autoplay garantido + breakpoint 1000px
============================================================= */
function initDesktopVideo() {
    const container = document.getElementById('video-background-container');
    const overlay   = document.querySelector('.video-overlay');
    if (!container || !overlay) return;

    let currentVideo = null;

    function tryPlay(video) {
        const p = video.play();
        if (p && typeof p.catch === 'function') {
            p.catch((err) => {
                console.warn('[video] Autoplay bloqueado:', err && err.name);
                const resume = () => {
                    video.play().catch(() => {});
                    document.removeEventListener('click', resume);
                    document.removeEventListener('touchstart', resume);
                    document.removeEventListener('keydown', resume);
                };
                document.addEventListener('click', resume, { once: true });
                document.addEventListener('touchstart', resume, { once: true });
                document.addEventListener('keydown', resume, { once: true });
            });
        }
    }

    function createVideo() {
        const video = document.createElement('video');
        video.src = CONFIG.video.src;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.setAttribute('muted', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('aria-hidden', 'true');
        video.setAttribute('disablepictureinpicture', '');
        video.setAttribute('tabindex', '-1');

        video.addEventListener('error', () => {
            console.error('[video] FALHA ao carregar:', CONFIG.video.src,
                          '— verifique se o arquivo existe nesse caminho exato.');
            container.classList.remove('active');
            overlay.classList.remove('active');
        });

        video.addEventListener('loadeddata', () => {
            console.log('[video] carregado com sucesso:', CONFIG.video.src);
            tryPlay(video);
        }, { once: true });

        container.appendChild(video);
        container.classList.add('active');
        overlay.classList.add('active');

        tryPlay(video);
        currentVideo = video;
    }

    function destroyVideo() {
        if (!currentVideo) return;
        try { currentVideo.pause(); } catch (_) {}
        currentVideo.removeAttribute('src');
        try { currentVideo.load(); } catch (_) {}
        container.innerHTML = '';
        container.classList.remove('active');
        overlay.classList.remove('active');
        currentVideo = null;
    }

    const checkDesktop = () => {
        const isDesktop = window.matchMedia(`(min-width: ${CONFIG.video.breakpoint}px)`).matches;
        const hasVideo  = container.hasChildNodes();

        if (isDesktop && !hasVideo) {
            createVideo();
        } else if (!isDesktop && hasVideo) {
            destroyVideo();
        }
    };

    checkDesktop();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkDesktop, 200);
    });

    document.addEventListener('visibilitychange', () => {
        if (!currentVideo) return;
        if (document.hidden) {
            try { currentVideo.pause(); } catch (_) {}
        } else {
            tryPlay(currentVideo);
        }
    });
}