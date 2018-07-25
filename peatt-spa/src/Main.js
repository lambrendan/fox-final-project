import React, { Component } from 'react'
import Shows from "./shows.js"
import Video from "./video.js"
import User from "./user.js"
import {Switch, Route} from "react-router-dom"

class Main extends Component {
    render() {
        return (
            <Switch>
                <Route path='/signup' component={ User }/>
                <Route path='/videos' component={ Video }/>
                <Route path='/shows' component={ Shows }/>
            </Switch>
        )
    }
}

export default Main;