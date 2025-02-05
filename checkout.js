// DOMの読み込みが完了したら以下の処理を実行
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("calculateBtn").addEventListener("click", function(event) {
        // フォームのデフォルト送信動作をキャンセル
        event.preventDefault(); 

        // 入力フィールド「amount」の値を取得し、前後の空白を削除
        const amount = document.getElementById("amount").value.trim();

        // 入力がある場合はresult.htmlへ遷移し、amountをURLパラメータとして渡す
        if (amount) { 
            window.location.href = 'result.html?amount=' + encodeURIComponent(amount);
        } else {
            alert("お会計を入力してください。");
        }
    });
});
