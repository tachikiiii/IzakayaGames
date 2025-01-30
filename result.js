function calculatePayment(amount, numPeople) {
    
    // 選択されたモードを確認
    const mode = sessionStorage.getItem("mode")

    if(mode){
        alert("モードが選択されいません。")
    }else if (mode=="Oni Mode"){
        const paymentPerPerson = Math.floor(amount / numPeople / 1000) * 1000;
    }else{
        const paymentPerPerson = Math.floor(amount / numPeople / 100) * 100;
    }
    
    const remainingAmount = amount - (paymentPerPerson * (numPeople - 1));

    // 負けた人が払う額
    let payments = [];
    payments.push(remainingAmount);

    // 残りの人は均等に支払う金額
    for (var i = 1; i < numPeople; i++) {
        payments.push(paymentPerPerson);
    }

    // 負けた人が最初に表示されるように降順の並べ替え
    payments.sort((a, b) => b - a);

    // 結果を表示
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ''; 

    for (let i = 0; i < numPeople; i++) {
        const personDiv = document.createElement('div');
            
        const imgElement = document.createElement('img');
        imgElement.src = (i == 0) ? "./img/btn_dog.png" : 
                        (i == 1) ? "./img/btn_sheep.png" : 
                                    "./img/btn_mouse.png";
        imgElement.alt = "btn_image_" + i;
        imgElement.style.verticalAlign = 'middle';  // 画像とテキストが縦に整列するように調整

        const amountSpan = document.createElement('span');
        amountSpan.textContent = payments[i] + " 円";
        amountSpan.style.marginLeft = '10px'; // 画像とテキストの間にスペースを追加

        personDiv.appendChild(imgElement);
        personDiv.appendChild(amountSpan);

        resultDiv.appendChild(personDiv);
    }
}

// URLのクエリパラメータを取得
const urlParams = new URLSearchParams(window.location.search);
const amount = urlParams.get('amount');
const numPeople=3;

// ポップアップを表示する
if (amount) {
    // 3秒経ってからポップアップを表示する
    setTimeout(function() {
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('popupBackground').style.display = 'block';
        document.getElementById('popup').style.display = 'block';

        calculatePayment(parseInt(amount), numPeople);
    }, 3000); 
} else {
    document.getElementById('loadingMessage').textContent = 'No amount provided.';
}

// 「x」ボタンを選択されるとポップアップ画面が消える
document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('popupBackground').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
});
