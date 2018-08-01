import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import * as sessionActions from "./actions.js"
var got = require('got');


class Video extends Component {
    constructor(props) {
        super(props)
        this.state = { videos: [], chosenVideos: [], chosenFavorites:[], doneBookmarking: false };
    }
    
    componentDidMount() {
      got.get("http://localhost:3001/api/videos")
      .then((res) =>{
        var videoObject = JSON.parse(res.body)
        this.setState({ videos: videoObject.videoList, chosenFavorites: this.props.shows.favorite });
        return;
      })
      .catch( function(err){
        console.log('error:', err);
      })
    }

    handleFinish = () => {
      this.props.actions.bookmark(this.state.chosenVideos, this.state.chosenFavorites)
      this.setState({ doneBookmarking: true})
    }

    handleClick = uID => {
      this.setState({ chosenVideos: this.state.chosenVideos.concat({"uID":uID})})
    }

    render() {
      console.log(this.state);
      if ( this.state.doneBookmarking ) {
        return (
          <div>
            <Redirect to='/signin'/>
          </div>
        )
      }
      else {
        return(
          <div>
            <button onClick={this.handleFinish}>Finish</button>
            <h1> Videos </h1>
              <ul>
              {
                this.state.videos.map((item, index)=> {
                  //var url = '/video/' + item.uID;
                  return <li key={index}><button onClick={() => this.handleClick(item.uID)}>{item.uID}</button></li>
                })
              }
              </ul>
          </div>
        )
      }
    }
}

function mapDispatchToProps(dispatch){
  return {
      actions: bindActionCreators( sessionActions , dispatch)
  }
};

const mapStateToProps = state => ({
  shows: state
})

export default connect(mapStateToProps, mapDispatchToProps)(Video);
