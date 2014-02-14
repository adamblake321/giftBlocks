
module.exports = function (app, opHelper, UserModel, ProductModel, ec2, stripe) {
    //shopping-card

    app.post('/list/del-product', function (req, res) {

        var asin = req.body.asin;
        var userEm = req.session.user;
        console.log("asinwwwwwwwww---->", req.body);

        ProductModel.findOne({ userID: userEm, asin: asin }, function (err, doc) {

            ProductModel.remove({ asin: asin }, function (err, doc) {
                console.log("deeeeeeeeeeeeeeeeeeeeeeel*************", doc);
                //res.redirect("/shopping-cart");
                res.send("deleted");
            });

        })

    });
    app.post('/shopping-cart/add-cart', function (req, res) {

        var cartStr = req.body.cart;

        var subStr = cartStr.substring(1, cartStr.length - 1);

        var sliced = subStr.split(",");
        var reqStr = {};
        var idx = 1;
        for (var i = 0; i < sliced.length; i++) {
            var eachItem = sliced[i];
            var sl = eachItem.split(":");
            var key1 = sl[0].replace("\'", "");
            var val1 = sl[1].replace("\'", "");
            reqStr[key1.replace("\'", "")] = val1.replace("\'", "");
        }


        console.log("log--->", reqStr);

        opHelper.execute('CartCreate', reqStr, function (error, results) {

            console.log("cart result---->", results); ///successfully

            var cartRes = JSON.parse(results);
            var cartId = cartRes.CartCreateResponse.Cart.CartId;
            var hmac = cartRes.CartCreateResponse.Cart.HMAC
            var encodedHmac = cartRes.CartCreateResponse.Cart.URLEncondedHMAC;
            console.log("response cart id --- >", JSON.stringify(cartId));

            //res.send(cartId.CartCreateResponse.CartId);

            /*
            process cart adding.........
            awsId: 'AKIAIAWX2JJWY7VX4UNQ',
            awsSecret: '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',
            assocId: '4778-2896-4669'
            });
            */
            var aswId = 'AKIAIAWX2JJWY7VX4UNQ';
            var assocId = '4778-2896-4669';

            ec2.call("https://www.amazon.com/gp/cart/aws-merge.html?cart-id=" + cartId + "%26associate-id=" + assocId + "%26hmac=" + hmac + "%26AWSAccessKeyId=" + aswId, {}, function (result) {
                console.log("test- result ", result);
                //res.send(results);
            })

        });

    });

    app.get('/shopping-cart', function (req, res) {
    	var list = new Array();
    	
    	var aws = require("../lib/aws");
    	var yourAccessKeyId = 'AKIAIP56QNBSPZDATVRA';
    	var yourSecretAccessKey = 'GtImtR0iuM6qqp9TuSOlUnOI9BW7edFrXSjmPy+1';
    	var yourAssociateTag = 'unlimit.research@gmail.com';
    	prodAdv = aws.createProdAdvClient(yourAccessKeyId, yourSecretAccessKey, yourAssociateTag);

    	prodAdv.call("ItemSearch", {SearchIndex: "Beauty", Keywords: "coca cola lip balm"}, function(err, result) {
    	  console.log(result.Items);
    	});
    	
    	/*var aws = require("aws-lib"),
    		util = require("util"),
    		awsParam = require("../config.json");*/
    	
    	res.render('shopping-cart', { productList: result.Items, layout: false });
    	//res.render('shopping-cart', { productList: list, layout: false });
    	
    	/*if (req.session.user) {

            UserModel.findOne({ em: req.session.user }, function (err, doc) {

                console.log("get item asin", req.query.asin);
                var asin = req.query.asin;
                
                var list = new Array();

                if (asin != "" && typeof (asin) != "undefined") {
                    opHelper.execute('ItemLookup', {
                        'ItemId': asin,
                        'MechantId': 'All',
                        'Condition': 'All',
                        'ResponseGroup': 'Medium'
                    }, function (error, results) {
                        if (error) { res.redirect("/"); }
                        console.log("Results:\n", results.ItemLookupResponse);

                        //res.render('shopping-cart', { productList: list, layout: false });
                    });
                }
                else {
                    res.render('shopping-cart', { productList: list, layout: false });
                }

                /***************shopping*****************/
                /*
                if (err) {
                console.log(err);
                }
                else if (doc) {
                //console.log("doc information" + doc);

                ///Get product list
                ProductModel.find({ userID: doc.em }, function (err, doc1) {

                if (err)
                res.redirect('/');
                else {
                // console.log("shopping list----------->", doc1);

                res.render('shopping-cart', { productList: doc1, layout: false });
                }

                });

                
                }
                else {
                res.redirect("/");
                }
                */   
           //});

       //}
       
    	// else {
         //   res.redirect('/');
       //}
    });

    /************payment process*************/
    /*
    app.post("/shopping-cart/payment", function (req, res) {


    stripe.customers.create({
    card : req.body.stripeToken,
    email : "...", // customer's email (get it from db or session)
    plan : "browserling_developer"
    }, function (err, customer) {
    if (err) {
    var msg = customer.error.message || "unknown";
    res.send("Error while processing your payment: " + msg);
    }
    else {
    var id = customer.id;
    console.log('Success! Customer with Stripe ID ' + id + ' just signed up!');
    // save this customer to your database here!
    res.send('ok');
    }
    });

    });

    */
};