import { getRace } from "@/lib/dynamodb/race";
import { getRaceVotes } from "@/lib/dynamodb/vote";
import { Runner } from "@/types/runner";
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

    // オッズ算出
    const race = await getRace(raceId);
    const odds = calculateOdds(votes, race.runners);

    return NextResponse.json(odds);
}

function calculateOdds(votes: Vote[], runners: Runner[]) {
    const runnerTotals: Record<string, number> = {};
    let total = 0;

    for (const vote of votes) {
        const amount = Number(vote.BetAmount);
        runnerTotals[vote.SK] = (runnerTotals[vote.SK] ?? 0) + amount;
        total += amount;
    }

    return runners.map((runner) => {
        const runnerId = runner.SK;
        const amount = runnerTotals[runnerId] ?? 0;

        return {
            runnerId,
            total: amount,
            odds: amount === 0 ? total : total / amount,
        };
    });
}
