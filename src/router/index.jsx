import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from '../App';
import { Agenda } from '../components/Agenda';
import { AtenDia } from '../components/AtenDia';
import { Landing } from '../components/Landing';
import { Buscar } from '../components/Buscar';
import { Vecinos } from '../components/Vecinos';
import { Notas } from '../components/Notas';
import { Expedientes } from "../components/Expedientes";
import { Prueba } from "../components/prueba";
import { Auth } from '../auth/Auth';



export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Landing /> },
      { path: 'agenda', element: <Agenda />, },
      { path: 'atendia', element: <AtenDia /> },
      { path: 'buscar', element: <Buscar /> },
      { path: 'vecinos', element: <Vecinos /> },
      { path: 'notas', element: <Notas /> },
      { path: 'exptes', element: <Expedientes /> },
      { path: 'prueba', element: <Prueba /> },
    ]
  },
  { path: '*', element: <Navigate to="/" />, },
  {
    path: 'logout',
    element: <Navigate to="/" />,
  },
]);

