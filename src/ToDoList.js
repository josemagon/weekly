import React, { Component } from "react";
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";

class ToDoList extends Component{

    constructor(props){
        super(props);

        this.state = {
            waiting: []
        }

        this.isWaiting = this.isWaiting.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    markAsComplete(aTodoID){
        if(this.isWaiting(aTodoID)){
            this.cancel(aTodoID);
            document.getElementById(aTodoID).classList.remove("completed");
        }else{
            var temp_waiting = this.state.waiting;
            temp_waiting.push(aTodoID);
            this.setState({
                waiting : temp_waiting
            });

            console.log("attempting to mark as completed todo " + aTodoID);

            document.getElementById(aTodoID).classList.add("completed");

            setTimeout(() => {
                if(this.isWaiting(aTodoID)){
                    const db = firebase.firestore();
                    db.collection("users").doc(firebase.auth().currentUser.uid).collection("todos").doc(aTodoID)
                        .get()
                        .then(todo => {
                            document.getElementById(aTodoID).classList.remove("completed");
                            todo.ref.delete();
                            this.cancel(aTodoID);
                        });
                }
                
            }, 3000);
        }
    }

    isWaiting(aTodoID){
        return (this.state.waiting.filter(todo => todo === aTodoID).length > 0);
    }

    cancel(aTodoID){
        var newwaiting = this.state.waiting.filter(todo => todo !== aTodoID);
        this.setState({
            waiting : newwaiting
        });
    }

    render(){
        return(
            <div className="ToDoList">
                <ul>
                    {this.props.todos.map(todo => {
                        return (<li className="ToDoList-ToDoItem" onClick={() => this.markAsComplete(todo.id)} id={todo.id} key={todo.id}>{todo.todo}</li>);
                    })}
                </ul>
            </div>
        )
    }
}

export default ToDoList;