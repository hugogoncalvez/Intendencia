import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { Button, Divider, IconButton, InputAdornment, Table, TableBody, TableContainer, TableHead, TextField, Tooltip } from '@mui/material';

import { useForm } from '../hooks/useForm';
import { Update } from '../hooks/useUpdate';
import { useFilter } from '../hooks/useFilter';
import { UseQuery } from '../hooks/useQuery';
import { Delete } from '../hooks/useDelete';
import { StyledTableCell, StyledTableRow } from '../styles/styles';

moment.locale();

export const Vecinos = () => {

    const navigate = useNavigate();

    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const [editando, setEditando] = useState(false)
    const [dniError, setDniError] = useState(false)

    const { data: vecinos, refetch, status } = UseQuery('vecinos', `/vecinos`, true, 2 * 60 * 1000)

    const [values, handleInputChange, reset, setValues, keyFilter, claveFil, setKeyFilter] = useForm()
    const [filtradas, handleFilter, setFiltradas] = useFilter()
    const { mutate: delVecino } = Delete('DelVecino')
    const { mutate: delAtemps } = Delete('DelAtemps')
    const { mutate: UpVecino } = Update('UpVecino')
    const { mutate: UpAtemps } = Update('UpAtemps')

    const dniRef = useRef()

    const deleting = (id) => {
        Swal.fire({
            icon: 'question',
            iconColor: '#C13038',
            title: 'Está seguro que desea eliminar?',
            background: '#c9a3a3',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                delVecino({ url: '/vecino/', id: id })
                delAtemps({ url: '/atempdni/', id: id })
                setFiltradas([])
                setValues({})
            } else if (result.isDenied) {
                Swal.fire({
                    icon: 'info',
                    iconColor: '#377D71',
                    title: 'Intendencia',
                    text: 'Nada ha sido eliminado !!',
                    background: '#CDF0EA',
                    timer: 1000,
                    timerProgressBar: true
                })
            }
        })
    }

    function debounce(func, delay = 350) {
        let timeoutRef = useRef(null);
        return (...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                func(...args);
                timeoutRef.current = null;
            }, delay);
        };
    }
    useEffect(() => {
        if (typeof values !== 'undefined' && !editando) {
            debounceFilter();
        }
    }, [values, vecinos]);

    const debounceFilter = debounce(() => {
        handleFilter(values, vecinos, keyFilter, (keyFilter === 'apellido') ? true : false)
    })

    const edit = (i) => {
        setEditando(!editando)
        setValues({
            apellido: filtradas[i].apellido,
            nombre: filtradas[i].nombre,
            dni: filtradas[i].dni,
            telefono: filtradas[i].telefono,
            barrio: filtradas[i].barrio,
            observaciones: filtradas[i].observaciones
        })
    }

    const cancel = () => {
        setEditando(!editando)
        setValues({})
        setDniError(false)
    }

    const guardar = () => {
        if (typeof values.dni === 'undefined' || values.dni.length < 7) {
            setDniError(true)
            dniRef.current.focus()
            return
        }
        UpVecino({ url: '/vecino/', id: filtradas[0].dni, datos: values })
        UpAtemps({ url: '/atempdni/', id: filtradas[0].dni, datos: { dni: values.dni, apellido: values.apellido } })
        setEditando(!editando)
        setValues({
            ...values,
            apellido: '',
            nombre: '',
            telefono: '',
            barrio: '',
            observaciones: ''
        })
        setDniError(false)
    }

    return (
        <>
            <Typography align='center' variant={(screenSize.width > 672) ? 'h3' : 'h5'} sx={{ mt: 2 }}>Buscar Vecinos</Typography>
            <Divider sx={{ mt: 1 }} />
            {(!editando) ?
                <Grid>
                    <Grid mt='15px' sx={{ width: { sm: '100%', md: '100%' }, alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
                        <Button color='secondary' size="large" startIcon={<ReplyAllIcon fontSize="inherit" />} onClick={() => navigate(-1)}>
                            Regresar
                        </Button>
                    </Grid>
                    <Grid sx={{ alignContent: 'center', justifyContent: 'space-around', display: 'flex', mt: 5, mb: 5, marginX: 5, flexDirection: (screenSize.width > 672) ? 'row' : 'column' }}>
                        <TextField sx={{ mb: 1 }} value={values?.dni || ''} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton onClick={() => reset('dni')}><ClearIcon color='error' /></IconButton></InputAdornment> }} autoFocus type='number' name='dni' autoComplete='off' placeholder='Nº de DNI' onChange={(e) => { handleInputChange(e); claveFil(e) }} onInput={(e) => { e.target.value = (e.target.value).toString().slice(0, 8) }}></TextField>
                        <TextField InputProps={{ startAdornment: <InputAdornment position="start"><IconButton onClick={() => reset('apellido')}><ClearIcon color='error' /></IconButton></InputAdornment> }} inputProps={{ maxLength: 50, style: { textTransform: 'capitalize' } }} type='string' value={values?.apellido || ''} name='apellido' autoComplete='off' onChange={(e) => { handleInputChange(e); claveFil(e) }} placeholder='Apellido'></TextField>
                    </Grid>
                </Grid>
                :
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} mt={2} marginX={(screenSize.width > 672) ? 15 : 10} sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center', flexDirection: (screenSize.width > 672) ? 'row' : 'column' }}>
                    <Grid sx={{ width: { sm: '40%', md: '50%' } }}>
                        <TextField inputRef={dniRef} autoFocus error={dniError} sx={{ width: { sm: '100%', md: '100%' } }} type='number' name='dni' autoComplete='off' placeholder='Nº de DNI' value={values?.dni || ''} onChange={handleInputChange} onInput={(e) => { e.target.value = (e.target.value).toString().slice(0, 8) }}></TextField>
                    </Grid>
                    <Grid sx={{ width: { sm: '40%', md: '50%' } }}>
                        <TextField inputProps={{ maxLength: 50, style: { textTransform: 'capitalize' } }} sx={{ width: { sm: '100%', md: '100%' } }} type='string' value={values?.apellido || ''} name='apellido' autoComplete='off' onChange={handleInputChange} placeholder='Apellido'></TextField>
                    </Grid>
                    <Grid sx={{ width: { sm: '40%', md: '50%' } }}>
                        <TextField inputProps={{ maxLength: 100, style: { textTransform: 'capitalize' } }} sx={{ width: { sm: '100%', md: '100%' } }} type='string' value={values?.nombre || ''} name='nombre' autoComplete='off' onChange={handleInputChange} placeholder='Nombre'></TextField>
                    </Grid>
                    <Grid sx={{ width: { sm: '40%', md: '50%' } }}>
                        <TextField sx={{ width: { sm: '100%', md: '100%' } }} type='number' value={values?.telefono || ''} name='telefono' autoComplete='off' onChange={handleInputChange} onInput={(e) => { e.target.value = (e.target.value).toString().slice(0, 10) }} placeholder='Telefono'></TextField>
                    </Grid>
                    <Grid sx={{ width: { sm: '40%', md: '50%' } }}>
                        <TextField inputProps={{ maxLength: 50, style: { textTransform: 'capitalize' } }} sx={{ width: { sm: '100%', md: '100%' } }} type='string' value={values?.barrio || ''} name='barrio' autoComplete='off' onChange={handleInputChange} placeholder='Barrio'></TextField>
                    </Grid>
                    <Grid sx={{ width: { sm: '40%', md: '50%' } }}>
                        <TextField inputProps={{ maxLength: 500, style: { textTransform: 'capitalize' } }} sx={{ width: { sm: '100%', md: '100%' } }} type='string' value={values?.observaciones || ''} name='observaciones' autoComplete='off' onChange={handleInputChange} placeholder='Observaciones'></TextField>
                    </Grid>
                    <Grid sx={{ width: { sm: '100%', md: '100%' }, alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
                        <Button size={(screenSize.width > 672) ? "large" : 'small'} startIcon={<SaveAsIcon fontSize="small" />} onClick={() => guardar()}>
                            Guardar
                        </Button>
                        <Button size={(screenSize.width > 672) ? "large" : 'small'} color='error' startIcon={<ClearIcon fontSize="small" />} onClick={() => cancel()}>
                            cancelar
                        </Button>
                    </Grid>
                </Grid>
            }
            <Divider sx={{ mt: 1, mb: 2 }} />
            {(JSON.stringify(filtradas) === '[]') ?
                <Typography align='center' variant={(screenSize.width > 672) ? 'h4' : 'h5'} color={!((typeof values === 'undefined' || JSON.stringify(values) === '{}') && JSON.stringify(filtradas) === '[]') ? 'error' : 'darkgoldenrod'}>{(typeof values === 'undefined' || JSON.stringify(values) === '{}') ? 'Seleccione un parámetro de busqueda' : ((!(JSON.stringify(values) !== '{}' || typeof values === 'undefined')) && (JSON.stringify(filtradas) === '[]')) ? '' : 'No hay resultados para la busqueda'}</Typography>
                : (JSON.stringify(filtradas) === 'null')
                    ? <></>
                    : <TableContainer component={Paper}  >
                        <Table id='tabla' stickyHeader size="small" aria-label="a dense table">
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell align='center'>Apellido</StyledTableCell>
                                    <StyledTableCell align='center'>Nombre</StyledTableCell>
                                    <StyledTableCell align='center'>Nº DNI</StyledTableCell>
                                    <StyledTableCell align='center'>Teléfono</StyledTableCell>
                                    <StyledTableCell align='center'>Barrio</StyledTableCell>
                                    <StyledTableCell align='center'>Obs</StyledTableCell>
                                    <StyledTableCell align='center'>Acciones</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {filtradas?.map((row, i) => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell align='center'>{(row.apellido).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</StyledTableCell>
                                        <StyledTableCell align='center'>{(row.nombre).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</StyledTableCell>
                                        <StyledTableCell align='center'>{row.dni}</StyledTableCell>
                                        <StyledTableCell align='center'>{row.telefono}</StyledTableCell>
                                        <StyledTableCell align='center'>{row.barrio}</StyledTableCell>
                                        <StyledTableCell align='center'>{row.observaciones}</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Tooltip title='Editar Vecino'>
                                                <IconButton aria-label="editar" color='info' onClick={() => edit(i)}>
                                                    <EditIcon fontSize='small' />
                                                </IconButton>
                                            </Tooltip >
                                            <Tooltip title='Eliminar Vecino'>
                                                <IconButton aria-label="delete" color='warning' onClick={() => deleting(row.dni)}>
                                                    <DeleteForeverIcon fontSize='small' />
                                                </IconButton>
                                            </Tooltip>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>}
        </>
    )
}
