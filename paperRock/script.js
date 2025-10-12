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

const choiceBtns = document.querySelectorAll("button");
const user = document.querySelector("#user");
const cpu = document.querySelector("#cpu");
const userDisplay = document.querySelector("#userDisplay");
const LIFF_ID = '2006943877-JRNE3RZy';
user.addEventListener("animationend", animationListen, false);
cpu.addEventListener("animationend", animationListen, false);

// Initialize LIFF
async function initializeLiff() {
    try {
        await liff.init({ liffId: LIFF_ID }); // Replace with your LIFF ID
        
        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }
        
        // Get user profile
        const profile = await liff.getProfile();
        userName = profile.displayName;
        
        // Display userId instead of "你"
        userDisplay.innerText = userName.substring(0, 8) ; // Show first 8 characters for better display
        
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
        return "你輸了 😭";
    }
}
