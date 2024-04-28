import Link from 'next/link'

export default function Home() {

  const id = 'testuser';

  return (
    <div className="px-10">
      <div className="border-b border-[#ED77AC]">
        <p className='my-3 text-lg font-bold text-[#ED77AC]'>id: {id}</p>
      </div>
      <div className='flex gap-5 my-5'>
        <Link href="/account">
          <div className='w-80 rounded overflow-hidden shadow-lg border border-2 border-[#ED77AC] rounded-xl bg-white hover:bg-gray-50'>
            <div className='w-full h-40 flex items-center justify-center'>
              <span className='font-bold text-[#ED77AC]'>アカウント更新</span>
            </div>
          </div>
        </Link>
        <Link href="/history">
          <div className='w-80 rounded overflow-hidden shadow-lg border border-2 border-[#ED77AC] rounded-xl bg-white hover:bg-gray-50'>
            <div className='w-full h-40 flex items-center justify-center'>
              <span className='font-bold text-[#ED77AC]'>利用履歴</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
