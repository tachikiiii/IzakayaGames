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
    if (!event.accelerationIncludingGravity) {
        console.warn("加速度データが取得できません");
        return;
    }

    const { x, y, z } = event.accelerationIncludingGravity;
    console.log(`加速度 x: ${x}, y: ${y}, z: ${z}`);

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
                    <button id="startMotion">モーションセンサーを有効化</button>
                `;

                // ボタンをタップしたらモーションセンサーの許可をリクエスト
                document.getElementById("startMotion").addEventListener("click", requestMotionPermission);

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
            }, 100);
        }
    }, 1000);
}

function updateSessionStorage() {
    sessionStorage.setItem("players", JSON.stringify(players));
}

// ユーザー操作内でモーションセンサーの許可をリクエスト
function requestMotionPermission() {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
        console.log("iOS のため、モーションセンサーの許可をリクエストします。");

        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === "granted") {
                    console.log("モーションセンサーの許可が取得できました。");
                    enableMotion();
                    document.getElementById("startMotion").style.display = "none"; // ボタンを非表示
                } else {
                    alert("モーションセンサーの許可が必要です。設定を確認してください。");
                }
            })
            .catch(error => {
                console.error("モーションセンサーの許可取得に失敗しました:", error);
            });
    } else {
        console.log("Android などでは許可不要なので、そのまま開始します。");
        enableMotion();
        document.getElementById("startMotion").style.display = "none"; // ボタンを非表示
    }
}

function enableMotion() {
    console.log("devicemotion イベントを追加します");
    window.addEventListener("devicemotion", handleMotion);
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.innerHTML += `<button id="startGame">ゲームを開始!</button>`;
    document.getElementById("startGame").addEventListener("click", startGame);
});
