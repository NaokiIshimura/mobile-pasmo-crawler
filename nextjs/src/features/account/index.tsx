import { useForm, SubmitHandler } from "react-hook-form";
import putAccount from "@/repositories/putAccount";
import usePutAccount from '@/api/putAccount';
import useGetAccount from '@/api/getAccount';

type Props = {
    id: string;
}

export default function AuthAccount({ id }: Props) {

    const { data, isLoading, refetch } = useGetAccount(id);
    // console.log(data);

    type Inputs = {
        mailAddress: string;
        password: string;
    }

    const { mutateAsync } = usePutAccount();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        // console.log(data)

        // DynamoDB Client
        // const mailAddress = data.mailAddress;
        // const password = data.password;
        // const response = await putAccount(id, mailAddress, password);
        // if (response.$metadata.httpStatusCode === 200) {
        //     reset();
        // }

        // APIサーバ
        try {
            await mutateAsync({ ...data, id: id, dataType: 'account' })
            reset();
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="py-5">
            <div className="pasmo-block mb-5">
                <div className="pasmo-header">
                    <span>アカウント情報</span>
                </div>
                <div className="pasmo-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <p className='my-3 mr-5 py-1 px-3'>
                            <span className="inline-block w-32">メールアドレス</span>
                            <span>{data.mailAddress}</span>
                        </p>
                        <p className='my-3 mr-5 py-1 px-3'>
                            <span className="inline-block w-32">パスワード</span>
                            <span>{data.password}</span>
                        </p>
                    </form>
                </div>
            </div>
            <div className="pasmo-block">
                <div className="pasmo-header">
                    <span>アカウント更新</span>
                </div>
                <div className="pasmo-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input className='my-3 mr-5 py-1 px-3 pasmo-input' placeholder='メールアドレス' {...register("mailAddress", { required: true })} />
                        <input className='my-3 mr-5 py-1 px-3 pasmo-input' placeholder='パスワード' {...register("password", { required: true })} />
                        <input className="py-1 px-3 pasmo-button" type="submit" value="更新" />
                    </form>
                </div>
            </div>
        </div >
    )
}
