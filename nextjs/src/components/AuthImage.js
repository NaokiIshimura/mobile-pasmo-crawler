import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { docClient, tableName } from "@/clients/dymamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export const AuthImage = ({ id }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        console.log(data)
        const command = new PutCommand({
            TableName: tableName,
            Item: {
                id: id,
                dataType: 'authImage',
                binary: '',
                text: data.text
            }
        });

        const response = await docClient.send(command);
        // console.log(response);
        // return response;
        if (response.$metadata.httpStatusCode === 200) {
            reset();
        }
    }

    const [authImage, setAuthImage] = useState({});

    const getAuthImage = async (id) => {
        const command = new GetCommand({
            TableName: tableName,
            Key: {
                id: id,
                dataType: 'authImage'
            },
        });

        const { Item } = await docClient.send(command);
        // console.log(Item);
        return { binary: Item?.binary, text: Item?.text }
    }

    const reload = async () => {
        const authImage = await getAuthImage(id);
        setAuthImage(authImage);
    }

    return (
        <div>
            <p className='inline-block mr-3 text-lg font-bold my-3'>3. 認証画像</p>

            {authImage?.binary ?
                <div>
                    <img className='my-3' src={`data:image/gif;base64, ${authImage?.binary}`}></img>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input className='border py-1 px-3 mr-3 rounded' placeholder='認証テキスト' {...register("text", { required: true })} />
                        <input className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded" type="submit" />
                    </form>
                </div>
                :
                <input className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded" type="submit" value="取得" onClick={reload} />
            }


        </div>
    )
}
