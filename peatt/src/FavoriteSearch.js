import React, { Component } from "react";
import got from "got";

class FavoriteSearch extends Component {
  constructor(props) {
    super(props);
  }

  handleSearchBar = event => {
    if (event.target.value) {
      got.get(`https://api-staging.fox.com/fbc-content/v1_5/series?q=${event.target.value.toString()}`)
        .then(res => {
          let showObj = [];
          for (let i = 0; i < JSON.parse(res.body).totalItems; i++) showObj.push({
            showCode: JSON.parse(res.body).member[i].showCode, 
            images: JSON.parse(res.body).member[i].images
          });
          this.props.searchShows(showObj);
        })
        .catch(err => {
          console.log(err)
        })
    } else {
        got.get("http://localhost:3001/api/shows")
          .then(res => this.props.searchShows(JSON.parse(res.body).showList.slice(0, 20)))
          .catch(err => console.error(err));
    }
  }

  render() {
    return( 
        <div className="form-group">
          <input 
            className="form-control"
            type="text"
            placeholder="Search Series"
            onChange={e => this.handleSearchBar(e)} />
        </div>
    )
  }
}

export default FavoriteSearch;