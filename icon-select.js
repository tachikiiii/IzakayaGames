
// グローバル変数：選択済みプレイヤー情報と現在のプレイヤー番号
let players = [];
let currentPlayer = 1;

// sessionStorageから選択人数を取得（なければデフォルト3人）
const maxPlayers = Number(sessionStorage.getItem('playerCount'));
console.log(`選択した人数: ${maxPlayers}`);

// ページ読み込み後に各プレイヤー用の白い枠（アイコンフレーム）を初期表示する
document.addEventListener('DOMContentLoaded', initIconFrames);

/**
 * 各プレイヤー用のアイコンフレームを初期化する
 * ・maxPlayersの数だけ、"selected-icons"コンテナ内に枠を作成
 * ・各枠には「n人目」とラベルと、初期画像（iconframe.png）を表示
 * ・最初の枠にはactiveクラスを付与して黒い枠を表示する
 */
function initIconFrames() {
  const container = document.getElementById("selected-icons");
  container.innerHTML = ""; // 既存内容のクリア
  for (let i = 1; i <= maxPlayers; i++) {
    const frame = document.createElement("div");
    frame.className = "icon-frame";

    // 最初のプレイヤー枠にactiveクラスを追加
    if (i === 1) {
      frame.classList.add("active");
    }

    // 各枠にプレイヤー番号を示す属性を設定
    frame.setAttribute("data-player", i);
    frame.innerHTML = `
      <p>${i}人目</p>
      <img src="./img/iconframe.png" alt="未選択">
    `;
    container.appendChild(frame);
  }
}

/**
 * アイコンが選択されたときの処理
 * ・同じアイコンが選ばれていないかチェック
 * ・現在のプレイヤー分の情報を登録し、対応する枠にアイコン画像を表示する
 * ・全員分選択済みならヘッダー・「次へ」ボタンを更新、未完了なら次のプレイヤーへ
 * @param {string} iconId - 選択されたアイコンのID
 */
function selectIcon(iconId) {

  // 同じアイコンが既に選ばれていれば警告
  if (players.some(player => player.icon === iconId)) {
    alert("このアイコンはすでに選択されています。別のアイコンを選んでください。");
    return;
  }

  // 既に最大人数に達している場合は何もしない
  if (players.length >= maxPlayers) {
    return;
  }
  
  // 現在のプレイヤーのアイコンを登録し、ボタン自体も無効化
  players.push({ player: currentPlayer, icon: iconId });
  document.querySelector(`#${iconId}`).classList.add("disabled", "selected");
  
  // 該当プレイヤーの枠に選ばれたアイコン画像を表示する
  updateIconFrame(currentPlayer, iconId);
  
  // すべてのプレイヤー分選択済みの場合
  if (players.length === maxPlayers) {

    document.querySelectorAll(".icon-frame").forEach(frame => frame.classList.remove("active"));
    
    // 「次へ」ボタンを表示し、クリック時にゲーム開始へ遷移
    const nextButton = document.querySelector("#next");
    nextButton.style.display = "inline-block";
    nextButton.addEventListener("click", startGame);
  } else {

    // 次のプレイヤーへ進む：番号更新とヘッダーの更新
    currentPlayer++;
    updateActiveFrame();
  }
}

/**
 * 対応するプレイヤー枠の画像を、選択されたアイコン画像に更新する
 * @param {number} playerNumber - 更新対象のプレイヤー番号
 * @param {string} iconId - 選択されたアイコンのID
 */
function updateIconFrame(playerNumber, iconId) {
  const container = document.getElementById("selected-icons");
  const frame = container.querySelector(`.icon-frame[data-player='${playerNumber}']`);  // data-player属性がplayerNumberに一致する枠を取得
  if (frame) {

    // ラベルはそのまま、画像を選択されたアイコンに差し替え
    frame.innerHTML = `
      <p>${playerNumber}人目</p>
      <img src="./img/btn_${iconId}.png" alt="${iconId}">
    `;
  }
}

/**
 * 現在のプレイヤーの枠にactiveクラスを付与し、
 * 他の枠からはactiveクラスを外す
 */
function updateActiveFrame() {
  const container = document.getElementById("selected-icons");
  container.querySelectorAll(".icon-frame").forEach(frame => frame.classList.remove("active"));
  const nextFrame = container.querySelector(`.icon-frame[data-player='${currentPlayer}']`);
  if (nextFrame) {
    nextFrame.classList.add("active");
  }
}

/**
 * プレイヤー情報（番号、アイコン、初期シェイク回数）をsessionStorageに保存する
 */
function savePlayersToSessionStorage() {
  sessionStorage.setItem(
    "players",
    JSON.stringify(
      players.map((player, index) => ({
        number: `${index + 1}人目`,
        icon: player.icon,
        shakeCount: 0      // 初期シェイク回数は0
      }))
    )
  );
}

/**
 * 「次へ」ボタンが押されたときの処理
 * ・プレイヤー情報を保存し、ゲーム開始ページへ遷移する
 */
function startGame() {
  savePlayersToSessionStorage();
  window.location.href = "shakecounter.html";
}
