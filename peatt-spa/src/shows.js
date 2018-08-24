import React, { Component } from "react";
import { Link } from 'react-router-dom'
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
          <Link to='/home'>Back to home</Link>
          
          <h1> Shows </h1>
            <ul>
            {
              this.state.shows.map(function(item, index){
                var url = '/shows/' + item.showCode;
                return <li key={index}><Link to={url}>{item.showCode}</Link></li>
              })
            }
            </ul>
        </div>
      )
    }
}
export default Shows;

