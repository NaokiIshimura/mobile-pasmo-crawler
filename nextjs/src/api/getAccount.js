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

const server = 'localhost:8082';

if (!server) {
    throw new Error('Environment variables are not set properly');
}

function getAccount(id) {
    return axios.get(`http://${server}/accounts/${id}`)
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
