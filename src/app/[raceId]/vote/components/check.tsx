import { useState, useEffect } from 'react'
import { VoteDialog } from "@/app/components/ui/voteDialog";
import { Vote } from '@/types/vote';
import { Runner } from '@/types/runner';

type Props = {
    raceId: string
}

export function CheckContent({ raceId }: Props) {
    const [open, setOpen] = useState(false)

    // 投票取得
    const [votes, setVotes] = useState<Vote[]>([])
    useEffect(() => {
        fetch(
            `/api/vote?raceId=${raceId}&runnerId=001`
        )
            .then((res) => res.json())
            .then(setVotes);
    }, []);

    // 走者取得
    const [runner, setRunner] = useState<Runner>()
    useEffect(() => {
        fetch(
            `/api/runner?raceId=${raceId}&runnerId=001`
        )
            .then((res) => res.json())
            .then(setRunner);
    }, []);

    // 投票合計
    const totalBetAmount = votes.reduce((total, vote) => total + vote.BetAmount, 0);

    if (votes == null || runner == null) {
        return <div>読み込み中...</div>
    }

    return (
        <div className="p-4">

            {/* 投票合計 */}
            <div className='flex justify-between p-6 bg-gray-200 rounded-lg mb-4'>
                <p>投票合計</p>
                <p>{`${totalBetAmount} pt`}</p>
            </div>

            <div>
                <p>単勝</p>
            </div>

            {/* 投票一覧 */}
            {votes.map((vote) => (
                <div key={`${vote.PK}-${vote.SK}`} className="w-full flex gap-8 justify-between py-2 border-b-2 border-gray-300">
                    {/* テキスト */}
                    <div className='w-full flex justify-between items-center'>
                        <div className="flex items-center gap-4 flex-1">
                            <p>{`${vote.RunnerName}`}</p>
                            <p>1.4倍</p>
                        </div>
                        <div>
                            <p className='text-right'>{`${vote.BetAmount} pt`}</p>
                        </div>
                    </div>

                    {/* 変更ボタン */}
                    <div className='w-2/5'>
                        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-tertiary text-white rounded-full">変更</button>
                    </div>
                </div>
            ))}


            {/* ダイアログ */}
            <VoteDialog open={open} onOpenChange={setOpen} runner={runner} raceId={raceId} />
        </div>
    )
}