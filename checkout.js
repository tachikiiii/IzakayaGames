document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("calculateBtn").addEventListener("click", function(event) {
        event.preventDefault(); 

        const amount = document.getElementById("amount").value.trim();
        if (amount) { 
            window.location.href = 'result.html?amount=' + encodeURIComponent(amount);
        } else {
            alert("お会計を入力してください。");
        }
    });
});

