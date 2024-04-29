import { useForm, SubmitHandler } from "react-hook-form";
import putAccount from "@/repositories/putAccount";

type Props = {
    id: string;
}

export default function AuthAccount({ id }: Props) {

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
        const mailAddress = data.mailAddress;
        const password = data.password;
        const response = await putAccount(id, mailAddress, password);
        if (response.$metadata.httpStatusCode === 200) {
            reset();
        }
    }

    return (
        <div className="py-5">
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
        </div>
    )
}
