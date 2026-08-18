/* =========================
   再生/停止の関数
========================= */
function playSound(sound) {
    if (!soundEnabled) {
        return;
    }

    sound.volume = masterVolume;
    sound.currentTime = 0;
    sound.play();
}


function stopAudio(sound) {
    sound.pause();
    sound.currentTime = 0;
}


/* =========================
   特殊WIN音を全部停止
========================= */
function stopSpecialWinSounds() {
    Object.values(SPECIAL_SYMBOLS).forEach(special => {
        if (special?.win) {
            stopAudio(special.win);
        }
    });
}


/* =========================
   サウンドON/OFF
========================= */
const soundToggle = document.getElementById( "soundToggle"  );
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
   音量
========================= */
let soundEnabled = true;
let masterVolume = 1.0;
const volumeSlider = document.getElementById("volumeSlider");

volumeSlider.addEventListener(
    "input",
    () => {
        masterVolume = volumeSlider.value / 100;
    }
);