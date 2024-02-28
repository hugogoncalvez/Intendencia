import { Container, Paper } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { TablePagination, Fab, Typography, Divider, Button, IconButton, Table, TableBody, TableContainer, TableHead, TableRow, TextField, InputAdornment, Tooltip } from '@mui/material';
import { useEffect, useState, useMemo, useRef } from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import { useForm } from '../hooks/useForm';
import { UseQuery } from "../hooks/useQuery";
import { Delete } from '../hooks/useDelete';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { StyledTableCell, StyledTableRow } from "../styles/styles";
import Swal from "sweetalert2";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Update } from '../hooks/useUpdate';
import { useFilter } from '../hooks/useFilter';
import EditIcon from '@mui/icons-material/Edit';
//import { submitExpte } from '../hooks/useSubmitExpte';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useSubmit } from '../hooks/useSubmit';

moment.locale('es-ES')

const moneda = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 })

export const Expedientes = () => {


    const navigate = useNavigate();

    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, refetch } = UseQuery('Exptes', '/getexpte', true, 2 * 60 * 1000)
    const { mutate: subExpte, status: statusExpte, reset: resExpte } = useSubmit()
    const { mutate: delExpte, status: statusDel, reset: resDelExpte } = Delete('DelExpte')
    const { mutate: upPagado, status: statuspagado, reset: resPagado } = Update('upPagado')
    //const { mutate: upDerivar, status: statusDerivar, reset: resDerivar } = Update('upDerivar')

    const [values, handleInputChange, reset, setValues, keyFilter, claveFil] = useForm()
    //console.log(values)
    // console.log(typeof values.fechaIngreso === 'undefined' ? '' : moment(values?.fechaIngreso).utc().format('DD-MM-YYYY'))
    const [filtradas, handleFilter] = useFilter()
    const [pagado, setPagado] = useState(false)
    const [pagado2, setPagado2] = useState(true)
    const [id, setid] = useState()

    const handleChangeCheckBox = () => {
        setPagado2(!pagado2)
        setValues({ ...values, pagado: 1 })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const guardarPagado = () => {
        upPagado({ url: '/pagar/', id: id, datos: { fechaPago: (values.fechaPago) ? values.fechaPago : Date.now(), cuenta: values.cuenta, pagado: 1 } })
    }

    const guardarExpte = () => {
        if (values.hasOwnProperty('id')) {
            upPagado({ url: '/pagar/', id: values.id, datos: { orden: values.orden, fechaIngreso: values.fechaIngreso, proveedor: values.proveedor, monto: values.monto, pagado: values.pagado, fechaPago: values.fechaPago, cuenta: values.cuenta, } })
            setPagado2(true)
        } else {
            console.log({ values })
            // subExpte({ url: '/expte', values: values })
            setPagado2(true)
        }
    }


    useEffect(() => {
        if (statusExpte === 'success' || statusDel === 'success' || statuspagado === 'success') {
            refetch()
            resPagado()
            resExpte()
            resDelExpte()
            setPagado(false);
            setValues({})
        }
    }, [statusExpte, statusDel, statuspagado])

    const Pagar = (id, Epagado) => {
        //console.log({ Epagado })
        setid(id)
        if (Epagado === 0 || Epagado === null) {
            setPagado(!pagado)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            // console.log('Entra en else')
            upPagado({ url: '/pagar/', id: id, datos: { fechaPago: null, cuenta: null, pagado: 0 } })
        }
    }

    const cancelar = () => {
        setPagado(false)
        setValues({})
        setPagado2(true)
    }


    const Deleting = (id) => {

        Swal.fire({
            icon: 'question',
            iconColor: '#C13038',
            title: 'Está seguro que desea eliminar?',
            background: '#c9a3a3',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                delExpte({ url: '/delexpte/', id: id })
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

    function debounce(func, delay = 300) {
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
        if (typeof values !== 'undefined') {
            debounceFilter();
        }
    }, [values?.xproveedor, values?.xfechaPago]);

    const debounceFilter = debounce(() => {
        handleFilter(values, data, keyFilter, (keyFilter === 'xproveedor' || keyFilter === 'xfechaPago') ? true : false)
    })

    const [visibleFab, setVisibleFab] = useState(false)

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 150) {
                setVisibleFab(true);
            } else {
                setVisibleFab(false);
            }
        });
    }, []);





    return (
        <>
            <Fab style={{ opacity: visibleFab ? 1 : 0, transition: 'opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1) 0ms', visibility: (visibleFab) ? null : 'hidden' }} aria-label="add" sx={{ position: 'fixed', bottom: 15, right: 5, backgroundColor: '#7E57C2', width: (screenSize.width > 600) ? 35 : 28, height: (screenSize.width > 600) ? 35 : 28 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <KeyboardArrowUpIcon fontSize='small' />
            </Fab>
            <Typography align='center' variant={(screenSize.width > 672) ? 'h3' : 'h6'} sx={{ mt: 2 }}>Expedientes de Pago a Proveedores</Typography>
            <Divider sx={{ mt: 1, mb: 1 }} />
            {!pagado ? <Container>
                <Grid mt={2} sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: (screenSize.width > 672) ? 'row' : 'column' }} >
                    <TextField margin='normal' value={values?.orden || ''} InputProps={{ inputMode: 'numeric', pattern: '[0-9]*', startAdornment: <InputAdornment position="start">{<IconButton size='small' onClick={() => reset('orden')}><ClearIcon fontSize='small' color='error' /></IconButton>}</InputAdornment> }} sx={{ width: { sm: '25%', md: '28%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='number' name='orden' autoComplete='off' multiline={false} onChange={handleInputChange} placeholder='Orden'></TextField>
                    <TextField margin='normal' value={values.fechaIngreso || ''} InputProps={{ startAdornment: <InputAdornment position="start">{<IconButton size='small' onClick={() => reset('fechaIngreso')}><ClearIcon fontSize='small' color='error' /></IconButton>}</InputAdornment> }} sx={{ width: { sm: '25%', md: '28%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='date' name='fechaIngreso' autoComplete='off' multiline={false} onChange={handleInputChange} ></TextField>
                    <TextField margin='normal' value={values?.proveedor || ''} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('proveedor')}><ClearIcon fontSize='small' color='error' /></IconButton></InputAdornment> }} sx={{ width: { sm: '30%', md: '40%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='string' name='proveedor' autoComplete='off' multiline={false} onChange={handleInputChange} placeholder='Proveedor'></TextField>

                </Grid>
                <Grid mt={2} sx={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: (screenSize.width > 672) ? 'row' : 'column' }} >
                    <TextField margin='normal' value={values?.factura || ''} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('proveedor')}><ClearIcon fontSize='small' color='error' /></IconButton></InputAdornment> }} sx={{ width: { sm: '25%', md: '28%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='string' name='factura' autoComplete='off' multiline={false} onChange={handleInputChange} placeholder='Factura'></TextField>
                    <TextField margin='normal' value={values?.monto || ''} InputProps={{ inputMode: 'numeric', pattern: '[0-9]*', startAdornment: <InputAdornment position="start">{<IconButton size='small' onClick={() => reset('monto')}><ClearIcon fontSize='small' color='error' /></IconButton>}</InputAdornment> }} sx={{ width: { sm: '25%', md: '28%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='number' name='monto' autoComplete='off' multiline={false} onChange={handleInputChange} placeholder='Monto'></TextField>

                </Grid>
                <Grid gap={2} sx={{ display: 'flex', justifyContent: 'center', flexDirection: (screenSize.width > 672) ? 'row' : 'column' }} mt={2} >
                    <FormControlLabel control={<Checkbox checked={!pagado2} onChange={() => handleChangeCheckBox()} />} label="Pagado?" />
                    <TextField disabled={pagado2} margin='normal' value={values?.cuenta || ''} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('cuenta')}><ClearIcon fontSize='small' color='error' /></IconButton></InputAdornment> }} sx={{ width: { sm: '30%', md: '28%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='string' name='cuenta' autoComplete='off' multiline={false} onChange={handleInputChange} placeholder='Cuenta'></TextField>
                    <TextField disabled={pagado2} margin='normal' value={values?.fechaPago || ''} InputProps={{ startAdornment: <InputAdornment position="start">{<IconButton size='small' onClick={() => reset('fechaPago')}><ClearIcon fontSize='small' color='error' /></IconButton>}</InputAdornment> }} sx={{ width: { sm: '25%', md: '28%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='date' name='fechaPago' autoComplete='off' multiline={false} onChange={handleInputChange} ></TextField>
                </Grid>
                {/* <TextField margin='normal' value={values?.extracto || ''} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('extracto')}><ClearIcon fontSize='small' color='error' /></IconButton></InputAdornment> }} sx={{ width: { xs: '100%', md: '100%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} name='extracto' autoComplete='off' multiline={true} minRows='5' onChange={handleInputChange} placeholder='Extracto'></TextField> */}
                <Grid sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button size="large" startIcon={<SaveAsIcon fontSize="inherit" />} onClick={() => guardarExpte()}>Guardar</Button>
                    <Button size="large" color='error' startIcon={<ClearIcon fontSize="inherit" />} onClick={() => cancelar()}>Cancelar</Button>
                    <Button color='secondary' size="large" startIcon={<ReplyAllIcon fontSize="inherit" />} onClick={() => navigate(-1)}>Regresar</Button>
                </Grid>
            </Container>
                :
                <Container>
                    <Grid sx={{ display: 'flex', justifyContent: 'space-around' }} mt={2} >
                        <TextField margin='normal' value={values?.cuenta || ''} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('cuenta')}><ClearIcon fontSize='small' color='error' /></IconButton></InputAdornment> }} sx={{ width: { sm: '30%', md: '30%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='string' name='cuenta' autoComplete='off' multiline={false} onChange={handleInputChange} placeholder='Cuenta'></TextField>
                        <TextField margin='normal' value={values?.fechaPago || ''} InputProps={{ startAdornment: <InputAdornment position="start">{<IconButton size='small' onClick={() => reset('fechaPago')}><ClearIcon fontSize='small' color='error' /></IconButton>}</InputAdornment> }} sx={{ width: { sm: '25%', md: '28%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='date' name='fechaPago' autoComplete='off' multiline={false} onChange={handleInputChange} ></TextField>
                    </Grid>
                    <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button size="large" startIcon={<SaveAsIcon fontSize="inherit" />} onClick={() => guardarPagado()}>Agregar Pago</Button>
                        <Button size="large" color='error' startIcon={<ClearIcon fontSize="inherit" />} onClick={() => cancelar()}>Cancelar</Button>
                    </Grid>
                </Container>
            }
            <Divider sx={{ mt: 1 }} />
            <Typography align='center' variant={(screenSize.width > 672) ? 'h3' : 'h6'} sx={{ mt: 1 }}>Buscar</Typography>
            <Divider sx={{ mt: 1, mb: 1 }} />
            <Grid mt={2} gap={1} sx={{ display: 'flex', justifyContent: (screenSize.width > 672) ? 'space-evenly' : null, flexDirection: (screenSize.width > 672) ? 'row' : 'column', alignItems: (screenSize.width > 672) ? null : 'center' }} >
                <TextField sx={{ width: { xs: '50%', sm: '25%', md: '20%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('xproveedor')}><ClearIcon fontSize="small" color='error' /></IconButton></InputAdornment> }} inputProps={{ maxLength: 50, }} type='string' value={values?.xproveedor || ''} name='xproveedor' autoComplete='off' onChange={(e) => { handleInputChange(e); claveFil(e) }} placeholder='Proveedor'></TextField>
                <TextField sx={{ width: { xs: '50%', sm: '25%', md: '20%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('xfechaPago')}><ClearIcon fontSize="small" color='error' /></IconButton></InputAdornment> }} type='date' value={values?.xfechaPago || ''} name='xfechaPago' autoComplete='off' onChange={(e) => { handleInputChange(e); claveFil(e) }}></TextField>
                <Tooltip title='Borrar Filtros'>
                    <IconButton aria-label="delete" color='error' onClick={() => setValues({})}>
                        <DeleteForeverIcon fontSize='small' />
                        <Typography align='center' sx={{ fontSize: 10 }}>Filtros</Typography>
                    </IconButton>
                </Tooltip>
            </Grid>
            <Divider sx={{ mt: 2, mb: 2 }} />
            {useMemo(() => data && <TableContainer component={Paper}  >
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    showFirstButton
                    showLastButton
                    labelRowsPerPage={''}
                    //classes={{'actions..MuiTablePagination-root': {displayedRows: '2'}} }
                    sx={{

                        '.MuiTablePagination-spacer': {
                            flex: 'none',

                        },
                        '.MuiTablePagination-toolbar': {
                            justifyContent: 'center',
                            //color:'#009688',
                            backgroundColor: '#0D3C52',
                        }
                    }}
                />
                <Table id='tabla' stickyHeader size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'>Nº Orden</StyledTableCell>
                            <StyledTableCell align='center'>Fecha</StyledTableCell>
                            <StyledTableCell align='center'>Proveedor</StyledTableCell>
                            <StyledTableCell align='center'>Factura</StyledTableCell>
                            <StyledTableCell align='center'>Monto</StyledTableCell>
                            <StyledTableCell align='center'>Pagado</StyledTableCell>
                            <StyledTableCell align='center'>Fecha Pago</StyledTableCell>
                            <StyledTableCell align='center'>Cuenta</StyledTableCell>
                            <StyledTableCell align='center'>Acciones</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {((filtradas?.length > 0) ? filtradas : data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)).map((row) => (

                            <StyledTableRow key={row.id}>
                                <StyledTableCell align='center'>{row.orden || '-'}</StyledTableCell>
                                <StyledTableCell align='center'>{(row.fechaIngreso !== null) ? moment(row.fechaIngreso).utc().format('DD-MM-YYYY') : '-'}</StyledTableCell>
                                <StyledTableCell align='center'>{row.proveedor}</StyledTableCell>
                                <StyledTableCell align='center'>{row.factura}</StyledTableCell>
                                <StyledTableCell align='center'>{'$ ' + moneda.format(row.monto)}</StyledTableCell>
                                <StyledTableCell align='center'>
                                    <Tooltip title='Pagar?'>
                                        <IconButton size='small' aria-label="delete" color='error' onClick={() => Pagar(row.id, row.pagado)}>
                                            {(row.pagado === 0 || row.pagado === null) ? <ClearIcon fontSize='small' /> : <DoneOutlineIcon fontSize='small' color='success' />}
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableCell>
                                <StyledTableCell align='center'>{row.fechaPago ? moment(row.fechaPago).utc().format('DD-MM-YYYY') : '-'}</StyledTableCell>
                                <StyledTableCell align='center'>{row.cuenta || '-'}</StyledTableCell>
                                <StyledTableCell align='center'>
                                    <Tooltip title='Editar Nota'>
                                        <IconButton aria-label="editar" color='info' onClick={() => { setValues({ ...row }); (row.pagado === 1) ? setPagado2(false) : setPagado2(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Eliminar'>
                                        <IconButton aria-label="delete" color='warning' onClick={() => Deleting(row.id)}>
                                            <DeleteForeverIcon fontSize='small' />
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>, [data, filtradas, page, rowsPerPage])}
        </>
    )
}
