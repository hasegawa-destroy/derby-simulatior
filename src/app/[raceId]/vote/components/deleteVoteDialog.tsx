'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Vote } from '@/types/vote'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    vote: Vote | null
    canDelete: boolean
    refreshUser: () => Promise<void>
    fetchOdds: () => Promise<void>
    fetchVotes: () => Promise<void>
}

export function DeleteVoteDialog({ open, onOpenChange, vote, refreshUser, fetchOdds, fetchVotes, canDelete }: Props) {

    // 投票
    const handleDeleteVote = async () => {
        if (!canDelete) {
            onOpenChange(false);
            return;
        }

        await fetch("/api/vote", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(vote),
        });

        await refreshUser();
        await fetchOdds();
        await fetchVotes();

        onOpenChange(false)
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange} >
            <Dialog.Portal>

                <Dialog.Overlay className="fixed inset-0 bg-black/50" />

                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
                    <div className='flex flex-col'>
                        <Dialog.Title className="font-bold">投票を取り消しますか?</Dialog.Title>

                        <div className='mb-4'>

                            {/* 投票情報 */}
                            <div className='flex justify-between'>
                                <p>{`${vote?.RunnerName}`}</p>
                            </div>

                            <div className='flex justify-between'>
                                <p>{`${vote?.BetAmount}`}</p>
                            </div>
                        </div>

                        {/* ボタン */}
                        <div className='flex flex-col gap-2'>
                            <button
                                onClick={() => {
                                    handleDeleteVote()
                                }}
                                className="px-4 py-2 bg-tertiary text-white rounded-full"
                            >
                                投票取消
                            </button>

                            <button
                                onClick={() => onOpenChange(false)}
                                className="px-4 py-2 bg-gray-200 rounded-full"
                            >
                                キャンセル
                            </button>
                        </div>
                    </div>
                </Dialog.Content>

            </Dialog.Portal>
        </Dialog.Root>
    )
}