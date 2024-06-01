//==================================================
// Exmaple
//==================================================
// import useGetAuthImage from '@/api/getAuthImage';
// const { data, isLoading, refetch } = useGetAuthImage(id);
// console.log(data);

import {
    useSuspenseQuery
} from '@tanstack/react-query'
import axios from 'axios';

const server = 'localhost:8082';

if (!server) {
    throw new Error('Environment variables are not set properly');
}

function getAuthImage(id) {
    return axios.get(`http://${server}/accounts/${id}/authImage`)
}

export default function useGetAccount(id) {
    return useSuspenseQuery({
        queryKey: ['account', id],
        queryFn: () => getAuthImage(id)
            .then(res => {
                return res.data
            })
    })
}
