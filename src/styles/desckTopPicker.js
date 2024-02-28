import { useContext } from 'react';
import { ColorModeContext } from '../context/ThemeContextProvider';

export const desckTopPicker = () => {

  const { mode } = useContext(ColorModeContext)

  const style = {
    layout:
    {
      sx:
      {
        backgroundColor: mode !== 'dark' && '#f0f0f0',
        '& .MuiDayCalendar-weekDayLabel': {
          color: mode !== 'dark' ? '#000000e0' : 'white'
        },
        '& .MuiButtonBase-root.Mui-disabled.MuiPickersDay-root.Mui-disabled.MuiPickersDay-dayWithMargin': {
          color: mode !== 'dark' ? '#4b4848' : '#272626',
          backgroundColor: '#ff000036'
        },
        '& .MuiButtonBase-root.MuiPickersDay-root.MuiPickersDay-dayWithMargin': {
          color: 'black',
          //backgroundColor: '#ff000036'
        },
        '&  .MuiPickersDay-today:not(.Mui-selected)': {
          border: '2px solid rgba(0, 0, 0, 0.6)',
          bgcolor: '#33C380'
        },
        '&  .MuiPickersDay-today:focus': {
          border: '2px solid rgba(0, 0, 0, 0.6)',
          bgcolor: '#33C380'
        },
        '& .MuiButtonBase-root.MuiPickersDay-root:hover': {
          backgroundColor: mode !== 'dark' ? '#636363' : '#3d3d3d'
        },
        '& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected:focus': {
          backgroundColor: mode !== 'dark' ? '#1b76d2' : '#ed3434'
        },
        '& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected:hover': {
          backgroundColor: mode !== 'dark' ? '#094b8f' : '#ef1414'
        }
      }
    },

    day:
    {
      sx:
      {
        color: mode !== 'dark' && 'black',
        backgroundColor: '#b7b4b4',
        fontSize: 15,
      }
    },
  }
  return [style]
}
