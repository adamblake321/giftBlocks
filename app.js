
/**
 * Module dependencies.
 */

var express 	= require('express')
var nodemailer 	= require("nodemailer");
var passport 	= require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

var intFunc = require('int');

//amazon helper

var OperationHelper = require('./lib/apac').OperationHelper;
var opHelper = new OperationHelper({
	awsId: 'AKIAIAWX2JJWY7VX4UNQ',
	awsSecret: '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',
	assocId: '4778-2896-4669'
	});
    
var app = module.exports = express.createServer(),
	mongoose = require( 'mongoose' ); //MongoDB integration

//AWS load
var AWS = require('aws-lib');

var ec2 = AWS.createEC2Client("AKIAI3BFGQFNAIKYF3OQ", 'HABhz96nwwaweJYIYpAjkzmDoAaJO+8XkP55Q1CY');


var stripeApiKey = "";
var stripeApiKeyTesting = "..."
var stripe = require('stripe')(stripeApiKey);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: '1234567890QWERTY',maxAge: 3600000}));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());


  
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser({uploadDir:'./uploads'}));
});



app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//site url
//var sturl="http://localhost:3000";

var sturl="http://www.giftsblock.jit.su";

//mongo connect schema and model

mongoose.connect("mongodb://nodejitsu_surpass:dtmmbq2j7s35s54snrbo0g29mg@ds027718.mongolab.com:27718/nodejitsu_surpass_nodejitsudb3935391625");

mongoose.connect( 'mongodb://localhost/giftdb' );

//Facebook
var FACEBOOK_APP_ID 	= "207079492749511" // 207079492749511 server:149379311929856
var FACEBOOK_APP_SECRET = "1bdb78f35b5506052cbf230920e35091"; //1bdb78f35b5506052cbf230920e35091 server: c31932000c72029762a6eb8c0f24d7cc


// Passport session setup.yes
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.

passport.serializeUser(function(user, done) 
{
	console.log("serialize");
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	console.log("deserialize");
	done(null, obj);
});

// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: sturl+"/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () 
    {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
    	console.log("facebook information", profile);
    	return done(null, profile);
    });
  }
));



//Schemas
var User = new mongoose.Schema({
fn: String,
ln: String,
em: String,
fbid: String,
pass: String,
add1: String,
add2: String,
city: String,
state: String,
zip: String,
phone: String,
gender: String,
right: String,
left: String,
fmhat:String,
fmheadm:String,
fmhatm:String,
fmshirt:String,
fmchest:String,
fmneck:String,
fmsleeve:String,
fmglobe:String,
fmring:String,
fmhandl:String,
fmhandw:String,
fmpant:String,
fmwaist:String,
fminseam:String,
fmshoe:String,
fmsock:String,
un:String,
badd1:String,
badd2:String,
bcity:String,
bzip:String,
bstate:String,
photopath:String,
birth:String
});

var myproduct = new mongoose.Schema(
{
    userID:String,
    asin:String,
    date:String,
    amount:String,
    name:String,
    price:String,
    img:String,
    details:String,
    listId:String

});

var mygifts = new mongoose.Schema({
    
    userID: String,
    asin:String
});

/*
var gifts = new mongoose.Schema(
{
    asin: String,


});
*/
var mylist = new mongoose.Schema(
{
    userem:String,
    name:String,
    level:String

});
var ListModel = mongoose.model( 'gList', mylist);

//Models
var UserModel = mongoose.model( 'gUser', User);
var ProductModel = mongoose.model('gProduct', myproduct);
var GiftsModel = mongoose.model('gGifts', mygifts);
//Routing
app.get('/', function(req,res)
{
	console.log(req.cookies);
	if (!req.session.user)
	{
		//if (!req.cookies.em)
			res.render('index',{layout:false});
		/*else
		{
			res.render('index',{em:req.cookies.em,pass:req.cookies.pass,layout:false});
		}*/
	}
	else
		res.redirect('/profile');
});


//send verification mail
app.post('/sendverif',function(req,res)
{
	console.log(req.body.em+","+req.body.fn+","+req.body.ln);
	var smtpTransport = nodemailer.createTransport("SMTP",{
	    service: "Gmail",
	    auth: {
	        user: "jian@surpassweb.com",
	        pass: "ruhdarnsin19891120"
	    }
	});

	// setup e-mail data with unicode symbols
	var haddr=req.headers.host;
	var shtml="Hi, "+req.body.fn+" "+req.body.ln+", Welcome to GiftsBlock!<br>"
	+" Click <a href='"+sturl+"/checkverif?em="+req.body.em+"&fn="+req.body.fn+"&ln="+req.body.ln+"'> <b> here </b> </a> to verify your account";
	console.log(shtml);
	
	var mailOptions = {
	    from: "Surpass <surpass@surpassweb.com>", // sender address
	    to: req.body.em, // list of receivers
	    subject: "Welcome to GiftsBlock", // Subject line
	    html: shtml
	}

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
	    	res.send("email error: try again!");
	        console.log("myerror"+error);
	    }else{
	    	
	        console.log("Message sent: " + response.message);
	    }
	    // if you don't want to use this transport object anymore, uncomment following line
	    smtpTransport.close(); // shut down the connection pool, no more messages
	});
	res.send("ok");
});

//verification process
app.get('/checkverif',function(req,res)
{
	console.log("Query Parameter "+req.query);
	
	//req.query.em
	UserModel.findOne({em:req.query.em},function(err,docs)
	{
		console.log("user detail: "+docs)
		
		if (!err)
		{
			if (!docs)
			{
				console.log("birthday:"+req.query.birth);
				res.render("getting_started",{em:req.query.em,fn:req.query.fn,ln:req.query.ln,fbid:req.query.fbid,birth:req.query.birth,gender:req.query.gen,loc:req.query.loc,layout:false});
			}
			else
			{
				console.log(docs);
				req.session.user=docs.em;
				res.redirect('/profile');
			}
		}
		else
		{
			console.log(!err);
		}
	});
});

//login
app.post('/login', function (req, res)
{
    
    console.log(req.body);
    UserModel.findOne({ em: req.body.username, pass: req.body.password }, function (err, doc)
    {
        if (err)
        {
            console.log(err);
        }
        else if (doc)
        {
            console.log(doc.em);
            req.session.user = doc.em;
            //cookie set

            /*if (req.body.rememberme)
            {
            res.cookie('em', doc.em, { maxAge: 900000, httpOnly: true });
            res.cookie('pass', doc.pass, { maxAge: 900000, httpOnly: true });
            }*/
            res.redirect("/profile");
        }
        else
        {
            res.redirect("/");
        }
    });
});

//save profile and
var fs = require('fs');
var uploaddir = __dirname + "/public/uploads";
var fileupload = require('fileupload').createFileUpload(uploaddir).middleware

app.post('/saveprofile', fileupload, function (req, res) {
    console.log(req.body);
    if (req.body.fmfn != "") {

        
        var savePath = "/uploads/" + req.body.profpicture[0].path+"/"+req.body.profpicture[0].basename;
        
        console.log("file---path __", savePath);

        var user = new UserModel({
            fn: req.body.fmfn,
            ln: req.body.fmln,
            em: req.body.fmem,
            fbid: req.body.fmfbid,
            pass: req.body.fmpass,
            add1: req.body.fmadd1,
            add2: req.body.fmadd2,
            city: req.body.fmcity,
            state: req.body.fmstate,
            zip: req.body.fmzip,
            phone: req.body.fmphone,
            right: req.body.fmright,
            left: req.body.fmleft,
            fmhat: req.body.fmhat,
            fmheadm: req.body.fmheadm,
            fmhatm: req.body.fmhatm,
            fmshirt: req.body.fmshirt,
            fmchest: req.body.fmchest,
            fmneck: req.body.fmneck,
            fmsleeve: req.body.fmsleeve,
            fmglobe: req.body.fmglobe,
            fmring: req.body.fmring,
            fmhandl: req.body.fmhandl,
            fmhandw: req.body.fmhandw,
            fmpant: req.body.fmpant,
            fmwaist: req.body.fmwaist,
            fminseam: req.body.fminseam,
            fmshoe: req.body.fmshoe,
            fmsock: req.body.fmsock,
            un: "",
            badd1: "",
            badd2: "",
            bcity: "",
            bzip: "",
            bstate: "",
            photopath: savePath,
            birth: req.body.gsBirth,
            gender: req.body.fmgender
        });
        
        user.save(function (err) {
        if (!err) {
        console.log('user created');

        req.session.user = req.body.fmem;

        res.redirect('/profile');

        } else {
        console.log(err);
        res.send("db error");
        }
        });
        
    }
    else {
        res.send("You 're not authorized to access here");
    }
});

//profile

app.get('/profile', function (req, res) {
    console.log("request++++", req);
    if (req.session.user) {
        UserModel.findOne({ em: req.session.user }, function (err, doc) {
            if (err) {
                console.log(err);
            }
            else if (doc) {
                console.log(doc);

                ListModel.find({ userem: req.session.user }, function (err, doc1) {

                    console.log("my list --->", req);
                    var list = new Array();
                    for (var i = 0; i < doc1.length; i++) {
                        list[i] = doc1[i].name;
                    }
                    ProductModel.find({ userID: req.session.user }, function (er, docPro) {
                        
                         console.log("cur page--->", req.body.currentPage);
                        res.render('profile', { usr_profile: doc, mylist: doc1, myproducts:docPro, currentPage: req.body.currentPage, layout: false });

                        
                   });
                   
                });
            }
            else {
                res.redirect("/");
            }
        });
    }
    else {
        res.redirect('/');
    }
});
app.post('/profile/showlist', function (req, res) {
    console.log(req.session.user);
    if (req.session.user) {
        UserModel.findOne({ em: req.session.user }, function (err, doc) {

            console.log(doc);

            ListModel.find({ userem: req.session.user }, function (err, doc1) {

                console.log("my list --->", doc1);
                var list = new Array();
                for (var i = 0; i < doc1.length; i++) {
                    list[i] = doc1[i].name;
                }
                res.send(doc1);

            });
        });
    }

});

//edit - profile
app.get('/edit-profile',function(req,res)
{
	console.log(req.session.user);
	if (req.session.user)
	{
		
		UserModel.findOne({em: req.session.user},function(err,doc)
		{
			if(err)
			{
				console.log(err);
			}
			else if (doc)
			{
				console.log(doc);
				res.render('edit-profile',{usr_profile:doc,layout:false});
			}
			else
			{
				res.redirect("/");
			}
		});
	}
	else
	{
		res.redirect('/');
	}
});
//settings
app.get('/settings',function(req,res)
{
	console.log("settings session:"+req.session.user);
	
	if (req.session.user)
	{
		UserModel.findOne({em: req.session.user},function(err,doc)
		{
			if(err)
			{
				console.log(err);
			}
			else if (doc)
			{
				console.log("))))))))))))))))))-->",doc);
				res.render('settings',{usr_profile:doc,layout:false});
			}
			else
			{
				res.redirect("/");
			}
		});
	}
	else
	{
		res.redirect('/');
	}
});
app.post('/settings/update', function (req, res)
{
    console.log(req.body.PassChanged);

    if (req.body.PassChanged == "true")
    {
        console.log("password changed");

        UserModel.findOne({ em: req.body.em }, function (err, doc)
        {
            if (err)
            {
                console.log("db error");
            }
            else if (doc)
            {
                res.send("This email already exists");
            }
            else
            {
                console.log("updated Username--->", req);

                UserModel.update({ _id: req.body.pid }, { $set: { pass: req.body.newPass} }, function (err)
                {
                    if (err)
                    {
                        console.log(err)
                        res.send("db error");
                    }
                    else
                    {
                        req.session.user = req.body.em;
                        res.send("ok");
                    }
                });
            }
        });
    }
    else
    {
        console.log("password not changed");
        UserModel.update({ _id: req.body.pid }, { $set: { fn: req.body.fn, ln: req.body.ln, un:req.body.un} }, function (err)
        {
            if (err)
            {
                console.log(err)
                res.send("db error");
            }
            else
            {
                res.send("ok");
            }
        });
    }


});
app.post("/settings/billing", function (req, res)
{

    UserModel.findOne({ em: req.session.user }, function (err, doc)
    {
        if (err)
        {
            console.log("db error");
        }
        else
        {
            console.log("updated Username--------------------------->", req.session.user);
            
            UserModel.update({ em: req.session.user }, { $set: { add1: req.body.add1, add2: req.body.add2, zip: req.body.zip, 
                                                              state: req.body.state, city: req.body.city, 
                                                              badd1: req.body.badd1, 
                                                              badd2: req.body.badd2, bzip: req.body.bzip, bstate: req.body.bstate, 
                                                              bcity: req.body.bcity} }, function (err)
            {
                if (err)
                {
                    console.log(err)
                    //res.send("db error");
                }
                else
                {
                    //req.session.user = req.body.em;
                    res.send("ok");
                }
            });
        }
    });

});
app.post('/settings/del/account',function(req,res)
{
	console.log(req.body.pid);
	UserModel.remove({ _id: req.body.pid }, function (err) 
	{
		if (err)
		{
			console.log(err)
			res.send("dberror");
		}
		else
		{
			res.send("ok");
		}
	});
});
		
//logout
app.get('/logout',function(req,res)
{
	req.session.user=null;
	res.redirect('/');
});


app.get('/single-products',function(req,res)
{
	console.log("products session:"+req.session.user);
	
	if (req.session.user)
	{
        UserModel.findOne({em: req.session.user},function(err,doc)
		{
            console.log("**************************** products doc:"+doc);

			if(err) 
			{
				console.log(err);
			}
			else if (doc)
			{
				console.log("doc information" + doc);

				res.render('single-products',{usr_profile:doc,layout:false});
			}
			else
			{
				res.redirect("/");
			}
		});

	}
	else
	{
		res.redirect('/');
	}
});


//Facebook Connect
app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email','user_birthday','user_location' ] }));
app.get('/auth/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook',
        function(err, user, info) 
        {
    		console.log(user);
    		UserModel.findOne({em:user._json.email},function(err,doc)
    		{
    			if(err)
    			{
    				console.log(err);	
    			}
    			else if (doc)
    			{
					console.log(doc.em);
					
					req.session.user=doc.em;
					res.redirect("/profile");
				}
				else
				{
					var locquery="";
					if (user._json.location) locquery="&loc="+user._json.location.name;
					res.redirect("/checkverif?fbid="+user._json.id+"&em="+user._json.email+"&fn="+user._json.first_name+"&ln="+user._json.last_name+"&birth="+user._json.birthday+"&gen="+user._json.gender+locquery);
				}
    		});
        })(req, res, next);
});


/*********** amazon HTTP ****************/
require('./routes/amazonsearch')(app,opHelper, UserModel);

/********** add to my list ****************/
require('./routes/shopping-cart')(app, opHelper, UserModel, ProductModel,ec2,stripe);

/********** add to my list ****************/
require('./routes/add-product')(app, opHelper, UserModel, ProductModel, intFunc);

/********** product discovery ****************/
require('./routes/productdiscovery')(app, opHelper, UserModel, ProductModel,ListModel);

/***********gifts process*****************/
require('./routes/gifts')(app, opHelper, UserModel, ProductModel,GiftsModel);

/*
amazon lookup
*/
/************amazon**********
opHelper.execute('ItemLookup', {
        'ItemId': 'B00ECU34ZM',
        'MechantId': 'All',
        'Condition': 'All',
        'ResponseGroup': 'Medium'
    }, function(error, results) {
        if (error) { console.log('Error: ' + error + "\n") }
        console.log("Results:\n", results);
    });
    ec2.call("http://webservices.amazon.com/onca/xml?Service=AWSECommerceService&AWSAccessKeyId=AKIAI3BFGQFNAIKYF3OQ&Operation=CartCreate&Item.1.OfferListingId=B000062TU1&Item.1.Quantity=2&Timestamp=[YYYY-MM-DDThh:mm:ssZ]
&Signature=[Request Signature]", {}, function(result) {
console.log("test- result ", JSON.stringify(result));
})

/*************************
opHelper.execute('CartCreate', {
        'Item.1.OfferListingId': 'B00ECU34ZM',
        'Item.1.Quantity': '2',
        "AssociateTag" : 'surpassweb-20'
    }, function(error, results) {
        if (error) { console.log('Error: ' + error + "\n") }
       // console.log("Results:\n", results);
    });
opHelper.execute('CartGet', {
        "AssociateTag" : 'surpassweb-20'
    }, function(error, results) {
        if (error) { console.log('Error: ' + error + "\n") }
       // console.log(" get cart Results:\n", results);
    });


*/
/*****************List add process****************/



app.post('/profile/add-list', function (req, res) {

    var cur_user = req.session.user;
    var name = req.body.listname;
    var level = req.body.level;
    console.log("cur email-->", cur_user);

    ListModel.find({ userem: cur_user, name: name }, function (err, doc5) {

        console.log("ret-->", doc5)
        if (doc5.length == 0) {
            var mylist = new ListModel(
                {
                    userem: cur_user,
                    name: name,
                    level: level

                });
            mylist.save(function (err) {

                res.send("ok");

            });
        }
        else {

            res.send("Already exist");
        }
    });
});

/*************************************************/
app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


/******* origial

****/