import React, { Component } from 'react'
import Shows from "./shows.js"
import Video from "./video.js"
import SignUp from "./signUp.js"
import SignIn from "./signIn.js"
import Home from "./Home.js"
import {Switch, Route} from "react-router-dom"

class Main extends Component {
    render() {
        return (
            <Switch>
                <Route path='/signup' component={ SignUp }/>
                <Route path='/signin' component={ SignIn }/>
                <Route path='/video' component={ Video }/>
                <Route path='/shows' component={ Shows }/>
                <Route path='/home' component={ Home }/>
            </Switch>
        )
    }
}

export default Main;