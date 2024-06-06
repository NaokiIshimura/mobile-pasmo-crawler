//==================================================
// Exmaple
//==================================================
// import useGetAccount from '@/api/getAccount';
// const { data, isLoading, refetch } = useGetAccount(id);
// console.log(data);

import {
    useSuspenseQuery
} from '@tanstack/react-query'
import axios from 'axios';

const server = process.env.NEXT_PUBLIC_API_SERVER_HOST_NAME;
const token = process.env.NEXT_PUBLIC_API_SERVER_AUTH_TOKEN;

if (!server) {
    throw new Error('Environment variables are not set properly');
}

function getAccount(id) {
    const headers = {
        'Authorization': token
    }
    return axios.get(`${server}/accounts/${id}`, { headers: headers })
}

export default function useGetAccount(id) {
    return useSuspenseQuery({
        queryKey: ['account', id],
        queryFn: () => getAccount(id)
            .then(res => {
                return res.data
            })
    })
}
