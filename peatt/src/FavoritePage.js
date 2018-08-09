import React, { Component } from "react";

class FavoritePage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            totalPages: 0, 
            pageArray:[], 
            page: 1 
        };
    }

    checkPages = () => {
        if (this.state.page > this.props.totalPages || this.state.page <= 0) {
            this.props.setShows(1);
            this.setState({ page: 1})
            this.props.setError(true);
        } else {
            this.pageChange();
        }
    }

    componentDidMount() {
        this.setState({ 
            totalPages: this.props.totalPages, 
            pageArray: [
                ...Array(this.props.totalPages).keys()
            ].map(i => i++),
        });
    }

    pageChange = () => this.props.setShows(this.state.page);

    handlePageForwardClick = () => {
        this.setState({ page: this.state.page++ }, () => this.checkPages());
    }
  
    handlePageClick = page => {
        this.setState({ page }, () => this.checkPages())
    }
  
    handlePageBackwardsClick = () => {
        this.setState({ page: this.state.page-- }, () => this.checkPages());  
    }

    static getDerivedStateFromProps( nextProps, prevState ) {
        if (nextProps.totalPages !== prevState.totalPages) {
            return {
                totalPages: nextProps.totalPages,
                pageArray: [
                    ...Array(nextProps.totalPages).keys()
                ].map(i => i++),
            }
        }
        return null;
    }

    render() {
        return( 
            <div>
                <button onClick={this.handlePageBackwardsClick}>Previous Page</button>
                {
                    this.state.pageArray.map((item, index) => 
                        <button 
                            key={index} 
                            onClick={() => this.handlePageClick(item)}>
                            {item}
                        </button>
                    )
                }
                <button onClick={this.handlePageForwardClick}>Next Page</button>
            </div>    
        )
    }
}
export default FavoritePage;