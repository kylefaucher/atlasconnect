const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const postsRoutes = express.Router();
const PORT = 4000;

let Posts = require('./data.model.js');
let Img = require('./img.model.js');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/capstoneprototype', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB connection established");
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

postsRoutes.route('/images/:project_id').get(function(req, res) {
    let projectID = req.params.project_id;
    Img.find({'project_id':projectID}).exec(function(err, imgs) {
        if (err) {
            console.log(err);
        } else {
            // console.log(projectID);
            console.log(imgs);
            res.send(imgs);
        }
    });
});


postsRoutes.route('/userposts/:user_id').get(function(req, res) {
    let username = req.params.user_id;
    Posts.find({'user_id': username}).exec(function(err,posts){
        if (err){
            console.log(err);
        }
        else{
            console.log(posts);
            res.json(posts);
        }
    });
});

postsRoutes.route('/search/:searchvalue').get(function(req, res) {
    let searchvalue = req.params.searchvalue;
    Posts.find({'tags.tag_id': searchvalue}).exec(function(err,posts){
        if (err){
            console.log(err);
        }
        else{
            console.log(posts);
            res.json(posts);
        }
    });
});

postsRoutes.route('/add').post(function(req, res) {
    let posts = new Posts(req.body.post_data);
    let project_id = "";
    console.log(req.body);
    posts.save()
        .then(post => {
            let image = new Img();
            console.log('HERE');
            console.log(posts._id);
            project_id = posts._id;
            image.project_id = posts._id;
            console.log(image.project_id);
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
postsRoutes.route('/upload').post(function(req, res) {
    var storage = multer.diskStorage({
        destination: './uploads/'
    });
    var upload = multer({
        storage: storage
    }).any();

    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            return res.end('Error');
        } else {
            console.log(req.body);
            req.files.forEach(function(item) {
                console.log(item);
                res.setHeader('content-type', 'text/plain');
                res.send(item);
                // move your file to destination
            });
        }
    });
});

// postsRoutes.route('/save').post(function(req, res) {
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

postsRoutes.route('/upload').delete(function(req, res) {
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
    console.log(req);
    res.send('deleted');
});

app.use('/capstoneprototype', postsRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});


