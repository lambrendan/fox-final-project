import React, { Component } from "react";
var got = require('got');

class Shows extends Component {
    state = {shows:[]};

    componentDidMount() {
      got.get("http://localhost:3001/api/shows")
      .then( (res) =>{
        var showObject = JSON.parse(res.body)
        this.setState({ shows: showObject.showList });
        return;
      })
      .catch( function(err){
        console.log('error:', err);
      })
    }
  
    render() {
      return(
        <div>
          <h1> Shows </h1>
            <ul>
            {
              this.state.shows.map(function(item, index){
                return <li key={index}>{item.showCode}</li>
              })
            }
            </ul>
        </div>
      )
    }
}
export default Shows;

