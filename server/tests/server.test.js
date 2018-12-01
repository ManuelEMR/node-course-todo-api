const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.data.text).toBe(text);
            })
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then((res) => {
                    expect(res.length).toBe(1);
                    expect(res[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })
    });

    it('Should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            })
    })
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should get a todo', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if invalid id', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /TODOS/:id', () => {

    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((res) => {
                    expect(res).toNotExist();
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        let hexId = todos[0]._id.toHexString();
        let newBody = { text: 'NewText', completed: true };

        request(app)
            .patch(`/todos/${hexId}`)
            .send(newBody)
            .expect(200)
            .expect((res) => {
                expect(res.body.data._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo.text).toBe(newBody.text);
                    expect(todo.completed).toBe(true);
                    expect(todo.completedAt).toBeA('number');
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should clear completedAt when todo is not completed', (done) => {
        let hexId = todos[1]._id.toHexString();
        let newBody = { text: 'NewText', completed: false };

        request(app)
            .patch(`/todos/${hexId}`)
            .send(newBody)
            .expect(200)
            .expect((res) => {
                expect(res.body.data._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo.text).toBe(newBody.text);
                    expect(todo.completed).toBe(false);
                    expect(todo.completedAt).toNotExist();
                    done();
                }).catch((e) => done(e));
            })
    });
})