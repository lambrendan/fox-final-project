import React, { Component } from 'react'
import { Link } from 'react-router-dom';  

class Header extends Component {
    render() {
        return( 
            <div>
                <h1> Fox Profile Evaluation Tool </h1>
                <Link to="/">Restart</Link>
            </div>
        )
    }
}

export default Header