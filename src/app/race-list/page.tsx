"use client";

import { useEffect, useState } from "react";
import { RaceCard } from "./components/RaceCard"
import { Race } from "@/types/race";
import { User } from "@/types/user";
import Link from "next/link";

export default function RaceListPage() {
    const [user, setUser] = useState<User | null>(null);

    // レース情報取得
    const [races, setRaces] = useState<Race[] | null>([]);
    useEffect(() => {
        async function fetchRace() {
            const res = await fetch(`/api/races`);
            const json = await res.json();

            setRaces(json);
        }

        fetchRace();
    }, []);

    // ユーザー情報取得
    useEffect(() => {
        async function fetchUser() {
            const res = await fetch(`/api/user`);
            const json = await res.json();

            setUser(json);
        }

        fetchUser();
    }, []);

    if (races == null) {
        return <div>レース読み込み中...</div>
    }

    return (
        <div>

            {/* ポイント残高 */}
            <div className='flex flex-col bg-[#3E3F43] px-8 py-4 border-t-2 border-gray-500'>

                {/* ユーザー名 */}
                <div className='flex justify-end items-center'>
                    <p className="text-secondary text-xl">
                        {user?.UserName ?? (
                            <Link href="/login" className="text-blue-500 underline">
                                ログインしてください
                            </Link>
                        )}
                    </p>
                </div>

                <div className='flex justify-between items-center'>
                    <p className='text-secondary text-lg'>ポイント残高</p>
                    <p className='text-secondary text-xl'>{Math.floor(user?.Point ?? 0)} pt</p>
                </div>
            </div>

            <div className="mx-full p-4">

                <p className="text-2xl font-bold text-center mb-6">開催中のレース</p>

                <div className="flex h-full flex-col gap-4">
                    {races.map((race) => (
                        <RaceCard key={`${race.PK}#${race.SK}`} race={race} />
                    ))}
                </div>
            </div>
        </div>
    )
}