// global.js - Master Controller for Theme, Favicon, Auth State, Translation, and PWA Install

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Theme from LocalStorage
    const savedTheme = localStorage.getItem('healthlens_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    updateFavicon(savedTheme);

    // 2. Initialize Lucide Icons globally
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. Check Auth state for navigations
    updateNavigationAuth();

    // 4. Initialize Global Translation Engine
    injectGoogleTranslate();

    // 5. Sync Language Dropdown if on Settings page
    const langSelector = document.getElementById('languageSelector');
    if (langSelector) {
        const savedLang = localStorage.getItem('healthlens_lang') || 'en';
        langSelector.value = savedLang;
    }
});

// --- THEME & UI CONTROLLERS ---

window.toggleGlobalTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('healthlens_theme', newTheme);
    localStorage.setItem('dashTheme', newTheme); 
    
    updateThemeIcon(newTheme);
    updateFavicon(newTheme);
    
    // Dynamically update the PWA Banner if it's currently on the screen
    const banner = document.getElementById('pwa-top-banner');
    if (banner) {
        const textImg = document.getElementById('pwa-text-logo');
        const mainIcon = document.getElementById('pwa-main-icon');
        if (newTheme === 'dark') {
            banner.style.background = '#1e293b';
            banner.style.borderColor = '#475569';
            banner.style.boxShadow = '0 20px 40px rgba(0,0,0,0.8), 0 0 15px rgba(59, 130, 246, 0.2)';
            if(textImg) textImg.src = 'assets/logo_health_lens_transparent_for_dark_mode_only_name.png';
            if(mainIcon) mainIcon.src = 'assets/Favicon_HealthLens.png';
        } else {
            banner.style.background = '#ffffff';
            banner.style.borderColor = '#e2e8f0';
            banner.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)';
            if(textImg) textImg.src = 'assets/logo_health_lens_transparent_only_text.png';
            if(mainIcon) mainIcon.src = 'assets/light_mode_health_lens_favicon.png';
        }
    }
};

function updateThemeIcon(theme) {
    const themeBtns = document.querySelectorAll('.global-theme-toggle');
    themeBtns.forEach(btn => {
        if (typeof lucide !== 'undefined') {
            btn.innerHTML = theme === 'dark' 
                ? '<i data-lucide="sun"></i>' 
                : '<i data-lucide="moon"></i>';
        } else {
            btn.innerHTML = theme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function updateFavicon(theme) {
    const iconPath = theme === 'dark' ? "assets/Favicon_HealthLens.png" : "assets/light_mode_health_lens_favicon.png";
    let favicon = document.querySelector("link[rel*='icon']");
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }
    favicon.href = iconPath;
}

window.addEventListener("storage", (e) => {
    if (e.key === 'healthlens_theme') {
        document.documentElement.setAttribute('data-theme', e.newValue);
        updateThemeIcon(e.newValue);
        updateFavicon(e.newValue);
    }
});

// --- AUTHENTICATION SYNC ---

function updateNavigationAuth() {
    const isLoggedIn = localStorage.getItem('healthlens_logged_in') === 'true';
    
    const loginBtn = document.getElementById('login-btn');
    const profileBtn = document.getElementById('profile-btn');
    const heroBtn = document.getElementById('hero-action-btn');
    const profileImg = document.getElementById('nav-profile-img');

    if (isLoggedIn) {
        if(loginBtn) loginBtn.style.display = 'none';
        if(profileBtn) profileBtn.style.display = 'block';
        
        if(heroBtn) {
            heroBtn.href = "dashboard.html";
            heroBtn.innerHTML = 'Go to Dashboard <i data-lucide="arrow-right"></i>';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        const savedAvatar = localStorage.getItem('healthlens_user_avatar');
        if(savedAvatar && profileImg) {
            profileImg.src = savedAvatar;
        }
    } else {
        if(loginBtn) loginBtn.style.display = 'inline-flex';
        if(profileBtn) profileBtn.style.display = 'none';
    }
}

// --- BULLETPROOF GLOBAL TRANSLATION ENGINE ---

function injectGoogleTranslate() {
    if (!document.getElementById('google_translate_element')) {
        const gtDiv = document.createElement('div');
        gtDiv.id = 'google_translate_element';
        gtDiv.style.display = 'none';
        document.body.appendChild(gtDiv);
    }

    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'en', 
            autoDisplay: false
        }, 'google_translate_element');
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
    
    const style = document.createElement('style');
    style.innerHTML = `
        .skiptranslate { display: none !important; }
        body { top: 0px !important; }
        #goog-gt-tt { display: none !important; }
        .goog-te-spinner-pos { display: none !important; }
    `;
    document.head.appendChild(style);
}

window.changeLanguage = function(langCode) {
    if (langCode === 'en') {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + window.location.hostname + "; path=/;";
    } else {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/;`;
    }
    
    localStorage.setItem('healthlens_lang', langCode);
    
    if(typeof showToast === 'function') showToast('Applying translation...', 'success');
    
    setTimeout(() => {
        window.location.reload();
    }, 400);
}

// =========================================================================
// 🚀 PREMIUM PWA INSTALLATION ENGINE (Hypersensitive Button & Correct Logos)
// =========================================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Failed: ', err));
    });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const lastDismissed = localStorage.getItem('healthlens_pwa_dismissed');
    const isInstalled = localStorage.getItem('healthlens_pwa_installed');
    const today = new Date().toDateString();
    
    if (lastDismissed !== today && isInstalled !== 'true') {
        showCustomInstallBanner();
    }
});

// 🟢 FOR DEV-TUNNELS TESTING: Force show banner after 1.5 seconds if on mobile
setTimeout(() => {
    if(window.innerWidth <= 968 && !document.getElementById('pwa-top-banner')) {
        const lastDismissed = localStorage.getItem('healthlens_pwa_dismissed');
        const isInstalled = localStorage.getItem('healthlens_pwa_installed');
        if (lastDismissed !== new Date().toDateString() && isInstalled !== 'true') {
            showCustomInstallBanner();
        }
    }
}, 1500);

function showCustomInstallBanner() {
    if (window.innerWidth > 968) return;
    if (document.getElementById('pwa-top-banner')) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Dynamic styling
    const bannerBg = isDark ? '#1e293b' : '#ffffff';
    const bannerBorder = isDark ? '#475569' : '#e2e8f0';
    const bannerShadow = isDark ? '0 20px 40px rgba(0,0,0,0.8), 0 0 15px rgba(59, 130, 246, 0.2)' : '0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)';
    
    // Exact requested images
    const iconSrc = isDark ? 'assets/Favicon_HealthLens.png' : 'assets/light_mode_health_lens_favicon.png';
    const textLogoSrc = isDark ? 'assets/logo_health_lens_transparent_for_dark_mode_only_name.png' : 'assets/logo_health_lens_transparent_only_text.png';

    if (!document.getElementById('pwa-banner-style')) {
        const style = document.createElement('style');
        style.id = 'pwa-banner-style';
        style.innerHTML = `
            .pwa-top-banner {
                position: fixed; top: 20px; left: 5%; width: 90%;
                border-radius: 20px;
                display: flex; align-items: center; padding: 14px 18px;
                z-index: 2147483647; transform: translateY(-150%);
                transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s, border-color 0.3s, box-shadow 0.3s;
                touch-action: manipulation; /* Removes 300ms tap delay */
            }
            .pwa-top-banner.show { transform: translateY(0); }
            
            .pwa-icon-wrapper { flex-shrink: 0; width: 48px; height: 48px; margin-right: 15px; display: flex; justify-content: center; align-items: center; }
            .pwa-icon-wrapper img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15)); }
            
            .pwa-content { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
            .pwa-text-img { height: 18px; width: auto; object-fit: contain; margin-bottom: 4px; align-self: flex-start; }
            .pwa-subtitle { font-size: 11px; color: var(--text-muted, #64748b); margin: 0; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500;}
            
            .pwa-actions { display: flex; flex-direction: column; align-items: flex-end; margin-left: 10px; gap: 8px; }
            .pwa-install-btn { background: var(--primary-color, #2a7fba); color: #ffffff; border: none; padding: 8px 18px; border-radius: 20px; font-weight: 800; font-size: 12px; cursor: pointer; box-shadow: 0 4px 10px rgba(42, 127, 186, 0.3); transition: transform 0.1s; touch-action: manipulation; }
            .pwa-install-btn:active { transform: scale(0.92); }
            .pwa-close-btn { background: none; border: none; color: var(--text-muted, #64748b); font-size: 24px; cursor: pointer; line-height: 1; padding: 0 5px; position: absolute; top: 8px; right: 8px; touch-action: manipulation; }
        `;
        document.head.appendChild(style);
    }

    const banner = document.createElement('div');
    banner.id = 'pwa-top-banner';
    banner.className = 'pwa-top-banner';
    banner.style.background = bannerBg;
    banner.style.borderColor = bannerBorder;
    banner.style.boxShadow = bannerShadow;

    banner.innerHTML = `
        <button class="pwa-close-btn" id="pwaCloseBtn">&times;</button>
        <div class="pwa-icon-wrapper">
            <img src="${iconSrc}" id="pwa-main-icon" alt="HealthLens App">
        </div>
        <div class="pwa-content">
            <img src="${textLogoSrc}" id="pwa-text-logo" alt="HealthLens" class="pwa-text-img">
            <p class="pwa-subtitle">Get the native app for faster access.</p>
        </div>
        <div class="pwa-actions">
            <button class="pwa-install-btn" id="pwaInstallBtn">GET</button>
        </div>
    `;
    
    document.body.appendChild(banner);

    setTimeout(() => { banner.classList.add('show'); }, 100);

    // 🟢 HYPERSENSITIVE INSTALL BUTTON LOGIC
    const handleInstall = async (e) => {
        e.preventDefault(); // Prevents duplicate events if touch and click both fire
        
        // We must call prompt() BEFORE removing the banner to satisfy Chrome's security rules
        if (deferredPrompt) {
            deferredPrompt.prompt(); 
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                localStorage.setItem('healthlens_pwa_installed', 'true');
            }
            deferredPrompt = null;
        } else {
             if(typeof showToast === 'function') {
                 showToast("To install, tap your browser menu (3 dots) and select 'Add to Home screen'.", "success");
             } else {
                 alert("To install, tap your browser menu (3 dots) and select 'Add to Home screen'.");
             }
        }
        
        // Hide the banner after interaction
        banner.classList.remove('show'); 
        setTimeout(() => banner.remove(), 600);
    };

    const installBtn = document.getElementById('pwaInstallBtn');
    installBtn.addEventListener('click', handleInstall);
    installBtn.addEventListener('touchend', handleInstall); // Instant trigger on mobile release

    // 🟢 1-MINUTE REMINDER LOOP
    const handleClose = (e) => {
        e.preventDefault();
        banner.classList.remove('show'); 
        localStorage.setItem('healthlens_pwa_dismissed', new Date().toDateString());
        setTimeout(() => banner.remove(), 600);
        
        setTimeout(() => {
            if (localStorage.getItem('healthlens_pwa_installed') !== 'true') {
                localStorage.removeItem('healthlens_pwa_dismissed'); 
                showCustomInstallBanner();
            }
        }, 60000); 
    };

    const closeBtn = document.getElementById('pwaCloseBtn');
    closeBtn.addEventListener('click', handleClose);
    closeBtn.addEventListener('touchend', handleClose);
}

// Global listener for successful installation
window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    localStorage.setItem('healthlens_pwa_installed', 'true');
    if(typeof showToast === 'function') showToast('HealthLens App Installed Successfully!', 'success');
});

// =========================================================================
// 🚀 ARYAN AI CONTEXT INJECTION & ROUTING
// =========================================================================

window.openAryanChat = function() {
    // Context injection: saving the current context before redirecting
    const context = getAryanContext();
    sessionStorage.setItem('aryan_active_context', JSON.stringify(context));
    window.location.href = 'aryan_chat.html';
};

window.getAryanContext = function() {
    const activeUser = localStorage.getItem("activeClinician");
    const storageKey = activeUser ? `profileData_${activeUser}` : "profileData_guest";
    const userData = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    return {
        name: userData.name || activeUser || "Guest",
        role: localStorage.getItem("healthlens_role") || "User",
        patientId: userData.patientId || "Unknown",
        vitals: `${userData.blood || '--'} | ${userData.weight || '--'} | ${userData.pulse || '--'}`,
        currentTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    };
};