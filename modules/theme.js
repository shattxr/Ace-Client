// Ace Client Theme Module
// Dark CSS theme and visual modifications

(function(AceCore, AceSFX, CONFIG, log) {
    'use strict';

    var module = {
        name: 'theme',
        
        init: function() {
            log('Theme module initializing...');
            this.injectDarkCSS();
            this.applyTheme();
            this.replaceLogo();
            this.addAnimations();
            log('Theme module ready');
        },
        
        destroy: function() {
            var style = document.getElementById('ace-dark-theme');
            if (style) style.remove();
        },
        
        injectDarkCSS() {
            const style = document.createElement('style');
            style.id = 'ace-dark-theme';
            style.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Abel&family=DM+Sans:wght@400;500;700&display=swap');
                
                body {
                    background-color: #0b0b0b !important;
                    height: 100dvh;
                    width: 100vw;
                    font-family: "DM Sans", sans-serif;
                }
                
                #overlay {
                    background: repeating-linear-gradient(45deg, #1a1a1a 0, #131313 1px, #0b0b0b 0, #0b0b0b 50%) !important;
                    background-size: 10px 10px !important;
                    background-color: #0b0b0b !important;
                    max-width: calc(100% - 60px) !important;
                    max-height: calc(100% - 60px) !important;
                    margin: auto !important;
                    box-sizing: content-box !important;
                    box-shadow: black 0px 0px 0px !important;
                    border: 6px solid #131313 !important;
                    outline: 54px solid #0b0b0b !important;
                    color: #fff !important;
                    text-shadow: black 0px 0px 0px !important;
                }
                
                ::-webkit-scrollbar { width: 0.2em; }
                ::-webkit-scrollbar-thumb { background-color: #1a1a1a; border: none; border-radius: 0.1em; }
                ::-webkit-scrollbar-track { background-color: transparent; border: none; }
                .noglow-placeholder::placeholder { text-shadow: black 0px 0px 0px; }
                
                .modal {
                    background: #0b0b0b !important;
                    border: 1px solid #1a1a1a !important;
                    box-shadow: black 0px 0px 0px !important;
                    color: #fff !important;
                    text-shadow: black 0px 0px 0px !important;
                }
                .modal .header {
                    background: #111 !important;
                    border-bottom: 1px solid #1a1a1a !important;
                }
                .modal::-webkit-scrollbar-thumb { background-color: #2a2a2a !important; }
                
                .frozenbg, .ecpverifiedlogo, .shippreview {
                    background: #111 !important;
                    box-shadow: none !important;
                    text-shadow: none !important;
                    border-color: #2a2a2a !important;
                }
                .modal table { border-color: #2a2a2a !important; }
                .modal td, .modal th {
                    border-color: #2a2a2a !important;
                    color: #eee !important;
                    text-shadow: none !important;
                }
                .modal tr:nth-child(1) td { color: #ffd700 !important; text-shadow: none !important; }
                .modal tr:nth-child(2) td { color: #c0c0c0 !important; text-shadow: none !important; }
                .modal tr:nth-child(3) td { color: #cd7f32 !important; text-shadow: none !important; }
                .modal span[style*="text-shadow"], .modal div[style*="text-shadow"] { text-shadow: none !important; }
                .modal span[style*="box-shadow"], .modal div[style*="box-shadow"] { box-shadow: none !important; }
                
                .mod.inactive, .mod.disabled {
                    filter: none !important;
                    -webkit-filter: none !important;
                    opacity: 1 !important;
                }
                .modal .mod.inactive img, .modal .mod.disabled img, .modal .mod img {
                    filter: none !important;
                    -webkit-filter: none !important;
                }
                
                .ace-mod-footer p {
                    margin: 0 !important;
                    flex: 1 1 0 !important;
                    min-width: 0 !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    color: #555 !important;
                    font-size: 0.85em !important;
                }
                .ace-mod-footer a, .modal .modalbody > div.modlinks a, .modal div[class*="create"] a {
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 5px !important;
                    padding: 3px 10px !important;
                    border: 1px solid rgba(126,200,200,0.4) !important;
                    border-radius: 4px !important;
                    color: #7ec8c8 !important;
                    font-family: 'DM Sans', sans-serif !important;
                    font-size: 0.78rem !important;
                    font-weight: 600 !important;
                    text-decoration: none !important;
                    transition: background 0.12s, border-color 0.12s !important;
                    background: transparent !important;
                }
                .ace-mod-footer a:hover, .modal .modalbody > div.modlinks a:hover, .modal div[class*="create"] a:hover {
                    background: rgba(126,200,200,0.1) !important;
                    border-color: #7ec8c8 !important;
                    color: #fff !important;
                }
                
                .ace-dropdown-menu a:visited, .ace-dropdown-sub a:visited { color: #fff !important; }
                .ace-dropdown-menu a:active, .ace-dropdown-sub a:active { color: #4a9eff !important; }
                
                .gameloaderwrapper {
                    border-color: #1a1a1a !important;
                    box-shadow: black 0px 0px 0px !important;
                }
                .loaderprogress {
                    background: linear-gradient(to right, #1a1a1a 0, #7ec8c8 100%) !important;
                }
                
                .settingsBox {
                    background: #111;
                    border-radius: 16px;
                    box-shadow: 0 4px 30px rgba(0,0,0,0.5);
                    border: 1px solid #2a2a2a;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    min-width: 400px;
                    max-width: 800px;
                    min-height: 100px;
                    max-height: min(800px, calc(100vh - 40px));
                    z-index: 100000000;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                }
                
                .btn_container {
                    width: 80px;
                    height: 24px;
                    background-color: rgba(0,0,0,0.6);
                    display: flex;
                    flex: none;
                    position: relative;
                    border: 2px solid #2a2a2a;
                    margin-right: 20px;
                    box-shadow: -1px 3px 22px 0 rgba(0,0,0,0.75);
                    border-radius: 30px;
                    cursor: pointer;
                }
                
                .applyButton {
                    background: #1a1a1a;
                    border-radius: 10px;
                    border: 1px solid #2a2a2a;
                    color: #fff;
                    font-size: 1.2em;
                    font-weight: 700;
                    text-align: center;
                    margin-top: 10px;
                    cursor: pointer;
                }
                .applyButton:hover { background: #2a2a2a; }
                
                .xButton {
                    color: #fff;
                    font-size: 1.2em;
                    font-weight: 700;
                    text-align: center;
                    margin-top: 10px;
                    cursor: pointer;
                    margin-bottom: 3px;
                    display: inline-block;
                    padding: 2px 8px;
                    border: 1px solid #2a2a2a;
                    border-radius: 6px;
                }
                .xButton:hover { background: #1a1a1a; }
                
                .buttonBox {
                    background: #111;
                    border-radius: 16px;
                    box-shadow: 0 4px 30px rgba(0,0,0,0.5);
                    border: 1px solid #2a2a2a;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    min-width: 300px;
                    max-width: 800px;
                    min-height: 100px;
                    max-height: 800px;
                    z-index: 100000000;
                    padding: 10px;
                }
                
                .buttonButton {
                    background: #1a1a1a;
                    border-radius: 10px;
                    border: 1px solid #2a2a2a;
                    color: #fff;
                    font-size: 1.2em;
                    font-weight: 700;
                    text-align: center;
                    margin-top: 10px;
                    cursor: pointer;
                    min-width: 80px;
                    max-width: 380px;
                    height: 24px;
                    padding: 0 10px;
                }
                .buttonButton:hover { background: #2a2a2a; }
                
                .shortcut {
                    min-width: 20% !important;
                    max-width: 30% !important;
                    width: unset !important;
                    color: #fff !important;
                    border-radius: 8px;
                    padding: 6px;
                    background: #1a1a1a;
                    border: 1px solid #2a2a2a;
                    text-decoration: none;
                    text-align: center;
                    display: inline-block;
                    margin: 3px;
                }
                .shortcut:hover { background: #2a2a2a; color: #fff !important; }
                .shortcutBox { text-align: center !important; }
                .customPicker { background-color: #111; border-color: #2a2a2a; }
                
                a { text-decoration: none; color: #7ec8c8; }
                a:hover { color: #fff; }
                
                .switch { position: relative; display: inline-block; width: 46px; height: 26px; flex-shrink: 0; margin-right: 10px; }
                .switch input { opacity: 0; width: 0; height: 0; position: absolute; }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: transparent !important;
                    border: 2px solid #fff;
                    border-radius: 0;
                    transition: border-color .2s;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    width: 16px;
                    height: 16px;
                    left: 4px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: transparent;
                    border: 2px solid #666;
                    border-radius: 0;
                    transition: transform .2s, border-color .2s;
                    box-sizing: border-box;
                }
                input:checked + .slider { background: transparent !important; border-color: #fff; }
                input:checked + .slider:before {
                    transform: translateY(-50%) translateX(18px);
                    border-color: #fff;
                }
                
                #ace-sl-sidebar {
                    position: fixed;
                    top: 0;
                    bottom: 0;
                    right: 0;
                    width: calc(25vw + 3.8vw);
                    display: flex;
                    flex-direction: row;
                    z-index: 10000;
                    pointer-events: none;
                    transform: translateX(25vw);
                    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                #ace-sl-sidebar.open { transform: translateX(0); }
                #ace-sl-tabs {
                    width: 3.8vw;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    justify-content: center;
                    background: transparent;
                    pointer-events: auto;
                    order: 1;
                }
                #ace-sl-panel {
                    width: 25vw;
                    flex-shrink: 0;
                    pointer-events: auto;
                    display: flex;
                    flex-direction: column;
                    background: #0b0b0b;
                    border-left: 1px solid #1a1a1a;
                    box-sizing: border-box;
                    overflow: hidden;
                    order: 2;
                }
                
                .ace-sl-tab {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1 / 1;
                    cursor: pointer;
                    user-select: none;
                    overflow: visible;
                }
                .ace-sl-tab + .ace-sl-tab { margin-top: -1px; }
                .ace-sl-tab-bg {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #0b0b0b;
                    border: 1px solid #2e2e2e;
                    border-right: none;
                    color: white;
                    transition: background 0.18s ease, filter 0.22s ease, color 0.18s ease;
                }
                
                #ace-shortcut-tray {
                    position: absolute;
                    top: 8px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: row;
                    gap: 5px;
                    z-index: 100;
                    background: #0b0b0b;
                    border: 1px solid #1a1a1a;
                    border-radius: 10px;
                    padding: 5px;
                }
                .ace-shortcut-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 76px;
                    height: 76px;
                    background: #0b0b0b;
                    border: 1px solid #1a1a1a;
                    border-radius: 8px;
                    cursor: pointer;
                    text-decoration: none;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    gap: 4px;
                    transition: background .15s, border-color .15s;
                    box-sizing: border-box;
                }
                .ace-shortcut-btn:hover { background: #1a1a1a; border-color: #2a2a2a; color: #fff; }
                .ace-shortcut-btn svg { width: 26px; height: 26px; fill: white; color: white; }
                .ace-shortcut-btn img { width: 26px; height: 26px; }
                .ace-sl-img { filter: drop-shadow(0 0 5px rgba(255,255,255,0.75)); }
            `;
            (document.head || document.documentElement).appendChild(style);
        },
        
        applyTheme() {
            const applyCSS = (styles, element) => {
                if (!element) return;
                for (const key of Object.keys(styles)) {
                    try { element.style[key] = styles[key]; }
                    catch (ex) { console.warn('[ACE] Cannot apply style', key, ex); }
                }
            };
            
            const applyBaseStyles = (element, includeFont = true) => {
                if (!element) return;
                element.style.boxShadow = 'black 0px 0px 0px';
                element.style.textShadow = 'black 0px 0px 0px';
                if (includeFont) element.style.fontFamily = '"DM Sans", sans-serif';
                element.style.fontWeight = '400';
                element.style.background = '#0b0b0b';
                element.style.border = '1px solid #1a1a1a';
                element.style.color = '#FFF';
                element.style.borderRadius = '10px';
            };
            
            document.body.style.fontFamily = '"DM Sans", sans-serif';
            
            const playEl = document.querySelector('#play');
            if (playEl) {
                applyCSS({
                    fontFamily: '"DM Sans", sans-serif',
                    letterSpacing: '4px',
                    fontSize: '2.2rem',
                    fontWeight: '600',
                }, playEl);
                
                playEl.addEventListener('wheel', e => {
                    e.preventDefault();
                    const arrow = e.deltaY > 0
                        ? document.querySelector('#nextMode')
                        : document.querySelector('#prevMode');
                    arrow?.click();
                    AceSFX?.click();
                }, { passive: false });
            }
            
            const gameModes = document.querySelector('#game_modes');
            if (gameModes) {
                applyCSS({
                    background: 'transparent',
                    textShadow: 'black 0px 0px 0px',
                    fontFamily: "'Abel', sans-serif",
                    fontSize: '1rem',
                    letterSpacing: '0px',
                    marginTop: '5px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '80%',
                    borderTop: '1px solid #1a1a1a',
                    color: 'gray',
                }, gameModes);
            }
            
            for (const el of document.querySelectorAll('.changelog-new')) {
                el.style.fontFamily = '"DM Sans", sans-serif';
            }
            
            const inputWrapper = document.querySelector('.inputwrapper');
            if (inputWrapper) {
                applyCSS({
                    background: '#0b0b0b',
                    border: '1px solid #1a1a1a',
                    fontFamily: 'DM Sans',
                    boxShadow: 'black 0px 0px 0px',
                    borderRadius: '10px',
                }, inputWrapper);
            }
            
            for (const el of [document.querySelector('#prevMode'), document.querySelector('#nextMode')]) {
                if (!el) continue;
                el.style.color = '#FFFFFF';
                el.style.textShadow = 'black 0px 0px 0px';
            }
            
            for (const el of document.querySelectorAll('button')) applyBaseStyles(el);
            
            for (const query of ['.changelog-new', '#moddingspace', '#donate', '#rankings', '#training']) {
                const el = document.querySelector(query);
                if (!el) continue;
                applyBaseStyles(el);
                el.style.paddingBottom = '0.5rem';
                const icon = el.querySelector('i');
                const span = el.querySelector('span');
                if (icon) {
                    icon.style.margin = '0.5rem auto 0.5rem auto';
                    icon.style.paddingBottom = '0.5rem';
                    icon.style.width = '80%';
                    icon.style.borderBottom = '#1a1a1a';
                    icon.style.color = '#fff';
                    icon.style.textShadow = 'none';
                    icon.style.boxShadow = 'none';
                }
                if (span) {
                    span.style.color = '#fff';
                    span.style.letterSpacing = '1px';
                    span.style.textShadow = 'black 0px 0px 0px';
                    span.style.fontWeight = '500';
                }
                if (el.id === 'rankings' && span) {
                    span.textContent = 'Leaderboard';
                }
            }
            
            for (const el of document.querySelectorAll('.modal')) applyBaseStyles(el);
            
            for (const el of document.querySelectorAll('.social i')) {
                applyBaseStyles(el, false);
                el.style.textShadow = el.style.boxShadow = el.style.filter = 'none';
                el.style.background = '#0b0b0b';
                el.style.color = '#ffffff';
            }
            
            for (const el of document.querySelectorAll(
                '[data-translate-base="music"],[data-translate-base="community"],' +
                '[class="sbg-diamond"],[class="sbg-twitter"],[class="sbg-facebook"]'
            )) el.style.display = 'none';
            
            const topRight = document.querySelector('.top-right');
            if (topRight) {
                topRight.style.left = '0';
                topRight.style.right = 'auto';
                topRight.querySelector('.event-time')?.remove();
                topRight.querySelector('#calendar_event')?.remove();
                const trImg = topRight.querySelector(':scope > img');
                if (trImg) trImg.style.boxShadow = 'none';
            }
            
            document.title = 'Ace Starblast';
            for (const el of document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')) el.remove();
            const fav = document.createElement('link');
            fav.rel = 'icon';
            fav.type = 'image/png';
            fav.href = 'https://raw.githubusercontent.com/shattxr/Ace-Client/main/ico144tdh.png?v=' + Date.now();
            (document.head || document.documentElement).appendChild(fav);
            
            const contentEl = document.querySelector('#content');
            if (contentEl) {
                const FIXED_MARGIN = '300px';
                contentEl.style.setProperty('margin-top', FIXED_MARGIN, 'important');
                const contentObs = new MutationObserver(() => {
                    if (contentEl.style.marginTop !== FIXED_MARGIN) {
                        contentObs.disconnect();
                        contentEl.style.setProperty('margin-top', FIXED_MARGIN, 'important');
                        contentObs.observe(contentEl, { attributes: true, attributeFilter: ['style'] });
                    }
                });
                contentObs.observe(contentEl, { attributes: true, attributeFilter: ['style'] });
            }
            
            for (const a of document.querySelectorAll('a[href*="bandcamp"]')) {
                let el = a;
                while (el.parentElement && el.parentElement.tagName !== 'DIV' && el.parentElement !== document.body) {
                    el = el.parentElement;
                }
                el.remove();
            }
            document.querySelectorAll('div, p, span, a').forEach(el => {
                if (el.children.length === 0 && el.textContent.toLowerCase().includes('bandcamp')) {
                    let container = el;
                    while (container.parentElement && container.parentElement !== document.body && container.parentElement.tagName !== 'BODY') {
                        if (container.parentElement.children.length === 1) {
                            container = container.parentElement;
                        } else break;
                    }
                    container.remove();
                }
            });
        },
        
        replaceLogo() {
            const logoImg = document.querySelector('.logo img');
            if (logoImg) {
                logoImg.src = 'https://i.ibb.co/203Qn3G7/AClogo.png';
                logoImg.style.width = 'auto';
                logoImg.style.height = '140px';
            }
            
            const titleText = document.querySelector('.logo');
            if (titleText && !titleText.querySelector('img')) {
                titleText.style.display = 'none';
            }
        },
        
        addAnimations() {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ace-anim-bottom {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes ace-anim-left {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .ace-anim-bottom { animation: ace-anim-bottom 0.4s ease-out; }
                .ace-anim-left { animation: ace-anim-left 0.4s ease-out; }
            `;
            (document.head || document.documentElement).appendChild(style);
            
            const anim = (el, cls) => {
                if (!el) return;
                const trigger = () => {
                    el.classList.remove(cls);
                    void el.offsetWidth;
                    el.classList.add(cls);
                };
                if (el.style.display !== 'none') requestAnimationFrame(trigger);
                let wasHidden = el.style.display === 'none';
                const obs = new MutationObserver(() => {
                    const nowVisible = el.style.display !== 'none';
                    if (wasHidden && nowVisible) trigger();
                    wasHidden = !nowVisible;
                });
                obs.observe(el, { attributes: true, attributeFilter: ['style'] });
            };
            
            const social = document.querySelector('.social');
            if (social) anim(social, 'ace-anim-bottom');
            
            const attachFollowtools = (ft) => {
                ft.style.left = '0';
                ft.style.right = 'auto';
                ft.style.width = 'max-content';
                ft.style.zIndex = '500';
                anim(ft, 'ace-anim-left');
            };
            
            const existingFt = document.querySelector('.followtools');
            if (existingFt) {
                attachFollowtools(existingFt);
            } else {
                const ftObs = new MutationObserver((_, obs) => {
                    const ft = document.querySelector('.followtools');
                    if (ft) { obs.disconnect(); attachFollowtools(ft); }
                });
                ftObs.observe(document.body, { childList: true, subtree: true });
            }
        }
    };
    
    return module;
})(window.AceCore, window.AceSFX, window.AceCONFIG, window.AceSTATE);
