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

const server = 'localhost:8082';

if (!server) {
    throw new Error('Environment variables are not set properly');
}

function putAuthImage(data) {
    return axios.post(`http://${server}/accounts/${data.id}/authImage`, data)
}

export default function usePutAuthImage() {
    return useMutation({
        mutationFn: putAuthImage
    })
}
