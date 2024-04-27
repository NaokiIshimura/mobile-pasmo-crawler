import { useState } from 'react';
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { client, crawlerFunctionName } from "@/clients/lambda";
import { docClient, authenticatorTableName } from "@/clients/dymamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { useForm, SubmitHandler } from "react-hook-form";
import { TailSpin } from 'react-loader-spinner';

type Props = {
    id: string;
}

export const DataLinkage = ({ id }: Props) => {

    type Inputs = {
        text: string;
    }

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [authImage, setAuthImage] = useState({});

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>()

    const invoke = async () => {
        // console.log('invoke');
        setIsLoading(true);

        const command = new InvokeCommand({
            FunctionName: crawlerFunctionName,
            InvocationType: 'Event'
        });
        await client.send(command);

        for (let i = 0; i < 10; i++) {
            const authImage = await getAuthImage(id);
            if (authImage?.binary) {
                setAuthImage(authImage);
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        setIsLoading(false);
    }

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

    return (
        <div className="pasmo-block">
            <div className="pasmo-header flex justify-between">
                <span>データ連携</span>
                <input className="pasmo-button-small" type="submit" value="更新" onClick={invoke} />
            </div>
            <div className="pasmo-body">
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
                    <div>
                        <img className='my-3' src={`data:image/gif;base64, ${authImage?.binary}`}></img>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input className='border py-1 px-3 mr-3 rounded' placeholder='認証テキスト' {...register("text", { required: true })} />
                            <input className="pasmo-button" type="submit" />
                        </form>
                    </div>
                }
            </div>
        </div>
    )
}
