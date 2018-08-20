import React, { Component } from "react"
var got = require("got");

class FavoriteSearch extends Component {
    constructor( props ) {
        super(props);
        this.state = { }
    }

    handleSearchBar = event => {
        if( event.target.value ) {
          got.get("https://api-staging.fox.com/fbc-content/v1_5/series?avoidDefaultQuery=true&itemsPerPage=1000&q=" + event.target.value.toString())
          .then( res => {
            var showObj = []
            var resObject = JSON.parse(res.body);
            for( var index = 0; index < resObject.totalItems; index++) {
              showObj.push({"showCode": resObject.member[index].showCode, "images": resObject.member[index].images});
            }
            this.props.searchShows( showObj );
          })
          .catch( err => {
            console.log(err)
          })
        }
        else {
            got.get("http://localhost:3001/api/shows")
            .then( (res) =>{
              var showObject = JSON.parse(res.body)
              var pageObject = showObject.showList.slice(0, 20)
              this.props.searchShows( pageObject );
            })
            .catch( function(err){
              console.log( err);
            })
        }
      }

    render() {
        return( 
            <div className="form-group" style={{ paddingLeft: '18em', paddingRight: '15em'}}>
              <input 
                className="form-control"
                type="text"
                placeholder="Search Series"
                onChange={ event => {this.handleSearchBar( event )}}
              />
            </div>
        )
    }
}

export default FavoriteSearch;