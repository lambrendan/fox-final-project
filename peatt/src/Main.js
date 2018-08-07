import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import User from "./User.js"
import Root from "./Root.js"
import Home from "./Home.js"
import Favorites from "./Favorites"
import Bookmark from "./Bookmark"

class Main extends Component {
    render() {
        console.log(this.props)
        return( 
            <div>
                <Switch>
                     <Route exact path = '/' component ={ Root }/>
                     <Route exact path = '/user' render = { (props) => <User { ...props} setUserInfo = {this.props.setUserInfo} setBookmark = {this.props.setBookmark} setFavorites={this.props.setFavorites} /> } />
                     <Route exact path='/user/home' render = { (props) => <Home { ...props} setBookmark = {this.props.setBookmark} setFavorites={this.props.setFavorites} /> } />
                     <Route path= '/user/home/favorites' render = { (props) => <Favorites { ...props} setFavorites={this.props.setFavorites} /> }/>
                     <Route path='/user/home/bookmark' render = { (props) => <Bookmark { ...props}  setBookmark = {this.props.setBookmark} /> }/>
                </Switch>
            </div>
        )
    }
}

export default Main;