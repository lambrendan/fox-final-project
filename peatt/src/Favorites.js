import React, { Component } from "react"
import Shows from "./Shows.js"
import FavoritePage from "./FavoritePage.js"
import FavoriteSearch from "./FavoriteSearch"
var got = require('got');

class Favorites extends Component {
    constructor( props ) {
        super( props )
        this.state = { allShows: [], shows:[], chosenShows: [], doneFavoriting: false, error: false, isRandom: false };
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

    setIsRandom = boolVal => {
        this.setState({ isRandom: boolVal })
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

    pageError = () => {
        this.setError( false );

    }
  
    handleClick = showCode => {
      this.setState({ chosenShows: this.state.chosenShows.concat({'showCode': showCode})}) 
    }

    handleUnclick = showCode => {
        let pos = this.state.chosenShows.map( item => { return item.showCode }).indexOf(showCode);
        let temp = this.state.chosenShows.slice();
        temp.splice( pos, 1)
        this.setState({ chosenShows: temp})
    }

    handleFinish = () => {
      this.props.setFavorites( this.state.chosenShows )
      this.props.history.push('/user/home/');
    }

    handleRandomFavorites = () => {
        got.get("http://localhost:3001/api/favorite/random")
        .then((res) =>{
            var parseShow = JSON.parse(res.body);
            console.log(parseShow);
            this.setState({ chosenShows: this.state.chosenShows.concat( parseShow )}) 
        })
        .catch( function(err){
            console.log('error:', err);
        })
    }

    render() {
        console.log(this.state.chosenShows)
        if( this.state.error ) {
            return ( 
                <div>
                    <h1> Error Page Doesnt Exist </h1>
                    <button onClick={()=> {this.setError(false)}}> Go Back </button>
                </div>
            )
        }
        else {
            return(
            <div>
                <button onClick={this.handleFinish}>Finish</button>
                <button onClick={this.handleRandomFavorites}>Random</button>

                <FavoriteSearch searchShows = { this.searchShows } />
                <FavoritePage totalPages = {this.state.allShows.length} setShows = {this.setShows} setError = {this.setError} />
                <h1> Shows </h1>
                <ul>
                {
                    this.state.shows.map((item, index) => { 
                        var found = false
                        for( var i = 0; i < this.state.chosenShows.length; i++ ) {
                            if( this.state.chosenShows[i].showCode === item.showCode ) {
                                found = true;
                                break;
                            }
                        }
                        return <Shows key={index} showCode={item.showCode} image={item.images.seriesList.FHD} handleClick = {this.handleClick} handleUnclick = {this.handleUnclick} found = {found} />
                    })
                }
                </ul>
            </div>
            )
        }
      }
    
}
export default Favorites