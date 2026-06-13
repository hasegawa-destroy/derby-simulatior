import { VoteDialog } from "@/app/components/ui/voteDialog";
import { Runner } from "@/types/runner"
import { useState } from "react";

type Props = {
    runners: Runner[]
    odds: { runnerId: string; odds: number }[]
    point: number
    refreshUser: () => Promise<void>
    fetchOdds: () => Promise<void>
}

export function VoteContent({ runners, odds, point, refreshUser, fetchOdds }: Props) {
    // オッズ紐づけ
    const oddsMap = Object.fromEntries(
        odds.map(o => [o.runnerId, o.odds])
    );

    const [open, setOpen] = useState(false)
    const [runner, setRunner] = useState<Runner | null>(null)
    const [raceId, setRaceId] = useState<string>()
    const [runnerOdds, setRunnerOdds] = useState<number>(1)

    return (
        <div className="p-4">

            <div>
                <p>単勝</p>

                <div className="flex items-center justify-center py-2 border-b-2">
                    <p>人気順</p>
                </div>

                <div>
                    {runners.map((runner, index) => (
                        <div key={`${runner.PK}-${runner.SK}`} className="border-b-2 border-gray-300">
                            <div className="w-full flex justify-between items-center px-2 py-4">
                                <div className="flex gap-4">
                                    <p>{index + 1}</p>
                                    <p>{runner.RunnerName}</p>
                                </div>

                                <div>
                                    <p>{(oddsMap[runner.SK] ?? 1.1).toFixed(1)} 倍</p>
                                </div>

                                <button
                                    onClick={() => {
                                        setOpen(true);
                                        setRunner(runner);
                                        setRaceId(runner.PK.split("#")[1]);
                                        setRunnerOdds(Number((oddsMap[runner.SK] ?? 1.1).toFixed(1)))
                                    }}
                                    className="bg-tertiary rounded-full px-8 py-3 text-white font-semibold"
                                >投票</button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>


            {/* ダイアログ */}
            <VoteDialog
                open={open}
                onOpenChange={setOpen}
                runner={runner}
                odds={runnerOdds}
                raceId={raceId ?? ""}
                point={point}
                refreshUser={refreshUser}
                fetchOdds={fetchOdds}
            />
        </div>
    )
}