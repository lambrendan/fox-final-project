import React, { Component } from "react";
var got = require('got');

class Video extends Component {
    constructor(props) {
        super(props)
        this.state = { videos: [] };
    }

    componentDidMount() {
      got.get("http://localhost:3001/api/videos")
      .then((res) =>{
        var videoObject = JSON.parse(res.body)
        this.setState({ videos: videoObject.videoList });
        return;
      })
      .catch( function(err){
        console.log('error:', err);
      })
    }
  
    render() {
      return(
        <div>
          <h1> Videos </h1>
            <ul>
            {
              this.state.videos.map(function(item, index){
                return <li key={index}>{item.uID}</li>
              })
            }
            </ul>
        </div>
      )
    }
}

export default Video;
