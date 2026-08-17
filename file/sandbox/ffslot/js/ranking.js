


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
   初回ランキング取得
========================= */
loadRanking();
