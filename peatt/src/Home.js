import React, { Component } from 'react'
import { Link } from 'react-router-dom';


class Home extends Component {

    render() {
  
        return (
            <nav> 
                <div>
                    <Link to={`${this.props.match.path}/favorites`}> Start Favoriting </Link>
                </div>
                <div>
                    <Link to={`${this.props.match.path}/bookmark`}> Start Bookmarking </Link>
                </div>
            </nav>
       
        )
    }
}

export default Home;