import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import runCrawler from '@/repositories/runCrawler';
import getAuthImage from '@/repositories/getAuthImage';
import putAuthImage from '@/repositories/putAutuImage';
import { TailSpin } from 'react-loader-spinner';

type Props = {
    id: string;
}

export default function Update({ id }: Props) {

    type AuthImageItem = {
        binary: string;
        text: string;
    }

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [authImage, setAuthImage] = useState<AuthImageItem | undefined>(undefined);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>()

    const invoke = async () => {
        // console.log('invoke');
        setIsLoading(true);
        await runCrawler();
        for (let i = 0; i < 10; i++) {
            const authImage = await getAuthImage(id) as AuthImageItem;
            if (authImage?.binary) {
                setAuthImage(authImage);
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        setIsLoading(false);
    }

    type Inputs = {
        text: string;
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        // console.log(data)
        const text = data.text;
        const response = await putAuthImage(id, text);
        if (response.$metadata.httpStatusCode === 200) {
            reset();
        }
    }

    return (
        <div className="pasmo-block">
            <div className="pasmo-header flex justify-between">
                <span>更新</span>
                <input className="pasmo-button-small" type="submit" value="実行" onClick={invoke} />
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
                    <>
                        {
                            authImage ?
                                <div>
                                    <img className='my-3' src={`data:image/gif;base64, ${authImage.binary}`}></img>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <input className='border py-1 px-3 mr-3 rounded outline-none' placeholder='認証テキスト' {...register("text", { required: true })} />
                                        <input className="pasmo-button" type="submit" />
                                    </form>
                                </div>
                                :
                                <span className='text-sm'>実行ボタンをクリックしてください。</span>
                        }
                    </>
                }
            </div>
        </div>
    )
}
