import {
    useSuspenseQuery
} from '@tanstack/react-query'
import axios from 'axios';

function getHistories(id, card) {
    return axios.get(`http://localhost:8081/accounts/${id}/cards/${card}`)
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
