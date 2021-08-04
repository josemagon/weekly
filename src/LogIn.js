import React, {Component} from "react";
import './LogIn.css';
import firebase from 'firebase/app';
import "firebase/auth";
import firebaseConfig from './firebaseConfig';

class LogIn extends Component{

    constructor(props){
        super(props);

        this.loginwithgmail = this.loginwithgmail.bind(this);
    }

    componentDidMount(){

    }

    loginwithgmail(evt){
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
         }else {
            firebase.app(); // if already initialized, use that one
         }
        const provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider)
            .then(result => {
                //login listener will take care
            }).catch(function(err){
                alert("Error logging in");
            });
    }

    showButton(){

    }

    render(){
        return(
            <div>
                <h3>Log In</h3>
                <button onClick={this.loginwithgmail} className="LogIn-btn">Just use your gmail, ain't nobody got time for typing shit</button>
            </div>
        )
    }
    
}

export default LogIn;