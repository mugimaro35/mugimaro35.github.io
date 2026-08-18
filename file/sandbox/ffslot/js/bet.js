/* =========================
   BET設定
========================= */
const betAmount = document.getElementById("betAmount");
const betButtons = document.querySelectorAll(".betButton");
const betReset = document.getElementById("betReset");


/* BET追加 */
betButtons.forEach(button => {
    button.addEventListener(
        "click",
        () => {
            if (spinning || autoSpinning) {
                return;
            }

            const value = button.dataset.bet;


            /* MAX */
            if (value === "max") {
                BET = credit;
            }


            /* 通常 */
            else {
                const amount = Number(value);
                if (BET + amount > credit) {
                    return;
                }

                BET += amount;
            }

            betAmount.textContent = BET;
        }
    );
});



/* BETリセット */
betReset.addEventListener(
    "click",
    () => {
        if (spinning || autoSpinning) {
            return;
        }

        BET = 10;
        betAmount.textContent = BET;
    }
);