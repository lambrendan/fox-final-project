import React, { Component } from "react";
var list = require('./list.js');

class Shows extends Component {
    state = { shows: [] }

    componentDidMount() {
        list.getSeriesList()
        .then()
    }
}

