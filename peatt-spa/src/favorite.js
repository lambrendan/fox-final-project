import React, { Component } from "react";
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
var got = require('got');

class Favorite extends Component {
    constructor(props) {
        super(props)
        this.state = { email: "", password: "" };
    }

    componentDidMount() {
        this.favoriteShow();
    }

    favoriteShow() {
        var email = this.props.user.email;
        var password = this.props.user.password;
        var showCode = this.props.match.params.showCode;
        got.post("http://localhost:3001/api/favorite/" + showCode, {
            body: {
                "email": email,
                "password": password
            }, json: true
        })
        .then( res => {
            console.log( res);
        })
        .catch ( err => {
            console.log(err);
        })
    }
  
    render() {
        return (
            <div>
                <h1> Favorited! </h1>
                <Link to='/shows'> Back to Shows</Link>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state
})
export default connect(mapStateToProps)(Favorite);

