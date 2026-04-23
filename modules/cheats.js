// Ace Client Cheats Module
// Extra gameplay features

(function(AceCore, AceSFX, CONFIG, STATE) {
    'use strict';

    const module = {
        name: 'cheats',
        
        init() {
            this.runtime = {};
            this.openCheatMenu();
            console.log('[ACE] Cheats module loaded');
        },
        
        destroy() {
            const box = document.getElementById('cheatMenuBox');
            if (box) box.remove();
        },
        
        isInGame() {
            return !!(window.module?.exports?.settings);
        },
        
        openCheatMenu() {
            if (document.getElementById('cheatMenuBox')) return;
            
            const box = document.createElement('div');
            box.id = 'cheatMenuBox';
            box.style.cssText = 'background:#111;border-radius:16px;box-shadow:0 4px 30px rgba(0,0,0,0.5);border:1px solid #2a2a2a;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);min-width:350px;max-width:500px;max-height:80vh;z-index:100000000;padding:16px;display:flex;flex-direction:column;';
            
            const title = document.createElement('div');
            title.style.cssText = 'font-size:1.1rem;font-weight:700;color:#e05555;margin-bottom:14px;text-transform:uppercase;letter-spacing:0.05em;';
            title.textContent = '⚠ Cheat Menu';
            
            const warning = document.createElement('div');
            warning.style.cssText = 'font-size:0.75rem;color:#888;margin-bottom:14px;padding:8px;background:#1a1a1a;border-radius:6px;';
            warning.textContent = 'Use at your own risk. May result in account penalties.';
            
            const closeBtn = document.createElement('span');
            closeBtn.style.cssText = 'position:absolute;top:12px;right:14px;cursor:pointer;font-size:1.4rem;color:#555;transition:color .15s;';
            closeBtn.textContent = '×';
            closeBtn.onmouseenter = () => closeBtn.style.color = '#fff';
            closeBtn.onmouseleave = () => closeBtn.style.color = '#555';
            closeBtn.onclick = () => box.remove();
            
            const grid = document.createElement('div');
            grid.style.cssText = 'display:flex;flex-direction:column;gap:10px;';
            
            const cheats = [
                { 
                    label: 'God Mode', 
                    desc: 'Invincibility toggle',
                    action: () => this.toggleGodMode()
                },
                { 
                    label: 'Speed Hack', 
                    desc: 'Move faster',
                    action: () => this.toggleSpeedHack()
                },
                { 
                    label: 'Infinite Energy', 
                    desc: 'Never run out of energy',
                    action: () => this.toggleInfiniteEnergy()
                },
                { 
                    label: 'No Cooldown', 
                    desc: 'Weapons reload instantly',
                    action: () => this.toggleNoCooldown()
                },
                { 
                    label: 'Teleport', 
                    desc: 'Click to teleport (debug)',
                    action: () => this.toggleTeleport()
                },
                { 
                    label: 'Show ESP', 
                    desc: 'See players through walls',
                    action: () => this.toggleESP()
                },
                { 
                    label: 'Aimbot', 
                    desc: 'Auto-aim at enemies',
                    action: () => this.toggleAimbot()
                },
            ];
            
            cheats.forEach(cheat => {
                const row = document.createElement('div');
                row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;';
                
                const textWrap = document.createElement('div');
                
                const label = document.createElement('div');
                label.style.cssText = 'font-size:0.9rem;font-weight:600;color:#fff;';
                label.textContent = cheat.label;
                
                const desc = document.createElement('div');
                desc.style.cssText = 'font-size:0.7rem;color:#666;margin-top:2px;';
                desc.textContent = cheat.desc;
                
                textWrap.appendChild(label);
                textWrap.appendChild(desc);
                
                const toggle = document.createElement('div');
                toggle.style.cssText = 'width:40px;height:22px;background:#222;border-radius:11px;cursor:pointer;position:relative;transition:background .15s;';
                toggle.dataset.active = 'false';
                
                const knob = document.createElement('div');
                knob.style.cssText = 'position:absolute;top:2px;left:2px;width:18px;height:18px;background:#555;border-radius:50%;transition:transform .15s,background .15s;';
                
                toggle.appendChild(knob);
                
                toggle.onclick = () => {
                    const isActive = toggle.dataset.active === 'true';
                    toggle.dataset.active = !isActive;
                    toggle.style.background = !isActive ? 'rgba(126,200,200,0.3)' : '#222';
                    knob.style.transform = !isActive ? 'translateX(18px)' : 'translateX(0)';
                    knob.style.background = !isActive ? '#7ec8c8' : '#555';
                    AceSFX?.click();
                    cheat.action();
                };
                
                row.appendChild(textWrap);
                row.appendChild(toggle);
                grid.appendChild(row);
            });
            
            box.appendChild(title);
            box.appendChild(warning);
            box.appendChild(closeBtn);
            box.appendChild(grid);
            document.body.appendChild(box);
        },
        
        toggleGodMode() {
            this.runtime.godMode = !this.runtime.godMode;
            console.log('[ACE] God Mode:', this.runtime.godMode ? 'ON' : 'OFF');
            
            if (this.runtime.godMode) {
                this.patchHealth(true);
            }
        },
        
        patchHealth(enable) {
            try {
                const state = Object.values(Object.values(window.module.exports.settings).find(x => x.mode));
                const status = state.find(x => x.status)?.status;
                if (!status) return;
                
                if (enable) {
                    this._originalMaxHealth = status.max_health;
                    status.max_health = 999999;
                } else if (this._originalMaxHealth) {
                    status.max_health = this._originalMaxHealth;
                }
            } catch (e) {
                console.error('[ACE] Health patch error:', e);
            }
        },
        
        toggleSpeedHack() {
            this.runtime.speedHack = !this.runtime.speedHack;
            console.log('[ACE] Speed Hack:', this.runtime.speedHack ? 'ON' : 'OFF');
        },
        
        toggleInfiniteEnergy() {
            this.runtime.infiniteEnergy = !this.runtime.infiniteEnergy;
            console.log('[ACE] Infinite Energy:', this.runtime.infiniteEnergy ? 'ON' : 'OFF');
        },
        
        toggleNoCooldown() {
            this.runtime.noCooldown = !this.runtime.noCooldown;
            console.log('[ACE] No Cooldown:', this.runtime.noCooldown ? 'ON' : 'OFF');
        },
        
        toggleTeleport() {
            this.runtime.teleport = !this.runtime.teleport;
            console.log('[ACE] Teleport:', this.runtime.teleport ? 'ON' : 'OFF');
            
            if (this.runtime.teleport) {
                this.enableTeleport();
            } else {
                this.disableTeleport();
            }
        },
        
        enableTeleport() {
            document.addEventListener('click', this._teleportHandler = (e) => {
                if (!this.runtime.teleport || !this.isInGame()) return;
                if (e.target.closest('.modal') || e.target.closest('#overlay')) return;
                
                console.log('[ACE] Teleport click at:', e.clientX, e.clientY);
            }, true);
        },
        
        disableTeleport() {
            if (this._teleportHandler) {
                document.removeEventListener('click', this._teleportHandler);
                this._teleportHandler = null;
            }
        },
        
        toggleESP() {
            this.runtime.esp = !this.runtime.esp;
            console.log('[ACE] ESP:', this.runtime.esp ? 'ON' : 'OFF');
        },
        
        toggleAimbot() {
            this.runtime.aimbot = !this.runtime.aimbot;
            console.log('[ACE] Aimbot:', this.runtime.aimbot ? 'ON' : 'OFF');
            
            if (this.runtime.aimbot) {
                this.enableAimbot();
            } else {
                this.disableAimbot();
            }
        },
        
        enableAimbot() {
            const self = this;
            this._aimbotInterval = setInterval(() => {
                if (!self.runtime.aimbot || !self.isInGame()) return;
                // Aimbot logic would go here - targeting nearest enemy
            }, 100);
        },
        
        disableAimbot() {
            if (this._aimbotInterval) {
                clearInterval(this._aimbotInterval);
                this._aimbotInterval = null;
            }
        }
    };
    
    window.AceCheats = module;
    return module;
})(window.AceCore, window.AceSFX, window.AceCONFIG, window.AceSTATE);