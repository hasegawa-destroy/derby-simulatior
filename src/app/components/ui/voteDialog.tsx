'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Runner } from '@/types/runner'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    runner: Runner | null
    raceId: string
}

export function VoteDialog({ open, onOpenChange, runner, raceId }: Props) {
    const [bet, setBet] = useState('')

    const odds = runner?.Odds ?? 1

    // 数値変換（空文字対策）
    const betNumber = Number(bet) || 0

    const payout = Math.floor(betNumber * odds)
    const profit = payout - betNumber

    // 投票
    const handleVote = async (betAmount: number) => {
        const vote = {
            PK: `RACE${raceId}`,
            SK: `${runner?.SK}`,
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

                            {/* 賭けポイント */}
                            <div className='flex justify-between py-4 items-center'>
                                <p>賭けポイント</p>
                                <div className='flex gap-2'>
                                    <input
                                        value={bet}
                                        onChange={(e) => {
                                            const v = e.target.value
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

                        {/* ボタン */}
                        <div className='flex flex-col gap-2'>
                            <button
                                onClick={() => {
                                    handleVote(betNumber)
                                    onOpenChange(false)
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