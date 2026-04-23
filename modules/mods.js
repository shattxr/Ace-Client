// Ace Client Mods Module
// Ace Mods loading system

(function(AceCore, AceSFX, CONFIG, STATE) {
    'use strict';

    const ACE_MODS = [];
    const ACE_CUSTOM_MODS_KEY = 'ACE_custom_mods';

    const module = {
        name: 'mods',
        
        init() {
            this.setupWindowFunctions();
            this.addStyles();
            console.log('[ACE] Mods module loaded');
        },
        
        destroy() {
            const modal = document.getElementById('ace-mods-modal');
            if (modal) modal.remove();
            const toast = document.getElementById('ace-mod-toast');
            if (toast) toast.remove();
        },
        
        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .ace-mods-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: 14px;
                    padding: 4px;
                }
                .ace-mods-card {
                    position: relative;
                    aspect-ratio: 16 / 9;
                    background: #111;
                    border: 1px solid #1e1e1e;
                    border-radius: 10px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: border-color .15s, transform .15s;
                }
                .ace-mods-card:hover {
                    border-color: #2e2e2e;
                    transform: translateY(-2px);
                }
                .ace-mods-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .ace-mc-noimg {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #fff;
                    background: #0d0d0d;
                }
                .ace-mc-abbr {
                    position: absolute;
                    bottom: 6px;
                    left: 6px;
                    background: rgba(0,0,0,0.7);
                    color: #7ec8c8;
                    font-size: 0.65rem;
                    font-weight: 700;
                    padding: 2px 6px;
                    border-radius: 4px;
                    text-transform: uppercase;
                }
                .ace-mc-version {
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    background: rgba(0,0,0,0.7);
                    color: #888;
                    font-size: 0.6rem;
                    padding: 2px 5px;
                    border-radius: 3px;
                }
                .ace-mods-card-wrap {
                    cursor: pointer;
                }
                .ace-mc-caption {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 6px;
                    padding: 0 2px;
                }
                .ace-mc-caption-name {
                    font-size: 0.75rem;
                    color: #ddd;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 70%;
                }
                .ace-mc-caption-author {
                    font-size: 0.65rem;
                    color: #555;
                }
                .ace-mods-empty {
                    text-align: center;
                    color: #444;
                    font-size: 0.9rem;
                    padding: 40px 20px;
                }
                #ace-mod-toast {
                    position: fixed;
                    bottom: calc(20px + 52px + 8px);
                    right: 20px;
                    z-index: 999998;
                    display: none;
                    flex-direction: column;
                    gap: 8px;
                    background: #0b0b0b;
                    border: 1px solid rgba(126,200,200,0.4);
                    border-radius: 8px;
                    padding: 12px 14px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    color: #fff;
                    min-width: 260px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.7);
                }
                #ace-mod-toast .toast-title {
                    font-weight: 700;
                    color: #7ec8c8;
                    margin-bottom: 2px;
                }
                #ace-mod-toast .toast-subtitle {
                    font-size: 12px;
                    color: #888;
                }
                #ace-mod-toast .toast-progress {
                    height: 4px;
                    background: #1a1a1a;
                    border-radius: 2px;
                    overflow: hidden;
                    margin-top: 8px;
                }
                #ace-mod-toast .toast-progress-bar {
                    height: 100%;
                    background: #7ec8c8;
                    transition: width 0.3s;
                }
            `;
            (document.head || document.documentElement).appendChild(style);
        },
        
        setupWindowFunctions() {
            const self = this;
            
            window.openAceModsModal = () => {
                if (document.getElementById('ace-mods-modal')) return;
                
                const overlay = document.createElement('div');
                overlay.id = 'ace-mods-modal';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:200000;display:flex;align-items:center;justify-content:center;';
                
                const modal = document.createElement('div');
                modal.style.cssText = 'background:#0b0b0b;border:1px solid #1a1a1a;border-radius:14px;width:min(700px,90vw);height:min(500px,80vh);display:flex;flex-direction:column;overflow:hidden;';
                
                const titleBar = document.createElement('div');
                titleBar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #1a1a1a;';
                
                const title = document.createElement('span');
                title.style.cssText = 'font-size:1rem;font-weight:700;color:#7ec8c8;letter-spacing:0.05em;text-transform:uppercase;';
                title.textContent = 'Ace Mods';
                
                const closeX = document.createElement('span');
                closeX.textContent = '×';
                closeX.style.cssText = 'cursor:pointer;font-size:1.5rem;color:#555;transition:color .15s;';
                closeX.onmouseenter = () => closeX.style.color = '#fff';
                closeX.onmouseleave = () => closeX.style.color = '#555';
                closeX.onclick = () => overlay.remove();
                
                titleBar.appendChild(title);
                titleBar.appendChild(closeX);
                
                const tabStrip = document.createElement('div');
                tabStrip.className = 'ace-tab-strip';
                tabStrip.style.cssText = 'display:flex;flex-direction:row;flex-wrap:nowrap;padding:0;overflow-x:auto;background:#0d0d0d;';
                
                const contentArea = document.createElement('div');
                contentArea.style.cssText = 'flex:1;overflow-y:auto;padding:16px;';
                
                const ACE_MODS_TABS = [
                    ['dueling', 'Dueling'],
                    ['survival', 'Survival'],
                    ['team', 'Team'],
                    ['minigames', 'Minigames'],
                    ['misc', 'Misc'],
                    ['custom', 'Custom'],
                ];
                
                let activeTabId = 'dueling';
                const tabBtns = {};
                
                const tabBuilders = {
                    dueling: (area) => this.buildModTabContent('dueling', area),
                    survival: (area) => this.buildModTabContent('survival', area),
                    team: (area) => this.buildModTabContent('team', area),
                    minigames: (area) => this.buildModTabContent('minigames', area),
                    misc: (area) => this.buildModTabContent('misc', area),
                    custom: (area) => this.buildCustomTabContent(area),
                };
                
                const switchTab = (id) => {
                    activeTabId = id;
                    for (const [tid, btn] of Object.entries(tabBtns)) {
                        btn.classList.toggle('active', tid === id);
                    }
                    contentArea.innerHTML = '';
                    (tabBuilders[id] || (() => {}))(contentArea);
                };
                
                ACE_MODS_TABS.forEach(([id, label]) => {
                    const btn = document.createElement('button');
                    btn.className = 'ace-info-tab-btn' + (id === activeTabId ? ' active' : '');
                    btn.textContent = label;
                    btn.onclick = () => switchTab(id);
                    tabBtns[id] = btn;
                    tabStrip.appendChild(btn);
                });
                
                switchTab(activeTabId);
                
                modal.appendChild(titleBar);
                modal.appendChild(tabStrip);
                modal.appendChild(contentArea);
                overlay.appendChild(modal);
                document.body.appendChild(overlay);
            };
        },
        
        getAllMods() {
            let custom = [];
            try { custom = JSON.parse(localStorage.getItem(ACE_CUSTOM_MODS_KEY) || '[]'); }
            catch (e) { custom = []; }
            return [...ACE_MODS, ...custom];
        },
        
        buildModTabContent(category, contentArea) {
            const mods = this.getAllMods().filter(m => m.category === category);
            
            if (!mods.length) {
                contentArea.innerHTML = '<div class="ace-mods-empty">No mods in this category yet.</div>';
                return;
            }
            
            const grid = document.createElement('div');
            grid.className = 'ace-mods-grid';
            
            mods.forEach(mod => {
                const wrap = document.createElement('div');
                wrap.className = 'ace-mods-card-wrap';
                wrap.onclick = () => this.launchMod(mod);
                
                const card = document.createElement('div');
                card.className = 'ace-mods-card';
                
                if (mod.imageUrl) {
                    const img = document.createElement('img');
                    img.src = mod.imageUrl;
                    img.alt = mod.name || '';
                    img.onerror = () => { img.style.display = 'none'; };
                    card.appendChild(img);
                } else {
                    const noImg = document.createElement('span');
                    noImg.className = 'ace-mc-noimg';
                    noImg.textContent = mod.name || mod.abbr || '?';
                    card.appendChild(noImg);
                }
                
                const abbr = document.createElement('span');
                abbr.className = 'ace-mc-abbr';
                abbr.textContent = mod.abbr || '?';
                
                const ver = document.createElement('span');
                ver.className = 'ace-mc-version';
                ver.textContent = mod.version || '';
                
                card.appendChild(abbr);
                card.appendChild(ver);
                
                const caption = document.createElement('div');
                caption.className = 'ace-mc-caption';
                
                const nameSpan = document.createElement('span');
                nameSpan.className = 'ace-mc-caption-name';
                nameSpan.textContent = mod.name || '';
                
                const authorSpan = document.createElement('span');
                authorSpan.className = 'ace-mc-caption-author';
                authorSpan.textContent = mod.author ? `By: ${mod.author}` : '';
                
                caption.appendChild(nameSpan);
                caption.appendChild(authorSpan);
                
                wrap.appendChild(card);
                wrap.appendChild(caption);
                grid.appendChild(wrap);
            });
            
            contentArea.appendChild(grid);
        },
        
        buildCustomTabContent(contentArea) {
            contentArea.innerHTML = '<div class="ace-mods-empty">Custom mods coming soon. Add mods via the Control Panel.</div>';
        },
        
        launchMod(mod) {
            console.log('[ACE] Launching mod:', mod.name);
            this.showToast(mod);
        },
        
        showToast(mod) {
            let toast = document.getElementById('ace-mod-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'ace-mod-toast';
                document.body.appendChild(toast);
            }
            
            toast.innerHTML = `
                <div class="toast-title">Loading ${mod.name || mod.abbr}...</div>
                <div class="toast-subtitle">Fetching mod files...</div>
                <div class="toast-progress"><div class="toast-progress-bar" style="width:30%"></div></div>
            `;
            toast.style.display = 'flex';
            
            setTimeout(() => {
                toast.querySelector('.toast-progress-bar').style.width = '60%';
            }, 500);
            
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }
    };
    
    window.AceMods = module;
    return module;
})(window.AceCore, window.AceSFX, window.AceCONFIG, window.AceSTATE);