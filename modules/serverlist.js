// Ace Client Server List Module
// Server browser, API polling, and status reports

(function(AceCore, AceSFX, CONFIG, STATE) {
    'use strict';

    const MODULE_BASE_URL = 'https://raw.githubusercontent.com/shattxr/Ace-Client/main/modules/';
    const ACE_MODS = [];
    const ACE_CUSTOM_MODS_KEY = 'ACE_custom_mods';

    const module = {
        name: 'serverlist',
        
        init() {
            this.initState();
            this.initComponents();
            this.buildPanel();
            console.log('[ACE] Server List module loaded');
        },
        
        destroy() {
            clearInterval(this.apiTimer);
            clearInterval(this.statusTimer);
            const sidebar = document.getElementById('ace-sl-sidebar');
            if (sidebar) sidebar.remove();
            const modal = document.getElementById('StatusReportModal');
            if (modal) modal.remove();
        },
        
        initState() {
            const _slDefaultOpts = () => ({
                activeRegion: 'europe',
                modes: { team: true, survival: true, deathmatch: true, modding: true, invasion: true },
                pollMs: 3200,
            });
            
            const _slLoadOpts = () => {
                try {
                    const saved = JSON.parse(localStorage.getItem('ACE_sl_options') || 'null');
                    if (!saved) return _slDefaultOpts();
                    const def = _slDefaultOpts();
                    return {
                        activeRegion: saved.activeRegion || def.activeRegion,
                        modes: Object.assign({}, def.modes, saved.modes || {}),
                        pollMs: saved.pollMs || def.pollMs,
                    };
                } catch { return _slDefaultOpts(); }
            };
            
            const _slSaveOpts = (opts) => {
                try { localStorage.setItem('ACE_sl_options', JSON.stringify({ activeRegion: opts.activeRegion, modes: opts.modes, pollMs: opts.pollMs })); } catch {}
            };
            
            this.STATE = {
                listingLoading: true,
                options: _slLoadOpts(),
                activeSLTab: null,
                activeSLMode: null,
                previousSLTab: null,
                filteredSystems: [],
                statusReportActive: false,
                statusReportLoading: false,
                statusReportData: {
                    name: '', id: '', mode: '',
                    team_1: this.makeTeamState(), team_2: this.makeTeamState(), team_3: this.makeTeamState(),
                },
            };
            
            this._slSaveOpts = _slSaveOpts;
            this.apiTimer = null;
            this.statusTimer = null;
            
            this.setupWindowFunctions();
        },
        
        makeTeamState() {
            return { hue: null, gems: 0, level: 0, potentialOutput: 0, PBS: 0, PPBS: 0, players: [] };
        },
        
        setupWindowFunctions() {
            const self = this;
            
            window.switchSLTab = (tabId) => {
                if (tabId === 'settings') {
                    if (self.STATE.activeSLTab === 'settings') {
                        self.STATE.activeSLTab = self.STATE.previousSLTab || 'sl';
                        if (self.STATE.activeSLTab === 'sl') self.startPoller(); else clearInterval(self.apiTimer);
                    } else {
                        self.STATE.previousSLTab = self.STATE.activeSLTab;
                        self.STATE.activeSLTab = 'settings';
                        clearInterval(self.apiTimer);
                    }
                } else if (tabId === 'sl' && self.STATE.activeSLTab === 'settings') {
                    self.STATE.activeSLTab = 'sl';
                    self.startPoller();
                } else if (self.STATE.activeSLTab === tabId) {
                    if (tabId === 'sl' && self.STATE.activeSLMode !== null) {
                        self.STATE.activeSLMode = null;
                        self.startPoller();
                    } else {
                        self.STATE.activeSLTab = null;
                        self.STATE.activeSLMode = null;
                        clearInterval(self.apiTimer);
                    }
                } else {
                    self.STATE.activeSLTab = tabId;
                    if (tabId !== 'sl') self.STATE.activeSLMode = null;
                    if (tabId === 'sl') self.startPoller(); else clearInterval(self.apiTimer);
                }
                self.renderSLTabs();
                self.renderSLPanel();
            };
            
            window.closeSLSettings = () => window.switchSLTab('settings');
            
            window.switchSLMode = (mode) => {
                self.STATE.activeSLMode = (self.STATE.activeSLMode === mode && self.STATE.activeSLTab === 'sl') ? null : mode;
                self.STATE.activeSLTab = 'sl';
                self.startPoller();
                self.renderSLTabs();
                self.renderSLPanel();
            };
            
            window.switchActiveRegion = (region) => {
                self.STATE.options.activeRegion = region;
                self._slSaveOpts(self.STATE.options);
                self.renderSLPanel();
                if (self.STATE.activeSLTab === 'sl') self.startPoller();
            };
            
            window.toggleMode = (mode) => {
                self.STATE.options.modes[mode] = !self.STATE.options.modes[mode];
                self._slSaveOpts(self.STATE.options);
                self.renderSLPanel();
                if (self.STATE.activeSLTab === 'sl') self.startPoller();
            };
            
            window.setSLPollMs = (ms) => {
                const val = Math.max(500, parseInt(ms) || 3200);
                self.STATE.options.pollMs = val;
                self._slSaveOpts(self.STATE.options);
                if (self.STATE.activeSLTab === 'sl') self.startPoller();
                if (self.statusTimer) {
                    const lastQuery = self.STATE.statusReportData?.id ? `${self.STATE.statusReportData.id}@${self.STATE.statusReportData._ip || ''}` : null;
                    clearInterval(self.statusTimer);
                    self.statusTimer = null;
                    if (lastQuery && self.STATE.statusReportActive) window.statusReport(lastQuery);
                }
            };
        },
        
        initComponents() {
            const SVG_FILLED = `<svg xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M480-294q78 0 132-54t54-132q0-78-54-132t-132-54q-78 0-132 54t-54 132q0 78 54 132t132 54Zm0 214q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>`;
            
            const regionRow = (label, key) => {
                const active = self.STATE.options.activeRegion === key;
                return `<div onclick="window.switchActiveRegion('${key}');window._aceSFX&&window._aceSFX.toggle()"
                    style="color:${active?'#fff':'gray'};font-family:'Abel',sans-serif;font-size:1.15vw;
                    display:flex;gap:0.5vw;justify-content:center;align-items:center;fill:#FFFFFF;
                    cursor:pointer;padding:0.3vh 0;user-select:none;">
                    ${active ? SVG_FILLED : `<svg xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>`}
                    <div>${label}</div>
                </div>`;
            };
            
            const modeRow = (label, key) => {
                const active = self.STATE.options.modes[key];
                return `<div onclick="window.toggleMode('${key}');window._aceSFX&&window._aceSFX.toggle()"
                    style="color:${active?'#fff':'gray'};font-family:'Abel',sans-serif;font-size:1.15vw;
                    display:flex;gap:0.5vw;justify-content:center;align-items:center;fill:#FFFFFF;
                    cursor:pointer;padding:0.3vh 0;user-select:none;">
                    ${active
                        ? `<svg xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"/></svg>`
                        : `<svg xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z"/></svg>`}
                    <div>${label}</div>
                </div>`;
            };
            
            const self = this;
            
            this.Component = class {
                constructor(id, html) {
                    this.ID = id;
                    this.HTML = html;
                }
                _render() {
                    if (typeof this.HTML !== 'function') throw new Error(`[ACE] Component ${this.ID}: second arg must be a function`);
                    return this.HTML();
                }
                buildElement(props = {}) {
                    return this._render().replace(/\|\|([^|]+)\|\|/g, (match, key) => {
                        if (!Object.prototype.hasOwnProperty.call(props, key)) {
                            console.warn(`[ACE] buildElement: prop '${key}' missing (Component ${this.ID})`);
                            return match;
                        }
                        return props[key] ?? match;
                    });
                }
                getElement() {
                    const wrap = document.createElement('span');
                    wrap.innerHTML = this._render();
                    if (wrap.children.length !== 1) throw new Error(`[ACE] Component ${this.ID} must have exactly one root element`);
                    wrap.children[0].setAttribute('id', this.ID);
                    return wrap.innerHTML;
                }
                refreshElement() {
                    try {
                        const el = document.getElementById(this.ID);
                        if (!el) return;
                        const wrap = document.createElement('span');
                        wrap.innerHTML = this._render();
                        const newHTML = wrap.children[0].innerHTML;
                        if (el.innerHTML === newHTML) return;
                        el.innerHTML = newHTML;
                    } catch (ex) { console.warn(`[ACE] refreshElement '${this.ID}':`, ex); }
                }
                hardRefreshElement() {
                    try {
                        const el = document.getElementById(this.ID);
                        if (!el) return;
                        const wrap = document.createElement('span');
                        wrap.innerHTML = this._render();
                        wrap.children[0].setAttribute('id', this.ID);
                        el.outerHTML = wrap.innerHTML;
                    } catch (ex) { console.warn(`[ACE] hardRefreshElement '${this.ID}':`, ex); }
                }
            };
            
            this.Settings = new this.Component('SLSettings', () => `
            <div id="SL_SETTINGS" style="box-sizing:border-box;flex:1;min-height:0;width:100%;display:flex;flex-direction:column;background-color:#0b0b0b;">
                <div class="ace-sl-panel-hdr">
                    <div class="ace-sl-panel-hdr-title">Settings</div>
                    <span class="ace-sl-settings-close" onclick="window.closeSLSettings()" title="Close settings">×</span>
                </div>
                <div style="padding:0.6vw;flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:0;">
                <div style="display:flex;flex-direction:row;flex-shrink:0;">
                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding:0.5vw;overflow-y:auto;">
                        <div style="font-family:'DM Sans',sans-serif;font-size:1.3vw;color:white;font-weight:600;margin-bottom:0.8vh;letter-spacing:0.05em;width:100%;text-align:center;padding-bottom:0.5vh;border-bottom:1px solid #1a1a1a;">REGION</div>
                        ${regionRow('Europe', 'europe')}
                        ${regionRow('America', 'america')}
                        ${regionRow('Asia', 'asia')}
                    </div>
                    <div style="width:1px;background:#1a1a1a;align-self:stretch;margin:0.4vw 0;"></div>
                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding:0.5vw;overflow-y:auto;">
                        <div style="font-family:'DM Sans',sans-serif;font-size:1.3vw;color:white;font-weight:600;margin-bottom:0.8vh;letter-spacing:0.05em;width:100%;text-align:center;padding-bottom:0.5vh;border-bottom:1px solid #1a1a1a;">MODE</div>
                        ${modeRow('Team', 'team')}
                        ${modeRow('Survival', 'survival')}
                        ${modeRow('Deathmatch', 'deathmatch')}
                        ${modeRow('Modded', 'modding')}
                        ${modeRow('Invasion', 'invasion')}
                    </div>
                </div>
                <hr style="border:none;border-top:1px solid #1a1a1a;margin:0.4vw 0;flex-shrink:0;">
                <div style="display:flex;flex-direction:column;align-items:center;padding:0.4vw 0.5vw;gap:0.6vh;">
                    <div style="font-family:'DM Sans',sans-serif;font-size:1.3vw;color:white;font-weight:600;letter-spacing:0.05em;width:100%;text-align:center;padding-bottom:0.5vh;border-bottom:1px solid #1a1a1a;">OPTIONS</div>
                    <div style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:0.5vw;font-family:'Abel',sans-serif;font-size:1.1vw;color:gray;">
                        <span>Refresh rate (ms)</span>
                        <input type="number" min="500" step="100" value="${self.STATE.options.pollMs}"
                            oninput="window.setSLPollMs(this.value)"
                            style="width:5vw;background:#0b0b0b;border:1px solid #1a1a1a;border-radius:4px;color:white;font-family:'Abel',sans-serif;font-size:1.1vw;padding:0.2vh 0.3vw;text-align:center;outline:none;">
                    </div>
                </div>
                </div>
            </div>`);
            
            this.LoadingAnimation = new this.Component('LoadingAnimation', () => `
            <svg id="LoadingAnimation" style="height:4.8vh;aspect-ratio:1/1" viewBox="0 0 100 100">
                <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="6">
                    <path d="M 21 40 V 59"><animateTransform attributeName="transform" attributeType="XML" type="rotate" values="0 21 59; 180 21 59" dur="2s" repeatCount="indefinite"/></path>
                    <path d="M 79 40 V 59"><animateTransform attributeName="transform" attributeType="XML" type="rotate" values="0 79 59; -180 79 59" dur="2s" repeatCount="indefinite"/></path>
                    <path d="M 50 21 V 40"><animate attributeName="d" values="M 50 21 V 40; M 50 59 V 40" dur="2s" repeatCount="indefinite"/></path>
                    <path d="M 50 60 V 79"><animate attributeName="d" values="M 50 60 V 79; M 50 98 V 79" dur="2s" repeatCount="indefinite"/></path>
                    <path d="M 50 21 L 79 40 L 50 60 L 21 40 Z"><animate attributeName="stroke" values="rgba(255,255,255,1); rgba(100,100,100,0)" dur="2s" repeatCount="indefinite"/></path>
                    <path d="M 50 40 L 79 59 L 50 79 L 21 59 Z"/>
                    <path d="M 50 59 L 79 78 L 50 98 L 21 78 Z"><animate attributeName="stroke" values="rgba(100,100,100,0); rgba(255,255,255,1)" dur="2s" repeatCount="indefinite"/></path>
                    <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0; 0 -19" dur="2s" repeatCount="indefinite"/>
                </g>
            </svg>`);
            
            const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
            
            this.Listing = new this.Component('ServerListing', () => {
                const displaySystems = self.STATE.activeSLMode
                    ? self.STATE.filteredSystems.filter(s => s.mode === self.STATE.activeSLMode)
                    : self.STATE.filteredSystems;
                
                const modeLabel = self.STATE.activeSLMode ? capitalize(self.STATE.activeSLMode) : 'All Modes';
                const titleBar = `
                <div class="ace-sl-panel-hdr">
                    <div class="ace-sl-panel-hdr-title">
                        Server List${self.STATE.activeSLMode ? ` <span class="ace-sl-panel-hdr-sub">${modeLabel}</span>` : ''}
                    </div>
                    <span class="ace-sl-panel-gear-btn${self.STATE.activeSLTab === 'settings' ? ' settings-open' : ''}"
                        onclick="window.switchSLTab('settings')" title="Filter settings">&#x78;</span>
                </div>`;
                
                if (self.STATE.listingLoading) {
                    return `<div id="SL_LISTING" style="box-sizing:border-box;flex:1;min-height:0;width:100%;display:flex;flex-direction:column;background-color:#0b0b0b;">
                        ${titleBar}
                        <div style="flex:1;display:flex;align-items:center;justify-content:center;">
                            ${self.LoadingAnimation.getElement()}
                        </div>
                    </div>`;
                }
                
                const innerContent = displaySystems.length === 0
                    ? `<div style="font-family:'Abel',sans-serif;color:#444;margin:auto;">No servers found</div>`
                    : displaySystems.map(s => self.SystemDisplay.buildElement({
                        id: s.id,
                        ip: s.IP_ADDR,
                        name: s.name,
                        mode: s.mode === 'modding' ? capitalize(s.mod_id || 'Custom') : capitalize(s.mode),
                        time: String(~~(s.time / 60)),
                        players: String(s.players),
                    })).join('');
                
                return `<div id="SL_LISTING" style="box-sizing:border-box;flex:1;min-height:0;width:100%;display:flex;flex-direction:column;background-color:#0b0b0b;">
                    ${titleBar}
                    <div style="flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:0.6vw;">
                        ${innerContent}
                    </div>
                </div>`;
            });
            
            this.EventsPanel = new this.Component('SLEvents', () => `
            <div id="SLEvents" style="box-sizing:border-box;flex:1;min-height:0;width:100%;display:flex;flex-direction:column;background-color:#0b0b0b;">
                <div class="ace-sl-panel-hdr">
                    <div class="ace-sl-panel-hdr-title">Events</div>
                </div>
                <div style="flex:1;display:flex;align-items:center;justify-content:center;">
                    <div style="color:#333;font-family:'Abel',sans-serif;font-size:1.2vw;text-align:center;">
                        Events coming soon
                    </div>
                </div>
            </div>`);
            
            this.SystemDisplay = new this.Component('SystemDisplay', () => `
            <div onclick="window.statusReport('||id||@||ip||')"
                class="ace-sl-card"
                style="width:100%;cursor:pointer;min-height:8.5vh;margin-bottom:0.9vh;border-radius:12px;border:1px solid #1a1a1a;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;box-sizing:border-box;padding:0.4vh;">
                <div style="font-family:'DM Sans',sans-serif;color:white;font-weight:600;font-size:1.4vw;">||name||</div>
                <div style="width:82%;height:1px;background-color:#1a1a1a;"></div>
                <div style="width:92%;display:flex;align-items:center;justify-content:space-between;color:gray;font-family:'Abel',sans-serif;font-size:0.8vw;position:relative;">
                    <div>||mode||</div>
                    <div style="position:absolute;top:0;left:0;width:100%;text-align:center;">||time|| min</div>
                    <div>||players|| players</div>
                </div>
            </div>`);
        },
        
        buildPanel() {
            const smEl = document.createElement('div');
            smEl.id = 'StatusReportModal';
            smEl.style.cssText = 'display:none;position:fixed;';
            document.body.appendChild(smEl);
            
            const sidebar = document.createElement('div');
            sidebar.id = 'ace-sl-sidebar';
            const tabs = document.createElement('div');
            tabs.id = 'ace-sl-tabs';
            const panel = document.createElement('div');
            panel.id = 'ace-sl-panel';
            
            sidebar.appendChild(tabs);
            sidebar.appendChild(panel);
            document.body.appendChild(sidebar);
            
            this.renderSLTabs();
            this.renderSLPanel();
        },
        
        renderSLTabs() {
            const tabs = document.getElementById('ace-sl-tabs');
            if (!tabs) return;
            
            const g = (cp) => String.fromCodePoint(parseInt(cp, 16));
            
            const SUBTABS = [
                { mode: 'team', glyph: g('00BD'), title: 'Team' },
                { mode: 'survival', glyph: g('00BC'), title: 'Survival' },
                { mode: 'deathmatch', glyph: g('00BE'), title: 'Deathmatch' },
                { mode: 'invasion', glyph: g('00BF'), title: 'Invasion' },
                { mode: 'modding', glyph: g('00C1'), title: 'Modded' },
            ];
            
            const makeIcon = (tabId) => {
                if (tabId === 'sl') {
                    const s = document.createElement('span');
                    s.className = 'ace-sl-tab-icon';
                    s.textContent = g('0021');
                    return s;
                }
                const wrap = document.createElement('div');
                wrap.className = 'ace-sl-tab-compound';
                const main = document.createElement('span');
                main.className = 'ace-sl-icon-main';
                const overlay = document.createElement('span');
                overlay.className = 'ace-sl-icon-overlay';
                if (tabId === 'search') {
                    main.textContent = g('002B');
                    overlay.textContent = g('0079');
                } else {
                    main.textContent = g('0032');
                    overlay.textContent = g('0031');
                }
                wrap.appendChild(main);
                wrap.appendChild(overlay);
                return wrap;
            };
            
            tabs.innerHTML = '';
            
            ['sl', 'search', 'events'].forEach((tabId, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === 2;
                const isActive = this.STATE.activeSLTab === tabId || (tabId === 'sl' && this.STATE.activeSLTab === 'settings');
                
                const el = document.createElement('div');
                el.className = 'ace-sl-tab' + (isActive ? ' active' : '') + (isFirst ? ' first' : '') + (isLast ? ' last' : '');
                el.setAttribute('data-tab', tabId);
                
                const bg = document.createElement('div');
                bg.className = 'ace-sl-tab-bg' + (isFirst ? ' first' : '') + (isLast ? ' last' : '');
                bg.appendChild(makeIcon(tabId));
                el.appendChild(bg);
                
                el.addEventListener('click', () => {
                    window._aceSFX?.click();
                    window.switchSLTab(tabId);
                });
                
                if (tabId === 'sl') {
                    if (this.STATE.activeSLMode !== null && this.STATE.activeSLTab === 'sl') {
                        el.classList.add('sl-subtab-open');
                    }
                    
                    const clip = document.createElement('div');
                    clip.className = 'ace-sl-subtab-clip';
                    
                    const subGroup = document.createElement('div');
                    subGroup.className = 'ace-sl-subtab-group';
                    
                    SUBTABS.forEach((sub, si) => {
                        const isSubLast = si === SUBTABS.length - 1;
                        const subEl = document.createElement('div');
                        subEl.className = 'ace-sl-subtab' + (this.STATE.activeSLMode === sub.mode && this.STATE.activeSLTab === 'sl' ? ' active' : '') + (isSubLast ? ' last' : '');
                        subEl.title = sub.title;
                        
                        const subBg = document.createElement('div');
                        subBg.className = 'ace-sl-subtab-bg' + (isSubLast ? ' last' : '');
                        const subIcon = document.createElement('span');
                        subIcon.className = 'ace-sl-subtab-icon';
                        subIcon.textContent = sub.glyph;
                        subBg.appendChild(subIcon);
                        subEl.appendChild(subBg);
                        
                        subEl.addEventListener('click', e => {
                            e.stopPropagation();
                            window._aceSFX?.click();
                            window.switchSLMode(sub.mode);
                        });
                        subGroup.appendChild(subEl);
                    });
                    
                    clip.appendChild(subGroup);
                    el.appendChild(clip);
                }
                
                tabs.appendChild(el);
            });
        },
        
        renderSLPanel() {
            const panelEl = document.getElementById('ace-sl-panel');
            const sidebar = document.getElementById('ace-sl-sidebar');
            if (!panelEl || !sidebar) return;
            
            if (!this.STATE.activeSLTab) {
                sidebar.classList.remove('open');
                setTimeout(() => { if (!this.STATE.activeSLTab) panelEl.innerHTML = ''; }, 280);
                return;
            }
            
            switch (this.STATE.activeSLTab) {
                case 'sl': panelEl.innerHTML = this.Listing.getElement(); break;
                case 'settings': panelEl.innerHTML = this.Settings.getElement(); break;
                case 'events': panelEl.innerHTML = this.EventsPanel.getElement(); break;
            }
            
            sidebar.classList.add('open');
        },
        
        startPoller() {
            clearInterval(this.apiTimer);
            if (this.STATE.activeSLTab !== 'sl') return;
            
            const self = this;
            this.apiTimer = setInterval(async () => {
                if (self.STATE.activeSLTab !== 'sl') return;
                try {
                    const raw = await (await fetch('https://starblast.dankdmitron.dev/api/simstatus.json')).json();
                    const wasLoading = self.STATE.listingLoading;
                    self.STATE.listingLoading = false;
                    const allSystems = [];
                    for (const item of raw) {
                        if (item.location.toLowerCase() !== self.STATE.options.activeRegion) continue;
                        for (const system of item.systems) {
                            if (self.STATE.activeSLMode) {
                                if (system.mode === self.STATE.activeSLMode) {
                                    allSystems.push({ ...system, IP_ADDR: item.address });
                                }
                            } else {
                                if (self.STATE.options.modes[system.mode]) {
                                    allSystems.push({ ...system, IP_ADDR: item.address });
                                }
                            }
                        }
                    }
                    self.STATE.filteredSystems = allSystems.sort((a, b) => a.time - b.time);
                    if (self.STATE.activeSLTab === 'sl') {
                        if (wasLoading) self.renderSLPanel(); else self.Listing.refreshElement();
                    }
                } catch (ex) { console.warn('[ACE] Listing poll error:', ex); }
            }, this.STATE.options.pollMs || 3200);
        }
    };
    
    // Expose for other modules
    window.AceServerList = module;
    
    return module;
})(window.AceCore, window.AceSFX, window.AceCONFIG, window.AceSTATE);