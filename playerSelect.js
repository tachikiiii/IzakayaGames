//【人の識別画面】に移動
document.getElementById('submitBtn').addEventListener('click', function () {
    const selectedValue = document.getElementById('numberSelect').value;

    // 選択した人数をlocalStorageに保存
    localStorage.setItem('playerCount', selectedValue);

    // プレイヤー情報の初期化
    const players = [];
    for (let i = 1; i <= selectedValue; i++) {
        players.push({ number: i, shakeCount: 0 });
    }

    // players情報をlocalStorageに保存
    localStorage.setItem('players', JSON.stringify(players));

    // icon-select.htmlに遷移
    window.location.href = "icon-select.html?humans=" + selectedValue;
});


//選択した人数が正しいかを確認しているだけ（のちに削除）
document.getElementById('submitBtn').addEventListener('click', function () {
    const selectedValue = document.getElementById('numberSelect').value;
    document.getElementById('result').textContent = 'You selected ' + selectedValue + ' human(s).';
});

//【モード選択画面】に戻る
document.getElementById('backBtn').addEventListener('click', function () {
    window.location.href = 'mode-select.html';
});

//どのモードが選択されているかを確認しているだけ（のちに削除）
const mode = localStorage.getItem('mode');

if (mode) {
    // If 'mode' is found in localStorage, display it
    document.getElementById('mode').textContent = mode;
} else {
    // If 'mode' is not found, display a fallback message
    document.getElementById('mode').textContent = 'No mode selected';
}




