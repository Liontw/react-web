import React,{ Component, PropTypes} 	from "react"
import { bindActionCreators } 			from "redux"
import { connect } 						from "react-redux"


const cssMenu = {
	margin: '0px',
	height : '50px'
}

export default class App extends Component {

	constructor(props,context){
		super(props,context);
	
	}
	render(){
		
		return(
			<div>
				<div style={cssMenu}>Menu</div>
				<div>{this.props.children}</div>
			</div>
		)
	}
}


