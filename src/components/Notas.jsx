import { Container, Paper } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { TablePagination, Fab, Typography, Divider, Button, IconButton, Table, TableBody, TableContainer, TableHead, TableRow, TextField, InputAdornment, Tooltip } from '@mui/material';
import { useEffect, useState, useMemo, useRef } from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import { useForm } from '../hooks/useForm';
import { UseQuery } from "../hooks/useQuery";
//import { submitNota } from "../hooks/useSubmitNota"
import { useSubmit } from "../hooks/useSubmit";
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



moment.locale()

export const Notas = () => {

  const navigate = useNavigate();


  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, refetch } = UseQuery('notas', '/getnotas', true, 2 * 60 * 1000)
  const { mutate: subNota, status: statusNota, reset: resNota } = useSubmit()
  const { mutate: delNota, status: statusDel, reset: resDelNota } = Delete('DelNota')
  const { mutate: upDestino, status: statusdestino, reset: resDestino } = Update('upDestino')
  const { mutate: upDerivar, status: statusDerivar, reset: resDerivar } = Update('upDerivar')

  const [values, handleInputChange, reset, setValues, keyFilter, claveFil] = useForm()
  const [filtradas, handleFilter] = useFilter()
  const [destino, setDestino] = useState(false)
  const [id, setid] = useState()

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // const emptyRows =    rowsPerPage - Math.min(rowsPerPage, data?.length - page * rowsPerPage);
  //console.log({values})
  //console.log({data})

  const guardarDestino = () => {
    upDestino({ url: '/derivar/', id: id, datos: { fecha_derivada: (values.dFecha) ? values.dFecha : Date.now(), destino: values.destino } })
  }

  const guardarNota = () => {
    if (values.hasOwnProperty('id')) {
      upDestino({ url: '/upNota/', id: values.id, datos: { numero: values.numero, fecha: Date.parse(values.fecha), firmante: values.firmante, extracto: values.extracto } })
    } else {
      subNota({ url: '/nota', values: values })
    }
  }


  useEffect(() => {
    //console.log('entra en useEffect')
    if (statusNota === 'success' || statusDel === 'success' || statusdestino === 'success') {
      // console.log('entra primer if  del useEffect')
      //resetTodos()
      // Object.keys(values).forEach((propiedad) => {
      //   delete values[propiedad];
      // });
      refetch()
      resDestino()
      resNota()
      resDelNota()
      setDestino(false);
      setValues({})

    }
    if (statusDerivar === 'success') {
      refetch()
      resDerivar()
    }
  }, [statusNota, statusDel, statusdestino, statusDerivar])

  const Derivar = (id, estado) => {
    // console.log('derivar');
    //console.log({ destino });
    //console.log({ estado });
    if (estado === 0) {
      setDestino(true);
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setDestino(false);
    }
    setid(id);
    upDerivar({ url: '/derivar/', id: id, datos: { derivada: !estado, fecha_derivada: null, destino: null } })

  }

  const cancelar = () => {
    setDestino(false);
    upDerivar({ url: '/derivar/', id: id, datos: { derivada: 0, fecha_derivada: null, destino: null } })
    //rresetTodos()
    //reset('destino')
    //reset('dFecha')
    setValues({})
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
        delNota({ url: '/deletenota/', id: id })
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
    if (typeof values !== 'undefined') {
      debounceFilter();
    }
  }, [values?.xfirmante, values?.xextracto, values?.xnumero]);

  const debounceFilter = debounce(() => {
    handleFilter(values, data, keyFilter, (keyFilter === 'xfirmante' || keyFilter === 'xextracto' || keyFilter === 'xnumero') ? true : false)
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
      <Typography align='center' variant={(screenSize.width > 672) ? 'h3' : 'h6'} sx={{ mt: 2 }}>Notas</Typography>
      <Divider sx={{ mt: 1, mb: 1 }} />

      {(!destino) ? <Container>
        <Grid mt={2} sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: (screenSize.width > 672) ? 'row' : 'column' }} >
          <TextField margin='normal' value={values?.numero || ''} InputProps={{ inputMode: 'numeric', pattern: '[0-9]*', startAdornment: <InputAdornment position="start">{<IconButton size='small' onClick={() => reset('numero')}><ClearIcon fontSize='small' color='error' /></IconButton>}</InputAdornment> }} sx={{ width: { sm: '25%', md: '28%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='number' name='numero' autoComplete='off' multiline={false} onChange={handleInputChange} placeholder='Número'></TextField>
          <TextField margin='normal' value={values?.fecha || ''} InputProps={{ startAdornment: <InputAdornment position="start">{<IconButton size='small' onClick={() => reset('fecha')}><ClearIcon fontSize='small' color='error' /></IconButton>}</InputAdornment> }} sx={{ width: { sm: '25%', md: '28%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='date' name='fecha' autoComplete='off' multiline={false} onChange={handleInputChange} ></TextField>
          <TextField margin='normal' value={values?.firmante || ''} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('firmante')}><ClearIcon fontSize='small' color='error' /></IconButton></InputAdornment> }} sx={{ width: { sm: '30%', md: '40%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='string' name='firmante' autoComplete='off' multiline={false} onChange={handleInputChange} placeholder='Firmante'></TextField>
        </Grid>
        <TextField margin='normal' value={values?.extracto || ''} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('extracto')}><ClearIcon fontSize='small' color='error' /></IconButton></InputAdornment> }} sx={{ width: { xs: '100%', md: '100%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} name='extracto' autoComplete='off' multiline={true} minRows='5' onChange={handleInputChange} placeholder='Extracto'></TextField>
        <Grid sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button size="large" startIcon={<SaveAsIcon fontSize="inherit" />} onClick={() => guardarNota()}>Guardar</Button>
          <Button size="large" color='error' startIcon={<ClearIcon fontSize="inherit" />} onClick={() => cancelar()}>Cancelar</Button>
          <Button color='secondary' size="large" startIcon={<ReplyAllIcon fontSize="inherit" />} onClick={() => navigate(-1)}>Regresar</Button>
        </Grid>
      </Container>
        :
        <Container>
          <Grid sx={{ display: 'flex', justifyContent: 'space-around' }} mt={2} >
            <TextField margin='normal' value={values?.destino || ''} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('destino')}><ClearIcon fontSize='small' color='error' /></IconButton></InputAdornment> }} sx={{ width: { sm: '30%', md: '41.2%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='string' name='destino' autoComplete='off' multiline={false} onChange={handleInputChange} placeholder='Destino'></TextField>
            <TextField margin='normal' value={values?.dFecha || ''} InputProps={{ startAdornment: <InputAdornment position="start">{<IconButton size='small' onClick={() => reset('fecha')}><ClearIcon fontSize='small' color='error' /></IconButton>}</InputAdornment> }} sx={{ width: { sm: '25%', md: '28%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} type='date' name='dFecha' autoComplete='off' multiline={false} onChange={handleInputChange} ></TextField>
          </Grid>
          <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button size="large" startIcon={<SaveAsIcon fontSize="inherit" />} onClick={() => guardarDestino()}>agregar Destino</Button>
            <Button size="large" color='error' startIcon={<ClearIcon fontSize="inherit" />} onClick={() => cancelar()}>Cancelar</Button>
          </Grid>
        </Container>
      }
      <Divider sx={{ mt: 1 }} />
      <Typography align='center' variant={(screenSize.width > 672) ? 'h3' : 'h6'} sx={{ mt: 1 }}>Buscar</Typography>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Grid mt={2} gap={1} sx={{ display: 'flex', justifyContent: (screenSize.width > 672) ? 'space-evenly' : null, flexDirection: (screenSize.width > 672) ? 'row' : 'column', alignItems: (screenSize.width > 672) ? null : 'center' }} >
        <TextField sx={{ width: { xs: '50%', sm: '25%', md: '20%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('xnumero')}><ClearIcon fontSize="small" color='error' /></IconButton></InputAdornment> }} inputProps={{ maxLength: 50, }} type='string' value={values?.xnumero || ''} name='xnumero' autoComplete='off' onChange={(e) => { handleInputChange(e); claveFil(e) }} placeholder='Número'></TextField>
        <TextField sx={{ width: { xs: '50%', sm: '25%', md: '20%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('xfirmante')}><ClearIcon fontSize="small" color='error' /></IconButton></InputAdornment> }} inputProps={{ maxLength: 50, }} type='string' value={values?.xfirmante || ''} name='xfirmante' autoComplete='off' onChange={(e) => { handleInputChange(e); claveFil(e) }} placeholder='Firmante'></TextField>
        <TextField sx={{ width: { xs: '50%', sm: '25%', md: '20%' }, "& input::placeholder": { fontSize: (screenSize.width < 600) && "11px" } }} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('xextracto')}><ClearIcon fontSize="small" color='error' /></IconButton></InputAdornment> }} inputProps={{ maxLength: 50, }} type='string' value={values?.xextracto || ''} name='xextracto' autoComplete='off' onChange={(e) => { handleInputChange(e); claveFil(e) }} placeholder='Extracto'></TextField>
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
              <StyledTableCell align='center'>Nº Nota</StyledTableCell>
              <StyledTableCell align='center'>Fecha</StyledTableCell>
              <StyledTableCell align='center'>Firmante</StyledTableCell>
              <StyledTableCell align='center'>Extracto</StyledTableCell>
              <StyledTableCell align='center'>Derivada</StyledTableCell>
              <StyledTableCell align='center'>Fecha Derivación</StyledTableCell>
              <StyledTableCell align='center'>Destino</StyledTableCell>
              <StyledTableCell align='center'>Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {((filtradas?.length > 0) ? filtradas : data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)).map((row) => (

              <StyledTableRow key={row.id}>
                <StyledTableCell align='center'>{row.numero}</StyledTableCell>
                <StyledTableCell align='center'>{moment(row.fecha).utc().format('DD-MM-YYYY')}</StyledTableCell>
                <StyledTableCell align='center'>{row.firmante}</StyledTableCell>
                <StyledTableCell align='center'>{row.extracto}</StyledTableCell>
                <StyledTableCell align='center'>
                  <Tooltip title='derivar?'>
                    <IconButton size='small' aria-label="delete" color='error' onClick={() => Derivar(row.id, row.derivada)}>
                      {(row.derivada === 0) ? <ClearIcon fontSize='small' /> : <DoneOutlineIcon fontSize='small' color='success' />}
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell align='center'>{row.fecha_derivada ? moment(row.fecha_derivada).utc().format('DD-MM-YYYY') : '-'}</StyledTableCell>
                <StyledTableCell align='center'>{row.destino || '-'}</StyledTableCell>
                <StyledTableCell align='center'>
                  <Tooltip title='Editar Nota'>
                    <IconButton aria-label="editar" color='info' onClick={() => { setValues({ ...row }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
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
// setValues({ motivo: row.motivo }), setEditando(!editando), setIdEditando(row.id)