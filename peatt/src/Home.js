import React, { Component } from 'react'
import { Link } from 'react-router-dom';
var got = require("got");


class Home extends Component {

    handleComplete() {
        var infoObject = []
        var info = { email: this.props.email, password: this.props.password, favorites: this.props.favorites, bookmarks: this.props.bookmarks };
        infoObject.push( info );
        var finalObj = JSON.stringify(infoObject);
        console.log(finalObj)
        got.post("http://localhost:3001/api/parseJSON", {
            body: {
                users: finalObj
            },
            json: true
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