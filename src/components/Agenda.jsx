import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import moment from 'moment';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { UseQuery } from "../hooks/useQuery";
import { Modal, Box, Divider, Button, IconButton, Table, TableBody, TableContainer, TableHead, TableRow, TextField, InputAdornment, Tooltip } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Paper from '@mui/material/Paper';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import ClearIcon from '@mui/icons-material/Clear';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import ContactsIcon from '@mui/icons-material/Contacts';


import { Agendastyle, StyledTableCell, StyledTableRow } from "../styles/styles";
import { Delete } from '../hooks/useDelete';
import { Update } from '../hooks/useUpdate';
import { useForm } from '../hooks/useForm';


moment.locale();


export const Agenda = () => {

  const [values, handleInputChange, reset, setValues] = useForm()
  const [vecino, setVecino] = useState([])
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleOpen = (dni) => {
    setVecino(buscar(dni))
    setOpen(true)
  };

  const [editando, setEditando] = useState(false)
  const [idEditando, setIdEditando] = useState('')
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const navigate = useNavigate();

  const fecha = moment().format('DD/MM/YYYY')

  const { data: vecinos, status: stado } = UseQuery('vecinos', `/vecinos`, true, 2 * 60 * 1000)
  const { data: atemps } = UseQuery('ATemps', `/atemps`, true, 2 * 60 * 1000)

  const { mutate: delAtemps } = Delete('DelAtemps')
  const { mutate: UpAtemps } = Update('UpAtemps')

  const buscar = (dni) => {
    const encontrado = vecinos?.filter(vecino => vecino.dni === dni)
    return encontrado
  }

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
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        delAtemps({ url: '/atemp/', id: id })
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


  const updateAtendido = (id, atendido) => {
    (atendido === 0)
      ? UpAtemps({ url: '/atemps/', id: id, datos: { atendido: 1 } })
      : UpAtemps({ url: '/atemps/', id: id, datos: { atendido: 0 } })
  }


  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={Agendastyle(screenSize)} borderRadius={4}>
          <Typography id="modal-modal-title" variant={(screenSize.width > 672) ? 'h5' : 'body1'} textAlign={'center'}>
            {(vecino[0]?.apellido + ' ' + vecino[0]?.nombre).toUpperCase()}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {'Teléfono: ' + vecino[0]?.telefono}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {'Barrio: ' + vecino[0]?.barrio}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {'Observaciones: ' + vecino[0]?.observaciones}
          </Typography>
        </Box>
      </Modal>
      <Typography align='center' variant={(screenSize.width > 672) ? 'h3' : 'h5'} sx={{ mt: 2 }}>Agenda del día {fecha}</Typography>
      <Divider sx={{ mt: 1 }} />
      <Grid sx={{ alignContent: 'center', justifyContent: 'center', display: 'flex', mt: 5, mb: 5 }}>
        {(!editando) ?
          <Grid mt='15px' sx={{ width: { sm: '100%', md: '100%' }, alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
            <Button size="large" startIcon={<PlaylistAddIcon fontSize="inherit" />} onClick={() => navigate('/atendia')}>
              Agregar
            </Button>
            <Button color='secondary' size="large" startIcon={<ReplyAllIcon fontSize="inherit" />} onClick={() => navigate(-1)}>
              Regresar
            </Button>
          </Grid>
          :
          <Grid sx={{ width: { sm: '80%', md: '80%' }, alignContent: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <TextField value={values?.motivo || ''} InputProps={{ startAdornment: <InputAdornment position="start"><IconButton onClick={() => reset('motivo')}><ClearIcon color='error' /></IconButton></InputAdornment> }} sx={{ width: { sm: '100%', md: '100%' } }} type='string' name='motivo' autoComplete='off' multiline={true} minRows='5' onChange={handleInputChange} placeholder='Motivo'></TextField>
            <Grid sx={{ width: { sm: '100%', md: '100%' }, alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
              <Button size="large" startIcon={<SaveAsIcon fontSize="inherit" />} onClick={() => { UpAtemps({ url: '/atemps/', id: idEditando, datos: { motivo: values.motivo } }), setEditando(!editando), setIdEditando('') }}>
                Guardar Motivo
              </Button>
              <Button size="large" color='error' startIcon={<ClearIcon fontSize="inherit" />} onClick={() => { setEditando(!editando), setIdEditando('') }}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        }
      </Grid>
      {(JSON.stringify(atemps) == '[]' || typeof atemps === 'undefined') ?
        <Typography align='center' variant={(screenSize.width > 672) ? 'h4' : 'h6'} color='red'>No hay agendados para hoy </Typography>
        : <TableContainer component={Paper}  >
          <Table id='tabla' stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <StyledTableCell align='center'>Apellido</StyledTableCell>
                <StyledTableCell align='center'>Nombre</StyledTableCell>
                <StyledTableCell align='center'>Nº DNI</StyledTableCell>
                <StyledTableCell align='center'>Motivo</StyledTableCell>
                <StyledTableCell align='center'>Atendido</StyledTableCell>
                <StyledTableCell align='center'>Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {atemps?.map((row) => (

                <StyledTableRow key={row.id}>
                  {(stado !== 'success') ? <StyledTableCell align='center'>Buscando...</StyledTableCell> : <StyledTableCell align='center'>{((buscar(row.dni))[0]?.apellido || '').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</StyledTableCell>}
                  {(stado !== 'success') ? <StyledTableCell align='center'>Buscando...</StyledTableCell> : <StyledTableCell align='center'>{((buscar(row.dni))[0]?.nombre || '').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</StyledTableCell>}
                  <StyledTableCell align='center'>{row.dni}</StyledTableCell>
                  <StyledTableCell align='center'>{row.motivo || ''}</StyledTableCell>
                  <StyledTableCell align='center'>
                    <Tooltip title='Atendido?'>
                      <IconButton aria-label="delete" color='error' onClick={() => updateAtendido(row.id, row.atendido)}>
                        {(row.atendido === 0) ? <ClearIcon /> : <DoneOutlineIcon color='success' />}
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align='center'>
                    <Tooltip title='Editar motivo'>
                      <IconButton aria-label="editar" color='info' onClick={() => { setValues({ motivo: row.motivo }), setEditando(!editando), setIdEditando(row.id) }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Eliminar'>
                      <IconButton aria-label="delete" color='warning' onClick={() => deleting(row.id)}>
                        <DeleteForeverIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Más Info'>
                      <IconButton aria-label="info" color='success' onClick={() => handleOpen(row.dni)}>
                        <ContactsIcon />
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
