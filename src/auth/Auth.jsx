import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { json, useNavigate } from 'react-router-dom';
import isEmpty from 'validator/lib/isEmpty';
import { getLogin } from "../hooks/useLogin";
import Swal from 'sweetalert2'
import { Stack } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';


function Copyright(props) {
  return (
    // className='animate__animated animate__jackInTheBox'
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#" >
        Informática
      </Link>{' '}
      2023
      {'.'}
    </Typography>
  );
}

//const theme = createTheme();




export const Auth = () => {


  const { mutate, error, isLoading, isSuccess } = getLogin()

  const [ErrUser, setErrUser] = useState(false)
  const [ErrPass, setErrPass] = useState(false)
  const [placeHolderUsuario, setPlaceHolderUsuario] = useState('')
  const [placeHolderPassword, setPlaceHolderPassword] = useState('')

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault()

    setErrUser(false)
    setErrPass(false)

    const dataForm = new FormData(event.currentTarget);

    let user = dataForm.get('usuario').trim();
    let password = dataForm.get('password').trim();
    let emptyUsuario = (isEmpty(user))
    let emptyPassword = (isEmpty(password))

    if (emptyUsuario) {
      Swal.fire({
        icon: 'error',
        text: 'Debe Ingresar un usuario!',
        background: '#19191a',
        color: 'white',
        confirmButtonColor: '#90CAF9',
        // width: '20%'
      }).then(() => {
        setErrUser(true)
      })
    } else if (emptyPassword) {
      Swal.fire({
        icon: 'error',
        text: 'Debe Ingresar una contraseña!',
        background: '#19191a',
        color: 'white',
        confirmButtonColor: '#90CAF9',
        // width:'50%'
      }).then(() => {
        setErrPass(true)
      })
    } else {
      mutate(user, {
        onSuccess: (data) => doLogin(data, password),
        onError: () => console.log(`el Error: ${error}`)
      });
    }

    const doLogin = async (data, password) => {
      if (data.error) {
        setPlaceHolderUsuario('Ingrese un usuario válido')
        setErrUser(true)
      } else if (data.pass === password) {
        sessionStorage.setItem('auth', true);
        sessionStorage.setItem('user', data.usuario);
        navigate('landing');
      }
      else {
        setPlaceHolderPassword('Ingrese una constraseña válida')
        setErrPass(true)

      }
    }
  }

  return (
    <>
      <Grid container component="main" sx={{ height: '100vh', backgroundColor: '#1B1D29', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square mt={5}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Ingresar
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="usuario"
                label="Nombre de Usuario"
                name="usuario"
                autoComplete="user"
                autoFocus
                error={ErrUser}
                helperText={ErrUser && placeHolderUsuario}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label='Contraseña'
                type="password"
                id="password"
                autoComplete="current-password"
                error={ErrPass}
                helperText={ErrPass && placeHolderPassword}
              />
              <Stack>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                >
                  Entrar
                </Button>
                {isLoading && <Box sx={{ width: '100%' }}>
                  <LinearProgress />
                </Box>}
              </Stack>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
