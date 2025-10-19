// Configuration
const LIFF_ID = '2006943877-dOYKXNr1'; // Replace with your LIFF ID
const API_URL = 'https://script.google.com/macros/s/AKfycbwevFe06bnQSzQJcOTucesqIAStCblfuqf61z7IPE2YeXWc7fQu8EtZOEDoArrPJTbqbw/exec';

// Global variables
//let userProfile = null;
let userProfile.displayName ="Ming";
let memberData = null;

// Initialize the app
async function initializeApp() {
    try {
        // Initialize LIFF
        await liff.init({ liffId: LIFF_ID });
        
        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }

        // Get user profile
        userProfile = await liff.getProfile();
        console.log("userProfile is: ", userProfile);
        displayUserInfo();
        
        // Load member data
        await loadMemberData();
        
    } catch (error) {
        console.error('Initialization error:', error);
        showError('初始化失敗，請重新整理頁面');
    }
}

// Display user information
function displayUserInfo() {
    document.getElementById('memberName').textContent = userProfile.displayName;
    document.getElementById('memberId').textContent = `ID: ${userProfile.userId.substring(0, 8)}...`;
    document.getElementById('cardNumber').textContent = `MEM-${userProfile.userId.substring(0, 6).toUpperCase()}`;
}

// Load all member data
async function loadMemberData() {
    try {
        // Simulate loading multiple data sources
        await Promise.all([
            loadStampCards(),
            loadCoupons(),
            loadHistory(),
            updateStats()
        ]);
        
    } catch (error) {
        console.error('Load data error:', error);
        showError('載入資料失敗');
    }
}

// Load stamp cards data
async function loadStampCards() {
    try {
        const stampCards = await fetchStampCards();
        displayStampCards(stampCards);
    } catch (error) {
        document.getElementById('stampCardsList').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 15px; color: #e74c3c;"></i>
                <div>無法載入集點卡資料</div>
            </div>
        `;
    }
}

// Load coupons data
async function loadCoupons() {
    try {
        const coupons = await fetchCoupons();
        displayCoupons(coupons);
    } catch (error) {
        document.getElementById('couponsList').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 15px; color: #e74c3c;"></i>
                <div>無法載入優惠券資料</div>
            </div>
        `;
    }
}

// Load history data
async function loadHistory() {
    try {
        const history = await fetchHistory();
        displayHistory(history);
    } catch (error) {
        document.getElementById('historyList').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 15px; color: #e74c3c;"></i>
                <div>無法載入消費記錄</div>
            </div>
        `;
    }
}

// Update statistics
async function updateStats() {
    try {
        const stats = await fetchStats();
        document.getElementById('stampCount').textContent = stats.totalStamps || '0';
        document.getElementById('completedCards').textContent = stats.completedCards || '0';
        document.getElementById('activeCoupons').textContent = stats.activeCoupons || '0';
        document.getElementById('totalVisits').textContent = stats.totalVisits || '0';
    } catch (error) {
        console.error('Update stats error:', error);
    }
}

// Display stamp cards
function displayStampCards(stampCards) {
    const container = document.getElementById('stampCardsList');
    
    if (!stampCards || stampCards.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-stamp" style="font-size: 40px; margin-bottom: 15px; color: #8B4513;"></i>
                <div>尚無集點卡</div>
                <div style="font-size: 12px; margin-top: 8px;">開始消費即可獲得集點卡</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = stampCards.map(card => `
        <div class="stamp-card">
            <div class="stamp-card-header">
                <div class="stamp-card-id">${card.cardId}</div>
                <div class="stamp-card-status ${card.isComplete ? 'completed' : ''}">
                    ${card.isComplete ? '可兌換' : '集點中'}
                </div>
            </div>
            
            <div class="stamp-progress">
                <div class="stamp-visual">
                    ${createStampVisual(card.currentStamps, card.maxStamps)}
                </div>
                <div class="stamp-text">
                    ${card.currentStamps} / ${card.maxStamps} 個戳記
                </div>
            </div>
            
            <div class="stamp-actions">
                <button class="btn btn-secondary" onclick="viewCardDetails('${card.cardId}')">
                    <i class="fas fa-info-circle"></i> 詳細資訊
                </button>
                ${card.isComplete ? `
                    <button class="btn btn-primary" onclick="claimReward('${card.cardId}')">
                        <i class="fas fa-gift"></i> 兌換獎勵
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Display coupons
function displayCoupons(coupons) {
    const container = document.getElementById('couponsList');
    
    if (!coupons || coupons.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-ticket-alt" style="font-size: 40px; margin-bottom: 15px; color: #8B4513;"></i>
                <div>尚無優惠券</div>
                <div style="font-size: 12px; margin-top: 8px;">完成集點卡或參與活動獲得優惠券</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = coupons.map(coupon => `
        <div class="coupon-item">
            <div class="coupon-header">
                <div class="coupon-code">${coupon.code}</div>
                <div class="coupon-status">${coupon.status}</div>
            </div>
            <div class="coupon-details">
                <div class="coupon-source">來自: ${coupon.source}</div>
                <div class="coupon-expiry">到期: ${formatDate(coupon.expiry)}</div>
            </div>
            <button class="btn btn-primary" onclick="useCoupon('${coupon.code}')" 
                    ${coupon.status !== '可使用' ? 'disabled style="opacity: 0.5;"' : ''}>
                <i class="fas fa-shopping-cart"></i> 立即使用
            </button>
        </div>
    `).join('');
}

// Display history
function displayHistory(history) {
    const container = document.getElementById('historyList');
    
    if (!history || history.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-history" style="font-size: 40px; margin-bottom: 15px; color: #8B4513;"></i>
                <div>尚無消費記錄</div>
                <div style="font-size: 12px; margin-top: 8px;">開始消費後將顯示記錄</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-info">
                <div class="history-type">${item.type}</div>
                <div class="history-date">${formatDateTime(item.date)}</div>
            </div>
            <div class="history-points ${item.points < 0 ? 'negative' : ''}">
                ${item.points > 0 ? '+' : ''}${item.points}
            </div>
        </div>
    `).join('');
}

// Create visual stamp representation
function createStampVisual(current, max) {
    const filled = '🔴';
    const empty = '⚪';
    let visual = '';
    
    for (let i = 0; i < max; i++) {
        if (i < current) {
            visual += filled;
        } else {
            visual += empty;
        }
        
        // Add line break every 5 stamps
        if ((i + 1) % 5 === 0 && i !== max - 1) {
            visual += '\n';
        } else {
            visual += ' ';
        }
    }
    
    return visual;
}

// Switch between tabs
function switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Activate selected tab
    document.querySelector(`.nav-tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName + 'Section').classList.add('active');
}

// Mock API functions - Replace with your actual API calls
async function fetchStampCards() {
    // Simulate API call
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    cardId: 'STAMP-ABC123',
                    currentStamps: 8,
                    maxStamps: 10,
                    isComplete: false,
                    created: '2024-01-15'
                },
                {
                    cardId: 'STAMP-DEF456',
                    currentStamps: 10,
                    maxStamps: 10,
                    isComplete: true,
                    created: '2024-01-10'
                }
            ]);
        }, 1000);
    });
}

async function fetchCoupons() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    code: 'EDGE-WELCOME20',
                    source: '新會員禮',
                    expiry: '2024-12-31',
                    status: '可使用'
                },
                {
                    code: 'EDGE-STAMP456',
                    source: '集點卡獎勵',
                    expiry: '2024-06-30',
                    status: '可使用'
                }
            ]);
        }, 1000);
    });
}

async function fetchHistory() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    type: '消費集點',
                    date: '2024-01-20 14:30',
                    points: 1
                },
                {
                    type: '兌換獎勵',
                    date: '2024-01-18 11:15',
                    points: -10
                },
                {
                    type: '消費集點',
                    date: '2024-01-15 09:45',
                    points: 1
                }
            ]);
        }, 1000);
    });
}

async function fetchStats() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                totalStamps: 18,
                completedCards: 1,
                activeCoupons: 2,
                totalVisits: 15
            });
        }, 500);
    });
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW');
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('zh-TW');
}

function showError(message) {
    alert('錯誤: ' + message);
}

// Action functions
function viewCardDetails(cardId) {
    alert(`查看集點卡詳細資訊: ${cardId}`);
    // Implement card details view
}

function claimReward(cardId) {
    if (confirm(`確定要兌換集點卡 ${cardId} 的獎勵嗎？`)) {
        alert(`已兌換集點卡 ${cardId} 的獎勵！`);
        // Implement reward claim logic
    }
}

function useCoupon(couponCode) {
    alert(`使用優惠券: ${couponCode}\n請向店員出示此優惠券代碼`);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're in LIFF environment
    if (typeof liff !== 'undefined') {
        initializeApp();
    } else {
        // Demo mode - display sample data
        displayUserInfo();
        loadMemberData();
        document.getElementById('memberName').textContent = 'Demo User';
        document.getElementById('memberId').textContent = 'ID: DEMO1234';
        document.getElementById('cardNumber').textContent = 'MEM-DEMO123';
    }
});

// Add swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) < swipeThreshold) return;
    
    const currentTab = document.querySelector('.nav-tab.active').textContent;
    
    if (swipeDistance > 0) {
        // Swipe right - previous tab
        switch(currentTab) {
            case '優惠券': switchTab('stamps'); break;
            case '消費記錄': switchTab('coupons'); break;
        }
    } else {
        // Swipe left - next tab
        switch(currentTab) {
            case '集點卡': switchTab('coupons'); break;
            case '優惠券': switchTab('history'); break;
        }
    }
}
