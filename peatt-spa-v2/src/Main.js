import React, { Component } from 'react'
import Shows from "./shows.js"
import Video from "./video.js"
import SignUp from "./signUp.js"
import {Switch, Route} from "react-router-dom"
import SignIn from "./signIn.js"
//import Bookmark from "./bookmark.js"
//import Favorite from "./favorite.js"
import Home from "./Home.js"
class Main extends Component {
    render() {
        return (
            <Switch>
                {/* <Route exact path ='/' component={TODO}/> */}
                <Route path='/signup' component={ SignUp }/>
                <Route exact path='/video' component={ Video }/>
                <Route exact path='/shows' component={ Shows }/>
                <Route path='/home' component={ Home }/>
                <Route path='/signin' component={ SignIn }/>
            </Switch>
        )
    }
}

export default Main;