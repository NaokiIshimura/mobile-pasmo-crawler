"use client"

import Account from "@/features/account"

export default function Home() {

  const id = 'testuser';

  return (
    <div className="px-10">
      <div className="border-b border-[#ED77AC]">
        <p className='my-3 text-lg font-bold text-[#ED77AC]'>id: {id}</p>
      </div>
      <div>
        <Account id={id} />
      </div>
    </div>
  );
}
