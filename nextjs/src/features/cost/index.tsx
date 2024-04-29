import { useState, useEffect } from 'react';
import getHistory from '@/repositories/getHistory';
import { TailSpin } from 'react-loader-spinner';
import Table from './table';

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
                <span>交通費</span>
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
                        <Table history={history} />
                    }
                </div>
            </div>
        </div >

    )
}
