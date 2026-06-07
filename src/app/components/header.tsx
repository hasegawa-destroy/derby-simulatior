"use client";

import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    // ロゴ押下処理
    const handleClick = () => {
        router.push(`/race-list`);
    }

    return (
        <header className="bg-primary p-4">
            <button className="flex flex-col" onClick={handleClick}>
                <p className="text-secondary text-2xl font-bold">WIN</p>
                <p className="text-secondary text-sm">DerbySimulatior</p>
            </button>
        </header>
    );
}