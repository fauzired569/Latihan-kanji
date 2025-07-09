<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Latihan Kanji - Aplikasi Pembelajaran</title>
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
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f8f9fa;
            border-radius: 8px;
            font-size: 3.5rem;
            font-weight: bold;
            color: #2c3e50;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }
        
        .kanji-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            background: #e3f2fd;
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
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Latihan Kanji</h1>
            <p class="subtitle">Aplikasi Pembelajaran Kanji untuk Siswa</p>
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
                <h2>Kanji yang Ditampilkan</h2>
                <div class="kanji-grid" id="kanji-container">
                    <div class="no-kanji">
                        Silakan pilih bab kanji dan tekan "Tampilkan Kanji"
                    </div>
                </div>
            </div>
        </div>
        
        <div class="instructions">
            <h3>Cara Menggunakan Aplikasi</h3>
            <ul>
                <li>Pilih bab-bab kanji yang ingin Anda pelajari dari daftar yang tersedia</li>
                <li>Tentukan jumlah kanji yang ingin ditampilkan (maksimal 100)</li>
                <li>Klik tombol "Tampilkan Kanji" untuk menampilkan kanji secara acak dari bab yang dipilih</li>
                <li>Fokuslah pada setiap karakter kanji dan coba ingat cara baca serta artinya</li>
                <li>Untuk latihan tambahan, ganti bab atau jumlah kanji yang ditampilkan</li>
            </ul>
        </div>
    </div>

    <script>
        // Data kanji per buku per bab
        const kanjiData = {
            "Buku Dasar": {
                "第一課～第八課": ["名前", "国", "私", "父", "母", "子ども", "日本", "水", "食べます", "飲みます", "魚", "肉", "好き", "家", "新しい", "広い", "古い", "上", "下", "中"],
                "第九課～第十八課": ["朝", "昼", "夜", "読みます", "聞きます", "見ます", "本", "友だち", "何", "今日", "今週", "今度", "東", "南", "西", "北", "会社", "来ます", "行きます", "乗ります", "大きい", "小さい", "高い", "低い", "前", "後ろ", "横", "入口", "出口", "～階", "押す", "引く", "安い", "休み", "映画", "日本語", "勉強", "買います", "温泉", "予定", "来週", "会います", "入ります", "旅行"]
            },
            "Buku A2-1": {
                "第一課": ["学生", "学校", "生活", "去年", "先週", "仕事", "元気", "忙しい", "働く", "作る"],
                "第二課": ["人", "犬", "家族", "夕方", "英語", "音楽", "習う", "話す", "出かける"],
                "第三課": ["季節", "春", "夏", "秋", "冬", "花", "同じ", "暑い", "寒い"],
                "第四課": ["天気", "晴れ", "雨", "雪", "風", "今", "昨日", "明日", "毎日", "強い"],
                "第五課": ["町", "店", "食堂", "便利", "不便", "静か", "有名", "多い", "少ない", "遠い"],
                "第六課": ["道", "公園", "銀行", "お寺", "神社", "右", "左", "近く", "車", "送る"],
                "第七課": ["時間", "場所", "駅", "受付", "門", "電車", "待つ", "止まる", "着く", "急ぐ"],
                "第八課": ["お金", "食事", "博物館", "動物園", "試合", "楽しい", "難しい", "登る"],
                "第九課": ["高校", "大学", "練習", "漢字", "無料", "言う", "書く", "貸す", "教える", "説明"],
                "第十課": ["午前", "午後", "教科書", "教室", "先生", "全部", "～回", "参加", "用意"],
                "第十一課": ["飲み物", "お茶", "お酒", "材料", "野菜", "牛肉", "豚肉", "皿", "売る", "持って行く"],
                "第十二課": ["卵", "料理", "お湯", "調理方法", "少し", "味", "甘い", "辛い", "苦手"],
                "第十三課": ["コピー機", "数字", "電気", "音", "机", "都合", "悪い", "動く", "使う", "終わる", "お願いします"],
                "第十四課": ["用事", "氏名", "理由", "連絡先", "別に", "早く", "吸う", "取る", "帰る", "伝える"],
                "第十五課": ["熱", "薬", "病気", "病院", "医者", "住所", "~才", "痛い", "眠い", "寝る", "記入する"],
                "第十六課": ["体", "顔", "目", "耳", "口", "頭", "足", "手", "起きる", "歩く", "走る", "運動する"],
                "第十七課": ["お父さん", "お母さん", "兄", "お兄いさん", "姉", "お姉さん", "弟", "妹", "夫", "妻", "両親"],
                "第十八課": ["男の子", "女の子", "お祝い", "誕生日", "結婚", "時計", "幸せ", "生まれる", "思う", "選ぶ", "合格する"]
            },
            "Buku A2-2": {
                "第一課": ["山", "川", "海", "島", "森", "客", "観光地", "意味", "経験"],
                "第二課": ["写真", "歌", "歌手", "上手", "明るい", "長い", "短い", "着る", "立つ", "泣く"],
                "第三課": ["注文", "会計", "予約", "電話番号", "～様", "ご飯", "牛乳", "生", "禁煙", "自由"],
                "第四課": ["塩", "油", "量", "～方", "～屋", "満足", "切る", "焼く", "入れる"],
                "第五課": ["自然", "交通", "船", "自転車", "旅館", "東京", "計画", "遊ぶ", "調べる", "出発する"],
                "第六課": ["運転", "事故", "故障", "指定席", "週末", "絵", "空", "泳ぐ", "光る", "到着する"],
                "第七課": ["お知らせ", "今月", "水道", "工事", "広場", "場合", "中止", "条件", "～以上", "開く", "生産する"],
                "第八課": ["来年", "会場", "世界", "体験", "国際交流", "禁止", "紙", "始める", "申し込む"],
                "第九課": ["今年", "昨年", "毎年", "文化", "祭り", "正月", "～式", "大人", "米", "特別"],
                "第十課": ["服", "袋", "自分", "店長", "全員", "習慣", "普通", "暗い", "怒る", "入院する"],
                "第十一課": ["色", "赤", "青", "黒", "白", "女性", "男性", "急に", "営業する", "案内する"],
                "第十二課": ["商品", "値段", "価格", "消費税", "性別", "店員", "親切", "重い", "軽い", "変わる"],
                "第十三課": ["市", "料金", "図書館", "道具", "～点", "必要", "借りる", "返す", "開く", "閉まる", "利用する"],
                "第十四課": ["外国", "情報", "相談", "質問", "窓口", "郵便局", "近所", "自動", "洗う", "入力する"],
                "第十五課": ["温度", "危険", "～種類", "消す", "捨てる", "出す", "分ける", "燃える", "決める", "設定する"],
                "第十六課": ["地震", "台風", "外", "声", "危ない", "大切", "心配", "集まる", "進む"],
                "第十七課": ["最近", "授業", "問題", "大変", "困る", "違う", "慣れる", "増える", "笑う", "苦労する"],
                "第十八課": ["希望", "募集", "特に", "住む", "建てる", "続ける", "考える", "役に立つ", "卒業する", "留学する"]
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
            const selectedLessons = [];
            const checkboxes = document.querySelectorAll('input[name="lesson"]:checked');
            
            checkboxes.forEach(checkbox => {
                const book = checkbox.dataset.book;
                const lesson = checkbox.dataset.lesson;
                if (kanjiData[book] && kanjiData[book][lesson]) {
                    selectedLessons.push(...kanjiData[book][lesson]);
                }
            });
            
            // Update selected lessons count
            document.getElementById('selected-lessons-count').textContent = checkboxes.length;
            
            return selectedLessons;
        }

        // Fungsi untuk menampilkan kanji
        function displayKanji() {
            const kanjiContainer = document.getElementById('kanji-container');
            kanjiContainer.innerHTML = '';
            
            const selectedKanji = getSelectedKanji();
            const kanjiCount = parseInt(document.getElementById('kanji-count').value) || 20;
            
            if (selectedKanji.length === 0) {
                kanjiContainer.innerHTML = '<div class="no-kanji">Silakan pilih minimal satu bab kanji</div>';
                return;
            }
            
            // Acak kanji
            const shuffledKanji = [...selectedKanji].sort(() => Math.random() - 0.5);
            const displayKanji = shuffledKanji.slice(0, Math.min(kanjiCount, shuffledKanji.length));
            
            displayKanji.forEach(kanji => {
                const kanjiCard = document.createElement('div');
                kanjiCard.className = 'kanji-card';
                kanjiCard.textContent = kanji;
                kanjiContainer.appendChild(kanjiCard);
            });
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
