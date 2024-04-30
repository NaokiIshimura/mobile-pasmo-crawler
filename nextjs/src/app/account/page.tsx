"use client"

import Account from "@/features/account"
import User from '@/components/user'

export default function Page() {

  const id = 'testuser';

  return (
    <div className="px-10">
      <User id={id} />
      <div>
        <Account id={id} />
      </div>
    </div>
  );
}
