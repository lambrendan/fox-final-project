import React, { Component } from "react";
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

var got = require('got');


class Bookmark extends Component {
    constructor(props ) {
        super(props)
        this.state = { email: "", password: ""};
    }
    
    componentDidMount() {
        this.bookmarkVideo();
    }


    bookmarkVideo() {
        var email = this.props.user.email;
        var password = this.props.user.password;
        var video = this.props.match.params.uID
        got.post("http://localhost:3001/api/bookmarks/"+ video, {
            body: {
                "email": email,
                "password": password
            }, json: true
        })
        .then( res => {
            console.log(res);
        })
        .catch ( err => {
            console.log(err);
        })
    }
  
    render() {
        return(
            <div> 
                <h1> Bookmarked! </h1>
                <Link to='/video'> Back to Videos</Link>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    user: state
})

export default connect(mapStateToProps)(Bookmark);
