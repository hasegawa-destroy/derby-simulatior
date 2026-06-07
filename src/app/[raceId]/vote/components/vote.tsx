import { Runner } from "@/types/runner"

type Props = {
    runners: Runner[]
    setOpen: (open: boolean) => void
    setSelectedRunner: (runner: Runner) => void
}

export function VoteContent({ runners, setOpen, setSelectedRunner }: Props) {
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

                            <button
                                onClick={() => {
                                    setSelectedRunner(runner);
                                    setOpen(true)
                                }}
                                className="w-full flex justify-between px-2 py-4"
                            >
                                <div className="flex gap-4">
                                    <p>{index + 1}</p>
                                    <p>{runner.RunnerName}</p>
                                </div>

                                <div>
                                    <p>{runner?.Odds ?? 1.1} 倍</p>
                                </div>
                            </button>

                        </div>
                    ))}
                </div>

            </div>

        </div>
    )
}