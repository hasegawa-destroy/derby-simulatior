"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RaceListPage() {
    const router = useRouter();

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                password,
            }),
        });

        const result = await response.json();
        if (result.success) {
            router.push("/race-list");
        } else {
            alert("ログインに失敗しました");
        }
    }

    return (
        <div className="mx-full p-4">
            <div className="w-full p-4 bg-white rounded-lg">
                <div className="flex justify-center items-center w-full">
                    <p>ログイン</p>
                </div>

                {/* 入力項目 */}
                <div className="flex flex-col gap-2 my-8">
                    {/* ユーザーID */}
                    <div className="flex justify-between items-center">
                        <div>ユーザーID</div>
                        <input
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className='w-56 border-2 border-gray-400 bg-gray-200 px-2' />
                    </div>

                    {/* パスワード */}
                    <div className="flex justify-between items-center">
                        <div>パスワード</div>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-56 border-2 border-gray-400 bg-gray-200 px-2' />
                    </div>
                </div>

                {/* ログインボタン */}
                <div className='flex flex-col'>
                    <p className=""></p>
                    <button
                        onClick={() => handleLogin()}
                        className="px-4 py-2 bg-tertiary text-white rounded-full"
                    >
                        ログイン
                    </button>
                </div>
            </div>
        </div>
    )
}