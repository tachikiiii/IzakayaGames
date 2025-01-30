
// 定数の指定
const urlParams = new URLSearchParams(window.location.search);
const amount = urlParams.get('amount');
const numPeople=sessionStorage.getItem("playerCount");
const players = JSON.parse(sessionStorage.getItem('players'));
const icons = players.map(player => player.icon);
const mode = sessionStorage.getItem("mode")

// それぞれの支払い額を計算する関数
function calculatePayment(amount) {
    
    let paymentPerPerson=0

     if (mode=="Oni Mode"){
        paymentPerPerson = Math.floor(amount / numPeople / 1000) * 1000;
    }else{
        paymentPerPerson = Math.floor(amount / numPeople / 100) * 100;
    }
    
    const remainingAmount = amount - (paymentPerPerson * (numPeople - 1));

    // 負けた人が払う額
    let payments = [];
    payments.push(remainingAmount);

    // 残りの人は均等に支払う金額
    for (let i = 1; i < numPeople; i++) {
        payments.push(paymentPerPerson);
    }

    // 負けた人が最初に表示されるように降順の並べ替え
    payments.sort((a, b) => b - a);

    showPopup(payments)
}

// 結果を表示
function showPopup(payments){
    
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ''; 

    for (let i = 0; i < numPeople; i++) {
        const personDiv = document.createElement('div');
        const imgElement = document.createElement('img');

        imgElement.src = `./img/btn_${icons[i]}.png`;
        imgElement.alt = `btn_image_${i}`;
        imgElement.style.verticalAlign = 'middle';  // 画像とテキストが縦に整列するように調整

        const amountSpan = document.createElement('span');
        amountSpan.textContent = payments[i] + " 円";
        amountSpan.style.marginLeft = '10px'; // 画像とテキストの間にスペースを追加

        personDiv.appendChild(imgElement);
        personDiv.appendChild(amountSpan);

        resultDiv.appendChild(personDiv);
    }
}

// ポップアップを表示する
if (amount) {
    if(mode){
        // 3秒経ってからポップアップを表示する
        setTimeout(function() {
            document.getElementById('loadingMessage').style.display = 'none';
            document.getElementById('popupBackground').style.display = 'block';
            document.getElementById('popup').style.display = 'block';

            calculatePayment(parseInt(amount));
        }, 3000); 
    }else{
        document.getElementById('loadingMessage').textContent = 'No mode selected.';
    }

} else {
    document.getElementById('loadingMessage').textContent = 'No amount provided.';
}

// 「x」ボタンを選択されるとポップアップ画面が消える
document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('popupBackground').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
});
