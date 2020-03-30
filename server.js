const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
require("dotenv").config();
// const router = express.Router();
const PORT = process.env.PORT || 4000;

let Posts = require('./data.model.js');
let Img = require('./img.model.js');
let Tag = require('./tag.model.js');
let AdditionalImg = require('./additionalimg.model.js');
let Profileimg = require('./profileimg.model.js');
let User = require('./user.model.js');

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/client/build')));

// connect to cloud database
const db = process.env.DBKEY || require('./config/keys.js').mongoURI;

// console.log(db);

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
            res.json(posts);
        }
    });
});

app.get('/api/featured', function(req, res) {
    Posts.find({'featured': true}).sort({time: -1}).exec(function(err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.json(posts);
        }
    });
});

app.get('/api/user', function(req, res) {
    User.find().exec(function(err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
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

app.get('/api/additionalimages/:project_id', function(req, res) {
    let projectID = req.params.project_id;
    AdditionalImg.find({'project_id':projectID}).exec(function(err, imgs) {
        if (err) {
            console.log(err);
        } else {
            // console.log(projectID);
            // console.log(imgs);
            res.send(imgs);
        }
    });
});

app.get('/api/profileimg/:user_id', function(req, res) {
    let userID = req.params.user_id;
    Profileimg.find({'user_id':userID}).exec(function(err, img) {
        if (err) {
            console.log(err);
        } else {
            // console.log(projectID);
            // console.log(imgs);
            res.send(img);
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

// app.get('/api/project/:projectid', function(req, res) {
//     let projectid = req.params.projectid;
//     Posts.find({'_id': projectid}).exec(function(err,posts){
//         if (err){
//             console.log(err);
//         }
//         else{
//             // console.log(posts);
//             res.json(posts);
//         }
//     });
// });

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

app.post('/api/tag', function(req, res) {
    let tag = new Tag;
    tag.tag_id = req.body.tag_id;
    tag.tag_color = req.body.tag_color;
    tag.save()
        .then( tag =>{
            res.status(200).send("successfully added new tag");
            console.log(tag);
        })
        .catch (err => {
            res.status(400).send(err); 
        })
});

app.get('/api/tag/:tagid', function(req, res) {
    let tag_id = req.params.tagid;
    Tag.find({'tag_id': tag_id}).exec(function(err,tag){
        if (err){
            console.log(err);
            res.status(400);
        }
        else{
            res.status(200).json(tag);
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

app.put('/api/user', function(req,res) {
    User.updateOne({ user_id: req.body.public_profile.user_id}, req.body.public_profile ).exec()
        .then( function (response) {
            res.status(200).send('successfully updated user profile');
            console.log('update response');
            console.log(response);
        })
        .catch(function(error){
            res.status(400).send('error updating user profile');
            console.log('update error');
            console.log(error);
        });
    if (req.body.profile_img){
            //delete existing profile image if it exists
            Profileimg.find({ 'user_id': req.body.public_profile.user_id }).remove().exec();

            let image = new Profileimg();
            image.user_id = req.body.public_profile.user_id;
                let filePath = './uploads/' + req.body.profile_img.filename;
                image.img.data = fs.readFileSync(filePath);
                image.img.contentType = req.body.profile_img.mimetype;
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
    }
});

//add new project to database and upload images
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
                        // res.status(400).send('adding new img failed');
                    });

            //upload second picture if user uploaded one
            if (req.body.img_data.fileID2){
                let image2 = new AdditionalImg();
                image2.project_id = posts._id;
                let filePath2 = './uploads/' + req.body.img_data.fileID2.filename;
                image2.img.data = fs.readFileSync(filePath2);
                image2.img.contentType = req.body.mimetype;
                image2.save()
                    .then(post => {
                        // res.status(200).send(image);
                            fs.unlink(filePath2, function(err) {
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
                        // res.status(400).send('adding new additional img failed');
                    });

            }
            //upload third picture if user uploaded one
            if (req.body.img_data.fileID3){
                let image3 = new AdditionalImg();
                image3.project_id = posts._id;
                let filePath3 = './uploads/' + req.body.img_data.fileID3.filename;
                image3.img.data = fs.readFileSync(filePath3);
                image3.img.contentType = req.body.mimetype;
                image3.save()
                    .then(post => {
                        // res.status(200).send(image);
                            fs.unlink(filePath3, function(err) {
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
                        // res.status(400).send('adding new additional img failed');
                    });
            }
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
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});


