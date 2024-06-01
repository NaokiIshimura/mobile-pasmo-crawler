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

if (!server) {
    throw new Error('Environment variables are not set properly');
}

function putAccount(data) {
    return axios.post(`http://${server}/accounts/${data.id}`, data)
}

export default function usePutAccount() {
    return useMutation({
        mutationFn: putAccount
    })
}
