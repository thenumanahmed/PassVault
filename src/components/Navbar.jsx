import React from 'react'

const Navbar = () => {
    return (
        <nav className='bg-emerald-200 flex items-center  justify-between px-5 py-2'>
            <div className='logo font-bold'>Pass<span className='text-green-600'>Vault</span></div>
            {/* <ul className='flex gap-5'>
                <li className='hover:font-bold'> <a href="#">Home</a></li>
                <li className='hover:font-bold'> <a href="#">About</a></li>
                <li className='hover:font-bold'> <a href="#">Contact</a></li>
            </ul> */}
        </nav>
    )
}

export default Navbar
