"use client"

import User from '@/components/user'
import Update from "@/features/update";
import Cost from "@/features/cost"

export default function Page() {

    const id = 'testuser';

    return (
        <div className="px-10">
            <User id={id} />
            <div>
                <div className="py-5">
                    <Update id={id} />
                </div>

                <div className="py-5">
                    <Cost id={id} />
                </div>
            </div>
        </div>
    );
}
