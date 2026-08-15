/* =========================
   設定
========================= */

const images = [
    "file/sandbox/ffslot/image01.png",
    "file/sandbox/ffslot/image02.png",
    "file/sandbox/ffslot/image03.png",
    "file/sandbox/ffslot/image04.png"
];

const reels = [
    document.getElementById("reel0"),
    document.getElementById("reel1"),
    document.getElementById("reel2")
];

const creditText = document.getElementById("credit");
const resultText = document.getElementById("result");
const spinButton = document.getElementById("spin");
const SYMBOL_HEIGHT = 150;

/* =========================
   ゲーム設定
========================= */

const START_CREDIT = 30;
const BET = 10;
const JACKPOT = 100;
const TWO_MATCH = 20;

let credit = START_CREDIT;
let spinning = false;

/* =========================
   保存データ
========================= */

let highScore =
    Number(localStorage.getItem("slotHighScore")) || START_CREDIT;

/* =========================
   DOM
========================= */

const highScoreText =
    document.getElementById("highScore");

/* =========================
   リール生成
========================= */

function createReel(reel) {
    reel.innerHTML = "";

    /*
     * リールを40個並べる
     */

    for (let i = 0; i < 40; i++) {
        const symbol =
            document.createElement("div");
        symbol.className = "symbol";

        const img =
            document.createElement("img");

        img.src =
            images[
                i % images.length
            ];

        symbol.appendChild(img);
        reel.appendChild(symbol);
    }
}

/* =========================
   初期化
========================= */

reels.forEach(createReel);

/* =========================
   ランダム絵柄
========================= */

function randomSymbol() {

    return Math.floor(
        Math.random() *
        images.length
    );
}

/* =========================
   リールを回す
========================= */

function spinReel(
    reel,
    duration
) {
    return new Promise(resolve => {
        const finalSymbol =
            randomSymbol();


        /* * 停止位置 */
        const targetIndex =
            30 +
            finalSymbol;


        /* * 上方向へ移動 */
        const targetPosition =
            -(
                targetIndex *
                SYMBOL_HEIGHT
            );

        reel.style.transition =
            `transform ${duration}ms
             cubic-bezier(
                 .15,
                 .8,
                 .2,
                 1
             )`;

        reel.style.transform =
            `translateY(
                ${targetPosition}px
            )`;

        setTimeout(() => {
            resolve(finalSymbol);
        }, duration);
    });
}

/* =========================
   SPIN
========================= */

async function spin() {

    if (spinning) {
        return;
    }


    if (credit < BET) {

        resultText.textContent =
            "ギルが足りない！貧乏人！";

        return;
    }

    spinning = true;
    spinButton.disabled = true;
    credit -= BET;
    updateCredit();
    resultText.textContent = "";

    /* * リールを初期位置へ戻す */

    reels.forEach(reel => {

        reel.style.transition = "none";

        reel.style.transform =
            "translateY(0)";
    });


    await sleep(50);


    /* * 左 */

    const result0 =
        await spinReel(
            reels[0],
            900
        );


    /* * 中央 */

    const result1 =
        await spinReel(
            reels[1],
            1300
        );


    /* * 右 */

    const result2 =
        await spinReel(
            reels[2],
            1700
        );


    judge([
        result0,
        result1,
        result2
    ]);


    spinning = false;

    spinButton.disabled = false;
}


/* =========================
   結果判定
========================= */

function judge(results) {
    const a = results[0];
    const b = results[1];
    const c = results[2];

    /* * 3つ揃い */
    if (
        a === b &&
        b === c
    ) {

        credit += JACKPOT;
        resultText.textContent =
            "うれしい！！！！ +100";
    }


    /* * 2つ揃い */
    else if (
        a === b ||
        b === c ||
        a === c
    ) {
        credit += TWO_MATCH;
        resultText.textContent =
            "あたり！ +20";
    }


    /* * ハズレ */
    else {
        resultText.textContent =
            "はずれ！";
    }

    updateCredit();
}

/* =========================
   ギル更新
========================= */

function updateCredit() {
    creditText.textContent = credit;

    if (credit > highScore) {
        highScore = credit;

        localStorage.setItem(
            "slotHighScore",
            highScore
        );
    }

    highScoreText.textContent = highScore;
}

updateCredit();

/* =========================
   RESET
========================= */

document
    .getElementById("reset")
    .addEventListener(
        "click",
        () => {

            if (spinning) {
                return;
            }


            credit =
                START_CREDIT;


            updateCredit();


            resultText.textContent =
                "";


            reels.forEach(reel => {

                reel.style.transition =
                    "none";

                reel.style.transform =
                    "translateY(0)";
            });

        }
    );


/* =========================
   SPINボタン
========================= */

spinButton.addEventListener(
    "click",
    spin
);

/* =========================
   ハイスコア削除
========================= */

document
    .getElementById("clearScore")
    .addEventListener(
        "click",
        () => {
            localStorage.removeItem("slotHighScore");
            highScore = START_CREDIT;
            highScoreText.textContent = highScore;
        }
    );

/* =========================
   sleep
========================= */

function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );
}