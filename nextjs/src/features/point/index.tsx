import { useState, useEffect } from 'react';
import { docClient, moderatorTableName } from "@/clients/dymamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { TailSpin } from 'react-loader-spinner';
import Card from './card';

type Props = {
    id: string;
}

export default function History({ id }: Props) {

    type HistoryItem = {
        id: string;
        dataType: string;
        date: string;
        category: string;
        value: number;
        detail: {
            in: string;
            out: string;
        };
    }

    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            await reload();
        })()
    }, []);

    const getHistory = async (id: string) => {
        const command = new QueryCommand({
            TableName: moderatorTableName,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': id,
            },
        });

        const { Items } = await docClient.send(command);
        // console.log(Items);
        return Items;
    }

    const reload = async () => {
        setIsLoading(true);
        const history = await getHistory(id) as HistoryItem[];
        setHistory(history);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
    }

    return (
        <div className="pasmo-block">
            <div className="pasmo-header flex justify-between">
                <span>ポイントカード</span>
                <input className="pasmo-button-small" type="submit" value="更新" onClick={reload} />
            </div>
            <div className="pasmo-body">
                <div className='my-3'>
                    {isLoading ?
                        <TailSpin
                            visible={true}
                            height="40"
                            width="40"
                            color="#ED77AC"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass="flex justify-center"
                        />
                        :
                        <Card history={history} />
                    }
                </div>
            </div>
        </div >

    )
}
