
module.exports = function (app, opHelper, UserModel, ProductModel, ListModel) {
    //shopping-card

    var productList = new Array();
    app.post("/productdiscovery/getList", function (req, res) {

        //res.send(req.body.asin);
        var asin = req.body.asin;

        ProductModel.find({ asin: asin, userID: req.session.user }, function (err, doc) {

            console.log("items------>", doc);
            if (doc == "" || doc.length == 0) {

                ///add process
                ListModel.find({ userem: req.session.user }, function (err, doc1) {

                    var listHtml = "";

                    for (var i = 0; i < doc1.length; i++) {
                        ///span.pull-left #{listdata[i].name}
                        listHtml += "<li class='listItemCls' id=" + i + " value=" + doc1[i].name + "><a id=" + i + " value=" + doc1[i].name + "><span class='pull-left'>" + doc1[i].name + "</span></a></li>";

                    }
                    res.send(listHtml);
                });

            }
            else {
                res.send("no");
            }

        });
    });

    app.get("/productdiscovery", function (req, res) {

        if (req.session.user) {
            var doc = ""
            var itemList = new Array();

            var totalPage = 5;
            var rtResult;
            var useremail = req.session.user;

            ListModel.find({ userem: useremail }, function (er, doc) {

                console.log("search key----->", req.query.Search);
                sendRequest(1, res, req.session.user, doc, req.query.Search);

            });

        }
        else {

            res.redirect("/");
        }
    });

    function sendRequest(currentPage, res, useremail, ListModel, key) {

        if (key == "" || typeof (key) == "undefined")
            key = " ";
        opHelper.execute('ItemSearch', {

            'SearchIndex': 'All',
            'Availability': 'Available',
            'ItemPage': currentPage,
            'Keywords': key,
            'ResponseGroup': 'ItemAttributes, Medium'
        }, function (error, results) {

            var jRes = JSON.parse(results);
            //console.log("error result", jRes);
            var Items = jRes.ItemSearchResponse.Items;
            var Item = jRes.ItemSearchResponse.Items.Item;
            var PageCount = jRes.ItemSearchResponse.Items.TotalPages;
            var pageIdx = currentPage - 1;


            if (currentPage < PageCount) {

                currentPage++;
                productList[pageIdx] = Item;
                sendRequest(currentPage, res, useremail, ListModel, key);
                console.log(Item);

            }
            else {

                var imageList = new Array();
                var asinList = new Array();
                var idx = 0;
                for (var i = 0; i < productList.length; i++) {

                    var itemlist = productList[i];

                    for (var j = 0; j < itemlist.length; j++) {

                       

                        if (typeof (itemlist[j].MediumImage) != "undefined" && typeof (itemlist[j].MediumImage.URL) != "undefined") {
                            imageList[idx] = itemlist[j].MediumImage.URL;
                            asinList[idx] = itemlist[j].ASIN;
                            idx++

                             console.log("item----------", itemlist[j].MediumImage.URL);
                        }
                    }
                }

                var listdata = new Array();

                res.render('productdiscovery', { imageList: imageList, asinList: asinList,search:key, layout: false });

            }

        });
    }
};