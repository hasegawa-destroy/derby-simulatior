import { useState, useEffect } from 'react'
import { Vote } from '@/types/vote';
import { Runner } from '@/types/runner';
import { DeleteVoteDialog } from './deleteVoteDialog';

type Props = {
    raceId: string
    refreshUser: () => Promise<void>
    fetchOdds: () => Promise<void>
}

export function CheckContent({ raceId, refreshUser, fetchOdds }: Props) {
    const [open, setOpen] = useState(false)
    const [vote, setVote] = useState<Vote | null>(null)

    // 投票取得
    const [votes, setVotes] = useState<Vote[]>([])
    const fetchVotes = async () => {
        fetch(
            `/api/vote?raceId=${raceId}&runnerId=001`
        )
            .then((res) => res.json())
            .then(setVotes);
    };

    useEffect(() => {
        fetchVotes();
    }, []);

    // 走者取得
    const [runner, setRunner] = useState<Runner | null>(null)
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
                            <p>{runner?.Odds ?? 1.1} 倍</p>
                        </div>
                        <div>
                            <p className='text-right'>{`${vote.BetAmount} pt`}</p>
                        </div>
                    </div>

                    {/* 取消ボタン */}
                    <div className='w-2/5 grid justify-items-end'>
                        <button
                            onClick={() => {
                                setOpen(true);
                                setVote(vote);
                            }}
                            className="px-4 py-2 bg-[#DC2626] text-white rounded-full">取消</button>
                    </div>
                </div>
            ))
            }


            {/* ダイアログ */}
            <DeleteVoteDialog
                open={open}
                onOpenChange={setOpen}
                vote={vote}
                refreshUser={refreshUser}
                fetchOdds={fetchOdds}
                fetchVotes={fetchVotes}
            />
        </div >
    )
}