import React, { Component } from 'react';
import Header from "./Header.js"
import Main from "./Main.js"
import Footer from "./Footer.js"
import './App.css';

class App extends Component {
  constructor( props ) {
    super(props);
    this.state = { email: "", password:"", bookmark: [], favorites: []}
  }

  setUserInfo =  (emailInfo, passwordInfo) => {
    this.setState({ email: emailInfo, password: passwordInfo })
  }

  setBookmark = bookmarkArray => {
    this.setState({ bookmark: bookmarkArray })
  }

  setFavorites = favoriteArray => {
    this.setState({ favorites: favoriteArray })
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <Header />
        <Main setUserInfo = {this.setUserInfo} setBookmark = {this.setBookmark} setFavorites = {this.setFavorites} />
        <Footer />
      </div>
    );
  }
}

export default App;
