import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import * as sessionActions from "./actions.js"
var got = require('got');


class Video extends Component {
    constructor(props) {
        super(props)
        this.state = { videos: [], chosenVideos: [], chosenFavorites:[], doneBookmarking: false, page: 1 };
    }
    

    pageChange = () => {
      got.get("http://localhost:3001/api/videos?page="+this.state.page.toString())
      .then((res) =>{
        console.log(res.body)
        var videoObject = JSON.parse(res.body)
        this.setState({ videos: videoObject.videoList});
        return;
      })
      .catch( function(err){
        console.log('error:', err);
      })
    }

    componentDidMount() {
      got.get("http://localhost:3001/api/videos?page=1")
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

    handlePageForwardClick = () => {
      this.setState({ page: this.state.page + 1}, () => {
        this.pageChange();
      });
    }

    handlePageBackwardsClick = () => {
      this.setState({ page: this.state.page - 1 }, () => {
        this.pageChange();
      });  
    }

    handleSearchBar = event => {
      if( event.target.value ) {
        got.get("https://api-staging.fox.com/fbc-content/v1_5/video?videoType=fullEpisode&q=" + event.target.value.toString())
        .then( res => {
          var vidObj = []
          var resObject = JSON.parse(res.body);
          for( var index = 0; index < resObject.totalItems; index++) {
            vidObj.push({"uID": resObject.member[index].uID});
          }
          this.setState({ videos: vidObj});
        })
        .catch( err => {
          console.log(err)
        })
      }
      else {
        got.get("http://localhost:3001/api/videos?page=1")
        .then((res) =>{
          var videoObject = JSON.parse(res.body)
          this.setState({ videos: videoObject.videoList });
          return;
        })
        .catch( function(err){
          console.log('error:', err);
        })
      }
    }

    render() {
      console.log(this.state)
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
            <div>
              <button onClick={this.handlePageForwardClick}>Next Page</button>
              <button onClick={this.handlePageBackwardsClick}>Previous Page </button>
            </div>
            <div className="form-group">
              <input 
                className="form-control"
                type="text"
                placeholder="Video"
                onChange={this.handleSearchBar}
              />
            </div>
            <h1> Videos </h1>
              <ul>
              {
                this.state.videos.map((item, index)=> {
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
