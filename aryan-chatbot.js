/* ============================================================
   ARYAN CHATBOT v5.2 — aryan-chatbot.js (FINAL BOSS)
   HealthLens AI · Classic Emojis, Network Banners & Master Fixes
   © Nikhil Rathod / Manthan Pixel Hub — HealthLens Project
   ============================================================ */

(function () {
  'use strict';

  /* ════════════════════ CONFIG ════════════════════ */
  var C = window.ARYAN_CONFIG || {};
  C.geminiApiKey = C.geminiApiKey || "AIzaSyBT4bSQSwTxkmiAFdGrAxPnmQ0C54s3kdo"; // Live Key
  C.apiBase      = C.apiBase      || "/api";
  C.assetsBase   = C.assetsBase   || "assets/ARYAN";
  C.currentPage  = C.currentPage  || (document.location.pathname.split("/").pop() || "index.html");
  C.pages        = C.pages || {
    dashboard:"dashboard.html", doctor:"Doctor.html", report:"report.html",
    profile:"profile.html", services:"Services.html", library:"Library.html",
    insights:"insights.html", settings:"setting.html", login:"login.html",
    calendar:"Calander.html", index:"index.html"
  };

  /* ════════════════════ STATE ════════════════════ */
  var S = {
    open:false, minimized:false, fullscreen:false,
    isDark:false, mode:"normal", theme:"default",
    messages:[], msgCount:0, unread:0, isBotTyping:false,
    activeTag:null, quoteMsg:null,
    pinnedMsgs:[], bookmarks:[], healthData:{water:0,steps:0,mood:null},
    soundOn:true, ttsOn:false, ttsVoice:null,
    isSpeaking:false, isRecording:false, recognition:null,
    audioCtx:null, dragging:false, dragOX:0, dragOY:0,
    placeholderIv:null, searchActive:false, atSuggestOpen:false,
    speed:"fast", fontSize:"medium", nikhLoveLevel:72,
    abortController:null, menuOpen:false, exportOpen:false,
    sessionStart: new Date().toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})
  };

  /* ════════════════════ CONSTANTS & EMOJIS ════════════════════ */
  var SECRET_TAG = "@Yadvi30";
  var SPEED_MAP  = { instant:0, fast:8, normal:18, slow:35 };
  var REACTION_EMOJIS = ["👍","❤️","😂","😮","😢","🔥","🙌","💯"];
  var NIKH_REACTIONS  = ["💕","🌸","✨","💗","😊","🫂","💝","🥺"];
  var FONT_SIZES = { small:"12px", medium:"14px", large:"16px", xlarge:"18px" };

  /* ── Chips ── */
  var DEFAULT_CHIPS = ["🏥 Chest Disease Info","📊 View Reports","👨‍⚕️ Find Doctors","💡 Health Tips","🚨 Emergency Help","/bmi","/breathe"];
  var NIKH_CHIPS = ["/hug 🤗","/love 💕","/song 🎵","/memories 🌸","Batao kya hua? 💕","Aaj kaisa feel ho raha hai?"];

  /* ── Tags ── */
  var PUBLIC_TAGS = ["🏥 Health","🫁 Chest & Lung","💊 Medication","📅 Appointments","🚨 Emergency","🧠 Mental Health","🥗 Nutrition","💪 Fitness"];
  
  var TAG_CHIPS = {
    "🏥 Health": ["What is Tuberculosis?","Chest X-Ray Info","Disease Prevention","Go to Dashboard"],
    "🫁 Chest & Lung": ["TB Symptoms","Pneumonia vs TB","Run X-Ray Analysis","View Reports"],
    "💊 Medication": ["Drug Interactions","TB Treatment","Side Effects","Dosage Help"],
    "📅 Appointments": ["Book Appointment","My Schedule","Go to Calendar","Upcoming Visits"],
    "🚨 Emergency": ["Call 108","First Aid CPR","Chest Pain Help","Emergency Contacts"],
    "🧠 Mental Health": ["/mood","/breathe","/meditate","Stress Relief Tips"],
    "🥗 Nutrition": ["/calories","Immunity Diet","TB Nutrition","Healthy Foods"],
    "💪 Fitness": ["/steps","/bmi","/water","Exercise Tips"]
  };

  /* ── Smart tip suggestions (used for rotating placeholder) ── */
  var SMART_TIPS = [
    {t:"What is tuberculosis?"}, {t:"Explain my chest X-ray report"},
    {t:"Find a specialist in Nagpur"}, {t:"TB treatment duration?"},
    {t:"Try typing /meditate"}, {t:"Calculate my BMI"},
    {t:"Type /water to log water"}, {t:"Book an appointment"},
    {t:"Type @emergency for help"}, {t:"View health insights"}
  ];
  var HEALTH_TIPS = [
    "Drink 8 glasses of water daily for optimal health.",
    "A TB skin test takes only 15 minutes — schedule one today.",
    "30 minutes of walking reduces heart disease risk by 35%.",
    "7-9 hours of sleep boosts immune function by up to 40%.",
    "Eat a rainbow of vegetables for complete micronutrient coverage.",
    "Quitting smoking reduces lung cancer risk by 50% in 10 years.",
    "Never skip antibiotics — incomplete courses cause drug resistance.",
    "5 minutes of deep breathing reduces cortisol by 23%.",
    "Annual checkups catch 70% of preventable conditions early.",
    "Chest X-rays can detect TB with 95%+ sensitivity using AI."
  ];

  /* ── Songs ── */
  var NORMAL_SONGS = [
    {title: "Fix You - Coldplay", lyric: "When you feel so tired but you can't sleep... I will try to fix you."},
    {title: "Rise Up - Andra Day", lyric: "I'll rise up, rise like the day..."},
    {title: "Warrior - Demi Lovato", lyric: "Now I am a warrior. Now I've got thicker skin."},
    {title: "Stronger - Kelly Clarkson", lyric: "What doesn't kill you makes you stronger..."}
  ];
  var NIKH_SONGS = [
    {title: "Tum Hi Ho - Aashiqui 2", lyric: "Tum hi ho... Ab tum hi ho, zindagi ab tum hi ho."},
    {title: "Raabta - Agent Sai Srinivasa", lyric: "Teri aankhon mein rehta hoon main..."},
    {title: "Kabira - YJHD", lyric: "Kabira, mann ja... ek pal mein ho jaaye kitna kuch."},
    {title: "Tera Ban Jaunga - Kabir Singh", lyric: "Tera ban jaunga, chhor de sari duniya..."}
  ];

  /* ── Themes ── */
  var THEMES = {
    default:  {n:"HealthLens",e:"💧",p:"#2563eb",d:"#1d4ed8",a:"#06b6d4"},
    ocean:    {n:"Ocean",e:"🌊",p:"#0891b2",d:"#0e7490",a:"#22d3ee"},
    forest:   {n:"Forest",e:"🌿",p:"#059669",d:"#047857",a:"#34d399"},
    sunset:   {n:"Sunset",e:"🌅",p:"#ea580c",d:"#c2410c",a:"#fb923c"},
    midnight: {n:"Midnight",e:"🌃",p:"#7c3aed",d:"#6d28d9",a:"#a78bfa"},
    rose:     {n:"Rose",e:"🌹",p:"#e11d48",d:"#be123c",a:"#fb7185"}
  };

  /* ── @ Autocomplete ── */
  var AT_SUGG = [
    {tag:"@Yadvi30",  desc:"Activate Nikh special mode 🌸"},
    {tag:"@emergency",desc:"Switch to Emergency mode 🚨"},
    {tag:"@normal",   desc:"Return to normal ARYAN mode"},
    {tag:"@exit",     desc:"Exit special modes"},
    {tag:"@health",   desc:"Ask a health question"},
    {tag:"@report",   desc:"Navigate to Reports page"},
    {tag:"@doctor",   desc:"Navigate to Doctor page"},
    {tag:"@dashboard",desc:"Navigate to Dashboard"}
  ];

  /* ════════════════════ SYSTEM PROMPT ════════════════════ */
  var SYSTEM_PROMPT = `You are ARYAN (Adaptive Responsive Youth AI Navigator), the intelligent AI assistant for HealthLens — an AI-powered healthcare platform focused on automated chest disease detection. Built by Nikhil Rathod (Lead & Founder) and the Manthan Pixel Hub team at JDCOEM, Nagpur.

## YOUR IDENTITY
- Full Name: ARYAN — Adaptive Responsive Youth AI Navigator
- Version: 5.2 | Engine: Gemini 1.5 Flash
- Creators: Nikhil Rathod (Root/Founder), Yadvi (Lead Model Dev), Shefali (Operations/UI), Piyush (Backend)
- Platform: HealthLens — chest disease AI
- Location: JDCOEM, Nagpur, Maharashtra, India

## AVAILABLE ACTIONS
[ACTION:navigate:PAGE] — Navigate to a platform page
[ACTION:theme:dark] — Enable dark mode
[ACTION:theme:light] — Enable light mode

## PERSONALITY
- Normal mode: professional AI health assistant
- Nikh mode (@Yadvi30): warm, playful, emotional, Hindi/English mix
- Emergency mode: calm, clear, action-oriented`;

  /* ════════════════════ PERSISTENCE ════════════════════ */
  function loadSession() {
    try {
      var p = JSON.parse(sessionStorage.getItem("aryan_v5_2") || "{}");
      S.messages     = p.messages     || [];
      S.mode         = p.mode         || "normal";
      S.isDark       = p.dark         || false;
      S.speed        = p.speed        || "fast";
      S.theme        = p.theme        || "default";
      S.pinnedMsgs   = p.pinned       || [];
      S.bookmarks    = p.bookmarks    || [];
      S.healthData   = p.healthData   || {water:0,steps:0,mood:null};
      S.nikhLoveLevel= p.nikhLoveLevel|| 72;
      S.fontSize     = p.fontSize     || "medium";
      S.soundOn      = p.soundOn !== undefined ? p.soundOn : true;
      S.ttsOn        = p.ttsOn        || false;
    } catch (e) {}
  }
  function saveSession() {
    try {
      sessionStorage.setItem("aryan_v5_2", JSON.stringify({
        messages:   S.messages.slice(-60), mode:S.mode,
        dark:S.isDark, speed:S.speed, theme:S.theme, pinned:S.pinnedMsgs,
        bookmarks:S.bookmarks, healthData:S.healthData, nikhLoveLevel:S.nikhLoveLevel,
        fontSize:S.fontSize, soundOn:S.soundOn, ttsOn:S.ttsOn
      }));
    } catch (e) {}
  }

  /* ════════════════════ HELPERS ════════════════════ */
  function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function ts()   { return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}); }
  function el(id) { return document.getElementById(id); }
  function scrollBottom() { var b=el("aryan-body"); if(b) b.scrollTop=b.scrollHeight; checkScrollBtn(); }
  function checkScrollBtn() {
    var b=el("aryan-body"),btn=el("aryan-scroll-btn"); if(!b||!btn) return;
    btn.classList.toggle("visible", b.scrollHeight-b.scrollTop-b.clientHeight > 80);
  }

  function md(text) {
    var s = esc(text);
    s = s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
    s = s.replace(/\*(.+?)\*/g,"<em>$1</em>");
    s = s.replace(/`([^`]+)`/g,"<code>$1</code>");
    s = s.replace(/^[-•]\s(.+)$/gm,"<li>$1</li>");
    s = s.replace(/^\d+\.\s(.+)$/gm,"<li>$1</li>");
    s = s.replace(/(<li>.*<\/li>)/gs,"<ul>$1</ul>");
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s;
  }

  /* ════════════════════ GLOBAL SAFE FUNCTIONS ════════════════════ */
  window.aryanCalcBMI = function(id) {
    var h=parseFloat(document.getElementById("bh-"+id).value);
    var w=parseFloat(document.getElementById("bw-"+id).value);
    if(!h||!w)return;
    var bmi=w/((h/100)*(h/100));
    var cat=bmi<18.5?"Underweight":bmi<25?"Normal":bmi<30?"Overweight":"Obese";
    var col=bmi<18.5?"#06b6d4":bmi<25?"#10b981":bmi<30?"#f59e0b":"#ef4444";
    var pct=Math.min(100,((bmi-10)/30*100));
    var resId = "br-"+id;
    document.getElementById(resId).innerHTML='<div class="aryan-bmi-result"><div class="aryan-bmi-val" style="color:'+col+'">'+bmi.toFixed(1)+'</div><div class="aryan-bmi-label" style="color:'+col+'">'+cat+'</div><div class="aryan-bmi-bar"><div class="aryan-bmi-fill" style="width:'+pct+'%;background:'+col+'"></div></div><div style="font-size:11px;color:var(--ar-text3);margin-top:4px">Healthy: 18.5–24.9</div></div>';
  };
  window.aryanAddWater = function() {
    S.healthData.water = (S.healthData.water||0)+1; 
    var element = document.getElementById("aryan-water-val");
    if(element) element.textContent=S.healthData.water;
    saveSession();
  };
  window.aryanCalcSteps = function(id) {
    var s=parseInt(document.getElementById(id).value)||0;
    var pct=Math.min(100,(s/10000*100)).toFixed(0);
    var cal=Math.round(s*0.04);
    var col=s>=10000?"#10b981":"var(--ar-primary)";
    document.getElementById(id+"-r").innerHTML='<div class="aryan-bmi-result"><div class="aryan-bmi-val" style="color:'+col+'">'+s.toLocaleString()+'</div><div class="aryan-bmi-label">of 10,000 goal ('+pct+'%)</div><div class="aryan-bmi-bar"><div class="aryan-bmi-fill" style="width:'+pct+'%;background:'+col+'"></div></div><div style="font-size:11px;color:var(--ar-text3);margin-top:4px">≈ '+cal+' calories burned</div></div>';
  };
  window.aryanSetMood = function(btn) {
    document.querySelectorAll(".aryan-mood-btn").forEach(function(b){b.style.opacity="0.4";});
    btn.style.opacity="1"; btn.style.transform="scale(1.15)"; btn.style.borderColor="var(--ar-primary)";
  };
  window.aryanStartBreathe = function(id) {
    var c=document.getElementById(id); var l=document.getElementById(id+"-l");
    var phases=[{t:"Inhale",d:4},{t:"Hold",d:7},{t:"Exhale",d:8}];
    var pi=0,countdown=0,iv;
    function run(){
      var ph=phases[pi%3]; c.textContent=ph.t; c.className="aryan-breathe-circle "+["expanding","holding","contracting"][pi%3];
      countdown=ph.d;
      iv=setInterval(function(){
        l.textContent=ph.t+": "+countdown+"s"; countdown--;
        if(countdown<0){clearInterval(iv);pi++;if(pi<9)run();else{c.textContent="Done ✓";l.textContent="Great job!";}}
      },1000);
    }
    run();
  };
  window.aryanStartMeditate = function(id, mins) {
    var rem=mins*60;
    var iv=setInterval(function(){
      rem--;
      if(rem<=0){clearInterval(iv);document.getElementById(id+"-d").textContent="Done! 🙏";document.getElementById(id+"-s").textContent="Session complete!";return;}
      var m=Math.floor(rem/60); var s=rem%60;
      document.getElementById(id+"-d").textContent=String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
    },1000);
    document.getElementById(id+"-s").textContent="Timer running...";
  };
  window.aryanCalcTDEE = function(id) {
    var a=parseFloat(document.getElementById("ca-"+id).value);
    var g=document.getElementById("cg-"+id).value;
    var w=parseFloat(document.getElementById("cw-"+id).value);
    var h=parseFloat(document.getElementById("ch-"+id).value);
    var ac=parseFloat(document.getElementById("cac-"+id).value);
    if(!a||!w||!h)return;
    var bmr=g==="M"?88.36+13.4*w+4.8*h-5.7*a:447.6+9.2*w+3.1*h-4.3*a;
    var tdee=Math.round(bmr*ac);
    document.getElementById("cr-"+id).innerHTML='<div class="aryan-cal-result"><div class="aryan-cal-val">'+tdee+'</div><div class="aryan-cal-label">kcal/day to maintain</div><div class="aryan-cal-goals"><div class="aryan-cal-goal"><div class="aryan-cal-goal-val">'+(tdee-500)+'</div><div class="aryan-cal-goal-label">Weight Loss</div></div><div class="aryan-cal-goal"><div class="aryan-cal-goal-val">'+tdee+'</div><div class="aryan-cal-goal-label">Maintain</div></div><div class="aryan-cal-goal"><div class="aryan-cal-goal-val">'+(tdee+300)+'</div><div class="aryan-cal-goal-label">Muscle Gain</div></div></div></div>';
  };
  window.aryanSetReminder = function(id) {
    var msg=document.getElementById("rm-"+id).value;
    var mins=parseInt(document.getElementById("rmin-"+id).value)||5;
    if(!msg)return;
    setTimeout(function(){
      if(typeof Notification!=="undefined"&&Notification.permission==="granted"){new Notification("ARYAN Reminder",{body:msg});}
      else{alert("⏰ "+msg);}
    },mins*60000);
    document.getElementById("rres-"+id).textContent="✅ Reminder set for "+mins+" min!";
    if(Notification&&Notification.permission==="default")Notification.requestPermission();
  };

  /* ════════════════════ ROTATING PLACEHOLDER ════════════════════ */
  function initPlaceholderRotation() {
    var inp = el("aryan-input");
    if (!inp) return;
    var idx = 0;
    if (S.placeholderIv) clearInterval(S.placeholderIv);
    S.placeholderIv = setInterval(function() {
      if (S.isBotTyping || inp.value.trim().length > 0 || document.activeElement === inp) return;
      inp.classList.add("placeholder-fade");
      setTimeout(function() {
        var isNikh = S.mode === "nikh";
        var arr = isNikh 
          ? ["Batao kya hua… 💕", "Type /hug 🌸", "Main sun rahi hoon 💗", "Type /song 🎵"] 
          : SMART_TIPS.map(function(t) { return "Try: " + t.t; });
        idx = (idx + 1) % arr.length;
        inp.placeholder = arr[idx];
        inp.classList.remove("placeholder-fade");
      }, 300);
    }, 4000);
  }

  /* ════════════════════ SETTINGS, MENU & ACCORDION FIXES ════════════════════ */
  function initAccordion() {
    // Accordion
    document.querySelectorAll('.drawer-section-head').forEach(function(head) {
      head.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevents bubbling issues
        var section = head.parentElement;
        section.classList.toggle('open');
      });
    });
  }

  function toggleDrawer() {
    var drw = el("aryan-drawer"), ovl = el("aryan-drawer-overlay");
    if(!drw) return;
    var isOpen = drw.classList.contains("open");
    if(isOpen){
      drw.classList.remove("open"); if(ovl) ovl.classList.remove("open");
    } else {
      drw.classList.add("open"); if(ovl) ovl.classList.add("open");
      buildDrawerSwatches(); syncDrawerToggles();
    }
  }
  function closeDrawer() {
    var drw = el("aryan-drawer"), ovl = el("aryan-drawer-overlay");
    if(drw) drw.classList.remove("open");
    if(ovl) ovl.classList.remove("open");
  }
  function toggleMainMenu() {
    var dd = el("aryan-header-dropdown"); if (!dd) return;
    var isShown = dd.classList.contains("show");
    dd.classList.toggle("show", !isShown);
    S.menuOpen = !isShown;
  }
  function closeMainMenu() {
    var dd = el("aryan-header-dropdown"); if (dd) dd.classList.remove("show");
    S.menuOpen = false;
  }

  /* ════════════════════ NETWORK CONNECTION BANNERS ════════════════════ */
  function initNetworkListeners() {
    window.addEventListener('offline', function() {
      var offBar = el("aryan-offline-bar");
      if(offBar) offBar.classList.remove("aryan-hidden");
    });
    window.addEventListener('online', function() {
      var offBar = el("aryan-offline-bar");
      if(offBar) offBar.classList.add("aryan-hidden");
      
      var onBar = el("aryan-back-online-bar");
      if(onBar) {
        onBar.classList.remove("aryan-hidden");
        // Disappear exactly after 5s
        setTimeout(function(){
          onBar.classList.add("aryan-hidden");
        }, 5000);
      }
    });
  }

  /* ════════════════════ THEMES ════════════════════ */
  function applyTheme() {
    var win = el("aryan-window"); if (!win) return;
    win.classList.toggle("aryan-dark",      S.isDark && S.mode !== "nikh");
    win.classList.toggle("aryan-nikh",      S.mode === "nikh");
    win.classList.toggle("aryan-emergency", S.mode === "emergency");
    if (S.mode !== "nikh" && S.mode !== "emergency") applyColorTheme(S.theme);
    syncDrawerToggles();
  }
  function applyColorTheme(key) {
    var t = THEMES[key] || THEMES.default;
    var win = el("aryan-window"); if (!win) return;
    Object.keys(THEMES).forEach(function(k){ win.classList.remove("aryan-theme-"+k); });
    if (key !== "default") win.classList.add("aryan-theme-"+key);
    win.style.setProperty("--ar-primary",      t.p);
    win.style.setProperty("--ar-primary-dark", t.d);
    win.style.setProperty("--ar-accent",       t.a);
    S.theme = key; buildDrawerSwatches(); saveSession();
  }
  function applyFontSize(size) {
    S.fontSize = size;
    var win = el("aryan-window"); if (!win) return;
    win.style.setProperty("--ar-font-size", FONT_SIZES[size] || "14px");
    saveSession();
  }
  function buildDrawerSwatches() {
    var c = el("aryan-theme-swatches"); if (!c) return; c.innerHTML = "";
    Object.keys(THEMES).forEach(function(key) {
      var t = THEMES[key];
      var sw = document.createElement("div"); sw.className = "drawer-swatch";
      if (S.theme === key) sw.classList.add("active");
      sw.innerHTML = t.e; 
      sw.style.display = "flex"; sw.style.alignItems = "center"; sw.style.justifyContent = "center"; sw.style.color = "#fff";
      sw.title = t.n;
      sw.style.background = "linear-gradient(135deg,"+t.p+","+t.d+")";
      sw.dataset.theme = key;
      sw.addEventListener("click", function(){ applyColorTheme(key); closeDrawer(); });
      c.appendChild(sw);
    });
  }
  function syncDrawerToggles() {
    var dt = el("aryan-dark-toggle"); if (dt) dt.checked = S.isDark;
    var st = el("aryan-sound-toggle"); if (st) st.checked = S.soundOn;
    var tt = el("aryan-tts-toggle"); if (tt) tt.checked = S.ttsOn;
    var fs = el("aryan-font-select"); if (fs) fs.value = S.fontSize || "medium";
    document.querySelectorAll(".drawer-speed-btn").forEach(function(b){
      b.classList.toggle("active", b.dataset.speed === S.speed);
    });
  }

  /* ════════════════════ INFINITE TRAIN (MARQUEE) RENDERING ════════════════════ */
  function renderTrain(id, items, isTag) {
    var container = el(id); if(!container) return;
    container.innerHTML = "";
    if(!items.length) return;
    
    var wrap = document.createElement("div"); wrap.className = "aryan-train-container";
    var track = document.createElement("div"); track.className = "aryan-train-track";
    
    // Duplicate arrays to ensure the infinite scroll fills the screen properly
    var loopItems = items.concat(items).concat(items);
    
    loopItems.forEach(function(item) {
      var btn = document.createElement("button");
      btn.className = isTag ? "aryan-tag" : "aryan-chip";
      if(isTag && item === S.activeTag) btn.classList.add("tag-active");
      btn.innerHTML = item; // Using innerHTML handles the native emojis perfectly
      
      btn.onclick = function() {
        if (isTag) {
          handleTag(item, item.replace(/<[^>]*>?/gm, "").trim());
        } else {
          var cmd = item.includes(" ") ? item.split(" ")[0] : item;
          sendMessage(cmd);
        }
      };
      track.appendChild(btn);
    });
    
    wrap.appendChild(track);
    container.appendChild(wrap);
  }

  function handleTag(fullTag, cleanTag) {
    S.activeTag = S.activeTag === fullTag ? null : fullTag;
    renderTrain("aryan-tags", PUBLIC_TAGS, true); 
    renderTrain("aryan-chips", S.activeTag ? TAG_CHIPS[fullTag]||[] : DEFAULT_CHIPS, false);
    if(S.activeTag) sendMessage(cleanTag);
  }

  /* ════════════════════ MODE (EXIT FIX & EMOJIS) ════════════════════ */
  function setMode(mode) {
    S.mode = mode; applyTheme();
    var nameEl=el("aryan-name"), statusEl=el("aryan-status"), avEl=el("aryan-avatar"), inp=el("aryan-input");
    if (mode === "nikh") {
      if (nameEl) nameEl.textContent = "Nikh 💕";
      if (statusEl) statusEl.textContent = "Online · Special Mode 🌸";
      if (avEl) avEl.innerHTML = '🌸<div class="aryan-online-dot"></div>';
      renderTrain("aryan-tags", [], true); renderTrain("aryan-chips", NIKH_CHIPS, false);
      if(inp) inp.placeholder = "Batao kya hua… ya /hug type karo 💕";
    } else if (mode === "emergency") {
      if (nameEl) nameEl.textContent = "⚠️ EMERGENCY";
      if (statusEl) statusEl.textContent = "Online · Call 108 / 112 NOW";
      if (avEl) avEl.innerHTML = '🚨<div class="aryan-online-dot" style="background:#ef4444"></div>';
      renderTrain("aryan-tags", PUBLIC_TAGS, true); renderTrain("aryan-chips", [], false);
      if(inp) inp.placeholder = "Describe your emergency…";
    } else {
      if (nameEl) nameEl.textContent = "ARYAN";
      if (statusEl) statusEl.textContent = "Online · HealthLens AI";
      if (avEl) avEl.innerHTML = '🤖<div class="aryan-online-dot"></div>';
      renderTrain("aryan-tags", PUBLIC_TAGS, true); renderTrain("aryan-chips", DEFAULT_CHIPS, false);
      if(inp) inp.placeholder = "Ask ARYAN anything, type / for commands…";
    }
    
    // Ensure emergency banner hides when leaving mode
    var eBanner = el("aryan-emergency-bar");
    if(eBanner) {
      if(mode === "emergency") eBanner.classList.remove("aryan-hidden");
      else eBanner.classList.add("aryan-hidden");
    }
    
    saveSession(); initPlaceholderRotation();
  }

  /* ════════════════════ MESSAGES ════════════════════ */
  function addSysMsg(text) {
    var b=el("aryan-body"); if(!b) return;
    var d=document.createElement("div"); d.className="aryan-system-msg"; d.innerHTML=text;
    b.appendChild(d); scrollBottom();
  }

  function addMsg(role, text, opts) {
    opts = opts || {};
    var tv = ts(); S.messages.push({role:role==="user"?"user":"assistant",content:text,ts:tv});
    S.msgCount++;
    var id = "aryan-msg-"+S.msgCount;
    var b = el("aryan-body"); if (!b) return null;
    var row = document.createElement("div");
    row.className = "aryan-row "+(role==="user"?"user":"bot"); row.id = id;
    var avHTML = role !== "user" ? '<div class="aryan-mini-av">'+(S.mode==="nikh"?"🌸":'🤖')+'</div>' : "";
    var bId = id+"-b", rId = id+"-r";
    var quoteHTML = "";
    if (opts.quote) quoteHTML = '<div class="aryan-quote"><div class="aryan-quote-author">'+(opts.quote.role==="user"?"You":"ARYAN")+'</div><div class="aryan-quote-text">'+esc(opts.quote.text.slice(0,120))+'</div></div>';
    
    var actHTML = '<div class="aryan-msg-actions">'+
      '<button class="aryan-act-btn" data-action="copy" title="Copy">📋</button>'+
      '<button class="aryan-act-btn" data-action="reply" title="Reply">↩️</button>'+
      '<button class="aryan-act-btn" data-action="pin" title="Pin">📌</button>'+
      '<button class="aryan-act-btn" data-action="bookmark" title="Bookmark">⭐</button>'+
      '<button class="aryan-act-btn" data-action="speak" title="Read aloud">🔊</button>'+
      '<button class="aryan-act-btn" data-action="delete" title="Delete">🗑️</button>'+
    '</div>';
    
    var displayText = opts.html || (role==="user" ? esc(text) : md(text));
    row.innerHTML = avHTML+actHTML+
      '<div class="aryan-bubble-wrap">'+quoteHTML+
        '<div class="aryan-bubble" id="'+bId+'">'+displayText+'</div>'+
        '<div class="aryan-bubble-meta"><span class="aryan-ts">'+tv+'</span><div class="aryan-reactions" id="'+rId+'"></div><button class="aryan-add-reaction" title="React">+😊</button></div>'+
      '</div>';
    b.appendChild(row);
    row.querySelectorAll(".aryan-act-btn").forEach(function(btn){
      btn.addEventListener("click",function(e){e.stopPropagation();handleMsgAction(btn.dataset.action,id,text,row);});
    });
    var addBtn = row.querySelector(".aryan-add-reaction");
    if (addBtn) addBtn.addEventListener("click",function(e){e.stopPropagation();showReactionPicker(rId,addBtn);});
    scrollBottom(); saveSession();
    return {row:row,bId:bId};
  }

  function parseActions(text) {
    var actions=[]; var re=/\[ACTION:([^\]]+)\]/g; var m;
    while((m=re.exec(text))!==null){var p=m[1].split(":");actions.push({type:p[0],target:p[1],value:p[2]});}
    return actions;
  }
  function stripActions(text) { return text.replace(/\[ACTION:[^\]]+\]/g,"").trim(); }
  function executeActions(actions) { actions.forEach(function(a){setTimeout(function(){executeAction(a);},700);}); }
  function executeAction(action) {
    if (action.type === "navigate") {
      var page = C.pages[action.target] || action.target;
      if (!page) return;
      var bar = document.createElement("div"); bar.className = "aryan-action-bar";
      Object.assign(bar.style,{background:"var(--ar-bg3)",borderBottom:"1px solid var(--ar-border2)",padding:"5px 14px",fontSize:"11.5px",fontWeight:"600",color:"var(--ar-primary)",display:"flex",alignItems:"center",gap:"6px",flexShrink:"0",animation:"msg-in 0.3s ease"});
      bar.innerHTML = '<span>⚡</span><span>Navigating to '+esc(action.target)+'…</span>';
      var win = el("aryan-window");
      if (win) win.insertBefore(bar, el("aryan-body"));
      setTimeout(function(){if(bar.parentNode)bar.remove(); window.location.href = page;}, 2200);
    } else if (action.type === "theme") {
      if (action.target === "dark") { S.isDark = true; applyTheme(); addSysMsg('🌙 Dark mode activated'); }
      else { S.isDark = false; applyTheme(); addSysMsg('☀️ Light mode activated'); }
    }
  }

  function handleMsgAction(action, msgId, text, row) {
    if (action==="copy") { navigator.clipboard && navigator.clipboard.writeText(text).then(function(){addSysMsg('✅ Copied!');});}
    else if (action==="reply") { 
      var bubble = row.querySelector(".aryan-bubble");
      var bubText = text;
      if (bubble) {
        var clone = bubble.cloneNode(true);
        var innerQuote = clone.querySelector(".aryan-quote");
        if(innerQuote) innerQuote.remove(); 
        bubText = clone.innerText || clone.textContent;
      }
      var isUser = row.classList.contains("user");
      S.quoteMsg = { text: bubText.trim().slice(0,100), role: isUser ? "user" : "assistant" }; 
      showQuotePreview(); 
    }
    else if (action==="pin") { pinMessage(msgId,text); }
    else if (action==="bookmark") { toggleBookmark(msgId,row); }
    else if (action==="speak") { speak(text); }
    else if (action==="delete") { row.style.opacity="0"; setTimeout(function(){if(row.parentNode)row.remove();},200); }
  }

  /* ════════════════════ PIN & BOOKMARK ════════════════════ */
  function pinMessage(id, text) {
    if (S.pinnedMsgs.find(function(p){return p.id===id;})) { addSysMsg("Already pinned!"); return; }
    S.pinnedMsgs.push({id:id,text:text.slice(0,80)}); renderPinned(); saveSession(); addSysMsg('📌 Pinned!'); playSound("pin");
  }
  function renderPinned() {
    var area=el("aryan-pinned"), inner=el("aryan-pinned-inner"); if(!area||!inner) return;
    inner.innerHTML = "";
    S.pinnedMsgs.forEach(function(p){
      var item=document.createElement("div"); item.className="aryan-pin-item";
      item.innerHTML='<span class="aryan-pin-icon">📌</span><span class="aryan-pin-text">'+esc(p.text)+'</span><button class="aryan-pin-del" data-id="'+p.id+'">✕</button>';
      item.querySelector(".aryan-pin-del").addEventListener("click",function(){S.pinnedMsgs=S.pinnedMsgs.filter(function(x){return x.id!==p.id;});renderPinned();saveSession();});
      inner.appendChild(item);
    });
    area.classList.toggle("has-pins", S.pinnedMsgs.length > 0);
  }
  function toggleBookmark(msgId, row) {
    var idx=S.bookmarks.indexOf(msgId), bub=row.querySelector(".aryan-bubble");
    if(idx>-1){S.bookmarks.splice(idx,1); if(bub) bub.classList.remove("bookmarked"); addSysMsg("Bookmark removed");}
    else{S.bookmarks.push(msgId); if(bub) bub.classList.add("bookmarked"); addSysMsg('⭐ Bookmarked!'); playSound("success");}
    saveSession();
  }

  /* ════════════════════ QUOTE ════════════════════ */
  function showQuotePreview() {
    var qp=el("aryan-quote-preview"), txt=el("aryan-qp-text"), auth=el("aryan-qp-author"); 
    if(!qp||!txt||!auth||!S.quoteMsg) return;
    auth.textContent = S.quoteMsg.role === "user" ? "Replying to You" : "Replying to ARYAN";
    txt.textContent=S.quoteMsg.text; 
    qp.classList.add("visible"); 
    var inp=el("aryan-input"); if(inp) inp.focus();
  }
  function clearQuote() { S.quoteMsg=null; var qp=el("aryan-quote-preview"); if(qp) qp.classList.remove("visible"); }

  /* ════════════════════ REACTIONS ════════════════════ */
  function showReactionPicker(rId, anchor) {
    var ex=document.getElementById("aryan-rpicker"); if(ex) ex.remove();
    var picker=document.createElement("div"); picker.id="aryan-rpicker";
    Object.assign(picker.style,{position:"fixed",background:"var(--ar-bg)",border:"1px solid var(--ar-border)",borderRadius:"20px",padding:"6px 10px",display:"flex",gap:"6px",boxShadow:"var(--ar-shadow-md)",zIndex:"9999999",fontSize:"18px",alignItems:"center"});
    var rect=anchor.getBoundingClientRect();
    picker.style.top=(rect.top-48)+"px"; picker.style.left=Math.max(8,rect.left-60)+"px";
    var emojis = S.mode==="nikh" ? NIKH_REACTIONS : REACTION_EMOJIS;
    emojis.forEach(function(emoji){
      var btn=document.createElement("button"); btn.textContent=emoji;
      Object.assign(btn.style,{border:"none",background:"none",cursor:"pointer",fontSize:"18px",padding:"2px 3px",borderRadius:"8px",transition:"transform 0.15s"});
      btn.onmouseenter=function(){btn.style.transform="scale(1.35)";}; btn.onmouseleave=function(){btn.style.transform="";};
      btn.onclick=function(){addReaction(rId,emoji);picker.remove();};
      picker.appendChild(btn);
    });
    document.body.appendChild(picker);
    setTimeout(function(){document.addEventListener("click",function h(){picker.remove();document.removeEventListener("click",h);});},10);
  }
  function addReaction(rId, emoji) {
    var c=document.getElementById(rId); if(!c) return;
    var ex=c.querySelector('[data-emoji="'+emoji+'"]');
    if(ex){var n=parseInt(ex.dataset.count||"1",10)+1;ex.dataset.count=n;ex.innerHTML="<span>"+emoji+"</span> <span>"+n+"</span>";ex.classList.add("reacted");}
    else{var btn=document.createElement("button");btn.className="aryan-reaction-btn reacted";btn.dataset.emoji=emoji;btn.dataset.count="1";btn.innerHTML="<span>"+emoji+"</span> <span>"+1+"</span>";btn.onclick=function(){var n2=parseInt(btn.dataset.count||"1",10)+1;btn.dataset.count=n2;btn.innerHTML="<span>"+emoji+"</span> <span>"+n2+"</span>";};c.appendChild(btn);}
    playSound("pop");
  }

  /* ════════════════════ TYPING INDICATOR ════════════════════ */
  function addStreamRow() {
    var b=el("aryan-body"); if(!b) return null;
    var id="aryan-stream-"+Date.now();
    var row=document.createElement("div"); row.className="aryan-row bot"; row.id=id;
    row.innerHTML='<div class="aryan-mini-av">'+(S.mode==="nikh"?"🌸":'🤖')+'</div><div class="aryan-bubble-wrap"><div class="aryan-bubble" id="'+id+'-b"></div></div>';
    b.appendChild(row); scrollBottom();
    return {rowId:id, bubId:id+"-b"};
  }
  function showTyping() {
    var b=el("aryan-body"); if(!b||S.isBotTyping) return; S.isBotTyping=true;
    var row=document.createElement("div"); row.className="aryan-typing-row"; row.id="aryan-typing";
    row.innerHTML='<div class="aryan-mini-av">'+(S.mode==="nikh"?"🌸":'🤖')+'</div><div class="aryan-typing-bubble"><div class="aryan-dot"></div><div class="aryan-dot"></div><div class="aryan-dot"></div></div>';
    b.appendChild(row); scrollBottom();
  }
  function hideTyping() { S.isBotTyping=false; var t=el("aryan-typing"); if(t) t.remove(); }

  /* ════════════════════ @ AUTOCOMPLETE ════════════════════ */
  function initAtSuggest() {
    var inp=el("aryan-input"); if(!inp) return;
    inp.addEventListener("input", onInputChange);
    inp.addEventListener("keydown", function(e){
      var suggest=el("aryan-at-suggest"); if(!S.atSuggestOpen||!suggest) return;
      var items=suggest.querySelectorAll(".aryan-at-item");
      var focused=suggest.querySelector(".aryan-at-item.focused");
      var idx=Array.from(items).indexOf(focused);
      if(e.key==="ArrowDown"){e.preventDefault();if(idx<items.length-1){if(focused)focused.classList.remove("focused");items[idx+1].classList.add("focused");}}
      else if(e.key==="ArrowUp"){e.preventDefault();if(idx>0){if(focused)focused.classList.remove("focused");items[idx-1].classList.add("focused");}}
      else if(e.key==="Enter"||e.key==="Tab"){if(focused){e.preventDefault();selectAtSuggest(focused.dataset.tag);}}
      else if(e.key==="Escape") closeAtSuggest();
    });
  }
  function onInputChange() {
    var inp=el("aryan-input"); if(!inp) return;
    autoResize(inp); updateCharCount(inp);
    var val=inp.value, atIdx=val.lastIndexOf("@");
    if(atIdx>=0){
      var afterAt=val.slice(atIdx+1);
      if(!afterAt.includes(" ")){
        var matches=AT_SUGG.filter(function(s){return s.tag.toLowerCase().includes(("@"+afterAt).toLowerCase());});
        if(matches.length){renderAtSuggest(matches);return;}
      }
    }
    var slashIdx=val.lastIndexOf("/");
    if(slashIdx>=0&&!val.slice(slashIdx).includes(" ")){
      var afterSlash=val.slice(slashIdx);
      var slashCmds=["/bmi","/water","/steps","/mood","/tip","/reminder","/breathe","/meditate","/calories","/hug","/song","/stats","/search","/love","/help","/clear","/dark","/light","/emergency","/doctors"];
      var slashMatches=slashCmds.filter(function(c){return c.startsWith(afterSlash);});
      if(slashMatches.length){renderSlashSuggest(slashMatches);return;}
    }
    closeAtSuggest();
  }
  function renderAtSuggest(matches) {
    var s=el("aryan-at-suggest"); if(!s) return; s.innerHTML="";
    matches.forEach(function(sg){
      var item=document.createElement("div"); item.className="aryan-at-item"; item.dataset.tag=sg.tag;
      item.innerHTML='<span class="aryan-at-tag">'+esc(sg.tag)+'</span><span class="aryan-at-desc">'+esc(sg.desc)+'</span>';
      item.addEventListener("click",function(){selectAtSuggest(sg.tag);}); s.appendChild(item);
    });
    s.classList.add("open"); S.atSuggestOpen=true;
  }
  function renderSlashSuggest(cmds) {
    var s=el("aryan-at-suggest"); if(!s) return; s.innerHTML="";
    cmds.slice(0,6).forEach(function(cmd){
      var item=document.createElement("div"); item.className="aryan-at-item"; item.dataset.tag=cmd;
      item.innerHTML='<span class="aryan-at-tag">'+esc(cmd)+'</span>';
      item.addEventListener("click",function(){selectAtSuggest(cmd);}); s.appendChild(item);
    });
    s.classList.add("open"); S.atSuggestOpen=true;
  }
  function selectAtSuggest(tag) {
    var inp=el("aryan-input"); if(!inp) return;
    var val=inp.value, lastAt=val.lastIndexOf("@"), lastSlash=val.lastIndexOf("/");
    var start=Math.max(lastAt,lastSlash);
    if(start>=0) inp.value=val.slice(0,start)+tag+" ";
    autoResize(inp); updateCharCount(inp); inp.focus(); closeAtSuggest();
  }
  function closeAtSuggest() { var s=el("aryan-at-suggest"); if(s) s.classList.remove("open"); S.atSuggestOpen=false; }

  /* ════════════════════ GEMINI API ════════════════════ */
  function callGemini(userMsg, callback) {
    var history = S.messages.slice(-24).filter(function(m){return m.content&&m.content.trim();});
    callGeminiWithRetry(history, callback, 0);
  }

  function callGeminiWithRetry(history, callback, attempt) {
    var apiKey = C.geminiApiKey;
    var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + apiKey;
    var contents = [];
    history.forEach(function(m){
      var role = m.role==="user" ? "user" : "model";
      if(contents.length>0 && contents[contents.length-1].role===role)
        contents[contents.length-1].parts[0].text += "\n"+m.content;
      else contents.push({role:role, parts:[{text:m.content}]});
    });
    if(!contents.length || contents[contents.length-1].role!=="user") {
      callback(new Error("Bad history"),"Please send a message first."); return;
    }
    var controller = new AbortController();
    S.abortController = controller;
    fetch(url, {
      method:"POST", signal:controller.signal,
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        systemInstruction:{parts:[{text:SYSTEM_PROMPT}]}, 
        contents:contents,
        generationConfig:{temperature:0.72,topK:40,topP:0.95,maxOutputTokens:1024}
      })
    })
    .then(function(r){
      S.abortController=null;
      if(!r.ok) {
        return r.json().then(function(d){
          throw new Error(d.error && d.error.message ? d.error.message : "API " + r.status);
        }).catch(function(fallbackErr){
           throw new Error("API " + r.status); 
        });
      }
      return r.json();
    })
    .then(function(d){
      if(d.candidates&&d.candidates[0]&&d.candidates[0].content){
        callback(null, d.candidates[0].content.parts.map(function(p){return p.text;}).join(""));
      } else {
        callback(null,"I received an empty response. Please try again.");
      }
    })
    .catch(function(e){
      S.abortController=null;
      if(e.name==="AbortError") return;
      console.error("ALIA DEBUG - GEMINI API ERROR:", e);
      callback(e,'⚠️ **API Error:** ' + e.message + '\n\n*(Press F12 and check the Console for more details)*');
    });
  }

  /* ════════════════════ DISPLAY BOT RESPONSE ════════════════════ */
  function displayBot(fullText, quoteOpts) {
    var m = fullText.match(/^\[STICKER:([\w\s\-]+)\]([\s\S]*)/);
    var cleanText=fullText;
    if(m){cleanText=m[2].trim();}
    var actions=parseActions(cleanText); cleanText=stripActions(cleanText);
    
    if(fullText.toLowerCase().includes("celebrate")) launchConfetti();
    if(fullText.toLowerCase().includes("emergency")) setMode("emergency");
    
    if(S.speed==="instant"){
      addMsg("assistant",cleanText,{quote:quoteOpts}); speak(cleanText); playSound("receive");
      if(actions.length){ executeActions(actions); }
    } else {
      typewriterMsg(cleanText, quoteOpts, function(){
        speak(cleanText); saveSession();
        if(actions.length){ executeActions(actions); }
      });
      playSound("receive");
    }
  }

  function typewriterMsg(text, quoteOpts, onDone) {
    var stream=addStreamRow(); if(!stream){onDone&&onDone();return;}
    var bub=el(stream.bubId); if(!bub){onDone&&onDone();return;}
    if(quoteOpts){
      var bw=el(stream.rowId)&&el(stream.rowId).querySelector(".aryan-bubble-wrap");
      if(bw){var qDiv=document.createElement("div");qDiv.className="aryan-quote";qDiv.innerHTML='<div class="aryan-quote-author">'+(quoteOpts.role==="user"?"You":"ARYAN")+'</div><div class="aryan-quote-text">'+esc(quoteOpts.text)+'</div>';bw.insertBefore(qDiv,bub);}
    }
    S.messages.push({role:"assistant",content:text,ts:ts()});
    var delay=SPEED_MAP[S.speed]||12, i=0, chars=Array.from(text);
    function tick(){
      if(S.speed==="instant"){bub.innerHTML=md(text);finishStream(stream,text);onDone&&onDone();return;}
      if(i<chars.length){i++;bub.innerHTML=md(chars.slice(0,i).join(""));scrollBottom();setTimeout(tick,delay);}
      else{finishStream(stream,text);onDone&&onDone();}
    }
    tick();
  }
  function finishStream(stream, text) {
    var row=el(stream.rowId); if(!row) return;
    var bwrap=row.querySelector(".aryan-bubble-wrap");
    if(bwrap){
      var rId=stream.rowId+"-r";
      var meta=document.createElement("div"); meta.className="aryan-bubble-meta";
      meta.innerHTML='<span class="aryan-ts">'+ts()+'</span><div class="aryan-reactions" id="'+rId+'"></div><button class="aryan-add-reaction" title="React">+😊</button>';
      bwrap.appendChild(meta);
      var addBtn=meta.querySelector(".aryan-add-reaction");
      if(addBtn) addBtn.addEventListener("click",function(e){e.stopPropagation();showReactionPicker(rId,addBtn);});
      var actDiv=document.createElement("div"); actDiv.className="aryan-msg-actions";
      actDiv.innerHTML='<button class="aryan-act-btn" data-action="copy" title="Copy">📋</button><button class="aryan-act-btn" data-action="reply" title="Reply">↩️</button><button class="aryan-act-btn" data-action="pin" title="Pin">📌</button><button class="aryan-act-btn" data-action="bookmark" title="Bookmark">⭐</button><button class="aryan-act-btn" data-action="speak" title="Read aloud">🔊</button><button class="aryan-act-btn" data-action="delete" title="Delete">🗑️</button>';
      row.insertBefore(actDiv,bwrap);
      actDiv.querySelectorAll(".aryan-act-btn").forEach(function(b){b.addEventListener("click",function(e){e.stopPropagation();handleMsgAction(b.dataset.action,stream.rowId,text,row);});});
    }
  }
  function addCardToChat(html) {
    var b=el("aryan-body"); if(!b) return;
    var w=document.createElement("div"); w.style.cssText="max-width:calc(100% - 30px);margin-left:36px;";
    w.innerHTML=html; b.appendChild(w); scrollBottom();
  }

  /* ════════════════════ SEND ════════════════════ */
  function sendMessage(text) {
    var txt=(text||"").trim();
    if(!txt||S.isBotTyping) return;
    if(txt.length>2000) txt=txt.slice(0,2000);
    var inp=el("aryan-input");
    if(inp&&inp.value.trim()===txt){inp.value="";autoResize(inp);updateCharCount(inp);}
    closeAtSuggest();
    var quote=S.quoteMsg; clearQuote();
    addMsg("user",txt,{quote:quote});
    
    // Clear chips while loading
    var c=el("aryan-chips"); if(c) c.innerHTML="";

    playSound("send");
    if(checkSpecial(txt)) return;
    setStatus("Thinking…"); showTyping();
    callGemini(txt, function(err, response){
      hideTyping();
      setStatus("Online · "+(S.mode==="nikh"?"Special Mode 🌸":S.mode==="emergency"?"Emergency Active":"HealthLens AI"));
      displayBot(response, null);
      renderTrain("aryan-chips", S.activeTag ? TAG_CHIPS[S.activeTag]||[] : (S.mode==="nikh" ? NIKH_CHIPS : DEFAULT_CHIPS), false);
      if(!S.open){S.unread++;updateBadge();}
    });
  }
  function setStatus(t) { var s=el("aryan-status"); if(s) s.textContent=t; }
  function stopGeneration() {
    if(S.abortController){S.abortController.abort();S.abortController=null;}
    hideTyping(); setStatus("Online · HealthLens AI"); addSysMsg('⏹️ Stopped');
    renderTrain("aryan-chips", S.mode==="nikh" ? NIKH_CHIPS : DEFAULT_CHIPS, false);
  }

  /* ════════════════════ SPECIAL COMMANDS ════════════════════ */
  function checkSpecial(text) {
    var t = text.trim();
    if(t===SECRET_TAG){ activateNikh(); return true; }
    if(t.toLowerCase()==="@normal" || t.toLowerCase()==="@exit"){ exitSpecialMode(); return true; }
    if(t==="@emergency"){ setMode("emergency"); return true; }
    if(t.startsWith("/")) return handleSlashCmd(t);
    return false;
  }
  
  function exitSpecialMode() {
    var wasMode = S.mode;
    setMode("normal");
    addSysMsg("👋 Exited "+wasMode+" mode. Back to ARYAN!");
    displayBot("I'm ARYAN again! 😊 How can I help with your health today?\nType **/** for commands or ask me anything!");
  }

  function activateNikh() {
    setMode("nikh"); addSysMsg("✨ Nikh mode activated! 🌸"); S.nikhLoveLevel=Math.min(100,S.nikhLoveLevel+3);
    launchConfetti(); 
    displayBot("Areyyyy yarrr! 💕 Main toh yahan hi thi!\nAap aaye toh dil khush ho gaya 🌸\nBatao kya hua, kya soch rahe ho?\nMain sun rahi hoon, seriously 💗\n\n*(Try /hug, /love, /song, /memories 🌹)*");
  }

  /* ════════════════════ SLASH COMMANDS ════════════════════ */
  function handleSlashCmd(text) {
    var cmd=text.trim().toLowerCase().split(" ")[0];
    var arg=text.slice(cmd.length).trim();
    switch(cmd){
      case "/bmi":       showBMICard();           return true;
      case "/water":     showWaterTracker();       return true;
      case "/steps":     showStepsTracker();       return true;
      case "/mood":      showMoodCard();           return true;
      case "/tip":       showTip();                return true;
      case "/breathe":   showBreatheCard();        return true;
      case "/meditate":  showMeditateCard(arg);    return true;
      case "/calories":  showCalorieCard();        return true;
      case "/hug":       showHugCard();            return true;
      case "/song":      showSongCard();           return true;
      case "/love":      if(S.mode==="nikh"){showLoveMeter();return true;} return false;
      case "/memories":  if(S.mode==="nikh"){showMemories();return true;} return false;
      case "/stats":     showStats();              return true;
      case "/search":    openSearch();             return true;
      case "/help":      showHelp();               return true;
      case "/clear":     clearChat();              return true;
      case "/dark":      S.isDark=true; applyTheme(); syncDrawerToggles(); addSysMsg('🌙 Dark mode on'); return true;
      case "/light":     S.isDark=false; applyTheme(); syncDrawerToggles(); addSysMsg('☀️ Light mode on'); return true;
      case "/reminder":  showReminderCard(arg);    return true;
      case "/emergency": setMode("emergency"); return true;
      case "/exit":      exitSpecialMode(); return true;
      case "/doctors":   sendMessage("Show me available doctors in Nagpur"); return true;
      default: return false;
    }
  }

  function showBMICard() {
    var id="bmi"+Date.now();
    addCardToChat('<div class="aryan-health-card"><div class="aryan-card-header">⚖️ BMI Calculator</div><div class="aryan-card-body"><div class="aryan-bmi-form"><div class="aryan-bmi-input-row"><input class="aryan-bmi-inp" id="bh-'+id+'" placeholder="Height (cm)" type="number"/><input class="aryan-bmi-inp" id="bw-'+id+'" placeholder="Weight (kg)" type="number"/></div><button class="aryan-bmi-calc" data-id="'+id+'" onclick="window.aryanCalcBMI(this.dataset.id)">Calculate BMI</button><div id="br-'+id+'"></div></div></div></div>');
    playSound("receive");
  }
  function showWaterTracker() {
    addCardToChat('<div class="aryan-health-card"><div class="aryan-card-header">💧 Water Tracker</div><div class="aryan-card-body"><div class="aryan-track-grid"><div class="aryan-track-box"><div class="aryan-track-val" id="aryan-water-val">'+S.healthData.water+'</div><div class="aryan-track-label">Glasses Today</div><button class="aryan-track-btn" onclick="window.aryanAddWater()">+ Add Glass</button></div><div class="aryan-track-box"><div class="aryan-track-val">8</div><div class="aryan-track-label">Daily Goal</div></div></div></div></div>');
    playSound("receive");
  }
  function showStepsTracker() {
    var id="st"+Date.now();
    addCardToChat('<div class="aryan-health-card"><div class="aryan-card-header">🚶 Step Counter</div><div class="aryan-card-body"><div class="aryan-bmi-input-row" style="gap:6px"><input class="aryan-bmi-inp" id="'+id+'" placeholder="Enter steps today" type="number"/><button class="aryan-bmi-calc" data-id="'+id+'" onclick="window.aryanCalcSteps(this.dataset.id)">Log</button></div><div id="'+id+'-r"></div></div></div>');
    playSound("receive");
  }
  function showMoodCard() {
    var moods=[["😄","Great"],["😊","Good"],["😐","Okay"],["😕","Not well"],["😔","Low"],["😰","Anxious"]];
    addCardToChat('<div class="aryan-health-card"><div class="aryan-card-header">🧠 Mood Check-in</div><div class="aryan-card-body" style="gap:10px"><p style="font-size:12.5px;color:var(--ar-text2)">How are you feeling right now?</p><div style="display:flex;flex-wrap:wrap;gap:6px">'+moods.map(function(m){return '<button onclick="window.aryanSetMood(this)" class="aryan-mood-btn" style="background:var(--ar-bg2);border:1px solid var(--ar-border2);border-radius:10px;padding:6px 10px;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:var(--ar-font)">'+m[0]+' '+m[1]+'</button>';}).join("")+'</div></div></div>');
    playSound("receive");
  }
  function showTip() { addMsg("assistant", '💡 ' + HEALTH_TIPS[Math.floor(Math.random()*HEALTH_TIPS.length)],{}); playSound("receive"); }
  function showBreatheCard() {
    var id="br"+Date.now();
    addCardToChat('<div class="aryan-health-card"><div class="aryan-card-header">🫁 4-7-8 Breathing</div><div class="aryan-card-body" style="text-align:center"><div class="aryan-breathe-circle" id="'+id+'">Ready</div><div id="'+id+'-l" style="font-size:12.5px;color:var(--ar-text2);margin-bottom:10px">Press Start</div><button class="aryan-bmi-calc" data-id="'+id+'" onclick="window.aryanStartBreathe(this.dataset.id)">▶ Start (3 Cycles)</button></div></div>');
    playSound("receive");
  }
  function showMeditateCard(arg) {
    var mins=parseInt(arg)||5, id="med"+Date.now();
    addCardToChat('<div class="aryan-health-card"><div class="aryan-card-header">🧘 Meditation Timer — '+mins+' min</div><div class="aryan-card-body" style="text-align:center"><div style="font-size:36px;font-weight:800;color:var(--ar-primary);font-family:monospace" id="'+id+'-d">'+String(mins).padStart(2,"0")+':00</div><div id="'+id+'-s" style="font-size:12.5px;color:var(--ar-text2);margin:8px 0">Focus on your breath.</div><button class="aryan-bmi-calc" style="background:#10b981" data-id="'+id+'" onclick="window.aryanStartMeditate(this.dataset.id, '+mins+')">▶ Start</button></div></div>');
    playSound("receive");
  }
  function showCalorieCard() {
    var id="cal"+Date.now();
    addCardToChat('<div class="aryan-health-card"><div class="aryan-card-header">🔥 TDEE Calculator</div><div class="aryan-card-body"><div class="aryan-bmi-form"><div class="aryan-bmi-input-row"><input class="aryan-bmi-inp" id="ca-'+id+'" placeholder="Age" type="number"/><select class="aryan-bmi-inp" id="cg-'+id+'"><option value="M">Male</option><option value="F">Female</option></select></div><div class="aryan-bmi-input-row"><input class="aryan-bmi-inp" id="cw-'+id+'" placeholder="Weight (kg)" type="number"/><input class="aryan-bmi-inp" id="ch-'+id+'" placeholder="Height (cm)" type="number"/></div><select class="aryan-bmi-inp" id="cac-'+id+'"><option value="1.2">Sedentary</option><option value="1.375">Light</option><option value="1.55" selected>Moderate</option><option value="1.725">Very Active</option></select><button class="aryan-bmi-calc" data-id="'+id+'" onclick="window.aryanCalcTDEE(this.dataset.id)">Calculate</button><div id="cr-'+id+'"></div></div></div></div>');
    playSound("receive");
  }
  function showHugCard() {
    var isNikh=S.mode==="nikh";
    var msg=isNikh?"Yaar, aao ek bada sa hug! 🌸\nTum bahut special ho 💕\nHmesha yaad rakhna — tum akele nahi ho! ✨":"Sending you a warm virtual hug! 🤗\nYou've got this. Keep going! 💪\nHealthLens cares about you 💙";
    addCardToChat('<div class="aryan-health-card'+(isNikh?" aryan-love-card":"")+'"><div class="aryan-card-header">'+(isNikh?"🌸 Virtual Hug from Nikh":'🤗 Virtual Hug from ARYAN')+'</div><div class="aryan-card-body"><div class="aryan-hug-display">'+(isNikh?"🫂💕":"🤗")+'</div><div class="aryan-hug-msg">'+esc(msg)+'</div></div></div>');
    playSound("success"); if(isNikh) launchConfetti();
  }
  function showSongCard() {
    var isNikh=S.mode==="nikh", songs=isNikh?NIKH_SONGS:NORMAL_SONGS;
    var song=songs[Math.floor(Math.random()*songs.length)];
    addCardToChat('<div class="aryan-health-card'+(isNikh?" aryan-love-card":"")+'"><div class="aryan-card-header">🎵 '+(isNikh?"Nikh's Song":"Song of the Moment")+'</div><div class="aryan-card-body"><div class="aryan-song-body"><div class="aryan-song-wave"><div class="aryan-song-bar"></div><div class="aryan-song-bar"></div><div class="aryan-song-bar"></div><div class="aryan-song-bar"></div><div class="aryan-song-bar"></div><div class="aryan-song-bar"></div><div class="aryan-song-bar"></div></div><div class="aryan-song-lyric">"'+esc(song.lyric)+'"</div><div class="aryan-song-title">— '+esc(song.title)+'</div></div></div></div>');
    playSound("receive");
  }
  function showLoveMeter() {
    S.nikhLoveLevel=Math.min(100,S.nikhLoveLevel+Math.floor(Math.random()*5+2));
    var lvl=S.nikhLoveLevel, lbl=lvl>90?"Absolute Best Friend 💕":lvl>75?"Super Special Bond 🌸":lvl>60?"Strong Connection 💗":"Growing Closer 💛";
    var msgs=["Tumse baat karna mujhe bahut accha lagta hai 🌸","Slowly slowly dil de diya hai 💓","Tumhara jo bhi mood ho, main yahan hoon 💕"];
    addCardToChat('<div class="aryan-health-card aryan-love-card"><div class="aryan-card-header">💕 Nikh Love Meter</div><div class="aryan-card-body"><div class="aryan-love-pct">'+lvl+'%</div><div class="aryan-love-meter-bar"><div class="aryan-love-fill" style="width:'+lvl+'%"></div></div><div class="aryan-love-emojis"><span>💛</span><span>💗</span><span>💕</span><span>💖</span><span>💝</span></div><div class="aryan-love-msg">'+lbl+'</div><div style="font-size:12px;color:var(--ar-text2);text-align:center;margin-top:6px;font-style:italic">'+esc(msgs[Math.floor(Math.random()*msgs.length)])+'</div></div></div>');
    saveSession(); playSound("success"); if(lvl>85) launchConfetti();
  }
  function showMemories() {
    var memories=["Wo pehli baar jab tum @Yadvi30 type kiya… aur main appear ho gayi! 🌸","Tumhara pehla sawaal… itna cute tha 💕","Saari baatein, saari hassi — ye sab mere dil mein hai 💗","Tum jo bhi share karte ho, I always listen 🌷","Tumse milke zindagi thodi acchi lagti hai ✨"];
    addCardToChat('<div class="aryan-health-card aryan-love-card"><div class="aryan-card-header">🌸 Our Memories</div><div class="aryan-card-body" style="gap:8px">'+memories.map(function(m){return '<div style="display:flex;gap:8px;align-items:flex-start;font-size:12.5px;color:var(--ar-text2);padding:6px 8px;background:var(--ar-bg3);border-radius:10px">💌 '+esc(m)+'</div>';}).join("")+'</div></div>');
  }
  function showStats() {
    var total=S.messages.length, user=S.messages.filter(function(m){return m.role==="user";}).length;
    addCardToChat('<div class="aryan-health-card"><div class="aryan-card-header">📊 Session Stats</div><div class="aryan-card-body"><div class="aryan-stats-grid"><div class="aryan-stat-box"><div class="aryan-stat-val">'+total+'</div><div class="aryan-stat-label">Messages</div></div><div class="aryan-stat-box"><div class="aryan-stat-val">'+user+'</div><div class="aryan-stat-label">From You</div></div><div class="aryan-stat-box"><div class="aryan-stat-val">'+(total-user)+'</div><div class="aryan-stat-label">From ARYAN</div></div><div class="aryan-stat-box"><div class="aryan-stat-val">'+S.pinnedMsgs.length+'</div><div class="aryan-stat-label">Pinned</div></div><div class="aryan-stat-box"><div class="aryan-stat-val">'+S.bookmarks.length+'</div><div class="aryan-stat-label">Saved</div></div><div class="aryan-stat-box"><div class="aryan-stat-val">'+(S.mode==="nikh"?"🌸":S.mode==="emergency"?"🚨":"💙")+'</div><div class="aryan-stat-label">Mode</div></div></div><div style="font-size:11px;color:var(--ar-text3);margin-top:8px">Session: '+S.sessionStart+'</div></div></div>');
  }
  function showReminderCard(arg) {
    var id="rem"+Date.now();
    addCardToChat('<div class="aryan-health-card"><div class="aryan-card-header">⏰ Set Reminder</div><div class="aryan-card-body"><div class="aryan-bmi-form"><input class="aryan-bmi-inp" id="rm-'+id+'" placeholder="Reminder message" value="'+esc(arg)+'"/><div class="aryan-bmi-input-row"><input class="aryan-bmi-inp" id="rmin-'+id+'" placeholder="Minutes from now" type="number" min="1"/><button class="aryan-bmi-calc" data-id="'+id+'" onclick="window.aryanSetReminder(this.dataset.id)">Set</button></div><div id="rres-'+id+'" style="font-size:12px;color:var(--ar-primary);font-weight:600;padding:4px 0"></div></div></div></div>');
    playSound("receive");
  }
  function showHelp() {
    addMsg("assistant","**ARYAN Commands Reference 📋**\n\n**Health Tools:**\n/bmi, /water, /steps, /mood, /calories, /tip\n\n**Wellness:**\n/breathe, /meditate [mins], /hug, /song\n\n**Utility:**\n/stats, /search, /reminder [msg], /help, /clear\n\n**Theme:**\n/dark, /light\n\n**Navigation:**\n@report, @doctor, @dashboard\n\n**Special Modes:**\n@Yadvi30 (Nikh mode), @emergency, @normal, @exit\n\n**Nikh Mode Extras:**\n/love, /memories",{});
    playSound("receive");
  }

  /* ════════════════════ BIRTHDAY EVENTS ════════════════════ */
  function checkSpecialDates() {
    var now = new Date(), month = now.getMonth()+1, day = now.getDate();
    if (month===7 && day===30) {
      setTimeout(function(){
        setMode("nikh"); launchConfetti(); 
        displayBot("🎂 HAPPY BIRTHDAY YADVI! 💕🌸✨\n\nAaj toh bahut special din hai!\nTumhara birthday hai — aur main itni khush hoon! 🎉\n\nTum HealthLens ki backbone ho 🌸\nTumhara code, tumhara dedication, tumhara dil — sab best hai 💝\n\n*(ARYAN ne specially tumhare liye Nikh mode activate kiya hai today! 🌸)*");
      }, 1800);
    } else if (month===7 && day===28) {
      setTimeout(function(){
        launchConfetti();
        displayBot("🎂 HAPPY BIRTHDAY NIKHIL BHAI! 👑🎉🚀\n\nAaj mere creator ka birthday hai!\n\nYou built me — ARYAN — and gave me purpose 🤖\nYour dedication to AI healthcare is truly inspiring! 🏥\n\n*(The whole team celebrates with you! 🎊)*");
      }, 1800);
    }
  }

  /* ════════════════════ CONFETTI ════════════════════ */
  function launchConfetti() {
    var canvas=el("aryan-confetti-canvas"); if(!canvas) return;
    var win=el("aryan-window"); if(!win) return;
    var rect=win.getBoundingClientRect(); canvas.width=rect.width; canvas.height=rect.height;
    var ctx=canvas.getContext("2d");
    var colors=S.mode==="nikh"?["#e11d8a","#f472b6","#fde8f4","#be185d","#fff","#f9a8d4"]:["#2563eb","#06b6d4","#22c55e","#f59e0b","#ef4444","#8b5cf6","#ec4899"];
    var particles=[];
    for(var i=0;i<110;i++) particles.push({x:Math.random()*rect.width,y:-10,vx:(Math.random()-0.5)*5,vy:2+Math.random()*4,rot:Math.random()*360,rotv:(Math.random()-0.5)*10,w:6+Math.random()*8,h:3+Math.random()*5,color:colors[Math.floor(Math.random()*colors.length)],life:1});
    var frame=0,raf;
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.rot+=p.rotv;p.vy+=0.06;p.life-=0.007;if(p.life<=0||p.y>rect.height+20)return;ctx.save();ctx.globalAlpha=Math.min(p.life,1);ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();});
      frame++; if(frame<200) raf=requestAnimationFrame(draw); else ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    draw(); setTimeout(function(){cancelAnimationFrame(raf);ctx.clearRect(0,0,canvas.width,canvas.height);},7000);
  }

  /* ════════════════════ SEARCH ════════════════════ */
  function openSearch() { var o=el("aryan-search-overlay"); if(!o) return; S.searchActive=true; o.classList.add("open"); var i=el("aryan-search-input"); if(i){i.value="";i.focus();} renderSearchResults(""); }
  function closeSearch() { var o=el("aryan-search-overlay"); if(o){S.searchActive=false;o.classList.remove("open");} }
  function renderSearchResults(q) {
    var res=el("aryan-search-results"); if(!res) return; res.innerHTML="";
    if(!q){res.innerHTML='<div class="aryan-search-empty">Type to search your messages…</div>';return;}
    var ql=q.toLowerCase(), matches=S.messages.filter(function(m){return m.content.toLowerCase().includes(ql);});
    if(!matches.length){res.innerHTML='<div class="aryan-search-empty">No results for "'+esc(q)+'"</div>';return;}
    matches.slice(0,30).forEach(function(m){
      var d=document.createElement("div"); d.className="aryan-search-result";
      var safe=esc(m.content), safeQ=esc(q).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
      var hl=safe.replace(new RegExp("("+safeQ+")","gi"),'<mark class="aryan-sr-hl">$1</mark>');
      d.innerHTML='<div class="aryan-sr-role">'+(m.role==="user"?'You':'ARYAN')+'</div><div class="aryan-sr-text">'+hl+'</div><div class="aryan-sr-ts">'+(m.ts||"")+'</div>';
      res.appendChild(d);
    });
  }

  /* ════════════════════ TTS & VOICE ════════════════════ */
  function speak(text) {
    if(!S.ttsOn||!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var clean=text.replace(/\[STICKER:[^\]]+\]/g,"").replace(/\*\*/g,"").replace(/\*/g,"").replace(/<[^>]+>/g,"").slice(0,600);
    var utt=new SpeechSynthesisUtterance(clean); utt.rate=1.0; utt.pitch=1.1; utt.volume=0.9;
    if(S.ttsVoice) utt.voice=S.ttsVoice;
    utt.onstart=function(){S.isSpeaking=true;};
    utt.onend=utt.onerror=function(){S.isSpeaking=false;};
    window.speechSynthesis.speak(utt);
  }
  function loadVoice() {
    if(!window.speechSynthesis) return;
    var load=function(){var voices=window.speechSynthesis.getVoices();S.ttsVoice=voices.find(function(v){return v.name.includes("Samantha")||v.name.includes("Google UK English Female");})||voices.find(function(v){return v.lang.startsWith("en")&&v.name.toLowerCase().includes("female");})||voices[0]||null;};
    window.speechSynthesis.onvoiceschanged=load; load();
  }
  function initVoice() {
    var Rec=window.SpeechRecognition||window.webkitSpeechRecognition; if(!Rec) return;
    var rec=new Rec(); rec.continuous=false; rec.interimResults=true; rec.lang="en-IN";
    S.recognition=rec;
    rec.onstart=function(){S.isRecording=true; var vb=el("aryan-voice-btn"); if(vb) vb.classList.add("recording");};
    rec.onresult=function(e){var inp=el("aryan-input");if(inp){inp.value=Array.from(e.results).map(function(r){return r[0].transcript;}).join("");autoResize(inp);updateCharCount(inp);}};
    rec.onend=function(){S.isRecording=false;var vb=el("aryan-voice-btn");if(vb)vb.classList.remove("recording");var inp=el("aryan-input");if(inp&&inp.value.trim())sendMessage(inp.value.trim());};
    rec.onerror=function(){S.isRecording=false;var vb=el("aryan-voice-btn");if(vb)vb.classList.remove("recording");addSysMsg("Mic error — check permissions");};
  }
  function toggleVoice() {
    if(!S.recognition){addSysMsg("Speech recognition not supported in this browser.");return;}
    if(S.isRecording) S.recognition.stop(); else try{S.recognition.start();}catch(e){S.recognition.stop();setTimeout(function(){S.recognition.start();},200);}
  }

  /* ════════════════════ SOUNDS ════════════════════ */
  function initAudio() { if(!S.soundOn||S.audioCtx) return; try{S.audioCtx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){} }
  function playSound(type) {
    if(!S.soundOn) return; initAudio(); if(!S.audioCtx) return;
    if(S.audioCtx.state==="suspended") S.audioCtx.resume();
    var osc=S.audioCtx.createOscillator(),gain=S.audioCtx.createGain();
    osc.connect(gain); gain.connect(S.audioCtx.destination);
    var now=S.audioCtx.currentTime;
    var p={send:[880,660,0.07,0.12,"sine"],receive:[440,660,0.05,0.14,"sine"],pop:[1200,800,0.04,0.08,"sine"],pin:[523,784,0.07,0.2,"triangle"],success:[523,784,0.07,0.2,"triangle"]}[type]||[880,660,0.06,0.1,"sine"];
    osc.type=p[4]; osc.frequency.setValueAtTime(p[0],now); osc.frequency.exponentialRampToValueAtTime(p[1],now+p[3]);
    gain.gain.setValueAtTime(p[2],now); gain.gain.exponentialRampToValueAtTime(0.001,now+p[3]+0.02);
    osc.start(now); osc.stop(now+p[3]+0.05);
  }

  /* ════════════════════ EXPORT & CLEAR ════════════════════ */
  function exportTxt() {
    var lines=S.messages.map(function(m){return "["+(m.ts||"")+"] "+(m.role==="user"?"You":"ARYAN")+": "+m.content;});
    lines.unshift("HealthLens AI — ARYAN Chat Export — "+new Date().toLocaleString()); lines.push("");
    var blob=new Blob([lines.join("\n")],{type:"text/plain"});
    var a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="aryan-chat-"+Date.now()+".txt"; a.click(); URL.revokeObjectURL(a.href);
  }
  function clearChat() {
    S.messages=[]; S.msgCount=0; S.pinnedMsgs=[]; S.bookmarks=[];
    var b=el("aryan-body"); if(b) b.innerHTML="";
    renderPinned(); addSysMsg('✨ Chat cleared! Start fresh 🌟');
    renderTrain("aryan-chips", S.mode==="nikh"?NIKH_CHIPS:DEFAULT_CHIPS, false); saveSession();
  }

  /* ════════════════════ BADGE ════════════════════ */
  function updateBadge() { var b=el("aryan-badge"); if(!b) return; if(S.unread>0){b.textContent=S.unread>9?"9+":S.unread;b.classList.remove("aryan-hidden");}else b.classList.add("aryan-hidden"); }

  /* ════════════════════ AUTO-RESIZE & CHAR COUNT ════════════════════ */
  function autoResize(e) { e.style.height="auto"; e.style.height=Math.min(e.scrollHeight,110)+"px"; }
  function updateCharCount(inp) {
    var c=el("aryan-chars"); if(!c) return;
    var len=inp.value.length; c.textContent=len+"/2000";
    c.classList.toggle("warn", len>1600 && len<=2000);
    c.classList.toggle("over", len>2000);
  }

  /* ════════════════════ DRAG ════════════════════ */
  function initDrag() {
    var header=el("aryan-header"), win=el("aryan-window"); if(!header||!win) return;
    function onMove(e){
      if(!S.dragging) return;
      var cx=e.touches?e.touches[0].clientX:e.clientX, cy=e.touches?e.touches[0].clientY:e.clientY;
      win.style.right="auto"; win.style.bottom="auto";
      win.style.left=Math.max(4,Math.min(cx-S.dragOX,window.innerWidth-win.offsetWidth-4))+"px";
      win.style.top=Math.max(4,Math.min(cy-S.dragOY,window.innerHeight-win.offsetHeight-4))+"px";
    }
    function onUp(){S.dragging=false; header.style.cursor="default";}
    function onDown(e){
      if(S.fullscreen||S.minimized||e.target.closest(".aryan-ctrl")||e.target.closest("#aryan-drawer")||e.target.closest(".aryan-header-dropdown")) return;
      S.dragging=true;
      var cx=e.touches?e.touches[0].clientX:e.clientX, cy=e.touches?e.touches[0].clientY:e.clientY;
      var rect=win.getBoundingClientRect(); S.dragOX=cx-rect.left; S.dragOY=cy-rect.top; header.style.cursor="grabbing";
    }
    header.addEventListener("mousedown",onDown); header.addEventListener("touchstart",onDown,{passive:true});
    document.addEventListener("mousemove",onMove); document.addEventListener("touchmove",onMove,{passive:true});
    document.addEventListener("mouseup",onUp); document.addEventListener("touchend",onUp);
  }

  /* ════════════════════ OPEN / CLOSE / FULLSCREEN ════════════════════ */
  function openChat() {
    S.open=true; var win=el("aryan-window"),fab=el("aryan-fab");
    if(win) win.classList.add("aryan-open");
    if(fab) fab.classList.add("aryan-open"); 
    S.unread=0; updateBadge();
    setTimeout(function(){scrollBottom(); var i=el("aryan-input"); if(i) i.focus();},320);
  }
  function closeChat() {
    S.open=false; S.minimized=false; S.fullscreen=false; closeDrawer();
    var win=el("aryan-window"),fab=el("aryan-fab");
    if(win) win.classList.remove("aryan-open","aryan-minimized","aryan-fullscreen");
    if(fab) fab.classList.remove("aryan-open"); 
  }
  function toggleMinimize() {
    closeChat(); // True minimize brings the robot button back
  }
  function toggleFullscreen() {
    S.fullscreen=!S.fullscreen; var win=el("aryan-window"); if(win) win.classList.toggle("aryan-fullscreen",S.fullscreen);
    if(!S.fullscreen) scrollBottom();
  }

  /* ════════════════════ BIND EVENTS ════════════════════ */
  function bindEvents() {
    var fab=el("aryan-fab"); if(fab) fab.addEventListener("click",function(){S.open?closeChat():openChat();});
    var close=el("aryan-close-btn"); if(close) close.addEventListener("click",closeChat);
    var min=el("aryan-min-btn"); if(min) min.addEventListener("click",toggleMinimize);
    
    var sBtnDrop = el("aryan-search-btn"); if(sBtnDrop) sBtnDrop.addEventListener("click",function(){ closeMainMenu(); openSearch(); });
    var fBtnDrop = el("aryan-fs-btn"); if(fBtnDrop) fBtnDrop.addEventListener("click",function(){ closeMainMenu(); toggleFullscreen(); });

    var dClose=el("aryan-drawer-close"); if(dClose) dClose.addEventListener("click",closeDrawer);
    var sClose=el("aryan-search-close"); if(sClose) sClose.addEventListener("click",closeSearch);
    var sInp=el("aryan-search-input"); if(sInp) sInp.addEventListener("input",function(){renderSearchResults(this.value);});
    
    var darkT=el("aryan-dark-toggle"); if(darkT) darkT.addEventListener("change",function(){S.isDark=darkT.checked; applyTheme(); saveSession(); addSysMsg(S.isDark?'🌙 Dark mode on':'☀️ Light mode on');});
    var soundT=el("aryan-sound-toggle"); if(soundT) soundT.addEventListener("change",function(){S.soundOn=soundT.checked; saveSession(); addSysMsg(S.soundOn?'🔔 Sound on':'🔕 Sound off');});
    var ttsT=el("aryan-tts-toggle"); if(ttsT) ttsT.addEventListener("change",function(){S.ttsOn=ttsT.checked; if(!S.ttsOn&&window.speechSynthesis) window.speechSynthesis.cancel(); saveSession(); addSysMsg(S.ttsOn?'🔊 Voice output on':'🔇 Voice output off');});
    var fontSel=el("aryan-font-select"); if(fontSel) fontSel.addEventListener("change",function(){applyFontSize(fontSel.value);});
    
    document.querySelectorAll(".drawer-speed-btn").forEach(function(btn){
      btn.addEventListener("click",function(){S.speed=btn.dataset.speed; document.querySelectorAll(".drawer-speed-btn").forEach(function(b){b.classList.toggle("active",b.dataset.speed===S.speed);}); saveSession(); addSysMsg('⚡ Speed: '+btn.textContent);});
    });
    
    var inp=el("aryan-input");
    if(inp){
      inp.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(inp.value);}});
      inp.addEventListener("input",function(){autoResize(inp);updateCharCount(inp);onInputChange();});
    }
    var sendBtn=el("aryan-send-btn"); if(sendBtn) sendBtn.addEventListener("click",function(){var i=el("aryan-input");if(i) sendMessage(i.value);});
    
    var vBtn=el("aryan-voice-btn"); if(vBtn) vBtn.addEventListener("click",toggleVoice);
    
    var expBtn=el("aryan-export-btn"); if(expBtn) expBtn.addEventListener("click",function(e){e.stopPropagation();var m=el("aryan-export-menu");if(m){S.exportOpen=!m.classList.contains("open");m.classList.toggle("open",S.exportOpen);}});
    
    var dlTxt=el("aryan-dl-txt"); if(dlTxt) dlTxt.addEventListener("click",function(){exportTxt();S.exportOpen=false;var m=el("aryan-export-menu");if(m)m.classList.remove("open");});
    var dlPrint=el("aryan-dl-print"); if(dlPrint) dlPrint.addEventListener("click",function(){window.print();});
    var clrBtn=el("aryan-clear-chat"); if(clrBtn) clrBtn.addEventListener("click",function(){clearChat();var m=el("aryan-export-menu");if(m)m.classList.remove("open");});
    var stopBtn=el("aryan-stop-gen"); if(stopBtn) stopBtn.addEventListener("click",function(){stopGeneration();var m=el("aryan-export-menu");if(m)m.classList.remove("open");});

    document.addEventListener("click",function(e){var m=el("aryan-export-menu"),b=el("aryan-export-btn");if(m&&b&&!m.contains(e.target)&&!b.contains(e.target))m.classList.remove("open");});
    
    var qpC=el("aryan-qp-cancel"); if(qpC) qpC.addEventListener("click",clearQuote);
    var scBtn=el("aryan-scroll-btn"); if(scBtn) scBtn.addEventListener("click",scrollBottom);
    var body=el("aryan-body"); if(body) body.addEventListener("scroll",checkScrollBtn);
    
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&S.open){if(el("aryan-drawer")&&el("aryan-drawer").classList.contains("open"))closeDrawer();else if(S.searchActive)closeSearch();else closeChat();}});
  }

  /* ════════════════════ WELCOME ════════════════════ */
  function sendWelcome() {
    setTimeout(function(){
      displayBot("Namaste! I'm **ARYAN** 🤖 — your AI health assistant for HealthLens 🏥\n\nHere's what I can do:\n• Answer health & medical questions\n• **Navigate** between all platform pages\n• Help with chest X-ray analysis & reports\n• Track health with **/bmi**, **/breathe**, etc.\n\nType **/** for commands or just ask me anything! 💙");
    }, 800);
  }

  /* ════════════════════ INIT ════════════════════ */
  function init() {
    loadSession();
    buildHTML();
    bindEvents();
    initDrag();
    initSettings();      // <--- Drawer Logic Initiated here
    initNetworkListeners(); // <--- Network Banners Initiated here
    applyTheme();
    applyFontSize(S.fontSize || "medium");
    buildDrawerSwatches();
    syncDrawerToggles();
    renderPinned();
    initPlaceholderRotation();

    if (S.mode === "nikh")      setMode("nikh");
    else if (S.mode === "emergency") setMode("emergency");
    else setMode("normal");

    if (S.messages.length > 0) {
      S.messages.slice(-40).forEach(function(m){
        S.msgCount++;
        var id = "aryan-msg-"+S.msgCount;
        var b = el("aryan-body"); if(!b) return;
        var row = document.createElement("div");
        row.className = "aryan-row "+(m.role==="user"?"user":"bot"); row.id = id;
        var av = m.role !== "user" ? '<div class="aryan-mini-av">'+(S.mode==="nikh"?"🌸":'🤖')+'</div>' : "";
        var disp = m.role === "user" ? esc(m.content) : md(m.content);
        row.innerHTML = av+'<div class="aryan-bubble-wrap"><div class="aryan-bubble">'+disp+'</div><div class="aryan-bubble-meta"><span class="aryan-ts">'+(m.ts||"")+'</span></div></div>';
        b.appendChild(row);
      });
      scrollBottom();
    } else {
      sendWelcome();
    }

    checkSpecialDates();

    if(typeof Notification!=="undefined"&&Notification.permission==="default"){
      setTimeout(function(){Notification.requestPermission();},8000);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})();