let on = false, v, b, lU, fa = "https://site-assets.fontawesome.com/releases/v6.7.2/css/all.css", vP = false;

const iFA = () => {
    if (document.querySelector(`link[href="${fa}"]`)) return;
    const l = document.createElement('link');
    l.href = fa;
    l.rel = 'stylesheet';
    document.head.appendChild(l);
};

const mkB = () => {
    if (document.getElementById('yt-s-btn')) {
        b = document.getElementById('yt-s-btn');
        return;
    }
    b = document.createElement('div');
    b.id = 'yt-s-btn';
    b.addEventListener('click', () => {
        on = !on;
        sB();
        sv();
        if (on) {
            v = null;
            lU = null;
            iSP() && sASL();
        } else {
            rASL();
        }
    });
    document.body.appendChild(b);
    sB();
};

const sB = () => {
    if (!b) return;
    b.style.cssText = `
        position:fixed;bottom:20px;right:20px;width:48px;height:48px;
        border-radius:50%;display:flex;align-items:center;justify-content:center;
        cursor:pointer;z-index:9999;border:2px solid;box-shadow:0 0 10px #0003;
        transition:background-color .3s,border-color .3s;
        border-color:${on ? '#333' : '#fff'};
        background-color:${on ? '#fff' : '#333'};
    `;
    b.innerHTML = on
        ? `<i class="fa-solid fa-arrow-down fa-beat-fade" style="font-size:22px;"></i>`
        : `<i class="fa-solid fa-arrow-down" style="font-size:22px;"></i>`;
};

const iSP = () =>
    location.pathname.startsWith('/shorts/') &&
    location.pathname.split('/').filter(Boolean).length === 2;

const uBS = () => {
    if (!b) mkB();
    if (!b) return;
    b.style.display = iSP() ? 'flex' : 'none';
    if (iSP()) {
        on ? sASL() : rASL();
        if (document.hidden) {
            const V = v || fV();
            if (V && !V.paused && typeof V.pause === 'function') {
                if (!v) v = V;
                V.pause();
                vP = true;
            }
        }
    } else {
        rASL();
    }
};

const fV = () => {
    let V, aR = document.querySelector('ytd-reel-video-renderer[is-active]');
    if (v && aR && aR.contains(v) && document.body.contains(v) && v.offsetParent) return v;
    if (aR) {
        V = aR.querySelector('#player.ytd-player video.video-stream,ytd-player video.video-stream') ||
            aR.querySelector('video.video-stream.html5-main-video');
        if (V) return V;
    }

    try {
        const qS = [
            '#shorts-player video.video-stream',
            'ytd-player[focused] video.video-stream',
            'div.html5-video-player:not([id*="ad"]) video.video-stream'
        ];
        for (const s of qS) {
            for (const e of document.querySelectorAll(s)) {
                const r = e.closest('ytd-reel-video-renderer'),
                    pC = e.closest('#player-container');
                if (
                    e.offsetParent &&
                    e.offsetWidth > 100 &&
                    e.offsetHeight > 100 &&
                    (r || pC)
                ) {
                    if (r?.hasAttribute('is-active') || (!aR && (r || pC)))
                        return e;
                }
            }
        }
    } catch (e) {}

    try {
        const c = document.getElementById('shorts-inner-container') ||
            document.querySelector('ytd-shorts,ytm-shorts');
        if (!c) return null;
        const a = [...c.querySelectorAll('video.video-stream.html5-main-video')],
            pV = [], sV = [];
        a.forEach(e => {
            const r = e.closest('ytd-reel-video-renderer'),
                pS = e.closest('.player-shell');
            if (
                (!r && !pS && !e.closest('#player.ytd-player')) ||
                (aR && r !== aR)
            ) return;
            if (e.offsetParent && e.offsetWidth > 100 && e.offsetHeight > 100) {
                e.paused || e.ended || e.currentTime < 0.1 ? sV.push(e) : pV.push(e);
            }
        });
        if (pV.length)
            return pV.find(e => e.closest('ytd-reel-video-renderer[is-active]')) || pV;
        if (sV.length)
            return aR ? sV.find(e => aR.contains(e)) || sV : sV;
    } catch (e) {}

    return null;
};

const onVE = e => {
    vP = false;
    if (!on || !iSP()) return;
    const s = e.target.currentSrc || e.target.src;
    if (lU && lU === s && e.target === v) return;
    lU = s;
    v?.pause();
    setTimeout(() => {
        const n = document.getElementById('navigation-button-down'),
            c = n?.querySelector('button.yt-spec-button-shape-next') || n;
        if (c && typeof c.click === 'function') {
            c.click();
        } else if (v && (v.currentSrc || v.src) === lU && lU !== null) {
            lU = null;
            setTimeout(m, 500);
        }
    }, 1000);
};

const sASL = () => {
    v?.hasAttribute('data-yt-asc') && rASL();
    const nV = fV();
    if (nV) {
        v = nV;
        lU = null;
        v.hasAttribute('loop') && v.removeAttribute('loop');
        v.addEventListener('ended', onVE);
        v.setAttribute('data-yt-asc', 'true');
        if (document.hidden && !v.paused) {
            v.pause();
            vP = true;
        }
    } else {
        v = null;
    }
};

const rASL = () => {
    if (v?.hasAttribute('data-yt-asc')) {
        v.removeEventListener('ended', onVE);
        v.removeAttribute('data-yt-asc');
    }
};

const onVC = () => {
    let eV = fV() || v;
    if (!iSP() || !eV) {
        vP = false;
        return;
    }
    if (document.hidden) {
        if (!eV.paused) {
            eV.pause();
            vP = true;
        }
    } else {
        if (eV.paused && vP && eV.currentTime < eV.duration - 0.2) {
            eV.play().catch(() => {});
        }
        vP = false;
        if (on && iSP()) {
            setTimeout(sASL, 150);
        }
    }
};

const ld = () => chrome.storage.local.get('on', r => {
    on = !!r.on;
    mkB();
    m();
});

const sv = () => chrome.storage.local.set({ on });

const m = () => {
    uBS();
    if (iSP() && !on && !v) {
        const iV = fV();
        if (iV) v = iV;
    }
};

const i = () => {
    iFA();
    document.addEventListener("visibilitychange", onVC);
    ld();
    window.addEventListener('yt-navigate-finish', () => {
        v = null;
        lU = null;
        vP = false;
        setTimeout(m, 400);
    });

    let t;
    new MutationObserver(u => {
        let c = false;
        for (const M of u) {
            if (
                (M.type === 'childList' &&
                    (M.target.id === 'shorts-inner-container' ||
                        M.target.matches?.('ytd-reel-video-renderer[is-active],#player-container'))) ||
                (M.type === 'attributes' &&
                    (M.target.matches?.('video.video-stream,ytd-reel-video-renderer,ytd-player') ||
                        ['is-active', 'focused', 'src', 'hidden', 'style', 'class'].includes(M.attributeName)))
            ) {
                c = true;
                break;
            }
        }
        if (c) {
            clearTimeout(t);
            t = setTimeout(m, 250);
        }
    }).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['is-active', 'focused', 'src', 'currenttime', 'hidden', 'style', 'class']
    });
};

(document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', i)
    : i();
