import { AuthAccount } from "./components/AuthAccount";
import { DataLinkage } from "./components/DateLinkage";
import { History } from "./components/History"

export default function Account({ id }) {
    return (
        <div className="px-10">

            <div className="border-b border-[#ED77AC]">
                <p className='my-3 text-lg font-bold text-[#ED77AC]'>id: {id}</p>
            </div>

            <div className="py-5">
                <AuthAccount id={id} />
            </div>

            <div className="py-5">
                <DataLinkage id={id} />
            </div>

            <div className="py-5">
                <History id={id} />
            </div>

        </div >
    );
} 
