"use client"

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form"
import { Source } from "@/components/Source"
import { AuthImage } from "@/components/AuthImage"
import { DataLinkage } from "@/components/DateLinkage";
import { Account } from "@/components/Account";

export default function Home() {

  const id = 'testuser';

  return (
    <main className='p-5'>

      <p className='text-xl font-bold my-3'>モバイルPASMO</p>

      <hr className='my-10' />

      <Account id={id} />

      <hr className='my-20' />

      <DataLinkage id={id} />

      <hr className='my-20' />

      <AuthImage id={id} />

      <hr className='my-20' />

      <Source id={id} />

    </main >
  );
}
