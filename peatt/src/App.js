import React, { Component } from 'react';
import Header from "./Header.js"
import Main from "./Main.js"
import Footer from "./Footer.js"
import './App.css';


class App extends Component {
  constructor( props ) {
    super(props);
    this.state = { email: "", password:"", bookmarks: [], favorites: []}
  }

  resetUser = () => {
    this.setState({ email: "", password:"", bookmarks: [], favorites: []})
  }

  setUserInfo =  (emailInfo, passwordInfo) => {
    this.setState({ email: emailInfo, password: passwordInfo })
  }

  setBookmark = bookmarkArray => {
    this.setState({ bookmarks: bookmarkArray })
  }

  setFavorites = favoriteArray => {
    this.setState({ favorites: favoriteArray })
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <Header resetUser = { this.resetUser }/>
        <Main {...this.state} setUserInfo = {this.setUserInfo} setBookmark = {this.setBookmark} setFavorites = {this.setFavorites} resetUser = {this.resetUser} />
        <Footer />
      </div>
    );
  }
}

export default App;
