let players = [];
let currentPlayer = 1;
// sessionStorageから選択した人数を取得
const maxPlayers = Number(sessionStorage.getItem('playerCount')) || 3; // デフォルト3人

console.log(`選択した人数: ${maxPlayers}`);

function selectIcon(iconId) {
  if (players.some(player => player.icon === iconId)) {
    alert("このアイコンはすでに選択されています。別のアイコンを選んでください。");
    return;
  }

  if (players.length >= maxPlayers) {
    return;
  }

  players.push({ player: currentPlayer, icon: iconId });
  document.querySelector(`#${iconId}`).classList.add("disabled", "selected");

  displaySelectedIcon(currentPlayer, iconId);

  if (players.length === maxPlayers) {
    const header = document.querySelector("header h1");
    header.textContent = "すべてのプレイヤーの登録が完了しました";
    const nextButton = document.querySelector("#next");
    nextButton.style.display = "inline-block";
    // 「次へ」ボタンのクリックイベントを追加
    nextButton.addEventListener("click", requestMotionPermission);
    nextButton.addEventListener("click", startGame);
  } else {
    currentPlayer++;
    updateHeader();
  }
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

function updateHeader() {
  const header = document.querySelector("header h1");
  header.textContent = `${currentPlayer}人目のアイコンを選んでください`;
}

function displaySelectedIcon(playerNumber, iconId) {
  const selectedIconsContainer = document.getElementById("selectedIcons") || createSelectedIconsContainer();
  
  const playerDiv = document.createElement("div");
  playerDiv.className = "selected-icon";
  playerDiv.innerHTML = `
    <p>${playerNumber}人目</p>
    <img src="./img/btn_${iconId}.png" alt="${iconId}">
  `;
  
  selectedIconsContainer.appendChild(playerDiv);
}

function createSelectedIconsContainer() {
  const container = document.createElement("div");
  container.id = "selectedIcons";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.marginTop = "20px";
  
  document.body.appendChild(container);
  return container;
}

// アイコンと人数の保存
function savePlayersToSessionStorage() {
  sessionStorage.setItem(
    "players",
    JSON.stringify(players.map((player, index) => ({
        number: `${index + 1}人目`,
        icon: player.icon,
        shakeCount: 0 // 初期値
    })))
  );
}

// 「次へ」ボタンを押したときにゲーム開始ページへ遷移
function startGame() {
  savePlayersToSessionStorage();
  window.location.href = "shakecounter.html"; // shakecounter.jsに遷移
}
