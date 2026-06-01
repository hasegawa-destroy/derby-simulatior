import { NextRequest, NextResponse } from "next/server";
import { getRace } from "@/lib/dynamodb/race";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const raceId = searchParams.get("raceId");
    const runnerId = searchParams.get("runnerId");

    if (!raceId || !runnerId) {
        return NextResponse.json(
            { error: "Missing parameters" },
            { status: 400 }
        );
    }

    const race = await getRace(raceId);
    const runner = race.runners.find(
        (r) => r.SK === `RUNNER#${runnerId}`
    );

    return NextResponse.json(runner);
}