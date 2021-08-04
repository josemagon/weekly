import { Component } from "react";

class NewToDoForm extends Component{

    constructor(props){
        super(props);

        this.state = {
            text : "",
            valid: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeForm = this.closeForm.bind(this);
    }


    handleChange(evt){
        this.setState({
            text : evt.target.value
        });

        if (this.state.text !== "")
            this.setState({valid : true})
        else
            this.setState({valid: false});
    }

    handleSubmit(evt){
        evt.preventDefault();
        if(this.state.text !== ""){
            this.props.addToDo(this.state.text);
        }else{
            this.props.toggleShowForm();
        }
        this.setState({
            text: ""
        });
    }

    closeForm(evt){
        if(evt.target.className === "NewToDoForm"){
            this.props.toggleShowForm();
        }

        this.setState({
            valid:false,
            text: ""
        });
        
    }

    render(){
        return(
            <div className="NewToDoForm" onClick={this.closeForm}>
                <div className="NewToDoForm-form">
                    <img alt="cats waiting for you to type something" src="https://media.giphy.com/media/ule4vhcY1xEKQ/giphy-downsized.gif" className="weeklygif"/>
                    <h3>Type in the new To Do</h3>
                    <form onSubmit={this.handleSubmit}>
                        <input value={this.state.text} type="text" onChange={this.handleChange} placeholder="To Do here" required autoFocus></input>
                    </form>
                </div>
            </div>
        )
        
    }
}

export default NewToDoForm;