import { Api } from "../api/api";
import { useMutation} from '@tanstack/react-query';

export const getLogin = () => {

    return useMutation(Login, { mutationKey: 'login' })

}

const Login = async (usuario) => {

    try {
        const { data } = await Api.get('/login/' + usuario)
        return data
    } catch  {
        console.log(`Error en getLogin`)
    }
}