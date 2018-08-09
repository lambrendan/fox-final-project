import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import got from "got";


class Home extends Component {
    handleComplete() {
        let infoObject = [], info = { 
            email: this.props.email, 
            password: this.props.password, 
            favorites: this.props.favorites, 
            bookmarks: this.props.bookmarks,
        };
        infoObject.push(info);
        got.post("http://localhost:3001/api/parseJSON", {
            body: { users: JSON.stringify(infoObject) },
            json: true,
        })
        .then( res => {
            console.log(res);
        })
        .catch ( err => {
            console.log(err);
        })
    }

    sendJson = () => {
        this.handleComplete();
        this.props.resetUser();
    }

    render() {
        console.log(this.props)
        return (
            <nav> 
                <div>
                    <Link to={`${this.props.match.path}/favorites`}> Start Favoriting </Link>
                </div>
                <div>
                    <Link to={`${this.props.match.path}/bookmark`}> Start Bookmarking </Link>
                </div>
                <div>
                    <button onClick = {()=> {this.sendJson()}} > Done </button>
                </div>
            </nav>
       
        )
    }
}

export default Home;