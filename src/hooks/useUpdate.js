import { Api } from "../api/api";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from "sweetalert2";



export const Update = (key = '') => {

    const queryClient = useQueryClient()

    return useMutation(updating, {
        mutationKey: key,
        onSettled: () => {
            if (key === 'UpVecino' || key === 'UpAtemps') {
                queryClient.invalidateQueries({ queryKey: ['ATemps'] })
                queryClient.invalidateQueries({ queryKey: ['vecinos'] })
            }

        },
        onSuccess: () => {
            if (key === 'UpVecino' || key === 'UpAtemps' || key === 'upDestino' || key === 'upPagado') {
                Swal.fire({
                    icon: 'success',
                    iconColor: '#377D71',
                    title: 'Intendencia',
                    text: 'Se ha actualizado con éxito !',
                    background: '#CDF0EA',
                    // timer: 2000,
                    // timerProgressBar: true,
                    //confirmButtonText: 'Ok'
                })
            }
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Intendencia',
                text: 'Se ha producido un error, por favor vuelva a intentarlo.',
                background: '#FFD1D1',
                timer: 5000,
                timerProgressBar: true
            })
        }
    })

}

const updating = async ({ url, id, datos }) => {
    await Api.put(`${url}${id}`, datos)
}
