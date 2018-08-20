import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import "./Home.css"
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
        this.props.history.push( '/' )
    }

    render() {
        return (
            <div>
                <nav> 
                    <div className='Link-Buttons'>
                        <Link className='Link-Favorites' to={`${this.props.match.path}/favorites`}> 
                            <button className="btn btn-outline-light" type="button">
                                Start Favoriting 
                            </button>
                        </Link>
                        <Link className='Link-Bookmarks'to={`${this.props.match.path}/bookmark`}> 
                            <button className="btn btn-outline-light" type="button">
                                Start Bookmarking 
                            </button>
                        </Link>
                    </div>
                </nav>
                <div>
                    <p>
                        <span className='Home-text'> Email:</span>
                        <span className='Home-watch'> { this.props.email } </span>
                    </p>
                    <p>
                        <span className='Home-text'> Password:</span>
                        <span className='Home-watch'> { this.props.password } </span>
                    </p>
                    <p className='Home-text'> Favorites: </p>
                        {
                            this.props.favorites.map( (item, index) => {
                                return <li className='Home-watch' key={index}>{item.showCode}</li>
                            })  
                        }   
                    <p> </p>
                    <p className='Home-text'> Bookmarks: </p>    
                        {
                            this.props.bookmarks.map( (item, index) => {
                                return <li className='Home-watch' key={index}>{item.uID}</li>
                            })
                        }   
                    <p> </p>
                </div>
                <div>
                    <button className="btn btn-info" type='button' onClick = {()=> {this.sendJson()}} > Done </button>
                </div>
            </div>
       
        )
    }
}

export default Home;