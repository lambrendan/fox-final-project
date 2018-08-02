import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import * as sessionActions from "./actions.js"

var got = require('got');


class Shows extends Component {
    state = {shows:[], chosenShows: [], doneFavoriting: false };

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
  
    handleClick = showCode => {
      this.setState({ chosenShows: this.state.chosenShows.concat({'showCode':showCode})})
    }

    handleFinish = () => {
      this.props.actions.favorite( this.state.chosenShows )
      this.setState({ doneFavoriting: true})
    }

    render() {
      console.log(this.state);
      if( this.state.doneFavoriting ) {
        return (
          <div>
              <Redirect to="/video" />
          </div>
        )
      }
      else {
        return(
          <div>
            <button onClick={this.handleFinish}>Finish</button>
            <h1> Shows </h1>
              <ul>
              {
                this.state.shows.map((item, index) => { 
                  //var url = '/shows/' + item.showCode;
                  return <li key={index}><button onClick={() => this.handleClick(item.showCode)}>{item.showCode}</button></li>
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

export default connect( null, mapDispatchToProps)(Shows);

