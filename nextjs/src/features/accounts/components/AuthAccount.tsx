import { useForm, SubmitHandler } from "react-hook-form";
import { docClient, authenticatorTableName } from "@/clients/dymamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

type Props = {
    id: string;
}

export const AuthAccount = ({ id }: Props) => {

    type Inputs = {
        mailAddress: string;
        password: string;
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
                dataType: 'account',
                mailAddress: data.mailAddress,
                password: data.password
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
        <div>
            <p className='text-lg font-bold my-3'>1. アカウント登録</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <input className='border py-1 px-3 mr-3 rounded' placeholder='メールアドレス' {...register("mailAddress", { required: true })} />
                <input className='border py-1 px-3 mr-3 rounded' placeholder='パスワード' {...register("password", { required: true })} />
                <input className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded" type="submit" value="登録" />
            </form>

        </div>
    )
}
