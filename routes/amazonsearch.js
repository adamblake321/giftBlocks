
module.exports = function (app, opHelper, UserModel) {
    var pageIdx = 1;

    app.get('/search', function (req, res) {

        var listname = req.query.listname;
        console.log("search list--->", listname);

        if (req.session.user) {
            UserModel.findOne({ em: req.session.user }, function (err, doc) {

                //res.render('search',{layout:false});

                if (err) {
                    console.log(err);
                }
                else if (doc) {
                    var key = req.query.Search;
                    if (req.query.Search == "" || typeof (req.query.Search) == "undefined")
                        key = " ";
                    if (req.query.flag == "prev") {
                        if (typeof (req.query.currentPage) != "undefined")
                            pageIdx = parseInt(req.query.currentPage) - 1; //req.query.currentPage
                    }
                    else if (req.query.flag == "next") {
                        if (typeof (req.query.currentPage) != "undefined")
                            pageIdx = parseInt(req.query.currentPage) + 1; //req.query.currentPage
                    }
                    else
                        pageIdx = 1;

                    opHelper.execute('ItemSearch', {

                        //               'ResponseGroup': 'ItemAttributes,Offers',
                        'SearchIndex': 'All',
                        'Availability': 'Available',
                        'Keywords': key,
                        'ItemPage': pageIdx,
                        'ResponseGroup': 'ItemAttributes, Medium'
                    }, function (error, results) {

                        var jRes = JSON.parse(results);
                        //console.log("error result", jRes);
                        var Items = jRes.ItemSearchResponse.Items;
                        var Item = jRes.ItemSearchResponse.Items.Item;
                        var PageCount = jRes.ItemSearchResponse.Items.TotalPages;
                        //console.log("product ----- info***", Items.Item);
                        //res.send(Item[0]);
                        if (error) { util.print('Error: ' + error + '\n') }  ///JSON.stringify(Item[0])

                        if (typeof (Item) == "undefined") {
                            //res.send(Items);
                            res.render('empty', { layout: false });
                        }
                        else {
                            var priceList = new Array();
                            var imageList = new Array();
                            var titleList = new Array();
                            var m_imageList = new Array();
                            var s_imageList = new Array();
                            var asinList = new Array();

                            var idx = 0;
                            for (var i = 0; i < Item.length; i++) {
                                if (typeof (Item[i].OfferSummary) != "undefined" && typeof (Item[i].OfferSummary.LowestNewPrice) != "undefined" && typeof (Item[i].LargeImage) != "undefined") {

                                    priceList[idx] = Item[i].OfferSummary.LowestNewPrice.FormattedPrice;
                                    imageList[idx] = Item[i].LargeImage.URL;
                                    m_imageList[idx] = Item[i].MediumImage.URL;
                                    s_imageList[idx] = Item[i].SmallImage.URL;

                                    titleList[idx] = Item[i].ItemAttributes.Title;
                                    asinList[idx] = Item[i].ASIN;

                                    idx++
                                }

                            }
                            //console.log("product ----- info", priceList);
                            console.log("list name ----->", listname);

                            res.render('search', {
                                PageCount: 5,
                                ImageList: imageList,
                                M_ImageList: m_imageList,
                                S_imageList: s_imageList,
                                PriceList: priceList,
                                TitleList: titleList,
                                keyword: key,
                                currentPage: pageIdx,
                                asinList: asinList,  //req.query.page || pageIdx
                                listname: listname,
                                layout: false
                            });
                        }

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

};