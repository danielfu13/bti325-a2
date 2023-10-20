/*********************************************************************************
*  BTI325 – Assignment 3
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Daniel Fu    Student ID: 153024229   Date: Oct 10, 2023
*
*  Online (Cyclic) URL: https://puzzled-teal-narwhal.cyclic.cloud/
*
********************************************************************************/ 
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const express = require('express');
const app = express();
const path = require('path');
const HTTP_PORT = process.env.PORT || 8080;
const blogService = require('./blog-service.js');


cloudinary.config({
  cloud_name: 'dxetbauyx',
  api_key: '646543674724467',
  api_secret: 'niXD3n30lziZyvhFR0Yq7Q9DlV4',
  secure: true
});
const upload = multer(); 

app.use(express.static('public'));

function startListening() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});


app.get('/posts/add', (req, res) => {
  res.sendFile(path.join(__dirname, "/views/addPost.html"))
});

app.post('/posts/add', upload.single("featureImage"), (req, res) => {
  let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
              if (result) {
                  resolve(result);
              } else {
                  reject(error);
              }
              }
          );
  
          streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
  };
  
  async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
  }
  
  upload(req).then(async (uploaded)=>{
      req.body.featureImage = uploaded.url;
  
      // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
      try {
          const newPost = await blogService.addPost(req.body);
          res.redirect('/posts');
        } 
        catch (error) {
          res.status(500).send('Error adding post: ' + error.message);
        }
  });
  
  
});

// Route to get blog posts
app.get('/blog', (req, res) => {
  blogService.getPublishedPosts().then(posts => {
      res.json(posts);
    }).catch(error => {
      res.status(404).json({ message: error });
    });
});

// Route to get posts
app.get('/posts', (req,res)=>{
  const { category, minDate } = req.query;
if (category) {
  ///posts?category=value 
  blogService
    .getPostsByCategory(category)
    .then((data) => {
      res.json(data);
    })
    .catch(function (err) {
      console.log("Unable to fetch posts by category: " + err);
      res.status(500).send('Internal Server Error');
    });
} else if (minDate) {
  ///posts?minDate=value
  blogService
    .getPostsByMinDate(minDate) 
    .then((data) => {
      res.json(data);
    })
    .catch(function (err) {
      console.log("Unable to fetch posts by minDate: " + err);
      res.status(500).send('Internal Server Error');
    });
} else {
  ///posts
  blogService
    .getAllPosts()
    .then((data) => {
      res.json(data);
    })
    .catch(function (err) {
      console.log("Unable to open the file: " + err);
      res.status(500).send('Internal Server Error');
    });
}
});


// Route to get categories
app.get('/categories', (req, res) => {
  blogService.getCategories().then(categories => {
      res.json(categories);
    }).catch(error => {
      res.status(404).json({ message: error });
    });
});

// Custom Error Message
app.use((req, res) => {
  res.status(404).send("Your code ain't working bro...try again");
});

// Initialize the blog service and start the server if successful
blogService.initialize().then(() => {
    app.listen(HTTP_PORT, startListening);
  }).catch(() =>{
    console.error(error);
});