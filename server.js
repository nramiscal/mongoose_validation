var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var port = 8000;

mongoose.connect('mongodb://localhost/basic_validation'); // creates db 'basic_validation' if doesn't exist
mongoose.promise = global.Promise;

var UserSchema = new mongoose.Schema({
    firstName:  { type: String, required: true, minlength: 1},
    lastName: { type: String, required: true, minlength: 1 },
    age: { type: Number, required: true, min: 1, max: 150 },
    email: { type: String, required: true }
}, {timestamps: true });
mongoose.model('User', UserSchema);
var User = mongoose.model('User');

app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    User.find().exec(function(err, users){ // retrieve all users from database
        if (err) throw err;
        res.render('index', {'users': users});
    })

})

app.post('/users', function(req, res){
    console.log("POST DATA", req.body);
    var user = new User(req.body);
    user.save(function(err){ // save user to database
        if (err){
            var users = User.find();
            res.render('index', {errors: user.errors, users: users});
        }
        else {
            console.log('user successfully added to database');
            res.redirect('/');
        }
    })
})

app.listen(port, function(){
    console.log(`listening on port ${port}`);
})
