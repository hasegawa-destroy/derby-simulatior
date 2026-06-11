import { Race } from "@/types/race";
import { Runner } from "@/types/runner";
import { useEffect, useState } from "react";

export function PayoutCard({ race }: { race: Race }) {
    const [runners, setRunners] = useState<Runner[]>([]);
    const [selectedRunner, setSelectedRunner] = useState("");

    useEffect(() => {
        const raceId = race.PK.split("#")[1];

        async function fetchRace() {
            const res = await fetch(`/api/race/${raceId}`);
            const json = await res.json();

            const fetchedRunners = json?.runners ?? [];

            setRunners(fetchedRunners);

            // 最初の出走者を選択状態にする
            if (fetchedRunners.length > 0) {
                setSelectedRunner(fetchedRunners[0].PK);
            }
        }

        fetchRace();
    }, [race.PK]);

    const handleClick = async () => {
        const selected = runners.find(
            (runner) => runner.SK === selectedRunner
        );

        console.log(selected);

        if (selected == null || selected == undefined) return;
        selected.PK = selected.PK.split("#")[1];

        await fetch("/api/payout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(selected),
        });

    };

    return (
        <div className="flex rounded-lg w-full h-32 p-2 bg-white transition">
            <div className="flex flex-col items-center justify-center w-3/5 h-full">
                <p className="text-lg font-semibold mb-2">
                    {race.RaceName}
                </p>
            </div>

            <div>
                <select
                    value={selectedRunner}
                    onChange={(e) => setSelectedRunner(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">選択してください</option>

                    {runners.map((runner, index) => (
                        <option
                            key={`${runner.PK}-${runner.SK}`}
                            value={runner.SK}
                        >
                            {index + 1} - {runner.RunnerName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex w-2/5 h-full items-center justify-center">
                <button
                    className="bg-tertiary rounded-full px-8 py-3 text-white font-semibold"
                    onClick={handleClick}
                >
                    払出
                </button>
            </div>
        </div>
    );
}