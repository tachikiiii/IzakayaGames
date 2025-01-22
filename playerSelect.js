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
const mode = localStorage.getItem('mode');

if (mode) {
    // If 'mode' is found in localStorage, display it
    document.getElementById('mode').textContent = mode;
} else {
    // If 'mode' is not found, display a fallback message
    document.getElementById('mode').textContent = 'No mode selected';
}
