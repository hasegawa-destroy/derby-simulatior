"use client";

import { RaceCard } from "./components/RaceCard"

const races = [
    { id: 1, name: "CL筋力杯", startTime: "14:50" },
    { id: 2, name: "CL新卒杯", startTime: "15:10" },
    { id: 3, name: "CLあいうえお杯", startTime: "15:30" },
]

export default function RaceListPage() {
    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">開催中のレース</h1>

            <div className="flex flex-col gap-4">
                {races.map((race) => (
                    <RaceCard key={race.id} race={race} />
                ))}
            </div>
        </div>
    )
}