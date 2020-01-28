const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const postsRoutes = express.Router();
const PORT = 4000;

let Posts = require('./data.model.js');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/capstoneprototype', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

postsRoutes.route('/').get(function(req, res) {
    Posts.find().sort({time: -1}).exec(function(err, posts) {
        if (err) {
            console.log(err);
        } else {
        	console.log(posts);
            res.json(posts);
        }
    });
});

postsRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Posts.findById(id, function(err, posts) {
        res.json(posts);
    });
});

postsRoutes.route('/add').post(function(req, res) {
    let posts = new Posts(req.body);
    console.log(req.body);
    posts.save()
        .then(post => {
            res.status(200).json({'post': 'post added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new post failed');
        });
});

app.use('/capstoneprototype', postsRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});


