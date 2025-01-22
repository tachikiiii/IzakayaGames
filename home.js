function redirectToNextPage() {
    window.location.href = "mode-select.html"; 
}

setTimeout(redirectToNextPage, 5000);

document.body.addEventListener("click", redirectToNextPage);
