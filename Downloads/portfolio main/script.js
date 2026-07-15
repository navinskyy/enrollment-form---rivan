// ---------- theme ----------
const NAVIN_WPM = 92;
const NAVIN_ACC = 97;
const TEST_DURATION = 30;
const root = document.documentElement;
const themeSwitch = document.getElementById("theme-switch");

const savedTheme = localStorage.getItem("theme") || "dark";
root.setAttribute("data-theme", savedTheme);

themeSwitch.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});

// ---------- mobile hamburger menu ----------
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

function closeMobileMenu(){
  sidebar.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}
function toggleMobileMenu(){
  const isOpen = sidebar.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
}
menuToggle.addEventListener('click', toggleMobileMenu);

// ---------- nav / page routing ----------
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.target;
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + target).classList.add('active');
    closeMobileMenu();
  });
});

// "navin." brand now doubles as the home link
const brandHome = document.getElementById('brand-home');
function goHome(){
  navBtns.forEach(b => b.classList.remove('active'));
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById('page-home').classList.add('active');
  closeMobileMenu();
}
brandHome.addEventListener('click', goHome);
brandHome.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' '){
    e.preventDefault();
    goHome();
  }
});

// ================= EMAIL MODAL =================
const emailOverlay = document.getElementById('email-overlay');
const emailOpenBtns = document.querySelectorAll('[data-open="email"]');
const copyBtn = document.getElementById('copy-email-btn');
const emailAddress = 'navinbyronllanes@gmail.com';

function openModal(overlay){
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(overlay){
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

emailOpenBtns.forEach(btn => btn.addEventListener('click', (e) => {
  e.preventDefault();
  openModal(emailOverlay);
}));

// generic close handling for every modal overlay (email, typing test, result)
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(overlay));
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay);
  });
});

copyBtn.addEventListener('click', async () => {
  try{
    await navigator.clipboard.writeText(emailAddress);
  }catch(err){
    const ta = document.createElement('textarea');
    ta.value = emailAddress;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  copyBtn.classList.add('copied');
  const original = copyBtn.innerHTML;
  copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  setTimeout(() => {
    copyBtn.classList.remove('copied');
    copyBtn.innerHTML = original;
  }, 1600);
});

// ================= TYPING TEST MODAL =================
const ttOverlay = document.getElementById('tt-overlay');
const ttOpenBtns = document.querySelectorAll('[data-open="typing"]');
const resultOverlay = document.getElementById('result-overlay');

ttOpenBtns.forEach(btn => btn.addEventListener('click', () => {
  openModal(ttOverlay);
  startTest();
  setTimeout(() => inputEl.focus(), 50);
}));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape'){
    document.querySelectorAll('.modal-overlay.open').forEach(o => closeModal(o));
    closeMobileMenu();
  }
});

const wordPool = [

"about","above","accept","across","action","active","actor","actual","adapt","adjust",
"advice","afraid","after","again","against","agency","agree","ahead","air","alive",
"allow","almost","alone","along","already","also","always","amazing","among","amount",
"ancient","animal","answer","anyone","anything","appear","apple","apply","around","arrive",
"artist","aspect","attack","attempt","attention","author","autumn","average","avoid","awake",

"baby","back","balance","banana","beach","beautiful","because","become","before","begin",
"behind","believe","below","better","between","beyond","bicycle","birthday","blanket","blood",
"board","body","border","bottle","brain","branch","brave","bread","break","bridge",
"bright","bring","brother","building","business","butter","button","buyer","camera","camp",

"capital","captain","care","career","careful","carpet","carry","castle","catch","cause",
"celebrate","center","century","certain","chair","chance","change","character","charge","cheese",
"chicken","choice","choose","church","circle","citizen","city","class","clean","clear",
"climate","clock","close","cloud","coffee","collect","college","color","comfort","common",
"company","compare","complete","computer","concert","condition","connect","consider","control","conversation",
"cookie","corner","correct","country","courage","course","create","creative","credit","culture",
"customer","danger","dark","daughter","decide","decision","deep","degree","delight","demand",
"depend","describe","design","desire","detail","develop","diamond","difference","dinner","direction",
"discover","distance","doctor","document","dream","dress","drink","drive","driver","during",

"early","earth","easily","east","easy","education","effect","effort","eight","either",
"electric","elephant","energy","engine","enjoy","enough","enter","entire","environment","equal",
"especially","even","evening","event","every","everyone","everything","example","exchange","excited",
"exercise","experience","expert","explore","express","extra","family","famous","fantastic","farmer",
"fashion","father","favorite","feature","feeling","friend","festival","field","fight","finish",
"fire","first","fish","flight","flower","follow","forest","forget","forward","freedom",
"fresh","friday","friendship","future","garden","general","gentle","gift","glass","global",
"govern","graduate","grass","great","green","ground","group","growth","guess","guide",

"habit","happy","health","heart","heavy","hello","help","history","holiday","honest",
"hope","horse","hospital","hotel","house","human","humble","hungry","husband","idea",
"imagine","important","improve","include","increase","industry","inside","interest","internet","island",
"journey","judge","jungle","junior","justice","kitchen","knowledge","language","laugh","leader",
"learn","leave","lesson","letter","library","light","listen","little","living","local",
"lonely","love","machine","magazine","magic","market","marriage","master","matter","meaning",
"measure","memory","message","middle","million","minute","mirror","mission","modern","moment",
"money","morning","mother","mountain","movement","movie","music","nation","nature","near","neighbor",
"network","night","normal","notice","number","object","observe","ocean","office","offer",
"often","online","open","opinion","opportunity","orange","order","ordinary","outside","owner",

"paint","paper","parent","party","peace","people","perfect","performance","person","phone",
"photo","picture","place","planet","player","please","pocket","police","popular","position",
"possible","power","practice","prepare","present","pressure","pretty","price","problem","process",
"product","program","project","promise","protect","public","purpose","quality","question","quick",
"quiet","radio","rain","random","reach","reader","reason","receive","record","reduce",
"region","relationship","remember","repair","repeat","replace","respect","restaurant","result","return",
"river","road","robot","room","school","science","season","second","secret","security",
"sentence","service","shadow","share","ship","shirt","shopping","should","simple","sister",
"skill","sleep","small","smart","smile","snow","social","society","solution","someone",
"something","sound","space","special","speech","spend","sport","spring","square","stage",
"start","station","story","street","strong","student","study","success","summer","support",
"surface","surprise","system","teacher","technology","telephone","temperature","thank","theater","theory",
"thing","thought","thousand","through","ticket","together","tomorrow","travel","treasure","trust",
"truth","under","understand","universe","useful","vacation","valuable","victory","village","vision",
"visitor","voice","volume","waiting","walk","wallet","warm","weather","welcome","window",
"winter","wonder","worker","world","writer","yellow","young","zebra"

];

const trackEl = document.getElementById('tt-track');
const inputEl = document.getElementById('tt-input');
const wpmEl = document.getElementById('tt-wpm');
const accEl = document.getElementById('tt-acc');
const timeEl = document.getElementById('tt-time');

let words = [];
let wordIndex = 0;
let startTime = null;
let timerHandle = null;
let correctChars = 0;
let typedChars = 0;
let finishedWords = [];

function randomWords(n) {
    const out = [];
    while (out.length < n) {
        out.push(wordPool[Math.floor(Math.random() * wordPool.length)]);
    }
    return out;
}

function currentTargetChar(){
  const word = words[wordIndex];
  if (!word) return null;
  const typed = inputEl.value;
  if (typed.length >= word.length) return ' ';
  return word[typed.length];
}

function renderKeyboard(){
  const target = currentTargetChar();
  document.querySelectorAll('.kb-key').forEach(k => {
    k.classList.toggle('next', target && k.dataset.key === target);
  });
  const spaceKey = document.getElementById('kb-space');
  if (spaceKey) spaceKey.classList.toggle('next', target === ' ');
}

function renderTrack(){
  trackEl.innerHTML = '';
  words.forEach((w, wi) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';
    if (finishedWords[wi] === 'correct') wordSpan.classList.add('done-correct');
    if (finishedWords[wi] === 'wrong') wordSpan.classList.add('done-wrong');

    if (wi === wordIndex){
      const typed = inputEl.value;
      [...w].forEach((ch, ci) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        charSpan.textContent = ch;
        if (ci < typed.length){
          charSpan.classList.add(typed[ci] === ch ? 'correct' : 'incorrect');
        }
        if (ci === typed.length){
          charSpan.classList.add('current');
        }
        wordSpan.appendChild(charSpan);
      });
      if (typed.length >= w.length){
        const caret = document.createElement('span');
        caret.className = 'char current';
        wordSpan.appendChild(caret);
      }
    } else {
      wordSpan.textContent = w;
    }
    trackEl.appendChild(wordSpan);
  });
  renderKeyboard();

  const currentWord = trackEl.children[wordIndex];

  if (currentWord) {
    // pin the row that contains the word being typed to the top of the
    // visible window — measured directly off the real layout, not a
    // hardcoded line-height guess, so it always tracks correctly
    trackEl.style.transform = `translateY(-${currentWord.offsetTop}px)`;
  }
}

function updateStats(){

    if(!startTime) return;

    const elapsedMs = Date.now() - startTime;

    const elapsedSec = elapsedMs / 1000;

    const remaining = Math.max(0, TEST_DURATION - Math.floor(elapsedSec));

    timeEl.textContent = remaining;

    const minutes = elapsedMs / 60000;

    const wpm = minutes > 0
        ? Math.round((correctChars / 5) / minutes)
        : 0;

    wpmEl.textContent = wpm;

    const acc = typedChars > 0
        ? Math.round((correctChars / typedChars) * 100)
        : 100;

    accEl.innerHTML = acc + "<span>%</span>";

    if(remaining <= 0){

        clearInterval(timerHandle);

        finishTest();

    }

}

function startTest(){
  words = randomWords(45);
  wordIndex = 0;
  startTime = null;
  correctChars = 0;
  typedChars = 0;
  finishedWords = new Array(words.length).fill(null);
  inputEl.value = '';
  inputEl.disabled = false;
  wpmEl.textContent = '0';
  accEl.innerHTML = '100<span>%</span>';
  timeEl.textContent = String(TEST_DURATION);
  if (timerHandle) clearInterval(timerHandle);
  trackEl.style.transition = 'none';
  trackEl.style.transform = 'translateY(0px)';
  // re-enable the smooth scroll animation on the next frame
  requestAnimationFrame(() => { trackEl.style.transition = ''; });
  renderTrack();
}

inputEl.addEventListener("input", () => {

    if (!startTime) {
        startTime = Date.now();
        timerHandle = setInterval(updateStats, 250);
    }

    const val = inputEl.value;

    renderTrack();

    // NEXT WORD ONLY WHEN SPACE IS PRESSED
    if (!val.endsWith(" ")) return;

    const typedWord = val.trim();
    const target = words[wordIndex];

    finishedWords[wordIndex] =
        typedWord === target ? "correct" : "wrong";

    wordIndex++;

    inputEl.value = "";

    // keep a buffer of upcoming words so the test never runs out —
    // this is what lets the line scroll up smoothly forever, monkeytype-style,
    // instead of jumping back to the start
    if (words.length - wordIndex < 15) {
        const more = randomWords(30);
        words = words.concat(more);
        finishedWords = finishedWords.concat(new Array(more.length).fill(null));
    }

    renderTrack();

});

// real-time accuracy tracking — every keystroke counts, the moment it's
// pressed, so a typo you later fix with backspace still counts against
// accuracy (this is how real typing tests measure it; checking only the
// final word text at the space-press ignores corrected mistakes entirely)
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Tab'){
    e.preventDefault();
    startTest();
    return;
  }
  if (e.key.length !== 1 || e.key === ' ') return; // ignore backspace/arrows/space etc.
  const target = words[wordIndex];
  if (!target) return;
  const pos = inputEl.value.length;
  typedChars++;
  if (target[pos] === e.key) correctChars++;
});

// visual key-press feedback
document.addEventListener('keydown', (e) => {
  if (!ttOverlay.classList.contains('open')) return;
  const key = e.key.toLowerCase();
  const keyEl = document.querySelector(`.kb-key[data-key="${key}"]`);
  if (keyEl) keyEl.classList.add('pressed');
  if (key === ' '){
    const spaceKey = document.getElementById('kb-space');
    if (spaceKey) spaceKey.classList.add('pressed');
  }
});
document.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  const keyEl = document.querySelector(`.kb-key[data-key="${key}"]`);
  if (keyEl) keyEl.classList.remove('pressed');
  if (key === ' '){
    const spaceKey = document.getElementById('kb-space');
    if (spaceKey) spaceKey.classList.remove('pressed');
  }
});

// keep focus on the hidden input whenever the modal is open and clicked
ttOverlay.addEventListener('mousedown', (e) => {
  if (e.target.closest('.tt-card') && !e.target.closest('[data-close]')){
    inputEl.focus();
  }
});

function finishTest(){

    inputEl.disabled = true;
    inputEl.blur();

    const finalWPM = Number(wpmEl.textContent);
    const finalACC = parseInt(accEl.textContent) || 0;
    const won = finalWPM >= NAVIN_WPM && finalACC >= NAVIN_ACC;

    document.getElementById('result-icon').textContent = won ? '🏆' : '💀';
    document.getElementById('result-title').textContent = won ? 'You beat Navin!' : 'You lost to Navin!';
    document.getElementById('result-sub').textContent = won
        ? `Navin runs at ${NAVIN_WPM} wpm / ${NAVIN_ACC}% acc — you just topped that.`
        : `Navin types ${NAVIN_WPM} wpm at ${NAVIN_ACC}% accuracy. Give it another go.`;
    document.getElementById('result-wpm').textContent = finalWPM;
    document.getElementById('result-acc').innerHTML = finalACC + '<span>%</span>';

    // the keyboard/typing test fully closes first, then the flashcard
    // takes its place — never shown stacked on top of each other
    closeModal(ttOverlay);
    setTimeout(() => openModal(resultOverlay), 260);

}

document.getElementById('result-retry').addEventListener('click', () => {
  closeModal(resultOverlay);
  openModal(ttOverlay);
  startTest();
  setTimeout(() => inputEl.focus(), 50);
});