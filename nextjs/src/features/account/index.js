import { AuthAccount } from "./components/AuthAccount";

export default function Account({ id }) {
    return (
        <div className="py-5">
            <AuthAccount id={id} />
        </div>
    );
} 
