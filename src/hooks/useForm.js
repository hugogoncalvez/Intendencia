import { useState } from "react"


export const useForm = () => {

  const [values, setValues] = useState({})
  const [keyFilter, setKeyFilter] = useState('')

  const reset = (clave) => {
    if (typeof values !== 'undefined') {
      let borrador = structuredClone(values)
      delete borrador[clave]
      setValues(borrador)
    }
  }

  const claveFil = ({ target }) => {
    const clave = target.name
    setKeyFilter(clave)
  }

  const handleInputChange = ({ target }) => {
    const clave = target.name
    const valor = target.value

    if (valor.length > 0) {
      setValues({
        ...values,
        [clave]: valor
      })
    } else {
      delete values[clave]
      setValues({ ...values })
    }
  }
  return [values, handleInputChange, reset, setValues, keyFilter, claveFil, setKeyFilter]
}
