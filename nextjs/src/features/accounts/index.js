import { AuthAccount } from "./components/AuthAccount";
import { DataLinkage } from "./components/DateLinkage";
import { History } from "./components/History"

export default function Account({ id }) {
    return (
        <div className="px-5">

            <div className="border-b border-[#ED77AC]">
                <p className='my-3 text-lg font-bold text-[#ED77AC]'>id: {id}</p>
            </div>

            <div className="p-5">
                <AuthAccount id={id} />
            </div>

            <div className="p-5">
                <DataLinkage id={id} />
            </div>

            <div className="p-5">
                <History id={id} />
            </div>

        </div >
    );
} 
