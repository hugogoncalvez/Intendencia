import moment from 'moment';
import es from 'date-fns/locale/es';
import { parseISO } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import ClearIcon from '@mui/icons-material/Clear';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { Button, Divider, IconButton, InputAdornment, Table, TableBody, TableContainer, TableHead, TextField, Tooltip } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';

import { useForm } from '../hooks/useForm';
import { useFilter } from '../hooks/useFilter';
import { UseQuery } from '../hooks/useQuery';
import { StyledTableCell, StyledTableRow } from '../styles/styles';
import { desckTopPicker } from '../styles/desckTopPicker';

moment.locale();

export const Buscar = () => {

  const navigate = useNavigate();

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { data: vecinos, status: stado } = UseQuery('vecinos', `/vecinos`, true, 2 * 60 * 1000)
  const { data: allAtemps } = UseQuery('ATempsbuscar', `/allatemps`, true, 2 * 60 * 1000)

  const [values, handleInputChange, reset, setValues, keyFilter, claveFil, setKeyFilter] = useForm()
  const [filtradas, handleFilter, setFiltradas] = useFilter()

  const handleChangeFN = (newValue = Date || null) => {
    setFiltradas(null)
    setValues({ ...values, createdAt: moment(newValue).format('YYYY-MM-DD') })
    setKeyFilter('createdAt')
  };

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
  }, [values]);

  const debounceFilter = debounce(() => {
    handleFilter(values, allAtemps, keyFilter, (keyFilter === 'apellido') ? true : false)
  })

  const buscar = (dni) => {
    let encontrado = []
    encontrado = vecinos?.filter(vecino => vecino.dni === dni)
    return encontrado
  }

  const [style] = desckTopPicker()

  return (
    <>
      <Typography align='center' variant={(screenSize.width > 672) ? 'h3' : 'h5'} sx={{ mt: 2 }}>Buscar Atenciones</Typography>
      <Divider sx={{ mt: 1 }} />
      <Grid mt='15px' sx={{ width: { sm: '100%', md: '100%' }, alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
        <Button color='secondary' size="large" startIcon={<ReplyAllIcon fontSize="inherit" />} onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </Grid>
      <Grid sx={{ flexDirection: (screenSize.width > 672) ? 'row' : 'column', alignContent: 'center', justifyContent: 'space-around', display: 'flex', mt: 5, mb: 5 }}>
        <TextField value={values?.dni || ''} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('dni')}><ClearIcon fontSize='small' color='error' /></IconButton></InputAdornment> }} autoFocus type='number' name='dni' autoComplete='off' placeholder='Nº de DNI' onChange={(e) => { handleInputChange(e); claveFil(e) }} onInput={(e) => { e.target.value = (e.target.value).toString().slice(0, 8) }}></TextField>
        <TextField InputProps={{ startAdornment: <InputAdornment position="start"><IconButton size='small' onClick={() => reset('apellido')}><ClearIcon fontSize='small' color='error' /></IconButton></InputAdornment> }} inputProps={{ maxLength: 50, style: { textTransform: 'capitalize' } }} type='string' value={values?.apellido || ''} name='apellido' autoComplete='off' onChange={(e) => { handleInputChange(e); claveFil(e) }} placeholder='Apellido'></TextField>
        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns} >
          <DesktopDatePicker
            name='createdAt'
            sx={{ '& .MuiButtonBase-root-MuiPickersDay-root': { backgroundColor: 'red' } }}
            views={['year', 'month', 'day']}
            disableFuture
            value={(typeof values?.createdAt === 'undefined') ? '' : parseISO(values?.createdAt)}
            onChange={handleChangeFN}
            slotProps={{ ...style }}
          />
        </LocalizationProvider>
        <InputAdornment position='start' sx={{ position: 'absolute', right: (screenSize.width > 672) ? '9.3%' : '50%', mt: (screenSize.width > 672) ? 3.5 : 13.6 }} ><IconButton onClick={() => reset('createdAt')}><ClearIcon color='error' /></IconButton></InputAdornment>
      </Grid>
      <Divider sx={{ mt: 1, mb: 2 }} />
      {(JSON.stringify(filtradas) === '[]') ?
        <Typography align='center' variant={(screenSize.width > 672) ? 'h4' : 'h5'} color={!((typeof values === 'undefined' || JSON.stringify(values) === '{}') && JSON.stringify(filtradas) === '[]') ? 'error' : 'darkgoldenrod'}>{(typeof values === 'undefined' || JSON.stringify(values) === '{}') ? 'Seleccione un parámetro de busqueda' : ((!(JSON.stringify(values) !== '{}' || typeof values === 'undefined')) && (JSON.stringify(filtradas) === '[]')) ? '' : 'No hay resultados para la busqueda'}</Typography>
        : (JSON.stringify(filtradas) === 'null')
          ? <></>
          : <TableContainer component={Paper}  >
            <Table id='tabla' stickyHeader size="small" aria-label="a dense table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align='center'>Fecha</StyledTableCell>
                  <StyledTableCell align='center'>Apellido</StyledTableCell>
                  <StyledTableCell align='center'>Nombre</StyledTableCell>
                  <StyledTableCell align='center'>Nº DNI</StyledTableCell>
                  <StyledTableCell align='center'>Teléfono</StyledTableCell>
                  <StyledTableCell align='center'>Barrio</StyledTableCell>
                  <StyledTableCell align='center'>Obs</StyledTableCell>
                  <StyledTableCell align='center'>Motivo</StyledTableCell>
                  <StyledTableCell align='center'>Atendido</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {filtradas?.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align='center'>{moment(row.createdAt).utc().format('DD-MM-YYYY')}</StyledTableCell>
                    {(stado !== 'success') ? <StyledTableCell align='center'>Buscando...</StyledTableCell> : <StyledTableCell align='center'>{((buscar(row.dni))[0]?.apellido || '').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</StyledTableCell>}
                    {(stado !== 'success') ? <StyledTableCell align='center'>Buscando...</StyledTableCell> : <StyledTableCell align='center'>{((buscar(row.dni))[0]?.nombre || '').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</StyledTableCell>}
                    <StyledTableCell align='center'>{row.dni}</StyledTableCell>
                    {(stado !== 'success') ? <StyledTableCell align='center'>Buscando...</StyledTableCell> : <StyledTableCell align='center'>{(buscar(row.dni))[0]?.telefono || ''}</StyledTableCell>}
                    {(stado !== 'success') ? <StyledTableCell align='center'>Buscando...</StyledTableCell> : <StyledTableCell align='center'>{(buscar(row.dni))[0]?.barrio || ''}</StyledTableCell>}
                    {(stado !== 'success') ? <StyledTableCell align='center'>Buscando...</StyledTableCell> : <StyledTableCell align='center'>{(buscar(row.dni))[0]?.observaciones || ''}</StyledTableCell>}
                    <StyledTableCell align='center'>{row.motivo || ''}</StyledTableCell>
                    <StyledTableCell align='center'>
                      <Tooltip title='Atendido?'>
                        {(row.atendido === 0) ? <ClearIcon color='error' /> : <DoneOutlineIcon color='success' />}
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
