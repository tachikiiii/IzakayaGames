
// 定数の指定
const urlParams = new URLSearchParams(window.location.search);
const amount = urlParams.get('amount');
const numPeople=sessionStorage.getItem("playerCount");
const players = JSON.parse(sessionStorage.getItem('players'));
const mode = sessionStorage.getItem("mode")

let finalOutcome = players.map(player => ({
    icon: player.icon,
    lost: 0
}));


// playersの配列の例
//const players = [
//    { number: "1人目", icon: "dog", game1: 34, game2: 11, game3: 34},
//    { number: "2人目", icon: "chicken", game1: 56, game2: 60, game3: 34 },
//    { number: "3人目", icon: "horse", game1: 12, game2: 30, game3: 20 },
//    { number: "4人目", icon: "rabbit", game1: 12, game2: 34, game3: 100 }
//];
// 各ゲームでの記録をまとめる関数（ゲームが複数になった場合の処理）
function calculateFinalOutcome() {
    
    // 各ゲームで数値が高いプレイヤーがlostの値が高くなる
    for (let game of ['game1', 'game2', 'game3']) {
        let maxScore = Math.max(...players.map(player => player[game]));
        players.forEach((player, index) => {
            if (player[game] === maxScore) {
                finalOutcome[index].lost += 1; 
            }
        });
    }

    // 負けの降順にソート
    finalOutcome.sort((a, b) => b.lost - a.lost);
}

// 携帯シェイクでの記録をまとめる関数（ゲームが複数になった場合は削除）
function calculateFinalOutcomeShakeCount() {
    
    let maxShakeCount = Math.max(...players.map(player => player.shakeCount));

    players.forEach((player, index) => {
        if (player.shakeCount === maxShakeCount) {
            finalOutcome[index].lost += 1; 
        }
    });

    // 負けの降順にソート
    finalOutcome.sort((a, b) => b.lost - a.lost);
}

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

    // 支払額をfinalOutcomeに追加する
    finalOutcome.forEach((player, index) => {
        player.payment = payments[index];
    });
}


// 結果を表示
function showPopup(){
    
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ''; 

    finalOutcome.forEach((player, index) => {
        const personDiv = document.createElement('div');
        
        const imgElement = document.createElement('img');
        imgElement.src = `./img/btn_${player.icon}.png`; 
        imgElement.alt = `btn_image_${index}`;
        imgElement.style.verticalAlign = 'middle'; 

        const amountSpan = document.createElement('span');
        amountSpan.textContent = `${player.payment} 円`;
        amountSpan.style.marginLeft = '10px'; 

        personDiv.appendChild(imgElement);
        personDiv.appendChild(amountSpan);

        resultDiv.appendChild(personDiv);
    });
}

// ポップアップを表示する
if (amount) {
    if(mode){
        // 3秒経ってからポップアップを表示する
        setTimeout(function() {
            document.getElementById('loadingMessage').style.display = 'none';
            document.getElementById('popupBackground').style.display = 'block';
            document.getElementById('popup').style.display = 'block';

            //calculateFinalOutcome(); //ゲームが複数になった場合にコメントアウトを外す
            calculateFinalOutcomeShakeCount();
            calculatePayment(parseInt(amount));
            showPopup();

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

