
//【；モード選択画面】に遷移
function redirectToNextPage() {
    window.location.href = "mode-select.html"; 
}

document.addEventListener('click', redirectToNextPage);
setTimeout(redirectToNextPage, 5000);
