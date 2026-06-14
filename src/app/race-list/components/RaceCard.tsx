import { Race } from "@/types/race";
import { formatInTimeZone } from "date-fns-tz";
import { useRouter } from "next/navigation";

export function RaceCard({ race }: { race: Race }) {
    const router = useRouter();

    // 投票ページボタン押下処理
    const handleClick = () => {
        const raceId = race.PK.split("#")[1];
        router.push(`/${raceId}/vote`);
    };

    // フォーマット変更
    const formattedStartTime = formatInTimeZone(
        race.StartTime,
        "Asia/Tokyo",
        "HH時mm分"
    );


    if (race.State == "Hide") {
        return <></>
    }

    return (
        <div className="flex rounded-lg w-full h-32 p-2 bg-white transition">
            <div className="flex flex-col items-center justify-center w-3/5 h-full">
                <p className="text-lg font-semibold mb-2">{race.RaceName}</p>
                <div>
                    <p className="text-sm">開始 {formattedStartTime}</p>
                    <p className="text-sm">締切 6分</p>
                </div>
            </div>

            {/* 投票ボタン */}
            <div className="flex w-2/5 h-full items-center justify-center">
                <button className="bg-tertiary rounded-full px-8 py-3 text-white font-semibold" onClick={handleClick}>投票</button>
            </div>
        </div>
    )
}