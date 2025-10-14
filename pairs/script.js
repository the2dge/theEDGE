
let score = 0;
let userName = "";

const API_URL = 'https://script.google.com/macros/s/AKfycbwevFe06bnQSzQJcOTucesqIAStCblfuqf61z7IPE2YeXWc7fQu8EtZOEDoArrPJTbqbw/exec';
//const API_URL ='https://script.google.com/macros/s/AKfycbzDQHnqmUYn2HWvGQWl2z8Dul6lr5meaMRnSYpBo1PN/dev';

//const user = document.querySelector("#user");
const userDisplay = document.querySelector("#userDisplay");
const saveButton = document.querySelector("#saveButton");
const LIFF_ID = '2006943877-0OpzQ1Vb';

// Initialize LIFF
async function initializeLiff() {
    try {
        await liff.init({ liffId: LIFF_ID });
        
        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }
        
        // Get user profile
        const profile = await liff.getProfile();
        userName = profile.displayName;
        userId = profile.userId;
        // Display userName instead of "你"
        userDisplay.innerText = userName.substring(0, 8);
        
    } catch (error) {
        console.error('LIFF initialization failed', error);
        userDisplay.innerText = "LINE User";
    }
}

// Call LIFF initialization when page loads
document.addEventListener('DOMContentLoaded', initializeLiff);


// Global callback function for JSONP
window.handleSaveScore = function(response) {
    console.log("Save score response:", response);
    
    // Re-enable the button
    saveButton.disabled = false;
    saveButton.textContent = "儲存分數到紀錄";
    
    // Remove the script tag
    const script = document.getElementById('jsonp-script');
    if (script) {
        script.remove();
    }
    
    if (response && response.success) {
        alert("分數已成功儲存！🎉\n\n恭喜！我們已發送一張優惠券到您的LINE帳號！");
        console.log("Score saved successfully:", response);
    } else {
        alert("儲存失敗: " + (response ? response.error : "Unknown error"));
        console.error('Error saving score:', response);
    }
}

// Function to save score to Google Sheets using JSONP
function saveScore() {
    if (!userName) {
        alert("無法獲取用戶信息，請重新載入頁面");
        return;
    }
    
    // Disable the save button to prevent multiple clicks
    saveButton.disabled = true;
    saveButton.textContent = "儲存中...";
    
    // Create JSONP request following your successful example format
    const script = document.createElement('script');
    const url = API_URL + 
        '?action=playScore' +
        '&userId=' + encodeURIComponent(userId) +
        '&userName=' + encodeURIComponent(userName) +
        '&score=' + encodeURIComponent(score) +
        '&timestamp=' + encodeURIComponent(new Date().toISOString()) +
        '&callback=handleSaveScore';
    
    console.log("Saving score with URL:", url);
    
    script.id = 'jsonp-script';
    script.src = url;
    script.onerror = function() {
        console.error('JSONP script failed to load');
        alert('儲存失敗，請稍後再試。');
        saveButton.textContent = '儲存分數到紀錄';
        saveButton.disabled = false;
        
        // Remove the script tag
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
    };
    
    document.body.appendChild(script);
}
