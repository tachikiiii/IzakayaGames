function redirectToNextPage(selectedMode) {
    localStorage.setItem('mode', selectedMode);
    window.location.href = 'player-select.html';
}