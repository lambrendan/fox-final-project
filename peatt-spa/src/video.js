import React, { Component } from "react";
var list = require('./list.js');

class Video extends Component {
    state = { videos: [] };

    componentDidMount() {
        list.getAllShowsList()
        .then()
    }
}