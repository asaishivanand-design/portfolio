window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => { loader.style.opacity = "0"; loader.style.pointerEvents = "none"; }, 350);
});

function toggleMode() {
  document.body.classList.toggle("dark");
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".hero-card").forEach((el) => {
  if (!el.classList.contains("hero")) el.classList.add("fade");
  observer.observe(el);
});


// Local favourite-music player
const audioPlayer = document.getElementById("audioPlayer");
const trackTitle = document.getElementById("trackTitle");
const tracks = document.querySelectorAll(".track");

tracks.forEach(track => {
  track.addEventListener("click", () => {
    tracks.forEach(t => t.classList.remove("active"));
    track.classList.add("active");
    const src = track.dataset.src;
    audioPlayer.src = src;
    trackTitle.textContent = track.dataset.title;
    audioPlayer.play().catch(() => {
      // Browser may require a second click if the file does not exist yet.
    });
  });
});


// V4 reveal animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Scroll progress
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector(".scroll-progress").style.width = `${(window.scrollY / max) * 100}%`;
}, {passive:true});

// Smooth custom cursor
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener("mousemove", e => { mx=e.clientX; my=e.clientY; });
function cursorLoop(){
  rx += (mx-rx)*.18; ry += (my-ry)*.18;
  if(dot){dot.style.left=mx+"px";dot.style.top=my+"px";}
  if(ring){ring.style.left=rx+"px";ring.style.top=ry+"px";}
  requestAnimationFrame(cursorLoop);
}
cursorLoop();

document.querySelectorAll("a,button,.hero-card,.track").forEach(el=>{
  el.addEventListener("mouseenter",()=>{
    if(ring){ring.style.width="52px";ring.style.height="52px";ring.style.background="rgba(244,176,0,.16)";}
  });
  el.addEventListener("mouseleave",()=>{
    if(ring){ring.style.width="34px";ring.style.height="34px";ring.style.background="transparent";}
  });
});

// Gentle parallax for ambient background
window.addEventListener("scroll",()=>{
  const y=window.scrollY;
  const a=document.querySelector(".ambient-one"), b=document.querySelector(".ambient-two");
  if(a)a.style.marginTop=(y*.03)+"px";
  if(b)b.style.marginTop=(-y*.02)+"px";
},{passive:true});


// V5 local guestbook
const guestForm = document.getElementById("guestbookForm");
const guestMessages = document.getElementById("guestMessages");
const guestStoreKey = "nandu-portfolio-guestbook";

function renderGuestbook(){
  if(!guestMessages) return;
  const messages = JSON.parse(localStorage.getItem(guestStoreKey) || "[]");
  guestMessages.innerHTML = messages.length ? messages.map(m =>
    `<article class="guest-message"><b>${escapeHtml(m.name)}</b><small>${escapeHtml(m.date)}</small><p>${escapeHtml(m.message)}</p></article>`
  ).join("") : `<div class="guest-message"><b>Be the first one.</b><p>This wall is currently suspiciously empty.</p></div>`;
}
function escapeHtml(value){
  return value.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
}
if(guestForm){
  renderGuestbook();
  guestForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("guestName").value.trim();
    const message = document.getElementById("guestMessage").value.trim();
    if(!name || !message) return;
    const messages = JSON.parse(localStorage.getItem(guestStoreKey) || "[]");
    messages.unshift({name, message, date:new Date().toLocaleDateString()});
    localStorage.setItem(guestStoreKey, JSON.stringify(messages.slice(0,30)));
    guestForm.reset();
    renderGuestbook();
  });
}


// Keyboard accessibility for interactive portfolio cards
window.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.rimuru-bubble.show').forEach(el => el.classList.remove('show'));
});

/* ===== V10 interaction polish ===== */
(() => {
  const topbar=document.querySelector(".topbar");
  const topButton=document.createElement("button");
  topButton.className="scroll-top";
  topButton.type="button";
  topButton.setAttribute("aria-label","Back to top");
  topButton.textContent="↑";
  document.body.appendChild(topButton);

  const nav=[...document.querySelectorAll(".navlinks a")];
  const sections=nav.map(a=>document.querySelector(a.getAttribute("href"))).filter(Boolean);

  function updateUI(){
    const y=window.scrollY;
    if(topbar) topbar.classList.toggle("scrolled",y>20);
    topButton.classList.toggle("show",y>700);
    let current="";
    sections.forEach(section=>{if(section.getBoundingClientRect().top<=140) current=section.id;});
    nav.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+current));
  }
  window.addEventListener("scroll",updateUI,{passive:true});
  updateUI();
  topButton.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

  document.querySelectorAll(".button,.mini-link,.chaos-button,.ask-prompt").forEach(btn=>{
    btn.addEventListener("click",e=>{
      const r=btn.getBoundingClientRect();
      const ripple=document.createElement("span");
      ripple.className="ripple";
      ripple.style.width=ripple.style.height=Math.max(r.width,r.height)+"px";
      ripple.style.left=(e.clientX-r.left-Math.max(r.width,r.height)/2)+"px";
      ripple.style.top=(e.clientY-r.top-Math.max(r.width,r.height)/2)+"px";
      if(getComputedStyle(btn).position==="static") btn.style.position="relative";
      btn.style.overflow="hidden";
      btn.appendChild(ripple);
      setTimeout(()=>ripple.remove(),600);
    });
  });
})();
