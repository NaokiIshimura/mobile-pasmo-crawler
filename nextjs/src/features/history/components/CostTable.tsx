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

    console.log(history.reverse())

    const [arr, setArr] = useState([]);

    useEffect(() => {
        let fareArr = [];
        history.map(h => {
            if (h.category === '運賃') {
                fareArr.push({ date: h.date, transportation: '電車', route: { from: h.detail.in, to: h.detail.out }, value: h.value });
            }
        });
        console.log(fareArr);

        let costArr = [];
        let skipArr = [];
        for (let i = 0; i < fareArr.length; i++) {
            if (skipArr.includes(i)) {
                continue;
            }
            let round = '片道'
            for (let j = i + 1; j < fareArr.length; j++) {
                if (fareArr[i].date === fareArr[j].date && fareArr[i].route.from === fareArr[j].route.to && fareArr[i].route.to === fareArr[j].route.from) {
                    round = '往復'
                    skipArr.push(j)
                    break;
                }
            }
            if (round === '往復') {
                costArr.push({ date: fareArr[i].date, transportation: '電車', route: { from: fareArr[i].route.from, to: fareArr[i].route.to }, round: '往復', value: fareArr[i].value * 2 });
            } else {
                costArr.push({ date: fareArr[i].date, transportation: '電車', route: { from: fareArr[i].route.from, to: fareArr[i].route.to }, round: '片道', value: fareArr[i].value });
            }
        }
        setArr(costArr);
    }, []);

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
                                <td>{a.value * -1}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}
