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

if (!server) {
    throw new Error('Environment variables are not set properly');
}

function getAccount(id) {
    return axios.get(`${server}/accounts/${id}`)
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
