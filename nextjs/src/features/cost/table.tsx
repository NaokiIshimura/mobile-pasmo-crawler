import { useState, useEffect } from 'react';

type Props = {
    history: HistoryItem[];
}

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

export default function Table({ history }: Props) {

    interface CostData {
        date: string;
        transportation: string;
        route: { from: string; to: string };
        round: string;
        value: number;
    }

    const [arr, setArr] = useState<CostData[]>([]);

    useEffect(() => {
        if (!history) return

        interface HistoryItem {
            date: string;
            category: string;
            detail: { in: string; out: string };
            value: number;
        }

        interface FareData {
            date: string;
            transportation: string;
            route: { from: string; to: string };
            value: number;
        }

        // 運賃データを抽出する
        const fareArr: FareData[] = history
            .filter((h: HistoryItem) => h.category === '運賃')
            .map((h: HistoryItem) => ({
                date: h.date,
                transportation: '電車',
                route: { from: h.detail.in, to: h.detail.out },
                value: h.value
            }));

        // 往復切符の処理を行う
        const costArr: CostData[] = [];
        const processedIndexes: { [key: number]: boolean } = {}; // 処理済みのインデックスを格納するオブジェクト

        for (let i = 0; i < fareArr.length; i++) {
            if (processedIndexes[i]) {
                continue; // すでに処理されたインデックスはスキップ
            }

            let round: string = '片道';
            for (let j = i + 1; j < fareArr.length; j++) {
                const isRoundTrip: boolean =
                    fareArr[i].date === fareArr[j].date &&
                    fareArr[i].route.from === fareArr[j].route.to &&
                    fareArr[i].route.to === fareArr[j].route.from;

                if (isRoundTrip) {
                    round = '往復';
                    processedIndexes[j] = true; // 処理済みインデックスをマークして重複を防ぐ
                    break;
                }
            }

            const cost: CostData = {
                date: fareArr[i].date,
                transportation: '電車',
                route: { from: fareArr[i].route.from, to: fareArr[i].route.to },
                round: round,
                value: round === '往復' ? fareArr[i].value * 2 : fareArr[i].value
            };
            costArr.push(cost);
        }
        // stateに保存する
        setArr(costArr);
    }, [history]);

    if (!history || history.length === 0 || arr.length === 0) {
        return <></>
    }

    return (
        <table className='w-full text-center'>
            <thead>
                <tr>
                    <th>日付</th>
                    <th>交通機関</th>
                    <th>経路</th>
                    <th>片道/往復</th>
                    <th>金額</th>
                </tr>
            </thead>
            <tbody>
                {
                    arr.map((a, idx) => {
                        return (
                            <tr key={idx}>
                                <td>{a.date}</td>
                                <td>{a.transportation}</td>
                                <td>{a.route.from}〜{a.route.to}</td>
                                <td>{a.round}</td>
                                <td>¥{(a.value * -1).toLocaleString()}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}
