// Configuration
const LIFF_ID = '2006943877-jnL7pvge'; // Replace with your LIFF ID for scanner app
const API_URL = 'https://script.google.com/macros/s/AKfycbwevFe06bnQSzQJcOTucesqIAStCblfuqf61z7IPE2YeXWc7fQu8EtZOEDoArrPJTbqbw/exec'; // Replace with your GAS web app URL

// Global variables
let liffInitialized = false;
let userProfile = null;

// Initialize LIFF
// Update the initializeLiff function in script.js
async function initializeLiff() {
    try {
        await liff.init({ liffId: LIFF_ID });
        
        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }

        // Get user profile
        userProfile = await liff.getProfile();
        document.getElementById('userName').textContent = userProfile.displayName;
        
        liffInitialized = true;
        
        // Enhanced scan capability detection
        await checkScanCapabilities();
        
    } catch (error) {
        console.error('LIFF initialization failed:', error);
        document.getElementById('userName').textContent = '取得失敗';
        showError('LIFF 初始化失敗: ' + error.message);
    }
}

// Add this new function to detect scan capabilities
async function checkScanCapabilities() {
    const scanBtn = document.getElementById('scanBtn');
    
    // Check if scanCodeV2 is available
    if (!liff.isApiAvailable('scanCodeV2')) {
        scanBtn.disabled = true;
        scanBtn.innerHTML = '❌ 掃描功能不可用';
        
        // Get more context information
        const context = liff.getContext();
        let errorDetails = '您的裝置不支援條碼掃描功能。\n\n';
        errorDetails += `裝置類型: ${context.type || '未知'}\n`;
        errorDetails += `LIFF 視窗模式: ${context.viewType || '未知'}\n`;
        
        if (context.viewType !== 'full') {
            errorDetails += '\n💡 可能原因: LIFF 應用程式必須設定為「Full」大小才能使用相機功能。';
        }
        
        showError(errorDetails);
        return;
    }
    
    // Check if we're in a supported environment
    const context = liff.getContext();
    if (context.type !== 'utou' && context.type !== 'room' && context.type !== 'group') {
        scanBtn.disabled = true;
        scanBtn.innerHTML = '❌ 環境不支援';
        showError('掃描功能僅在聊天室、群組或 1:1 聊天中可用。');
        return;
    }
    
    // All checks passed - enable scan button
    scanBtn.disabled = false;
    scanBtn.innerHTML = '📷 掃描集點卡條碼';
    console.log('Scan functionality is available');
}

// Switch between tabs
function switchTab(tabName) {
    // Update tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activate selected tab
    document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Clear previous results
    clearResult();
}

// Scan barcode function
async function scanBarcode() {
    if (!liffInitialized) {
        showError('LIFF 尚未初始化完成，請稍後再試。');
        return;
    }

    try {
        showLoading(true);
        
        const scanResult = await liff.scanCodeV2();
        const scannedCode = scanResult.value;
        
        console.log('Scanned code:', scannedCode);
        
        // Validate scanned code format (STAMP-XXXXXX)
        if (!isValidCardId(scannedCode)) {
            showError(`掃描失敗: 無效的集點卡格式\n\n掃描內容: ${scannedCode}\n\n請確認掃描的是正確的集點卡條碼。`);
            showLoading(false);
            return;
        }
        
        // Process the scanned card
        await processStampCard(scannedCode);
        
    } catch (error) {
        console.error('Scan error:', error);
        showLoading(false);
        
        if (error.message.includes('user canceled')) {
            showError('掃描已取消');
        } else {
            showError('掃描失敗: ' + error.message);
        }
    }
}

// Manual input submission
async function submitManualInput() {
    const cardIdInput = document.getElementById('cardIdInput');
    const cardId = cardIdInput.value.trim().toUpperCase();
    
    if (!cardId) {
        showError('請輸入集點卡號碼');
        return;
    }
    
    if (!isValidCardId(cardId)) {
        showError('無效的集點卡格式\n\n請輸入格式: STAMP-XXXXXX\n例如: STAMP-ABC123');
        return;
    }
    
    await processStampCard(cardId);
}

// Validate card ID format
function isValidCardId(cardId) {
    const stampCardPattern = /^STAMP-[A-Z0-9]{6}$/;
    return stampCardPattern.test(cardId);
}

// Process stamp card - add stamp
async function processStampCard(cardId) {
    try {
        showLoading(true);
        
        // Call backend API to add stamp
        const result = await addStampToCard(cardId);
        
        showLoading(false);
        
        if (result.success) {
            showSuccess(result.message);
            
            // Clear input if manual mode
            document.getElementById('cardIdInput').value = '';
            
        } else {
            showError(result.error || '添加戳記失敗');
        }
        
    } catch (error) {
        console.error('Process stamp card error:', error);
        showLoading(false);
        showError('處理失敗: ' + error.message);
    }
}

// Call backend API to add stamp
async function addStampToCard(cardId) {
    return new Promise((resolve, reject) => {
        // Create JSONP request
        const callbackName = 'handleAddStampResponse_' + Date.now();
        const script = document.createElement('script');
        
        window[callbackName] = function(response) {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(response);
        };
        
        const url = API_URL + 
            '?action=addStamp' +
            '&cardId=' + encodeURIComponent(cardId) +
            '&adminName=' + encodeURIComponent(userProfile?.displayName || 'LIFF Scanner') +
            '&callback=' + callbackName;
        
        script.src = url;
        script.onerror = function() {
            delete window[callbackName];
            document.body.removeChild(script);
            reject(new Error('API request failed'));
        };
        
        document.body.appendChild(script);
    });
}

// Alternative method using fetch (if CORS is configured)
async function addStampToCardFetch(cardId) {
    try {
        const params = new URLSearchParams({
            action: 'addStamp',
            cardId: cardId,
            adminName: userProfile?.displayName || 'LIFF Scanner'
        });
        
        const response = await fetch(API_URL + '?' + params.toString(), {
            method: 'GET',
            mode: 'cors'
        });
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        throw new Error('Network request failed: ' + error.message);
    }
}

// UI Helper functions
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showSuccess(message) {
    const resultSection = document.getElementById('resultSection');
    resultSection.className = 'result-section success';
    resultSection.innerHTML = `
        <h3>✅ 操作成功</h3>
        <div style="white-space: pre-line;">${message}</div>
        <button onclick="clearResult()" style="margin-top: 15px; padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
            繼續掃描
        </button>
    `;
    resultSection.style.display = 'block';
}

function showError(message) {
    const resultSection = document.getElementById('resultSection');
    resultSection.className = 'result-section error';
    resultSection.innerHTML = `
        <h3>❌ 操作失敗</h3>
        <div style="white-space: pre-line;">${message}</div>
        <button onclick="clearResult()" style="margin-top: 15px; padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">
            重新嘗試
        </button>
    `;
    resultSection.style.display = 'block';
}

function clearResult() {
    document.getElementById('resultSection').style.display = 'none';
}

// Event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize LIFF
    initializeLiff();
    
    // Scan button event
    document.getElementById('scanBtn').addEventListener('click', scanBarcode);
    
    // Manual submit button event
    document.getElementById('manualSubmitBtn').addEventListener('click', submitManualInput);
    
    // Enter key support for manual input
    document.getElementById('cardIdInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitManualInput();
        }
    });
    
    // Auto-format card ID input
    document.getElementById('cardIdInput').addEventListener('input', function(e) {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
        
        // Auto-insert "STAMP-" if user starts typing numbers/letters
        if (value.length > 0 && !value.startsWith('STAMP-')) {
            if (/^[A-Z0-9]{1,6}$/.test(value)) {
                value = 'STAMP-' + value;
            }
        }
        
        e.target.value = value;
    });
});

// Handle page visibility changes (for when returning from camera)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible again (likely returning from camera)
        showLoading(false);
    }
});
