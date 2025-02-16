
//【人数選択画面】に遷移
function redirectToNextPage(selectedMode) {
    sessionStorage.setItem('mode', selectedMode);
    window.location.href = 'player-select.html';
}