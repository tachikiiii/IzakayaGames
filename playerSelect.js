//【人の識別画面】に移動
document.getElementById('submitBtn').addEventListener('click', function () {
    const selectedValue = document.getElementById('numberSelect').value;

    // 選択した人数をsessionStorageに保存
    sessionStorage.setItem('playerCount', selectedValue);

    // プレイヤー情報の初期化
    const players = [];
    for (let i = 1; i <= selectedValue; i++) {
        players.push({ number: i, shakeCount: 0 });
    }

    // players情報をsessionStorageに保存
    sessionStorage.setItem('players', JSON.stringify(players));

    // 【人の識別画面】に遷移
    //window.location.href = "icon-select.html?humans=" + selectedValue;
    window.location.href = "icon-select.html";
});

//【モード選択画面】に戻る
document.getElementById('backBtn').addEventListener('click', function () {
    window.location.href = 'mode-select.html';
});
