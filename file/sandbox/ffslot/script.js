/* =========================
   Supabase
========================= */
const SUPABASE_URL =
    "https://cxdctttswqvashlirvca.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_lKf-Qu0VwI9kwzW0gIshvA_FcZaJgJs";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================
   プレイヤーID
========================= */
let playerId =
    localStorage.getItem("slotPlayerId");

if (!playerId) {
    playerId = crypto.randomUUID();
    localStorage.setItem(
        "slotPlayerId",
        playerId
    );
}


/* =========================
   設定
========================= */
const images = [
    "file/sandbox/ffslot/img/01.png",
    "file/sandbox/ffslot/img/02.png",
    "file/sandbox/ffslot/img/03.png",
    "file/sandbox/ffslot/img/04.png",
    "file/sandbox/ffslot/img/05.png",
    "file/sandbox/ffslot/img/06.png",
    "file/sandbox/ffslot/img/07.png",
    "file/sandbox/ffslot/img/08.png"
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
   サウンド設定
========================= */
const winSound = new Audio("file/sandbox/ffslot/snd/win.mp3");
const win3Sound = new Audio("file/sandbox/ffslot/snd/win_3.mp3");
const loseSound = new Audio("file/sandbox/ffslot/snd/lose.mp3");
const stopSound = new Audio("file/sandbox/ffslot/snd/stop.mp3");
const reachSound = new Audio("file/sandbox/ffslot/snd/reach.mp3");
const spinSound = new Audio("file/sandbox/ffslot/snd/spin.mp3");
const spinreachSound = new Audio("file/sandbox/ffslot/snd/spin_reach.mp3");

const reachEffect = document.getElementById("reachEffect");

let soundEnabled = true;


/* 再生/停止の関数 */
function playSound(sound) {
    if (!soundEnabled) {
        return;
    }

    sound.currentTime = 0;
    sound.play();
}

function stopAudio(sound) {
    sound.pause();
    sound.currentTime = 0;
}


/* =========================
   ゲーム設定
========================= */
const START_CREDIT = 100;
const BET = 10;
const JACKPOT = 100;
const TWO_MATCH = 30;

let credit = START_CREDIT;
let spinning = false;

/* 3枚絵柄 */
const PAYOUT_GROUPS = {
    10: [3],
    20: [5],
    50: [0, 1, 2, 4, 7],
    100: [],
    300: [6]
};


/* =========================
   保存データ
========================= */
let highScore = Number(localStorage.getItem("slotHighScore")) || START_CREDIT;


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

    /* リールを並べる */

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
            playSound(reachSound);
            playSound(spinreachSound);

        /* REACH!!表示 */
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

        let payout = 0;

        for (const [amount, symbols] of Object.entries(PAYOUT_GROUPS)) {
            if (symbols.includes(a)) {
                payout = Number(amount);
                break;
            }
        }

        credit += payout;
        playSound(win3Sound);
        resultText.textContent =
            `うれしい！！！！ +${payout}`;
    }


    /* 2つ揃い */
    else if (
        a === b ||
        b === c ||
        a === c
    ) {
        credit += TWO_MATCH;
        playSound(winSound);
        resultText.textContent = "あたり！ +30";
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


            credit = START_CREDIT;
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
   ランキング取得
========================= */
async function loadRanking() {
    const { data, error } =
        await supabaseClient
            .from("leaderboard")
            .select("player_name, score")
            .order("score", {
                ascending: false
            })
            .limit(10);

    if (error) {
        console.error(
            "ランキング取得エラー:",
            error
        );
        return;
    }

    const ranking =
        document.getElementById("ranking");
    ranking.innerHTML = "";

    data.forEach((entry, index) => {
        const row = document.createElement("div");
        row.className = `rank-${index + 1}`;
        row.textContent = `${index + 1}位　${entry.player_name}　${entry.score}ギル`;
        ranking.appendChild(row);
    });
}


/* =========================
   スコア登録
========================= */
document
    .getElementById("submitScore")
    .addEventListener(
        "click",
        async () => {

            const name =
                document
                    .getElementById("playerName")
                    .value
                    .trim();

            if (!name) {
                alert("名前を入力");
                return;
            }

            const score = credit;


            /* =====================
               既存プレイヤーを確認
            ===================== */
            const { data: existing, error: selectError } =
                await supabaseClient
                    .from("leaderboard")
                    .select("id, score")
                    .eq("player_id", playerId)
                    .maybeSingle();


            if (selectError) {

                console.error(
                    "プレイヤー確認エラー:",
                    selectError
                );

                alert( "スコア登録に失敗しました" );
                return;
            }


            /* =====================
               登録済み
            ===================== */
            if (existing) {

                /* * 自己ベスト以下なら更新しない */

                if (score <= existing.score) {
                    alert( `自己ベストは ${existing.score} ギルです！` );
                    return;
                }


                /* 自己ベスト更新 */
                const { error: updateError } =
                    await supabaseClient
                        .from("leaderboard")
                        .update({
                            player_name: name,
                            score: score,
                            updated_at: new Date().toISOString()
                        })
                        .eq("player_id", playerId);


                if (updateError) {
                    console.error(
                        "スコア更新エラー:",
                        updateError
                    );

                    alert( "スコア更新に失敗しました" );
                    return;
                }


                alert( `自己ベスト更新！ ${score}ギル` );
            }


            /* =====================
               初回登録
            ===================== */
            else {
                const { error: insertError } =
                    await supabaseClient
                        .from("leaderboard")
                        .insert({
                            player_id: playerId,
                            player_name: name,
                            score: score
                        });


                if (insertError) {
                    console.error(
                        "スコア登録エラー:",
                        insertError
                    );

                    alert( "スコア登録に失敗しました" );
                    return;
                }

                alert( `ランキングに登録しました！ ${score}ギル` );
            }

            loadRanking();
        }
    );


loadRanking();


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
   サウンドON/OFF
========================= */
const soundToggle = document.getElementById("soundToggle");
soundToggle.addEventListener(
    "click",
    () => {
        soundEnabled = !soundEnabled;
        soundToggle.textContent = soundEnabled
                ? "🔊"
                : "🔇";
    }
);


/* =========================
   ナフサON/OFF
========================= */
const monoToggle = document.getElementById("monoToggle");

monoToggle.addEventListener(
    "click",
    () => {
        document.body.classList.toggle(
            "monochrome"
        );

        monoToggle.textContent =
            document.body.classList.contains(
                "monochrome"
            )
                ? "◑"
                : "◐";
    }
);