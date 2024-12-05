import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' 
import Navbar from './Navbar'

const Layout = () =>{
    return (
        <>
            <Toaster />
            <Navbar />
            <div>
                <Outlet />
            </div>
        </>
    )
}

export default Layout