import Link from 'next/link'
import User from '@/components/user'

export default function Home() {

  const id = 'testuser';

  return (
    <div className="px-10">

      <User id={id} />

      <div className='flex gap-5 my-5'>
        <Link href="/account">
          <div className='pasmo-menu-card'>
            アカウント更新
          </div>
        </Link>
        <Link href="/history">
          <div className='pasmo-menu-card'>
            利用履歴
          </div>
        </Link>
        <Link href="/cost">
          <div className='pasmo-menu-card'>
            交通費
          </div>
        </Link>
      </div>
      <div className='flex gap-5 my-5'>
        <Link href="/point">
          <div className='pasmo-menu-card'>
            ポイントカード
          </div>
        </Link>
      </div>
    </div>
  );
}
