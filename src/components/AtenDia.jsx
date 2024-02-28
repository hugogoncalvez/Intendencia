import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
//import Swal from 'sweetalert2';
import moment from 'moment';
import { parseISO } from 'date-fns';

import { TextField, Typography, Button, Divider } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import ClearIcon from '@mui/icons-material/Clear';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import es from 'date-fns/locale/es';

import { UseQuery } from "../hooks/useQuery";
import { useForm } from '../hooks/useForm'
//import { submitVecino } from '../hooks/useSubmitVecino';
import { useQueryClient } from '@tanstack/react-query';
import { desckTopPicker } from '../styles/desckTopPicker';
import { useSubmit } from '../hooks/useSubmit';


export const AtenDia = () => {

  const queryClient = useQueryClient()

  const navigate = useNavigate();

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [disable, setDisable] = useState(false)
  const [dniError, setDniError] = useState(false)
  const [enableGuardar, setEnableGuardar] = useState(true)
  const [atendido, setAtendido] = useState(false)
  const [values, handleInputChange, reset, setValues] = useForm()
  // console.log(values)
  const { data: vecinoAD, refetch, status } = UseQuery('vecinoAD', `/vecinos/${values?.dni}`, false)
  const { mutate: subAV } = useSubmit()

  const dniRef = useRef()
  const apeRef = useRef()
  const motivoRef = useRef()



  useEffect(() => {
    setDisable(false);
    if (typeof vecinoAD !== 'undefined') {
      const vecino = vecinoAD?.find(() => true)
      if (Object.keys(vecinoAD).length !== 0) {
        setDisable(true)
        setValues({
          ...values,
          existe: true,
          apellido: vecino.apellido,
          nombre: vecino.nombre,
          telefono: vecino.telefono,
          barrio: vecino.barrio,
          observaciones: vecino.observaciones
        })
        motivoRef.current.focus()
      } else {
        //apeRef.current.focus()
        //setValues({})
        //motivoRef.current.blur();
        apeRef.current.focus()
      }
    }

  }, [vecinoAD])

  const buscar = () => {
    if (values && values?.dni?.length < 7) {
      setDniError(true)
      dniRef.current.focus()
      setEnableGuardar(true)
      return
    }
    if (values && values?.dni !== '' && Object.hasOwnProperty.call(values, 'dni')) {
      refetch()
      setDniError(false)
      //dniRef.current.focus()
      setEnableGuardar(false)
    } else {
      setDniError(true)
      dniRef.current.focus()
      setEnableGuardar(true)
    }
  }

  // const mensage = () => {
  //   Swal.fire({
  //     icon: 'success',
  //     iconColor: '#377D71',
  //     title: 'Intendencia',
  //     text: 'Se ha agregado con éxito !',
  //     background: '#CDF0EA',
  //     // timer: 2000,
  //     // timerProgressBar: true,
  //     confirmButtonText: 'Ok'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // setTimeout(() => {
  //       navigate(-1)
  //       // }, 200)
  //     }
  //   }
  //   )
  // }

  const guardar = () => {
    if (values.existe) {
      subAV({ url: '/atemps', values })
    } else {
      subAV({ url: '/vecinos', values })
      subAV({ url: '/atemps', values })
    }
    // subAV(values)
    while (status === 'loading') {
      // console.log('valor de status')
      // console.log({ status })
    }
    if (status === 'success') {
      //mensage()
      queryClient.removeQueries('vecinoAD')
      setValues({})
      setAtendido(false)
      setEnableGuardar(false)
    }
  }

  const cancelar = () => {
    //console.log('entra en cancelar')
    setValues({})
    dniRef.current.focus()
    //queryClient.removeQueries('vecinoAD')
  }

  const handleChangeFN = (newValue = Date || null) => {
    // setFiltradas(null)
    //console.log('cambia values por la fecha')
    setValues({ ...values, createdAt: moment(newValue).format('YYYY-MM-DD') })
  };

  useEffect(() => {
    setValues({
      ...values,
      ['atendido']: (atendido) ? 1 : 0
    }
    )
  }, [atendido])

  const handleChangeCheckBox = () => {
    setAtendido(!atendido)
  }

  const [style] = desckTopPicker()

  return (
    <>
      <Typography align='center' variant={(screenSize.width > 672) ? 'h3' : 'h4'} sx={{ mt: 2 }}>Nueva Atención </Typography>
      <Divider sx={{ mt: 1 }} />
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} mt={2} marginX={(screenSize.width > 672) ? 15 : 10} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid sx={{ width: { sm: '40%', md: '50%' } }}>
          <TextField inputRef={dniRef} value={values.dni || ''} autoFocus error={dniError} sx={{ width: { sm: '100%', md: '100%' } }} type='number' name='dni' autoComplete='off' placeholder='Nº de DNI' onChange={handleInputChange} onBlur={buscar} onInput={(e) => { e.target.value = (e.target.value).toString().slice(0, 8) }}></TextField>
        </Grid>
        <Grid sx={{ width: { sm: '40%', md: '50%' } }}>
          <TextField tabIndex={0} inputRef={apeRef} inputProps={{ maxLength: 50, style: { textTransform: 'capitalize' } }} disabled={disable} sx={{ width: { sm: '100%', md: '100%' } }} type='string' value={values?.apellido || ''} name='apellido' autoComplete='off' onChange={handleInputChange} placeholder='Apellido'></TextField>
        </Grid>
        <Grid sx={{ width: { sm: '40%', md: '50%' } }}>
          <TextField inputProps={{ maxLength: 100, style: { textTransform: 'capitalize' } }} disabled={disable} sx={{ width: { sm: '100%', md: '100%' } }} type='string' value={values?.nombre || ''} name='nombre' autoComplete='off' onChange={handleInputChange} placeholder='Nombre'></TextField>
        </Grid>
        <Grid sx={{ width: { sm: '40%', md: '50%' } }}>
          <TextField disabled={disable} sx={{ width: { sm: '100%', md: '100%' } }} type='number' value={values?.telefono || ''} name='telefono' autoComplete='off' onChange={handleInputChange} onInput={(e) => { e.target.value = (e.target.value).toString().slice(0, 10) }} placeholder='Telefono'></TextField>
        </Grid>
        <Grid sx={{ width: { sm: '40%', md: '50%' } }}>
          <TextField inputProps={{ maxLength: 50, style: { textTransform: 'capitalize' } }} disabled={disable} sx={{ width: { sm: '100%', md: '100%' } }} type='string' value={values?.barrio || ''} name='barrio' autoComplete='off' onChange={handleInputChange} placeholder='Barrio'></TextField>
        </Grid>
        <Grid sx={{ width: { sm: '40%', md: '50%' } }}>
          <TextField inputProps={{ maxLength: 500, style: { textTransform: 'capitalize' } }} disabled={disable} sx={{ width: { sm: '100%', md: '100%' } }} type='string' value={values?.observaciones || ''} name='observaciones' autoComplete='off' onChange={handleInputChange} placeholder='Observaciones'></TextField>
        </Grid>
        <Grid sx={{ width: { sm: '100%', md: '100%' } }}>
          <TextField inputRef={motivoRef} value={values.motivo || ''} inputProps={{ maxLength: 1000, style: { textTransform: 'capitalize' } }} sx={{ width: { sm: '100%', md: '100%' } }} type='string' name='motivo' autoComplete='off' multiline={true} minRows='5' onChange={handleInputChange} placeholder='Motivo'></TextField>
        </Grid>
      </Grid >

      <Grid mt={1} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button disabled={enableGuardar} size="large" startIcon={<SaveAsIcon fontSize="inherit" />} onClick={() => guardar()}>Guardar</Button>
        <Button size="large" startIcon={<ClearIcon fontSize="inherit" />} color='error' onClick={() => cancelar()}>Cancelar</Button>
        <Button color='secondary' size="large" startIcon={<ReplyAllIcon fontSize="inherit" />} onClick={() => navigate(-1)}>Regresar</Button>
      </Grid>
      <Divider />
      <Typography align='center' variant={'h6'} sx={{ mt: 0 }}>Seleccione otra fecha, si no corresponde a la de hoy.</Typography>
      <Grid sx={{ alignContent: 'center', justifyContent: 'space-evenly', display: 'flex', mt: 1 }}>
        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns} >
          <DatePicker
            name='createdAt'
            //openTo="year"
            views={['year', 'month', 'day']}
            disableFuture
            value={(typeof values?.createdAt === 'undefined') ? '' : parseISO(values?.createdAt)}
            onChange={handleChangeFN}
            slotProps={{ ...style }}
          />
        </LocalizationProvider>
        <FormControlLabel control={<Checkbox onChange={() => handleChangeCheckBox()} />} label="Atendido?" />
      </Grid>
    </>
  )
}
