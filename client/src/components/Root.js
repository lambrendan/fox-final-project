import React, { Component } from "react";
class Root extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        this.props.bookmark()
        return (
            <div>
                <h1>hey</h1>
                <div>
                    <p> </p>
                </div>
            </div>
        )
    }

}

export default Root;