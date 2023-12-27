// b14 (buddyboard v2)
// by repeat-tech for @friends2013

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const YAML = require('yaml');
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({
    extended: true
}));


// views
app.use('/static', express.static('./src/static'))
app.set('views', './src/views');
app.set('view engine', 'pug');

// functions
let postCount = 1;
function loadPosts() {
    const posts = fs.readFileSync('./posts.yml', 'utf8')
    return YAML.parse(posts);
};

// routes
app.get('/', (request, response) => {
    const posts = loadPosts()
    response.render('index', {"posts" : posts});
  });

app.post('/', (request, response) => {
    app.use(bodyParser.json());
    const content = request.body.content;
    const newPost = {
        id: postCount++,
        author: 'Anonymous',
        ip: request.socket.remoteAddress,
        content,
    };
    let posts = loadPosts();
    if (!Array.isArray(posts)) {
        posts = [];
    }
    posts.push(newPost);
    fs.writeFileSync('posts.yml', YAML.stringify(posts, { indent: 2 }), 'utf8');
    response.redirect('/');
});

app.get('/api', (request, response) => {
    const posts = loadPosts();
    response.send(posts);
});

app.listen(5000, () => {
  console.log('App is listening on port 5000');
});