/* =========================
   リール生成
========================= */
function createReel(reel) {
    reel.innerHTML = "";

    for (
        let i = 0;
        i < images.length * REEL_COUNT;
        i++
    ) {
        const symbol = document.createElement("div");
        symbol.className = "symbol";
        const img = document.createElement("img");
        img.src = images[i % images.length];

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
   リール回転
========================= */
function spinReel(
    reel,
    duration
) {
    return new Promise(resolve => {
        const finalSymbol =
            randomSymbol();


        /* 停止位置 */
        const targetIndex =
            (images.length * (REEL_COUNT - 1)) +
            finalSymbol;


        /* 上方向へ移動 */
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
