import { DataLinkage } from "./components/DateLinkage";
import { History } from "./components/History"

export default function Account({ id }) {
    return (
        <div>
            <div className="py-5">
                <DataLinkage id={id} />
            </div>

            <div className="py-5">
                <History id={id} />
            </div>
        </div>
    );
} 
