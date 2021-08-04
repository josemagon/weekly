import React, { Component } from "react";
import Day from './Day';
import NewToDoForm from "./NewToDoForm";
import firebase from 'firebase/app';
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";
import Spinner from './Spinner';

class Week extends Component{

    dayNames = ["Sunday" , "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    constructor(props){
        super(props);

        this.state = {
            days : [],
            showForm: false,
            selectedDay: -1,
            loading: true
        }

        this.initDays = this.initDays.bind(this);
        this.showToDoForm = this.showToDoForm.bind(this);
        this.addToDo = this.addToDo.bind(this);
        this.toggleShowForm = this.toggleShowForm.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
        this.getTodosFromFirebase = this.getTodosFromFirebase.bind(this);
        this.deleteAllTodos = this.deleteAllTodos.bind(this);
    }

    componentDidMount(){
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
          }else {
            firebase.app(); // if already initialized, use that one
          }
        // this.initDays();
        this.getTodosFromFirebase(this.toggleLoading);
    }

    toggleLoading(){
        var temp = this.state.loading;
        this.setState({
            loading: !temp
        });
    }

    getTodosFromFirebase(callback){
        this.initDays();
        const db = firebase.firestore();
        db.collection('users').doc(this.props.user.uid).collection("todos").where("date", ">=", new Date(this.state.days[0].date)).where("date", "<=", new Date(this.state.days[6].date)).onSnapshot((todossnapshot => {
                todossnapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        var temp_days = this.state.days;
                        var newtodo = {
                            todo : change.doc.data().todo,
                            id : change.doc.ref.id
                        };
                        temp_days[change.doc.data().day].todos.push(newtodo);
                        this.setState({
                            days : temp_days
                        });
                    }
                    if (change.type === "modified") {
                        console.log("Modified todo: ", change.doc.data());
                    }
                    if (change.type === "removed") {
                        console.log("Removed todo: ", change.doc.data());
                        var temp_days = this.state.days;
                        temp_days[change.doc.data().day].todos = temp_days[change.doc.data().day].todos.filter(todo => todo.id !== change.doc.ref.id);
                        this.setState({
                            days : temp_days
                        });
                    }
                });
                this.setState({loading: false});
        }));
    }

    deleteAllTodos(callback){
        console.log("deleting everything");
        const db = firebase.firestore(); 
        db.collection('users').doc(this.props.user.uid).collection("todos").then(todos => {
            todos.forEach(todo => {
                todo.ref.delete();
            });
        });
    }

    initDays(){
        var day = new Date().getDay();
        var afterDay = 7 - day;
        var from = new Date();
        from.setDate(from.getDate() - day);
        var to = new Date();
        to.setDate(to.getDate() + afterDay);

        for (let index = 0; index < 7; index++) {
            var temp_days = this.state.days;
            temp_days.push({"day": index, "date": (from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate()), "todos": [] });
            this.setState({days : temp_days});
            from.setDate(from.getDate() + 1);
        }
    }

    isNewWeek(someToDos){
        var result = true;
        if (someToDos){
            var i = 0;
            var todaydate = new Date();
            var today = (todaydate.getFullYear() + "-" + (todaydate.getMonth() + 1) + "-" + todaydate.getDate());
            while (i < someToDos.length && result === true) {
                if (someToDos[i].date === today){
                    result = false;
                }
                i++;
            }
        }
        return result;
    }

    showToDoForm(aDay){
        this.setState({showForm:true, selectedDay:aDay});
    }

    addToDo(aText){
        this.toggleShowForm();


        const db = firebase.firestore();

        db.collection('users').doc(this.props.user.uid).collection("todos").add({
            day: this.state.selectedDay,
            date : new Date(this.state.days[this.state.selectedDay].date),
            todo : aText
        });
        
    }

    toggleShowForm(){
        this.setState({
            showForm: !this.state.showForm
        });
    }

    render(){

        return(
            <div className="Week">
                {(this.state.loading) ? <Spinner /> : <div></div>}
                {this.state.showForm ? <NewToDoForm addToDo={this.addToDo} toggleShowForm={this.toggleShowForm}/> : null}
                {this.state.days.map(day => {
                    return (
                        <Day id={day.day} key={day.day} date={day.date} todos={day.todos} showToDoForm={this.showToDoForm} name={this.dayNames[day.day]}/>
                    )
                })}
                <div className="allclear"></div>
                
            </div>
        );
    }


}

export default Week;