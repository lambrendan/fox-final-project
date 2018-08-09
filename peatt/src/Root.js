import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Root extends Component {
    render() {
        return (
            <div>
                <p> Start by clicking below </p>
                <Link to='/user'>Start here</Link>
            </div>
        )
    }
}

export default Root;