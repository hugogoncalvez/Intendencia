import { Api } from "../api/api";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from "sweetalert2";



export const Delete = (key = '') => {

    const queryClient = useQueryClient()

    return useMutation(deletion, {
        mutationKey: key,
        onSettled: () => {
            (key !== 'DelNota') ? queryClient.invalidateQueries({ queryKey: ['ATemps'] }) : null
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                iconColor: '#377D71',
                title: 'Intendencia',
                text: 'Se ha eliminado con éxito !',
                background: '#CDF0EA',
                // timer: 2000,
                // timerProgressBar: true,
                //confirmButtonText: 'Ok'
            })
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Intendencia',
                text: `Se ha producido un error, vuelva a intentarlo por favor.`,
                background: '#FFD1D1',
                timer: 2000,
                timerProgressBar: true
            })
        },
        retry: 2

    })

}

const deletion = async ({ url, id }) => {
    await Api.delete(`${url}${id}`)
}