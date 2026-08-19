/* =========================
   Supabase
========================= */
const SUPABASE_URL = "https://cxdctttswqvashlirvca.supabase.co";
const SUPABASE_KEY = "sb_publishable_lKf-Qu0VwI9kwzW0gIshvA_FcZaJgJs";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================
   プレイヤーID識別
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
   ゲーム設定
========================= */
const REEL_COUNT = 5;
const SYMBOL_HEIGHT = 150;
const START_CREDIT = 100;
let BET = 10;
const TWO_MATCH_MULTIPLIER = 3;

/* 現在未使用 */
const JACKPOT = 100;


/* =========================
   絵柄設定
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


/* =========================
   3枚揃え配当
========================= */
/* ×報酬[絵柄] */
const PAYOUT_GROUPS = {
    2: [3],
    4: [5],
    5: [0, 1, 2, 4, 7],
    30: [6]
};


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
/* ================================================================================ */
const losewakkaSound = new Audio("file/sandbox/ffslot/snd/lose_wakka.mp3");

const loseyunaSound = new Audio("file/sandbox/ffslot/snd/lose_yuna.mp3");

const reachkimariSound = new Audio("file/sandbox/ffslot/snd/reach_kimari.mp3");
const winkimariSound = new Audio("file/sandbox/ffslot/snd/win_kimari.mp3");
const losekimariSound = new Audio("file/sandbox/ffslot/snd/lose_kimari.mp3");

const reachluluSound = new Audio("file/sandbox/ffslot/snd/reach_lulu.mp3");
const winluluSound = new Audio("file/sandbox/ffslot/snd/win_lulu.mp3");
const loseluluSound = new Audio("file/sandbox/ffslot/snd/lose_lulu.mp3");

const winwakkaRSound = new Audio("file/sandbox/ffslot/snd/win_wakkaR.mp3");

const reachauronSound = new Audio("file/sandbox/ffslot/snd/reach_auron.mp3");
const winauronSound = new Audio("file/sandbox/ffslot/snd/win_auron.mp3");
const loseauronSound = new Audio("file/sandbox/ffslot/snd/lose_auron.mp3");


/* =========================
   特殊演出
========================= */
const SPECIAL_SYMBOLS = {
    0: {
        lose: losewakkaSound
    },

    1: {
        lose: loseyunaSound
    },

    3: {
        reach: reachkimariSound,
        win: winkimariSound,
        lose: losekimariSound
    },

    4: {
        reach: reachluluSound,
        win: winluluSound,
        lose: loseluluSound
    },

    6: {
        win: winwakkaRSound,
        lose: losewakkaSound,
        reachImage: "file/sandbox/ffslot/img/reach_wakkaR.png",
        background: "file/sandbox/ffslot/img/bg_wakkaR.png"
    },

    7: {
        reach: reachauronSound,
        win: winauronSound,
        lose: loseauronSound
    }
};