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
        <div className="pasmo-block">
            <div className="pasmo-header">
                <span>アカウント更新</span>
            </div>
            <div className="pasmo-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input className='mb-3 py-1 px-3 block border rounded outline-none' placeholder='メールアドレス' {...register("mailAddress", { required: true })} />
                    <input className='mb-3 py-1 px-3 block border rounded outline-none' placeholder='パスワード' {...register("password", { required: true })} />
                    <input className="py-1 px-3 block pasmo-button" type="submit" value="更新" />
                </form>
            </div>
        </div>
    )
}
