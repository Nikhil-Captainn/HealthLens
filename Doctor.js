// --- 1. DOCTOR DATA (WITH COORDINATES) ---
const allDoctors = [
    { id: 1, name: "Dr. Nitin Mankar", lat: 21.1234, lng: 79.0412, phone: "08511490966", domain: "General Physician", hospital: "Apna Physio Clinic", image: "https://content.jdmagicbox.com/v2/comp/nagpur/g7/0712px712.x712.240601190855.t8g7/catalogue/apna-physio-general-physician-and-physiotherapy-clinic-dattawadi-nagpur-clinics-nl7eo6hfqe.jpg", experience: "9 Years in Healthcare. Consultation Fees: ₹ 100", specialities: ["General Checkups", "Physiotherapy"], rating: 4.7, reviewText: "Very affordable and great care." },
    { id: 2, name: "Dr. Neha Goenka Agrawal", lat: 21.1350, lng: 79.0700, phone: "07041766972", domain: "General Physician", hospital: "Panchwati Tower Clinic", image: "https://content.jdmagicbox.com/v2/comp/nagpur/p6/0712px712.x712.230909223010.b9p6/catalogue/dr-neha-goenka-agrawal-dhantoli-nagpur-general-physician-doctors-m2a0i0wemt.jpg", experience: "12 Years in Healthcare", specialities: ["Internal Medicine", "Fever"], rating: 4.5, reviewText: "Listens patiently and prescribes minimal medicines." },
    { id: 3, name: "Dr. Pallavi Patle", lat: 21.1120, lng: 79.0205, phone: "08147630884", domain: "Gynaecologist", hospital: "Jaitala Clinic", image: "https://ui-avatars.com/api/?name=Dr+Pallavi+Patle&background=random", experience: "2 Years in Healthcare", specialities: ["Obstetrics", "Gynaecology"], rating: 5.0, reviewText: "Very friendly and approachable." },
    { id: 4, name: "Dr. Husain Bhati", lat: 21.1458, lng: 79.0882, phone: "919876543211", domain: "Neurosurgeon", hospital: "Spine And Brain Surgeon", image: "assets/dr-husain-bhati-spine-and-brain-surgeon-neurosurgeon-nagpur-neurologists-i6vgs4b3j6.webp", experience: "18 Years in Healthcare. Consultation Fees: ₹ 500", specialities: ["Spine Surgery", "Neurosurgical Interventions"], rating: 4.5, reviewText: "Highly skilled neurosurgeon." },
    { id: 5, name: "Dr. Nitin Shinde", lat: 21.1850, lng: 79.0800, phone: "919876543212", domain: "General Physician", hospital: "Alexis Multispeciality Hospital", image: "assets/dr-nitin-shinde-alexis-multispeciality-hospital-pvt-ltd-mankapur-nagpur-general-physician-doctors-h43pd9pjuz.jpg", experience: "Tertiary care hospital providing comprehensive medical services. Fees: ₹ 750", specialities: ["Internal Medicine"], rating: 4.7, reviewText: "Great facility and accurate diagnosis." },
    { id: 6, name: "Dr. Sehba Nehal", lat: 21.1845, lng: 79.0790, phone: "919876543213", domain: "General Physician", hospital: "Max Super Speciality Hospital", image: "assets/dr-sehba-asim-alexis-multispeciality-hospital-pvt-ltd-mankapur-nagpur-general-physician-doctors-0gh1xh2wgr.jpg", experience: "Internal Medicine Expert. Fees: ₹ 750", specialities: ["Internal Medicine"], rating: 4.0, reviewText: "Detailed analysis of symptoms." },
    { id: 7, name: "Dr. Siddharth Mendiratta", lat: 21.1860, lng: 79.0810, phone: "919876543214", domain: "General Surgeon", hospital: "Alexis Multispeciality Hospital", image: "assets/dr-siddharth-mendiratta-alexis-multispeciality-hospital-pvt-ltd-mankapur-nagpur-general-surgeon-doctors-n660v18ng4.jpg", experience: "MCh Plastic Surgery. Fees: ₹ 1,000", specialities: ["General Surgery", "Plastic Surgery"], rating: 4.9, reviewText: "Exceptional surgical precision." },
    { id: 8, name: "Dr. Shivangi Sahewala", lat: 21.1380, lng: 79.0680, phone: "08511938977", domain: "Gynaecologist", hospital: "Ramdas Peth Clinic", image: "assets/dr-shivangi-sahewala-mutha-ramdas-peth-nagpur-gynaecologist-and-obstetrician-doctors-1s1qahmspe.jpg", experience: "11 Years in Healthcare. Fees: ₹ 1,000", specialities: ["Laparoscopy", "Obstetrics"], rating: 4.4, reviewText: "Accomplished laparoscopic surgeon." },
    { id: 9, name: "Dr. Palak Jaiswal", lat: 21.1550, lng: 79.0850, phone: "07411716877", domain: "Neurosurgeon", hospital: "Kasturchand Park Clinic", image: "assets/dr-palak-jaiswal-kasturchand-park-nagpur-neurologists-7keri7clkr.jpg", experience: "15 Years in Healthcare. Fees: ₹ 1,000", specialities: ["Brain Tumors", "Spinal Tumors"], rating: 4.9, reviewText: "Saved my life, brilliant doctor." },
    { id: 10, name: "Dr. Sameeksha Dubey", lat: 21.1500, lng: 79.0820, phone: "919876543215", domain: "Oncologist", hospital: "Kingsway Hospital", image: "assets/dr-sameeksha-dubey-kasturchand-park-nagpur-oncologists-h7bgngbx93.jpg", experience: "Expert in Internal Medicine & Oncology.", specialities: ["Oncology", "Chemotherapy"], rating: 4.9, reviewText: "Compassionate cancer care." },
    { id: 11, name: "Dr. Kirti Kewalramani", lat: 21.1900, lng: 79.0950, phone: "919876543216", domain: "Gynaecologist", hospital: "Jaripatka Clinic", image: "assets/dr-kewalramani-kirti-jaripatka-nagpur-gynaecologist-and-obstetrician-doctors-y1r4todpps.jpg", experience: "22 Years in Healthcare", specialities: ["Women's Wellness"], rating: 4.5, reviewText: "Highly experienced and kind." },
    { id: 12, name: "Dr. K G Deshpande", lat: 21.1420, lng: 79.0550, phone: "07383171845", domain: "Cardiologist", hospital: "Memorial Center", image: "assets/dr-k-g-deshpande-memorial-center-gokulpeth-nagpur-cardiologists-0onl39yzsn.jpg", experience: "42 Years in Healthcare", specialities: ["Cardiac Treatment"], rating: 4.3, reviewText: "Pioneer in cardiology in Nagpur." },
    { id: 13, name: "Dr. Chetan Rathi", lat: 21.1390, lng: 79.0650, phone: "919876543217", domain: "Cardiologist", hospital: "Hrudayam Heart Care", image: "assets/dr-chetan-rathi-hrudayam-heart-care-and-arrhythmia-clinic-ramdas-peth-nagpur-cardiac-hospitals-0einphz3wi.jpeg", experience: "14 Years in Healthcare", specialities: ["Electrophysiology"], rating: 4.9, reviewText: "Respected consultant cardiologist." },
    { id: 14, name: "Dr. Shoeb Nadeem", lat: 21.1855, lng: 79.0805, phone: "919876543218", domain: "Cardiologist", hospital: "Alexis Multispeciality", image: "assets/dr-shoeb-nadeem-mankapur-nagpur-cardiologists-txl04hfzlz.jpg", experience: "13 Years in Healthcare", specialities: ["Interventional Cardiology"], rating: 4.5, reviewText: "Great multi-organ transplant care." },
    { id: 15, name: "Dr. Pushkraj Gadkari", lat: 21.1865, lng: 79.0815, phone: "919876543219", domain: "Cardiologist", hospital: "Alexis Multispeciality", image: "assets/dr-pushkraj-gadkari-alexis-multispeciality-hospital-pvt-ltd-mankapur-nagpur-cardiologists-hljsygh2ir.jpg", experience: "Fees: ₹ 1,000", specialities: ["Interventional Cardiology"], rating: 5.0, reviewText: "Expert care in transplants." },
    { id: 16, name: "Dr. Prashant Rahate", lat: 21.1250, lng: 79.1150, phone: "07947203034", domain: "General Surgeon", hospital: "Sevenstar Hospital", image: "assets/dr-prashant-rahate-nandanvan-colony-nagpur-hospitals-4q2cxpce4l.jpg", experience: "Expert Surgeon at Sevenstar", specialities: ["General Surgery"], rating: 3.9, reviewText: "Good facilities." },
    { id: 17, name: "Dr. Zoeb Haider", lat: 21.1255, lng: 79.1155, phone: "919876543220", domain: "General Surgeon", hospital: "Sevenstar Hospital", image: "assets/dr-zoeb-haider-sevenstar-hospital-nandanvan-colony-nagpur-general-surgeon-doctors-9lu2j9kcq6.jpg", experience: "Advanced imaging & robotic surgery.", specialities: ["Robotic Surgery"], rating: 4.3, reviewText: "Holistic patient care." },
    { id: 18, name: "Dr. Sadashiv Bhole", lat: 21.1260, lng: 79.1160, phone: "919876543221", domain: "Urologist", hospital: "Seven Star Hospital", image: "assets/dr-sadashiv-bhole-seven-star-hospital-nandanvan-colony-nagpur-urologist-doctors-9eystpdrkh.jpg", experience: "26 Years in Healthcare. Fees: ₹ 400", specialities: ["Urology", "Gen. Surgery"], rating: 4.3, reviewText: "Very affordable and effective." },
    { id: 19, name: "Dr. Ravi Dashputra", lat: 21.1265, lng: 79.1165, phone: "919876543222", domain: "Orthopaedic", hospital: "Sevenstar Hospital", image: "assets/dr-ravi-dashputra-sevenstar-hospital-nandanvan-colony-nagpur-orthopaedic-doctors-tmsybo178q.jpg", experience: "Orthopedist at Sevenstar", specialities: ["Orthopaedics", "Joint Pain"], rating: 4.0, reviewText: "Helped with my knee issues." },
    { id: 20, name: "Dr. Sachin Makade", lat: 21.1270, lng: 79.1170, phone: "919876543223", domain: "Anesthesiologist", hospital: "Sevenstar Hospital", image: "assets/dr-sachin-makade-nandanvan-colony-nagpur-1km01.jpg", experience: "Neuro Anesthesiologist", specialities: ["Anaesthesia"], rating: 4.0, reviewText: "Ensured a painless procedure." },
    { id: 21, name: "Dr. Shailesh Kothalkar", lat: 21.1275, lng: 79.1175, phone: "919876543224", domain: "Rhinoplasty/ENT", hospital: "Sevenstar Hospital", image: "assets/dr-shailesh-kothalkar-sevenstar-hospital-nandanvan-colony-nagpur-rhinoplasty-doctors-f9ogwyrlk3.jpg", experience: "Cochlear Implant Surgeon", specialities: ["ENT", "Rhinoplasty"], rating: 5.0, reviewText: "Best ENT specialist in town." },
    { id: 22, name: "Dr. Rhishikesh Umalkar", lat: 21.1400, lng: 79.0800, phone: "919876543225", domain: "Cardiologist", hospital: "Manomay Cardiac Care", image: "assets/dr-rhishikesh-umalkar-nagpur-jnn6tuvxmg.jpg", experience: "9 Years in Healthcare. Fees: ₹ 800", specialities: ["Echocardiography", "Angioplasty"], rating: 4.9, reviewText: "Compassionate interventional cardiologist." },
    { id: 23, name: "Dr. Tejas", lat: 21.1860, lng: 79.0815, phone: "07947425648", domain: "Orthodental", hospital: "Asha Dental Clinic", image: "https://ui-avatars.com/api/?name=Dr+Asha&background=2563eb&color=fff", experience: "Operating 10:00 am - 2:00 pm | 5:00 pm - 9:00 pm. Dedicated to delivering high-quality personalized dental care.", specialities: ["Bone Grafting", "Laser Whitening", "Teeth Reshaping", "Geriatric Dentistry"], rating: 4.9, reviewText: "Rated 4.9 stars based on 24 customer reviews. Trusted healthcare provider delivering top-tier treatments." }
];

// --- 2. STATE ---
let currentDoctors = [...allDoctors];
let currentDate = new Date(); 
let activeSelectedDate = new Date(); 
let selectedTimeSlot = null;
let activeDoctorId = null;

let bookings = JSON.parse(localStorage.getItem('myDoctorBookings')) || {}; 
let notifications = JSON.parse(localStorage.getItem('myNotifications')) || [];

const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:30 PM", "01:30 PM", "02:30 PM", "03:30 PM", "04:30 PM", "05:30 PM"];

// --- 3. DOM ELEMENTS ---
const doctorGrid = document.getElementById('doctorGrid');
const dashboardContainer = document.getElementById('dashboard');
const closeDetailBtn = document.getElementById('closeDetail');
const detailContent = document.getElementById('detailContent');
const searchInput = document.getElementById('searchDoctor');
const domainFilter = document.getElementById('domainFilter');
const calendarBody = document.getElementById('calendarBody');
const monthYearDisplay = document.getElementById('monthYearDisplay');
const timeSlotsContainer = document.getElementById('timeSlotsContainer');
const selectedDateDisplay = document.getElementById('selectedDateDisplay');
const mainBookBtn = document.getElementById('mainBookBtn'); 
const locDropdown = document.getElementById('locDropdown');
const locSearchInput = document.getElementById('locSearchInput');
const locResults = document.getElementById('locResults');

// --- 4. TOAST NOTIFICATIONS ---
window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- 5. LOCATION ALGORITHM & SEARCH ---
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1); 
}

window.toggleLocationMenu = function() {
    locDropdown.classList.toggle('show');
}

function applyLocation(lat, lng, locName) {
    document.getElementById('locationText').innerText = locName;
    
    allDoctors.forEach(doc => {
        doc.distance = calculateDistance(lat, lng, doc.lat, doc.lng);
    });

    currentDoctors = [...allDoctors].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    showToast(`Showing doctors nearest to ${locName}!`);
    renderDoctors(currentDoctors);
    locDropdown.classList.remove('show');
    locSearchInput.value = '';
    locResults.innerHTML = '';
}

window.useCurrentLocation = function() {
    if (!navigator.onLine) {
        showToast("No internet connection.", "danger");
        return;
    }
    const locText = document.getElementById('locationText');
    if (navigator.geolocation) {
        locText.innerText = "Locating...";
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLng}`)
                    .then(res => res.json())
                    .then(data => {
                        const cityName = data.address.city || data.address.town || data.address.county || "Nearest";
                        applyLocation(userLat, userLng, cityName);
                    }).catch(() => {
                        applyLocation(userLat, userLng, "Nearest Sorted");
                    });
            },
            (error) => {
                showToast("Location access denied.", "danger");
                locText.innerText = "Location";
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        showToast("Geolocation is not supported.", "danger");
    }
}

let typingTimer;
locSearchInput.addEventListener('input', (e) => {
    clearTimeout(typingTimer);
    const query = e.target.value.trim();
    
    if (query.length < 3) {
        locResults.innerHTML = '';
        return;
    }

    typingTimer = setTimeout(() => {
        locResults.innerHTML = '<li><i class="fas fa-spinner fa-spin"></i> <span>Searching...</span></li>';
        
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`)
            .then(res => res.json())
            .then(data => {
                locResults.innerHTML = '';
                if(data.length === 0) {
                    locResults.innerHTML = '<li style="color:var(--text-muted); justify-content:center;">No results found</li>';
                    return;
                }
                data.forEach(place => {
                    const li = document.createElement('li');
                    const cleanName = place.display_name.split(',')[0]; 
                    li.innerHTML = `<i class="fas fa-map-marker-alt"></i> <span>${place.display_name}</span>`;
                    li.onclick = () => applyLocation(place.lat, place.lon, cleanName);
                    locResults.appendChild(li);
                });
            })
            .catch(() => {
                locResults.innerHTML = '<li style="color:var(--danger-color);">Error fetching location</li>';
            });
    }, 600); 
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.location-wrapper')) {
        locDropdown.classList.remove('show');
    }
    if (!e.target.closest('#notifPanel') && !e.target.closest('#notifBtn')) {
        document.getElementById('notifPanel').classList.remove('show');
    }
});

// --- 6. NOTIFICATION PANEL LOGIC ---
function renderNotifications() {
    const list = document.getElementById('notifList');
    const bell = document.getElementById('notifBtn');
    list.innerHTML = '';
    if (notifications.length === 0) {
        list.innerHTML = '<div class="notif-empty">No new appointments booked yet.</div>';
        bell.classList.remove('has-notif');
    } else {
        bell.classList.add('has-notif');
        [...notifications].reverse().forEach(n => {
            const item = document.createElement('div');
            item.className = 'notif-item';
            item.innerHTML = `<span><i class="fas fa-calendar-check" style="color:var(--success);"></i> ${n.text}</span><span class="notif-time">${n.time}</span>`;
            list.appendChild(item);
        });
    }
}
document.getElementById('notifBtn').addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('notifPanel').classList.toggle('show'); });
window.clearNotifications = function() { notifications = []; localStorage.removeItem('myNotifications'); renderNotifications(); }

// --- 7. USER PROFILE & THEME ---
function loadUserProfile() {
    const p = JSON.parse(localStorage.getItem("profileData")) || {};
    document.getElementById("user-name-display").innerText = p.name || "Nikhil Rathod";
    document.getElementById("user-email-display").innerText = p.email || "nikhil@example.com";
    if (p.avatar) document.getElementById("user-avatar").src = p.avatar;

    const theme = localStorage.getItem("theme") || "light";
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.getElementById('themeBtn').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.getElementById('themeBtn').innerHTML = '<i class="fas fa-moon"></i>';
    }
}

window.toggleTheme = function() {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    document.getElementById('themeBtn').innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    localStorage.setItem('dashTheme', isDark ? 'dark' : 'light');
    showToast(isDark ? 'Switched to Dark Mode' : 'Switched to Light Mode');
}

// --- 8. FILTER & RENDER DOCTORS ---
function populateFilters() {
    const domains = [...new Set(allDoctors.map(d => d.domain))];
    domains.forEach(domain => {
        const opt = document.createElement('option');
        opt.value = domain;
        opt.innerText = domain;
        domainFilter.appendChild(opt);
    });
}

function applySearchAndFilter() {
    const term = searchInput.value.toLowerCase();
    const selectedDomain = domainFilter.value;
    currentDoctors = allDoctors.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(term) || d.hospital.toLowerCase().includes(term);
        const matchesDomain = selectedDomain === "All" || d.domain === selectedDomain;
        return matchesSearch && matchesDomain;
    });
    if (document.getElementById('locationText').innerText !== "Location" && document.getElementById('locationText').innerText !== "Locating...") {
        currentDoctors.sort((a, b) => parseFloat(a.distance || 0) - parseFloat(b.distance || 0));
    }
    renderDoctors(currentDoctors);
}
searchInput.addEventListener('input', applySearchAndFilter);
domainFilter.addEventListener('change', applySearchAndFilter);

function renderDoctors(docs) {
    doctorGrid.innerHTML = '';
    if(docs.length === 0) {
        doctorGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding: 20px;">No doctors found matching criteria.</p>';
        return;
    }
    docs.forEach(doc => {
        let distanceHtml = '';
        if (doc.distance) {
            const distValue = parseFloat(doc.distance);
            const distColor = distValue < 10 ? '#10b981' : '#e53e3e'; 
            distanceHtml = `<span class="dr-distance" style="color: ${distColor}; font-size: 11px; font-weight: bold;"><i class="fas fa-map-marker-alt"></i> ${doc.distance} km away</span>`;
        }

        const isSelected = doc.id === activeDoctorId;
        const cardClass = isSelected ? 'dr-card selected-card' : 'dr-card';
        const btnClass = isSelected ? 'btn-book btn-select-doc btn-selected' : 'btn-book btn-select-doc';
        const btnText = isSelected ? '<i class="fas fa-check-circle"></i> Selected' : 'Select Doctor';

        const card = document.createElement('div');
        card.className = cardClass;
        card.setAttribute('data-id', doc.id); 
        card.innerHTML = `
            <div class="dr-card-top">
                <img src="${doc.image}" alt="${doc.name}" class="dr-img" onerror="this.src='https://ui-avatars.com/api/?name=${doc.name.replace(/ /g, '+')}&background=random'">
                <div class="dr-info">
                    <h4>${doc.name}</h4>
                    <span class="dr-domain"><i class="fas fa-stethoscope"></i> ${doc.domain}</span>
                    <span class="dr-hospital">${doc.hospital}</span>
                    ${distanceHtml}
                </div>
            </div>
            <div class="dr-card-actions">
                <button class="${btnClass}" onclick="selectDoctor(${doc.id}, event)">${btnText}</button>
                <button class="btn-detail" onclick="openDetails(${doc.id}, false)">Detail</button>
            </div>
        `;
        doctorGrid.appendChild(card);
    });
}

window.selectDoctor = function(id, event) {
    if (event) event.stopPropagation();
    activeDoctorId = id;
    
    document.querySelectorAll('.dr-card').forEach(card => {
        const cardId = parseInt(card.getAttribute('data-id'));
        const btn = card.querySelector('.btn-select-doc');
        
        if (cardId === activeDoctorId) {
            card.classList.add('selected-card');
            if (btn) {
                btn.innerHTML = '<i class="fas fa-check-circle"></i> Selected';
                btn.classList.add('btn-selected');
            }
        } else {
            card.classList.remove('selected-card');
            if (btn) {
                btn.innerHTML = 'Select Doctor';
                btn.classList.remove('btn-selected');
            }
        }
    });

    const doc = allDoctors.find(d => d.id === id);
    if (selectedTimeSlot && doc) {
        mainBookBtn.innerText = `Book with ${doc.name}`;
        mainBookBtn.style.display = 'block';
    }
}

// --- 9. CALENDAR & SLOTS ---
function renderCalendar() {
    calendarBody.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearDisplay.innerText = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                cell.classList.add('empty');
            } else if (date > daysInMonth) {
                cell.classList.add('empty');
            } else {
                cell.innerText = date;
                if (j === 0) cell.classList.add('sunday'); 
                
                const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
                
                if (dateStr === formatDate(activeSelectedDate)) cell.classList.add('active-date');
                if (bookings[dateStr] && Object.keys(bookings[dateStr]).length > 0) cell.classList.add('has-booking'); 

                let currentIterationDate = new Date(year, month, date);
                cell.addEventListener('click', () => {
                    activeSelectedDate = currentIterationDate;
                    selectedTimeSlot = null; 
                    mainBookBtn.style.display = 'none'; 
                    renderCalendar(); 
                    renderTimeSlots(); 
                });
                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
        if(date > daysInMonth) break; 
    }
}
document.getElementById('prevMonth').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
document.getElementById('nextMonth').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });
function formatDate(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

function renderTimeSlots() {
    timeSlotsContainer.innerHTML = '';
    const dateStr = formatDate(activeSelectedDate);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    selectedDateDisplay.innerText = `${dayNames[activeSelectedDate.getDay()]}, ${activeSelectedDate.getDate()} ${monthNames[activeSelectedDate.getMonth()]} ${activeSelectedDate.getFullYear()}`;
    const dailyBookings = bookings[dateStr] || {};

    timeSlots.forEach(slot => {
        const btn = document.createElement('button');
        btn.className = 'slot-btn';
        btn.innerText = slot;
        if(dailyBookings[slot]) {
            btn.classList.add('booked');
            btn.title = `Booked with ${dailyBookings[slot]}`;
        } else {
            if (selectedTimeSlot === slot) btn.classList.add('selected-slot');
            btn.addEventListener('click', () => {
                selectedTimeSlot = slot;
                renderTimeSlots(); 
                mainBookBtn.style.display = 'block'; 
                mainBookBtn.innerText = activeDoctorId ? `Book with ${allDoctors.find(d=>d.id===activeDoctorId).name}` : "Book Appointment";
            });
        }
        timeSlotsContainer.appendChild(btn);
    });
}

// --- 10. COMPLETING THE BOOKING ---
mainBookBtn.addEventListener('click', () => {
    if (!activeDoctorId) {
        showToast('Please select a doctor from the list first!', 'danger');
        document.querySelector('.doctor-grid').style.boxShadow = '0 0 15px rgba(252, 129, 129, 0.5)';
        setTimeout(() => document.querySelector('.doctor-grid').style.boxShadow = 'none', 1000);
        return;
    }
    executeBooking();
});

// 🟢 ALIA'S CTO FIX: WEBHOOK INJECTION 🟢
function executeBooking() {
    const doc = allDoctors.find(d => d.id === activeDoctorId);
    const dateStr = formatDate(activeSelectedDate);
    if (!bookings[dateStr]) bookings[dateStr] = {}; 
    bookings[dateStr][selectedTimeSlot] = doc.name; 
    localStorage.setItem('myDoctorBookings', JSON.stringify(bookings)); 

    notifications.push({
        text: `Confirmed Appt: <b>${doc.name}</b> on ${dateStr} at ${selectedTimeSlot}`,
        time: new Date().toLocaleString()
    });
    localStorage.setItem('myNotifications', JSON.stringify(notifications));
    renderNotifications();

    showToast(`Success! Appointment confirmed with ${doc.name} on ${dateStr} at ${selectedTimeSlot}.`);

    // --- NEW: WEBHOOK FIRE SEQUENCE ---
    const userEmail = localStorage.getItem('healthlens_email') || "guest@healthlens.com";
    const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/zol91lggd2ci456mdm5ihq2ub8mye83h";
    
    fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            actionType: "appointment",
            email: userEmail,
            doctorName: doc.name,
            appointmentDate: dateStr,
            appointmentTime: selectedTimeSlot,
            patientName: localStorage.getItem('activeClinician') || "Patient"
        })
    }).catch(err => console.log("Webhook ping failed", err));
    // ------------------------------------

    selectedTimeSlot = null; 
    const patientNotes = document.getElementById('patientNotes');
    if (patientNotes) patientNotes.value = ''; 
    mainBookBtn.style.display = 'none';
    renderTimeSlots(); 
    renderCalendar(); 
    dashboardContainer.classList.remove('show-details'); 
}

// --- 11. RIGHT PANEL DETAILS, MAP & BUTTONS ---
window.openDetails = function(id, focusBooking = false) {
    selectDoctor(id); 

    const doc = allDoctors.find(d => d.id === id);
    if (!doc) return;

    let starsHtml = '';
    for(let i=0; i<5; i++) starsHtml += `<i class="fa${i < Math.floor(doc.rating) ? 's' : 'r'} fa-star"></i>`;
    let waNumber = doc.phone.replace(/[^0-9]/g, '');
    if (waNumber.startsWith('0')) waNumber = '91' + waNumber.substring(1);

    const mapEmbedUrl = `https://maps.google.com/maps?q=${doc.lat},${doc.lng}&z=15&output=embed`;
    const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${doc.lat},${doc.lng}`;

    detailContent.innerHTML = `
        <img src="${doc.image}" alt="${doc.name}" class="detail-main-img" onerror="this.src='https://ui-avatars.com/api/?name=${doc.name.replace(/ /g, '+')}&background=random'">
        <h2 class="detail-name">${doc.name}</h2>
        <div class="detail-meta">
            <span><i class="fas fa-stethoscope"></i> ${doc.domain}</span>
            <span><i class="far fa-hospital"></i> ${doc.hospital}</span>
            <span><i class="fas fa-phone-alt"></i> +${waNumber}</span>
            <span><i class="fas fa-rupee-sign"></i> ${doc.experience.includes('Fees') ? doc.experience.split('Fees: ')[1] || 'Consultation' : 'Standard Rates'}</span>
        </div>
        
        <div class="detail-section"><h4><i class="fas fa-briefcase medical"></i> Experience & Info</h4><p>${doc.experience}</p></div>
        
        <div class="detail-section">
            <h4><i class="fas fa-list-ul"></i> Speciality</h4>
            <ul class="speciality-list">${doc.specialities.map(spec => `<li>${spec}</li>`).join('')}</ul>
        </div>
        
        <div class="detail-section">
            <h4><i class="fas fa-map-marked-alt"></i> Clinic Location</h4>
            <div class="map-container" onclick="window.open('${mapDirectionsUrl}', '_blank')" title="Click for Google Maps Directions">
                <iframe 
                    width="100%" 
                    height="160" 
                    frameborder="0" 
                    scrolling="no" 
                    marginheight="0" 
                    marginwidth="0" 
                    src="${mapEmbedUrl}"
                    style="pointer-events: none;">
                </iframe>
                <div class="map-overlay">
                    <button class="btn-directions"><i class="fas fa-directions"></i> Get Directions</button>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h4>Reviews</h4>
            <div class="reviews-box"><div class="stars">${starsHtml} <span style="color:var(--text-muted); margin-left:5px;">${doc.rating}</span></div><p>"${doc.reviewText}"</p></div>
        </div>
        
        <div class="detail-actions">
            <button class="btn-book" id="panelBookBtn">Confirm Appt</button>
            <button class="btn-call" title="Call Doctor" onclick="window.location.href='tel:+${waNumber}'"><i class="fas fa-phone-alt"></i> Call</button>
            <button class="btn-chat" title="WhatsApp Doctor" onclick="window.open('https://wa.me/${waNumber}', '_blank')"><i class="fab fa-whatsapp"></i> Chat</button>
        </div>
    `;
    dashboardContainer.classList.add('show-details');

    document.getElementById('panelBookBtn').addEventListener('click', () => {
        if (!selectedTimeSlot) { showToast('Please select a Time Slot on the left first!', 'danger'); return; }
        executeBooking();
    });
}
closeDetailBtn.addEventListener('click', () => dashboardContainer.classList.remove('show-details'));

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile(); 
    populateFilters();
    renderDoctors(allDoctors);
    renderCalendar();
    renderTimeSlots();
    renderNotifications();
});