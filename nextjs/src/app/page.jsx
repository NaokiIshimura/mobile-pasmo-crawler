"use client"

import Account from "@/features/accounts"

export default function Home() {

  const id = 'testuser';

  return (
    <Account id={id} />
  );
}
