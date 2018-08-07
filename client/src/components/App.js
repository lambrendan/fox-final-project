import React, { Component } from 'react';
import '../App.css';
import Header from "./Header.js"
import Main from "./Main.js"


class App extends Component {
  constructor(props) {
    super(props)
    this.state = { bookmark: [], favorites: [], email, password }
  }
  addBoomark( bookmark ) {

  }
  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}

export default App;
