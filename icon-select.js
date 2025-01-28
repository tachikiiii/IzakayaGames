// icon-select.js
let players = [];
let currentPlayer = 1;
// localStorageから選択した人数を取得
const maxPlayers = Number(localStorage.getItem('playerCount')) || 3; // デフォルト3人

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
    document.querySelector("#next").style.display = "inline-block";
  } else {
    currentPlayer++;
    updateHeader();
  }
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
