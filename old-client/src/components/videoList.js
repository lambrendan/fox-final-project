import React, { Component } from "react";

class VideoList extends Component {
    constructor(props) {
        super(props)
        this.title = props.title;
        this.image = props.image;
        this.state = { videos: [], chosenVideos: [], chosenFavorites:[], doneBookmarking: false, page: 1, numPages: 0, pageArray: [] };
    }

    componentWillMount() {
        
    }
    render() {
        return (
          <div>
            <p> {this.title} </p>
            <img src={this.image} style={{width: 250}}/>
            <div>
                <button>Watched</button>
                <button>Partially Watched</button>
            </div>
          </div>  
        )
    }
}



export default VideoList;
