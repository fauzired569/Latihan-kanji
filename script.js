// script.js
let currentBook = '';
let currentSelectedLessons = []; // array nama bab yang dipilih
let currentMode = '';
let currentItems = [];          // kanji yang akan dilatih dalam sesi ini
let currentIndex = 0;
let score = 0;

// Histori global: kanji yang sudah pernah dilatih (dalam sesi latihan baru)
let practicedKanjiSet = new Set();

// Untuk matching: menyimpan pasangan yang sudah digunakan dalam sesi
let usedMatchingItems = [];

// DOM Elements
const bookSelect = document.getElementById('book-select');
const lessonCheckboxesDiv = document.getElementById('lesson-checkboxes');
const modeSelect = document.getElementById('mode-select');
const startBtn = document.getElementById('start-btn');
const practiceArea = document.getElementById('practice-area');
const cardCountInput = document.getElementById('card-count');
const sessionPanel = document.getElementById('session-panel');
const historiCountSpan = document.getElementById('histori-count');
const repeatSessionBtn = document.getElementById('repeat-session-btn');
const newSessionBtn = document.getElementById('new-session-btn');
const resetHistoryBtn = document.getElementById('reset-history-btn');
const selectAllBtn = document.getElementById('select-all-lessons');
const deselectAllBtn = document.getElementById('deselect-all-lessons');

// ---------- INISIALISASI DROPDOWN BUKU & CHECKBOX BAB ----------
function initBookSelect() {
  const books = Object.keys(kanjiData);
  books.forEach(book => {
    const option = document.createElement('option');
    option.value = book;
    option.textContent = book;
    bookSelect.appendChild(option);
  });

  if (books.length > 0) {
    bookSelect.value = books[0];
    renderLessonCheckboxes(books[0]);
  }

  // Opsi "Semua Buku" (special)
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = '📚 Semua Buku';
  bookSelect.appendChild(allOption);
}

function renderLessonCheckboxes(book) {
  lessonCheckboxesDiv.innerHTML = '';
  if (book === 'all') {
    // Jika semua buku, tampilkan pesan saja
    lessonCheckboxesDiv.innerHTML = '<div class="info-note">Semua bab dari semua buku akan digunakan.</div>';
    return;
  }

  const lessons = Object.keys(kanjiData[book]);
  lessons.forEach(lesson => {
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = lesson;
    cb.checked = true; // default terpilih
    label.appendChild(cb);
    label.appendChild(document.createTextNode(lesson));
    lessonCheckboxesDiv.appendChild(label);
  });

  // Jika tidak ada bab (seharusnya ada)
  if (lessons.length === 0) {
    lessonCheckboxesDiv.innerHTML = '<div class="info-note">Tidak ada bab tersedia.</div>';
  }
}

// Event: ganti buku -> render ulang checkbox
bookSelect.addEventListener('change', (e) => {
  renderLessonCheckboxes(e.target.value);
});

// Tombol Pilih Semua / Bersihkan
selectAllBtn.addEventListener('click', () => {
  const checkboxes = lessonCheckboxesDiv.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = true);
});

deselectAllBtn.addEventListener('click', () => {
  const checkboxes = lessonCheckboxesDiv.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);
});

// ---------- FUNGSI PENGAMBILAN ITEM BERDASARKAN PILIHAN ----------
function getSelectedItems() {
  const book = bookSelect.value;
  let selectedLessons = [];

  if (book === 'all') {
    // Semua buku, semua bab
    let items = [];
    for (let b in kanjiData) {
      for (let l in kanjiData[b]) {
        items = items.concat(kanjiData[b][l]);
      }
    }
    return items;
  } else {
    const checkboxes = lessonCheckboxesDiv.querySelectorAll('input[type="checkbox"]:checked');
    selectedLessons = Array.from(checkboxes).map(cb => cb.value);
    if (selectedLessons.length === 0) {
      alert('Pilih setidaknya satu bab.');
      return [];
    }
    let items = [];
    selectedLessons.forEach(lesson => {
      if (kanjiData[book][lesson]) {
        items = items.concat(kanjiData[book][lesson]);
      }
    });
    return items;
  }
}

// ---------- MEMULAI LATIHAN (dengan opsi filter histori) ----------
function startPractice(useHistoryFilter = true) {
  const allAvailable = getSelectedItems();
  if (allAvailable.length === 0) {
    practiceArea.innerHTML = '<div class="placeholder">❌ Tidak ada kanji yang dipilih.</div>';
    return;
  }

  // Filter berdasarkan histori jika diminta (untuk "Latihan Baru")
  let pool = allAvailable;
  if (useHistoryFilter) {
    pool = allAvailable.filter(item => !practicedKanjiSet.has(item.kanji));
    if (pool.length === 0) {
      practiceArea.innerHTML = '<div class="placeholder">🎉 Semua kanji sudah dilatih! Reset histori untuk mengulang.</div>';
      sessionPanel.style.display = 'flex';
      updateHistoriCount();
      return;
    }
  }

  // Acak dan ambil sesuai jumlah kartu
  pool = shuffleArray([...pool]);
  let desiredCount = parseInt(cardCountInput.value, 10);
  if (isNaN(desiredCount) || desiredCount < 1) desiredCount = 20;
  const maxItems = Math.min(desiredCount, pool.length);
  currentItems = pool.slice(0, maxItems);

  // Jika ini adalah sesi baru (bukan ulangi sesi), tambahkan ke histori
  if (useHistoryFilter) {
    currentItems.forEach(item => practicedKanjiSet.add(item.kanji));
  }

  currentBook = bookSelect.value;
  currentSelectedLessons = bookSelect.value === 'all' ? [] :
    Array.from(lessonCheckboxesDiv.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
  currentMode = modeSelect.value;
  currentIndex = 0;
  score = 0;
  usedMatchingItems = [];

  // Tampilkan panel sesi
  sessionPanel.style.display = 'flex';
  updateHistoriCount();

  if (currentItems.length === 0) {
    practiceArea.innerHTML = '<div class="placeholder">❌ Tidak ada kanji yang memenuhi kriteria.</div>';
    return;
  }

  renderPractice();
}

function updateHistoriCount() {
  historiCountSpan.textContent = `Kanji sudah dilatih: ${practicedKanjiSet.size}`;
}

// ---------- RENDER MODE ----------
function renderPractice() {
  switch (currentMode) {
    case 'flashcard': renderFlashcard(); break;
    case 'multiple-meaning': renderMultipleChoice('meaning'); break;
    case 'multiple-reading': renderMultipleChoice('reading'); break;
    case 'writing-kanji': renderWriting('kanji'); break;
    case 'writing-reading': renderWriting('reading'); break;
    case 'matching': renderMatching(); break;
    default: practiceArea.innerHTML = '<div class="placeholder">Mode belum tersedia.</div>';
  }
}

// ================= FLASHCARD GRID =================
function renderFlashcard() {
  let itemsToShow = currentItems;
  if (itemsToShow.length === 0) {
    practiceArea.innerHTML = '<div class="placeholder">Tidak ada kanji.</div>';
    return;
  }

  let html = `
    <div class="flashcard-grid-controls">
      <button id="refresh-grid-btn" class="btn-secondary">🔄 Acak & Tampilkan Baru</button>
    </div>
    <div class="flashcard-grid" id="flashcard-grid">
  `;
  itemsToShow.forEach(item => {
    const charClass = item.kanji.length >= 4 ? 'many-char' : (item.kanji.length === 3 ? 'multi-char' : '');
    html += `
      <div class="grid-card ${charClass}" data-kanji="${item.kanji}">
        <div class="grid-card-inner">
          <div class="grid-card-front">
            <div class="kanji-display">${item.kanji}</div>
          </div>
          <div class="grid-card-back">
            <div class="kanji-display">${item.kanji}</div>
            <div class="reading-display">${item.reading}</div>
            <div class="meaning-display">${item.meaning}</div>
          </div>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  practiceArea.innerHTML = html;

  const cards = document.querySelectorAll('.grid-card');
  cards.forEach(card => {
    card.addEventListener('click', function() {
      cards.forEach(c => { if (c !== this) c.classList.remove('flipped'); });
      this.classList.toggle('flipped');
    });
  });

  document.getElementById('refresh-grid-btn').addEventListener('click', () => {
    // Ambil ulang dari pool yang sama (tanpa filter histori, karena ini hanya mengacak ulang sesi yang sama)
    let pool = getSelectedItems();
    pool = shuffleArray(pool);
    let desiredCount = parseInt(cardCountInput.value, 10);
    currentItems = pool.slice(0, Math.min(desiredCount, pool.length));
    renderFlashcard();
  });
}

// ================= MULTIPLE CHOICE =================
function renderMultipleChoice(type) {
  if (currentIndex >= currentItems.length) {
    showCompletionScreen();
    return;
  }

  const item = currentItems[currentIndex];
  const correctAnswer = type === 'meaning' ? item.meaning : item.reading;
  let options = [correctAnswer];
  while (options.length < 4) {
    const randomItem = currentItems[Math.floor(Math.random() * currentItems.length)];
    const distractor = type === 'meaning' ? randomItem.meaning : randomItem.reading;
    if (!options.includes(distractor) && distractor !== correctAnswer) {
      options.push(distractor);
    }
  }
  options = shuffleArray(options);

  const questionText = type === 'meaning' ? 'Apa arti dari kanji berikut?' : 'Bagaimana cara baca kanji berikut?';
  let html = `
    <div class="question-box">
      <div class="question">${item.kanji}</div>
      <p>${questionText}</p>
    </div>
    <div class="options-grid" id="options-container">
  `;
  options.forEach(opt => html += `<button class="option-btn" data-value="${opt}">${opt}</button>`);
  html += `</div><div class="nav-controls"><button id="next-question-btn" disabled>Lanjut ▶</button></div>`;
  practiceArea.innerHTML = html;

  const optionBtns = document.querySelectorAll('.option-btn');
  const nextBtn = document.getElementById('next-question-btn');
  let answered = false;

  optionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (answered) return;
      answered = true;
      const selected = e.target.dataset.value;
      if (selected === correctAnswer) {
        e.target.classList.add('correct');
        score++;
      } else {
        e.target.classList.add('wrong');
        optionBtns.forEach(b => { if (b.dataset.value === correctAnswer) b.classList.add('correct'); });
      }
      nextBtn.disabled = false;
    });
  });

  nextBtn.addEventListener('click', () => {
    currentIndex++;
    renderMultipleChoice(type);
  });
}

// ================= MODE MENULIS (KANJI / BACAAN) =================
function renderWriting(submode) {
  if (currentIndex >= currentItems.length) {
    showCompletionScreen();
    return;
  }

  const item = currentItems[currentIndex];
  const promptText = submode === 'kanji'
    ? `Tulis kanji untuk: <strong>${item.meaning}</strong> (${item.reading})`
    : `Tulis cara baca (hiragana) untuk: <span class="kanji-large" style="font-size:3rem;">${item.kanji}</span>`;

  let html = `
    <div class="question-box">
      <p>${promptText}</p>
    </div>
    <div class="writing-input-area">
      <input type="text" id="writing-input" placeholder="${submode === 'kanji' ? 'Tulis kanji...' : 'Tulis hiragana...'}" autocomplete="off" autofocus>
      <button id="submit-writing-btn" class="btn-primary">Periksa</button>
    </div>
    <div id="writing-feedback" class="feedback"></div>
    <div class="nav-controls">
      <button id="next-question-btn" disabled>Lanjut ▶</button>
    </div>
  `;
  practiceArea.innerHTML = html;

  const input = document.getElementById('writing-input');
  const submitBtn = document.getElementById('submit-writing-btn');
  const feedbackDiv = document.getElementById('writing-feedback');
  const nextBtn = document.getElementById('next-question-btn');
  let answered = false;

  function checkAnswer() {
    if (answered) return;
    const userAnswer = input.value.trim();
    const correct = submode === 'kanji' ? item.kanji : item.reading;
    if (userAnswer === correct) {
      feedbackDiv.innerHTML = '✅ Benar!';
      feedbackDiv.style.color = '#28a745';
      score++;
      answered = true;
      nextBtn.disabled = false;
      submitBtn.disabled = true;
      input.disabled = true;
    } else {
      feedbackDiv.innerHTML = `❌ Salah. Coba lagi.`;
      feedbackDiv.style.color = '#dc3545';
      input.focus();
    }
  }

  submitBtn.addEventListener('click', checkAnswer);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });

  nextBtn.addEventListener('click', () => {
    currentIndex++;
    renderWriting(submode);
  });
}

// ================= MENCOCOKKAN =================
function renderMatching() {
  let availablePool = currentItems.filter(item => !usedMatchingItems.includes(item.kanji));
  if (availablePool.length === 0) {
    practiceArea.innerHTML = `
      <div class="placeholder">🎉 Semua kanji sudah dicocokkan!</div>
      <div style="text-align:center; margin-top:1rem;">
        <button id="reset-matching-full" class="btn-primary">Reset Pasangan & Mulai Baru</button>
      </div>
    `;
    document.getElementById('reset-matching-full').addEventListener('click', () => {
      usedMatchingItems = [];
      renderMatching();
    });
    return;
  }

  const maxPairs = Math.min(8, availablePool.length);
  const selectedItems = shuffleArray([...availablePool]).slice(0, maxPairs);
  selectedItems.forEach(item => usedMatchingItems.push(item.kanji));

  const kanjis = shuffleArray([...selectedItems]);
  const meanings = shuffleArray([...selectedItems]);

  let html = `
    <div class="matching-pairs">
      <div class="kanji-column"><h3>Kanji</h3><div id="kanji-list">`;
  kanjis.forEach(item => html += `<div class="matching-item" data-type="kanji" data-id="${item.kanji}" data-pair="${item.meaning}">${item.kanji}</div>`);
  html += `</div></div><div class="meaning-column"><h3>Arti</h3><div id="meaning-list">`;
  meanings.forEach(item => html += `<div class="matching-item" data-type="meaning" data-id="${item.meaning}" data-pair="${item.kanji}">${item.meaning}</div>`);
  html += `</div></div></div>
    <div class="nav-controls">
      <button id="shuffle-matching-btn">🔄 Acak Ulang</button>
      <button id="reset-matching-hist-btn">🗑️ Reset Pasangan</button>
      <span id="match-score">Pasangan: 0/${selectedItems.length}</span>
    </div>`;
  practiceArea.innerHTML = html;

  let selectedKanji = null;
  let matchedCount = 0;
  const matchScoreSpan = document.getElementById('match-score');
  const totalPairs = selectedItems.length;

  function updateMatchScore() {
    matchScoreSpan.textContent = `Pasangan: ${matchedCount}/${totalPairs}`;
    if (matchedCount === totalPairs) setTimeout(() => alert('🎉 Selamat!'), 100);
  }

  const attachEvents = () => {
    document.querySelectorAll('.matching-item').forEach(el => {
      el.removeEventListener('click', clickHandler);
      el.addEventListener('click', clickHandler);
    });
  };

  function clickHandler(e) {
    const el = e.currentTarget;
    if (el.classList.contains('matched')) return;
    if (el.dataset.type === 'kanji') {
      document.querySelectorAll('[data-type="kanji"]').forEach(k => k.classList.remove('selected'));
      el.classList.add('selected');
      selectedKanji = el;
    } else {
      if (!selectedKanji) { alert('Pilih kanji dulu!'); return; }
      const kanjiEl = selectedKanji;
      if (kanjiEl.dataset.pair === el.dataset.id) {
        kanjiEl.classList.add('matched');
        el.classList.add('matched');
        kanjiEl.classList.remove('selected');
        matchedCount++;
        updateMatchScore();
        selectedKanji = null;
      } else {
        alert('Pasangan tidak cocok!');
        kanjiEl.classList.remove('selected');
        selectedKanji = null;
      }
    }
  }

  attachEvents();
  document.getElementById('shuffle-matching-btn').addEventListener('click', () => renderMatching());
  document.getElementById('reset-matching-hist-btn').addEventListener('click', () => {
    usedMatchingItems = [];
    renderMatching();
  });
  updateMatchScore();
}

// ================= TAMPILAN SELESAI =================
function showCompletionScreen() {
  practiceArea.innerHTML = `
    <div class="placeholder">🎉 Latihan selesai! Skor: ${score}/${currentItems.length}</div>
  `;
}

// ================= UTILITY =================
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ================= EVENT LISTENER =================
startBtn.addEventListener('click', () => startPractice(true));

repeatSessionBtn.addEventListener('click', () => {
  // Ulangi sesi dengan kanji yang sama (currentItems) tanpa filter histori
  if (currentItems.length > 0) {
    currentIndex = 0;
    score = 0;
    renderPractice();
  } else {
    alert('Tidak ada sesi aktif.');
  }
});

newSessionBtn.addEventListener('click', () => {
  // Latihan baru: filter histori
  startPractice(true);
});

resetHistoryBtn.addEventListener('click', () => {
  practicedKanjiSet.clear();
  updateHistoriCount();
  alert('Histori telah direset. Sekarang semua kanji tersedia kembali.');
  // Tidak otomatis memulai latihan, user harus klik "Mulai Latihan" atau "Latihan Baru"
});

// Inisialisasi
initBookSelect();
updateHistoriCount();
