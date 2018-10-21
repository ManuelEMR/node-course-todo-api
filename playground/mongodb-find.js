// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to mongo db server');

    const db = client.db('TodoApp');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5bcbace11c6cafac1cfd5d69')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch To Do\'s', err);
    // });

    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos count:${count}`);
        console.log(JSON.stringify(count, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch To Do\'s', err);
    });

    client.close();
})