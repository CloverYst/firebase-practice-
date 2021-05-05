const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

exports.randomNumber = functions.https.onRequest((request, response) => {
  const number = Math.round(Math.random() * 100);
  console.log(number);
  response.send(number.toString());
});

exports.toTheDojo = functions.https.onRequest((request, response) => {
  response.redirect('https://www.thenetninja.co.uk');
});

// http callable function
exports.sayHello = functions.https.onCall((data, context) => {
  const name = data.name;
  return `hello, ${name},how are you`;
});


// auth trigger firebase create a new user
exports.newUserSignup = functions.auth.user().onCreate((user) => {
  console.log('user created', user.email,user.id);
  // for backgroud triggers you must return a value/promise   create the user record 
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    upvotedOn: []
  });
});

// auth trigger firebase delete a new user
exports.userDeleted = functions.auth.user().onDelete((user) => {
  console.log('user deleted', user.email,user.id);
  // for backgroud triggers you must return a value/promise
  const doc = admin.firestore().collection('users').doc(user.uid);
  return doc.delete();
});

// htto callable function (adding a request)  data wanna pass and context for the user authentication info
exports.addRequest = functions.https.onCall((data, context) => {
  // check all conditions
  if(!context.auth){
    throw new functions.https.HttpsError(
      'unauthenticated',
      'only authenticated users can add requests'
    )
  }
  if(data.text.length > 30){
    throw new functions.https.HttpsError(
      'invalid-argument',
      'no more than 30 characters long'
    );
  }
  //return promise to the user in the front side
  return admin.firestore().collection('request').add({
    text: data.text,
    upvotes: 0,
  });
});



  
