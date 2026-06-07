import { getRaceVotes } from "@/lib/dynamodb/vote";
import { OddsResult } from "@/types/oddsResult";
import { Vote } from "@/types/vote";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const raceId = searchParams.get("raceId");

    if (!raceId) {
        return NextResponse.json(
            { error: "Missing parameters" },
            { status: 400 }
        );
    }

    // レースにおける全投票取得
    const votes = await getRaceVotes(raceId);

    console.log("オッズ: " + votes.length);

    // オッズ算出
    const odds = calculateOdds(votes);

    console.log("オッズ: " + odds);
    return NextResponse.json(odds);
}

function calculateOdds(votes: Vote[]) {
    const runnerTotals: Record<string, number> = {};
    let total = 0;

    for (const vote of votes) {
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
