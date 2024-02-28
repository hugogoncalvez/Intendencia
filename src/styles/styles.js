import { styled } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const ancho = window.innerWidth

const StyledTableCell = styled(TableCell)(({ theme }) => ({


    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#0D3C52',
        color: theme.palette.common.white,
        fontSize: (ancho > 499) ? 14 : 10,
        width: "auto",
        padding: (ancho > 499) ? "none" : 1,
        border: '1px solid #acacac',

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: (ancho > 499) ? 13 : 9,
        border: '1px solid #acacac',
        width: "auto",
        padding: (ancho > 499) ? "none" : 1,
        color: theme.palette.common.white,
    },

}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: '#808080'//theme.palette.action.hover,
    },
    // hide last border
    // '&:last-child td, &:last-child th': {
    //     border: 0,
    // },
}));

const theme = createTheme({
    status: {
        danger: '#FECF19',
    },
    palette: {
        pago: {
            main: '#598453',
            darker: '#053e85',
        },
        editar: {
            main: '#651f71',
            contrastText: '#fff',
        },
        hijos: {
            main: '#182747',
            contrastText: '#fff',
        }
    },
});

const Agendastyle = (screenSize) => {
    return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: (screenSize.width > 672) ? 400 : 300,
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 24,
        p: 4,
    }
};

export { StyledTableCell, StyledTableRow, Agendastyle }