import React, { Component } from "react"
import Shows from "./Shows.js"
import FavoritePage from "./FavoritePage.js"
import FavoriteSearch from "./FavoriteSearch"
import blankImage from "./noImage.jpg"
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
        var pageArray = [];
        var size = 20;
        for ( var i =0; i < showObject.showList.length; i+=size ) {
            pageArray.push( showObject.showList.slice(i, i+size ));
        }
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
        
        let finalPos = this.props.favorites.map( item => { return item.showCode}).indexOf(showCode);
        if( finalPos !== -1 ) {
            let finalTemp = this.props.favorites.slice();
            finalTemp.splice( finalPos, 1)
            this.props.replaceFavorites( finalTemp )
        } 
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
                    <h1 style={{ color: 'white'}}> Error Page Doesnt Exist </h1>
                    <button className= "btn btn-light" type='button' onClick={()=> {this.setError(false)}}> Go Back </button>
                </div>
            )
        }
        else {
            return(
            <div>
                <div style={{ marginTop: '10px' ,marginBottom: '10px'}}>
                    <button className= "btn btn-danger" type='button' onClick={this.handleFinish}>Finish</button>
                </div>
                <div style={{ marginBottom: '10px'}}>
                    <button className= "btn btn-secondary" type='button' onClick={this.handleRandomFavorites}>Random</button>
                </div>

                <FavoriteSearch searchShows = { this.searchShows } />
                <FavoritePage totalPages = {this.state.allShows.length} setShows = {this.setShows} setError = {this.setError} />
                <div style={{display: "table", width: "100%"}}>
                    <div style={{display: "table-cell", width: "50%"}}>
                        <h1 style={{ color: 'white'}}> Shows </h1>
                        <ul style = {{padding: '100'}}>
                        {
                            this.state.shows.map((item, index) => { 
                                var found = false
                                var images;
                                for( var i = 0; i < this.state.chosenShows.length; i++ ) {
                                    if( this.state.chosenShows[i].showCode === item.showCode ) {
                                        found = true;
                                        break;
                                    }
                                }
                                if ( !found ) {
                                    for ( var j= 0; j < this.props.favorites.length; j ++ ) {
                                        if( this.props.favorites[j].showCode === item.showCode ) {
                                            found = true;
                                            break;
                                        } 
                                    }
                                }

                                if( Object.keys( item.images).length === 0 && item.images.constructor === Object ) {
                                    images = blankImage;
                                }
                                else {
                                    images = item.images.seriesList.FHD
                                }
                                return <li key={index} style = {{margin: 5}} ><Shows key={index} showCode={item.showCode} image={images} handleClick = {this.handleClick} handleUnclick = {this.handleUnclick} found = {found} /> </li>
                            })
                        }
                        </ul>
                    </div>
                    <div style={{display: "table-cell", width: "50%"}}>
                        <h2 style={{ color: 'white'}}> Favorited Shows </h2>
                        <ul style={{ listStyle: 'none' }} >
                            {
                                this.props.favorites.map((item, index ) => {
                                    return <li key={index} style={{ color: 'white'}} >{item.showCode }</li>
                                })
                            }
                            {
                                this.state.chosenShows.map((item, index ) => {
                                    return <li key = {index} style={{ color: 'white'}}> {item.showCode} </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
            )
        }
      }
    
}
export default Favorites