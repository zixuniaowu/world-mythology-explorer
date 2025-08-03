// E2E Mobile Testing Script using Puppeteer
// 測試手機端泡泡標記的可點擊性和重疊問題

const puppeteer = require('puppeteer');

async function testMobileView() {
    console.log('開始手機端E2E測試...\n');
    
    const browser = await puppeteer.launch({
        headless: false, // 設為false可以看到瀏覽器操作
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 設置手機視圖
    const devices = [
        { name: 'iPhone 12', viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)' },
        { name: 'Samsung Galaxy S21', viewport: { width: 360, height: 800 }, userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)' },
        { name: 'iPad Mini', viewport: { width: 768, height: 1024 }, userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)' }
    ];
    
    for (const device of devices) {
        console.log(`\n測試設備: ${device.name}`);
        console.log(`視圖大小: ${device.viewport.width}x${device.viewport.height}`);
        
        // 設置視圖和用戶代理
        await page.setViewport(device.viewport);
        await page.setUserAgent(device.userAgent);
        
        // 訪問頁面
        await page.goto('http://localhost:8888', { waitUntil: 'networkidle2' });
        
        // 等待標記加載
        await page.waitForSelector('.mythology-marker', { timeout: 5000 });
        
        // 獲取所有標記
        const markers = await page.$$('.mythology-marker');
        console.log(`找到 ${markers.length} 個神話標記`);
        
        // 檢查標記重疊
        const markerPositions = await page.evaluate(() => {
            const markers = document.querySelectorAll('.mythology-marker');
            return Array.from(markers).map(marker => {
                const rect = marker.getBoundingClientRect();
                return {
                    mythology: marker.dataset.mythology,
                    left: rect.left,
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom,
                    width: rect.width,
                    height: rect.height
                };
            });
        });
        
        // 分析重疊情況
        let overlapCount = 0;
        const overlappingPairs = [];
        
        for (let i = 0; i < markerPositions.length; i++) {
            for (let j = i + 1; j < markerPositions.length; j++) {
                const marker1 = markerPositions[i];
                const marker2 = markerPositions[j];
                
                // 檢查是否重疊
                const overlap = !(marker1.right < marker2.left || 
                                marker2.right < marker1.left || 
                                marker1.bottom < marker2.top || 
                                marker2.bottom < marker1.top);
                
                if (overlap) {
                    overlapCount++;
                    overlappingPairs.push({
                        marker1: marker1.mythology,
                        marker2: marker2.mythology,
                        distance: Math.sqrt(
                            Math.pow((marker1.left + marker1.width/2) - (marker2.left + marker2.width/2), 2) +
                            Math.pow((marker1.top + marker1.height/2) - (marker2.top + marker2.height/2), 2)
                        )
                    });
                }
            }
        }
        
        console.log(`\n重疊分析:`);
        console.log(`- 總共有 ${overlapCount} 對標記重疊`);
        if (overlappingPairs.length > 0) {
            console.log(`- 重疊的標記對:`);
            overlappingPairs.forEach(pair => {
                console.log(`  * ${pair.marker1} <-> ${pair.marker2} (距離: ${pair.distance.toFixed(2)}px)`);
            });
        }
        
        // 測試點擊功能
        console.log(`\n測試點擊功能:`);
        const clickTests = ['china', 'japan', 'greek', 'egypt', 'india'];
        
        for (const mythology of clickTests) {
            try {
                const marker = await page.$(`[data-mythology="${mythology}"]`);
                if (marker) {
                    // 檢查是否可點擊
                    const isClickable = await page.evaluate(el => {
                        const rect = el.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        const elementAtPoint = document.elementFromPoint(centerX, centerY);
                        return elementAtPoint === el || el.contains(elementAtPoint);
                    }, marker);
                    
                    console.log(`- ${mythology}: ${isClickable ? '✓ 可點擊' : '✗ 被遮擋'}`);
                    
                    if (isClickable) {
                        // 嘗試點擊
                        await marker.click();
                        await page.waitForTimeout(500);
                        
                        // 檢查是否導航到新頁面
                        const currentUrl = page.url();
                        if (currentUrl.includes(mythology)) {
                            console.log(`  → 成功導航到 ${mythology} 頁面`);
                            await page.goBack();
                            await page.waitForSelector('.mythology-marker', { timeout: 5000 });
                        }
                    }
                } else {
                    console.log(`- ${mythology}: 未找到標記`);
                }
            } catch (error) {
                console.log(`- ${mythology}: 測試失敗 - ${error.message}`);
            }
        }
        
        // 截圖保存
        await page.screenshot({ 
            path: `mobile-test-${device.name.replace(/\s+/g, '-')}.png`,
            fullPage: true 
        });
        console.log(`\n已保存截圖: mobile-test-${device.name.replace(/\s+/g, '-')}.png`);
    }
    
    await browser.close();
    console.log('\n\nE2E測試完成！');
}

// 運行測試
testMobileView().catch(console.error);