type Props = {
    id: string;
}

export default function User({ id }: Props) {
    return (
        <div className="border-b border-[#ED77AC]">
            <p className='my-3 text-lg font-bold text-[#ED77AC]'>id: {id}</p>
        </div>
    )
}
