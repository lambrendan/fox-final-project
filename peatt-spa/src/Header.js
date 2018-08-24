import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Header extends Component {
    render() {
        return(
            <nav>
                <ul>
                    <li><Link to='/signup'> Signup</Link></li>
                    <li><Link to='/signin'> Signin</Link></li>
                </ul>
            </nav>
        )
    }
}

export default Header