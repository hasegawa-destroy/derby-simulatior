import { useRouter } from "next/navigation";

type Race = {
    id: number
    name: string
    startTime: string
}

export function RaceCard({ race }: { race: Race }) {
    const router = useRouter();

    // 投票ページボタン押下処理
    const handleClick = () => {
        router.push("/vote");
    };

    return (
        <div className="flex border rounded-lg p-8 bg-white transition">
            <h2 className="text-lg font-semibold mb-2">{race.name}</h2>
            <div className="">
                <p className="text-sm text-gray-600">開始 {race.startTime}</p>
                <p className="text-sm text-gray-600">締切 6分</p>
            </div>
            <div className="border">
                <button onClick={handleClick}>投票</button>
            </div>
        </div>
    )
}