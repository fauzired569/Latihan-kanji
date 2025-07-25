<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Latihan Kanji - Flashcard Interaktif</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            padding: 30px 0;
            background: #2c3e50;
            color: white;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.8;
        }
        
        .main-content {
            display: flex;
            gap: 30px;
            margin-bottom: 30px;
        }
        
        @media (max-width: 768px) {
            .main-content {
                flex-direction: column;
            }
        }
        
        .control-panel {
            flex: 1;
            background: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .book-section {
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .book-title {
            font-size: 1.4rem;
            color: #2c3e50;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #3498db;
        }
        
        .lesson-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 12px;
        }
        
        .lesson-checkbox {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: #f8f9fa;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid #e0e0e0;
        }
        
        .lesson-checkbox:hover {
            background: #e3f2fd;
            border-color: #bbdefb;
        }
        
        .lesson-checkbox input {
            cursor: pointer;
        }
        
        .controls {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        input[type="number"] {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
        }
        
        .btn {
            display: inline-block;
            width: 100%;
            padding: 14px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .btn:hover {
            background: #2980b9;
        }
        
        .result-area {
            flex: 2;
            background: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .kanji-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .kanji-card {
            aspect-ratio: 1/1;
            perspective: 1000px;
            cursor: pointer;
        }
        
        .card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.6s;
            transform-style: preserve-3d;
        }
        
        .kanji-card.flipped .card-inner {
            transform: rotateY(180deg);
        }
        
        .card-front, .card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            padding: 10px;
        }
        
        .card-front {
            background: #f8f9fa;
            color: #2c3e50;
        }
        
        .card-back {
            background: #e3f2fd;
            transform: rotateY(180deg);
            color: #2c3e50;
        }
        
        .kanji-character {
            font-size: 3.5rem;
            font-weight: bold;
        }
        
        .kanji-meaning {
            font-size: 1rem;
            margin-top: 5px;
            text-align: center;
        }
        
        .kanji-reading {
            font-size: 0.9rem;
            margin-top: 5px;
            color: #7f8c8d;
            font-style: italic;
        }
        
        .kanji-card:hover .card-front {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .info-panel {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            margin-top: 20px;
            font-size: 1.1rem;
        }
        
        .instructions {
            background: #e8f4fc;
            padding: 20px;
            border-radius: 10px;
            margin-top: 30px;
            border-left: 4px solid #3498db;
        }
        
        .instructions h3 {
            margin-bottom: 15px;
            color: #2c3e50;
        }
        
        .instructions ul {
            padding-left: 20px;
        }
        
        .instructions li {
            margin-bottom: 8px;
        }
        
        .counter {
            background: #3498db;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
            margin-left: 5px;
        }
        
        .no-kanji {
            text-align: center;
            padding: 50px;
            color: #7f8c8d;
            font-size: 1.2rem;
            grid-column: 1 / -1;
        }
        
        .selected-count {
            font-size: 0.9rem;
            color: #7f8c8d;
            margin-top: 5px;
        }
        
        .book-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .select-all {
            font-size: 0.9rem;
            color: #3498db;
            cursor: pointer;
            padding: 3px 8px;
            border-radius: 4px;
        }
        
        .select-all:hover {
            background: #e3f2fd;
        }
        
        .flip-hint {
            text-align: center;
            font-size: 0.9rem;
            color: #7f8c8d;
            margin-top: 15px;
        }
        
        .stats-bar {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        
        .stat-item {
            text-align: center;
            flex: 1;
        }
        
        .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #3498db;
        }
        
        .stat-label {
            font-size: 0.85rem;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Latihan Kanji</h1>
            <p class="subtitle">Aplikasi Flashcard Kanji Interaktif</p>
        </header>
        
        <div class="main-content">
            <div class="control-panel">
                <h2>Pilih Bab Kanji</h2>
                
                <div class="book-section">
                    <div class="book-info">
                        <h3 class="book-title">Buku Dasar</h3>
                        <span class="select-all" onclick="toggleSelectAll('Buku Dasar')">Pilih Semua</span>
                    </div>
                    <div class="lesson-grid" id="book-basic">
                        <!-- Generated by JavaScript -->
                    </div>
                </div>
                
                <div class="book-section">
                    <div class="book-info">
                        <h3 class="book-title">Buku A2-1</h3>
                        <span class="select-all" onclick="toggleSelectAll('Buku A2-1')">Pilih Semua</span>
                    </div>
                    <div class="lesson-grid" id="book-a2-1">
                        <!-- Generated by JavaScript -->
                    </div>
                </div>
                
                <div class="book-section">
                    <div class="book-info">
                        <h3 class="book-title">Buku A2-2</h3>
                        <span class="select-all" onclick="toggleSelectAll('Buku A2-2')">Pilih Semua</span>
                    </div>
                    <div class="lesson-grid" id="book-a2-2">
                        <!-- Generated by JavaScript -->
                    </div>
                </div>
                
                <div class="controls">
                    <div class="form-group">
                        <label for="kanji-count">Jumlah Kanji yang Ditampilkan:</label>
                        <input type="number" id="kanji-count" min="1" max="100" value="20">
                    </div>
                    <button id="show-kanji" class="btn">Tampilkan Kanji</button>
                    <p class="selected-count">Bab terpilih: <span id="selected-lessons-count">0</span></p>
                </div>
            </div>
            
            <div class="result-area">
                <h2>Flashcard Kanji</h2>
                <div class="stats-bar">
                    <div class="stat-item">
                        <div class="stat-value" id="total-kanji">0</div>
                        <div class="stat-label">Total Kanji</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="reviewed-kanji">0</div>
                        <div class="stat-label">Diulas</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="mastered-kanji">0</div>
                        <div class="stat-label">Dikuasai</div>
                    </div>
                </div>
                <div class="kanji-grid" id="kanji-container">
                    <div class="no-kanji">
                        Silakan pilih bab kanji dan tekan "Tampilkan Kanji"
                    </div>
                </div>
                <div class="flip-hint">
                    Klik kartu untuk melihat arti dan cara baca
                </div>
            </div>
        </div>
        
        <div class="instructions">
            <h3>Cara Menggunakan Aplikasi</h3>
            <ul>
                <li>Pilih bab-bab kanji yang ingin Anda pelajari dari daftar yang tersedia</li>
                <li>Tentukan jumlah kanji yang ingin ditampilkan (maksimal 100)</li>
                <li>Klik tombol "Tampilkan Kanji" untuk menampilkan kanji secara acak dari bab yang dipilih</li>
                <li><strong>Klik kartu</strong> untuk melihat arti dan cara baca kanji</li>
                <li>Klik lagi untuk kembali ke tampilan kanji</li>
                <li>Gunakan tombol "Dikuasai" untuk menandai kanji yang sudah Anda hafal</li>
                <li>Untuk latihan tambahan, ganti bab atau jumlah kanji yang ditampilkan</li>
            </ul>
        </div>
    </div>

    <script>
        // Data kanji per buku per bab dengan arti dan cara baca
        const kanjiData = {
            "Buku Dasar": {
                "第一課～第八課": [
                    { kanji: "名前", meaning: "nama", reading: "なまえ" },
                    { kanji: "国", meaning: "negara", reading: "くに" },
                    { kanji: "私", meaning: "saya", reading: "わたし" },
                    { kanji: "父", meaning: "ayah", reading: "ちち" },
                    { kanji: "母", meaning: "ibu", reading: "はは" },
                    { kanji: "子ども", meaning: "anak", reading: "こども" },
                    { kanji: "日本", meaning: "Jepang", reading: "にほん" },
                    { kanji: "水", meaning: "air", reading: "みず" },
                    { kanji: "食べます", meaning: "makan", reading: "たべます" },
                    { kanji: "飲みます", meaning: "minum", reading: "のみます" },
                    { kanji: "魚", meaning: "ikan", reading: "さかな" },
                    { kanji: "肉", meaning: "daging", reading: "にく" },
                    { kanji: "好き", meaning: "suka", reading: "すき" },
                    { kanji: "家", meaning: "rumah", reading: "いえ" },
                    { kanji: "新しい", meaning: "baru", reading: "あたらしい" },
                    { kanji: "広い", meaning: "luas", reading: "ひろい" },
                    { kanji: "古い", meaning: "tua (benda)", reading: "ふるい" },
                    { kanji: "上", meaning: "atas", reading: "うえ" },
                    { kanji: "下", meaning: "bawah", reading: "した" },
                    { kanji: "中", meaning: "tengah/dalam", reading: "なか" }
                ],
                "第九課～第十八課": [
                    { kanji: "朝", meaning: "pagi", reading: "あさ" },
                    { kanji: "昼", meaning: "siang", reading: "ひる" },
                    { kanji: "夜", meaning: "malam", reading: "よる" },
                    { kanji: "読みます", meaning: "membaca", reading: "よみます" },
                    { kanji: "聞きます", meaning: "mendengar", reading: "ききます" },
                    { kanji: "見ます", meaning: "melihat", reading: "みます" },
                    { kanji: "本", meaning: "buku", reading: "ほん" },
                    { kanji: "友だち", meaning: "teman", reading: "ともだち" },
                    { kanji: "何", meaning: "apa", reading: "なに" },
                    { kanji: "今日", meaning: "hari ini", reading: "きょう" },
                    { kanji: "今週", meaning: "minggu ini", reading: "こんしゅう" },
                    { kanji: "今度", meaning: "lain kali", reading: "こんど" },
                    { kanji: "東", meaning: "timur", reading: "ひがし" },
                    { kanji: "南", meaning: "selatan", reading: "みなみ" },
                    { kanji: "西", meaning: "barat", reading: "にし" },
                    { kanji: "北", meaning: "utara", reading: "きた" },
                    { kanji: "会社", meaning: "perusahaan", reading: "かいしゃ" },
                    { kanji: "来ます", meaning: "datang", reading: "きます" },
                    { kanji: "行きます", meaning: "pergi", reading: "いきます" },
                    { kanji: "乗ります", meaning: "naik (kendaraan)", reading: "のります" },
                    { kanji: "大きい", meaning: "besar", reading: "おおきい" },
                    { kanji: "小さい", meaning: "kecil", reading: "ちいさい" },
                    { kanji: "高い", meaning: "tinggi/mahal", reading: "たかい" },
                    { kanji: "低い", meaning: "rendah", reading: "ひくい" },
                    { kanji: "前", meaning: "depan", reading: "まえ" },
                    { kanji: "後ろ", meaning: "belakang", reading: "うしろ" },
                    { kanji: "横", meaning: "samping", reading: "よこ" },
                    { kanji: "入口", meaning: "pintu masuk", reading: "いりぐち" },
                    { kanji: "出口", meaning: "pintu keluar", reading: "でぐち" },
                    { kanji: "～階", meaning: "lantai", reading: "～かい" },
                    { kanji: "押す", meaning: "mendorong", reading: "おす" },
                    { kanji: "引く", meaning: "menarik", reading: "ひく" },
                    { kanji: "安い", meaning: "murah", reading: "やすい" },
                    { kanji: "休み", meaning: "istirahat", reading: "やすみ" },
                    { kanji: "映画", meaning: "film", reading: "えいが" },
                    { kanji: "日本語", meaning: "bahasa Jepang", reading: "にほんご" },
                    { kanji: "勉強", meaning: "belajar", reading: "べんきょう" },
                    { kanji: "買います", meaning: "membeli", reading: "かいます" },
                    { kanji: "温泉", meaning: "pemandian air panas", reading: "おんせん" },
                    { kanji: "予定", meaning: "rencana", reading: "よてい" },
                    { kanji: "来週", meaning: "minggu depan", reading: "らいしゅう" },
                    { kanji: "会います", meaning: "bertemu", reading: "あいます" },
                    { kanji: "入ります", meaning: "masuk", reading: "はいります" },
                    { kanji: "旅行", meaning: "perjalanan", reading: "りょこう" }
                ]
            },
            "Buku A2-1": {
                "第一課": [
                    { kanji: "学生", meaning: "siswa/mahasiswa", reading: "がくせい" },
                    { kanji: "学校", meaning: "sekolah", reading: "がっこう" },
                    { kanji: "生活", meaning: "kehidupan", reading: "せいかつ" },
                    { kanji: "去年", meaning: "tahun lalu", reading: "きょねん" },
                    { kanji: "先週", meaning: "minggu lalu", reading: "せんしゅう" },
                    { kanji: "仕事", meaning: "pekerjaan", reading: "しごと" },
                    { kanji: "元気", meaning: "sehat/bersemangat", reading: "げんき" },
                    { kanji: "忙しい", meaning: "sibuk", reading: "いそがしい" },
                    { kanji: "働く", meaning: "bekerja", reading: "はたらく" },
                    { kanji: "作る", meaning: "membuat", reading: "つくる" }
                ],
                "第二課": [
                    { kanji: "人", meaning: "orang", reading: "ひと" },
                    { kanji: "犬", meaning: "anjing", reading: "いぬ" },
                    { kanji: "家族", meaning: "keluarga", reading: "かぞく" },
                    { kanji: "夕方", meaning: "sore hari", reading: "ゆうがた" },
                    { kanji: "英語", meaning: "bahasa Inggris", reading: "えいご" },
                    { kanji: "音楽", meaning: "musik", reading: "おんがく" },
                    { kanji: "習う", meaning: "belajar (keterampilan)", reading: "ならう" },
                    { kanji: "話す", meaning: "berbicara", reading: "はなす" },
                    { kanji: "出かける", meaning: "pergi keluar", reading: "でかける" }
                ],
                "第三課": [
                    { kanji: "季節", meaning: "musim", reading: "きせつ" },
                    { kanji: "春", meaning: "musim semi", reading: "はる" },
                    { kanji: "夏", meaning: "musim panas", reading: "なつ" },
                    { kanji: "秋", meaning: "musim gugur", reading: "あき" },
                    { kanji: "冬", meaning: "musim dingin", reading: "ふゆ" },
                    { kanji: "花", meaning: "bunga", reading: "はな" },
                    { kanji: "同じ", meaning: "sama", reading: "おなじ" },
                    { kanji: "暑い", meaning: "panas (cuaca)", reading: "あつい" },
                    { kanji: "寒い", meaning: "dingin", reading: "さむい" }
                ],
                "第四課": [
                    { kanji: "天気", meaning: "cuaca", reading: "てんき" },
                    { kanji: "晴れ", meaning: "cerah", reading: "はれ" },
                    { kanji: "雨", meaning: "hujan", reading: "あめ" },
                    { kanji: "雪", meaning: "salju", reading: "ゆき" },
                    { kanji: "風", meaning: "angin", reading: "かぜ" },
                    { kanji: "今", meaning: "sekarang", reading: "いま" },
                    { kanji: "昨日", meaning: "kemarin", reading: "きのう" },
                    { kanji: "明日", meaning: "besok", reading: "あした" },
                    { kanji: "毎日", meaning: "setiap hari", reading: "まいにち" },
                    { kanji: "強い", meaning: "kuat", reading: "つよい" }
                ],
                "第五課": [
                    { kanji: "町", meaning: "kota kecil", reading: "まち" },
                    { kanji: "店", meaning: "toko", reading: "みせ" },
                    { kanji: "食堂", meaning: "restoran/kantin", reading: "しょくどう" },
                    { kanji: "便利", meaning: "praktis", reading: "べんり" },
                    { kanji: "不便", meaning: "tidak praktis", reading: "ふべん" },
                    { kanji: "静か", meaning: "tenang", reading: "しずか" },
                    { kanji: "有名", meaning: "terkenal", reading: "ゆうめい" },
                    { kanji: "多い", meaning: "banyak", reading: "おおい" },
                    { kanji: "少ない", meaning: "sedikit", reading: "すくない" },
                    { kanji: "遠い", meaning: "jauh", reading: "とおい" }
                ],
                "第六課": [
                    { kanji: "道", meaning: "jalan", reading: "みち" },
                    { kanji: "公園", meaning: "taman", reading: "こうえん" },
                    { kanji: "銀行", meaning: "bank", reading: "ぎんこう" },
                    { kanji: "お寺", meaning: "kuil Buddha", reading: "おてら" },
                    { kanji: "神社", meaning: "kuil Shinto", reading: "じんじゃ" },
                    { kanji: "右", meaning: "kanan", reading: "みぎ" },
                    { kanji: "左", meaning: "kiri", reading: "ひだり" },
                    { kanji: "近く", meaning: "dekat", reading: "ちかく" },
                    { kanji: "車", meaning: "mobil", reading: "くるま" },
                    { kanji: "送る", meaning: "mengirim", reading: "おくる" }
                ],
                "第七課": [
                    { kanji: "時間", meaning: "waktu", reading: "じかん" },
                    { kanji: "場所", meaning: "tempat", reading: "ばしょ" },
                    { kanji: "駅", meaning: "stasiun", reading: "えき" },
                    { kanji: "受付", meaning: "resepsionis", reading: "うけつけ" },
                    { kanji: "門", meaning: "gerbang", reading: "もん" },
                    { kanji: "電車", meaning: "kereta listrik", reading: "でんしゃ" },
                    { kanji: "待つ", meaning: "menunggu", reading: "まつ" },
                    { kanji: "止まる", meaning: "berhenti", reading: "とまる" },
                    { kanji: "着く", meaning: "tiba/sampai", reading: "つく" },
                    { kanji: "急ぐ", meaning: "bergegas", reading: "いそぐ" }
                ],
                "第八課": [
                    { kanji: "お金", meaning: "uang", reading: "おかね" },
                    { kanji: "食事", meaning: "makan (aktivitas)/hidangan", reading: "しょくじ" },
                    { kanji: "博物館", meaning: "museum", reading: "はくぶつかん" },
                    { kanji: "動物園", meaning: "kebun binatang", reading: "どうぶつえん" },
                    { kanji: "試合", meaning: "pertandingan/perlombaan", reading: "しあい" },
                    { kanji: "楽しい", meaning: "menyenangkan", reading: "たのしい" },
                    { kanji: "難しい", meaning: "sulit", reading: "むずかしい" },
                    { kanji: "登る", meaning: "mendaki/memanjat", reading: "のぼる" }
                ],
                "第九課": [
                    { kanji: "高校", meaning: "SMA (sekolah menengah atas)", reading: "こうこう" },
                    { kanji: "大学", meaning: "universitas", reading: "だいがく" },
                    { kanji: "練習", meaning: "latihan", reading: "れんしゅう" },
                    { kanji: "漢字", meaning: "kanji", reading: "かんじ" },
                    { kanji: "無料", meaning: "gratis", reading: "むりょう" },
                    { kanji: "言う", meaning: "mengatakan/berkata", reading: "いう" },
                    { kanji: "書く", meaning: "menulis", reading: "かく" },
                    { kanji: "貸す", meaning: "meminjamkan", reading: "かす" },
                    { kanji: "教える", meaning: "mengajar/memberitahu", reading: "おしえる" },
                    { kanji: "説明", meaning: "penjelasan", reading: "せつめい" }
                ],
                "第十課": [
                    { kanji: "午前", meaning: "pagi (AM; jam 00:00-11:59)", reading: "ごぜん" },
                    { kanji: "午後", meaning: "siang/sore/malam (PM; jam 12:00-23:59)", reading: "ごご" },
                    { kanji: "教科書", meaning: "buku pelajaran", reading: "きょうかしょ" },
                    { kanji: "教室", meaning: "ruang kelas", reading: "きょうしつ" },
                    { kanji: "先生", meaning: "guru/dokter (sebutan hormat)", reading: "せんせい" },
                    { kanji: "全部", meaning: "semua/seluruhnya", reading: "ぜんぶ" },
                    { kanji: "～回", meaning: "...kali (counter frekuensi)", reading: "～かい" },
                    { kanji: "参加", meaning: "partisipasi", reading: "さんか" },
                    { kanji: "用意", meaning: "persiapan (benda/kebutuhan)", reading: "ようい" }
                ],
                "第十一課": [
                    { kanji: "飲み物", meaning: "minuman", reading: "のみもの" },
                    { kanji: "お茶", meaning: "teh (biasanya teh hijau)", reading: "おちゃ" },
                    { kanji: "お酒", meaning: "alkohol/minuman beralkohol", reading: "おさけ" },
                    { kanji: "材料", meaning: "bahan-bahan (masak/kerajinan)", reading: "ざいりょう" },
                    { kanji: "野菜", meaning: "sayuran", reading: "やさい" },
                    { kanji: "牛肉", meaning: "daging sapi", reading: "ぎゅうにく" },
                    { kanji: "豚肉", meaning: "daging babi", reading: "ぶたにく" },
                    { kanji: "皿", meaning: "piring/hidangan (satu sajian)", reading: "さら" },
                    { kanji: "売る", meaning: "menjual", reading: "うる" },
                    { kanji: "持って行く", meaning: "membawa pergi", reading: "もっていく" }
                ],
                "第十二課": [
                    { kanji: "卵", meaning: "telur", reading: "たまご" },
                    { kanji: "料理", meaning: "masakan/memasak", reading: "りょうり" },
                    { kanji: "お湯", meaning: "air panas", reading: "おゆ" },
                    { kanji: "調理方法", meaning: "metode memasak", reading: "ちょうりほうほう" },
                    { kanji: "少し", meaning: "sedikit", reading: "すこし" },
                    { kanji: "味", meaning: "rasa", reading: "あじ" },
                    { kanji: "甘い", meaning: "manis", reading: "あまい" },
                    { kanji: "辛い", meaning: "pedas", reading: "からい" },
                    { kanji: "苦手", meaning: "tidak pandai/tidak suka", reading: "にがて" }
                ],
                "第十三課": [
                    { kanji: "コピー機", meaning: "mesin fotokopi", reading: "コピーき" },
                    { kanji: "数字", meaning: "angka/nomor", reading: "すうじ" },
                    { kanji: "電気", meaning: "listrik", reading: "でんき" },
                    { kanji: "音", meaning: "suara", reading: "おと" },
                    { kanji: "机", meaning: "meja (meja tulis)", reading: "つくえ" },
                    { kanji: "都合", meaning: "keadaan/kondisi (khususnya kesesuaian waktu)", reading: "つごう" },
                    { kanji: "悪い", meaning: "buruk/tidak baik", reading: "わるい" },
                    { kanji: "動く", meaning: "bergerak", reading: "うごく" },
                    { kanji: "使う", meaning: "menggunakan", reading: "つかう" },
                    { kanji: "終わる", meaning: "berakhir/selesai", reading: "おわる" },
                    { kanji: "お願いします", meaning: "tolong/silahkan (permohonan sopan)", reading: "おねがいします" }
                ],
                "第十四課": [
                    { kanji: "用事", meaning: "keperluan/urusan", reading: "ようじ" },
                    { kanji: "氏名", meaning: "nama lengkap", reading: "しめい" },
                    { kanji: "理由", meaning: "alasan", reading: "りゆう" },
                    { kanji: "連絡先", meaning: "kontak (alamat/nomor untuk dihubungi)", reading: "れんらくさき" },
                    { kanji: "別に", meaning: "tidak begitu/tidak khusus", reading: "べつに" },
                    { kanji: "早く", meaning: "cepat/awal", reading: "はやく" },
                    { kanji: "吸う", meaning: "menghisap/menarik napas (rokok/udara)", reading: "すう" },
                    { kanji: "取る", meaning: "mengambil", reading: "とる" },
                    { kanji: "帰る", meaning: "pulang", reading: "かえる" },
                    { kanji: "伝える", meaning: "menyampaikan/memberitahu", reading: "つたえる" }
                ],
                "第十五課": [
                    { kanji: "熱", meaning: "demam/panas (tubuh)", reading: "ねつ" },
                    { kanji: "薬", meaning: "obat", reading: "くすり" },
                    { kanji: "病気", meaning: "sakit (penyakit)", reading: "びょうき" },
                    { kanji: "病院", meaning: "rumah sakit", reading: "びょういん" },
                    { kanji: "医者", meaning: "dokter", reading: "いしゃ" },
                    { kanji: "住所", meaning: "alamat", reading: "じゅうしょ" },
                    { kanji: "～才", meaning: "...tahun (usia)", reading: "～さい" },
                    { kanji: "痛い", meaning: "sakit (nyeri)", reading: "いたい" },
                    { kanji: "眠い", meaning: "mengantuk", reading: "ねむい" },
                    { kanji: "寝る", meaning: "tidur (berbaring)", reading: "ねる" },
                    { kanji: "記入する", meaning: "mengisi (formulir/dokumen)", reading: "きにゅうする" }
                ],
                "第十六課": [
                    { kanji: "体", meaning: "tubuh/badan", reading: "からだ" },
                    { kanji: "顔", meaning: "wajah", reading: "かお" },
                    { kanji: "目", meaning: "mata", reading: "め" },
                    { kanji: "耳", meaning: "telinga", reading: "みみ" },
                    { kanji: "口", meaning: "mulut", reading: "くち" },
                    { kanji: "頭", meaning: "kepala/otak", reading: "あたま" },
                    { kanji: "足", meaning: "kaki/tungkai", reading: "あし" },
                    { kanji: "手", meaning: "tangan", reading: "て" },
                    { kanji: "起きる", meaning: "bangun (dari tidur)", reading: "おきる" },
                    { kanji: "歩く", meaning: "berjalan", reading: "あるく" },
                    { kanji: "走る", meaning: "berlari", reading: "はしる" },
                    { kanji: "運動する", meaning: "berolahraga", reading: "うんどうする" }
                ],
                "第十七課": [
                    { kanji: "お父さん", meaning: "ayah (panggilan hormat/umum)", reading: "おとうさん" },
                    { kanji: "お母さん", meaning: "ibu (panggilan hormat/umum)", reading: "おかあさん" },
                    { kanji: "兄", meaning: "kakak laki-laki (saudara kandung, untuk diri sendiri)", reading: "あに" },
                    { kanji: "お兄さん", meaning: "kakak laki-laki (panggilan hormat/umum)", reading: "おにいさん" },
                    { kanji: "姉", meaning: "kakak perempuan (saudara kandung, untuk diri sendiri)", reading: "あね" },
                    { kanji: "お姉さん", meaning: "kakak perempuan (panggilan hormat/umum)", reading: "おねえさん" },
                    { kanji: "弟", meaning: "adik laki-laki", reading: "おとうと" },
                    { kanji: "妹", meaning: "adik perempuan", reading: "いもうと" },
                    { kanji: "夫", meaning: "suami (milik sendiri)", reading: "おっと" },
                    { kanji: "妻", meaning: "istri (milik sendiri)", reading: "つま" },
                    { kanji: "両親", meaning: "orang tua (ayah dan ibu)", reading: "りょうしん" }
                ],
                "第十八課": [
                    { kanji: "男の子", meaning: "anak laki-laki", reading: "おとこのこ" },
                    { kanji: "女の子", meaning: "anak perempuan", reading: "おんなのこ" },
                    { kanji: "お祝い", meaning: "ucapan selamat/perayaan", reading: "おいわい" },
                    { kanji: "誕生日", meaning: "ulang tahun", reading: "たんじょうび" },
                    { kanji: "結婚", meaning: "pernikahan", reading: "けっこん" },
                    { kanji: "時計", meaning: "jam (arloji/jam dinding)", reading: "とけい" },
                    { kanji: "幸せ", meaning: "kebahagiaan", reading: "しあわせ" },
                    { kanji: "生まれる", meaning: "lahir", reading: "うまれる" },
                    { kanji: "思う", meaning: "berpikir/merasa", reading: "おもう" },
                    { kanji: "選ぶ", meaning: "memilih", reading: "えらぶ" },
                    { kanji: "合格する", meaning: "lulus (ujian/seleksi)", reading: "ごうかくする" }
                ]
            },
            "Buku A2-2": {
                "第一課": [
                    { kanji: "山", meaning: "gunung", reading: "やま" },
                    { kanji: "川", meaning: "sungai", reading: "かわ" },
                    { kanji: "海", meaning: "laut", reading: "うみ" },
                    { kanji: "島", meaning: "pulau", reading: "しま" },
                    { kanji: "森", meaning: "hutan", reading: "もり" },
                    { kanji: "客", meaning: "tamu/pengunjung", reading: "きゃく" },
                    { kanji: "観光地", meaning: "tempat wisata", reading: "かんこうち" },
                    { kanji: "意味", meaning: "arti/makna", reading: "いみ" },
                    { kanji: "経験", meaning: "pengalaman", reading: "けいけん" }
                ],
                "第二課": [
                    { kanji: "写真", meaning: "foto", reading: "しゃしん" },
                    { kanji: "歌", meaning: "lagu", reading: "うた" },
                    { kanji: "歌手", meaning: "penyanyi", reading: "かしゅ" },
                    { kanji: "上手", meaning: "pandai/terampil", reading: "じょうず" },
                    { kanji: "明るい", meaning: "terang/cerah", reading: "あかるい" },
                    { kanji: "長い", meaning: "panjang", reading: "ながい" },
                    { kanji: "短い", meaning: "pendek", reading: "みじかい" },
                    { kanji: "着る", meaning: "memakai (baju)", reading: "きる" },
                    { kanji: "立つ", meaning: "berdiri", reading: "たつ" },
                    { kanji: "泣く", meaning: "menangis", reading: "なく" }
                ],
                "第三課": [
                    { kanji: "注文", meaning: "pesanan (makanan/minuman)", reading: "ちゅうもん" },
                    { kanji: "会計", meaning: "pembayaran (tagihan)", reading: "かいけい" },
                    { kanji: "予約", meaning: "reservasi", reading: "よやく" },
                    { kanji: "電話番号", meaning: "nomor telepon", reading: "でんわばんごう" },
                    { kanji: "～様", meaning: "Tuan/Nyonya (sebutan hormat)", reading: "～さま" },
                    { kanji: "ご飯", meaning: "nasi/makanan", reading: "ごはん" },
                    { kanji: "牛乳", meaning: "susu sapi", reading: "ぎゅうにゅう" },
                    { kanji: "生", meaning: "mentah/alami", reading: "なま" },
                    { kanji: "禁煙", meaning: "dilarang merokok", reading: "きんえん" },
                    { kanji: "自由", meaning: "bebas", reading: "じゆう" }
                ],
                "第四課": [
                    { kanji: "塩", meaning: "garam", reading: "しお" },
                    { kanji: "油", meaning: "minyak", reading: "あぶら" },
                    { kanji: "量", meaning: "jumlah/takaran", reading: "りょう" },
                    { kanji: "～方", meaning: "cara～/metode～ (akhiran)", reading: "～かた" },
                    { kanji: "～屋", meaning: "toko～/ahli～ (akhiran)", reading: "～や" },
                    { kanji: "満足", meaning: "puas/kepuasan", reading: "まんぞく" },
                    { kanji: "切る", meaning: "memotong/memutuskan", reading: "きる" },
                    { kanji: "焼く", meaning: "membakar/memanggang", reading: "やく" },
                    { kanji: "入れる", meaning: "memasukkan/menambahkan", reading: "いれる" }
                ],
                "第五課": [
                    { kanji: "自然", meaning: "alam", reading: "しぜん" },
                    { kanji: "交通", meaning: "transportasi", reading: "こうつう" },
                    { kanji: "船", meaning: "kapal/perahu", reading: "ふね" },
                    { kanji: "自転車", meaning: "sepeda", reading: "じてんしゃ" },
                    { kanji: "旅館", meaning: "penginapan tradisional Jepang", reading: "りょかん" },
                    { kanji: "東京", meaning: "Tokyo", reading: "とうきょう" },
                    { kanji: "計画", meaning: "rencana", reading: "けいかく" },
                    { kanji: "遊ぶ", meaning: "bermain", reading: "あそぶ" },
                    { kanji: "調べる", meaning: "memeriksa/mencari tahu", reading: "しらべる" },
                    { kanji: "出発する", meaning: "berangkat", reading: "しゅっぱつする" }
                ],
                "第六課": [
                    { kanji: "運転", meaning: "mengemudi", reading: "うんてん" },
                    { kanji: "事故", meaning: "kecelakaan", reading: "じこ" },
                    { kanji: "故障", meaning: "rusak (mesin/alat)", reading: "こしょう" },
                    { kanji: "指定席", meaning: "tempat duduk reservasi", reading: "していせき" },
                    { kanji: "週末", meaning: "akhir pekan", reading: "しゅうまつ" },
                    { kanji: "絵", meaning: "gambar/lukisan", reading: "え" },
                    { kanji: "空", meaning: "langit", reading: "そら" },
                    { kanji: "泳ぐ", meaning: "berenang", reading: "およぐ" },
                    { kanji: "光る", meaning: "bersinar/berkilau", reading: "ひかる" },
                    { kanji: "到着する", meaning: "tiba", reading: "とうちゃくする" }
                ],
                "第七課": [
                    { kanji: "お知らせ", meaning: "pemberitahuan/pengumuman", reading: "おしらせ" },
                    { kanji: "今月", meaning: "bulan ini", reading: "こんげつ" },
                    { kanji: "水道", meaning: "air PAM/saluran air", reading: "すいどう" },
                    { kanji: "工事", meaning: "konstruksi/pengerjaan", reading: "こうじ" },
                    { kanji: "広場", meaning: "lapangan/plaza", reading: "ひろば" },
                    { kanji: "場合", meaning: "kasus/situasi", reading: "ばあい" },
                    { kanji: "中止", meaning: "pembatalan", reading: "ちゅうし" },
                    { kanji: "条件", meaning: "syarat/kondisi", reading: "じょうけん" },
                    { kanji: "～以上", meaning: "lebih dari～/setelah～", reading: "～いじょう" },
                    { kanji: "開く", meaning: "membuka", reading: "ひらく" },
                    { kanji: "生産する", meaning: "memproduksi", reading: "せいさんする" }
                ],
                "第八課": [
                    { kanji: "来年", meaning: "tahun depan", reading: "らいねん" },
                    { kanji: "会場", meaning: "tempat acara/venue", reading: "かいじょう" },
                    { kanji: "世界", meaning: "dunia", reading: "せかい" },
                    { kanji: "体験", meaning: "pengalaman langsung", reading: "たいけん" },
                    { kanji: "国際交流", meaning: "pertukaran internasional", reading: "こくさいこうりゅう" },
                    { kanji: "禁止", meaning: "dilarang", reading: "きんし" },
                    { kanji: "紙", meaning: "kertas", reading: "かみ" },
                    { kanji: "始める", meaning: "memulai", reading: "はじめる" },
                    { kanji: "申し込む", meaning: "mendaftar/mengajukan", reading: "もうしこむ" }
                ],
                "第九課": [
                    { kanji: "今年", meaning: "tahun ini", reading: "ことし" },
                    { kanji: "昨年", meaning: "tahun lalu (formal)", reading: "さくねん" },
                    { kanji: "毎年", meaning: "setiap tahun", reading: "まいとし" },
                    { kanji: "文化", meaning: "budaya", reading: "ぶんか" },
                    { kanji: "祭り", meaning: "festival", reading: "まつり" },
                    { kanji: "正月", meaning: "tahun baru Jepang", reading: "しょうがつ" },
                    { kanji: "～式", meaning: "upacara～/sistem～ (akhiran)", reading: "～しき" },
                    { kanji: "大人", meaning: "dewasa", reading: "おとな" },
                    { kanji: "米", meaning: "beras", reading: "こめ" },
                    { kanji: "特別", meaning: "khusus/spesial", reading: "とくべつ" }
                ],
                "第十課": [
                    { kanji: "服", meaning: "pakaian", reading: "ふく" },
                    { kanji: "袋", meaning: "kantong/tas", reading: "ふくろ" },
                    { kanji: "自分", meaning: "diri sendiri", reading: "じぶん" },
                    { kanji: "店長", meaning: "manajer toko", reading: "てんちょう" },
                    { kanji: "全員", meaning: "semua orang/seluruh anggota", reading: "ぜんいん" },
                    { kanji: "習慣", meaning: "kebiasaan/adat", reading: "しゅうかん" },
                    { kanji: "普通", meaning: "biasa/umum", reading: "ふつう" },
                    { kanji: "暗い", meaning: "gelap/suram", reading: "くらい" },
                    { kanji: "怒る", meaning: "marah", reading: "おこる" },
                    { kanji: "入院する", meaning: "dirawat inap (rumah sakit)", reading: "にゅういんする" }
                ],
                "第十一課": [
                    { kanji: "色", meaning: "warna", reading: "いろ" },
                    { kanji: "赤", meaning: "merah", reading: "あか" },
                    { kanji: "青", meaning: "biru/hijau (tergantung konteks)", reading: "あお" },
                    { kanji: "黒", meaning: "hitam", reading: "くろ" },
                    { kanji: "白", meaning: "putih", reading: "しろ" },
                    { kanji: "女性", meaning: "wanita/perempuan", reading: "じょせい" },
                    { kanji: "男性", meaning: "pria/laki-laki", reading: "だんせい" },
                    { kanji: "急に", meaning: "tiba-tiba", reading: "きゅうに" },
                    { kanji: "営業する", meaning: "beroperasi (bisnis/toko)", reading: "えいぎょうする" },
                    { kanji: "案内する", meaning: "memandu/memberi informasi", reading: "あんないする" }
                ],
                "第十二課": [
                    { kanji: "商品", meaning: "barang (dagangan)", reading: "しょうひん" },
                    { kanji: "値段", meaning: "harga (sehari-hari)", reading: "ねだん" },
                    { kanji: "価格", meaning: "harga (formal/resmi)", reading: "かかく" },
                    { kanji: "消費税", meaning: "pajak pertambahan nilai (PPN)", reading: "しょうひぜい" },
                    { kanji: "性別", meaning: "jenis kelamin", reading: "せいべつ" },
                    { kanji: "店員", meaning: "staf toko/karyawan toko", reading: "てんいん" },
                    { kanji: "親切", meaning: "baik hati/ramah", reading: "しんせつ" },
                    { kanji: "重い", meaning: "berat", reading: "おもい" },
                    { kanji: "軽い", meaning: "ringan", reading: "かるい" },
                    { kanji: "変わる", meaning: "berubah", reading: "かわる" }
                ],
                "第十三課": [
                    { kanji: "市", meaning: "kota", reading: "し" },
                    { kanji: "料金", meaning: "biaya/tarif", reading: "りょうきん" },
                    { kanji: "図書館", meaning: "perpustakaan", reading: "としょかん" },
                    { kanji: "道具", meaning: "alat/perkakas", reading: "どうぐ" },
                    { kanji: "～点", meaning: "poin～", reading: "～てん" },
                    { kanji: "必要", meaning: "diperlukan", reading: "ひつよう" },
                    { kanji: "借りる", meaning: "meminjam", reading: "かりる" },
                    { kanji: "返す", meaning: "mengembalikan", reading: "かえす" },
                    { kanji: "開く", meaning: "terbuka", reading: "あく" },
                    { kanji: "閉まる", meaning: "tertutup", reading: "しまる" },
                    { kanji: "利用する", meaning: "menggunakan/memanfaatkan", reading: "りようする" }
                ],
                "第十四課": [
                    { kanji: "外国", meaning: "luar negeri", reading: "がいこく" },
                    { kanji: "情報", meaning: "informasi", reading: "じょうほう" },
                    { kanji: "相談", meaning: "konsultasi", reading: "そうだん" },
                    { kanji: "質問", meaning: "pertanyaan", reading: "しつもん" },
                    { kanji: "窓口", meaning: "loket/pelayanan", reading: "まどぐち" },
                    { kanji: "郵便局", meaning: "kantor pos", reading: "ゆうびんきょく" },
                    { kanji: "近所", meaning: "lingkungan sekitar", reading: "きんじょ" },
                    { kanji: "自動", meaning: "otomatis", reading: "じどう" },
                    { kanji: "洗う", meaning: "mencuci", reading: "あらう" },
                    { kanji: "入力する", meaning: "memasukkan (data)", reading: "にゅうりょくする" }
                ],
                "第十五課": [
                    { kanji: "温度", meaning: "suhu", reading: "おんど" },
                    { kanji: "危険", meaning: "bahaya", reading: "きけん" },
                    { kanji: "～種類", meaning: "jenis～/macam～ (akhiran)", reading: "～しゅるい" },
                    { kanji: "消す", meaning: "mematikan/menghapus", reading: "けす" },
                    { kanji: "捨てる", meaning: "membuang", reading: "すてる" },
                    { kanji: "出す", meaning: "mengeluarkan", reading: "だす" },
                    { kanji: "分ける", meaning: "membagi/memisahkan", reading: "わける" },
                    { kanji: "燃える", meaning: "terbakar", reading: "もえる" },
                    { kanji: "決める", meaning: "memutuskan", reading: "きめる" },
                    { kanji: "設定する", meaning: "mengatur/menyetting", reading: "せっていする" }
                ],
                "第十六課": [
                    { kanji: "地震", meaning: "gempa bumi", reading: "じしん" },
                    { kanji: "台風", meaning: "topan/badai tropis", reading: "たいふう" },
                    { kanji: "外", meaning: "luar", reading: "そと" },
                    { kanji: "声", meaning: "suara", reading: "こえ" },
                    { kanji: "危ない", meaning: "berbahaya", reading: "あぶない" },
                    { kanji: "大切", meaning: "berharga/penting", reading: "たいせつ" },
                    { kanji: "心配", meaning: "kekhawatiran", reading: "しんぱい" },
                    { kanji: "集まる", meaning: "berkumpul", reading: "あつまる" },
                    { kanji: "進む", meaning: "maju/melanjutkan", reading: "すすむ" }
                ],
                "第十七課": [
                    { kanji: "最近", meaning: "baru-baru ini/akhir-akhir ini", reading: "さいきん" },
                    { kanji: "授業", meaning: "pelajaran/kelas", reading: "じゅぎょう" },
                    { kanji: "問題", meaning: "masalah/soal", reading: "もんだい" },
                    { kanji: "大変", meaning: "sangat/berat (situasi sulit)", reading: "たいへん" },
                    { kanji: "困る", meaning: "bingung/kesulitan", reading: "こまる" },
                    { kanji: "違う", meaning: "berbeda/salah", reading: "ちがう" },
                    { kanji: "慣れる", meaning: "terbiasa", reading: "なれる" },
                    { kanji: "増える", meaning: "bertambah", reading: "ふえる" },
                    { kanji: "笑う", meaning: "tertawa", reading: "わらう" },
                    { kanji: "苦労する", meaning: "bersusah payah", reading: "くろうする" }
                ],
                "第十八課": [
                    { kanji: "希望", meaning: "harapan/permohonan", reading: "きぼう" },
                    { kanji: "募集", meaning: "rekrutmen/penerimaan", reading: "ぼしゅう" },
                    { kanji: "特に", meaning: "terutama/khususnya", reading: "とくに" },
                    { kanji: "住む", meaning: "tinggal (tempat tinggal)", reading: "すむ" },
                    { kanji: "建てる", meaning: "membangun (bangunan)", reading: "たてる" },
                    { kanji: "続ける", meaning: "melanjutkan", reading: "つづける" },
                    { kanji: "考える", meaning: "berpikir/mempertimbangkan", reading: "かんがえる" },
                    { kanji: "役に立つ", meaning: "berguna/bermanfaat", reading: "やくにたつ" },
                    { kanji: "卒業する", meaning: "lulus (dari sekolah)", reading: "そつぎょうする" },
                    { kanji: "留学する", meaning: "belajar di luar negeri", reading: "りゅうがくする" }
                ]
            }
        };

        // Fungsi untuk membuat checkbox pelajaran
        function createLessonCheckboxes() {
            // Buku Dasar
            const bookBasic = document.getElementById('book-basic');
            Object.keys(kanjiData["Buku Dasar"]).forEach(lesson => {
                const checkbox = document.createElement('label');
                checkbox.className = 'lesson-checkbox';
                checkbox.innerHTML = `
                    <input type="checkbox" name="lesson" data-book="Buku Dasar" data-lesson="${lesson}">
                    ${lesson}
                `;
                bookBasic.appendChild(checkbox);
            });

            // Buku A2-1
            const bookA21 = document.getElementById('book-a2-1');
            Object.keys(kanjiData["Buku A2-1"]).forEach(lesson => {
                const checkbox = document.createElement('label');
                checkbox.className = 'lesson-checkbox';
                checkbox.innerHTML = `
                    <input type="checkbox" name="lesson" data-book="Buku A2-1" data-lesson="${lesson}">
                    ${lesson}
                `;
                bookA21.appendChild(checkbox);
            });

            // Buku A2-2
            const bookA22 = document.getElementById('book-a2-2');
            Object.keys(kanjiData["Buku A2-2"]).forEach(lesson => {
                const checkbox = document.createElement('label');
                checkbox.className = 'lesson-checkbox';
                checkbox.innerHTML = `
                    <input type="checkbox" name="lesson" data-book="Buku A2-2" data-lesson="${lesson}">
                    ${lesson}
                `;
                bookA22.appendChild(checkbox);
            });
        }

        // Fungsi untuk mendapatkan kanji dari pelajaran yang dipilih
        function getSelectedKanji() {
            const selectedKanji = [];
            const checkboxes = document.querySelectorAll('input[name="lesson"]:checked');
            
            checkboxes.forEach(checkbox => {
                const book = checkbox.dataset.book;
                const lesson = checkbox.dataset.lesson;
                if (kanjiData[book] && kanjiData[book][lesson]) {
                    selectedKanji.push(...kanjiData[book][lesson]);
                }
            });
            
            // Update selected lessons count
            document.getElementById('selected-lessons-count').textContent = checkboxes.length;
            
            return selectedKanji;
        }

        // Fungsi untuk menampilkan kanji sebagai flashcard
        function displayKanji() {
            const kanjiContainer = document.getElementById('kanji-container');
            kanjiContainer.innerHTML = '';
            
            const selectedKanji = getSelectedKanji();
            const kanjiCount = parseInt(document.getElementById('kanji-count').value) || 20;
            
            if (selectedKanji.length === 0) {
                kanjiContainer.innerHTML = '<div class="no-kanji">Silakan pilih minimal satu bab kanji</div>';
                updateStats(0, 0, 0);
                return;
            }
            
            // Update stats
            updateStats(selectedKanji.length, 0, 0);
            
            // Acak kanji
            const shuffledKanji = [...selectedKanji].sort(() => Math.random() - 0.5);
            const displayKanji = shuffledKanji.slice(0, Math.min(kanjiCount, shuffledKanji.length));
            
            displayKanji.forEach(item => {
                const kanjiCard = document.createElement('div');
                kanjiCard.className = 'kanji-card';
                kanjiCard.innerHTML = `
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="kanji-character">${item.kanji}</div>
                        </div>
                        <div class="card-back">
                            <div class="kanji-character">${item.kanji}</div>
                            <div class="kanji-reading">${item.reading}</div>
                            <div class="kanji-meaning">${item.meaning}</div>
                        </div>
                    </div>
                `;
                
                kanjiCard.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                    if (!this.dataset.reviewed) {
                        this.dataset.reviewed = true;
                        document.getElementById('reviewed-kanji').textContent = 
                            parseInt(document.getElementById('reviewed-kanji').textContent) + 1;
                    }
                });
                
                kanjiContainer.appendChild(kanjiCard);
            });
        }

        // Fungsi untuk update statistik
        function updateStats(total, reviewed, mastered) {
            document.getElementById('total-kanji').textContent = total;
            document.getElementById('reviewed-kanji').textContent = reviewed;
            document.getElementById('mastered-kanji').textContent = mastered;
        }

        // Fungsi untuk memilih semua bab dalam satu buku
        function toggleSelectAll(bookName) {
            const bookContainer = bookName === 'Buku Dasar' ? 
                document.getElementById('book-basic') : 
                bookName === 'Buku A2-1' ? 
                    document.getElementById('book-a2-1') : 
                    document.getElementById('book-a2-2');
            
            const checkboxes = bookContainer.querySelectorAll('input[type="checkbox"]');
            const anyUnchecked = [...checkboxes].some(checkbox => !checkbox.checked);
            
            checkboxes.forEach(checkbox => {
                checkbox.checked = anyUnchecked;
            });
            
            // Update count
            const selectedCount = document.querySelectorAll('input[name="lesson"]:checked').length;
            document.getElementById('selected-lessons-count').textContent = selectedCount;
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', () => {
            createLessonCheckboxes();
            
            document.getElementById('show-kanji').addEventListener('click', displayKanji);
            
            // Select some lessons by default for better UX
            document.querySelectorAll('input[name="lesson"]')[0].checked = true;
            document.querySelectorAll('input[name="lesson"]')[1].checked = true;
            document.getElementById('selected-lessons-count').textContent = 2;
        });
    </script>
</body>
</html>
