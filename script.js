// script.js
let currentBook = '';
let currentLesson = '';
let currentMode = '';
let currentItems = [];
let currentIndex = 0;
let score = 0;

// DOM Elements
const bookSelect = document.getElementById('book-select');
const lessonSelect = document.getElementById('lesson-select');
const modeSelect = document.getElementById('mode-select');
const startBtn = document.getElementById('start-btn');
const practiceArea = document.getElementById('practice-area');

// Inisialisasi dropdown buku
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
    updateLessonSelect(books[0]);
  }
}

// Update dropdown pelajaran berdasarkan buku terpilih
function updateLessonSelect(book) {
  lessonSelect.innerHTML = '<option value="">-- Pilih Pelajaran --</option>';
  lessonSelect.disabled = !book;
  if (!book) return;
  
  const lessons = Object.keys(kanjiData[book]);
  lessons.forEach(lesson => {
    const option = document.createElement('option');
    option.value = lesson;
    option.textContent = lesson;
    lessonSelect.appendChild(option);
  });
  if (lessons.length > 0) {
    lessonSelect.value = lessons[0];
  }
}

bookSelect.addEventListener('change', (e) => {
  updateLessonSelect(e.target.value);
});

// Fungsi untuk memulai latihan
function startPractice() {
  const book = bookSelect.value;
  const lesson = lessonSelect.value;
  const mode = modeSelect.value;
  
  if (!book || !lesson) {
    alert('Silakan pilih buku dan pelajaran.');
    return;
  }
  
  currentBook = book;
  currentLesson = lesson;
  currentMode = mode;
  currentItems = [...kanjiData[book][lesson]]; // copy array
  currentIndex = 0;
  score = 0;
  
  if (currentItems.length === 0) {
    practiceArea.innerHTML = '<div class="placeholder">❌ Tidak ada kanji di pelajaran ini.</div>';
    return;
  }
  
  // Acak urutan (opsional)
  // currentItems = shuffleArray(currentItems);
  
  renderPractice();
}

// Render berdasarkan mode
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

// ---------- FLASHCARD ----------
function renderFlashcard() {
  if (currentIndex >= currentItems.length) {
    practiceArea.innerHTML = `<div class="placeholder">🎉 Latihan selesai! <br> Skor: ${score}/${currentItems.length}</div>`;
    return;
  }
  
  const item = currentItems[currentIndex];
  const html = `
    <div class="flashcard-container">
      <div class="flashcard" id="flashcard">
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <div class="kanji-large">${item.kanji}</div>
            <div style="margin-top: 1rem; color: #6c757d;">(Klik untuk lihat arti & bacaan)</div>
          </div>
          <div class="flashcard-back">
            <div class="meaning">${item.meaning}</div>
            <div class="reading">${item.reading}</div>
          </div>
        </div>
      </div>
      <div class="nav-controls">
        <button id="prev-btn" ${currentIndex === 0 ? 'disabled' : ''}>◀ Sebelumnya</button>
        <span>${currentIndex + 1} / ${currentItems.length}</span>
        <button id="next-btn">Selanjutnya ▶</button>
      </div>
    </div>
  `;
  practiceArea.innerHTML = html;
  
  const flashcard = document.getElementById('flashcard');
  flashcard.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
  });
  
  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderFlashcard();
    }
  });
  
  document.getElementById('next-btn').addEventListener('click', () => {
    currentIndex++;
    renderFlashcard();
  });
}

// ---------- MULTIPLE CHOICE ----------
function renderMultipleChoice(type) {
  if (currentIndex >= currentItems.length) {
    practiceArea.innerHTML = `<div class="placeholder">🎉 Latihan selesai! Skor: ${score}/${currentItems.length}</div>`;
    return;
  }
  
  const item = currentItems[currentIndex];
  // Siapkan opsi (3 salah + 1 benar)
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
  // Ambil semua item (bisa dibatasi 6 untuk tampilan)
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
        // Hapus selected dari kanji lain
        document.querySelectorAll('[data-type="kanji"]').forEach(k => k.classList.remove('selected'));
        el.classList.add('selected');
        selectedKanji = el;
      } else {
        // meaning diklik
        if (!selectedKanji) {
          alert('Pilih kanji dulu!');
          return;
        }
        
        const kanjiEl = selectedKanji;
        const meaningEl = el;
        
        // Cek kecocokan
        if (kanjiEl.dataset.pair === meaningEl.dataset.id) {
          // Cocok
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