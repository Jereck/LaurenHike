const   express     = require('express'),
        bodyParser  = require("body-parser"),
        mongoose    = require('mongoose'),
        path        = require('path'),
        multer      = require('multer');

const app = express();

// mongoose.connect("mongodb://localhost/hike_photos");
mongoose.connect("mongodb://jakereck:stella@ds139919.mlab.com:39919/lauren_hike");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

var hikeSchema = new mongoose.Schema({
    name: String,
    description: String,
    folder_image: String,
    files: [{
        filename: String,
        destination: String,
        path: String
    }]
});

var Hike = mongoose.model("Hike", hikeSchema);

app.get("/", function(req, res){
    res.render("index");
});

app.get("/hikes", function(req, res){
    Hike.find({}, function(err, allHikes){
        if(err){
            console.log(err);
        } else {
            res.render("hikes", {hikes: allHikes});
        }
    })
});

app.post("/hikes", upload.any(), function(req, res, next){
    var name = req.body.name;
    var description = req.body.description;
    var folder_image = req.body.folder_image;
    var files = req.files;
    var newHike = {name: name, description: description, folder_image:folder_image, files: files}
    Hike.create(newHike, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            console.log(req.files);            
            res.redirect("/hikes");
        }
    });
});

app.get("/hikes/new", function(req, res){
    res.render("new.ejs");
});

app.get("/hikes/:id", function(req, res){
    Hike.findById(req.params.id, function(err, foundHike){
        if(err){
            console.log(err);
        } else {
            res.render("show", {hike: foundHike});
        }
    });
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/admin", function(req, res){
    res.render("admin");
})

// app.listen(3000, function(){
//     console.log("The server is running..");
// });

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!")
});