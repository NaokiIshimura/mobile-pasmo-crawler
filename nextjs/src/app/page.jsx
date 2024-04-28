import Link from 'next/link'
import User from '@/components/user'

export default function Home() {

  const id = 'testuser';

  return (
    <div className="px-10">

      <User id={id} />

      <div className='flex gap-5 my-5'>
        <Link href="/account">
          <div className='w-80 rounded overflow-hidden shadow-lg border border-[#ED77AC] rounded-xl bg-white hover:bg-gray-50'>
            <div className='w-full h-40 flex items-center justify-center'>
              <span className='font-bold text-[#ED77AC]'>アカウント更新</span>
            </div>
          </div>
        </Link>
        <Link href="/history">
          <div className='w-80 rounded overflow-hidden shadow-lg border border-[#ED77AC] rounded-xl bg-white hover:bg-gray-50'>
            <div className='w-full h-40 flex items-center justify-center'>
              <span className='font-bold text-[#ED77AC]'>利用履歴</span>
            </div>
          </div>
        </Link>
        <Link href="/cost">
          <div className='w-80 rounded overflow-hidden shadow-lg border border-[#ED77AC] rounded-xl bg-white hover:bg-gray-50'>
            <div className='w-full h-40 flex items-center justify-center'>
              <span className='font-bold text-[#ED77AC]'>交通費</span>
            </div>
          </div>
        </Link>
      </div>
      <div className='flex gap-5 my-5'>
        <Link href="/point">
          <div className='w-80 rounded overflow-hidden shadow-lg border border-[#ED77AC] rounded-xl bg-white hover:bg-gray-50'>
            <div className='w-full h-40 flex items-center justify-center'>
              <span className='font-bold text-[#ED77AC]'>ポイントカード</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
