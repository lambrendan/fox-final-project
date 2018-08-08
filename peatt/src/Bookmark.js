import React, { Component } from "react"
import BookmarkPage from "./BookmarkPage.js"
import BookmarkSearch from "./BookmarkSearch.js"
import Video from "./Video.js"

var got = require("got");

class Bookmark extends Component {
    constructor(props) {
        super(props)
        this.state = { videos: [], chosenVideos: [], doneBookmarking: false, numPages: 0, error: false };
    }

    componentWillMount() {
    got.get("http://localhost:3001/api/videos?page=1")
        .then((res) =>{
            var videoObject = JSON.parse(res.body);
            this.setState({ videos: videoObject.videoList, numPages: videoObject.maxPages });
        })
        .catch( function(err){
            console.log('error:', err);
        })
    }

    setVideos = videosObj => {
        this.setState({ videos: videosObj })
    }

    setError = err => {
        this.setState({ error: err })
    }

    handleRandomBookmarks = () => {
        var randomPage = Math.floor( Math.random() * this.state.numPages + 1);
        got.get("http://localhost:3001/api/bookmark/random?page=" + randomPage.toString())
        .then((res) =>{
            var parseVideo = JSON.parse(res.body);
            this.setState({ chosenVideos: this.state.chosenVideos.concat( parseVideo )}) 
        })
        .catch( function(err){
            console.log('error:', err);
        })
    }

    handleFinish = () => {
        this.props.setBookmark( this.state.chosenVideos)
        this.props.history.push('/user/home/');
    }

    handleWatchedClick = uID => {
        this.setState({ chosenVideos: this.state.chosenVideos.concat({"uID":uID, "watched": true })})
    }

    handleHalfClick = uID => {
        this.setState({ chosenVideos: this.state.chosenVideos.concat({"uID":uID, "watched": false })})
    }

    handleWatchedUnclick = uID => {
        var pos = this.state.chosenVideos.findIndex(item => { console.log(item); return item.uID === uID && item.watched === true });
        let temp = this.state.chosenVideos.slice();
        temp.splice( pos, 1)
        this.setState({ chosenVideos: temp})
    }

    handleHalfUnclick = uID => {
        var pos = this.state.chosenVideos.findIndex(item => { console.log(item); return item.uID === uID && item.watched === false });
        let temp = this.state.chosenVideos.slice();
        temp.splice( pos, 1)
        this.setState({ chosenVideos: temp})
    }

    render() {
      console.log(this.state.chosenVideos)
      if ( this.state.error ) {
        return (
          <div>
                <h1> Error Page Doesnt Exist </h1>
                <button onClick={() => { this.setError(false)}}> Go Back </button>
          </div>  
        )
      }
      else {
        return(
          <div>
            <button onClick={this.handleFinish}>Finish</button>
            <button onClick={this.handleRandomBookmarks}>Random</button>
            <BookmarkPage numPages = { this.state.numPages } setVideos = { this.setVideos } setError = { this.setError } />
            <BookmarkSearch />
            <h1> Videos </h1>
                <ul>
                {
                    this.state.videos.map((item, index)=> {
                        return <Video key={index} uID={item.uID} image={item.images.still.FHD} handleWatchedClick = { this.handleWatchedClick } handleHalfClick = { this.handleHalfClick } handleWatchedUnclick = {this.handleWatchedUnclick} handleHalfUnclick = {this.handleHalfUnclick}/>
                    })
                }
                </ul>
          </div>
        )
      }
    }
}
export default Bookmark