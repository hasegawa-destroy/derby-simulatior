"use client";

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { formatInTimeZone } from "date-fns-tz";
import { VoteContent } from './components/vote';
import { CheckContent } from './components/check';
import { VoteDialog } from "../../components/ui/voteDialog";
import { Runner } from '@/types/runner';

export default function VotePage() {

    const params = useParams();
    const raceId = params.raceId as string;

    const [data, setData] = useState<any>(null);

    // レース情報取得
    useEffect(() => {
        async function fetchRace() {
            const res = await fetch(`/api/race/${raceId}`);
            const json = await res.json();

            setData(json);
        }

        fetchRace();
    }, []);

    // レース日の情報
    const todayState = { date: "2026年1月23日", weather: "曇" }

    const [open, setOpen] = useState(false)
    const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);

    const [tab, setTab] = useState<'list' | 'vote' | 'check'>('list')
    const tabClass = (name: string) =>
        `flex-1 flex items-center justify-center transition-colors ${tab === name
            ? 'bg-gray-600'
            : 'bg-primary'
        }`

    if (!data) {
        return <div>レース情報読み込み中...</div>;
    }

    // フォーマット変更
    const formattedStartTime = formatInTimeZone(
        data.StartTime,
        "Asia/Tokyo",
        "HH時mm分"
    );

    return (
        <div className="mx-full">

            {/* ポイント残高 */}
            <div className='bg-[#3E3F43] px-4 py-6 border-t-2 border-gray-500'>
                <div className='flex justify-between items-center'>
                    <p className='text-secondary'>ポイント残高</p>
                    <p className='text-secondary'>100 pt</p>
                </div>
            </div>

            {/* レース情報 */}
            <div className="p-4">
                <p className="text-2xl font-bold mb-6">{data.RaceName}</p>

                <div className="flex gap-2">
                    <p className='text-sm'>開始 {formattedStartTime}</p>
                    <p className='text-sm'>締切 {formattedStartTime}</p>
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
                {/* 出走表 */}
                {tab === 'list' && (
                    <div>
                        <p>出走表</p>
                    </div>
                )}

                {/* 投票 */}
                {tab === 'vote' && (
                    <VoteContent
                        runners={data.runners}
                        setOpen={setOpen}
                        setSelectedRunner={setSelectedRunner}
                    />
                )}

                {/* 照会 */}
                {tab === 'check' && (
                    <div>
                        <CheckContent />
                    </div>
                )}
            </div>

            {/* ダイアログ */}
            <VoteDialog open={open} onOpenChange={setOpen} runner={selectedRunner} />

        </div>
    )
}