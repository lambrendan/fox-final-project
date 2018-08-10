import React, { Component } from "react"
import BookmarkPage from "./BookmarkPage.js"
import BookmarkSearch from "./BookmarkSearch.js"
import Video from "./Video.js"
import blankImage from "./noImage.jpg"
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
            console.log(videoObject)
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
        var pos = this.state.chosenVideos.findIndex(item => { return item.uID === uID && item.watched === true });
        let temp = this.state.chosenVideos.slice();
        temp.splice( pos, 1)
        this.setState({ chosenVideos: temp})
        let finalPos = this.props.bookmarks.findIndex( item => { return item.uID === uID && item.watched === true });
        if( finalPos !== -1 ) {
            let finalTemp = this.props.bookmarks.slice();
            finalTemp.splice( finalPos, 1)
            this.props.replaceBookmark( finalTemp )
        } 
    }

    handleHalfUnclick = uID => {
        var pos = this.state.chosenVideos.findIndex(item => { return item.uID === uID && ( item.watched === false || !item.hasOwnProperty("watched"))});
        let temp = this.state.chosenVideos.slice();
        temp.splice( pos, 1)
        this.setState({ chosenVideos: temp})
        let finalPos = this.props.bookmarks.findIndex( item => { return item.uID === uID && ( item.watched === false || !item.hasOwnProperty("watched"))});
        if( finalPos !== -1 ) {
            let finalTemp = this.props.bookmarks.slice();
            finalTemp.splice( finalPos, 1)
            this.props.replaceBookmark( finalTemp )
        } 
        
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
            <BookmarkSearch setVideos = {this.setVideos} />
            <div style={{display: "table", width: "100%"}}>
                <div style={{display: "table-cell", width: "50%"}}>
                    <h1> Videos </h1>
                        <ul>
                        {
                            this.state.videos.map((item, index)=> {
                                var watched = false;
                                var images;
                                for( var i = 0; i < this.state.chosenVideos.length; i++ ) {
                                    if( this.state.chosenVideos[i].uID === item.uID ) {
                                        watched = true;
                                        break;
                                    }
                                }
                                if ( !watched ) {
                                    for ( var j= 0; j < this.props.bookmarks.length; j ++ ) {
                                        if( this.props.bookmarks[j].uID === item.uID ) {
                                            watched = true;
                                            break;
                                        }
                                    }
                                }

                                if( Object.keys( item.images).length === 0 && item.images.constructor === Object ) {
                                    images = blankImage;
                                }
                                else {
                                    images = item.images.still.FHD
                                }
                                return <Video key={index} uID={item.uID} image={images} handleWatchedClick = { this.handleWatchedClick } handleHalfClick = { this.handleHalfClick } handleWatchedUnclick = {this.handleWatchedUnclick} handleHalfUnclick = {this.handleHalfUnclick} watched = {watched}/>
                            })
                        }
                        </ul>
                    </div>
                    <div style={{display: "table-cell", width: "50%"}}>
                        <h2> Bookmarked Videos </h2>
                        <ul>
                            {
                                this.props.bookmarks.map((item, index ) => {
                                    let isWatched;
                                    if( item.watched === true ) {
                                        isWatched = "True"
                                    }
                                    else {
                                        isWatched = "False"
                                    }
                                    return <li key={index} >{item.uID } |  Watched: { isWatched }</li>
                                })
                            }
                            {
                                this.state.chosenVideos.map((item, index ) => {
                                    let isWatched;
                                    if( item.watched === true ) {
                                        isWatched = "True"
                                    }
                                    else {
                                        isWatched = "False"
                                    }
                                    return <li key = {index}> {item.uID} | Watched: { isWatched } </li>
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
export default Bookmark

