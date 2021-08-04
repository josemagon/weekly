import React, { Component } from "react";
import ToDoList from './ToDoList';

class Day extends Component{

    constructor(props){
        super(props);

        this.state = {
            showForm: false
        };
    }

    open(todosQty){
        if(todosQty > 1){
            document.getElementById(this.props.id).classList.add("opened");
        }
    }

    close(){
        document.getElementById(this.props.id).classList.remove("opened");
    }

    render(){
        return(
            <div id={this.props.id} className="Day" onMouseOver={() => this.open(this.props.todos.length)} onMouseOut={() => this.close()}>
                <div className="Day-header"><h4>{this.props.name} {this.props.date}</h4><button onClick={() => this.props.showToDoForm(this.props.id)}>+</button></div>
                <div className="Day-TodoList">
                    <ToDoList todos={this.props.todos} />
                </div>
            </div>
        )
    }
}

export default Day;