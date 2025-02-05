// グローバル変数：選択したプレイヤー情報と現在のプレイヤー番号
let players = [];
let currentPlayer = 1;

// sessionStorageから選択した人数を取得（存在しない場合はデフォルト3人）
const maxPlayers = Number(sessionStorage.getItem('playerCount')) || 3; // デフォルト3人
console.log(`選択した人数: ${maxPlayers}`);

/**
 * 指定されたアイコンIDでプレイヤーを登録し、画面を更新する
 * @param {string} iconId - 選択されたアイコンのID
 */
function selectIcon(iconId) {
  // すでに同じアイコンが選ばれている場合は警告を出して終了
  if (players.some(player => player.icon === iconId)) {
    alert("このアイコンはすでに選択されています。別のアイコンを選んでください。");
    return;
  }

  // すでに最大人数に達している場合は何もしない
  if (players.length >= maxPlayers) {
    return;
  }

  // 現在のプレイヤー情報を配列に追加し、該当アイコンに選択済みのクラスを付与
  players.push({ player: currentPlayer, icon: iconId });
  document.querySelector(`#${iconId}`).classList.add("disabled", "selected");

  // 選択したアイコンを画面に表示する
  displaySelectedIcon(currentPlayer, iconId);

  // すべてのプレイヤー登録が完了したか確認
  if (players.length === maxPlayers) {
    // ヘッダーのテキストを変更して完了を表示
    const header = document.querySelector("header h1");
    header.textContent = "すべてのプレイヤーの登録が完了しました";
    // 「次へ」ボタンを表示し、クリック時にゲーム開始関数を呼び出す
    const nextButton = document.querySelector("#next");
    nextButton.style.display = "inline-block";
    nextButton.addEventListener("click", startGame);
  } else {
    // 次のプレイヤーの登録に進む
    currentPlayer++;
    updateHeader();
  }
}

// ヘッダーのテキストを現在のプレイヤー番号に合わせて更新する
function updateHeader() {
  const header = document.querySelector("header h1");
  header.textContent = `${currentPlayer}人目のアイコンを選んでください`;
}

/**
 * 選択済みのアイコンを画面に表示する
 * @param {number} playerNumber - プレイヤー番号
 * @param {string} iconId - 選択されたアイコンのID
 */
function displaySelectedIcon(playerNumber, iconId) {
  // すでにコンテナが存在すれば取得、なければ新規作成する
  const selectedIconsContainer = document.getElementById("selectedIcons") || createSelectedIconsContainer();
  
  // プレイヤーごとの表示用要素を作成
  const playerDiv = document.createElement("div");
  playerDiv.className = "selected-icon";
  playerDiv.innerHTML = `
    <p>${playerNumber}人目</p>
    <img src="./img/btn_${iconId}.png" alt="${iconId}">
  `;
  
  // コンテナに追加して表示
  selectedIconsContainer.appendChild(playerDiv);
}

/**
 * 選択済みアイコン表示用のコンテナを作成し、bodyに追加する関数
 * @returns {HTMLElement} 作成したコンテナ要素
 */
function createSelectedIconsContainer() {
  const container = document.createElement("div");
  container.id = "selectedIcons";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.marginTop = "20px";
  
  document.body.appendChild(container);
  return container;
}

// プレイヤー情報（アイコン、人数、初期シェイク回数）をsessionStorageに保存する
function savePlayersToSessionStorage() {
  sessionStorage.setItem(
    "players",
    JSON.stringify(
      players.map((player, index) => ({
        number: `${index + 1}人目`,
        icon: player.icon,
        shakeCount: 0 // 初期シェイク回数は0
      }))
    )
  );
}

// 「次へ」ボタンが押されたときに、プレイヤー情報を保存しゲーム開始ページへ遷移する
function startGame() {
  savePlayersToSessionStorage();
  window.location.href = "shakecounter.html"; // ゲーム開始画面へ遷移
}
