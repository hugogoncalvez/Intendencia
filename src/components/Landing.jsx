import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


import Typography from '@mui/material/Typography';
import { Container, Divider, Stack } from '@mui/material';
import { landingButtons } from '../styles/landingButtons';
import Atropos from 'atropos/react';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';


export const Landing = () => {

    const [images, ImageButton, ImageSrc, Image, ImageMarked, TypographyStyle] = landingButtons()



    // const hayUser = sessionStorage.getItem('auth')
    // useEffect(() => {
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    // }, [])

    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    //console.log(screenSize)
    const navigate = useNavigate()


    return (
        <>

            <Container maxWidth={false} disableGutters sx={{ height: '100vh' }}>

                <Typography align='center' component="h1" variant={(screenSize.width > 672) ? "h2" : 'h5'} sx={{ mt: 2, mb: 3 }}>
                    Secretaría de Intendencia
                </Typography>

                <Divider sx={{ mb: 5 }} />
                <Stack component={Grid2} spacing={1.5} direction={(screenSize.width > 672) ? 'row' : 'column'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '60%' }}>
                    {images.map((image) => (
                        <Atropos rotateXMax={20} rotateYMax={20} activeOffset={120} shadowScale={0.7} style={{ width: '20%', height: '100%' }} key={image.img} >
                            <ImageButton
                                focusRipple
                                key={image.title}
                                onClick={() => navigate(image.navigate)}
                            >
                                <ImageSrc data-atropos-offset='10' style={{ backgroundImage: `url(${image.img})` }} />

                                {/* <ImageBackdrop className="MuiImageBackdrop-root" /> */}

                                <Image data-atropos-offset='5'>

                                    <Typography
                                        component="span"
                                        sx={{
                                            ...TypographyStyle
                                        }}
                                    >
                                        {image.title}
                                        <ImageMarked className="MuiImageMarked-root" />
                                    </Typography>

                                </Image>
                            </ImageButton>
                        </Atropos>
                    ))}
                </Stack>

                <Divider sx={{ mt: 3 }} />
            </Container>

        </>
    )
}
