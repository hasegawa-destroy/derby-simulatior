"use client";

import { useState } from 'react'
import { VoteContent } from './components/vote';
import { CheckContent } from './components/check';
import { VoteDialog } from "../components/ui/voteDialog";

export default function VotePage() {

    const race = { id: 1, name: "CL筋力杯", startTime: "14:50" }
    const todayState = { date: "2026年1月23日", weather: "曇" }
    const runners = [
        { name: "出走者1", odds: 1.4 },
        { name: "出走者2", odds: 2.3 },
        { name: "出走者3", odds: 2.8 },
        { name: "出走者4", odds: 3.7 },
    ]

    const [open, setOpen] = useState(false)

    const [tab, setTab] = useState<'list' | 'vote' | 'check'>('list')
    const tabClass = (name: string) =>
        `flex-1 flex items-center justify-center transition-colors ${tab === name
            ? 'bg-gray-600'
            : 'bg-primary'
        }`


    return (
        <div className="mx-full">

            {/* レース情報 */}
            <div className="p-4">
                <p className="text-2xl font-bold mb-6">{race.name}</p>

                <div className="flex gap-2">
                    <p>開始 {race.startTime}</p>
                    <p>締切 {race.startTime}</p>
                    <p>投票締切</p>
                </div>

                <div className="flex gap-2">
                    <p>{todayState.date}</p>
                    <p>{todayState.weather}</p>
                </div>
            </div>

            {/* コンテンツリスト */}
            <div className="flex h-18 bg-primary">
                <button
                    onClick={() => setTab('list')}
                    className={tabClass('list')}
                >
                    <p className="text-white">出走表</p>
                </button>

                <button
                    onClick={() => setTab('vote')}
                    className={tabClass('vote')}
                >
                    <p className="text-white">投票</p>
                </button>

                <button
                    onClick={() => setTab('check')}
                    className={tabClass('check')}
                >
                    <p className="text-white">照会</p>
                </button>
            </div>

            {/* コンテンツ */}
            <div className="p-4">
                {tab === 'list' && (
                    <div>
                        <p>出走表</p>
                    </div>
                )}

                {tab === 'vote' && (
                    <VoteContent
                        runners={runners}
                        setOpen={setOpen}
                    />
                )}

                {tab === 'check' && (
                    <div>
                        <CheckContent />
                    </div>
                )}
            </div>

            {/* ダイアログ */}
            <VoteDialog open={open} onOpenChange={setOpen} />

        </div>
    )
}