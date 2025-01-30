let shakeCount = 0;
let lastX = null, lastY = null, lastZ = null;
const threshold = 5;
const debounceTime = 200;
let lastShakeTime = 0;
let gameTimer = null;
let countdownSound = new Audio("countdown.mp3");

let players = JSON.parse(sessionStorage.getItem("players")) || [];
let currentPlayerIndex = 0;

function getCurrentPlayer() {
    return players[currentPlayerIndex];
}

function handleMotion(event) {
    const { x, y, z } = event.accelerationIncludingGravity;

    if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);

        if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
            const currentTime = Date.now();
            if (currentTime - lastShakeTime > debounceTime) {
                shakeCount++;
                document.getElementById("shakeCount").innerText = shakeCount;
                lastShakeTime = currentTime;
            }
        }
    }

    lastX = x;
    lastY = y;
    lastZ = z;
}

function startGame() {
    const player = getCurrentPlayer();
    if (!player) {
        alert("プレイヤーが存在しません");
        return;
    }

    shakeCount = 0;
    let countdown = 4;

    const countdownInterval = setInterval(() => {
        countdown--;
        countdownSound.play();
        if (countdown > 0) {
            document.body.innerHTML = `<h1><img src="./img/btn_${player.icon}.png" alt="${player.icon}">さんのチャレンジ！</h1><p>スマホを振ってください！</p><h2>${countdown}</h2>`;
        } else {
            clearInterval(countdownInterval);
            setTimeout(() => {
                document.body.innerHTML = `
                    <h1><img src="./img/btn_${player.icon}.png" alt="${player.icon}">さんのチャレンジ！</h1>
                    <p>スマホを振ってください！</p>
                    <p>振った回数: <span id="shakeCount">0</span></p>
                `;
                enableMotion();
                gameTimer = setTimeout(() => {
                    window.removeEventListener("devicemotion", handleMotion);
                    player.shakeCount = shakeCount;
                    updateSessionStorage();

                    document.body.innerHTML += `
                        <h1><img src="./img/btn_${player.icon}.png" alt="${player.icon}">さんの結果・・・${shakeCount}回</h1>
                    `;

                    if (currentPlayerIndex + 1 < players.length) {
                        currentPlayerIndex++;
                        document.body.innerHTML += `
                            <button id="nextPlayer">次のプレイヤーへ</button>
                        `;
                        document.getElementById("nextPlayer").addEventListener("click", startGame);
                    } else {
                        document.body.innerHTML += `
                            <button id="resultPage">結果を見る</button>
                        `;
                        document.getElementById("resultPage").addEventListener("click", () => {
                            window.location.href = "checkout.html";
                        });
                    }
                }, 10000);
            }, 100); // 0.5秒遅延させて音声と遷移を同期
        }
    }, 1000);
}

function updateSessionStorage() {
    sessionStorage.setItem("players", JSON.stringify(players));
}

function enableMotion() {
    window.addEventListener("devicemotion", handleMotion);
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.innerHTML += `<button id="startGame">ゲームを開始する</button>`;
    document.getElementById("startGame").addEventListener("click", startGame);
});
