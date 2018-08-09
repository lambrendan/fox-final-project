import React, { Component } from "react"
import BookmarkPage from "./BookmarkPage.js"
import BookmarkSearch from "./BookmarkSearch.js"
import Video from "./Video.js"

let got = require("got");

class Bookmark extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            videos: [], 
            chosenVideos: [], 
            doneBookmarking: false, 
            numPages: 0, 
            error: false 
        };
    }

    componentWillMount() {
        got.get("http://localhost:3001/api/videos?page=1")
            .then(res => {
                let videoObject = JSON.parse(res.body);
                this.setState({ 
                    videos: videoObject.videoList, 
                    numPages: videoObject.maxPages 
                });
            })
            .catch(err => console.error(err));
    }

    setVideos = videos => this.setState({ videos });

    setError = error => this.setState({ error });

    handleRandomBookmarks = () => {
        let randomPage = Math.floor( Math.random() * this.state.numPages + 1);
        got.get("http://localhost:3001/api/bookmark/random?page=" + randomPage.toString())
            .then(res => this.setState({ chosenVideos: this.state.chosenVideos.concat(JSON.parse(res.body)) }))
            .catch(err => console.error(err));
    }

    handleFinish = () => {
        this.props.setBookmark(this.state.chosenVideos)
        this.props.history.push('/user/home/');
    }

    handleWatchedClick = uID => {
        this.setState({ 
            chosenVideos: this.state.chosenVideos.concat({ 
                uID, 
                watched: true,
            }),
        });
    }

    handleHalfClick = uID => this.setState({ chosenVideos: this.state.chosenVideos.concat({ uID })});

    render() {
      if (this.state.error) {
        return (
          <div>
                <h1>Error Page Doesnt Exist</h1>
                <button onClick={() => this.setError(false)}>Go Back</button>
          </div>  
        )
      } else {
        return (
          <div>
            <button onClick={this.handleFinish}>Finish</button>
            <button onClick={this.handleRandomBookmarks}>Random</button>
            <BookmarkPage 
                numPages = { this.state.numPages } 
                setVideos = { this.setVideos } 
                setError = { this.setError } />
            <BookmarkSearch />
            <h1>Videos</h1>
                <ul>
                {
                    this.state.videos.map((item, index) => 
                        <Video 
                            key={index} 
                            uID={item.uID} 
                            image={item.images.still.FHD} 
                            handleWatchedClick = { this.handleWatchedClick } 
                            handleHalfClick = { this.handleHalfClick } />
                    )
                }
                </ul>
          </div>
        )
      }
    }
}
export default Bookmark;