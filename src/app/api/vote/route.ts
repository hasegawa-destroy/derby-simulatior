import { NextRequest, NextResponse } from "next/server";
import { deleteVote, getVote, putVote } from "@/lib/dynamodb/vote";
import { cookies } from "next/headers";
import { changePoint } from "@/lib/dynamodb/user";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const userId = (await cookies()).get("SK")?.value;
    const raceId = searchParams.get("raceId");
    const runnerId = searchParams.get("runnerId");

    if (!raceId || !userId || !runnerId) {
        return NextResponse.json(
            { error: "Missing parameters" },
            { status: 400 }
        );
    }

    const votes = await getVote(raceId, userId, runnerId);
    return NextResponse.json(votes);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    // ユーザーIDを追加
    const userId = (await cookies()).get("SK")?.value ?? "";
    const vote = {
        ...body,
        PK: `${body.PK}#USER${userId}`,
    };

    try {
        // 投票
        await putVote(vote);

        // ポイント減算
        const changeAmount = body.BetAmount * -1;
        await changePoint(userId, changeAmount);
    }
    catch (e) {
        console.log("投票に失敗しました: " + e)
    }

    return NextResponse.json({
        success: true,
    });
}

export async function DELETE(request: NextRequest) {
    const body = await request.json();
    const userId = (await cookies()).get("SK")?.value ?? "";


    try {
        const betAmount = body.BetAmount;

        // 投票削除
        await deleteVote(body);

        // ポイント返却
        await changePoint(userId, betAmount);
    } catch (e) {
        console.error("投票取消に失敗しました:", e);

        return NextResponse.json(
            {
                success: false,
                message: "投票取消に失敗しました",
            },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
    });
}