import React, { Component } from "react"
var got = require("got") 

class BookmarkSearch extends Component {

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
        return (
            <div className="form-group">
                <input 
                className="form-control"
                type="text"
                placeholder="Search Video"
                onChange={this.handleSearchBar}
                />
            </div>
        )
    }
}
export default BookmarkSearch