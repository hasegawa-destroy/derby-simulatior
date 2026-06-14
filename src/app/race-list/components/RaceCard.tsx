import { Race } from "@/types/race";
import { useRouter } from "next/navigation";

export function RaceCard({ race }: { race: Race }) {
    const router = useRouter();

    // 投票ページボタン押下処理
    const handleClick = () => {
        const raceId = race.PK.split("#")[1];
        router.push(`/${raceId}/vote`);
    };

    if (race.State == "Hide") {
        return <></>
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
    const stateInfo = getStateInfo(race.State);

    return (
        <div className="flex justify-between items-center rounded-lg w-full p-8 bg-white transition">
            <div className="flex flex-col items-start">
                <p className="text-lg text-left font-semibold">{race.RaceName}</p>
                <p className={`text-sm text-left ${stateInfo.className}`}>{stateInfo.label}</p>
            </div>

            {/* 投票ボタン */}
            <div className="flex h-full items-center">
                <button className="bg-tertiary rounded-full px-8 py-3 text-white font-semibold" onClick={handleClick}>投票</button>
            </div>
        </div >
    )
}