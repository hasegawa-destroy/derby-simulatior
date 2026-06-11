"use client";

import { useEffect, useState } from "react";
import { Race } from "@/types/race";
import { PayoutCard } from "./components/PayoutCard";

export default function RaceListPage() {

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

    if (races == null) {
        return <div>レース読み込み中...</div>
    }

    return (
        <div>
            <div className="mx-full p-4">

                <p className="text-2xl font-bold text-center mb-6">開催中のレース</p>

                <div className="flex h-full flex-col gap-4">
                    {races.map((race) => (
                        <PayoutCard key={`${race.PK}#${race.SK}`} race={race} />
                    ))}
                </div>
            </div>
        </div>
    )
}