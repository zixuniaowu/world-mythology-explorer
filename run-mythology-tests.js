// Test Runner Script for Mythology E2E Tests
// 神話內容測試運行器

const { spawn, exec } = require('child_process');
const http = require('http');
const path = require('path');

// 檢查端口是否可用
function checkPort(port) {
    return new Promise((resolve) => {
        const server = http.createServer();
        server.listen(port, () => {
            server.close(() => resolve(true));
        });
        server.on('error', () => resolve(false));
    });
}

// 檢查服務器是否運行
function checkServer(url) {
    return new Promise((resolve) => {
        http.get(url, (res) => {
            resolve(res.statusCode === 200);
        }).on('error', () => resolve(false));
    });
}

// 啟動本地服務器
function startServer(port = 8000) {
    return new Promise((resolve, reject) => {
        console.log(`啟動本地服務器在端口 ${port}...`);
        
        // 嘗試使用 Python HTTP 服務器
        const server = spawn('python3', ['-m', 'http.server', port.toString()], {
            cwd: __dirname,
            stdio: 'pipe'
        });
        
        let serverReady = false;
        
        server.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(`服務器輸出: ${output}`);
            if (output.includes('Serving HTTP') && !serverReady) {
                serverReady = true;
                setTimeout(() => resolve(server), 2000); // 等待2秒確保服務器完全啟動
            }
        });
        
        server.stderr.on('data', (data) => {
            console.error(`服務器錯誤: ${data}`);
        });
        
        server.on('error', (error) => {
            console.error(`無法啟動服務器: ${error.message}`);
            reject(error);
        });
        
        // 10秒超時
        setTimeout(() => {
            if (!serverReady) {
                reject(new Error('服務器啟動超時'));
            }
        }, 10000);
    });
}

// 檢查依賴
function checkDependencies() {
    return new Promise((resolve) => {
        exec('npm list puppeteer', (error, stdout, stderr) => {
            if (error) {
                console.log('❌ Puppeteer 未安裝');
                console.log('請運行: npm install puppeteer');
                resolve(false);
            } else {
                console.log('✅ Puppeteer 已安裝');
                resolve(true);
            }
        });
    });
}

async function runTests() {
    console.log('=== 神話內容 E2E 測試運行器 ===\n');
    
    // 檢查依賴
    console.log('檢查依賴項...');
    const hasDependencies = await checkDependencies();
    if (!hasDependencies) {
        console.log('\n請先安裝必要的依賴項再運行測試。');
        process.exit(1);
    }
    
    // 檢查服務器
    const serverUrl = 'http://localhost:8000';
    console.log('\n檢查本地服務器...');
    
    let serverRunning = await checkServer(serverUrl);
    let serverProcess = null;
    
    if (!serverRunning) {
        console.log('本地服務器未運行，嘗試啟動...');
        try {
            const portAvailable = await checkPort(8000);
            if (!portAvailable) {
                console.log('❌ 端口 8000 被占用，請手動啟動服務器或更改端口');
                process.exit(1);
            }
            
            serverProcess = await startServer(8000);
            console.log('✅ 服務器已啟動');
            
            // 再次確認服務器運行
            await new Promise(resolve => setTimeout(resolve, 3000));
            serverRunning = await checkServer(serverUrl);
            if (!serverRunning) {
                throw new Error('服務器啟動失敗');
            }
        } catch (error) {
            console.error('❌ 無法啟動服務器:', error.message);
            console.log('\n請手動啟動本地服務器:');
            console.log('  python3 -m http.server 8000');
            console.log('然後重新運行此測試。');
            process.exit(1);
        }
    } else {
        console.log('✅ 服務器已運行');
    }
    
    // 運行測試
    console.log('\n開始運行 E2E 測試...\n');
    try {
        const { testMythologyContent } = require('./e2e-mythology-content-test.js');
        await testMythologyContent();
        
        console.log('\n🎉 所有測試完成！');
        
    } catch (error) {
        console.error('❌ 測試執行失敗:', error.message);
    } finally {
        // 清理服務器進程
        if (serverProcess) {
            console.log('\n關閉服務器...');
            serverProcess.kill('SIGTERM');
        }
    }
}

// 優雅退出處理
process.on('SIGINT', () => {
    console.log('\n測試被中斷');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n測試被終止');
    process.exit(0);
});

// 運行測試
if (require.main === module) {
    runTests().catch(console.error);
}