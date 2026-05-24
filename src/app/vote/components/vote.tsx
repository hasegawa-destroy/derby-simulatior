type Runner = {
    PK: string
    SK: string
    RunnerName: string
    odds: number
}

type Props = {
    runners: Runner[]
    setOpen: (open: boolean) => void
}

export function VoteContent({ runners, setOpen }: Props) {
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
                                onClick={() => setOpen(true)}
                                className="w-full flex justify-between px-2 py-4"
                            >
                                <div className="flex gap-4">
                                    <p>{index + 1}</p>
                                    <p>{runner.RunnerName}</p>
                                </div>

                                <div>
                                    <p> 1.4倍</p>
                                    {/* {runner.odds} */}
                                </div>
                            </button>

                        </div>
                    ))}
                </div>

            </div>

        </div>
    )
}