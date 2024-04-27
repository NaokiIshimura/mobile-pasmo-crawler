import { useState, useEffect } from 'react';
import { docClient, moderatorTableName } from "@/clients/dymamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { TailSpin } from 'react-loader-spinner';

type Props = {
    id: string;
}

export const History = ({ id }: Props) => {

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
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setIsLoading(false);
    }

    return (
        <div className="pasmo-block">
            <div className="pasmo-header flex justify-between">
                <span>履歴</span>
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
                        <table className='w-full'>
                            <thead>
                                <tr>
                                    <th>日付</th>
                                    <th>分類</th>
                                    <th>金額</th>
                                    <th>詳細</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    history.map((h, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td>{h.date}</td>
                                                <td>{h.category}</td>
                                                <td>{h.value}</td>
                                                <td>{h.detail ? `${h.detail.in} → ${h.detail.out}` : ''}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </div >

    )
}
