let score = 0;
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
user.addEventListener("animationend", animationListen, false);
cpu.addEventListener("animationend", animationListen, false);

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