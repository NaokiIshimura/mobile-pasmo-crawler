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

export default function Card({ history }: Props) {

    const [points, setPoints] = useState<string[]>([]);

    useEffect(() => {
        const filteredDates = history
            .filter(h => h.category === '物販')
            .map(h => h.date)
            .filter(Boolean);
        const uniqueDates = Array.from(new Set(filteredDates));
        setPoints(uniqueDates);
    }, [history]);

    if (history.length === 0) {
        return <></>
    }

    return (
        <div className='w-96 rounded overflow-hidden shadow-lg border border-gray-300 bg-gray-100 rounded-xl'>
            <div className='w-full h-64 flex items-center justify-center'>
                <div>
                    <div className="pb-2 text-[#ED77AC] font-bold">
                        お買い物ポイント
                    </div>
                    <table className="border-0 mb-2">
                        <tbody className="bg-white">
                            {[0, 5, 10].map((startIdx) => (
                                <tr className="w-full" key={startIdx}>
                                    {[...Array(5)].map((_, idx) => (
                                        <td className="w-16 h-16 p-3" key={idx}>
                                            {points[startIdx + idx] && (
                                                <div className="pasmo-point-circle">{points[startIdx + idx]}</div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
