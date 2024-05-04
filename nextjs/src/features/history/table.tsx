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
    return (
        <table className='w-full text-center'>
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
                                <td>¥{(h.value > 0 ? h.value : h.value * -1).toLocaleString()}</td>
                                <td>{h.detail ? `${h.detail.in} → ${h.detail.out}` : ''}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}
