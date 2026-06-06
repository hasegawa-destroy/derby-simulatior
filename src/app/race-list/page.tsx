"use client";

import { useEffect, useState } from "react";
import { RaceCard } from "./components/RaceCard"
import { Race } from "@/types/race";

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
        <div className="mx-full p-4">
            <p className="text-2xl font-bold text-center mb-6">開催中のレース</p>

            <div className="flex h-full flex-col gap-4">
                {races.map((race) => (
                    <RaceCard key={`${race.PK}#${race.SK}`} race={race} />
                ))}
            </div>
        </div>
    )
}