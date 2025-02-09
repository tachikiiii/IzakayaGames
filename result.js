
// 定数の指定
const urlParams = new URLSearchParams(window.location.search);
const amount = urlParams.get('amount');
const numPeople=sessionStorage.getItem("playerCount");
const players = JSON.parse(sessionStorage.getItem('players'));
const mode = sessionStorage.getItem("mode")

let finalOutcome =0


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

    // 負けた人のアイコンと支払額を先に表示する
    const firstPlayer = finalOutcome[0];
    const firstPersonDiv = document.createElement('div');
    
    const firstImgElement = document.createElement('img');
    firstImgElement.src = `./img/btn_${firstPlayer.icon}.png`; 
    firstImgElement.alt = `btn_image_0`;
    firstImgElement.style.verticalAlign = 'middle';

    const firstAmountSpan = document.createElement('span');
    firstAmountSpan.textContent = `${firstPlayer.payment} 円`;
    firstAmountSpan.style.marginLeft = '10px';

    firstPersonDiv.appendChild(firstImgElement);
    firstPersonDiv.appendChild(firstAmountSpan);
    
    resultDiv.appendChild(firstPersonDiv);

    // 負けた人以外のアイコンを表示
    finalOutcome.slice(1).forEach((player, index) => {
        const personDiv = document.createElement('div');
        
        const imgElement = document.createElement('img');
        imgElement.src = `./img/btn_${player.icon}.png`; 
        imgElement.alt = `btn_image_${index+1}`;
        imgElement.style.verticalAlign = 'middle'; 

        personDiv.appendChild(imgElement);

        resultDiv.appendChild(personDiv);
    });


    // 負けた人以外の金額を表示
    const elsePlayer = finalOutcome[0];
    const amountSpan = document.createElement('span');
    amountSpan.textContent = `${elsePlayer.payment} 円`;

    resultDiv.appendChild(amountSpan);

    // 「最初の画面に戻る」ボタン
    const button = document.createElement('button');
    button.textContent = '最初の画面に戻る'; 
    button.classList.add('buttonDesign'); 
    button.style.marginTop = '10px'; 
    button.onclick = function() {
        window.location.href = 'mode-select.html'; 
    };

    resultDiv.appendChild(button);
}

// ポップアップを表示する
if (amount) {
    if(mode){
        document.getElementById('loadingMessage').innerHTML = '<img src="img/icon_result.png" alt="Result Icon">';
        
        // 3秒経ってからポップアップを表示する
        setTimeout(function() {
            document.getElementById('loadingMessage').style.display = 'none';
            document.getElementById('popupBackground').style.display = 'block';
            document.getElementById('popup').style.display = 'block';

            finalOutcome = players.map(player => ({
                icon: player.icon,
                lost: 0
            }));
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

