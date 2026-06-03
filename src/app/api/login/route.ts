import { login } from "@/lib/dynamodb/login";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const user = await login(body.userId, body.password);

    if (!user) {
        return Response.json(
            { success: false },
            { status: 401 }
        );
    }

    return Response.json({
        success: true,
        user,
    });
}