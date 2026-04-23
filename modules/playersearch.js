// Ace Client Player Search Module
// Search players across all servers

(function(AceCore, AceSFX, CONFIG, STATE) {
    'use strict';

    const module = {
        name: 'playersearch',
        
        init() {
            this.userSearch = {
                active: false, loading: false, input: '', results: [], systemsQueried: 0,
                unicodeMode: false,
            };
            this.setupWindowFunctions();
            this.buildSearchPanel();
            console.log('[ACE] Player Search module loaded');
        },
        
        destroy() {
            clearInterval(this.searchTimer);
            const panel = document.getElementById('SLSearch');
            if (panel) panel.remove();
        },
        
        setupWindowFunctions() {
            const self = this;
            
            window.toggleSLUnicode = () => {
                self.userSearch.unicodeMode = !self.userSearch.unicodeMode;
                self.renderSearchPanel();
                self.attachSearchInputKeyGuard();
            };
            
            window.handleSearch = () => {
                const inputEl = document.getElementById('ace-sl-search');
                if (inputEl) self.userSearch.input = inputEl.value;
                
                if (!self.userSearch.input) {
                    self.userSearch.loading = false;
                    self.userSearch.results = [];
                    self.renderSearchPanel();
                    self.attachSearchInputKeyGuard();
                    return;
                }
                self.userSearch.loading = true;
                self.renderSearchPanel();
                self.attachSearchInputKeyGuard();
                self.restoreCaret();
                
                if (self.searchTimer) clearTimeout(self.searchTimer);
                self.searchTimer = setTimeout(async () => {
                    self.userSearch.systemsQueried = 0;
                    const allPlayers = [];
                    
                    // Access filtered systems from serverlist module
                    const serverList = window.AceServerList;
                    if (!serverList || !serverList.STATE) {
                        self.userSearch.loading = false;
                        self.renderSearchPanel();
                        return;
                    }
                    
                    const filteredSystems = serverList.STATE.filteredSystems;
                    
                    for (const system of filteredSystems) {
                        try {
                            const query = `${system.id}@${system.IP_ADDR}`;
                            const raw = await (await fetch(`https://starblast.dankdmitron.dev/api/status/${query}`)).json();
                            for (const player of Object.values(raw.players ?? {})) {
                                allPlayers.push({ name: player.player_name, query });
                            }
                            self.userSearch.systemsQueried++;
                        } catch (_) {}
                    }
                    
                    self.userSearch.results = allPlayers
                        .map(p => ({ ...p, similarity: self.calculateSimilarity(p.name).toFixed(2) }))
                        .filter(p => Number(p.similarity) > 25)
                        .sort((a, b) => b.similarity - a.similarity);
                    self.userSearch.loading = false;
                    self.renderSearchPanel();
                    self.attachSearchInputKeyGuard();
                    self.restoreCaret();
                }, 300);
            };
        },
        
        restoreCaret() {
            const el = document.getElementById('ace-sl-search');
            if (!el) return;
            el.focus();
            el.value = '';
            el.value = this.userSearch.input;
        },
        
        calculateSimilarity(queryName) {
            const _UNICODE_MAP = {
                'Ⓐ':'A','Ⓑ':'B','Ⓒ':'C','Ⓓ':'D','Ⓔ':'E','Ⓕ':'F','Ⓖ':'G','Ⓗ':'H','Ⓘ':'I','Ⓙ':'J',
                'Ⓚ':'K','Ⓛ':'L','Ⓜ':'M','Ⓝ':'N','Ⓞ':'O','Ⓟ':'P','Ⓠ':'Q','Ⓡ':'R','Ⓢ':'S','Ⓣ':'T',
                'Ⓤ':'U','Ⓥ':'V','Ⓦ':'W','Ⓧ':'X','Ⓨ':'Y','Ⓩ':'Z',
                'Ａ':'A','Ｂ':'B','Ｃ':'C','Ｄ':'D','Ｅ':'E','Ｆ':'F','Ｇ':'G','Ｈ':'H','Ｉ':'I','Ｊ':'J',
                'Ａ':'A','Ｂ':'B','Ｃ':'C','Ｄ':'D','Ｅ':'E','Ｆ':'F','Ｇ':'G','Ｈ':'H','Ｉ':'I','Ｊ':'J',
                'а':'A','в':'B','с':'C','е':'E','н':'H','і':'I','ј':'J','к':'K','м':'M',
                'о':'O','р':'P','с':'S','т':'T','х':'X','у':'Y',
                '0':'O','1':'I','3':'E','4':'A','5':'S','6':'G','7':'T','8':'B','9':'G',
                '@':'A','!':'I','$':'S',
            };
            
            const _UNICODE_REGEX = new RegExp(
                Object.keys(_UNICODE_MAP).map(k => k.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')).join('|'), 'g'
            );
            
            const normalizeForSearch = (str) =>
                str.replace(_UNICODE_REGEX, ch => _UNICODE_MAP[ch] || ch)
                   .normalize('NFD')
                   .replace(/[̀-ͯ​-‏⁢⁤﻿]/g, '')
                   .toUpperCase();
            
            const levenshtein = (s1, s2) => {
                const m = s1.length, n = s2.length;
                if (m === 0) return n;
                if (n === 0) return m;
                const dp = Array.from({ length: m + 1 }, (_, i) => {
                    const row = new Array(n + 1).fill(0);
                    row[0] = i;
                    return row;
                });
                for (let j = 0; j <= n; j++) dp[0][j] = j;
                for (let i = 1; i <= m; i++) {
                    for (let j = 1; j <= n; j++) {
                        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
                        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
                    }
                }
                return dp[m][n];
            };
            
            const ref = this.userSearch.unicodeMode ? normalizeForSearch(this.userSearch.input) : this.userSearch.input.toUpperCase();
            const norm = this.userSearch.unicodeMode ? normalizeForSearch(queryName) : queryName.toUpperCase();
            const maxLen = Math.max(norm.length, ref.length);
            if (maxLen === 0) return 100;
            return ((maxLen - levenshtein(norm, ref)) / maxLen) * 100;
        },
        
        buildSearchPanel() {
            // Panel will be rendered when needed
        },
        
        renderSearchPanel() {
            const self = this;
            const unicodeActive = this.userSearch.unicodeMode;
            const hasResults = this.userSearch.results.length > 0;
            
            const titleBar = `
            <div class="ace-sl-panel-hdr">
                <div class="ace-sl-panel-hdr-title">Player Search</div>
                <span class="ace-sl-panel-gear-btn" onclick="window.switchSLTab('settings')" title="Filter settings">&#x78;</span>
            </div>`;
            
            const tableHeader = `
            <div style="display:flex;height:2.2vh;padding:0.3vh 0;border-bottom:1px solid #1a1a1a;font-family:'Abel',sans-serif;color:#444;background:#0b0b0b;font-size:1.4vh;margin-bottom:0.7vh;flex-shrink:0;">
                <div style="width:33.3%">NAME</div>
                <div style="width:33.3%">SIMILARITY</div>
                <div style="width:33.3%">SERVER</div>
            </div>`;
            
            let resultsHTML = '';
            if (this.userSearch.loading) {
                resultsHTML = `<div style="display:flex;flex:1;align-items:center;justify-content:center;">
                    ${window.AceServerList ? window.AceServerList.LoadingAnimation.getElement() : '<span>Loading...</span>'}
                </div>`;
            } else if (this.userSearch.input && !hasResults) {
                resultsHTML = tableHeader + `
                <div style="width:100%;display:flex;flex-direction:column;font-family:'Abel',sans-serif;color:#444;">
                    <div style="font-size:4.2vh;margin-top:1vh;">(⌐■_■)</div>
                    <div style="font-size:1.9vh"><br>No hits found<br>"${this.sanitizeUsername(this.userSearch.input)}" yields no users above 25% similarity.</div>
                </div>`;
            } else if (hasResults) {
                const valueToColor = (value) => {
                    const lerpColor = (c1, c2, t) => {
                        const r = Math.round(c1.r * (1 - t) + c2.r * t);
                        const g = Math.round(c1.g * (1 - t) + c2.g * t);
                        const b = Math.round(c1.b * (1 - t) + c2.b * t);
                        return '#' + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
                    };
                    return lerpColor({ r: 255, g: 57, b: 49 }, { r: 55, g: 221, b: 55 }, value / 100);
                };
                
                resultsHTML = tableHeader +
                    this.userSearch.results.map(item => `
                    <div style="display:flex;height:2vh;font-weight:600;padding:0.1vh 0;font-family:'Abel',sans-serif;color:white;outline:0;background:#0b0b0b;text-shadow:black 0px 0px 0px;border-radius:5px;font-size:1.6vh;margin-bottom:0.7vh;">
                        <div style="width:33.3%;max-width:33.3%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${this.sanitizeUsername(item.name)}</div>
                        <div style="width:33.3%;color:${valueToColor(Number(item.similarity))};">${item.similarity}%</div>
                        <div style="width:33.3%;display:flex;justify-content:center;">
                            <svg onclick="window.statusReport('${item.query}')" xmlns="http://www.w3.org/2000/svg" style="height:100%;aspect-ratio:1/1;fill:white;cursor:pointer;" viewBox="0 -960 960 960">
                                <path d="M440-220q125 0 212.5-87.5T740-520q0-125-87.5-212.5T440-820q-125 0-212.5 87.5T140-520q0 125 87.5 212.5T440-220Zm0-300Zm0 160q-83 0-147.5-44.5T200-520q28-70 92.5-115T440-680q82 0 146.5 45T680-520q-29 71-93.5 115.5T440-360Zm0-60q55 0 101-26.5t72-73.5q-26-46-72-73t-101-27q-56 0-102 27t-72 73q26 47 72 73.5T440-420Zm0-50q20 0 35-14.5t15-35.5q0-20-15-35t-35-15q-21 0-35.5 15T390-520q0 21 14.5 35.5T440-470Zm0 310q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T80-520q0-74 28.5-139.5t77-114.5q48.5-49 114-77.5T440-880q74 0 139.5 28.5T694-774q49 49 77.5 114.5T800-520q0 67-22.5 126T715-287l164 165-42 42-165-165q-48 40-107 62.5T440-160Z"/>
                            </svg>
                        </div>
                    </div>`).join('') +
                    `<div style="font-family:'Abel',sans-serif;color:#444;font-size:1.9vh;text-align:center;margin-top:1vh;">
                        ${this.userSearch.results.length} results · ${this.userSearch.systemsQueried}/${window.AceServerList?.STATE?.filteredSystems?.length || 0} servers queried
                    </div>`;
            }
            
            const searchBtnIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1.4vh" viewBox="0 -960 960 960" fill="currentColor"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>`;
            
            const unicodeBtnStyle = `height:3.5vh;padding:0 0.55vw;background:${unicodeActive ? 'rgba(126,200,200,0.12)' : '#111'};border:1px solid ${unicodeActive ? 'rgba(126,200,200,0.4)' : '#1a1a1a'};border-left:1px solid ${unicodeActive ? 'rgba(126,200,200,0.12)' : 'transparent'};border-radius:0 4px 4px 0;color:${unicodeActive ? '#7ec8c8' : '#555'};cursor:pointer;font-size:1.1vh;font-family:SBGlyphs;font-style:normal;transition:background 0.15s,border-color 0.15s,color 0.15s;line-height:1;`;
            
            const inputBorderColor = unicodeActive ? 'rgba(126,200,200,0.3)' : '#1a1a1a';
            
            const html = `<div id="SLSearch" style="box-sizing:border-box;flex:1;min-height:0;width:100%;display:flex;flex-direction:column;background-color:#0b0b0b;">
                ${titleBar}
                <div style="padding:0.6vw;display:flex;flex-direction:column;flex:1;min-height:0;">
                    <div style="display:flex;gap:0.4vw;margin-bottom:0.8vh;flex-shrink:0;align-items:stretch;">
                        <div style="display:flex;flex:1;min-width:0;">
                            <input id="ace-sl-search" value="${this.sanitizeUsername(this.userSearch.input)}"
                                class="noglow-placeholder"
                                placeholder="Search player across all servers"
                                style="flex:1;min-width:0;height:3.5vh;padding:0 0.5vw;font-family:'Abel',sans-serif;color:white;border:1px solid ${inputBorderColor};border-right:none;outline:0;background:#111;border-radius:4px 0 0 4px;font-size:1.7vh;box-sizing:border-box;transition:border-color 0.15s;">
                            <button onclick="window.toggleSLUnicode()" title="Toggle special character matching"
                                style="${unicodeBtnStyle}"
                                onmouseover="this.style.background='#1a1a1a'" onmouseout="this.style.background='${unicodeActive ? 'rgba(126,200,200,0.12)' : '#111'}'">&#x0044;</button>
                        </div>
                        <button onclick="window.handleSearch()" title="Search"
                            style="height:3.5vh;padding:0 0.7vw;background:#111;border:1px solid #1a1a1a;border-radius:4px;flex-shrink:0;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.12s,border-color 0.12s;"
                            onmouseover="this.style.background='#1a1a1a';this.style.borderColor='#333'"
                            onmouseout="this.style.background='#111';this.style.borderColor='#1a1a1a'">${searchBtnIcon}</button>
                    </div>
                    <div style="flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;">
                        ${resultsHTML}
                    </div>
                </div>
            </div>`;
            
            const panelEl = document.getElementById('ace-sl-panel');
            if (panelEl) panelEl.innerHTML = html;
        },
        
        sanitizeUsername(username) {
            return username
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        },
        
        attachSearchInputKeyGuard() {
            const el = document.getElementById('ace-sl-search');
            if (!el || el._aceKeyGuard) return;
            el._aceKeyGuard = true;
            el.addEventListener('keydown', (e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();
                if (e.key === 'Enter') window.handleSearch();
            }, true);
        }
    };
    
    window.AcePlayerSearch = module;
    return module;
})(window.AceCore, window.AceSFX, window.AceCONFIG, window.AceSTATE);