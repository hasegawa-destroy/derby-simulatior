import { useState } from 'react'
import { VoteDialog } from "@/app/components/ui/voteDialog";

export function CheckContent() {
    const [open, setOpen] = useState(false)

    return (
        <div className="p-4">

            {/* 投票合計 */}
            <div className='flex justify-between p-6 bg-gray-200 rounded-lg mb-4'>
                <p>投票合計</p>
                <p>100pt</p>
            </div>

            <div>
                <p>単勝</p>
            </div>

            <div className="flex justify-between py-2 border-b-2 border-gray-300">
                <div className='flex items-center justify-center gap-4'>
                    <p>出走者1</p>
                    <p>1.4</p>
                    <p>100pt</p>
                </div>
                <button onClick={() => setOpen(true)} className="px-4 py-2 bg-tertiary text-white rounded-full">変更</button>
            </div>


            {/* ダイアログ */}
            <VoteDialog open={open} onOpenChange={setOpen} />
        </div>
    )
}