
/* =========================
   オンライン人数
========================= */
/* 自分をオンライン登録 */
async function updateOnline() {

    const { error } =
        await supabaseClient
            .from("online_users")
            .upsert({
                id: playerId,
                last_seen:
                    new Date().toISOString()
            });

    if (error) {
        console.error(
            "オンライン登録エラー:",
            error
        );
    }
}


/* =========================
   オンライン人数取得
========================= */
async function updateOnlineCount() {

    const limitTime =
        new Date(
            Date.now() - 60 * 1000
        ).toISOString();

    const { count, error } =
        await supabaseClient
            .from("online_users")
            .select("*", {
                count: "exact",
                head: true
            })
            .gte(
                "last_seen",
                limitTime
            );

    if (error) {
        console.error(
            "オンライン人数取得エラー:",
            error
        );
        return;
    }

    onlineCount.textContent =
        `現在 ${count || 0}人がプレイ中`;
}


/* =========================
   初回実行
========================= */
updateOnline();
updateOnlineCount();


/* =========================
   20秒ごとに更新
========================= */
setInterval(
    async () => {

        await updateOnline();
        await updateOnlineCount();

    },
    20000
);