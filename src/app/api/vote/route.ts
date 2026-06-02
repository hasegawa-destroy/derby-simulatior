import { NextRequest, NextResponse } from "next/server";
import { getVote, putVote } from "@/lib/dynamodb/vote";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const raceId = searchParams.get("raceId");
    const userId = searchParams.get("userId");
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

    await putVote(body);

    return NextResponse.json({
        success: true,
    });
}