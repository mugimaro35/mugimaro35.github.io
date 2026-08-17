/* =========================
   DOM
========================= */
const reels = [
    document.getElementById("reel0"),
    document.getElementById("reel1"),
    document.getElementById("reel2")
];


const creditText = document.getElementById("credit");
const resultText = document.getElementById("result");
const spinButton = document.getElementById("spin");

const reachEffect = document.getElementById("reachEffect");
const reachImage = document.getElementById("reachImage");

const highScoreText = document.getElementById("highScore");
const onlineCount = document.getElementById("onlineCount");


/* =========================
   モノクロON/OFF
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