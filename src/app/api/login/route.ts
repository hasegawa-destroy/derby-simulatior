import { login } from "@/lib/dynamodb/login";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const user = await login(body.userId, body.password);

    if (!user) {
        return Response.json(
            { success: false },
            { status: 401 }
        );
    }

    // cookieにデータを設定
    const cookieStore = await cookies();
    cookieStore.set("SK", user.SK, {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return Response.json({
        success: true,
        user,
    });
}