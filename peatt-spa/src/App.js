import React, { Component } from 'react';
import './App.css';

class App extends Component {
  
  render() {
    return (
      <div className="PEATT">
        <hl> PEATT </hl>
        <ul className="header">
          <li><a href="/createuser">Create User</a></li>
          <li><a href="/selectvideos">Select Videos</a></li>
          <li><a href="/selectshows">Select Shows</a></li>
         </ul>
      </div>
    );
  }
}

export default App;
