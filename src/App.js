import React, {Component} from "react";
import './App.css';
import Week from './Week';
import LogIn from './LogIn';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from './firebaseConfig.js';

class App extends Component{
  
  constructor(props){
    super(props);

    this.state = {
      user : null,
      profilepic : "",
      displayName : "",
      sendEmail : false
    }

    this.toggleSendEmail = this.toggleSendEmail.bind(this);
    this.setUserPrefs = this.setUserPrefs.bind(this);
  }

  componentDidMount(){
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }else {
      firebase.app(); // if already initialized, use that one
    }

    firebase.auth().onAuthStateChanged((aUser) => {
      if (aUser) {
        this.setState({
          user: aUser
        });
        this.setUserPrefs(aUser);
      }
      this.setState({
        loading: false
      });
    });
  }

  setUserPrefs(aUser){
    const db = firebase.firestore();
    db.collection("users").doc(aUser.uid).get()
        .then(user => {
          if(user.exists){
            var userdata = user.data();
            this.setState({
                sendEmail : userdata.sendEmail
            });
          }
        });
  }

  toggleSendEmail(){
    firebase.firestore().collection("users").doc(this.state.user.uid).update({
      sendEmail : !this.state.sendEmail
    }).then(() => {
      this.setState({
        sendEmail : !this.state.sendEmail
      });
    });
  }


  render(){

    return (
      <div className="App">
        <header>
          {(this.state.user !== null) ? <div>
            <img className="App-profilepic" src={this.state.user.photoURL} alt="weekly profile picture"></img>
            <h6>Logged in as {this.state.user.displayName}</h6>
            <button onClick={this.toggleSendEmail} className={this.state.sendEmail ? "disabled" : "enabled"}>{this.state.sendEmail ? "disable" : "enable"} daily email summary</button>
            </div> : <h6>Not logged in</h6>}
        </header>
        <div className="App-content">
          <h1>weekly</h1>
          {(this.state.user !== null) ? <Week user={this.state.user}/> : <LogIn />}
        </div>
      </div>
    );
  }
  
}

export default App;
