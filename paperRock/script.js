let score = 0;
let userName = "";
const opts = {
    "剪刀": { // Scissors
        icon: "✌️",
        winner: "布" // Beats Paper
    },
    "石頭": { // Rock
        icon: "✊",
        winner: "剪刀" // Beats Scissors
    },
    "布": { // Paper
        icon: "✋",
        winner: "石頭" // Beats Rock
    },
    default: {
        icon: "✊",
        winner: ""
    }
};

const choices = {
    user: "default",
    cpu: "default"
};

const inplay = ["哦，懸念…", "讓我們等待判決...", "耐心等待獲勝者", "也許，也許，也許，也許", "誰會贏？"];

const API_URL = 'https://script.google.com/macros/s/AKfycbwevFe06bnQSzQJcOTucesqIAStCblfuqf61z7IPE2YeXWc7fQu8EtZOEDoArrPJTbqbw/exec';

const choiceBtns = document.querySelectorAll("button");
const user = document.querySelector("#user");
const cpu = document.querySelector("#cpu");
const userDisplay = document.querySelector("#userDisplay");
const saveButton = document.querySelector("#saveButton");
const LIFF_ID = '2006943877-JRNE3RZy';

user.addEventListener("animationend", animationListen, false);
cpu.addEventListener("animationend", animationListen, false);

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
        
        // Display userName instead of "你"
        userDisplay.innerText = userName.substring(0, 8);
        
    } catch (error) {
        console.error('LIFF initialization failed', error);
        userDisplay.innerText = "LINE User";
    }
}

// Call LIFF initialization when page loads
document.addEventListener('DOMContentLoaded', initializeLiff);

function anim(choice) {
    for (let i of choiceBtns) {
        i.disabled = true;
    }
    choices.user = choice;
    
    // Get random CPU choice from the Chinese options
    const chineseChoices = ["剪刀", "石頭", "布"];
    choices.cpu = chineseChoices[Math.floor(Math.random() * 3)];
    
    user.classList.add("animate");
    cpu.classList.add("animate");
    document.querySelector("#feedback").innerText = inplay[Math.floor(Math.random() * inplay.length)];
    user.querySelector(".curr").innerText = opts.default.icon;
    cpu.querySelector(".curr").innerText = opts.default.icon;
}

function animationListen(ev) {
    if (ev.type === "animationend") {
        if (ev.animationName === "rps") {
            ev.currentTarget.classList.remove("animate");
            for (let i of choiceBtns) {
                i.disabled = false;
            }
            if (ev.currentTarget.id === "user") {
                document.querySelector("#feedback").innerText = result();
                document.querySelector("#score").innerText = score;
                
                // Show save button if score > 5
                if (score > 5) {
                    saveButton.style.display = "block";
                } else {
                    saveButton.style.display = "none";
                }
            }
        } else {
            // Use the Chinese key directly from choices object
            const player = ev.currentTarget.id; // "user" or "cpu"
            const choice = choices[player];
            ev.target.innerText = opts[choice].icon;
        }
    }
}

function result() {
    if (choices.user === choices.cpu) {
        return "這是平局 A tie 👔";
    } else if (choices.cpu === opts[choices.user].winner) {
        score++;
        return "你贏了 🎉";
    } else {
        score = 0;
        saveButton.style.display = "none"; // Hide save button when score resets
        return "你輸了 😭";
    }
}

// Global callback function for JSONP
window.handleSaveScoreResponse = function(response) {
    // Re-enable the button
    saveButton.disabled = false;
    saveButton.textContent = "儲存分數到紀錄";
    
    // Remove the script tag
    const script = document.getElementById('jsonp-script');
    if (script) {
        script.remove();
    }
    
    if (response && response.success) {
        alert("分數已成功儲存！");
        console.log("Score saved successfully:", response);
    } else {
        alert("儲存失敗，請稍後再試");
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
    
    // Create JSONP request
    const callbackName = 'handleSaveScoreResponse';
    const data = {
        action: 'playScore', // Add action parameter for GAS backend
        userName: userName,
        score: score,
        timestamp: new Date().toISOString()
    };
    
    // Convert data to URL parameters
    const params = new URLSearchParams();
    params.append('callback', callbackName);
    Object.keys(data).forEach(key => {
        params.append(key, data[key]);
    });
    
    // Create script tag for JSONP
    const script = document.createElement('script');
    script.id = 'jsonp-script';
    script.src = `${API_URL}?${params.toString()}`;
    
    // Add error handling
    script.onerror = function() {
        saveButton.disabled = false;
        saveButton.textContent = "儲存分數到紀錄";
        alert("儲存失敗，請檢查網路連線");
        script.remove();
    };
    
    // Add to document to execute the request
    document.body.appendChild(script);
}

// Alternative method using form submission (if JSONP doesn't work)
function saveScoreAlternative() {
    if (!userName) {
        alert("無法獲取用戶信息，請重新載入頁面");
        return;
    }
    
    // Disable the save button to prevent multiple clicks
    saveButton.disabled = true;
    saveButton.textContent = "儲存中...";
    
    // Create a form and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = API_URL;
    form.style.display = 'none';
    
    // Add data as hidden inputs including action parameter
    const data = {
        action: 'playScore', // Add action parameter for GAS backend
        userName: userName,
        score: score,
        timestamp: new Date().toISOString()
    };
    
    Object.keys(data).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
    });
    
    // Add form to document and submit
    document.body.appendChild(form);
    form.submit();
    
    // Re-enable button after a delay (since we can't get response with form submission)
    setTimeout(() => {
        saveButton.disabled = false;
        saveButton.textContent = "儲存分數到紀錄";
        alert("分數儲存請求已送出！");
    }, 2000);
}
