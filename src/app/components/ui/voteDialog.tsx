'use client'

import { useState, useRef } from 'react'
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
    const submittingRef = useRef(false);
    const handleVote = async (betAmount: number) => {
        if (submittingRef.current) return;

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
        submittingRef.current = true;

        const vote = {
            PK: `RACE${raceId}`,
            SK: `${runner?.SK}`,
            RaceId: `RACE${raceId}`,
            BetAmount: betAmount,
            RunnerName: `${runner?.RunnerName}`,
        };

        try {
            const res = await fetch(`/api/race/${raceId}`);
            const race = await res.json();
            if (race.State != "OpenVoting") {
                window.location.reload();
                return;
            }

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
        }
        finally {
            submittingRef.current = false;
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange} >
            <Dialog.Portal>

                <Dialog.Overlay className="fixed inset-0 bg-black/50" />

                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
                    <div className='flex flex-col'>
                        <Dialog.Title className="text-center text-xl font-bold mb-6">投票確認</Dialog.Title>

                        <div className='mb-6'>

                            {/* 出走者情報 */}
                            <div className='flex justify-between'>
                                <p className='text-lg font-semibold'>{`${runner?.RunnerName}`}</p>
                                <p className='text-lg font-semibold'>{odds} 倍</p>
                            </div>

                            {/* 投票ポイント */}
                            <div className='flex justify-between py-4 items-center'>
                                <p className='text-lg'>投票ポイント</p>
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
                                        className='w-24 border-2 border-gray-400 bg-gray-200 text-right text-xl px-2'
                                    />
                                    <p className='text-lg font-semibold'>pt</p>
                                </div>
                            </div>

                            {/* 払い戻しポイント */}
                            <div className='flex justify-between'>
                                <p className='text-lg'>払戻ポイント</p>
                                <p className='text-xl font-semibold'>{payout}pt</p>
                            </div>

                            {/* 収支ポイント */}
                            <div className='flex justify-between'>
                                <p className='text-lg'>収支ポイント</p>
                                <p className={`text-xl font-semibold ${profit >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                                    {profit}pt
                                </p>
                            </div>
                        </div>

                        {/* 投票時エラー */}
                        {error && (
                            <p className="mt-2 text-lg text-red-500">
                                {error}
                            </p>
                        )}

                        {/* ボタン */}
                        <div className='flex flex-col gap-3'>
                            <button
                                onClick={() => {
                                    handleVote(betNumber)
                                }}
                                className="px-4 py-2 bg-tertiary text-white text-xl font-semibold rounded-full"
                            >
                                確定
                            </button>

                            <button
                                onClick={() => onOpenChange(false)}
                                className="px-4 py-2 bg-gray-200 text-xl font-semibold rounded-full"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </Dialog.Content>

            </Dialog.Portal>
        </Dialog.Root >
    )
}