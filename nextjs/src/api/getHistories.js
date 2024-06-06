import {
    useSuspenseQuery
} from '@tanstack/react-query'
import axios from 'axios';

const server = process.env.NEXT_PUBLIC_GRPC_SERVER_HOST_NAME;

if (!server) {
    throw new Error('Environment variables are not set properly');
}

function getHistories(id, card) {
    return axios.get(`${server}/accounts/${id}/cards/${card}/histories`)
}

export default function useGetHistories(id, card) {
    return useSuspenseQuery({
        queryKey: ['histories', id, card],
        queryFn: () => getHistories(id, card)
            .then(res => {
                return res.data
            })
    })
}
