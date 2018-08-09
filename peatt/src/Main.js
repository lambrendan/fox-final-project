import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import User from "./User.js";
import Root from "./Root.js";
import Home from "./Home.js";
import Favorites from "./Favorites";
import Bookmark from "./Bookmark";

class Main extends Component {
    render() {
        return ( 
            <div>
                <Switch>
                     <Route 
                        exact path='/' 
                        component={Root} />
                     <Route 
                        exact path='/user' 
                        render={props => 
                            <User 
                                {...props} 
                                setUserInfo={this.props.setUserInfo} 
                                setBookmark={this.props.setBookmark} 
                                setFavorites={this.props.setFavorites} />} />
                     <Route 
                        exact path='/user/home' 
                        render={props => 
                            <Home 
                                {...props} 
                                email={this.props.email} 
                                password={this.props.password} 
                                favorites={this.props.favorites} 
                                bookmarks={this.props.bookmarks} 
                                setBookmark={this.props.setBookmark} 
                                setFavorites={this.props.setFavorites} 
                                resetUser={this.props.resetUser} />} />
                     <Route 
                        path= '/user/home/favorites' 
                        render={props => <Favorites {...props} setFavorites={this.props.setFavorites} /> }/>
                     <Route 
                        path='/user/home/bookmark' 
                        render={props => <Bookmark {...props}  setBookmark = {this.props.setBookmark} /> }/>
                </Switch>
            </div>
        );
    }
}

export default Main;