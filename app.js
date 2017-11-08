var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//mongoose.connect("mongodb://localhost/blogapp", {useMongoClient: true});
mongoose.connect("mongodb://tikaspijkerman:maybe678@ds249005.mlab.com:49005/blogapp", {useMongoClient: true});
mongoose.Promise = global.Promise;

var blogAppSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});  //defining a pattern for our data

var Blog = mongoose.model("Blog", blogAppSchema);


//RESTFUL Routes
//INDEX
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//NEW route
app.get("/blogs/new", function(req, res){
  res.render("new");
});

//CREATE route
app.post("/blogs", function(req, res){
  //create blog
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

/*Blog.create({
    title: "Cats",
    image: "https://images.unsplash.com/photo-1442291928580-fb5d0856a8f1?auto=format&fit=crop&w=1189&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
    body: "This is my first blogPost about Cats"
});*/

//SHOW route
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else{
      res.render ("showpage", {blog: foundBlog});
    }
  });
  });


//EDIT route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

//EDIT route
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

//UPDATE route
app.put("/blogs/:id", function(req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/"+req.params.id);
    }
  });
});

//DESTROY route
app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(process.env.PORT || 5000, process.env.IP, function() {
  console.log('Node app is running');
});
