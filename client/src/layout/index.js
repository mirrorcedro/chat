import React from 'react'
import logo from '../assets/spotvibelogo.png'

const AuthLayouts = ({children}) => {
  return (
    <>
        <header className='flex justify-center items-center py-3 h-20 shadow-md bg-white'>
            <img 
              src={logo}
              alt='logo'
              width={100}
              height={40}
            />
        </header>

        { children }
    </>
  )
}

export default AuthLayouts
