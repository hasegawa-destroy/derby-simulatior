import { VoteDialog } from "@/app/components/ui/voteDialog";
import { Runner } from "@/types/runner"
import { useState } from "react";

type Props = {
    runners: Runner[]
}

export function RunnerListContent({ runners }: Props) {
    // オッズ紐づけ

    return (
        <div className="p-4">
            <div>
                {runners.map((runner, index) => (
                    <div key={`${runner.PK}-${runner.SK}`} className="border-b-2 border-gray-300">
                        <div className="w-full flex justify-between items-center px-2 py-4">
                            <div className="flex gap-4">
                                <p>{index + 1}</p>
                                <p>{runner.RunnerName}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div >
    )
}