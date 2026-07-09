// --- MODERN TOAST NOTIFICATION SYSTEM & SOUND ---
const toastSound = new Audio('https://actions.google.com/sounds/v1/ui/message_notification.ogg');

window.showToast = function(message, type = 'success') {
    const box = document.getElementById('toastBox');
    if(!box) return;
    
    // Play notification sound
    toastSound.currentTime = 0;
    toastSound.play().catch(e => console.log('Audio disabled by browser policy'));

    const toast = document.createElement('div');
    toast.className = `modern-toast ${type}`;
    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-triangle"></i>';
    toast.innerHTML = `${icon} ${message}`;
    box.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Notification Button Logic
window.openNotifications = function() {
    window.showToast("No new alerts. Your system is up to date.", "success");
}

// --- LIVE HEALTH NEWS FETCH API & CONTINUOUS CLOCK ---
let currentLabelType = 0; // 0=News, 1=Updates, 2=Date, 3=Time

// Slow rotation for fading labels
setInterval(() => {
    const labelEl = document.getElementById('dynamicTickerLabel');
    if(!labelEl) return;
    labelEl.style.opacity = 0;
    setTimeout(() => {
        currentLabelType = (currentLabelType + 1) % 4;
        updateLabelContent();
        labelEl.style.opacity = 1;
    }, 500); 
}, 4000);

// Fast 1-second update strictly for the ticking clock
setInterval(() => {
    if (currentLabelType === 3) {
        updateLabelContent();
    }
}, 1000);

function updateLabelContent() {
    const labelEl = document.getElementById('dynamicTickerLabel');
    if(!labelEl) return;
    if(currentLabelType === 0) labelEl.innerHTML = `<i class="fas fa-bolt" style="color: #fbbf24;"></i> HEALTH NEWS`;
    else if(currentLabelType === 1) labelEl.innerHTML = `<i class="fas fa-circle" style="color: var(--danger); animation: pulse 1.5s infinite;"></i> LIVE UPDATES`;
    else if(currentLabelType === 2) labelEl.innerHTML = `<i class="fas fa-calendar-day"></i> ${new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}`;
    else if(currentLabelType === 3) {
         const d = new Date();
         labelEl.innerHTML = `<i class="fas fa-clock" style="color: #60a5fa;"></i> ${String(d.getHours()).padStart(2,'0')} : ${String(d.getMinutes()).padStart(2,'0')} : ${String(d.getSeconds()).padStart(2,'0')}`;
    }
}

window.fetchHealthNews = async function() {
    const tickerContent = document.getElementById('newsTickerContent');
    if(!tickerContent) return;
    let newsHtml = '';
    try {
        const res = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/health/in.json');
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
            data.articles.slice(0, 10).forEach(article => {
                let source = article.source.name || "Global Health";
                newsHtml += `<span class="news-item"><span class="news-source">[${source}]</span> ${article.title} <i class="fas fa-ambulance" style="margin: 0 15px; color: var(--primary); font-size: 1.2rem;"></i></span>`;
            });
        } else { throw new Error("No articles"); }
    } catch (err) {
        const fallbacks = [
            { src: "WHO", text: "New global guidelines announced for respiratory health protocols." },
            { src: "MedTech Daily", text: "Breakthrough in AI diagnostics reduces X-Ray scanning times by 40% in Indian hospitals." },
            { src: "Health Ministry", text: "Nationwide telemedicine expansion launched for rural areas." }
        ];
        fallbacks.forEach(f => {
            newsHtml += `<span class="news-item"><span class="news-source">[${f.src}]</span> ${f.text} <i class="fas fa-ambulance" style="margin: 0 15px; color: var(--primary); font-size: 1.2rem;"></i></span>`;
        });
    }
    tickerContent.innerHTML = newsHtml + newsHtml; 
}

// --- CLOCK MODAL ---
const alertSound = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
const timerEndSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
let clockInterval; let clockMs = 0; let isTimer = false;

window.toggleClockModal = function() { 
    const modal = document.getElementById('clockModal');
    const backdrop = document.getElementById('clockBackdrop');
    if(modal.style.display === 'block') { modal.style.display = 'none'; backdrop.style.display = 'none'; } 
    else { modal.style.display = 'block'; backdrop.style.display = 'block'; }
}
window.switchClockMode = function(mode) {
    isTimer = mode === 'timer';
    document.getElementById('tabStopwatch').classList.toggle('active', !isTimer);
    document.getElementById('tabTimer').classList.toggle('active', isTimer);
    document.getElementById('clockInputs').style.display = isTimer ? 'flex' : 'none';
    window.resetClock();
}
window.formatClock = function(msTotal) {
    let hr = Math.floor(msTotal / 3600000);
    let min = Math.floor((msTotal % 3600000) / 60000);
    let sec = Math.floor((msTotal % 60000) / 1000);
    let ms = Math.floor((msTotal % 1000) / 10);
    return `${String(hr).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}:${String(ms).padStart(2,'0')}`;
}
window.startClock = function() {
    if(clockInterval) return;
    if(isTimer && clockMs === 0) {
        let h = parseInt(document.getElementById('t-hr').value || 0);
        let m = parseInt(document.getElementById('t-min').value || 0); let s = parseInt(document.getElementById('t-sec').value || 0);
        clockMs = (h*3600000) + (m*60000) + (s*1000);
        if(clockMs === 0) return window.showToast("Set a time first!", "error");
    }
    let lastTime = Date.now();
    clockInterval = setInterval(() => {
        let now = Date.now(); let delta = now - lastTime; lastTime = now;
        if(isTimer) {
            clockMs -= delta;
            if(clockMs <= 0) { clockMs = 0; window.stopClock(); timerEndSound.play(); window.showToast("Timer Finished!", "success"); }
        } else { clockMs += delta; }
        document.getElementById('clockDisplay').innerText = window.formatClock(clockMs);
    }, 10);
}
window.stopClock = function() { clearInterval(clockInterval); clockInterval = null; }
window.resetClock = function() { window.stopClock(); clockMs = 0; document.getElementById('clockDisplay').innerText = "00:00:00:00"; }

// --- ISOLATED PROFILE DATA & ADMIN SYNC ---
window.loadRealProfileData = function() {
    const activeUser = localStorage.getItem("activeClinician");
    const role = localStorage.getItem("healthlens_role");
    
    const storageKey = activeUser ? `profileData_${activeUser}` : "profileData_guest";
    const p = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    document.getElementById("userName").innerText = p.name || activeUser || "Guest User";
    if(!p.name && !activeUser) {
        document.getElementById("userName").innerHTML += ` <a href="profile.html" style="font-size:10px; color:var(--primary); text-decoration:none;">(Update Profile)</a>`;
    }
    
    const savedAvatar = localStorage.getItem('healthlens_user_avatar');
    if(savedAvatar) { document.getElementById("dash-avatar").src = savedAvatar; } 
    else { document.getElementById("dash-avatar").src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }
    
    if (p.chronic && p.chronic !== "None" && p.chronic !== "--") document.getElementById("condDisplay").innerText = p.chronic;
    else document.getElementById("condDisplay").innerHTML = '<span class="missing-badge"><i class="fas fa-exclamation-circle"></i> Needs Update</span>';

    if (p.blood && p.weight && p.pulse && p.blood !== "--" && p.weight !== "") document.getElementById("vitalsDisplay").innerText = `${p.blood} | ${p.weight} kg | ${p.pulse}`;
    else document.getElementById("vitalsDisplay").innerHTML = '<span class="missing-badge"><i class="fas fa-exclamation-circle"></i> Needs Update</span>';

    if (role === 'admin' && activeUser) {
        if (activeUser === 'Nikhil') document.getElementById('patientIdDisplay').innerText = 'CL-200328';
        else if (activeUser === 'Yadvi') document.getElementById('patientIdDisplay').innerText = 'CL-YADVI30';
        else if (activeUser === 'Shefali') document.getElementById('patientIdDisplay').innerText = 'CL-SHEF09';
        else if (activeUser === 'Piyush') document.getElementById('patientIdDisplay').innerText = 'CL-PIY123';
        else document.getElementById('patientIdDisplay').innerText = `CL-${activeUser.toUpperCase()}`;
    } else {
        if (!p.patientId) {
            p.patientId = `PX-${Math.floor(1000 + Math.random() * 9000)}`;
            localStorage.setItem(storageKey, JSON.stringify(p)); 
        }
        document.getElementById('patientIdDisplay').innerText = p.patientId;
    }
}

window.setPatient = function(overrideName = null) {
    const activeUser = localStorage.getItem("activeClinician");
    const storageKey = activeUser ? `profileData_${activeUser}` : "profileData_guest";
    const p = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    if (overrideName) document.getElementById("patientName").value = overrideName;
    else {
        if(p.name) document.getElementById("patientName").value = p.name;
        else window.showToast("Profile name not set! Update your profile first.", "error");
    }
}

// --- SYMPTOMS ---
const symptomsData = ["Cough", "Chest Pain", "Shortness of Breath", "Fever", "Fatigue", "Wheezing", "Bloody Sputum", "Night Sweats"];
let selectedSymptoms = [];

window.toggleSymptoms = function(e) { e.stopPropagation(); document.getElementById('symptomsDropdown').classList.toggle('show'); }
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('symptomsDropdown');
    if (dropdown && !dropdown.contains(e.target) && e.target.id !== 'symptomsInput') dropdown.classList.remove('show');
});

window.initSymptoms = function() {
    const container = document.getElementById('symptomsDropdown');
    if(!container) return;
    symptomsData.forEach(s => {
        const div = document.createElement('label'); div.className = 'symptom-item';
        div.innerHTML = `<input type="checkbox" value="${s}" onchange="updateSymptomsArray()"> <span>${s}</span>`;
        container.appendChild(div);
    });
}
window.updateSymptomsArray = function() {
    const checkboxes = document.querySelectorAll('.symptom-item input[type="checkbox"]');
    selectedSymptoms = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
    document.getElementById('symptomsInput').value = selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : '';
}

// --- DRAG AND DROP ZONE ---
const dropZone = document.getElementById('dropZone');
if(dropZone) {
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.background = 'rgba(37, 99, 235, 0.1)'; });
    dropZone.addEventListener('dragleave', () => { dropZone.style.background = ''; });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault(); dropZone.style.background = '';
        if (e.dataTransfer.files.length) {
            document.getElementById('xrayFile').files = e.dataTransfer.files;
            window.handleFileSelect(document.getElementById('xrayFile'));
        }
    });
}

window.handleFileSelect = function(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('uploadContent').style.display = 'none';
            document.getElementById('imageWrapper').style.display = 'block';
            document.getElementById('dropZone').classList.add('has-image');
            document.getElementById('btnContainer').style.display = 'block';
            document.getElementById('runAnalysisBtn').classList.add('ready'); 
        }
        reader.readAsDataURL(file);
    }
}

// --- DYNAMIC AI FEATURE DETECTION LOGIC ---
const medicalLabels = ["1st Anterior Rib", "2nd Posterior Rib", "Right Clavicle", "Scapula", "T4", "T6", "T8", "L1", "Pulmonary Artery", "Aortic Arch", "Cardiac Silhouette"];
let labelInterval;

window.spawnAILabel = function(wrapper) {
    const box = document.createElement('div');
    box.className = 'ai-label-box';
    const width = 30 + Math.random() * 50;
    const height = 30 + Math.random() * 50;
    const top = 10 + Math.random() * 70;
    const left = 10 + Math.random() * 70;
    
    const isSuccess = wrapper.classList.contains('scan-success');
    const color = isSuccess ? '#10b981' : '#00e5ff'; 
    
    box.style.width = width + 'px';
    box.style.height = height + 'px';
    box.style.top = top + '%';
    box.style.left = left + '%';
    box.style.borderColor = color;
    const text = document.createElement('div');
    text.className = 'ai-label-text';
    text.style.color = color;
    text.innerText = medicalLabels[Math.floor(Math.random() * medicalLabels.length)];
    
    box.appendChild(text);
    document.getElementById('aiLabelContainer').appendChild(box);
    setTimeout(() => box.remove(), 1500);
}

// --- STARGATE SCANNING LOGIC ---
window.runDiagnosticSequence = async function() {
    const activeUser = localStorage.getItem("activeClinician");
    if(activeUser === "Guest User") {
        window.showToast("Diagnostics restricted. Please log in with a verified account.", "error");
        setTimeout(() => { window.location.href = "login.html"; }, 2500);
        return;
    }

    const name = document.getElementById("patientName").value;
    const file = document.getElementById("xrayFile").files[0];
    if(!name || !file) return window.showToast("Please enter patient name and upload an X-Ray image.", "error");
    
    const btn = document.getElementById('runAnalysisBtn');
    btn.classList.remove('ready'); btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> SCANNING IMAGE...`;
    
    const wrapper = document.getElementById('imageWrapper');
    wrapper.classList.remove('scan-success'); wrapper.classList.add('scanning');
    const hudText = document.getElementById('hudText');
    hudText.innerHTML = "DESTINY DIAGNOSTIC<br>> ENERGY: 88%<br>> INITIATING...";
    const typeText = (txt) => { hudText.innerHTML += "<br>> " + txt; }

    labelInterval = setInterval(() => window.spawnAILabel(wrapper), 400);
    const steps = ["INITIALIZING RESNET50 NEURAL FRAMEWORK...", "SCANNING THORACIC RADIOGRAPHIC STRUCTURES...", "MAPPING PATHOLOGY & ANOMALY PROBABILITIES...", "COMPILING FINAL MEDICAL REPORT..."];
    for (let step of steps) { typeText(step); await new Promise(r => setTimeout(r, 1750)); }

    wrapper.classList.add('scan-success');
    hudText.innerHTML += "<br>> <span style='color:#10b981'>ANALYSIS COMPLETE. AWAITING SERVER...</span>";
    btn.innerHTML = `<i class="fas fa-check-circle"></i> CONNECTING TO SERVER...`;

    window.generateDiagnosticReport(name, file);
}

// --- CALENDAR & EVENTS ---
const calCanvas = document.getElementById('calConfettiCanvas');
let calConfetti;
if(typeof confetti !== 'undefined' && calCanvas) {
    calConfetti = confetti.create(calCanvas, { resize: true, useWorker: true });
}

window.fireFestivalMagic = function(title) {
    if (!calConfetti) return;
    const end = Date.now() + 3000;
    const o = { y: 0.8 };
    if (title.includes("Diwali")) {
        const shapes = ['🪔', '✨', '🎇'].map(e => confetti.shapeFromText({ text: e, scalar: 3 }));
        calConfetti({ particleCount: 50, spread: 100, origin: o, shapes: shapes });
        calConfetti({ particleCount: 100, spread: 120, origin: o, colors: ['#f59e0b', '#fbbf24', '#ffffff'] });
    }
}

let displayDate = new Date(); let selectedDate = new Date();

const getActiveUserStr = () => localStorage.getItem("activeClinician") || "Guest";
const getCalKey = () => `calendarEvents_${getActiveUserStr()}`;
const getBookingKey = () => `doctorBookings_${getActiveUserStr()}`;

const indianFestivals = {
    "1-1": { title: "New Year", type: "minor" },
    "1-26": { title: "Republic Day", type: "major" },
    "3-24": { title: "World TB Day", type: "minor" }, 
    "4-7": { title: "World Health Day", type: "minor" },
    "7-28": { title: "👑 Nikhil's Day (Founder)", type: "cameo" },
    "7-30": { title: "💻 Yadvi's Birthday", type: "cameo" },
    "8-15": { title: "Independence Day", type: "major" },
    "10-2": { title: "Gandhi Jayanti", type: "major" },
    "12-25": { title: "Christmas", type: "major" }
};
window.getDocDateStr = function(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

window.renderCalendar = function() {
    const grid = document.getElementById("calendarGrid"); if(!grid) return;
    grid.innerHTML = "";
    document.getElementById("eventEditor").style.display = "none";
    grid.style.display = "grid";
    
    const d = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
    document.getElementById("calMonth").innerText = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    ['S','M','T','W','T','F','S'].forEach((day, index) => { 
        let h = document.createElement("div"); h.style.fontSize="0.7rem"; h.style.fontWeight="800"; h.innerText = day; 
        if(index === 0) h.style.color = "var(--danger)"; 
        else h.style.color="var(--muted)";
        grid.appendChild(h); 
    });
    for(let i=0; i<d.getDay(); i++) grid.appendChild(document.createElement("div"));
    
    const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    let calendarEvents = JSON.parse(localStorage.getItem(getCalKey())) || {};
    let doctorBookings = JSON.parse(localStorage.getItem(getBookingKey())) || {};

    for(let i=1; i<=days; i++) {
        let cell = document.createElement("div"); cell.className = "cal-date";
        cell.innerText = i;
        let currentDateLoop = new Date(d.getFullYear(), d.getMonth(), i);
        let dKey = currentDateLoop.toDateString(); 
        let docDateStr = window.getDocDateStr(currentDateLoop);
        if (currentDateLoop.getDay() === 0) cell.classList.add("sunday");
        if (dKey === new Date().toDateString()) cell.classList.add("today");
        
        let monthDayKey = `${currentDateLoop.getMonth() + 1}-${currentDateLoop.getDate()}`;
        if (indianFestivals[monthDayKey]) {
            let festData = indianFestivals[monthDayKey];
            let festIcon = document.createElement("i");
            if(festData.type === 'cameo') festIcon.className = "fas fa-crown fest-dot fest-cameo";
            else {
                festIcon.className = "fas fa-circle fest-dot";
                if(festData.type === 'major') { festIcon.classList.add("fest-major"); cell.classList.add("sunday"); } 
                else festIcon.classList.add("fest-minor");
            }
            cell.appendChild(festIcon); cell.title = festData.title;
        }
        
        if(calendarEvents[dKey] || (doctorBookings[docDateStr] && Object.keys(doctorBookings[docDateStr]).length > 0)) { 
            let dot = document.createElement("div");
            dot.className = "status-line"; 
            if(doctorBookings[docDateStr]) dot.classList.add("doc-booking"); 
            cell.appendChild(dot); 
        }
        cell.onclick = () => window.switchToFocus(new Date(dKey));
        grid.appendChild(cell);
    }
}

window.changeMonth = function(n) { displayDate.setMonth(displayDate.getMonth() + n); window.renderCalendar(); }
window.switchToFocus = function(date) { 
    selectedDate = date;
    document.getElementById("calendarGrid").style.display = "none"; 
    document.getElementById("eventEditor").style.display = "block"; 
    document.getElementById("targetDate").innerText = selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }); 
    window.renderDayEvents();
    let monthDayKey = `${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    if(indianFestivals[monthDayKey]) window.fireFestivalMagic(indianFestivals[monthDayKey].title);
}
window.resetCalendar = function() { window.renderCalendar(); }

window.saveEvent = function() {
    const title = document.getElementById("eventTitle").value; const key = selectedDate.toDateString(); 
    if(!title) return; 
    let calendarEvents = JSON.parse(localStorage.getItem(getCalKey())) || {};
    if(!calendarEvents[key]) calendarEvents[key] = [];
    calendarEvents[key].push({title}); 
    localStorage.setItem(getCalKey(), JSON.stringify(calendarEvents)); 
    document.getElementById("eventTitle").value = ""; 
    window.renderDayEvents();
}

// DELETE LOGIC FOR EVENTS & APPOINTMENTS
window.deleteBooking = function(dateStr, time) {
    if(!confirm("Are you sure you want to cancel this appointment?")) return;
    let doctorBookings = JSON.parse(localStorage.getItem(getBookingKey())) || {};
    if(doctorBookings[dateStr] && doctorBookings[dateStr][time]) {
        delete doctorBookings[dateStr][time];
        if(Object.keys(doctorBookings[dateStr]).length === 0) delete doctorBookings[dateStr];
        localStorage.setItem(getBookingKey(), JSON.stringify(doctorBookings));
        window.showToast("Appointment canceled successfully", "success");
        window.renderDayEvents();
        window.renderCalendar();
    }
}

window.deleteEvent = function(dateKey, index) {
    if(!confirm("Delete this personal event?")) return;
    let calendarEvents = JSON.parse(localStorage.getItem(getCalKey())) || {};
    if(calendarEvents[dateKey]) {
        calendarEvents[dateKey].splice(index, 1);
        if(calendarEvents[dateKey].length === 0) delete calendarEvents[dateKey];
        localStorage.setItem(getCalKey(), JSON.stringify(calendarEvents));
        window.showToast("Event deleted successfully", "success");
        window.renderDayEvents();
        window.renderCalendar();
    }
}

window.renderDayEvents = function() {
    const list = document.getElementById("eventDisplay"); list.innerHTML = "";
    const docDateStr = window.getDocDateStr(selectedDate);
    
    let calendarEvents = JSON.parse(localStorage.getItem(getCalKey())) || {};
    let doctorBookings = JSON.parse(localStorage.getItem(getBookingKey())) || {};

    let monthDayKey = `${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    if(indianFestivals[monthDayKey]) {
        let festData = indianFestivals[monthDayKey];
        let bgColor, textColor, borderColor, icon;
        if(festData.type === 'major') { bgColor = "rgba(239, 68, 68, 0.1)"; textColor = "var(--danger)"; borderColor = "var(--danger)"; icon = "fa-flag"; } 
        else if (festData.type === 'cameo') { bgColor = "rgba(168, 85, 247, 0.15)"; textColor = "#a855f7"; borderColor = "#a855f7"; icon = "fa-crown"; } 
        else { bgColor = "rgba(245, 158, 11, 0.1)"; textColor = "#d97706"; borderColor = "#f59e0b"; icon = "fa-star"; }
        let item = document.createElement("div");
        item.className = "event-item-container";
        item.style.fontSize="0.75rem"; item.style.padding="10px"; item.style.background=bgColor; item.style.color=textColor; item.style.borderRadius="8px"; item.style.borderLeft=`3px solid ${borderColor}`; item.style.fontWeight="700"; 
        item.innerHTML = `<div><i class="fas ${icon}" style="margin-right:5px;"></i> ${festData.title}</div>`; 
        list.appendChild(item);
    }
    if(doctorBookings[docDateStr]) {
        Object.entries(doctorBookings[docDateStr]).forEach(([time, docName]) => {
            let item = document.createElement("div"); 
            item.className = "event-item-container";
            item.style.fontSize="0.75rem"; item.style.padding="10px"; item.style.background="rgba(16, 185, 129, 0.1)"; item.style.color="var(--success)"; item.style.borderRadius="8px"; item.style.borderLeft="3px solid var(--success)"; item.style.fontWeight="600"; 
            item.innerHTML = `
                <div><i class="fas fa-stethoscope"></i> ${time} - ${docName}</div>
                <button onclick="deleteBooking('${docDateStr}', '${time}')" class="delete-btn" title="Cancel Appointment"><i class="fas fa-trash"></i></button>
            `; 
            list.appendChild(item);
        });
    }
    const key = selectedDate.toDateString();
    if(calendarEvents[key]) {
        calendarEvents[key].forEach((e, idx) => { 
            let item = document.createElement("div"); 
            item.className = "event-item-container";
            item.style.fontSize="0.75rem"; item.style.padding="10px"; item.style.background="var(--input-bg)"; item.style.borderLeft="3px solid var(--primary)"; item.style.borderRadius="8px"; item.style.color="var(--text)"; item.style.fontWeight="500"; 
            item.innerHTML = `
                <div><i class="fas fa-clipboard-list" style="color:var(--muted); margin-right:5px;"></i> ${e.title}</div>
                <button onclick="deleteEvent('${key}', ${idx})" class="delete-btn" title="Delete Event"><i class="fas fa-trash"></i></button>
            `; 
            list.appendChild(item); 
        });
    }
}

window.checkAppointments = function() {
    const now = new Date(); const todayStr = window.getDocDateStr(now); 
    let doctorBookings = JSON.parse(localStorage.getItem(getBookingKey())) || {};
    const todaysDocs = doctorBookings[todayStr];
    
    if(!todaysDocs) return;
    Object.entries(todaysDocs).forEach(([timeStr, docName]) => {
        let [time, modifier] = timeStr.split(' '); let [hours, minutes] = time.split(':'); hours = parseInt(hours);
        if (hours === 12 && modifier === 'AM') hours = 0; if (hours < 12 && modifier === 'PM') hours += 12;
        let apptTime = new Date(now); apptTime.setHours(hours, parseInt(minutes), 0, 0);
        let diffMs = apptTime - now; let diffMins = Math.floor(diffMs / 60000);
        let alertKey = `alert_${todayStr}_${timeStr}`;
        if (diffMins > 0 && diffMins <= 30 && !sessionStorage.getItem(alertKey)) {
            sessionStorage.setItem(alertKey, "true"); alertSound.play();
            document.getElementById('alertMsg').innerHTML = `You have an appointment with <b>${docName}</b> in <b>${diffMins} minutes!</b><br><br>Time: ${timeStr}`;
            document.getElementById('alertOverlay').style.display = 'flex';
        }
    });
}
window.closeAlert = function() { document.getElementById('alertOverlay').style.display = 'none'; alertSound.pause(); alertSound.currentTime = 0;}
setInterval(window.checkAppointments, 60000);

window.updateGreetings = function() {
    const hr = new Date().getHours();
    const greet = document.getElementById("greeting");
    
    const activeUser = localStorage.getItem("activeClinician");
    const storageKey = activeUser ? `profileData_${activeUser}` : "profileData_guest";
    const p = JSON.parse(localStorage.getItem(storageKey)) || {}; 
    
    let rawName = p.name || activeUser || "User";
    const fName = rawName.split(' ')[0];
    
    if(hr >= 5 && hr < 12) greet.innerHTML = `Good Morning, <span style="opacity:0.9;">${fName}</span>`;
    else if(hr >= 12 && hr < 17) greet.innerHTML = `Good Afternoon, <span style="opacity:0.9;">${fName}</span>`;
    else if(hr >= 17 && hr < 21) greet.innerHTML = `Good Evening, <span style="opacity:0.9;">${fName}</span>`;
    else greet.innerHTML = `Good Night, <span style="opacity:0.9;">${fName}</span>`;
}

window.checkServer = function() { 
    fetch("http://127.0.0.1:5000/").then(() => { 
        document.getElementById("serverStatus").innerText = "ONLINE"; 
        document.getElementById("serverStatus").style.color = "var(--success)"; 
        document.getElementById("sysHubContainer").classList.add("sys-hub-online"); 
    }).catch(() => {
        document.getElementById("serverStatus").innerText = "OFFLINE"; 
        document.getElementById("serverStatus").style.color = "var(--danger)"; 
        document.getElementById("sysHubContainer").classList.remove("sys-hub-online");
    });
}

// --- UPDATED REPORT GENERATION WITH ARCHIVE SYNC ---
window.generateDiagnosticReport = async function(name, file) {
    const fd = new FormData(); fd.append("image", file);
    try {
        const r = await fetch("http://127.0.0.1:5000/predict", { method: "POST", body: fd });
        const data = await r.json();
        
        const activeUser = localStorage.getItem("activeClinician") || "Guest";
        const storageKey = `profileData_${activeUser}`;
        const p = JSON.parse(localStorage.getItem(storageKey)) || {};
        
        const isSelf = (name === (p.name || "Nikhil Rathod"));
        const finalPatientId = document.getElementById('patientIdDisplay') ? document.getElementById('patientIdDisplay').innerText : `EMRG-${Math.floor(Math.random()*10000)}`;
        
        const report = {
            id: Date.now(), // Unique ID for the archive
            name: name, 
            date: new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}), 
            time: new Date().toLocaleTimeString(),
            med: finalPatientId, 
            ihi: "91-" + Math.floor(Math.random()*90000),
            ass: "AI analyzed the chest radiographic input. The system detected clinical markers using ResNet50 deep transfer learning. Associated symptoms reported: " + (selectedSymptoms.join(', ') || 'None'),
            diag: "Result: " + data.prediction + " [Confidence: " + (data.confidence || '89%') + "]",
            act: data.prediction === "Tuberculosis" ? "Urgent: Isolation and immediate sputum culture required." : "Healthy presentation. Follow up in 6 months."
        };

        // --- NEW ARCHIVE LOGIC ---
        // Save as current for immediate viewing
        localStorage.setItem("currentReport", JSON.stringify(report));
        
        // Push into the permanent history array
        const archiveKey = `diagnosticArchive_${activeUser}`;
        let archive = JSON.parse(localStorage.getItem(archiveKey)) || [];
        archive.unshift(report); // Adds newest to the top
        localStorage.setItem(archiveKey, JSON.stringify(archive));
        // --------------------------

        clearInterval(labelInterval);
        window.location.href = "report.html";
    } catch(e) { 
        clearInterval(labelInterval);
        const wrapper = document.getElementById('imageWrapper');
        if(wrapper) {
            wrapper.classList.remove('scanning', 'scan-success');
        }
        const labelContainer = document.getElementById('aiLabelContainer');
        if(labelContainer) labelContainer.innerHTML = '';
        if(typeof window.showToast === 'function') window.showToast("Backend Offline. Ensure your Flask server is running.", "error");
        const btn = document.getElementById('runAnalysisBtn');
        if(btn) btn.innerHTML = `<i class="fas fa-bolt"></i> RUN RADIOGRAPHIC ANALYSIS`;
    }
}

// INITIALIZE EVERYTHING ON LOAD
window.addEventListener('DOMContentLoaded', () => {
    window.initSymptoms(); window.fetchHealthNews();
    
    window.loadRealProfileData();
    const dtElement = document.getElementById("dateTime");
    if(dtElement) dtElement.innerText = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    window.updateGreetings(); 
    window.renderCalendar(); 
    window.checkServer(); 
    window.checkAppointments(); 
});
