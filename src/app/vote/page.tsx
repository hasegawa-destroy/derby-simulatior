"use client";

export default function VotePage() {

    const race = { id: 1, name: "CL筋力杯", startTime: "14:50" }
    const todayState = { date: "2026年1月23日", weather: "曇" }
    const runners = [
        { name: "出走者1", odds: 1.4 },
        { name: "出走者2", odds: 2.3 },
        { name: "出走者3", odds: 2.8 },
        { name: "出走者4", odds: 3.7 },
    ]


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
                <div className="flex-1 flex flex-col items-center justify-center">
                    <p className="text-center text-white">出走表</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                    <p className="text-center text-white">投票</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                    <p className="text-center text-white">照会</p>
                </div>
            </div>

            {/* コンテンツ */}
            <div className="p-4">
                <div>
                    <p>単勝</p>

                    <div className="flex items-center justify-center py-2 border-b-2">
                        <p>人気順</p>
                    </div>

                    <div>
                        {runners.map((runner, index) => (
                            <div key={runner.name} className="flex justify-between px-2 py-4 border-b-2 border-gray-300">
                                <div className="flex gap-4">
                                    <p>{index + 1}</p>
                                    <p>{runner.name}</p>
                                </div>
                                <div>
                                    <p>{runner.odds}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}