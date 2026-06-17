import { NextRequest, NextResponse } from "next/server";
import { getRaceVotes } from "@/lib/dynamodb/vote";
import { changePoint } from "@/lib/dynamodb/user";
import { Vote } from "@/types/vote";

export async function POST(request: NextRequest) {
    const body = await request.json();

    try {
        // 指定したレースの投票を全聚徳
        const votes = await getRaceVotes(body.PK)
        if (votes == null || votes.length == 0) {
            return NextResponse.json(
                { error: "投票がありません" },
                { status: 404 }
            );
        }


        console.log(votes);

        // オッズ算出
        const odds = calculateOdds(votes);
        console.log("オッズ: " + odds);

        // 払出投票のみ取得
        const payoutVotes = votes.filter(
            vote => vote.SK === body.SK
        );

        // ポイント加算
        const payoutOdds = odds.find(
            (o) => o.runnerId === body.SK
        );

        await Promise.all(
            payoutVotes.map(async (pv) => {
                const payoutAmount = Math.floor(Number(pv.BetAmount) * (payoutOdds?.odds ?? 1));
                const userId = pv.PK.split("#")[1] + "#" + pv.PK.split("#")[2];

                return changePoint(userId.split("USER")[1], payoutAmount);
            })
        );
    }
    catch (e) {
        console.error("払出に失敗:", e);

        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
    });
}

function calculateOdds(votes: Vote[]) {
    const runnerTotals: Record<string, number> = {};
    let total = 0;

    for (const vote of votes) {
        console.log("SK: " + vote.SK)

        const amount = Number(vote.BetAmount);
        runnerTotals[vote.SK] = (runnerTotals[vote.SK] ?? 0) + amount;
        total += amount;
    }

    const payout = total;

    return Object.entries(runnerTotals).map(
        ([runnerId, amount]) => ({
            runnerId,
            total: amount,
            odds: amount === 0 ? 0 : payout / amount,
        })
    );
}