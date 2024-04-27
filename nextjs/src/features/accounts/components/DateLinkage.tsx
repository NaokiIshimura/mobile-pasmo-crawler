import { InvokeCommand } from "@aws-sdk/client-lambda";
import { client, crawlerFunctionName } from "@/clients/lambda";
import { AuthImage } from "./AuthImage"

type Props = {
    id: string;
}

export const DataLinkage = ({ id }: Props) => {

    const invoke = async () => {
        // console.log('invoke');
        const command = new InvokeCommand({
            FunctionName: crawlerFunctionName,
            InvocationType: 'Event'
        });
        await client.send(command);
    }

    return (
        <div className="pasmo-block">
            <div className="pasmo-header flex justify-between">
                <span>データ連携</span>
                <input className="pasmo-button-small" type="submit" value="更新" onClick={invoke} />
            </div>
            <div className="pasmo-body">
                <AuthImage id={id} />
            </div>
        </div>
    )
}
