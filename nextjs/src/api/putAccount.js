//==================================================
// Example
//==================================================
// import { useEffect } from "react";
// import usePutAccount from '@/api/putAccount';
// const { mutateAsync } = usePutAuthImage();
// useEffect(() => {
//     (async () => {
//         await mutateAsync({ id: id, dataType: 'account', mailAddress: "foo", password: "bar" })
//     })()
// }, []);

import {
    useMutation
} from '@tanstack/react-query'
import axios from 'axios';

const server = process.env.NEXT_PUBLIC_API_SERVER_HOST_NAME;
const token = process.env.NEXT_PUBLIC_API_SERVER_AUTH_TOKEN;

if (!server) {
    throw new Error('Environment variables are not set properly');
}

function putAccount(data) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    }
    return axios.post(`${server}/accounts/${data.id}`, data, { headers: headers })
}

export default function usePutAccount() {
    return useMutation({
        mutationFn: putAccount
    })
}
