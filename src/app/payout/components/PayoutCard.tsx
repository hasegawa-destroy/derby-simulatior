import { Race } from "@/types/race";
import { Runner } from "@/types/runner";
import { useEffect, useState } from "react";

export function PayoutCard({ race }: { race: Race }) {
    const [runners, setRunners] = useState<Runner[]>([]);
    const [selectedRunner, setSelectedRunner] = useState("");
    const [selectedRaceState, setSelectedRaceState] = useState("Hide");

    const raceStates = [
        "Hide",
        "OpenVoting",
        "CloseVoting",
        "PaidOut",
    ];

    useEffect(() => {
        const raceId = race.PK.split("#")[1];

        // レース情報取得
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

    // レース状態変更
    const handleChangeRaceState = async () => {
        if (selectedRaceState == "") {
            return;
        }

        const changedRace = {
            PK: `${race.PK}`,
            SK: `${race.SK}`,
            State: `${selectedRaceState}`,
        };

        await fetch(`/api/race/${race.PK}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(changedRace),
        });
    }

    // 払出
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
            <div className="flex flex-col items-center justify-center w-1/5">
                <p className="text-lg font-semibold mb-2">{race.RaceName}</p>
                <p>現在の状態: {race.State}</p>
            </div>

            {/* レース状態 */}
            <div className="flex justify-center items-center w-2/5">
                <select
                    value={selectedRaceState}
                    onChange={(e) => setSelectedRaceState(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">選択してください</option>

                    {raceStates.map((state, index) => (
                        <option
                            key={`${state}`}
                            value={state}
                        >
                            {index + 1} - {state}
                        </option>
                    ))}
                </select>

                <div className="flex w-2/5 h-full items-center justify-center">
                    <button
                        className="bg-tertiary rounded-full px-8 py-3 text-white font-semibold"
                        onClick={handleChangeRaceState}
                    >
                        変更
                    </button>
                </div>
            </div>

            {/* 払い出し */}
            <div className="flex justify-center items-center w-2/5">
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

                <div className="flex w-2/5 h-full items-center justify-center">
                    <button
                        className="bg-tertiary rounded-full px-8 py-3 text-white font-semibold"
                        onClick={handleClick}
                    >
                        払出
                    </button>
                </div>
            </div>
        </div>
    );
}