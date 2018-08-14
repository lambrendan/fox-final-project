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
    }

    render() {
        return (
            <div>
                <nav> 
                    <div className='Link-Buttons'>
                        <Link className='Link-Favorites' to={`${this.props.match.path}/favorites`}> 
                            <button className = 'Link-Fav-border'>
                                Start Favoriting 
                            </button>
                        </Link>
                        <Link className='Link-Bookmarks'to={`${this.props.match.path}/bookmark`}> 
                            <button className='Link-Book-border'>
                                Start Bookmarking 
                            </button>
                        </Link>
                    </div>
                </nav>
                <div>
                    <p className='Home-text'> Email: { this.props.email } </p>
                    <p className='Home-text'> Password: { this.props.password } </p>
                    <p className='Home-text'> Favorites:     
                        {
                            this.props.favorites.map( (item, index) => {
                                return <li className='Home-watch' key={index}>{item.showCode}</li>
                            })
                        }   
                    </p>
                    <p className='Home-text'> Bookmarks:     
                        {
                            this.props.bookmarks.map( (item, index) => {
                                console.log(item);
                                return <li className='Home-watch' key={index}>{item.uID}</li>
                            })
                        }   
                    </p>
                </div>
                <div>
                    <button onClick = {()=> {this.sendJson()}} > Done </button>
                </div>
            </div>
       
        )
    }
}

export default Home;