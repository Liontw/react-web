import React,{ Component, PropTypes } 	from "react"
import { bindActionCreators } 			from "redux"
import { connect } 						from "react-redux"

export default class AppIndex extends Component {
	constructor(props,context){
		super(props,context)
	}

	componentDidMount(){
		
	}

	render() {

		return (
            <div>
                我是測試頁
            </div>
        )
	}
}
