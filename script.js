/**
 * BACKEND SECTION: Express Server Logic
 */
const express = require('express');
const path = require('path');

if (typeof window === 'undefined') {
    const app = express();
    const PORT = 2807;

    app.use(express.static(__dirname));
    app.use('/assets', express.static(path.join(__dirname, 'assets')));

    app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
    app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
    app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
    app.get('/records', (req, res) => res.sendFile(path.join(__dirname, 'records.html')));
    app.get('/insights', (req, res) => res.sendFile(path.join(__dirname, 'insights.html')));
    app.get('/report', (req, res) => res.sendFile(path.join(__dirname, 'report.html')));

    app.listen(PORT, () => {
        console.log(`
======================================================
🛡️  CHESTAI FRAMEWORK - SERVER STARTED
🚀  URL: http://localhost:${PORT}
======================================================
        `);
    });
}


/**
 * FRONTEND SECTION
 */

// Switch dashboard sections
function showSection(sectionId) {
    const sections = ['analysis-section', 'history-section', 'settings-section'];

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const navs = ['nav-analysis', 'nav-history', 'nav-settings'];

    navs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });

    const activeSection = document.getElementById(sectionId + '-section');
    const activeNav = document.getElementById('nav-' + sectionId);

    if (activeSection) activeSection.style.display = 'block';
    if (activeNav) activeNav.classList.add('active');
}


// 🔥 REAL AI ANALYSIS FUNCTION
function runAnalysis() {
    const input = document.getElementById('imageInput');
    const loader = document.getElementById('loader');
    const results = document.getElementById('results');

    if (!input.files[0]) {
        alert("Please upload an X-ray image.");
        return;
    }

    if (results) results.style.display = 'none';
    if (loader) loader.style.display = 'block';

    const formData = new FormData();
    formData.append("image", input.files[0]);

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (loader) loader.style.display = 'none';
        if (results) results.style.display = 'grid';

        const disease = data.prediction;
        const confidence = data.confidence;

        let status = disease === "Tuberculosis" ? "Urgent" : "Stable";
        let advice = disease === "Tuberculosis"
            ? "Immediate molecular testing required."
            : "No thoracic abnormalities detected.";

        document.getElementById('res-disease').innerText = disease;
        document.getElementById('res-recall').innerText = confidence;
        document.getElementById('res-advice').innerHTML = advice;

        localStorage.setItem('lastPrediction', disease);
        localStorage.setItem('lastConfidence', confidence);

        const tableBody = document.getElementById('history-table-body');
        if (tableBody) {
            const newRow = tableBody.insertRow(0);
            const date = new Date().toISOString().split('T')[0];
            const patientID = "#PX-" + Math.floor(1000 + Math.random() * 9000);

            newRow.innerHTML = `
                <td>${date}</td>
                <td>${patientID}</td>
                <td>${disease}</td>
                <td>${confidence}</td>
                <td><span style="color:${status==="Urgent"?"red":"green"}">${status}</span></td>
            `;
        }
    })
    .catch(err => {
        alert("AI Server not running. Please start Flask backend.");
        console.error(err);
        if (loader) loader.style.display = 'none';
    });
}


/**
 * 🔥 GLOBAL FAVICON MANAGER
 */
if (typeof window !== 'undefined') {
    (function () {

        const lightFavicon = "/assets/light_mode_health_lens_favicon.png";
        const darkFavicon = "/assets/Favicon_HealthLens.png";

        function setFavicon(theme) {
            let favicon = document.querySelector("link[rel*='icon']");

            if (!favicon) {
                favicon = document.createElement('link');
                favicon.rel = 'icon';
                document.head.appendChild(favicon);
            }

            favicon.href = theme === 'dark' ? darkFavicon : lightFavicon;
        }

        function getTheme() {
            return (
                localStorage.getItem('homeTheme') ||
                localStorage.getItem('dashTheme') ||
                localStorage.getItem('theme') ||
                'light'
            );
        }

        // Run immediately
        setFavicon(getTheme());

        // Run after DOM load
        document.addEventListener("DOMContentLoaded", () => {
            setFavicon(getTheme());
        });

        // Listen for changes across tabs
        window.addEventListener("storage", () => {
            setFavicon(getTheme());
        });

        // Make globally callable
        window.updateFavicon = setFavicon;

    })();
}

/**
 * 🔥 THEME TOGGLE (UPDATED)
 */
function toggleTheme() {
    const body = document.getElementById('app-root');
    const btn = document.getElementById('themeBtn');
    const currentTheme = body.getAttribute('data-theme');

    let newTheme;

    if (currentTheme === 'light') {
        newTheme = 'dark';
        body.setAttribute('data-theme', 'dark');
        if (btn) btn.innerText = '☀️';
        localStorage.setItem('homeTheme', 'dark');
    } else {
        newTheme = 'light';
        body.setAttribute('data-theme', 'light');
        if (btn) btn.innerText = '🌙';
        localStorage.setItem('homeTheme', 'light');
    }

    if (window.updateFavicon) {
        window.updateFavicon(newTheme);
    }
}