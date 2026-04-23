// Ace Client Core Module
// Handles module loading, localStorage, and first-run wizard

(function() {
    'use strict';

    const MODULE_BASE_URL = 'https://raw.githubusercontent.com/shattxr/Ace-Client/main/modules/';
    const MODULES_KEY = 'ace_modules';
    const MODULE_DEFAULTS = {
        serverlist: true,
        playersearch: true,
        theme: true,
        buttonboard: true,
        mods: true,
        cheats: true,
    };

    window.AceCore = {
        modules: {},
        loadedModules: new Set(),

        // Get current module settings
        getSettings() {
            try {
                return JSON.parse(localStorage.getItem(MODULES_KEY)) || { ...MODULE_DEFAULTS };
            } catch {
                return { ...MODULE_DEFAULTS };
            }
        },

        // Save module settings
        saveSettings(settings) {
            localStorage.setItem(MODULES_KEY, JSON.stringify(settings));
        },

        // Check if first run
        isFirstRun() {
            return localStorage.getItem(MODULES_KEY) === null;
        },

        // Fetch and load a module
        async loadModule(name) {
            const settings = this.getSettings();
            if (!settings[name]) {
                console.log(`[ACE] Module ${name} disabled, skipping`);
                return null;
            }

            try {
                const response = await fetch(MODULE_BASE_URL + name + '.js');
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const code = await response.text();
                
                // Execute module code
                const moduleFn = new Function('AceCore', 'AceSFX', 'CONFIG', 'STATE', 'AceMods', code);
                const moduleExports = moduleFn(window.AceCore, window.AceSFX, window.AceCONFIG, window.AceSTATE, window.AceMods);
                
                this.modules[name] = moduleExports;
                this.loadedModules.add(name);
                
                // Call init if exists
                if (moduleExports && moduleExports.init) {
                    moduleExports.init();
                }
                
                console.log(`[ACE] Loaded module: ${name}`);
                return moduleExports;
            } catch (err) {
                console.error(`[ACE] Failed to load module ${name}:`, err);
                return null;
            }
        },

        // Load all enabled modules
        async loadAllModules() {
            const settings = this.getSettings();
            const loadPromises = Object.keys(settings)
                .filter(key => settings[key])
                .map(key => this.loadModule(key));
            
            await Promise.all(loadPromises);
            console.log(`[ACE] All modules loaded:`, [...this.loadedModules]);
        },

        // Toggle a module on/off
        toggleModule(name) {
            const settings = this.getSettings();
            if (settings[name] === undefined) return;
            
            settings[name] = !settings[name];
            this.saveSettings(settings);
            
            if (settings[name]) {
                this.loadModule(name);
            } else if (this.modules[name] && this.modules[name].destroy) {
                this.modules[name].destroy();
                delete this.modules[name];
                this.loadedModules.delete(name);
            }
            
            return settings[name];
        },

        // Show first-run wizard
        showWizard() {
            if (document.getElementById('ace-wizard-modal')) return;
            
            const overlay = document.createElement('div');
            overlay.id = 'ace-wizard-modal';
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:999999;display:flex;align-items:center;justify-content:center;';
            
            const box = document.createElement('div');
            box.style.cssText = 'background:#0b0b0b;border:1px solid #1a1a1a;border-radius:16px;width:min(480px,90vw);padding:28px 32px;box-shadow:0 8px 40px rgba(0,0,0,0.8);font-family:"DM Sans",sans-serif;color:#fff;';
            
            const title = document.createElement('h2');
            title.style.cssText = 'font-size:1.4rem;font-weight:700;margin:0 0 8px;color:#7ec8c8;letter-spacing:0.05em;';
            title.textContent = 'Welcome to Ace Client';
            
            const subtitle = document.createElement('p');
            subtitle.style.cssText = 'font-size:0.9rem;color:#888;margin:0 0 24px;line-height:1.5;';
            subtitle.textContent = 'Choose which features you want to enable. You can change these anytime from the Control Panel.';
            
            const togglesContainer = document.createElement('div');
            togglesContainer.style.cssText = 'display:flex;flex-direction:column;gap:12px;margin-bottom:24px;';
            
            const moduleLabels = {
                serverlist: { name: 'Server List', desc: 'Browse and filter game servers' },
                playersearch: { name: 'Player Search', desc: 'Find players across all servers' },
                theme: { name: 'Dark Theme', desc: 'Ace Client visual theme' },
                buttonboard: { name: 'Button Board', desc: 'Utilities and tools' },
                mods: { name: 'Ace Mods', desc: 'Play custom game modes' },
                cheats: { name: 'Cheat Menu', desc: 'Extra gameplay features' },
            };
            
            const settings = { ...MODULE_DEFAULTS };
            
            for (const [key, label] of Object.entries(moduleLabels)) {
                const row = document.createElement('label');
                row.style.cssText = 'display:flex;align-items:center;gap:12px;cursor:pointer;padding:10px 12px;background:#111;border:1px solid #1a1a1a;border-radius:10px;transition:background .15s,border-color .15s;';
                row.onmouseenter = () => { row.style.background = '#161616'; row.style.borderColor = '#2a2a2a'; };
                row.onmouseleave = () => { row.style.background = '#111'; row.style.borderColor = '#1a1a1a'; };
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = settings[key];
                checkbox.style.cssText = 'width:18px;height:18px;accent-color:#7ec8c8;cursor:pointer;';
                checkbox.onchange = (e) => { settings[key] = e.target.checked; };
                
                const textWrap = document.createElement('div');
                textWrap.style.cssText = 'flex:1;';
                
                const nameSpan = document.createElement('div');
                nameSpan.style.cssText = 'font-size:0.95rem;font-weight:600;color:#fff;';
                nameSpan.textContent = label.name;
                
                const descSpan = document.createElement('div');
                descSpan.style.cssText = 'font-size:0.75rem;color:#666;margin-top:2px;';
                descSpan.textContent = label.desc;
                
                textWrap.appendChild(nameSpan);
                textWrap.appendChild(descSpan);
                row.appendChild(checkbox);
                row.appendChild(textWrap);
                togglesContainer.appendChild(row);
            }
            
            const saveBtn = document.createElement('button');
            saveBtn.style.cssText = 'width:100%;background:#1a3a3a;border:1px solid #2a5a5a;border-radius:10px;color:#7ec8c8;font-size:1rem;font-weight:700;padding:14px;cursor:pointer;transition:background .15s;';
            saveBtn.textContent = 'Save & Continue';
            saveBtn.onmouseenter = () => saveBtn.style.background = '#1f4a4a';
            saveBtn.onmouseleave = () => saveBtn.style.background = '#1a3a3a';
            saveBtn.onclick = () => {
                this.saveSettings(settings);
                overlay.remove();
                this.loadAllModules();
            };
            
            box.appendChild(title);
            box.appendChild(subtitle);
            box.appendChild(togglesContainer);
            box.appendChild(saveBtn);
            overlay.appendChild(box);
            document.body.appendChild(overlay);
            
            // Expose settings globally for the checkbox updates
            window._aceWizardSettings = settings;
        },

        // Initialize
        init() {
            console.log('[ACE] Core initialized');
            
            // Expose globally
            window.AceCore = this;
            
            if (this.isFirstRun()) {
                // Show wizard after a short delay to let the page load
                setTimeout(() => this.showWizard(), 500);
            } else {
                // Load saved modules
                this.loadAllModules();
            }
        }
    };

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.AceCore?.init());
    } else {
        window.AceCore?.init();
    }
})();