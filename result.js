
// 定数の指定
const urlParams = new URLSearchParams(window.location.search);
const amount = urlParams.get('amount');
const numPeople=sessionStorage.getItem("playerCount");
const players = JSON.parse(sessionStorage.getItem('players'));
const mode = sessionStorage.getItem("mode")

// 変数の指定
let finalOutcome = 0
let finalWinners = 0
let finalLosers = 0

let winnerShare = 0
let loserShare = 0
let remainder = 0

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
        let maxScore = Math.min(...players.map(player => player[game]));
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
    
    let maxShakeCount = Math.min(...players.map(player => player.shakeCount));

    players.forEach((player, index) => {
        if (player.shakeCount === maxShakeCount) {
            finalOutcome[index].lost += 1; 
        }
    });

    // 負けの降順にソート
    finalOutcome.sort((a, b) => b.lost - a.lost);

    divideWinnerLoser()
}

// finalOutcomeを負けたプレイヤーと勝ったプレイヤーで分ける
function divideWinnerLoser(){
    const maxLosses = Math.max(...finalOutcome.map(item => item.lost));

    finalWinners = finalOutcome
    .filter(item => item.lost !== maxLosses)
    .map(({ lost, ...rest }) => rest);
  
    finalLosers = finalOutcome
    .filter(item => item.lost === maxLosses)
    .map(({ lost, ...rest }) => rest);

}

// それぞれの支払い額を計算する関数
function calculatePayment(amount) {

    // 負けたプレイヤーの数を取得し、それぞれの支払い額を計算する
    const maxLostCount = Math.max(...finalOutcome.map(player => player.lost));
    const loser = finalOutcome.filter(player => player.lost === maxLostCount).length;
    const winner = numPeople - loser

    // 全員が同一最下位の場合
    if (finalWinners == 0){
        loserShare = Math.floor(amount / numPeople);
        remainder = amount - (loserShare * numPeople);
    
    // 「鬼モード」の場合
    }else if (mode=="Oni Mode"){
        winnerShare = amount * 0.2
        winnerShare = winnerShare / winner
        winnerShare = Math.floor(winnerShare / 10) *10   
    
        const winnerTotalShare = winnerShare * winner
        const loserTotalShare = amount - winnerTotalShare
        loserShare = Math.floor(loserTotalShare / loser)

        remainder = amount - (winnerShare * winner) - (loserShare * loser)
    
    // 「福モード」の場合
    } else {
        let tmpShare = amount / numPeople
        let lessShare = tmpShare * 0.05
        winnerShare = Math.floor((tmpShare - lessShare) / 10) * 10

        loserShare = amount - (winnerShare * winner)
        loserShare = Math.floor(loserShare / loser)

        remainder = amount - (winnerShare * winner) - (loserShare * loser)
    }

}

// 同一最下位がいるかつ、お会計の計算に余りが出ている場合に、その余りを払う人をランダムに選ぶ
function shuffleLosers(){
    for (let i = finalLosers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalLosers[i], finalLosers[j]] = [finalLosers[j], finalLosers[i]];
      }
}

// 結果を表示
function showPopup(){

    // 余りを払う人をランダムに選ぶ
    if (finalLosers.length != 1 && remainder != 0){
        shuffleLosers();
    }

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ''; 

    let count = 1;

    // 負けたプレイヤーのアイコンと金額をまとめて表示
    let losersHTML = '';
    finalLosers.forEach(index => {
        let loserShareText = (count === 1) 
            ? `${loserShare + remainder}円`
            : `${loserShare}円`;

        losersHTML += `
            <li>
                <span class="result-rank">最下${count}位</span>
                <img src="./img/btn_${index.icon}.png" alt="${index.icon}">
                <span class="result-text">${loserShareText}</span>
            </li>
        `;

        count += 1;
    });

    resultDiv.innerHTML += losersHTML;

    // 全員が負けではないことを確認する
    if (finalWinners.length !== 0) {
        let winnersHTML = '';

        // 勝ったプレイヤーのアイコンをまとめて表示
        finalWinners.forEach(index => {
            winnersHTML += `
                <img src="./img/btn_${index.icon}.png" alt="${index.icon}" style="width:50px; height:50px;">
            `;
        });

        // 勝ったプレイヤーの支払い額を表示
        const winnerShareHTML = `
            <div>
                <span>${winnerShare}円</span>
            </div>
    `   ;

        resultDiv.innerHTML += `
            <div>${winnersHTML}</div>
            ${winnerShareHTML}
        `;
    }

    // 「最初の画面に戻る」ボタン
    const buttonHTML = `
        <button onclick="window.location.href = 'mode-select.html';">
            最初からやり直す
        </button>
    `;

    resultDiv.innerHTML += buttonHTML;
}

// ポップアップを表示する
if (amount) {
    if(mode){
        const loadingMessageElement = document.getElementById('loadingMessage');
        loadingMessageElement.classList.add('loading-message');
        loadingMessageElement.innerHTML = '<img src="img/icon_result.png">';
        
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
// 今後の機能追加時に使用するため、一時的にコメントアウト
/*
document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('popupBackground').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
});
*/