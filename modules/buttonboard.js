// Ace Client Button Board Module
// Utilities: stealShips, ecpCheck, banners

(function(AceCore, AceSFX, CONFIG, STATE) {
    'use strict';

    const module = {
        name: 'buttonboard',
        
        init() {
            this.runtime = {};
            this.openButtons();
            console.log('[ACE] Button Board module loaded');
        },
        
        destroy() {
            const box = document.getElementById('buttonBox');
            if (box) box.remove();
        },
        
        isInGame() {
            return !!(window.module?.exports?.settings);
        },
        
        openButtons() {
            if (document.getElementById('buttonBox')) return;
            
            const box = document.createElement('div');
            box.id = 'buttonBox';
            box.className = 'buttonBox';
            box.style.cssText = 'background:#111;border-radius:16px;box-shadow:0 4px 30px rgba(0,0,0,0.5);border:1px solid #2a2a2a;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);min-width:300px;max-width:500px;min-height:100px;max-height:80vh;z-index:100000000;padding:16px;display:flex;flex-direction:column;';
            
            const title = document.createElement('div');
            title.style.cssText = 'font-size:1.1rem;font-weight:700;color:#7ec8c8;margin-bottom:14px;text-transform:uppercase;letter-spacing:0.05em;';
            title.textContent = 'Ace Tools';
            
            const closeBtn = document.createElement('span');
            closeBtn.style.cssText = 'position:absolute;top:12px;right:14px;cursor:pointer;font-size:1.4rem;color:#555;transition:color .15s;';
            closeBtn.textContent = '×';
            closeBtn.onmouseenter = () => closeBtn.style.color = '#fff';
            closeBtn.onmouseleave = () => closeBtn.style.color = '#555';
            closeBtn.onclick = () => box.remove();
            
            const grid = document.createElement('div');
            grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;';
            
            const buttons = [
                { label: 'Ship Stealer', action: () => this.stealShips() },
                { label: 'ECP Checker', action: () => this.ecpCheck() },
                { label: 'SQ Banner', action: () => this.SQBanner() },
                { label: 'NG Banner', action: () => this.NGBanner() },
            ];
            
            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.className = 'buttonButton';
                button.style.cssText = 'background:#1a1a1a;border-radius:10px;border:1px solid #2a2a2a;color:#fff;font-size:0.85rem;font-weight:700;text-align:center;cursor:pointer;padding:10px 16px;transition:background .15s;';
                button.textContent = btn.label;
                button.onmouseenter = () => button.style.background = '#2a2a2a';
                button.onmouseleave = () => button.style.background = '#1a1a1a';
                button.onclick = () => {
                    AceSFX?.click();
                    btn.action();
                };
                grid.appendChild(button);
            });
            
            box.appendChild(title);
            box.appendChild(closeBtn);
            box.appendChild(grid);
            document.body.appendChild(box);
        },
        
        stealShips() {
            console.log('[ACE] Retrieving ship list...');
            try {
                const ships = Object.values(Object.values(window.module.exports.settings)
                    .find(x => x.mode).mode).find(x => x.ships).ships;
                const tab = window.open('');
                tab.document.write('//Made with Ace Client Ship Stealer<br><br>var ships = [];<br><br>');
                tab.document.title = 'Ship Code';
                for (let i = 0; i < ships.length; i++) {
                    const raw = ships[i];
                    const parsed = typeof raw === 'object' ? raw : JSON.parse(raw);
                    const varName = (parsed.name + '_' + parsed.level + '0' + parsed.model)
                        .replace(/-/g, '_').replace(/ /g, '_');
                    tab.document.write(`${varName} = '${JSON.stringify(parsed)}'<br>`);
                    tab.document.write(`ships.push(${varName});<br><br>`);
                }
                tab.document.write("this.options = { map_size: 50, max_players: 70, reset_tree: true, ships:ships, asteroids_strength: 0.1, root_mode: 'survival', starting_ship: 101, crystal_value: 2.5, }; this.tick = function(game) { };");
                tab.document.close();
                console.log('[ACE] Ships exported');
            } catch (e) {
                console.error('[ACE] Ship stealer error:', e);
            }
        },
        
        ecpCheck() {
            if (!this.isInGame()) return;
            const hueColor = h => {
                if (h < 25) return 'Red';
                if (h < 50) return 'Orange';
                if (h < 75) return 'Yellow';
                if (h < 150) return 'Green';
                if (h < 256) return 'Blue';
                if (h < 287) return 'Purple';
                if (h < 331) return 'Pink';
                return undefined;
            };
            try {
                const settingsKey = Object.keys(window.module.exports.settings).filter(k => k.match(/[iI10OlL]{3,6}/))[0];
                const teams = {}, rows = [];
                window.module.exports.settings[settingsKey].names.data
                    .filter(x => x !== undefined)
                    .forEach(p => {
                        const col = hueColor(p.hue);
                        const name = p.player_name.replace('\u2062', '');
                        const badge = p.custom ? p.custom.badge.charAt(0).toUpperCase() + p.custom.badge.slice(1) : 'No ECP';
                        rows.push(`${p.hue}_${col} - ${name} - ${badge}`);
                        if (!teams[col]) teams[col] = { ecps: 0, hidden: 0, randoms: 0, total: 0, hue: 0, names: '\n', map: new Map() };
                        if (p.custom && !teams[col].map.has(name)) {
                            teams[col].ecps++;
                            if (p.custom.badge === 'Blank') teams[col].hidden++;
                            teams[col].hue = p.hue;
                            teams[col].names += `${name} - ${badge}\n`;
                        } else { teams[col].randoms++; }
                        teams[col].total++;
                        teams[col].map.set(name, true);
                    });
                rows.sort().forEach(r => console.log('%c' + r.split('_')[1], `color:hsl(${r.split('_')[0]},100%,80%)`));
                for (const [col, data] of Object.entries(teams)) {
                    console.log(`%c${data.names}`, `color:hsl(${data.hue},100%,80%)`, data,
                        data.ecps >= 4 && data.ecps / (data.hidden || 1) > 0.5 ? 'Probably Badgers' : '');
                }
            } catch (e) {
                console.error('[ACE] ECP Check error:', e);
            }
        },
        
        SQBanner() {
            if (!this.isInGame()) return;
            if (this.runtime.sorhm) {
                this.runtime.sorhm = false;
                console.log('[ACE] SQ Banner disabled');
                return;
            }
            try {
                const state = Object.values(Object.values(window.module.exports.settings).find(x => x.mode));
                const status = state.find(x => x.status).status;
                if (status.shield === 0 || status.generator === 0) return;
                this.runtime.sorhm = true;
                const socket = state.find(x => x.socket).socket;
                const seq = ['SQQQQ', 'QSQQQ', 'QQSQQ', 'QQQSQ', 'QQQQS'];
                let step = 0;
                const tick = () => {
                    if (!this.runtime.sorhm) return;
                    socket.send(JSON.stringify({ name: 'say', data: seq[step] }));
                    step = (step + 1) % seq.length;
                    setTimeout(tick, 600);
                };
                tick();
                console.log('[ACE] SQ Banner enabled');
            } catch (e) {
                console.error('[ACE] SQ Banner error:', e);
            }
        },
        
        NGBanner() {
            if (!this.isInGame()) return;
            if (this.runtime.nogg) {
                this.runtime.nogg = false;
                console.log('[ACE] NG Banner disabled');
                return;
            }
            try {
                const state = Object.values(Object.values(window.module.exports.settings).find(x => x.mode));
                const status = state.find(x => x.status).status;
                if (status.shield === 0 || status.generator === 0) return;
                this.runtime.nogg = true;
                const socket = state.find(x => x.socket).socket;
                const seq = ['GNNNN', 'NGNNN', 'NNGNN', 'NNNGN', 'NNNNG'];
                let step = 0;
                const tick = () => {
                    if (!this.runtime.nogg) return;
                    socket.send(JSON.stringify({ name: 'say', data: seq[step] }));
                    step = (step + 1) % seq.length;
                    setTimeout(tick, 600);
                };
                tick();
                console.log('[ACE] NG Banner enabled');
            } catch (e) {
                console.error('[ACE] NG Banner error:', e);
            }
        }
    };
    
    window.AceButtonBoard = module;
    return module;
})(window.AceCore, window.AceSFX, window.AceCONFIG, window.AceSTATE);