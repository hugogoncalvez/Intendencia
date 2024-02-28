import { Api } from "../api/api";
import { useMutation } from '@tanstack/react-query';
import Swal from "sweetalert2";


export const useSubmit = () => {
    return useMutation(Submit, {
        mutationKey: 'submitExpte',
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                iconColor: '#377D71',
                title: 'Intendencia',
                text: 'Se ha agregado con éxito !',
                background: '#CDF0EA',
            })
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Intendencia',
                text: `Se ha producido un error : ${error}`,
                background: '#FFD1D1',
                timer: 5000,
                timerProgressBar: true
            })
        }
    })
}

const Submit = async ({ url, values }) => {
    await Api.post(url, values)
}

