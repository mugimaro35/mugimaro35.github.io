/* =========================
   ハイスコア削除
========================= */
document
    .getElementById("clearScore")
    .addEventListener(
        "click",
        () => {
            localStorage.removeItem("dopaslotHighScore");
            highScore = START_CREDIT;
            highScoreText.textContent = highScore;
        }
    );