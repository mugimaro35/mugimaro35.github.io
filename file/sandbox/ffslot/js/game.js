/* =========================
   ゲーム状態
========================= */
let credit = START_CREDIT;
let spinning = false;
let autoSpinning = false;


/* =========================
   ハイスコア取得
========================= */
let highScore = Number(localStorage.getItem("slotHighScore")) || START_CREDIT;


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
   SPIN
========================= */
async function spin() {

    if (spinning) {
        return;
    }

    /* 前回の特殊WIN音と背景を停止 */
    stopSpecialWinSounds();
    document.body.style.backgroundImage = "";

    if (credit < BET) {
        resultText.textContent =
            "ギルが足りない！貧乏人！";
        return;
    }

    playSound(spinSound);
    spinning = true;
    spinButton.disabled = true;
    credit -= BET;
    updateCredit();
    resultText.textContent = "";


    /* リールを初期位置へ戻す */
    reels.forEach(reel => {
        reel.style.transition = "none";
        reel.style.transform =
            "translateY(0)";
    });

    await sleep(50);


    /* 左 */
    const result0 =
        await spinReel(
            reels[0],
            900
        );

        playSound(stopSound);
        playSound(spinSound);


    /* 中央 */

    const result1 =
        await spinReel(
            reels[1],
            1300
        );
        stopAudio(spinSound);
        playSound(stopSound);
        playSound(spinSound);


/* =========================
   リーチ演出
========================= */
    const reach =
        result0 === result1;

    if (reach) {
        /* リーチ音 */
            stopAudio(spinSound);

            /* 特殊リーチ確認 */
            const special = SPECIAL_SYMBOLS[result0];

            if (special?.reach) {
                playSound(special.reach);
            } else {
                playSound(reachSound);
                playSound(spinreachSound);
            }

    /* リーチ表示 */
    const reachSpecial = SPECIAL_SYMBOLS[result0];


    /* 特殊リーチ画像 */
    if (reachSpecial?.reachImage) {
        reachImage.src = reachSpecial.reachImage;
        reachEffect.classList.add("image");
    } else {


        /* 通常のREACH!! */
        reachImage.src = "";
        reachEffect.classList.remove("image");
    }


    /* リーチ演出開始 */
    reachEffect.classList.remove("active");
    void reachEffect.offsetWidth;
    reachEffect.classList.add("active");


        /* 画面フラッシュ */
        document.body.classList.remove("reachFlash");
        void document.body.offsetWidth;
        document.body.classList.add("reachFlash");

        document.body.addEventListener(
            "animationend",
            () => {
                document.body.classList.remove("reachFlash");
            },
            { once: true }
        );
    }


    /* 右 */
    const result2 =
        await spinReel(
            reels[2],
            reach ? 5000 : 1700
        );

        stopAudio(spinSound);
        playSound(stopSound);

        if (reach) {
            stopAudio(spinreachSound);
        }


    /* 結果判定 */
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

    resultText.classList.remove("lose");


    /* 3つ揃い */
    if (
        a === b &&
        b === c
    ) {

        let multiplier = 0;
        for (
            const [amount, symbols]
            of Object.entries(PAYOUT_GROUPS)
        ) {
            if (symbols.includes(a)) {
                multiplier = Number(amount);
                break;
            }
        }

        const payout = BET * multiplier;
        credit += payout;


    /* 特殊絵柄か確認 */
    const special = SPECIAL_SYMBOLS[a];

    /* 特殊音と背景 */
    if (special?.win) {
        playSound(special.win);
    } else {
        playSound(win3Sound);
    }

    if (special?.background) {
        document.body.style.backgroundImage =
            `url("${special.background}")`;

        document.body.classList.add("specialBackground");
    }

    resultText.textContent =
        `うれしい！！！！ +${payout}`;
    }


    /* 特殊リーチ失敗 */
    else if (
        a === b &&
        SPECIAL_SYMBOLS[a]?.lose
    ) {
        const payout = BET * TWO_MATCH_MULTIPLIER;
        credit += payout;
        playSound( SPECIAL_SYMBOLS[a].lose );
        resultText.textContent = `あたり！ +${payout}`;
    }


    /* 2つ揃い */
    else if (
        a === b ||
        b === c ||
        a === c
    ) {
        const payout = BET * TWO_MATCH_MULTIPLIER;
        credit += payout;
        playSound(winSound);
        resultText.textContent =
            `あたり！ +${payout}`;
    }


    /* はずれ */
    else {
        playSound(loseSound);
        resultText.textContent = "はずれ！";
        resultText.classList.add("lose");
    }

    updateCredit();
}


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

            const confirmReset = confirm("リセットしますか？");

            if (!confirmReset) {
                return;
            }

            credit = START_CREDIT;
            updateCredit()
            resultText.textContent = "";

            /* 特殊音・背景を解除 */
            stopSpecialWinSounds();
            document.body.classList.remove("specialBackground");
            document.body.style.backgroundImage = "";

            reels.forEach(reel => {
                reel.style.transition = "none";
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


/* =========================
   AUTO SPIN
========================= */
const autoSpinButton =
    document.getElementById("autoSpin");

autoSpinButton.addEventListener(
    "click",
    async () => {

        /* AUTO停止 */
        if (autoSpinning) {
            autoSpinning = false;
            autoSpinButton.textContent = "AUTO";
            return;
        }

        /* 手動SPIN中はAUTO開始不可 */
        if (spinning) {
            return;
        }

        /* BET不足 */
        if (credit < BET) {
            resultText.textContent =
                "ギルが足りない！貧乏人！";
            return;
        }

        autoSpinning = true;
        autoSpinButton.textContent = "STOP";

        while (
            autoSpinning &&
            credit >= BET
        ) {
            await spin();

            await sleep(500);
        }

        autoSpinning = false;
        autoSpinButton.textContent = "AUTO";
    }
);