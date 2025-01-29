let shakeCount = 0;
let lastX = null;
let lastY = null;
let lastZ = null;
const threshold = 5; //小さくすれば感度up 10→5にしました
const debounceTime = 200; //小さくすれば感度up 300→200にしました
let lastShakeTime = 0;
let gameTimer = null;

// 音声ファイルの参照
const countdownSound = document.getElementById('countdownSound');
// const shakeSound = document.getElementById('shakeSound');
// const finishSound = document.getElementById('finishSound'); 

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
                document.getElementById('shakeCount').innerText = shakeCount;
                lastShakeTime = currentTime;
                // shakeSound.play(); // シェイク音を再生
            }
        }
    }

    lastX = x;
    lastY = y;
    lastZ = z;
}

function startGame() {
    shakeCount = 0;
    document.getElementById('shakeCount').innerText = shakeCount;

    let countdown = 3;
    const countdownInterval = setInterval(() => {
        if (countdown > 0) {
            document.body.innerHTML = `<h1>${countdown}</h1>`;
            countdownSound.play(); // カウントダウン音を再生
            countdown--;
        } else {
            clearInterval(countdownInterval);
            document.body.innerHTML = `<h1>スタート!</h1><p>振った回数: <span id="shakeCount">0</span></p>`;
            enableMotion();

            gameTimer = setTimeout(() => {
                // finishSound.play();
                window.removeEventListener('devicemotion', handleMotion);
                document.body.innerHTML = `<h1>ゲーム終了!</h1><p>振った回数: ${shakeCount}</p><button onclick="startGame()">再挑戦</button>`;
            }, 10000);
        }
    }, 1000);
}

function requestDeviceMotionPermission() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    startGame();
                } else {
                    alert("モーションセンサーの使用が許可されませんでした");
                }
            })
            .catch(console.error);
    } else {
        startGame();
    }
}

function enableMotion() {
    window.addEventListener('devicemotion', handleMotion);
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML += '<button>ゲームを開始する</button>';
    document.querySelector('button').addEventListener('click', requestDeviceMotionPermission);
});


// let currentPlayerIndex = 0; // 現在のプレイヤーのインデックス
// let shakeCount = 0;
// let lastX = null, lastY = null, lastZ = null;
// const threshold = 5;
// const debounceTime = 200;
// let lastShakeTime = 0;
// let gameTimer = null;

// // プレイヤー情報をlocalStorageから取得
// const players = JSON.parse(localStorage.getItem("players")) || [];

// // 現在のプレイヤー情報を取得
// function getCurrentPlayer() {
//     return players[currentPlayerIndex];
// }

// // シェイクを検出する
// function handleMotion(event) {
//     const { x, y, z } = event.accelerationIncludingGravity;

//     if (lastX !== null && lastY !== null && lastZ !== null) {
//         const deltaX = Math.abs(x - lastX);
//         const deltaY = Math.abs(y - lastY);
//         const deltaZ = Math.abs(z - lastZ);

//         if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
//             const currentTime = Date.now();
//             if (currentTime - lastShakeTime > debounceTime) {
//                 shakeCount++;
//                 document.getElementById("shakeCount").innerText = shakeCount;
//                 lastShakeTime = currentTime;
//             }
//         }
//     }

//     lastX = x;
//     lastY = y;
//     lastZ = z;
// }

// // ゲームを開始する
// function startGame() {
//     const player = getCurrentPlayer();
//     if (!player) {
//         alert("プレイヤーが存在しません");
//         return;
//     }

//     shakeCount = 0;
//     document.body.innerHTML = `
//         <h1>${player.number}人目: ${player.icon}のゲーム開始!</h1>
//         <p>振った回数: <span id="shakeCount">0</span></p>
//     `;

//     enableMotion();

//     gameTimer = setTimeout(() => {
//         window.removeEventListener("devicemotion", handleMotion);
//         player.shakeCount = shakeCount; // 結果を保存
//         updateLocalStorage();

//         if (currentPlayerIndex + 1 < players.length) {
//             currentPlayerIndex++;
//             document.body.innerHTML += `
//                 <h1>結果: ${shakeCount}回</h1>
//                 <button id="nextPlayer">次へ</button>
//             `;
//             document.getElementById("nextPlayer").addEventListener("click", startGame);
//         } else {
//             document.body.innerHTML += `
//                 <h1>全員のゲームが終了しました</h1>
//                 <button id="checkout">次へ</button>
//             `;
//             document.getElementById("checkout").addEventListener("click", () => {
//                 window.location.href = "checkout.html";
//             });
//         }
//     }, 10000);
// }

// // localStorageを更新
// function updateLocalStorage() {
//     localStorage.setItem("players", JSON.stringify(players));
// }

// // デバイスモーションを有効化
// function enableMotion() {
//     window.addEventListener("devicemotion", handleMotion);
// }

// // ページロード時の初期化
// document.addEventListener("DOMContentLoaded", () => {
//     const player = getCurrentPlayer();
//     if (!player) {
//         alert("プレイヤー情報がありません");
//         return;
//     }
//     startGame();
// });
