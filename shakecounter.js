let shakeCount = 0;
let lastX = null, lastY = null, lastZ = null;
const threshold = 3; // 値が大きいほどシェイクの感度が鈍る
const debounceTime = 200; // 連続カウントを防ぐ時間（ミリ秒）
let lastShakeTime = 0;
let gameTimer = null;
let countdownSound = new Audio("countdown.mp3");

let players = JSON.parse(sessionStorage.getItem("players")) || [];
let currentPlayerIndex = 0;

// 現在のプレイヤーを取得する
function getCurrentPlayer() {
    return players[currentPlayerIndex];
}

// スマホの加速度センサーのデータを取得し、シェイクをカウントする
function handleMotion(event) {
    if (!event.accelerationIncludingGravity) return;

    const { x, y, z } = event.accelerationIncludingGravity;

    if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);

        // シェイク判定（しきい値を超えた場合にカウント）
        if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
            const currentTime = Date.now();
            if (currentTime - lastShakeTime > debounceTime) {
                shakeCount++;
                // ゲーム中のHTML内にある要素の更新
                const shakeCountEl = document.getElementById("shakeCount");
                if (shakeCountEl) {
                    shakeCountEl.innerText = shakeCount;
                }
                lastShakeTime = currentTime;
            }
        }
    }

    lastX = x;
    lastY = y;
    lastZ = z;
}

// ゲームを開始する（カウントダウン後にシェイク計測開始）
function startGame() {
    const player = getCurrentPlayer();
    shakeCount = 0;
    let countdown = 4;

    const countdownInterval = setInterval(() => {
        countdown--;
        countdownSound.play();
        if (countdown > 0) {
            document.body.innerHTML = `
                <div class="barrier">
                <h1><img src="./img/btn_${player.icon}.png" alt="${player.icon}">さんのチャレンジ！</h1>
                <p>スマホを振ってください！</p>
                <h2>${countdown}</h2>
                </div>
            `;
        } else {
            clearInterval(countdownInterval);
            setTimeout(() => {
                document.body.innerHTML = `
                    <div class="barrier">
                    <h1><img src="./img/btn_${player.icon}.png" alt="${player.icon}">さんのチャレンジ！</h1>
                    <p>スマホを振ってください！</p>
                    <p>振った回数: <span id="shakeCount">0</span></p>
                    </div>
                `;

                enableMotion();

                gameTimer = setTimeout(() => {
                    // ゲーム終了時の処理
                    window.removeEventListener("devicemotion", handleMotion);
                    player.shakeCount = shakeCount;
                    updateSessionStorage();

                    document.body.innerHTML = `
                        <div class="barrier">
                        <h1><img src="./img/btn_${player.icon}.png" alt="${player.icon}">さんの結果・・・${shakeCount}回</h1>
                        </div>
                    `;

                    // 次のプレイヤー or 結果表示
                    if (currentPlayerIndex + 1 < players.length) {
                        currentPlayerIndex++;
                        document.body.innerHTML += `<p>次のプレイヤーは、、</p><img src="./img/btn_${player.icon}.png" alt="${player.icon}">さん<button id="nextPlayer">次のプレイヤーへ</button>`;
                        document.getElementById("nextPlayer").addEventListener("click", requestMotionPermission);
                    } else {
                        document.body.innerHTML += `<button class="buttonDesign" id="resultPage">結果を見る</button>`;
                        document.getElementById("resultPage").addEventListener("click", showResults);
                    }
                }, 10000);
            }, 100);
        }
    }, 1000);
}

// ゲーム結果を表示する（シェイク回数順に並べる）
function showResults() {
    players.sort((a, b) => b.shakeCount - a.shakeCount); // シェイク回数の多い順に並べる

    let resultHTML = `<div class="barrier"><h1>ゲーム結果</h1><ul style="list-style: none;">`;
    players.forEach(player => {
        resultHTML += `
            <li>
                <img src="./img/btn_${player.icon}.png" alt="${player.icon}" style="width:50px; height:50px;">
                ${player.icon} さん: <strong>${player.shakeCount}回</strong>
            </li>
            </div>
        `;
    });
    resultHTML += `</ul><button class="buttonDesign" id="checkoutPage">お会計へ</button>`;

    document.body.innerHTML = resultHTML;
    document.getElementById("checkoutPage").addEventListener("click", () => {
        window.location.href = "checkout.html";
    });
}

// プレイヤーのデータをストレージに保存する
function updateSessionStorage() {
    sessionStorage.setItem("players", JSON.stringify(players));
}

// モーションセンサーの許可をリクエストし、許可後にゲームを開始
function requestMotionPermission() {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === "granted") {
                    startGame();
                } else {
                    alert("モーションセンサーの許可が必要です。設定を確認してください。");
                }
            })
            .catch(error => {
                console.error("モーションセンサーの許可取得に失敗しました:", error);
            });
    } else {
        startGame();
    }
}

// `devicemotion` イベントを追加し、シェイクの計測を開始
function enableMotion() {
    window.addEventListener("devicemotion", handleMotion);
}

// ★ 初期の「ゲーム開始」ボタンのクリック時には、まず中間画面を表示する
document.getElementById("startGame").addEventListener("click", showGame);

// ★ 「ゲーム開始」ボタンを押した後に表示する中間画面の作成
function showGame() {
    const player = getCurrentPlayer(); // 現在のプレイヤー情報を取得
    document.body.innerHTML = `
        <div class="barrier">
        <h1><img src="./img/btn_${player.icon}.png" alt="${player.icon}">さんのチャレンジ！</h1>
        </div>
        <button class="buttonDesign" id="startButton">スタート</button>
    `;
    // 中間画面の「スタート」ボタンをクリックしたら、モーションセンサーの許可をリクエスト（結果としてゲーム開始）
    document.getElementById("startButton").addEventListener("click", requestMotionPermission);
}
