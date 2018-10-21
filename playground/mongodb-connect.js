// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to mongo db server');

    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false  
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert To do', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })


    //  db.collection('Users').insertOne({
    //     name: 'Manuel Muñoz',
    //     age: 25,
    //     location: 'Buenos Aires'  
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert User', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })

    client.close();
})