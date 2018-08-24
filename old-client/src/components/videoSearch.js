import React, { Component } from "react";

class VideoSearch extends Component {
   
    render() {    
        return (
            <div> 
            <button >Previous Page </button>
            {
                this.props.pageArray.map((item, index)=> {
                  return <button key={index}>{item}</button>
                })
            }
            <button >Next Page</button>
          </div>
        )
    }
}



export default VideoSearch;
