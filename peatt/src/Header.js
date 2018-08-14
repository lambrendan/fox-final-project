import React, { Component } from 'react'
import { Link } from 'react-router-dom';  
import "./Header.css"

class Header extends Component {
    render() {
        return( 
            <div className="Header" >
                <h1 className="Header-Title"> Fox Profile Evaluation Tool </h1>
                <Link to="/" onClick={() => { this.props.resetUser() }} style={{ color: 'white', borderStyle: 'solid', borderWidth: 0.1 }}>
                    <button>
                        Restart
                    </button>
                </Link>
            </div>
        )
    }
}

export default Header
