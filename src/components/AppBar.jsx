import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ColorModeContext } from '../context/ThemeContextProvider';

export default function DenseAppBar() {

  const navigate = useNavigate()

  const { SetColorMode, Theme } = useContext(ColorModeContext)

  const logOut = () => {
    sessionStorage.removeItem('auth')
    sessionStorage.removeItem('user')
    navigate('logout')
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton size='small' onClick={() => logOut()} edge="start" color="inherit" aria-label="menu">
            <LogoutIcon />
          </IconButton>
          <IconButton sx={{ ml: 1 }} onClick={() => SetColorMode.toggleColorMode()} color="inherit">
            {Theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box >
  );
}