const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');
const app = express();

app.use(express.static('public')); 

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// The extensions 'html' allows us to serve file without adding .html at the end 
// i.e /my-cv will server /my-cv.html

const filePath = __dirname + "/data/posts.json";

app.get('/', (req, res) => {
  const callbackFunction = (error, file) => {
    // we call .toString() to turn the file buffer to a String
    const fileData = file.toString();
    // we use JSON.parse to get an object out the String
    const postsJson = JSON.parse(fileData);
    // send the json to the Template to render
    res.render('index', {
      title: 'Olena', // insert your name instead
      posts: postsJson
    });
  };
  fs.readFile(filePath, callbackFunction);
});

app.get('/my-cv', (req,res) => {
	res.render('my-cv', {title: 'Olena'});
});

app.get('/admin', (req,res) => {
	res.render('admin', {title: 'Olena'});
});

app.get('/contact-information', (req,res) => {
	res.render('contact', {title: 'Olena'});
});

app.get('/posts', (req,res) => {
	res.sendFile(filePath);
});

app.get('/posts/:id', (req,res) => {
	let postId = req.params.id;
	fs.readFile(filePath, (error,file) => {
		if (error) {
			console.log(error);
		} else {
			let parsedFile = JSON.parse(file);
			parsedFile.forEach((post) => {
				if (post.id === postId) {
					res.send(post);
				};		
			});
		};
	});
});

// what does this line mean: process.env.PORT || 3000
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});