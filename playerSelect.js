//【人の識別画面】に移動
document.getElementById('submitBtn').addEventListener('click', function() {
    const selectedValue = document.getElementById('numberSelect').value;
    window.location.href = "icon-select.html?humans=" + selectedValue;
});
    
//選択した人数が正しいかを確認しているだけ（のちに削除）
document.getElementById('submitBtn').addEventListener('click', function() {
    const selectedValue = document.getElementById('numberSelect').value;
    document.getElementById('result').textContent = 'You selected ' + selectedValue + ' human(s).';
});

//【モード選択画面】に戻る
document.getElementById('backBtn').addEventListener('click', function() {
    window.location.href = 'mode-select.html';
});
    
//どのモードが選択されているかを確認しているだけ（のちに削除）
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const mode = getQueryParam('mode');
if (mode) {
    document.getElementById('mode').textContent = mode;
} else {
    document.getElementById('mode').textContent = 'No mode selected';
}
