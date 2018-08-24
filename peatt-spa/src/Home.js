import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Home extends Component {
    render() {
        return(
            <nav>
                <ul>
                    <li><Link to='/video'> Bookmark Video</Link></li>
                    <li><Link to='/shows'> Favorite a show</Link></li>
                </ul>
            </nav>
        )
    }
}

export default Home