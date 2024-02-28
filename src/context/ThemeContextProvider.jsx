import { createContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { esES } from '@mui/material/locale';


export const ColorModeContext = createContext()

export const ThemeContextProvider = ({ children }) => {

  

  const [mode, setMode] = useState('dark');

  const SetColorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const Theme = useMemo(
    () => createTheme({
      palette: {
        mode: mode,
        primary: {
          light: '#4791db',
          main: '#706e96',//'#1b76d2',
          dark: '#002884',
          contrastText: '#fff',
        },
        secondary: {
          light: '#33ab9f',
          main: '#009688',
          dark: '#115293',
          contrastText: '#000',
        },
        background: {
          default: mode === 'dark' ? '#121212' : '#FAFAFA',
          paper: '#121212',
        },
      },
    },
      esES
    ));


  return (
    <ColorModeContext.Provider value={{ SetColorMode, Theme, mode }}>
      <ThemeProvider theme={Theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
