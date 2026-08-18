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