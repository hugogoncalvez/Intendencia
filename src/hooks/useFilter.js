import { useState } from "react"



export const useFilter = () => {
    const [filtradas, setFiltradas] = useState([])

    const resetFilter = () => {
        setFiltradas([])
    }

    const handleFilter = (values, filtrarEn, keyFilter = '', include = false) => {
        if (JSON.stringify(values) === '{}') {
            setFiltradas([]);
            return;
        }
        //console.log(values)
        // console.log({ keyFilter })
        // console.log(filtrarEn)
        const buscar = values[keyFilter];
        const clave = keyFilter?.includes('x') ? keyFilter.slice(1) : keyFilter;

        const filtrado = filtrarEn.filter(e => {
            const valor = e[clave]?.toString().toLowerCase();
            const buscarLowerCase = buscar?.toLowerCase();

            if (include) {
                return valor?.includes(buscarLowerCase);
            } else {
                return valor === buscarLowerCase;
            }
        });

        setFiltradas(filtrado);
    }

    // const handleFilter = (values, filtrarEn, keyFilter = '', include = false) => {


    //     let filtrado = structuredClone(filtrarEn);
    //     let buscar = values[keyFilter];

    //     let clave = '';
    //     (keyFilter?.includes('x')) ? clave = keyFilter.slice(1) : clave = keyFilter;
    //     (buscar?.length > 0) ? (filtrado = filtrarEn.filter(e => (include) ? (e[clave]).toString().toLowerCase().includes(buscar.toLowerCase()) : (e[clave]).toString().toLowerCase() === buscar.toLowerCase())) : null;

    //     if (JSON.stringify(values) === '{}') {
    //         setFiltradas([])
    //     } else {
    //         setFiltradas(filtrado)
    //     }

    // }

    return [filtradas, handleFilter, setFiltradas, resetFilter]
}
