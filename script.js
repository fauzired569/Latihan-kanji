// script.js
let currentBook = '';
let currentLesson = '';
let currentMode = '';
let currentItems = [];
let currentIndex = 0;
let score = 0;

// Histori kanji yang sudah pernah ditampilkan di mode flashcard
let displayedKanjiHistory = JSON.parse(localStorage.getItem('kanjiMasterDisplayed')) || [];

// DOM Elements
const bookSelect = document.getElementById('book-select');
const lessonSelect = document.getElementById('lesson-select');
const modeSelect = document.getElementById('mode-select');
const startBtn = document.getElementById('start-btn');
const practiceArea = document.getElementById('practice-area');

// ---------- INISIALISASI DROPDOWN ----------
function initBookSelect() {
  const books = Object.keys(kanjiData);

  // Tambahkan opsi "Semua Buku" di awal
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

  // Jika "Semua Buku" dipilih, tampilkan pesan khusus atau langsung set pelajaran "all"
  if (book === 'all') {
    lessonSelect.disabled = true;
    // Buat opsi default saja
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

  // Tambahkan opsi "Semua Pelajaran" di akhir
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

// ---------- FUNGSI PENGAMBILAN ITEM BERDASARKAN PILIHAN ----------
function getItemsBySelection(book, lesson) {
  let items = [];

  // Kasus 1: Semua Buku
  if (book === 'all') {
    for (let b in kanjiData) {
      for (let l in kanjiData[b]) {
        items = items.concat(kanjiData[b][l]);
      }
    }
  }
  // Kasus 2: Buku tertentu, semua pelajaran
  else if (lesson === 'all') {
    for (let l in kanjiData[book]) {
      items = items.concat(kanjiData[book][l]);
    }
  }
  // Kasus 3: Buku dan pelajaran spesifik
  else {
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

  // Jika buku "all", otomatis lesson dianggap "all"
  if (book === 'all') {
    lesson = 'all';
  }

  currentBook = book;
  currentLesson = lesson;
  currentMode = modeSelect.value;

  // Ambil item sesuai pilihan
  currentItems = getItemsBySelection(book, lesson);

  // Acak urutan (direkomendasikan untuk campuran)
  currentItems = shuffleArray(currentItems);

  currentIndex = 0;
  score = 0;

  if (currentItems.length === 0) {
    practiceArea.innerHTML = '<div class="placeholder">❌ Tidak ada kanji yang ditemukan.</div>';
    return;
  }

  renderPractice();
}

// ---------- RENDER BERDASARKAN MODE ----------
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
      renderWriting();
      break;
    case 'matching':
      renderMatching();
      break;
    default:
      practiceArea.innerHTML = '<div class="placeholder">Mode belum tersedia.</div>';
  }
}

// ---------- FLASHCARD MODE (GRID + HISTORI) ----------
function renderFlashcard() {
  const container = practiceArea;
  
  // Ambil semua kanji dari pilihan saat ini (sudah diacak di startPractice)
  const allItems = currentItems;
  
  // Filter yang belum pernah muncul
  const availableItems = allItems.filter(item => 
    !displayedKanjiHistory.includes(item.kanji)
  );
  
  // Jika tidak ada yang tersedia, tampilkan pesan dan tombol reset
  if (availableItems.length === 0) {
    container.innerHTML = `
      <div class="flashcard-grid-empty">
        <p>🎉 Semua kanji dari pilihan ini sudah pernah ditampilkan!</p>
        <button id="reset-history-btn" class="btn-primary">Reset Histori & Tampilkan Ulang</button>
      </div>
    `;
    document.getElementById('reset-history-btn').addEventListener('click', () => {
      resetDisplayedHistory();
      // Setelah reset, render ulang
      currentItems = getItemsBySelection(currentBook, currentLesson);
      currentItems = shuffleArray(currentItems);
      renderFlashcard();
    });
    return;
  }
  
  // Tentukan jumlah kartu yang akan ditampilkan (maksimal 20)
  const maxCards = Math.min(20, availableItems.length);
  
  // Ambil sejumlah kartu secara acak dari yang tersedia
  const shuffled = shuffleArray([...availableItems]);
  const itemsToShow = shuffled.slice(0, maxCards);
  
  // Tambahkan ke histori
  itemsToShow.forEach(item => {
    if (!displayedKanjiHistory.includes(item.kanji)) {
      displayedKanjiHistory.push(item.kanji);
    }
  });
  localStorage.setItem('kanjiMasterDisplayed', JSON.stringify(displayedKanjiHistory));
  
  // Bangun HTML grid
  let html = `
    <div class="flashcard-stats">
      <div class="stat-box">
        <span class="stat-label">Total Kanji Tersedia</span>
        <span class="stat-number">${allItems.length}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Sudah Muncul</span>
        <span class="stat-number">${displayedKanjiHistory.length}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Belum Muncul</span>
        <span class="stat-number">${allItems.length - displayedKanjiHistory.length}</span>
      </div>
    </div>
    
    <div class="flashcard-grid-controls">
      <button id="refresh-grid-btn" class="btn-secondary">🔄 Acak & Tampilkan Baru</button>
      <button id="reset-history-grid-btn" class="btn-warning">🗑️ Reset Histori</button>
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
  container.innerHTML = html;
  
  // Tambahkan event listener ke setiap kartu
  const cards = document.querySelectorAll('.grid-card');
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Tutup kartu lain yang terbuka
      cards.forEach(c => {
        if (c !== this && c.classList.contains('flipped')) {
          c.classList.remove('flipped');
        }
      });
      // Flip kartu ini
      this.classList.toggle('flipped');
    });
  });
  
  // Event untuk tombol refresh (tampilkan set baru)
  document.getElementById('refresh-grid-btn').addEventListener('click', () => {
    renderFlashcard();
  });
  
  document.getElementById('reset-history-grid-btn').addEventListener('click', () => {
    resetDisplayedHistory();
    renderFlashcard();
  });
}

function resetDisplayedHistory() {
  displayedKanjiHistory = [];
  localStorage.removeItem('kanjiMasterDisplayed');
}

// ---------- MULTIPLE CHOICE ----------
function renderMultipleChoice(type) {
  if (currentIndex >= currentItems.length) {
    practiceArea.innerHTML = `<div class="placeholder">🎉 Latihan selesai! Skor: ${score}/${currentItems.length}</div>`;
    return;
  }

  const item = currentItems[currentIndex];
  const correctAnswer = type === 'meaning' ? item.meaning : item.reading;
  let options = [correctAnswer];

  // Ambil jawaban salah dari item lain
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
        // Tunjukkan jawaban benar
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

// ---------- WRITING ----------
function renderWriting() {
  if (currentIndex >= currentItems.length) {
    practiceArea.innerHTML = `<div class="placeholder">🎉 Latihan selesai! Skor: ${score}/${currentItems.length}</div>`;
    return;
  }

  const item = currentItems[currentIndex];
  const html = `
    <div class="question-box">
      <div class="question">Arti: ${item.meaning}</div>
      <p>Bacaan: ${item.reading}</p>
      <p><strong>Tulis kanji yang tepat:</strong></p>
    </div>
    <div class="writing-input-area">
      <input type="text" id="writing-input" placeholder="漢字" autocomplete="off">
      <button id="check-writing-btn" class="btn-primary">Periksa</button>
    </div>
    <div class="feedback" id="writing-feedback"></div>
    <div class="nav-controls">
      <button id="next-writing-btn" disabled>Lanjut ▶</button>
    </div>
  `;
  practiceArea.innerHTML = html;

  const input = document.getElementById('writing-input');
  const checkBtn = document.getElementById('check-writing-btn');
  const feedback = document.getElementById('writing-feedback');
  const nextBtn = document.getElementById('next-writing-btn');
  let answered = false;

  checkBtn.addEventListener('click', () => {
    if (answered) return;
    const answer = input.value.trim();
    if (answer === item.kanji) {
      feedback.textContent = '✅ Benar!';
      feedback.style.color = 'green';
      score++;
      answered = true;
      nextBtn.disabled = false;
    } else {
      feedback.textContent = `❌ Salah. Jawaban: ${item.kanji}`;
      feedback.style.color = 'red';
      answered = true;
      nextBtn.disabled = false;
    }
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !answered) {
      checkBtn.click();
    }
  });

  nextBtn.addEventListener('click', () => {
    currentIndex++;
    renderWriting();
  });
}

// ---------- MATCHING ----------
function renderMatching() {
  const items = currentItems.slice(0, 8); // maks 8 pasang
  const kanjis = shuffleArray([...items]);
  const meanings = shuffleArray([...items]);

  let html = `
    <div class="matching-pairs">
      <div class="kanji-column">
        <h3>Kanji</h3>
        <div id="kanji-list">
  `;
  kanjis.forEach((item, idx) => {
    html += `<div class="matching-item" data-type="kanji" data-id="${item.kanji}" data-pair="${item.meaning}">${item.kanji}</div>`;
  });
  html += `</div></div><div class="meaning-column"><h3>Arti</h3><div id="meaning-list">`;
  meanings.forEach((item, idx) => {
    html += `<div class="matching-item" data-type="meaning" data-id="${item.meaning}" data-pair="${item.kanji}">${item.meaning}</div>`;
  });
  html += `</div></div></div>
    <div class="nav-controls">
      <button id="reset-matching-btn">🔄 Acak Ulang</button>
      <span id="match-score">Pasangan: 0/${items.length}</span>
    </div>
  `;

  practiceArea.innerHTML = html;

  let selectedKanji = null;
  let matchedCount = 0;
  const matchScoreSpan = document.getElementById('match-score');

  const allItems = document.querySelectorAll('.matching-item');
  const resetBtn = document.getElementById('reset-matching-btn');

  function updateMatchScore() {
    matchScoreSpan.textContent = `Pasangan: ${matchedCount}/${items.length}`;
    if (matchedCount === items.length) {
      setTimeout(() => alert('🎉 Selamat! Semua pasangan cocok!'), 100);
    }
  }

  allItems.forEach(el => {
    el.addEventListener('click', (e) => {
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
    });
  });

  resetBtn.addEventListener('click', () => {
    renderMatching();
  });

  updateMatchScore();
}

// ---------- UTILITY ----------
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------- EVENT LISTENERS ----------
startBtn.addEventListener('click', startPractice);

// Inisialisasi awal
initBookSelect();