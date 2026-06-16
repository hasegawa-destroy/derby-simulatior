import { VoteDialog } from "@/app/components/ui/voteDialog";
import { Runner } from "@/types/runner"
import { useState } from "react";

type Props = {
    runners: Runner[]
    odds: { runnerId: string; odds: number }[]
    point: number
    raceState: string
    refreshUser: () => Promise<void>
    fetchOdds: () => Promise<void>
}

export function VoteContent({ runners, odds, point, refreshUser, fetchOdds, raceState }: Props) {
    // オッズ紐づけ
    const oddsMap = Object.fromEntries(
        odds.map(o => [o.runnerId, o.odds])
    );
    const sortedRunners = [...runners].sort((a, b) => {
        const oddsA = oddsMap[a.SK] ?? 1.1;
        const oddsB = oddsMap[b.SK] ?? 1.1;

        // オッズが低い順
        return oddsA - oddsB;
    });

    const [open, setOpen] = useState(false)
    const [runner, setRunner] = useState<Runner | null>(null)
    const [raceId, setRaceId] = useState<string>()
    const [runnerOdds, setRunnerOdds] = useState<number>(1)

    // 再描画ボタン押下処理
    const handleRefresh = async () => {
        await fetchOdds();
    };

    return (
        <div className="p-4">

            <div>
                <div className="relative flex justify-center items-center w-full py-2 border-b-2">
                    <div>
                        <p className="text-xl font-semibold">人気順</p>
                    </div>

                    {/* 再読み込みボタン */}
                    <div className="absolute right-4">
                        <button
                            onClick={() => { handleRefresh() }}
                            className="text-2xl">
                            ↺
                        </button>
                    </div>
                </div>

                <div>
                    {sortedRunners.map((runner, index) => (
                        <div key={`${runner.PK}-${runner.SK}`} className="border-b-2 border-gray-300">
                            <div className="w-full flex justify-between items-center px-2 py-4">
                                <div className="flex gap-4">
                                    <p className="text-lg">{index + 1}</p>
                                    <p className="text-lg font-semibold">{runner.RunnerName}</p>
                                </div>

                                <div>
                                    <p className="text-lg font-bold">{(oddsMap[runner.SK] ?? 1.1).toFixed(1)} 倍</p>
                                </div>

                                <button
                                    onClick={() => {
                                        setOpen(true);
                                        setRunner(runner);
                                        setRaceId(runner.PK.split("#")[1]);
                                        setRunnerOdds(Number((oddsMap[runner.SK] ?? 1.1).toFixed(1)))
                                    }}
                                    className="bg-tertiary rounded-full px-6 py-3 text-lg text-secondary font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={raceState !== "OpenVoting"}
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
                canVote={raceState === "OpenVoting"}
                refreshUser={refreshUser}
                fetchOdds={fetchOdds}
            />
        </div>
    )
}