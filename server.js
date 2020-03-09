const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
// const router = express.Router();
const PORT = 4000;

let Posts = require('./data.model.js');
let Img = require('./img.model.js');
let User = require('./user.model.js');

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/build')));

// connect to cloud database
const db = require('./config/keys.js').mongoURI;

mongoose.connect(db, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB connection established");
});

app.get('/api/', function (req, res) {
    Posts.find().sort({time: -1}).exec(function(err, posts) {
        if (err) {
            console.log(err);
        } else {
        	// console.log(posts);
            res.json(posts);
        }
    });
});

app.get('/api/featured', function(req, res) {
    Posts.find({'featured': true}).sort({time: -1}).exec(function(err, posts) {
        if (err) {
            console.log(err);
        } else {
            // console.log(posts);
            res.json(posts);
        }
    });
});

app.get('/api/images/:project_id', function(req, res) {
    let projectID = req.params.project_id;
    Img.find({'project_id':projectID}).exec(function(err, imgs) {
        if (err) {
            console.log(err);
        } else {
            // console.log(projectID);
            // console.log(imgs);
            res.send(imgs);
        }
    });
});


app.get('/api/userposts/:user_id', function(req, res) {
    let username = req.params.user_id;
    Posts.find({'user_id': username}).sort({time: -1}).exec(function(err,posts){
        if (err){
            console.log(err);
        }
        else{
            // console.log(posts);
            res.json(posts);
        }
    });
});

app.get('/api/search/:searchvalue', function(req, res) {
    let searchvalue = req.params.searchvalue;
    Posts.find({'tags.tag_id': searchvalue}).exec(function(err,posts){
        if (err){
            console.log(err);
        }
        else{
            // console.log(posts);
            res.json(posts);
        }
    });
});

app.get('/api/project/:projectId', function(req, res) {
    let projectId = req.params.projectId;
    Posts.find({'_id': projectId}).exec(function(err,posts){
        if (err){
            console.log(err);
        }
        else{
            // console.log(posts);
            res.json(posts);
        }
    });
});

app.get('/api/project/:projectid', function(req, res) {
    let projectid = req.params.projectid;
    Posts.find({'_id': projectid}).exec(function(err,posts){
        if (err){
            console.log(err);
        }
        else{
            // console.log(posts);
            res.json(posts);
        }
    });
});

app.get('/api/user/:userid', function(req,res) {
    let userid = req.params.userid;
    User.find({'user_id': userid}).exec(function(err,user){
        if (err){
            console.log(err);
            res.status(400);
        }
        else{
            res.status(200).json(user);
        }
    });
});

app.post('/api/user', function(req,res) {
    User.find({'user_id':req.body.user_id}).exec()
        .then( function(users){
            if (users.length){
                console.log('user already exists');
                res.status(200).send('user already exists, not adding to db');
            }
            else{
                let newUser = new User;
                newUser.display_name = req.body.user_display_name;
                newUser.email = req.body.user_email;
                newUser.user_id = req.body.user_id;
                newUser.save()
                    .then(user => {
                        res.status(200).send('new user added successfully');
                        console.log(user);
                    })
                    .catch( err => {
                        res.status(400).send(err);
                    });
            }
        })
        .catch(function(error){
            console.log(error);
        });
});

app.post('/api/add', function(req, res) {
    let posts = new Posts(req.body.post_data);
    let project_id = "";
    console.log(req.body);
    posts.save()
        .then(post => {
            let image = new Img();
            // console.log('HERE');
            // console.log(posts._id);
            project_id = posts._id;
            image.project_id = posts._id;
            // console.log(image.project_id);
            // res.status(200).json({'post': 'post added successfully'});
                let filePath = './uploads/' + req.body.img_data.fileID.filename;
                image.img.data = fs.readFileSync(filePath);
                image.img.contentType = req.body.mimetype;
                image.save()
                    .then(post => {
                        res.status(200).send(image);
                            fs.unlink(filePath, function(err) {
                                if(err && err.code == 'ENOENT') {
                                    // file doens't exist
                                    console.info("File doesn't exist, won't remove it.");
                                } else if (err) {
                                    // other errors, e.g. maybe we don't have enough permission
                                    console.error("Error occurred while trying to remove file");
                                } else {
                                    console.info(`removed`);
                                }
                            });
                    })
                    .catch(err => {
                        res.status(400).send('adding new img failed');
                    });
        })
        .catch(err => {
            // res.status(400).send('adding new post failed');
        });
});

//temp storage
app.post('/api/upload', function(req, res) {
    var storage = multer.diskStorage({
        destination: './uploads/'
    });
    var upload = multer({
        storage: storage
    }).any();

    upload(req, res, function(err) {
        if (err) {
            // console.log(err);
            return res.end('Error');
        } else {
            // console.log(req.body);
            req.files.forEach(function(item) {
                // console.log(item);
                res.setHeader('content-type', 'text/plain');
                res.send(item);
                // move your file to destination
            });
        }
    });
});

// router.route('/save').post(function(req, res) {
//     var image = new Img();
//     let filePath = './uploads/' + req.body.filename;
//     image.img.data = fs.readFileSync(filePath);
//     image.img.contentType = req.body.mimetype;
//     image.save()
//         .then(post => {
//             res.status(200).json({'img': 'img added successfully'});
//                 fs.unlink(filePath, function(err) {
//                     if(err && err.code == 'ENOENT') {
//                         // file doens't exist
//                         console.info("File doesn't exist, won't remove it.");
//                     } else if (err) {
//                         // other errors, e.g. maybe we don't have enough permission
//                         console.error("Error occurred while trying to remove file");
//                     } else {
//                         console.info(`removed`);
//                     }
//                 });
//         })
//         .catch(err => {
//             res.status(400).send('adding new img failed');
//         });
// });

app.delete('/api/upload', function(req, res) {
    let pathName = './uploads/' + req.body.filename;
    fs.unlink(pathName, function(err) {
        if(err && err.code == 'ENOENT') {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.");
        } else if (err) {
            // other errors, e.g. maybe we don't have enough permission
            console.error("Error occurred while trying to remove file");
        } else {
            console.info(`removed`);
        }
    });
    // console.log(req);
    res.send('deleted');
});

// app.use('/api/', router);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '/build', 'index.html'));
});

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});


