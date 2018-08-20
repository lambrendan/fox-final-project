import React, { Component } from "react"
var got = require("got") 

class BookmarkSearch extends Component {

    handleSearchBar = event => {
        if( event.target.value ) {
          got.get("https://api-staging.fox.com/fbc-content/v1_5/video?videoType=fullEpisode&avoidDefaultQuery=true&itemsPerPage=1000&q=" + event.target.value.toString())
          .then( res => {
            var vidObj = []
            var resObject = JSON.parse(res.body);
            console.log(resObject.member[0])
            for( var index = 0; index < resObject.totalItems; index++) {
              vidObj.push({"uID": resObject.member[index].uID, "images": resObject.member[index].images });
            }
            this.props.setVideos( vidObj)
          })
          .catch( err => {
            console.log(err)
          })
        }
        else {
          got.get("http://localhost:3001/api/videos?page=1")
          .then((res) =>{
            var videoObject = JSON.parse(res.body)
            this.props.setVideos( videoObject.videoList )
            return;
          })
          .catch( function(err){
            console.log('error:', err);
          })
        }
      }

    render() {
        return (
            <div className="form-group" style={{ paddingLeft: '7em', paddingRight: '7em'}}>
                <input 
                className="form-control"
                type="text"
                placeholder="Search Video"
                onChange={ event => {this.handleSearchBar(event)} }
                />
            </div>
        )
    }
}
export default BookmarkSearch