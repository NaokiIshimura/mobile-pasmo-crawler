"use client"

import User from '@/components/user'
import DataLinkage from "@/features/dataLinkage";
import History from "@/features/history"

export default function Page() {

    const id = 'testuser';

    return (
        <div className="px-10">
            <User id={id} />
            <div>
                <div className="py-5">
                    <DataLinkage id={id} />
                </div>

                <div className="py-5">
                    <History id={id} />
                </div>
            </div>
        </div>
    );
}
