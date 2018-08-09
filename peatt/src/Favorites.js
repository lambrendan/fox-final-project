import React, { Component } from "react"
import Shows from "./Shows.js"
import FavoritePage from "./FavoritePage.js"
import FavoriteSearch from "./FavoriteSearch"
import got from "got";

class Favorites extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            allShows: [], 
            shows:[], 
            chosenShows: [], 
            doneFavoriting: false, 
            error: false 
        };
    }

    componentWillMount() {
        got.get("http://localhost:3001/api/shows")
            .then(res => {
                let showObject = JSON.parse(res.body), allShows = [], size = 20;
                for (let i = 0; i < showObject.showList.length; i += size) allShows.push(showObject.showList.slice(i, i + size));
                this.setState({ 
                    allShows, 
                    shows: allShows[0],
                });
                return;
            })
            .catch(err => console.error(err));
    }

    setShows = page => this.setState({ shows: this.state.allShows[page - 1] });

    searchShows = shows => this.setState({ shows });

    setError = error => this.setState({ error });

    pageError = () => this.setError(false);
  
    handleClick = showCode => this.setState({ chosenShows: this.state.chosenShows.concat({ showCode }) });

    handleFinish = () => {
        this.props.setFavorites(this.state.chosenShows)
        this.props.history.push('/user/home/');
    }

    handleRandomFavorites = () => {
        got.get("http://localhost:3001/api/favorite/random")
            .then(res => this.setState({ chosenShows: this.state.chosenShows.concat(JSON.parse(res.body)) }))
            .catch(err => console.error(err));
    }

    render() {
        if (this.state.error) {
            return ( 
                <div>
                    <h1>Error Page Doesnt Exist</h1>
                    <button onClick={() => this.setError(false)}>Go Back</button>
                </div>
            )
        }
        return (
            <div>
                <button onClick={this.handleFinish}>Finish</button>
                <button onClick={this.handleRandomFavorites}>Random</button>
                <FavoriteSearch searchShows = {this.searchShows} />
                <FavoritePage 
                    totalPages = {this.state.allShows.length} 
                    setShows = {this.setShows} 
                    setError = {this.setError} />
                <h1>Shows</h1>
                <ul>
                    {
                        this.state.shows.map((item, index) =>
                            <Shows 
                                key={index} 
                                showCode={item.showCode} 
                                image={item.images.seriesList.FHD} 
                                handleClick = {this.handleClick} />
                        )
                    }
                </ul>
            </div>
        )
    }
}

export default Favorites;