import { Outlet } from 'react-router-dom'
import { Auth } from './auth/Auth';
import DenseAppBar from './components/AppBar';
import { ThemeContextProvider } from './context/ThemeContextProvider';

export const App = () => {
  const auth = sessionStorage.getItem('auth') || 'false'
  return (
    <>
      <ThemeContextProvider>
        <div className="App">
          {(JSON.parse(auth))
            ?
            <>
              <DenseAppBar />
              <Outlet />
            </>
            : <Auth />
          }
        </div>
      </ThemeContextProvider>

    </>
  )
}


