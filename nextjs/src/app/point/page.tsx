"use client"

import User from '@/components/user'
import DataLinkage from "@/features/dataLinkage";
import Point from "@/features/point"

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
                    <Point id={id} />
                </div>
            </div>
        </div>
    );
}
