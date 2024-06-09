//==================================================
// Exmaple
//==================================================
// import useGetAuthImage from '@/api/getAuthImage';
// const { data, isLoading, refetch } = useGetAuthImage(id);
// console.log(data);

import {
    useQuery,
    useSuspenseQuery
} from '@tanstack/react-query'
import axios from 'axios';

const server = process.env.NEXT_PUBLIC_API_SERVER_HOST_NAME;

if (!server) {
    throw new Error('Environment variables are not set properly');
}

function getAuthImage(id) {
    return axios.get(`${server}/accounts/${id}/authImage`)
}

export default function useGetAccount(id) {
    // useSuspenseQueryでは「enabled」オプションが利用できない
    // （suspenseオプションが有効の場合も同様）
    // https://github.com/TanStack/query/discussions/6206
    // return useSuspenseQuery({
    return useQuery({
        queryKey: ['authImage', id],
        queryFn: () => getAuthImage(id).then(res => res.data),
        enabled: false,
    })
}
