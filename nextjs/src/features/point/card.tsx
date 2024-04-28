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
        const tmp = history.map(h => { if (h.category === '物販') return h.date }).filter(v => v);
        setPoints(Array.from(new Set(tmp)));
    }, []);

    console.log(points)

    return (
        <div className='m-5 w-96 rounded overflow-hidden shadow-lg border border-gray-300 bg-gray-100 rounded-xl'>
            <div className='w-full h-64 flex items-center justify-center'>
                <div>
                    <div className="pb-2 text-[#ED77AC] font-bold">
                        お買い物ポイント
                    </div>
                    <table className="border-0 mb-2">
                        <tbody className="bg-white">
                            <tr className="w-full">
                                {[...Array(5)].map((_, idx) =>
                                    points[idx] ?
                                        <td className="w-16 h-16 p-3">
                                            <div className="border border-2 border-[#ED77AC] rounded-full w-10 h-10 flex items-center justify-center text-[#ED77AC] text-xs">{points[idx]}</div>
                                        </td>
                                        :
                                        <td className="w-16 h-16 p-3"></td>
                                )}
                            </tr>
                            <tr className="w-full">
                                {[...Array(5)].map((_, idx) =>
                                    points[idx + 5] ?
                                        <td className="w-16 h-16 p-3">
                                            <div className="border border-2 border-[#ED77AC] rounded-full w-10 h-10 flex items-center justify-center text-[#ED77AC] text-xs">{points[idx + 5]}</div>
                                        </td>
                                        :
                                        <td className="w-16 h-16 p-3"></td>
                                )}
                            </tr>
                            <tr className="w-full">
                                {[...Array(5)].map((_, idx) =>
                                    points[idx + 10] ?
                                        <td className="w-16 h-16 p-3">
                                            <div className="border border-2 border-[#ED77AC] rounded-full w-10 h-10 flex items-center justify-center text-[#ED77AC] text-xs">{points[idx + 10]}</div>
                                        </td>
                                        :
                                        <td className="w-16 h-16 p-3"></td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
