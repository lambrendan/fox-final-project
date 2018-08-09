import React, { Component } from "react";
import got from "got";

class BookmarkSearch extends Component {
    handleSearchBar = event => {
        if (event.target.value) {
          got.get(`https://api-staging.fox.com/fbc-content/v1_5/video?videoType=fullEpisode&q=${event.target.value.toString()}`)
            .then(res => {
              let videos = [];
              for (let i = 0; i < JSON.parse(res.body).totalItems; i++) videos.push({ uID: JSON.parse(res.body).member[i].uID });
              this.setState({ videos });
            })
            .catch(err => console.error(err));
        } else {
          got.get("http://localhost:3001/api/videos?page=1")
            .then(res => {
              this.setState({ videos: JSON.parse(res.body).videoList });
              return;
            })
            .catch(err => console.error(err));
        }
    }

    render() {
      return (
        <div className="form-group">
            <input 
              className="form-control"
              type="text"
              placeholder="Search Video"
              onChange={this.handleSearchBar} />
        </div>
      )
    }
}
export default BookmarkSearch;