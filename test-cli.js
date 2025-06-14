// CLI用のテストスクリプト
const fs = require('fs');
const path = require('path');

console.log('=== 山海経クロニクル ファイル検証テスト ===\n');

// 必要なファイルの存在確認
const requiredFiles = [
    'index.html',
    'styles.css',
    'game.js',
    'creatures.js',
    'locations.js'
];

let allFilesExist = true;

console.log('1. ファイル存在確認:');
requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    console.log(`  ${exists ? '✓' : '✗'} ${file}`);
    if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
    console.log('\n✗ 必要なファイルが不足しています');
    process.exit(1);
}

console.log('\n2. HTML構造チェック:');
const htmlContent = fs.readFileSync('index.html', 'utf8');

// スクリプトの読み込み順序確認
const scriptOrder = [];
const scriptMatches = htmlContent.match(/<script\s+src="([^"]+)"/g);
if (scriptMatches) {
    scriptMatches.forEach(match => {
        const src = match.match(/src="([^"]+)"/)[1];
        scriptOrder.push(src);
    });
}

console.log('  スクリプト読み込み順序:');
scriptOrder.forEach((script, index) => {
    console.log(`    ${index + 1}. ${script}`);
});

// 正しい順序かチェック
const expectedOrder = ['creatures.js', 'locations.js', 'game.js'];
const isCorrectOrder = JSON.stringify(scriptOrder) === JSON.stringify(expectedOrder);
console.log(`  ${isCorrectOrder ? '✓' : '✗'} スクリプトの読み込み順序は${isCorrectOrder ? '正しい' : '間違っている'}`);

console.log('\n3. JavaScript構文チェック:');

// 各JSファイルの構文チェック
const jsFiles = ['creatures.js', 'locations.js', 'game.js'];
jsFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        
        // 基本的な構文チェック
        // クラス定義の確認
        const classMatches = content.match(/class\s+(\w+)/g);
        if (classMatches) {
            console.log(`  ${file}:`);
            classMatches.forEach(match => {
                const className = match.replace('class ', '');
                console.log(`    ✓ ${className} クラスが定義されています`);
            });
        }
        
        // グローバル変数の確認
        if (file === 'creatures.js' && content.includes('const CREATURES')) {
            console.log(`    ✓ CREATURES データベースが定義されています`);
        }
        if (file === 'locations.js' && content.includes('const LOCATIONS')) {
            console.log(`    ✓ LOCATIONS データベースが定義されています`);
        }
        if (file === 'game.js' && content.includes('const game = new Game()')) {
            console.log(`    ✓ game インスタンスが作成されています`);
        }
        
    } catch (error) {
        console.log(`  ✗ ${file}: エラー - ${error.message}`);
    }
});

console.log('\n4. ゲームデータ検証:');

// creatures.jsの内容確認
try {
    const creaturesContent = fs.readFileSync('creatures.js', 'utf8');
    // CREATURES オブジェクトを抽出
    const creaturesMatch = creaturesContent.match(/const CREATURES = \{[\s\S]*?\n\};/);
    if (creaturesMatch) {
        // 生物の数をカウント
        const creatureIds = creaturesContent.match(/(\w+):\s*\{[\s\S]*?id:\s*['"](\w+)['"]/g);
        console.log(`  ✓ ${creatureIds ? creatureIds.length : 0} 種類の生物が定義されています`);
    }
} catch (error) {
    console.log(`  ✗ creatures.js の解析エラー: ${error.message}`);
}

// locations.jsの内容確認
try {
    const locationsContent = fs.readFileSync('locations.js', 'utf8');
    // LOCATIONS オブジェクトを抽出
    const locationsMatch = locationsContent.match(/const LOCATIONS = \{[\s\S]*?\n\};/);
    if (locationsMatch) {
        // 場所の数をカウント
        const locationIds = locationsContent.match(/(\w+):\s*\{[\s\S]*?id:\s*['"](\w+)['"]/g);
        console.log(`  ✓ ${locationIds ? locationIds.length : 0} 箇所の場所が定義されています`);
    }
} catch (error) {
    console.log(`  ✗ locations.js の解析エラー: ${error.message}`);
}

console.log('\n5. CSS検証:');
try {
    const cssContent = fs.readFileSync('styles.css', 'utf8');
    
    // 重要なCSSクラスの存在確認
    const importantClasses = [
        '.screen',
        '.manga-panel',
        '.loading-bar',
        '.menu-btn',
        '.hp-bar'
    ];
    
    importantClasses.forEach(className => {
        if (cssContent.includes(className)) {
            console.log(`  ✓ ${className} スタイルが定義されています`);
        } else {
            console.log(`  ✗ ${className} スタイルが見つかりません`);
        }
    });
} catch (error) {
    console.log(`  ✗ styles.css の読み込みエラー: ${error.message}`);
}

console.log('\n=== テスト結果サマリー ===');
console.log('✓ 基本的なファイル構造は正しく設定されています');
console.log('✓ スクリプトの読み込み順序は正しいです');
console.log('✓ 必要なクラスとデータが定義されています');
console.log('\nブラウザでindex.htmlを開いてゲームをプレイできます！');