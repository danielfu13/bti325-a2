const fs = require('fs').promises;

let posts = [];
let categories = [];

function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    const allposts = posts.filter(post => post.category === category);
    if (allposts.length > 0) {
      resolve(posts);
    } else {
      reject("No results returned");
    }
  });
}

function getPostsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const minDate = new Date(minDateStr);
    const allposts = posts.filter(post => new Date(post.postDate) >= minDate);
    if (allposts.length > 0) {
      resolve(allposts);
    } else {
      reject("No results returned");
    }
  });
}

function getPostById(id) {  
  return new Promise((resolve, reject) => {
    const allpost = posts.find(post => post.id === id);
    if (allpost) {
      resolve(allpost);
    } else {
      reject("No result returned");
    }
  });
}

function initialize() {
  return Promise.all([
    fs.readFile('./data/posts.json', 'utf8')
      .then(data => {
        posts = JSON.parse(data);
      })
      .catch(error => {
        throw new Error('Unable to read posts file');
      }),
    fs.readFile('./data/categories.json', 'utf8')
      .then(data => {
        categories = JSON.parse(data);
      })
      .catch(error => {
        throw new Error('Unable to read categories file');
      })
  ]);
}

function addPost(postData) {
  return new Promise((resolve, reject) => {
    postData.published = postData.published === undefined ? false : true;
    postData.id = posts.length + 1;

    posts.push(postData);
    resolve(postData);
  });
}
module.exports = {
  addPost,
};


function getAllPosts() {
  return new Promise((resolve, reject) => {
    if (posts.length > 0) {
      resolve(posts);
    } else {
      reject('No results returned');
    }
  });
}

function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    const publishedPosts = posts.filter(post => post.published === true);
    if (publishedPosts.length > 0) {
      resolve(publishedPosts);
    } else {
      reject('No results returned');
    }
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length > 0) {
      resolve(categories);
    } else {
      reject('No results returned');
    }
  });
}

module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories
};
