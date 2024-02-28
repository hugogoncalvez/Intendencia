import { useContext, useState } from 'react';
import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import { ColorModeContext } from '../context/ThemeContextProvider';

export const landingButtons = () => {

    const { mode } = useContext(ColorModeContext)

    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const images = [
        {
            img: "/agenda.png",
            title: 'Agenda',
            // width: '22%',
            navigate: '/agenda'
        },
        {
            img: "/buscar.png",
            title: 'Buscar',
            // width: '22%',
            navigate: '/buscar'
        },
        {
            img: "/vecino.png",
            title: 'Vecinos',
            // width: '22%',
            navigate: '/vecinos'
        },
        {
            img: "/notas.png",
            title: 'Notas',
            // width: '22%',
            navigate: '/notas'
        },
        {
            img: "/orden_pago.png",
            title: 'Expedientes',
            // width: '22%',
            navigate: '/exptes'
        },
    ];

    const ImageButton = styled(ButtonBase)(({ theme }) => ({
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: mode !== 'dark' ? '#c4bade' : '#222222',
        borderRadius: 30,
        [theme.breakpoints.down('sm')]: {
            width: '100% !important', // Overrides inline-style
            height: '100%',
        },
        '& .MuiImageMarked-root': {
            opacity: 0,
        },
        '&:hover, &.Mui-focusVisible': {
            //zIndex: 1,
            '& .MuiImageBackdrop-root': {
                boxShadow: `1px 1px 9px -5px ${mode !== 'dark' ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,0.75)'}`,
                opacity: 0.3,
            },
            '& .MuiImageMarked-root': {
                opacity: 1,
            },
            // '& .MuiTypography-root': {
            //     border: '3px solid white',
            //     borderRadius: '25px'
            // },
        },
    }));

    const ImageSrc = styled('span')({
        width: '100%',
        height: '100%',
        //position: 'absolute',
        // left: 0,
        // right: 0,
        // top: 0,
        // bottom: 0,
        backgroundColor: mode !== 'dark' ? '#b8aed1' : '#181818',
        backgroundSize: '45%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: 30,
    });

    const Image = styled('span')(({ theme }) => ({
        position: 'absolute',
        // width: 234,
        // height: 270,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
        borderRadius: 30,
    }));

    // const ImageBackdrop = styled('span')(({ theme }) => ({
    //     //  position: 'absolute',
    //      width: 234,
    //      height: 270,
    //     // left: 0,
    //     // right: 0,
    //     // top: 0,
    //     //  bottom: 0,
    //     backgroundColor: mode !== 'dark' ? '#b8aed1' : '#05030a',//theme.palette.common.black,
    //     opacity: mode !== 'dark' ? 0.4 : 0.6,
    //     transition: theme.transitions.create('opacity'),
    //     borderRadius: '40px'
    // }));

    const ImageMarked = styled('span')(({ theme }) => ({
        height: (screenSize.width > 672) ? 2 : 1,
        width: (screenSize.width > 672) ? 34 : 34,
        backgroundColor: mode !== 'dark' ? theme.palette.common.black : theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 17px)',
        transition: theme.transitions.create('opacity'),
    }));

    const TypographyStyle = {

        color: mode !== 'dark' ? 'black' : 'white',
        fontSize: (screenSize.width > 950) ? '1.7rem' : '0.75rem',
        position: 'relative',
        // p: 3,
        pt: (screenSize.width > 672) ? '70%' : '80%',
        // pb: (theme) => `calc(${theme.spacing(1)} + 7px)`,

    }

    return [images, ImageButton, ImageSrc, Image, ImageMarked, TypographyStyle]
}
