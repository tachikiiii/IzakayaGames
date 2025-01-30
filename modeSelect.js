function redirectToNextPage(selectedMode) {
    sessionStorage.setItem('mode', selectedMode);
    window.location.href = 'player-select.html';
}