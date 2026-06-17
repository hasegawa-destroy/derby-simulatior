"use client";

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { VoteContent } from './components/vote';
import { CheckContent } from './components/check';
import { User } from '@/types/user';
import { RunnerListContent } from './components/runnerList';

export default function VotePage() {

    const params = useParams();
    const raceId = params.raceId as string;

    const [user, setUser] = useState<User | null>(null);
    const [data, setData] = useState<any>(null);
    const [odds, setOdds] = useState<{ runnerId: string; odds: number }[]>([]);

    // TODO: 遷移のたびに叩かない
    // ユーザー情報取得
    const fetchUser = async () => {
        const res = await fetch("/api/user");
        const json = await res.json();
        setUser(json);
    };

    // レース情報取得
    async function fetchRace() {
        const res = await fetch(`/api/race/${raceId}`);
        const json = await res.json();

        setData(json);
    }

    // オッズ取得
    const fetchOdds = async () => {
        if (raceId == null || raceId == "") return;

        const res = await fetch(`/api/odds?raceId=${raceId}`);
        const json = await res.json();
        setOdds(json);
    }

    useEffect(() => {
        fetchUser();
        fetchRace();
        fetchOdds();
    }, []);

    // レース日の情報
    const todayState = { date: "2026年6月18日", weather: "曇" }

    const [tab, setTab] = useState<'list' | 'vote' | 'check'>('list')
    const tabClass = (name: string) =>
        `flex-1 flex items-center justify-center transition-colors ${tab === name
            ? 'bg-gray-600'
            : 'bg-primary'
        }`

    if (!data) {
        return <div>レース情報読み込み中...</div>;
    }

    // レース状態文言変換
    const getStateInfo = (state: string) => {
        switch (state) {
            case "OpenVoting":
                return {
                    label: "投票受付中",
                    className: "text-green-600",
                };
            case "CloseVoting":
                return {
                    label: "投票終了",
                    className: "text-red-600",
                };
            case "PaidOut":
                return {
                    label: "終了",
                    className: "text-gray-500",
                };
            default:
                return {
                    label: state,
                    className: "text-gray-500",
                };
        }
    };
    const stateInfo = getStateInfo(data.State);

    return (
        <div className="mx-full">

            {/* ポイント残高 */}
            <div className='bg-[#3E3F43] px-8 py-4 border-t-2 border-gray-500'>
                <div className='flex justify-between items-center'>
                    <p className='text-secondary text-lg'>ポイント残高</p>
                    <p className='text-secondary text-xl'>{Math.floor(user?.Point ?? 0)} pt</p>
                </div>
            </div>

            {/* レース情報 */}
            <div className="px-8 py-4">
                <p className="text-3xl font-bold mb-2">{data.RaceName}</p>

                <div className="flex gap-4">
                    <p className='text-lg'>{todayState.date}</p>
                    <p className='text-lg'>{todayState.weather}</p>
                </div>

                <div className="flex">
                    <p className={`className='text-lg' text-left ${stateInfo.className}`}>{stateInfo.label}</p>
                </div>
            </div>

            {/* コンテンツリスト */}
            <div className="flex h-18 bg-primary">
                <button
                    onClick={() => setTab('list')}
                    className={tabClass('list')}
                >
                    <p className="text-secondary text-lg font-semibold">出走表</p>
                </button>

                <button
                    onClick={() => setTab('vote')}
                    className={tabClass('vote')}
                >
                    <p className="text-secondary text-lg font-semibold">投票</p>
                </button>

                <button
                    onClick={() => setTab('check')}
                    className={tabClass('check')}
                >
                    <p className="text-secondary text-lg font-semibold">照会</p>
                </button>
            </div>

            {/* コンテンツ */}
            <div className="p-4">
                {/* 出走表 */}
                {tab === 'list' && (
                    <RunnerListContent runners={data.runners} />
                )}

                {/* 投票 */}
                {tab === 'vote' && (
                    <VoteContent
                        runners={data.runners}
                        odds={odds}
                        point={user?.Point ?? 0}
                        raceState={data.State}
                        refreshUser={fetchUser}
                        fetchOdds={fetchOdds}
                    />
                )}

                {/* 照会 */}
                {tab === 'check' && (
                    <div>
                        <CheckContent
                            raceId={raceId}
                            odds={odds}
                            raceState={data.State}
                            refreshUser={fetchUser}
                            fetchOdds={fetchOdds}
                        />
                    </div>
                )}
            </div>

        </div>
    )
}