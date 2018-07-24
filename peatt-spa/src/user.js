import React, { Component } from "react";


class User extends Component {
    state = { 
        users: '', 
        password: '', 
        profileID: '', 
        accessToken: '' 
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="form-inline">
                <h2> Sign-Up </h2>
                <div className="form-group">
                    <input 
                        className="form-control"
                        type="text"
                        placeholder="email"
                    />
                    <input
                        className="form-control"
                        type="password"
                        placeholder="password"
                    />
                    <button 
                        className = "btn btn-primary"
                        type="button"
                    >
                    Sign-Up
                    </button>
                </div>    
            </div>
        )
    }
}

export default User;