
// 変数や定数の指定
let shakeCount = 0;
let lastX = null, lastY = null, lastZ = null;
const threshold = 10;        // 値が大きいほどシェイクの感度が鈍る
const debounceTime = 200;    // 連続カウントを防ぐ時間（ミリ秒）
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
        // 前のコード
        // if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
        const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        if (delta > threshold) {
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

        // カウントダウン中の表示
        if (countdown > 0) {
            document.body.innerHTML = `
                <div class="barrier">
                <h1><img src="./img/btn_${player.icon}.png" alt="${player.icon}">の<br>チャレンジ！</h1>
                <p>赤い０が表示されたら<br>スマホを振り始めて！</p>
                <h2>${countdown}</h2>
                </div>
            `;

        // カウントダウン後の表示
        } else {
            clearInterval(countdownInterval);
            setTimeout(() => {
                document.body.innerHTML = `
                    <div class="barrier">
                    <h1><img src="./img/btn_${player.icon}.png" alt="${player.icon}">の<br>チャレンジ！</h1>
                    <p>スマホを振って！</p>
                    <span id="shakeCount">0</span>
                    </div>
                `;

                enableMotion();

                // ゲーム終了時の処理
                // ゲーム終了時の処理
                gameTimer = setTimeout(() => {
                    window.removeEventListener("devicemotion", handleMotion);
                    player.shakeCount = shakeCount;
                    updateSessionStorage();

                    // 結果表示（barrier の中に次のプレイヤー表示も含める）
                    let html = `
                        <div class="barrier">
                            <p id="signal">終了</p>
                            <div class="result-container">
                                <img src="./img/btn_${player.icon}.png" alt="${player.icon}" class="result-icon">
                                <p class="result-text">${player.shakeCount} 回</p>
                            </div>
                        `;

                    // 次のプレイヤー
                    if (currentPlayerIndex + 1 < players.length) {
                        currentPlayerIndex++;
                        const nextPlayer = getCurrentPlayer();
                        html += `
                            <div class="next-player">
                                <p>次は、、</p>
                                <img src="./img/btn_${nextPlayer.icon}.png" alt="${nextPlayer.icon}" class="next-icon">
                                <button id="nextPlayer">次のプレイヤーへ</button>
                            </div>
                        </div>`; // ← ここで `barrier` を閉じる

                        document.body.innerHTML = html;
                        document.getElementById("nextPlayer").addEventListener("click", requestMotionPermission);
                    
                    // 結果表示
                    } else {
                        html += `<button id="resultPage">結果を見る</button></div>`; // ← `barrier` 内に配置
                        document.body.innerHTML = html;
                        document.getElementById("resultPage").addEventListener("click", showResults);
                    }
                }, 10000);

            }, 100);
        }
    }, 1000);
}

// ゲーム結果を表示する（シェイク回数順に並べる）
function showResults() {

    // シェイク回数の多い順に並べ替え
    players.sort((a, b) => b.shakeCount - a.shakeCount);

    let resultHTML = `
        <div class="barrier">
            <img src="img/lettering-shakecounter.png" alt="Shake Counter">
            <ul class="result-list">`;

    // プレイヤーごとに順位、画像、シェイク回数を表示（すべて同一行にする）
    players.forEach((player, index) => {
        resultHTML += `
            <li>
                <span class="result-rank">${index + 1}位</span>
                <img src="./img/btn_${player.icon}.png" alt="${player.icon}" class="result-img">
                <span class="result-text">${player.shakeCount}回</span>
            </li>
        `;
    });

    // 「お会計へ」ボタンの表示
    resultHTML += `
        <button id="checkoutPage">お会計へ</button>
    `;

    //【金額入力画面】に移動
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
    const player = getCurrentPlayer();     // 現在のプレイヤー情報を取得
    document.body.innerHTML = `
        <div class="barrier">
            <h1><img src="./img/btn_${player.icon}.png" alt="${player.icon}">の<br>チャレンジ！</h1>
            <p>スマホを10秒間<br>振り続けてね</p>
        </div>
        <button id="startButton">スタート</button>
    `;
    // 中間画面の「スタート」ボタンをクリックしたら、モーションセンサーの許可をリクエスト（結果としてゲーム開始）
    document.getElementById("startButton").addEventListener("click", requestMotionPermission);
}
