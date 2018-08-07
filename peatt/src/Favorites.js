import React, { Component } from "react"
import Shows from "./Shows.js"
import FavoritePage from "./FavoritePage.js"
import FavoriteSearch from "./FavoriteSearch"
var got = require('got');

class Favorites extends Component {
    constructor( props ) {
        super( props )
        this.state = { allShows: [], shows:[], chosenShows: [], doneFavoriting: false, error: false };
    }

    componentWillMount() {
      got.get("http://localhost:3001/api/shows")
      .then( (res) =>{
        var showObject = JSON.parse(res.body)
        console.log(showObject)
        var pageArray = [];
        var size = 20;
        for ( var i =0; i < showObject.showList.length; i+=size ) {
            pageArray.push( showObject.showList.slice(i, i+size ));
        }
        console.log( showObject.showList )
        this.setState({ allShows: pageArray, shows: pageArray[0] });
        return;
      })
      .catch( function(err){
        console.log('error:', err);
      })
    }

    setShows = page => {
        this.setState({ shows: this.state.allShows[page - 1]})
    }

    searchShows = shows => { 
        this.setState({ shows: shows})
    }

    setError = err => {
        this.setState({ error: err})
    }
  
    handleClick = showCode => {
      this.setState({ chosenShows: this.state.chosenShows.concat({'showCode':showCode})})
    }

    handleFinish = () => {
      this.props.setFavorites( this.state.chosenShows )
      this.props.history.push('/user/home/');
    }

    render() {
        if( this.state.error ) {
            return ( 
                <div>
                    <h1> Error Page Doesnt Exist </h1>
                    <button> Go Back </button>
                </div>
            )
        }
        else {
            return(
            <div>
                <button onClick={this.handleFinish}>Finish</button>
                <FavoriteSearch searchShows = { this.searchShows } />
                <FavoritePage totalPages = {this.state.allShows.length} setShows = {this.setShows} setError = {this.setError} />
                <h1> Shows </h1>
                <ul>
                {
                    this.state.shows.map((item, index) => { 
                    //return <li key={index}><button onClick={() => this.handleClick(item.showCode)}>{item.showCode}</button></li>
                    return <Shows key={index} showCode={item.showCode} image={item.images.seriesList.FHD} handleClick = {this.handleClick} />

                    })
                }
                </ul>
            </div>
            )
        }
      }
    
}
export default Favorites