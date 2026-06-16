'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Runner } from '@/types/runner'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    runner: Runner | null
    odds: number
    raceId: string
    point: number
    canVote: boolean
    refreshUser: () => Promise<void>
    fetchOdds: () => Promise<void>
}

export function VoteDialog({ open, onOpenChange, runner, odds, raceId, point, canVote, refreshUser, fetchOdds }: Props) {
    const [bet, setBet] = useState('')
    const [error, setError] = useState("");

    // 数値変換（空文字対策）
    const betNumber = Number(bet) || 0

    const payout = Math.floor(betNumber * odds)
    const profit = payout - betNumber

    // 投票
    const handleVote = async (betAmount: number) => {
        if (!canVote) {
            onOpenChange(false);
            return;
        }

        if (betAmount <= 0) {
            setError("投票ポイントを入力してください");
            return;
        }

        if (betAmount > point) {
            setError("所持ポイントが不足しています");
            return;
        }

        setError("");

        const vote = {
            PK: `RACE${raceId}`,
            SK: `${runner?.SK}`,
            RaceId: `RACE${raceId}`,
            BetAmount: betAmount,
            RunnerName: `${runner?.RunnerName}`,
        };

        await fetch("/api/vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(vote),
        });

        onOpenChange(false);
        await refreshUser();
        await fetchOdds();
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange} >
            <Dialog.Portal>

                <Dialog.Overlay className="fixed inset-0 bg-black/50" />

                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
                    <div className='flex flex-col'>
                        <Dialog.Title className="font-bold">単勝 オッズ</Dialog.Title>

                        <div className='mb-4'>

                            {/* 出走者情報 */}
                            <div className='flex justify-between'>
                                <p>{`${runner?.RunnerName}`}</p>
                                <p>{odds} 倍</p>
                            </div>

                            {/* 投票ポイント */}
                            <div className='flex justify-between py-4 items-center'>
                                <p>投票ポイント</p>
                                <div className='flex gap-2'>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={bet}
                                        onChange={(e) => {
                                            const v = e.target.value.replace(/[^0-9]/g, "");
                                            if (/^\d*$/.test(v)) {
                                                setBet(v)
                                            }
                                        }}
                                        className='w-24 border-2 border-gray-400 bg-gray-200 text-right px-2'
                                    />
                                    <p>pt</p>
                                </div>
                            </div>

                            {/* 払い戻しポイント */}
                            <div className='flex justify-between'>
                                <p>払戻ポイント</p>
                                <p>{payout}pt</p>
                            </div>

                            {/* 収支ポイント */}
                            <div className='flex justify-between'>
                                <p>収支ポイント</p>
                                <p className={profit >= 0 ? 'text-blue-500' : 'text-red-500'}>
                                    {profit}pt
                                </p>
                            </div>
                        </div>

                        {/* 投票時エラー */}
                        {error && (
                            <p className="mt-2 text-sm text-red-500">
                                {error}
                            </p>
                        )}

                        {/* ボタン */}
                        <div className='flex flex-col gap-2'>
                            <button
                                onClick={() => {
                                    handleVote(betNumber)
                                }}
                                className="px-4 py-2 bg-tertiary text-white rounded-full"
                            >
                                確定
                            </button>

                            <button
                                onClick={() => onOpenChange(false)}
                                className="px-4 py-2 bg-gray-200 rounded-full"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </Dialog.Content>

            </Dialog.Portal>
        </Dialog.Root>
    )
}