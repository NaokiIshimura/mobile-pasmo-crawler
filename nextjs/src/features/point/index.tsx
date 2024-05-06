import { useState, useEffect } from 'react';
import getHistory from '@/repositories/getHistory';
import useGetHistories from '@/api/getHistories';
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

    // DynamoDBから直接Itemを取得する場合、以下をコメントアウト
    // const [isLoading, setIsLoading] = useState<boolean>(false);

    // useEffect(() => {
    //     (async () => {
    //         await reload();
    //     })()
    // }, []);

    // const reload = async () => {
    //     setIsLoading(true);
    //     const history = await getHistory(id) as HistoryItem[];
    //     setHistory(history);
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
    //     setIsLoading(false);
    // }

    // APIサーバからItemを取得する場合、以下をコメントアウト
    const { data, isLoading, refetch } = useGetHistories(id, 'card1');

    useEffect(() => {
        setHistory(data);
    }, [data]);

    const reload = async () => {
        refetch()
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
