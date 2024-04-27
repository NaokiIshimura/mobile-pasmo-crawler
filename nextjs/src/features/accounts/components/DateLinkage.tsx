import { InvokeCommand } from "@aws-sdk/client-lambda";
import { client, crawlerFunctionName } from "@/clients/lambda";

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
        <div>
            <p className='inline-block mr-3 text-lg font-bold my-3'>2. データ連携</p>
            <input className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded" type="submit" value="更新" onClick={invoke} />
        </div>

    )
}
