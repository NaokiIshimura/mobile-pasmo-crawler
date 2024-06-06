//==================================================
// Example
//==================================================
// import { useEffect } from "react";
// import usePutAuthImage from '@/api/putAuthImage';
// useEffect(() => {
//     (async () => {
//         await mutateAsync({ ...data, id: id, dataType: 'account' })
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

function putAuthImage(data) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    }
    return axios.post(`${server}/accounts/${data.id}/authImage`, data, { headers: headers })
}

export default function usePutAuthImage() {
    return useMutation({
        mutationFn: putAuthImage
    })
}
