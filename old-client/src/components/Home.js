import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Home extends Component {
    render() {
        return(
            <nav>
                <h1> Start here </h1>
                <Link to='/shows'> Favorite a show</Link>
            </nav>
        )
    }
}

export default Home