import { AuthAccount } from "./components/AuthAccount";
import { AuthImage } from "./components/AuthImage"
import { DataLinkage } from "./components/DateLinkage";
import { History } from "./components/History"

export default function Account({ id }) {
    return (
        <div className="px-5">

            <p className='text-lg font-bold my-3'>id: {id}</p>

            <hr className="my-10" />

            <div className="px-5">
                <AuthAccount id={id} />

                <hr className='my-20' />

                <DataLinkage id={id} />

                <hr className='my-20' />

                <AuthImage id={id} />

                <hr className='my-20' />

                <History id={id} />
            </div>

        </div >
    );
} 
