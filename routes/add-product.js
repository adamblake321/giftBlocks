
module.exports = function (app, opHelper, UserModel, ProductModel, intFunc) {


    //////add - product
    app.post('/add-product', function (req, res) {
        console.log("add product--------");
        //res.send("add products");
        var currentEmail = req.session.user;
        var currentUserId;
        var listname = req.body.listname;
         
        console.log("add product to listv-- >", listname);
        
        if (req.session.user) {

            UserModel.findOne({ em: currentEmail }, function (err, doc) {

                currentUserId = doc.em;

                if (err) {
                    res.redirect('/');
                }
                else {

                   
                    //res.send("signed");
                    ProductModel.findOne({ asin: req.body.asin, userID: doc.em }, function (err, doc) {

                        var date = new Date();
                        date = date.toString('yyyy-MM-dd');
                        if (!doc) {
                            //res.send(doc);
                            var details;
                            opHelper.execute('ItemLookup', {
                                'ItemId': req.body.asin,
                                'MechantId': 'All',
                                'Condition': 'All',
                                'ResponseGroup': 'Medium'
                            }, function (error, results) {
                                var jRes = JSON.parse(results);

                                var items = jRes.ItemLookupResponse.Items;
                                var item = items.Item;


                                var name = item.ItemAttributes.Label;
                                var price = item.OfferSummary.LowestNewPrice.FormattedPrice;
                                var img = item.MediumImage.URL;
                                var details = item.ItemAttributes.Title;

                                if (error) {
                                    res.render('/', { productList: results, layout: false });
                                }
                                else {

                                    
                                   
                                    var myproductModel = new ProductModel({
                                        asin: req.body.asin,
                                        date: date,
                                        amount: 1,
                                        userID: currentUserId,
                                        name: name,
                                        price: price,
                                        img: img,
                                        details: details,
                                        listId: listname
                                    });

                                    myproductModel.save(function (err) {
                                        if (!err) {
                                            res.send("added in your list successfully");
                                        } else {
                                            console.log(err);
                                            res.send("model save");
                                        }
                                    });


                                }


                            });

                        }
                        else {

                            /////product add process
                            var orgmount = intFunc(doc.amount) + 1;
                            //res.send(orgmount.toString());
                            var name = listname;
                            ProductModel.update({ asin: req.body.asin, userID: doc.em, listId: name }, { $set: { amount: orgmount, date: date} }, function (err) {
                                if (err) {
                                    console.log(err)
                                    res.send("db error");
                                }
                                else {

                                    res.send("Updated in your list successfully");
                                }
                            });
                            //// product update process

                        }
                    });

                }
            });

        }
        else {

            res.redirect('/');
        }

    });


};