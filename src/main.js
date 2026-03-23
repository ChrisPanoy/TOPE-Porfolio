import './style.css'

/**
 * CHRISYSTEMATIXX_OS CORE LOGIC
 * Production-Ready Static Architecture
 */

// 1. DATA PERSISTENCE LAYER (LocalStorage)
const Storage = {
    init() {
        if (!localStorage.getItem('sys_data')) {
            localStorage.setItem('sys_data', JSON.stringify({
                visits: 0,
                messages: [],
                isAdmin: false,
                lastBoot: new Date().toISOString()
            }));
        }
        this.trackVisit();
        this.updateHUD();
    },
    getData() {
        return JSON.parse(localStorage.getItem('sys_data'));
    },
    saveData(data) {
        localStorage.setItem('sys_data', JSON.stringify(data));
        this.updateHUD();
    },
    trackVisit() {
        const data = this.getData();
        data.visits += 1;
        data.lastBoot = new Date().toISOString();
        this.saveData(data);
    },
    addMessage(msg) {
        const data = this.getData();
        data.messages.push({ ...msg, id: Date.now(), timestamp: new Date().toISOString() });
        this.saveData(data);
    },
    updateHUD() {
        const data = this.getData();
        const visitEl = document.getElementById('visit-counter');
        const statVisits = document.getElementById('stat-visits');
        const statMsgs = document.getElementById('stat-messages');

        if (visitEl) visitEl.textContent = String(data.visits).padStart(4, '0');
        if (statVisits) statVisits.textContent = data.visits;
        if (statMsgs) statMsgs.textContent = data.messages.length;
    }
};

// 2. BOOT SEQUENCE
const runBootLoader = async () => {
    const progress = document.getElementById('boot-progress');
    const status = document.getElementById('boot-status');
    const loader = document.getElementById('boot-loader');
    const desktop = document.getElementById('desktop');

    const steps = [
        { progress: 20, text: 'LOADING_KERNEL_V4.2' },
        { progress: 45, text: 'MOUNTING_LOCAL_STORAGE' },
        { progress: 70, text: 'ESTABLISHING_SECURE_LINK' },
        { progress: 90, text: 'LOAD_UI_MODULES' },
        { progress: 100, text: 'SYSTEM_STABLE' }
    ];

    for (const step of steps) {
        await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
        progress.style.width = `${step.progress}%`;
        status.textContent = step.text;
    }

    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    desktop.classList.remove('opacity-0');
    desktop.classList.add('opacity-100');

    // Reveal animation for current section
    switchSection('home');
};

// 3. WINDOW / SECTION SWITCHING
const switchSection = (sectionId) => {
    const sections = document.querySelectorAll('#workspace section');
    const navBtns = document.querySelectorAll('.nav-btn');

    sections.forEach(sec => {
        if (sec.dataset.id === sectionId) {
            sec.classList.add('active');
            sec.style.zIndex = '10';
        } else {
            sec.classList.remove('active');
            setTimeout(() => {
                if (!sec.classList.contains('active')) {
                    sec.style.zIndex = '0';
                }
            }, 600);
        }
    });

    navBtns.forEach(btn => {
        const icon = btn.querySelector('ion-icon');
        if (btn.dataset.section === sectionId) {
            icon.classList.add('text-sys-cyan');
            icon.classList.remove('text-slate-600');
        } else {
            icon.classList.remove('text-sys-cyan');
            icon.classList.add('text-slate-600');
        }
    });
};

// 4. ADMIN TERMINAL MODULE
const adminTerminal = {
    isOpen: false,
    el: null,
    output: null,
    input: null,

    init() {
        this.el = document.getElementById('admin-terminal');
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');

        if (this.input) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleInput(this.input.value);
                    this.input.value = '';
                }
            });
        }
    },

    open() {
        this.isOpen = true;
        this.el.classList.remove('opacity-0', 'pointer-events-none');
        this.input.focus();
        this.log('System is requesting authentication...', 'slate-500');
    },

    close() {
        this.isOpen = false;
        this.el.classList.add('opacity-0', 'pointer-events-none');
    },

    log(text, color = 'sys-cyan') {
        const div = document.createElement('div');
        div.className = `text-${color}`;
        div.textContent = text;
        this.output.appendChild(div);
        this.output.scrollTop = this.output.scrollHeight;
    },

    handleInput(val) {
        this.log(`> ${val}`, 'white');
        const cmd = val.toLowerCase().trim();

        if (cmd === 'admin@2024' || cmd === 'bypass' || cmd === 'root') {
            this.log('AUTHENTICATION_SUCCESSFUL', 'green-400');
            this.log('GRANTING_ADMIN_PRIVILEGES...', 'green-400');
            setTimeout(() => {
                const status = document.getElementById('runtime-status');
                if (status) {
                    status.textContent = 'ADMIN_MODE_ACTIVE';
                    status.classList.add('text-sys-pink');
                }
                this.log('WELCOME_OPERATOR: CHRIS', 'sys-pink');
                setTimeout(() => this.close(), 1500);
            }, 1000);
        } else if (cmd === 'clear') {
            this.output.innerHTML = '';
        } else if (cmd === 'exit') {
            this.close();
        } else {
            this.log('ACCESS_DENIED: INVALID_CREDENTIALS', 'red-500');
        }
    }
};

// 5. EVENT LISTENERS
const initListeners = () => {
    // Nav Buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });

    // Internal Target Buttons
    document.querySelectorAll('[data-target]').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.target));
    });

    // Formspree Integration
const FORMSPREE_ID = "mkoqlkza";

// CONTACT FORM HANDLING
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('form-status');
        const btn = contactForm.querySelector('button');
        const originalBtnText = btn.innerHTML;

        // UI Feedback: Simulating Encryption/Uplink
        btn.disabled = true;
        btn.innerHTML = '<span class="relative z-10">ENCRYPTING_DATA...</span>';
        status.classList.remove('hidden');
        status.innerText = "MOUNTING_SECURE_UPLINK...";

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Persistent Stats
                Storage.addMessage({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message')
                });

                status.innerText = "UPLINK_SUCCESSFUL // SIGNAL_SENT";
                status.style.color = "#00f2ff";
                contactForm.reset();
            } else {
                throw new Error("UPLINK_FAILURE");
            }
        } catch (err) {
            status.innerText = "ERROR // UPLINK_FAILED";
            status.style.color = "#ff0066";
        } finally {
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalBtnText;
                status.classList.add('hidden');
            }, 3000);
        }
    });
}

    // Admin Trigger
    const adminTrigger = document.getElementById('admin-login-trigger');
    if (adminTrigger) {
        adminTrigger.addEventListener('click', () => adminTerminal.open());
    }
};

// 6. ASSET VIEWER MODULE
window.openCertificateViewer = (title, images) => {
    const viewer = document.getElementById('cert-viewer');
    const content = document.getElementById('cert-viewer-content');
    const titleEl = document.getElementById('cert-viewer-title');
    const countEl = document.getElementById('cert-viewer-count');

    titleEl.textContent = `ASSET_VAULT // ${title.toUpperCase()}.DAT`;
    countEl.textContent = `FILES_LOGGED: ${String(images.length).padStart(2, '0')}`;

    content.innerHTML = images.map((src, i) => `
        <div class="group relative border border-white/5 bg-black/40 p-4 transition-all opacity-0 translate-y-4" 
             style="transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: ${i * 100}ms">
            <div class="absolute top-2 left-2 mono text-[8px] text-slate-700">PTR_${i + 1}</div>
            <img src="${src}" class="max-w-full max-h-[50vh] object-contain grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110" />
            <div class="mt-4 mono text-[6px] text-slate-600 uppercase">Buffer_Asset_${i + 1}</div>
        </div>
    `).join('');

    viewer.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        content.querySelectorAll('div').forEach(item => {
            item.classList.remove('opacity-0', 'translate-y-4');
            item.classList.add('opacity-100', 'translate-y-0');
        });
    }, 50);
};

window.closeCertViewer = () => {
    document.getElementById('cert-viewer').classList.add('opacity-0', 'pointer-events-none');
};

window.closeAdminTerminal = () => adminTerminal.close();

// 7. INITIALIZE SYSTEM
document.addEventListener('DOMContentLoaded', () => {
    Storage.init();
    adminTerminal.init();
    runBootLoader();
    initListeners();

    // HUD Clock
    const clockEl = document.getElementById('digital-clock');
    if (clockEl) {
        setInterval(() => {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
            }).toUpperCase();
        }, 1000);
    }

    // Stagger Items Delay Allocation
    document.querySelectorAll('.window').forEach(win => {
        win.querySelectorAll('.stagger-item').forEach((item, i) => {
            item.style.transitionDelay = `${i * 80}ms`;
        });
    });
});
