import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { docClient, authenticatorTableName } from "@/clients/dymamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

type Props = {
    id: string;
}

export const AuthImage = ({ id }: Props) => {

    type Inputs = {
        text: string;
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        // console.log(data)
        const command = new PutCommand({
            TableName: authenticatorTableName,
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

    const getAuthImage = async (id: string) => {
        const command = new GetCommand({
            TableName: authenticatorTableName,
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
            {authImage?.binary ?
                <div>
                    <img className='my-3' src={`data:image/gif;base64, ${authImage?.binary}`}></img>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input className='border py-1 px-3 mr-3 rounded' placeholder='認証テキスト' {...register("text", { required: true })} />
                        <input className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded" type="submit" />
                    </form>
                </div>
                :
                <input className="pasmo-button" type="submit" value="認証画像取得" onClick={reload} />
            }


        </div>
    )
}
