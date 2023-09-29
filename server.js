/*********************************************************************************
*  BTI325 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Daniel Fu    Student ID: 153024229   Date: Sept 29, 2023
*
*  Online (Cyclic) URL: _______________________________________________________
*
********************************************************************************/ 

const express = require('express');
const app = express();
const path = require('path');
const HTTP_PORT = process.env.PORT || 8080;
const blogService = require('./blog-service.js');

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

// Route to get blog posts
app.get('/blog', (req, res) => {
  blogService.getPublishedPosts().then(posts => {
      res.json(posts);
    }).catch(error => {
      res.status(404).json({ message: error });
    });
});

// Route to get posts
app.get('/posts', (req, res) => {
  blogService.getAllPosts().then(posts => {
      res.json(posts);
    }).catch(error => {
      res.status(404).json({ message: error });
    });
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