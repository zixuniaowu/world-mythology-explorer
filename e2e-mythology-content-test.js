// E2E Content Testing Script for All Mythology Systems
// 測試每個神話體系的內容頁面和導航功能

const puppeteer = require('puppeteer');

// 所有神話體系的配置
const mythologyConfig = {
    'chinese': {
        name: '中國神話',
        indexPage: 'chinese-mythology-index.html',
        stories: [
            { file: 'niulang-reader.html', title: '牛郎織女' },
            { file: 'houyi-reader.html', title: '后羿射日' },
            { file: 'baishe-reader.html', title: '白蛇傳' }
        ]
    },
    'japanese': {
        name: '日本神話',
        indexPage: 'japanese-mythology-index-ja.html',
        stories: [
            { file: 'amaterasu-reader.html', title: '天照大神' },
            { file: 'yamata-no-orochi-reader.html', title: 'ヤマタノオロチ' },
            { file: 'inaba-rabbit-reader.html', title: '因幡の白兎' }
        ]
    },
    'greek': {
        name: 'ギリシア神話',
        indexPage: 'greek-mythology-index-ja.html',
        stories: [
            { file: 'pandora-box-story-ja.html', title: 'パンドラの箱' },
            { file: 'perseus-medusa-story-ja.html', title: 'ペルセウスとメドゥーサ' },
            { file: 'orpheus-eurydice-story-ja.html', title: 'オルフェウスとエウリュディケー' }
        ]
    },
    'norse': {
        name: '北欧神話',
        indexPage: 'norse-mythology-index-ja.html',
        stories: [
            { file: 'thor-jormungandr-story-ja.html', title: 'トール対ヨルムンガンド' },
            { file: 'baldr-death-story-ja.html', title: 'バルドルの死' },
            { file: 'ragnarok-story-ja.html', title: 'ラグナロク' }
        ]
    },
    'egyptian': {
        name: 'エジプト神話',
        indexPage: 'egyptian-mythology-index-ja.html',
        stories: [
            { file: 'isis-osiris-story-ja.html', title: 'イシスとオシリス' },
            { file: 'ra-sun-journey-story-ja.html', title: 'ラーの太陽の旅' },
            { file: 'anubis-judgment-story-ja.html', title: 'アヌビスの審判' }
        ]
    },
    'indian': {
        name: 'インド神話',
        indexPage: 'indian-mythology-index-ja.html',
        stories: [
            { file: 'krishna-story-ja.html', title: 'クリシュナの物語' },
            { file: 'ramayana-story-ja.html', title: 'ラーマーヤナ' },
            { file: 'shiva-parvati-story-ja.html', title: 'シヴァとパールヴァティー' }
        ]
    },
    'mesopotamian': {
        name: 'メソポタミア神話',
        indexPage: 'mesopotamian-mythology-index-ja.html',
        stories: [
            { file: 'gilgamesh-story-ja.html', title: 'ギルガメシュ叙事詩' },
            { file: 'enuma-elish-story-ja.html', title: 'エヌマ・エリシュ' },
            { file: 'ishtar-underworld-story-ja.html', title: 'イシュタルの冥界下り' }
        ]
    },
    'native-american': {
        name: 'ネイティブアメリカン神話',
        indexPage: 'native-american-mythology-index-ja.html',
        stories: [
            { file: 'great-spirit-story-ja.html', title: 'グレート・スピリットの教え' },
            { file: 'coyote-creation-story-ja.html', title: 'コヨーテの創造物語' },
            { file: 'thunderbird-legend-ja.html', title: 'サンダーバードの伝説' }
        ]
    },
    'aztec-maya': {
        name: 'アステカ・マヤ神話',
        indexPage: 'aztec-maya-mythology-index-ja.html',
        stories: [
            { file: 'quetzalcoatl-legend-ja.html', title: 'ケツァルコアトルの伝説' },
            { file: 'hero-twins-adventure-ja.html', title: '英雄双子の冒険' },
            { file: 'five-suns-mythology-ja.html', title: '五つの太陽の神話' }
        ]
    },
    'celtic': {
        name: 'ケルト神話',
        indexPage: 'celtic-mythology-index-ja.html',
        stories: [
            { file: 'cu-chulainn-story-ja.html', title: 'クー・フーリンの物語' },
            { file: 'morrigan-story-ja.html', title: 'モリガンの物語' },
            { file: 'tir-na-nog-story-ja.html', title: 'ティル・ナ・ノーグの物語' }
        ]
    },
    'west-african': {
        name: '西アフリカ神話',
        indexPage: 'west-african-mythology-index-ja.html',
        stories: [
            { file: 'anansi-wisdom-story-ja.html', title: 'アナンシの知恵の物語' },
            { file: 'yemoja-ocean-story-ja.html', title: 'イエモジャの海の物語' },
            { file: 'shango-thunder-story-ja.html', title: 'シャンゴの雷の物語' }
        ]
    },
    'aboriginal': {
        name: 'オーストラリア原住民神話',
        indexPage: 'aboriginal-mythology-index-ja.html',
        stories: [
            { file: 'rainbow-serpent-story-ja.html', title: 'レインボーサーペントの物語' },
            { file: 'dreamtime-creation-story-ja.html', title: 'ドリームタイムの創造物語' },
            { file: 'kangaroo-ancestor-story-ja.html', title: 'カンガルーの祖先の物語' }
        ]
    },
    'polynesian': {
        name: 'ポリネシア神話',
        indexPage: 'polynesian-mythology-index-ja.html',
        stories: [
            { file: 'maui-sun-story-ja.html', title: 'マウイと太陽の物語' },
            { file: 'pele-volcano-story-ja.html', title: 'ペレの火山の物語' },
            { file: 'tangaroa-ocean-story-ja.html', title: 'タンガロアの海の物語' }
        ]
    }
};

async function testMythologyContent() {
    console.log('開始神話內容 E2E 測試...\n');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        defaultViewport: { width: 1200, height: 800 }
    });
    
    const page = await browser.newPage();
    const testResults = {};
    
    // 設置基礎 URL（假設使用本地服務器）
    const baseUrl = 'http://localhost:8000';
    
    try {
        // 首先測試主頁
        console.log('=== 測試主頁面 ===');
        await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
        
        const mainPageTitle = await page.title();
        console.log(`✓ 主頁面標題: ${mainPageTitle}`);
        
        // 檢查地圖是否加載
        const mapCanvas = await page.$('canvas');
        if (mapCanvas) {
            console.log('✓ 地圖 Canvas 已加載');
        } else {
            console.log('✗ 地圖 Canvas 未找到');
        }
        
        // 檢查神話標記
        const markers = await page.$$('.mythology-marker');
        console.log(`✓ 找到 ${markers.length} 個神話標記\n`);
        
        // 測試每個神話體系
        for (const [mythologyKey, config] of Object.entries(mythologyConfig)) {
            console.log(`=== 測試 ${config.name} ===`);
            testResults[mythologyKey] = {
                name: config.name,
                indexPageTest: { success: false, errors: [] },
                storyTests: []
            };
            
            try {
                // 測試索引頁面
                console.log(`測試索引頁面: ${config.indexPage}`);
                await page.goto(`${baseUrl}/${config.indexPage}`, { 
                    waitUntil: 'networkidle2', 
                    timeout: 10000 
                });
                
                const indexTitle = await page.title();
                console.log(`  ✓ 索引頁面標題: ${indexTitle}`);
                
                // 檢查頁面基本元素
                const headerExists = await page.$('.header') !== null;
                const navExists = await page.$('.nav') !== null;
                const contentExists = await page.$('.container') !== null;
                const storyCards = await page.$$('.story-card');
                
                console.log(`  ✓ 頁面結構: Header(${headerExists}) Nav(${navExists}) Content(${contentExists})`);
                console.log(`  ✓ 故事卡片數量: ${storyCards.length}`);
                
                testResults[mythologyKey].indexPageTest.success = true;
                testResults[mythologyKey].indexPageTest.storyCardCount = storyCards.length;
                
                // 測試故事卡片的點擊功能
                console.log(`  測試故事卡片點擊功能:`);
                for (let i = 0; i < Math.min(storyCards.length, 3); i++) {
                    try {
                        const card = storyCards[i];
                        const storyTitle = await page.evaluate(el => {
                            const h4 = el.querySelector('h4');
                            return h4 ? h4.textContent.trim() : '未知標題';
                        }, card);
                        
                        console.log(`    測試卡片 ${i + 1}: ${storyTitle}`);
                        
                        // 點擊卡片
                        await card.click();
                        await page.waitForTimeout(2000);
                        
                        // 檢查是否導航到故事頁面
                        const currentUrl = page.url();
                        const storyPageTitle = await page.title();
                        
                        if (currentUrl !== `${baseUrl}/${config.indexPage}`) {
                            console.log(`      ✓ 成功導航到故事頁面`);
                            console.log(`      ✓ 故事頁面標題: ${storyPageTitle}`);
                            
                            // 檢查故事頁面內容
                            const storyContent = await page.$('.story-content');
                            const storyText = storyContent ? await page.evaluate(el => el.textContent.length, storyContent) : 0;
                            
                            console.log(`      ✓ 故事內容長度: ${storyText} 字符`);
                            
                            testResults[mythologyKey].storyTests.push({
                                title: storyTitle,
                                success: true,
                                contentLength: storyText,
                                url: currentUrl
                            });
                        } else {
                            console.log(`      ✗ 點擊後未導航到新頁面`);
                            testResults[mythologyKey].storyTests.push({
                                title: storyTitle,
                                success: false,
                                error: '點擊後未導航'
                            });
                        }
                        
                        // 返回索引頁面
                        await page.goto(`${baseUrl}/${config.indexPage}`, { 
                            waitUntil: 'networkidle2', 
                            timeout: 10000 
                        });
                        await page.waitForTimeout(1000);
                        
                    } catch (cardError) {
                        console.log(`      ✗ 測試卡片 ${i + 1} 失敗: ${cardError.message}`);
                        testResults[mythologyKey].storyTests.push({
                            title: `卡片 ${i + 1}`,
                            success: false,
                            error: cardError.message
                        });
                    }
                }
                
                // 直接測試故事頁面
                console.log(`  直接測試故事頁面:`);
                for (const story of config.stories) {
                    try {
                        console.log(`    測試: ${story.title} (${story.file})`);
                        await page.goto(`${baseUrl}/${story.file}`, { 
                            waitUntil: 'networkidle2', 
                            timeout: 10000 
                        });
                        
                        const storyTitle = await page.title();
                        const storyContent = await page.$('.story-content');
                        const contentLength = storyContent ? await page.evaluate(el => el.textContent.length, storyContent) : 0;
                        
                        // 檢查動畫效果
                        const hasAnimations = await page.evaluate(() => {
                            const styles = Array.from(document.styleSheets).flatMap(sheet => {
                                try {
                                    return Array.from(sheet.cssRules);
                                } catch {
                                    return [];
                                }
                            });
                            return styles.some(rule => rule.type === CSSRule.KEYFRAMES_RULE);
                        });
                        
                        console.log(`      ✓ 頁面標題: ${storyTitle}`);
                        console.log(`      ✓ 內容長度: ${contentLength} 字符`);
                        console.log(`      ✓ 包含動畫: ${hasAnimations ? '是' : '否'}`);
                        
                    } catch (storyError) {
                        console.log(`      ✗ ${story.title} 測試失敗: ${storyError.message}`);
                        testResults[mythologyKey].indexPageTest.errors.push({
                            story: story.title,
                            error: storyError.message
                        });
                    }
                }
                
            } catch (indexError) {
                console.log(`  ✗ ${config.name} 索引頁面測試失敗: ${indexError.message}`);
                testResults[mythologyKey].indexPageTest.errors.push(indexError.message);
            }
            
            console.log(''); // 空行分隔
        }
        
    } catch (error) {
        console.error('測試過程中發生錯誤:', error);
    }
    
    // 生成測試報告
    console.log('\n=== 測試報告摘要 ===');
    let totalMythologies = Object.keys(mythologyConfig).length;
    let successfulMythologies = 0;
    let totalStoryTests = 0;
    let successfulStoryTests = 0;
    
    for (const [key, result] of Object.entries(testResults)) {
        if (result.indexPageTest.success) {
            successfulMythologies++;
        }
        
        totalStoryTests += result.storyTests.length;
        successfulStoryTests += result.storyTests.filter(test => test.success).length;
        
        console.log(`\n${result.name}:`);
        console.log(`  索引頁面: ${result.indexPageTest.success ? '✓ 成功' : '✗ 失敗'}`);
        console.log(`  故事測試: ${result.storyTests.filter(t => t.success).length}/${result.storyTests.length} 成功`);
        
        if (result.indexPageTest.errors.length > 0) {
            console.log(`  錯誤:`);
            result.indexPageTest.errors.forEach(error => {
                console.log(`    - ${typeof error === 'string' ? error : error.error}`);
            });
        }
    }
    
    console.log(`\n總體統計:`);
    console.log(`- 神話體系: ${successfulMythologies}/${totalMythologies} 成功`);
    console.log(`- 故事頁面: ${successfulStoryTests}/${totalStoryTests} 成功`);
    console.log(`- 成功率: ${((successfulMythologies / totalMythologies) * 100).toFixed(1)}%`);
    
    // 保存詳細報告
    const fs = require('fs');
    const reportPath = 'mythology-e2e-test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
    console.log(`\n詳細測試報告已保存到: ${reportPath}`);
    
    await browser.close();
    console.log('\nE2E 內容測試完成！');
}

// 檢查是否直接運行此腳本
if (require.main === module) {
    testMythologyContent().catch(console.error);
}

module.exports = { testMythologyContent, mythologyConfig };