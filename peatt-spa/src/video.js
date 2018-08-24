import React, { Component } from "react";
import { Link } from 'react-router-dom';
var got = require('got');


class Video extends Component {
    constructor(props) {
        super(props)
        this.state = { videos: [], isMounted: false };
    }
    
    componentDidMount() {
      this.setState({ isMounted: true });
      got.get("http://localhost:3001/api/videos")
      .then((res) =>{
        var videoObject = JSON.parse(res.body)
        if( this.state.isMounted ) {
          this.setState({ videos: videoObject.videoList });
        }
        return;
      })
      .catch( function(err){
        console.log('error:', err);
      })
    }

    componentWillMount() {
      this.setState({ isMounted: false})
    }

    render() {
      return(
        <div>
          <Link to='/home'>Back to home</Link>
          <h1> Videos </h1>
            <ul>
            {
              this.state.videos.map(function(item, index){
                var url = '/video/' + item.uID;
                return <li key={index}><Link to={url}>{item.uID}</Link></li>
              })
            }
            </ul>
        </div>
      )
    }
}

export default Video;
