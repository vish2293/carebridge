import React from 'react'
import "./style.scss"
import { PATH_LIST } from '../../../constant/path-list'
import Logo from "../Logo"
import { Link } from 'react-router-dom'

const Header = ({ navigate }) => {
    return (
        <header className='site_header'>
            <div className='container'>
                <div className='header_inner'>
                    <Link to={PATH_LIST.home} className='site_logo'><Logo size={32} /></Link>
                    <nav className='site_nav' aria-label='Main'>
                        <a href='/#how'>How it works</a>
                        <Link to={PATH_LIST.contactus}>Contact</Link>
                        <Link to={PATH_LIST.login}>Log in</Link>
                        <button className='site_cta' onClick={() => navigate(PATH_LIST.onBoarding)}>Request support</button>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header
