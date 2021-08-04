'use strict';

const nodemailer = require('nodemailer');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendDailyToDos = functions.pubsub.schedule('0 6 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {
  console.log('[sendDailyToDos] - sending todos....');
  admin.firestore().collection('users').get().then(users => {
    users.forEach(user => {
      console.log("Consegui el user " + user.ref.id);
        if(user.data().sendEmail){
            console.log("intento ver si tiene todos para hoy....");
            admin.firestore().collection("users/" + user.ref.id + "/todos").get()
            .then(todos => {
                if(todos.size > 0){
                  var usableToDos = usableDates(todos);
                  if(usableToDos.length > 0)
                    sendEmail(user, usableToDos);
                }else{
                  console.log("User has no todos");
                }
            });
        }
    });
  });
  return null;
});


exports.sendDailyToDosHTTP = functions.https.onRequest((req, res) => {
  console.log('[sendDailyToDosHTTP] - sending todos....');

  admin.firestore().collection('users').get().then(users => {
    users.forEach(user => {
      console.log("Consegui el user " + user.ref.id);
        if(user.data().sendEmail){
            console.log("intento ver si tiene todos para hoy....");
            admin.firestore().collection("users/" + user.ref.id + "/todos").get()
            .then(todos => {
                if(todos.size > 0){
                  var usableToDos = usableDates(todos);
                  if(usableToDos.length > 0)
                    sendEmail(user, usableToDos);
                }else{
                  console.log("User has no todos");
                }
            });
        }
    });
  });
  return null;
});

function sendEmail(aUser, someToDos){
  admin.auth().getUser(aUser.ref.id)
    .then(authuser => {
      var content = "<h1>Hi " + authuser.displayName + ", Today you have to....</h1>";
      content += "<ul>";
      someToDos.forEach(todo => {
          content += "<li>" + todo.todo + "</li>";
      });
      content += "</ul>";

      console.log(content);

      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'josemariagonzalez95@gmail.com',
            pass: 'Tbm12chavi12'
          }
        });
        
        var mailOptions = {
          from: 'josemariagonzalez95@gmail.com',
          to: authuser.email,
          subject: 'Weekly 7 - Daily Summary',
          text: content
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
    });
    
}

function usableDates(someToDos){
  var result = [];
  var today = YYYYMMdd(new Date());
  someToDos.forEach(todo => {
    if (YYYYMMdd(todo.data().date.toDate()) == today){
      result.push(todo.data());
    }
  });

  return result;
}

function YYYYMMdd(aDate){
  return (aDate.getFullYear() + "-" + (aDate.getMonth() + 1) + "-" + aDate.getDate());
}
