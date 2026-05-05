"use client";

import { RaceCard } from "./components/RaceCard"

const races = [
    { id: 1, name: "CL筋力杯", startTime: "14:50" },
    { id: 2, name: "CL新卒杯", startTime: "15:10" },
    { id: 3, name: "CLあいうえお杯", startTime: "15:30" },
]

export default function RaceListPage() {
    return (
        <div className="mx-full p-4">
            <p className="text-2xl font-bold text-center mb-6">開催中のレース</p>

            <div className="flex h-full flex-col gap-4">
                {races.map((race) => (
                    <RaceCard key={race.id} race={race} />
                ))}
            </div>
        </div>
    )
}