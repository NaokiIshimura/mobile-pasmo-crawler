import { useState, useEffect } from 'react';
import { docClient, tableName } from "@/clients/dymamodb";
import moment from 'moment';

import { GetCommand } from "@aws-sdk/lib-dynamodb";


export const Source = ({ id }) => {

    const [source, setSource] = useState({});

    useEffect(() => {
        (async () => {
            await reload();
        })()
    }, []);

    const getSource = async (id) => {
        const command = new GetCommand({
            TableName: tableName,
            Key: {
                id: id,
                dataType: 'source'
            },
        });

        const { Item } = await docClient.send(command);
        // console.log(Item);
        return { html: Item?.html, timestamp: Item?.timestamp }
    }

    const reload = async () => {
        const source = await getSource(id);
        setSource(source);
    }

    return (
        <div>
            <p className='inline-block mr-3 text-lg font-bold my-3'>4. 取得データ</p>
            <input className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded" type="submit" value="更新" onClick={reload} />

            <div className='my-3'>
                <p>更新日時：{moment(source?.timestamp * 1000).format("YYYY/MM/DD HH:mm:ss")}</p>
                <p className='border p-2'>{source?.html}</p>
            </div>
        </div>
    )
}
