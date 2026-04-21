// script.js
let currentBook = '';
let currentLesson = '';
let currentMode = '';
let currentItems = [];
let currentIndex = 0;
let score = 0;

// Untuk matching: menyimpan pasangan yang sudah pernah digunakan dalam sesi
let usedMatchingItems = [];

// DOM Elements
const bookSelect = document.getElementById('book-select');
const lessonSelect = document.getElementById('lesson-select');
const modeSelect = document.getElementById('mode-select');
const startBtn = document.getElementById('start-btn');
const practiceArea = document.getElementById('practice-area');
const cardCountInput = document.getElementById('card-count');

// ---------- INISIALISASI DROPDOWN ----------
function initBookSelect() {
  const books = Object.keys(kanjiData);

  const allBooksOption = document.createElement('option');
  allBooksOption.value = 'all';
  allBooksOption.textContent = '📚 Semua Buku';
  bookSelect.appendChild(allBooksOption);

  books.forEach(book => {
    const option = document.createElement('option');
    option.value = book;
    option.textContent = book;
    bookSelect.appendChild(option);
  });

  if (books.length > 0) {
    bookSelect.value = books[0];
    updateLessonSelect(books[0]);
  }
}

function updateLessonSelect(book) {
  lessonSelect.innerHTML = '<option value="">-- Pilih Pelajaran --</option>';

  if (book === 'all') {
    lessonSelect.disabled = true;
    const option = document.createElement('option');
    option.value = 'all';
    option.textContent = '📖 Semua Pelajaran (otomatis)';
    lessonSelect.appendChild(option);
    lessonSelect.value = 'all';
    return;
  }

  lessonSelect.disabled = false;
  const lessons = Object.keys(kanjiData[book]);
  lessons.forEach(lesson => {
    const option = document.createElement('option');
    option.value = lesson;
    option.textContent = lesson;
    lessonSelect.appendChild(option);
  });

  const allLessonsOption = document.createElement('option');
  allLessonsOption.value = 'all';
  allLessonsOption.textContent = '📖 Semua Pelajaran (dalam buku ini)';
  lessonSelect.appendChild(allLessonsOption);

  if (lessons.length > 0) {
    lessonSelect.value = lessons[0];
  }
}

bookSelect.addEventListener('change', (e) => {
  updateLessonSelect(e.target.value);
});

// ---------- FUNGSI PENGAMBILAN ITEM ----------
function getItemsBySelection(book, lesson) {
  let items = [];
  if (book === 'all') {
    for (let b in kanjiData) {
      for (let l in kanjiData[b]) {
        items = items.concat(kanjiData[b][l]);
      }
    }
  } else if (lesson === 'all') {
    for (let l in kanjiData[book]) {
      items = items.concat(kanjiData[book][l]);
    }
  } else {
    items = kanjiData[book][lesson] || [];
  }
  return items;
}

// ---------- MEMULAI LATIHAN ----------
function startPractice() {
  const book = bookSelect.value;
  let lesson = lessonSelect.value;

  if (!book || !lesson) {
    alert('Silakan pilih buku dan pelajaran.');
    return;
  }
  if (book === 'all') lesson = 'all';

  currentBook = book;
  currentLesson = lesson;
  currentMode = modeSelect.value;

  let allItems = getItemsBySelection(book, lesson);
  allItems = shuffleArray(allItems);
  let desiredCount = parseInt(cardCountInput.value, 10);
  if (isNaN(desiredCount) || desiredCount < 1) desiredCount = 20;
  const maxItems = Math.min(desiredCount, allItems.length);
  currentItems = allItems.slice(0, maxItems);
  currentIndex = 0;
  score = 0;
  usedMatchingItems = []; // reset histori matching

  if (currentItems.length === 0) {
    practiceArea.innerHTML = '<div class="placeholder">❌ Tidak ada kanji yang ditemukan.</div>';
    return;
  }
  renderPractice();
}

function renderPractice() {
  switch (currentMode) {
    case 'flashcard':
      renderFlashcard();
      break;
    case 'multiple-meaning':
      renderMultipleChoice('meaning');
      break;
    case 'multiple-reading':
      renderMultipleChoice('reading');
      break;
    case 'writing':
      renderFindKanji();
      break;
    case 'matching':
      renderMatching();
      break;
    default:
      practiceArea.innerHTML = '<div class="placeholder">Mode belum tersedia.</div>';
  }
}

// ================= FLASHCARD (tanpa histori) =================
function renderFlashcard() {
  let itemsToShow = currentItems; // sudah dipotong dan diacak di startPractice
  if (itemsToShow.length === 0) {
    practiceArea.innerHTML = '<div class="placeholder">Tidak ada kanji.</div>';
    return;
  }

  let html = `
    <div class="flashcard-grid-controls" style="margin-bottom:1rem;">
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
      cards.forEach(c => {
        if (c !== this && c.classList.contains('flipped')) c.classList.remove('flipped');
      });
      this.classList.toggle('flipped');
    });
  });

  document.getElementById('refresh-grid-btn').addEventListener('click', () => {
    // Ambil ulang dari pool yang sama, acak, potong sesuai jumlah
    let allItems = getItemsBySelection(currentBook, currentLesson);
    allItems = shuffleArray(allItems);
    let desiredCount = parseInt(cardCountInput.value, 10);
    if (isNaN(desiredCount) || desiredCount < 1) desiredCount = 20;
    currentItems = allItems.slice(0, Math.min(desiredCount, allItems.length));
    renderFlashcard();
  });
}

// ================= MULTIPLE CHOICE (Arti / Bacaan) =================
function renderMultipleChoice(type) {
  if (currentIndex >= currentItems.length) {
    practiceArea.innerHTML = `
      <div class="placeholder">🎉 Latihan selesai! Skor: ${score}/${currentItems.length}</div>
      <div style="text-align:center; margin-top:1rem;">
        <button id="repeat-session-btn" class="btn-primary">🔄 Ulangi Latihan</button>
      </div>
    `;
    const repeatBtn = document.getElementById('repeat-session-btn');
    if (repeatBtn) repeatBtn.addEventListener('click', () => {
      // Acak ulang urutan currentItems
      currentItems = shuffleArray(currentItems);
      currentIndex = 0;
      score = 0;
      renderMultipleChoice(type);
    });
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

  const questionText = type === 'meaning'
    ? `Apa arti dari kanji berikut?`
    : `Bagaimana cara baca kanji berikut?`;

  let html = `
    <div class="question-box">
      <div class="question">${item.kanji}</div>
      <p>${questionText}</p>
    </div>
    <div class="options-grid" id="options-container">
  `;
  options.forEach(opt => {
    html += `<button class="option-btn" data-value="${opt}">${opt}</button>`;
  });
  html += `</div>
    <div class="nav-controls">
      <button id="next-question-btn" disabled>Lanjut ▶</button>
    </div>
  `;
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
        optionBtns.forEach(b => {
          if (b.dataset.value === correctAnswer) b.classList.add('correct');
        });
      }
      nextBtn.disabled = false;
    });
  });

  nextBtn.addEventListener('click', () => {
    currentIndex++;
    renderMultipleChoice(type);
  });
}

// ================= TEMUKAN KANJI (pengganti writing) =================
function renderFindKanji() {
  if (currentIndex >= currentItems.length) {
    practiceArea.innerHTML = `
      <div class="placeholder">🎉 Latihan selesai! Skor: ${score}/${currentItems.length}</div>
      <div style="text-align:center; margin-top:1rem;">
        <button id="repeat-session-btn" class="btn-primary">🔄 Ulangi Latihan</button>
      </div>
    `;
    const repeatBtn = document.getElementById('repeat-session-btn');
    if (repeatBtn) repeatBtn.addEventListener('click', () => {
      currentItems = shuffleArray(currentItems);
      currentIndex = 0;
      score = 0;
      renderFindKanji();
    });
    return;
  }

  const item = currentItems[currentIndex];
  const correctKanji = item.kanji;
  let options = [correctKanji];
  // ambil 3 kanji berbeda dari item lain
  const otherItems = currentItems.filter(i => i.kanji !== correctKanji);
  const shuffledOthers = shuffleArray([...otherItems]);
  for (let i = 0; i < 3 && i < shuffledOthers.length; i++) {
    if (!options.includes(shuffledOthers[i].kanji)) {
      options.push(shuffledOthers[i].kanji);
    }
  }
  // jika kurang (misal total item sedikit), tambahkan duplikat (tidak ideal tapi aman)
  while (options.length < 4) options.push(correctKanji);
  options = shuffleArray(options);

  let html = `
    <div class="question-box">
      <div class="question" style="background:none; font-size:1.5rem;">Arti: ${item.meaning}</div>
      <p>Bacaan: ${item.reading}</p>
      <p><strong>Pilih kanji yang tepat:</strong></p>
    </div>
    <div class="options-grid" id="options-container">
  `;
  options.forEach(kanji => {
    html += `<button class="option-btn" data-value="${kanji}">${kanji}</button>`;
  });
  html += `</div>
    <div class="nav-controls">
      <button id="next-question-btn" disabled>Lanjut ▶</button>
    </div>
  `;
  practiceArea.innerHTML = html;

  const optionBtns = document.querySelectorAll('.option-btn');
  const nextBtn = document.getElementById('next-question-btn');
  let answered = false;

  optionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (answered) return;
      answered = true;
      const selected = e.target.dataset.value;
      if (selected === correctKanji) {
        e.target.classList.add('correct');
        score++;
      } else {
        e.target.classList.add('wrong');
        optionBtns.forEach(b => {
          if (b.dataset.value === correctKanji) b.classList.add('correct');
        });
      }
      nextBtn.disabled = false;
    });
  });

  nextBtn.addEventListener('click', () => {
    currentIndex++;
    renderFindKanji();
  });
}

// ================= MENCOCOKKAN (dengan histori) =================
function renderMatching() {
  // Ambil item yang belum pernah digunakan di sesi matching ini
  let availablePool = currentItems.filter(item => !usedMatchingItems.includes(item.kanji));
  if (availablePool.length === 0) {
    practiceArea.innerHTML = `
      <div class="placeholder">🎉 Semua kanji sudah pernah digunakan dalam permainan mencocokkan!</div>
      <div style="text-align:center; margin-top:1rem;">
        <button id="reset-matching-full" class="btn-primary">Reset Histori & Mulai Baru</button>
      </div>
    `;
    const resetBtn = document.getElementById('reset-matching-full');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      usedMatchingItems = [];
      renderMatching();
    });
    return;
  }

  // Ambil maksimal 8 pasang dari pool yang tersedia
  const maxPairs = Math.min(8, availablePool.length);
  const selectedItems = shuffleArray([...availablePool]).slice(0, maxPairs);
  // Tandai sebagai sudah digunakan
  selectedItems.forEach(item => usedMatchingItems.push(item.kanji));

  const kanjis = shuffleArray([...selectedItems]);
  const meanings = shuffleArray([...selectedItems]);

  let html = `
    <div class="matching-pairs">
      <div class="kanji-column">
        <h3>Kanji</h3>
        <div id="kanji-list">
  `;
  kanjis.forEach(item => {
    html += `<div class="matching-item" data-type="kanji" data-id="${item.kanji}" data-pair="${item.meaning}">${item.kanji}</div>`;
  });
  html += `</div></div><div class="meaning-column"><h3>Arti</h3><div id="meaning-list">`;
  meanings.forEach(item => {
    html += `<div class="matching-item" data-type="meaning" data-id="${item.meaning}" data-pair="${item.kanji}">${item.meaning}</div>`;
  });
  html += `</div></div></div>
    <div class="nav-controls">
      <button id="shuffle-matching-btn">🔄 Acak Ulang (Pasangan Baru)</button>
      <button id="reset-matching-hist-btn">🗑️ Reset Histori</button>
      <span id="match-score">Pasangan: 0/${selectedItems.length}</span>
    </div>
  `;

  practiceArea.innerHTML = html;

  let selectedKanji = null;
  let matchedCount = 0;
  const matchScoreSpan = document.getElementById('match-score');
  const totalPairs = selectedItems.length;

  function updateMatchScore() {
    matchScoreSpan.textContent = `Pasangan: ${matchedCount}/${totalPairs}`;
    if (matchedCount === totalPairs) {
      setTimeout(() => alert('🎉 Selamat! Semua pasangan cocok!'), 100);
    }
  }

  const attachEvents = () => {
    const allItemsEl = document.querySelectorAll('.matching-item');
    allItemsEl.forEach(el => {
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
      if (!selectedKanji) {
        alert('Pilih kanji dulu!');
        return;
      }
      const kanjiEl = selectedKanji;
      const meaningEl = el;
      if (kanjiEl.dataset.pair === meaningEl.dataset.id) {
        kanjiEl.classList.add('matched');
        meaningEl.classList.add('matched');
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

  document.getElementById('shuffle-matching-btn').addEventListener('click', () => {
    renderMatching(); // ambil pasangan baru dari pool (histori tetap, jadi tidak akan mengulang yang sudah pernah)
  });

  document.getElementById('reset-matching-hist-btn').addEventListener('click', () => {
    usedMatchingItems = [];
    renderMatching();
  });

  updateMatchScore();
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
startBtn.addEventListener('click', startPractice);
initBookSelect();
