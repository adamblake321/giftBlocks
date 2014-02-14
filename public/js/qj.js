$(document).ready(function () {
    function checkEmail(str) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(str)) {
            return false;
        }
        else {
            return true;
        }

    }
    $("#clkSgnUp").click(function () {
        var fn = $("#firstNameInput-SignUp").val();
        var ln = $("#lastNameInput-SignUp").val();
        var em = $("#emailInput-SignUp").val();
        if (fn == "") {
            alert("Please Input First Name");
            return false;
        }
        if (ln == "") {
            alert("Please Input Last Name");
            return false;
        }
        if (checkEmail(em) == false) {
            alert("Please Input valid email");
            return false;
        }

        if ($("#termchk").hasClass("checked") == false) {
            alert("Please accept terms & conditions");
            return false;
        }
        else {

            $.post('/sendverif', { "em": em, "fn": fn, "ln": ln }, function (data) {
                if (data == "ok") {
                    alert("You 'll get verification email within 3 mins");
                }

            });
        }
    });

    //getting started 
    if (typeof gender != "undefined") {
        $("#gsBirth").datepicker();
        $("#gsGender").val(gender);
        $("#gsAdd1").val(loc);
        $("#gsBirth").val(birth);
        //alert(birth);
    }

    function showorhide(selector, visible) {
        if (visible)
            $(selector).removeClass("gssizinghide").addClass("gssizingshow");
        else
            $(selector).removeClass("gssizingshow").addClass("gssizinghide");
    }
    $("#gsHat").blur(function () {
        showorhide(".gshat", this.value != "");
    });

    $("#gsShirt").blur(function () {
        showorhide(".gsshirt", this.value != "");
    });
    $("#gsGlobe").blur(function () {
        showorhide(".gsglobe", this.value != "");
    });
    $("#gsPant").blur(function () {
        showorhide(".gspaant", this.value != "");
    });

    function tag_generator(category) {
        var ary = [];
        switch (category) {
            case "hat":
                ary = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
                break;
            case "headm":
                for (i = 20; i <= 28; i++) ary.push(i.toString());
                break;
            case "hatm":
                for (i = 21; i <= 30; i++) ary.push(i.toString());
                break;
            case "shirt":
                ary = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL(1X)', '2X', '3X', '4X', '5X', '6X', '7X', '8X', '9X', '10X'];
                break;
            case "chestm":
                for (i = 30; i <= 65; i++) ary.push(i.toString());
                break;
            case "neckm":
                for (i = 10; i <= 28; i++) ary.push(i.toString());
                break;
            case "sleevem":
                for (i = 22; i <= 46; i++) ary.push(i.toString());
                break;
            case "globe":
                ary = ['XS', 'S', 'M', 'L', 'XL'];
                break;
            case "ring":
                for (i = 0; i <= 14; i += 0.25) ary.push(i.toString());
                break;
            case "headlm":
                for (i = 6; i <= 10; i += 0.1) ary.push(i.toFixed(1).toString());
                break;
            case "headwm":
                for (i = 5; i <= 9; i += 0.1) ary.push(i.toFixed(1).toString());
                break;
            case "waist":

                if ($("#gsGender").val() == "male") {
                    for (i = 26; i <= 60; i++) ary.push(i.toString());
                }
                else {
                    for (i = 20; i <= 45; i++) ary.push(i.toString());
                }

                break;
            case "inseam":
                for (i = 24; i <= 40; i++) ary.push(i.toString());
                break;
            case "shoe":
                {
                    if ($("#gsGender").val() == "male")
                        for (i = 1; i <= 18; i += 0.5) ary.push(i.toString());
                    else
                        for (i = 1; i <= 13; i += 0.5) ary.push(i.toString());

                }
                break;
            case "sock":
                var ary = ['S', 'M', 'L', 'XL'];
                break;
        }
        return ary;
    }

    function auto_text() {
        var hatTags = tag_generator("hat");

        var headmTags = tag_generator("headm");
        var hatmTags = tag_generator("hatm");
        var pantTags = shirtTags = tag_generator("shirt");
        var chestmTags = tag_generator("chestm");
        var neckmTags = tag_generator("neckm");
        var sleevemTags = tag_generator("sleevem");
        var globeTags = tag_generator("globe");
        var ringTags = tag_generator("ring");
        var handlmTags = tag_generator("headlm");
        var handwmTags = tag_generator("headwm");
        var waistTags = tag_generator("waist");
        var inseamTags = tag_generator("inseam");

        var shoeTags = tag_generator("shoe");

        var sockTags = tag_generator("sock");

        $("#gsHat").autocomplete({ source: hatTags });
        $("#gsHeadM").autocomplete({ source: headmTags });
        $("#gsHatM").autocomplete({ source: hatmTags });

        $("#gsShirt").autocomplete({ source: shirtTags });
        $("#gsChestM").autocomplete({ source: chestmTags });
        $("#gsNeckM").autocomplete({ source: neckmTags });
        $("#gsSleeveM").autocomplete({ source: sleevemTags });

        $("#gsGlobe").autocomplete({ source: globeTags });
        $("#gsRing").autocomplete({ source: ringTags });
        $("#gsHandlM").autocomplete({ source: handlmTags });
        $("#gsHandwM").autocomplete({ source: handwmTags });


        $("#gsPant").autocomplete({ source: pantTags });
        $("#gsWaist").autocomplete({ source: waistTags });
        $("#gsInseam").autocomplete({ source: inseamTags });

        $("#gsShoe").autocomplete({ source: shoeTags });
        $("#gsSock").autocomplete({ source: sockTags });


    }


    function step1Val() {
        var errmsg = "";

        if ($("#gsPass1").val().length < 1)
            errmsg = "Password should be at least 1 letter!<br>";
        else {
            if ($("#gsPass1").val() != $("#gsPass2").val()) {
                errmsg += "Password doesn't match<br>";
            }
        }
        if ($.trim($("#gsAdd1").val()) == "")
            errmsg += "Please input Address1!<br>";


        if ($.trim($("#gsAddCity").val()) == "")
            errmsg += "Please input the city!<br>";

        if ($.trim($("#gsAddState").val()) == "")
            errmsg += "Please input state!<br>";

        if ($.trim($("#gsAddZip").val()) == "")
            errmsg += "Please input the zip!<br>";

        if ($.trim($("#gsPhone").val()) == "")
            errmsg += "Please input phone number<br>";

        if ($.trim($("#gsBirth").val()) == "")
            errmsg += "Please input birthday<br>";

        if ($.trim($("#gsGender").val()) == "")
            errmsg += "Please select the gender!<br>";

        return errmsg;
    }
    function step2Val() {
        var shtml = "<div>First name: " + fn + " </div>" + "<div>Last name:" + ln + " </div>" + "<div>Email: " + em + "</div>";

        shtml += "<div>Address1: " + $("#gsAdd1").val() + "</div>";
        shtml += "<div>Address2: " + $("#gsAdd2").val() + "</div>";
        shtml += "<div>City: " + $("#gsAddCity").val() + "</div>";
        shtml += "<div>State: " + $("#gsAddState").val() + "</div>";
        shtml += "<div>Zip: " + $("#gsAddZip").val() + "</div>";
        shtml += "<div>Phone: " + $("#gsPhone").val() + "</div>";
        shtml += "<div>Gender: " + $("#gsGender").val() + "</div>";


        var right = $("#checkbox1").attr("checked");
        var left = $("#checkbox2").attr("checked");

        if (right == "checked")
            shtml += "<div>Right Handed</div>";
        if (left == "checked")
            shtml += "<div>Left Handed</div>";
        shtml += "<div>Hat: " + $("#gsHat").val() + "</div>";
        shtml += "<div>Head Measurement: " + $("#gsHeadM").val() + "</div>";
        shtml += "<div>Hat Measurement: " + $("#gsHatM").val() + "</div>";
        shtml += "<div>Shirt: " + $("#gsShirt").val() + "</div>";
        shtml += "<div>Chest Measurement: " + $("#gsChestM").val() + "</div>";
        shtml += "<div>Neck Measurement: " + $("#gsNeckM").val() + "</div>";
        shtml += "<div>Sleeve Measurement: " + $("#gsSleeveM").val() + "</div>";
        shtml += "<div>Globe: " + $("#gsGlobe").val() + "</div>";
        shtml += "<div>Ring: " + $("#gsRing").val() + "</div>";
        shtml += "<div>Hand Length: " + $("#gsHandlM").val() + "</div>";
        shtml += "<div>Hand Width: " + $("#gsHandwM").val() + "</div>";
        shtml += "<div>Pant: " + $("#gsPant").val() + "</div>";
        shtml += "<div>Waist: " + $("#gsWaist").val() + "</div>";
        shtml += "<div>Inseam: " + $("#gsInseam").val() + "</div>";
        shtml += "<div>Shoe: " + $("#gsShoe").val() + "</div>";
        shtml += "<div>Sock: " + $("#gsSock").val() + "</div>";
        return shtml;
    }

    $(".btn-next").click(function () {
        var currentObj = $("ul.steps").find(".active");
        var currentTarget = currentObj.attr("data-target");
        var nextObj, nextTarget;
        if (currentTarget != "#step3") {

            if (currentTarget == "#step1") {
                var err = step1Val();
                $("#gserr").html(err);
                if (err != "") {
                    showorhide("#gserr", true);
                    return;
                }
                else {
                    showorhide("#gserr", false);
                    auto_text();
                }

            }

            if (currentTarget == "#step2") {
                $("#step3").html(step2Val());
            }

            nextObj = currentObj.next();
            nextTarget = nextObj.attr("data-target");

            currentObj.removeClass("active").addClass("complete");
            currentObj.find("span.badge").removeClass("badge-info").addClass("badge-success");

            nextObj.addClass("active");
            nextObj.find("span.badge").addClass("badge-info");
            $(currentTarget).removeClass("active");
            $(nextTarget).addClass("active");


        }
        else {
            var formobj = $("#allstepsform");
            shtml = formobj.html();
            shtml += "<input type='hidden' name='fmpass' value='" + $("#gsPass1").val() + "'>";
            shtml += "<input type='hidden' name='fmfbid' value='" + fbid + "'>";
            shtml += "<input type='hidden' name='fmfn' value='" + fn + "'>";
            shtml += "<input type='hidden' name='fmln' value='" + ln + "'>";
            shtml += "<input type='hidden' name='fmem' value='" + em + "'>";
            shtml += "<input type='hidden' name='fmadd1' value='" + $("#gsAdd1").val() + "'>";
            shtml += "<input type='hidden' name='fmadd2' value='" + $("#gsAdd2").val() + "'>";
            shtml += "<input type='hidden' name='fmcity' value='" + $("#gsAddCity").val() + "'>";
            shtml += "<input type='hidden' name='fmstate' value='" + $("#gsAddState").val() + "'>";
            shtml += "<input type='hidden' name='fmzip' value='" + $("#gsAddZip").val() + "'>";
            shtml += "<input type='hidden' name='fmphone' value='" + $("#gsPhone").val() + "'>";
            shtml += "<input type='hidden' name='fmgender' value='" + $("#gsGender").val() + "'>";
            shtml += "<input type='hidden' name='fmright' value='" + $("#checkbox1").attr("checked") + "'>";
            shtml += "<input type='hidden' name='fmleft' value='" + $("#checkbox1").attr("checked") + "'>";
            shtml += "<input type='hidden' name='fmhat' value='" + $("#gsHat").val() + "'>";
            shtml += "<input type='hidden' name='fmheadm' value='" + $("#gsHeadM").val() + "'>";
            shtml += "<input type='hidden' name='fmhatm' value='" + $("#gsHatM").val() + "'>";
            shtml += "<input type='hidden' name='fmshirt' value='" + $("#gsShirt").val() + "'>";
            shtml += "<input type='hidden' name='fmchest' value='" + $("#gsChestM").val() + "'>";
            shtml += "<input type='hidden' name='fmneck' value='" + $("#gsNeckM").val() + "'>";
            shtml += "<input type='hidden' name='fmsleeve' value='" + $("#gsSleeveM").val() + "'>";
            shtml += "<input type='hidden' name='fmglobe' value='" + $("#gsGlobe").val() + "'>";
            shtml += "<input type='hidden' name='fmring' value='" + $("#gsRing").val() + "'>";
            shtml += "<input type='hidden' name='fmhandl' value='" + $("#gsHandlM").val() + "'>";
            shtml += "<input type='hidden' name='fmhandw' value='" + $("#gsHandwM").val() + "'>";
            shtml += "<input type='hidden' name='fmpant' value='" + $("#gsPant").val() + "'>";
            shtml += "<input type='hidden' name='fmwaist' value='" + $("#gsWaist").val() + "'>";
            shtml += "<input type='hidden' name='fminseam' value='" + $("#gsInseam").val() + "'>";
            shtml += "<input type='hidden' name='fmshoe' value='" + $("#gsShoe").val() + "'>";
            shtml += "<input type='hidden' name='fmsock' value='" + $("#gsSock").val() + "'>";
            shtml += "<input type='hidden' name='gsBirth' value='" + $("#gsBirth").val() + "'>";

            //alert(shtml);
            formobj.append(shtml);
            formobj.submit();
        }


    });

    $(".btn-prev").click(function () {

        var currentObj = $("ul.steps").find(".active");
        var currentTarget = currentObj.attr("data-target");
        var prevObj, prevTarget;
        if (currentTarget != "#step1") {
            prevObj = currentObj.prev();
            prevTarget = prevObj.attr("data-target");

            currentObj.removeClass("active");
            currentObj.find("span.badge").removeClass("badge-info");
            prevObj.removeClass("complete").addClass("active");
            prevObj.find("span.badge").removeClass("badge-success").addClass("badge-info");

            $(currentTarget).removeClass("active");
            $(prevTarget).addClass("active");

        }

    });

    //settings

    $("#btnaccntupdate").click(function () {
        var pid = $("#set_pid").val();
        var fn = $("#set_fn").val();
        var ln = $("#set_ln").val();
        var em = $("#set_em").val();
        var cem = $("#set_cem").val();
        var hem = $("#set_hem").val();
        var hfn = $("#set_hfn").val();
        var hln = $("#set_hln").val();
        var uname = $("#set_un").val();

        if ($.trim(uname) == "") {
            alert("Input user name");
            return;
        }
        if ($.trim(fn) == "") {
            alert("Input first name");
            return;
        }
        if ($.trim(ln) == "") {
            alert("Input last name");
            return;
        }
        if (!checkEmail(em)) {
            alert("Incorrect email address!");
            return;
        }
        if ($.trim(em) != $.trim(cem)) {
            alert("Email address doesn't match!");
            return;
        }
        if ($.trim(fn) != hfn || $.trim(ln) != hln || $.trim(em) != hem) {
            $.post('/settings/update', { "pid": pid, "fn": fn, "ln": ln, "em": em, "un": uname, "PassChanged": !(hem == $.trim(em)) }, function (data) {
                if (data == "ok") {
                    alert("updated successfully.");
                }
                else {
                    alert(data);
                }
            });
        }
        else {
            alert("no data to update");
        }

    });

    $("#delaccnt").click(function () {
        if ($("#delconfirmmsg").val() == "DELETE") {
            var pid = $("#set_pid").val();
            $.post('/settings/del/account', { "pid": pid }, function (data) {
                if (data == "ok") {
                    window.location = "/logout";
                }
                else {
                    alert(data);
                }
            });

        }
        else {
            alert('Input "DELETE"');
        }
    });

    $(".btn-success.pass-change").click(function () {
        var pid = $("#set_pid").val();
        var oldPass = $("#o_pwd").val();
        var newPass = $("#n_pwd").val();
        var confirmPass = $("#confirm").val();

        var orgpass = $("#orgPass").val();

        if ($.trim(oldPass) == "") {
            alert("Please input old password");
            return;
        }
        else if (oldPass != orgpass) {
            alert("Incorrect Password");
            return;
        }
        else if ($.trim(newPass) == "") {
            alert("Please input new password");
            return;
        }
        else if ($.trim(confirmPass) == "") {
            alert("Please input confirm password");
            return;
        }
        else if (newPass != confirmPass) {
            alert("Please confirm password");
            return;
        }
        else {

            var cem = $("#set_cem").val();

            $.post('/settings/update', { "pid": pid, "newPass": newPass, "PassChanged": "true" }, function (data) {
                if (data == "ok") {
                    alert("updated successfully.");
                }
                else {
                    alert(data);
                }
            });

        }

    });

    $(".btnbtn-success.billsubmit").click(function () {
        var pid = $("#set_pid").val();
        var add1 = $("#add1").val();
        var add2 = $("#add2").val();
        var zip = $("#zip").val();
        var state = $("#state").val();
        var city = $("#city").val();


        var badd1 = $("#badd1").val();
        var badd2 = $("#badd2").val();
        var bzip = $("#bzip").val();
        var bstate = $("#bstate").val();
        var bcity = $("#bcity").val();

        $.post('/settings/billing', { "add1": add1, "add2": add2, "zip": zip, "state": state,
            "city": city, "badd1": badd1, "badd2": badd2, "bzip": bzip,
            "bstate": bstate, "bcity": bcity
        }, function (data) {
            if (data == "ok") {
                alert("updated successfully.");
            }
            else {
                alert(data);
            }
        });

    });

    //////////////product add process
    $(".addItemCls").click(function () {
        var id = $(this).attr("id");
        //alert($('input#' + id).val());
        var amount = 1;
        var asin = $('input#' + id).val();
        var listname = $("#productlistname").val();
        

        $.post('/add-product', { "amount": amount, "asin": asin, "listname": listname }, function (data) {
            alert(data);
        });

    });


    /*********************shipping cart del****************************/
    $(".close.shopping").click(function () {
        var val = $(this).attr("id");
        var asin = $('input#' + val).val();

        $.post('/shopping-cart/del-product', { 'asin': asin }, function (data) {
            alert("Deleted product in your list");
            location.href = "/shopping-cart";
            //alert("deleted product in your list");
        });
    });

    /************************sum order list********************************/

    var defaultTax = 0.07; /// 7%

    if (typeof ($(".span8#customOrderList").html()) != "undefined") {
        //alert("oder list show");
        var html = $(".span8#customOrderList");
        var totalObj = html.find("#productCart.row-fluid");
        //alert(totalObj.eq(0).find("b").text());

        var T_price = 0;
        var T_tax = 0;

        for (var i = 0; i < totalObj.length; i++) {
            var temp = totalObj.eq(i).find("b").text();
            var sub = temp.substring(1, temp.length);

            T_price += parseFloat(sub, 2);
            var t_tax = parseFloat(sub, 2) * defaultTax;
            //alert(t_tax);

            T_tax += t_tax;
        }

        var str = T_price.toString();
        var cutIdx = 0;
        for (var i = 0; i < (str.length - 1); i++) {
            var temp = str.substring(i, i + 1);
            if (temp == ".")
                cutIdx = i;
        }

        var orderShow = str.substring(0, cutIdx + 3);
        //alert(orderShow);
        $("#subtotalorder").text("$" + orderShow);

        /**************tax*******************/
        var str = T_tax.toString();

        for (var i = 0; i < (str.length - 1); i++) {
            var temp = str.substring(i, i + 1);
            if (temp == ".")
                cutIdx = i;
        }
        var orderShow1 = str.substring(0, cutIdx + 3);
        $("#tax").text("$" + orderShow1);

        /****************total *****************/
        var su = parseFloat(orderShow, 2);
        var tu = parseFloat(orderShow1, 2);
        var total = su + tu;
        $("#totalorder").text("$" + total.toString());
    }
    //var currentVal;

    $(".quantyCls").change(function (e) {

        var id = $(this).attr("id");
        if ($(this).val() < 1)
            $(this).val("1");
        /************key event capture************/
        var hiddenVal = $("input[type=hidden]#" + id).val();

        $("input[type=hidden]#" + id).val($(this).val());

        var operFlag = 0; //plus process: 0 , minus: 1, none:-1
        if ($(this).val() == hiddenVal) {
            operFlag = -1;
        }
        else if ($(this).val() > hiddenVal) {
            hiddenVal = $(this).val();
            operFlag = 0;
        }
        else {
            hiddenVal = $(this).val();
            operFlag = 1;
        }

        /*************************/

        if (operFlag == -1)
            return;

        var quanty = $(this).val();
        //alert($(this).attr("id"));

        var priceObj = $("b#" + id).text();

        var orgOrder = $("#subtotalorder").text();
        var sub = priceObj.substring(1, priceObj.length);   // new price
        var sub1 = orgOrder.substring(1, orgOrder.length); ///org total price
        var newOrder;

        if (operFlag == 0)
            newOrder = parseFloat(sub1, 2) + parseFloat(sub, 2);
        else
            newOrder = parseFloat(sub1, 2) - parseFloat(sub, 2);

        var cutIdx = 0;
        var str = newOrder.toString();
        for (var i = 0; i < (str.length - 1); i++) {
            var temp = str.substring(i, i + 1);
            if (temp == ".")
                cutIdx = i;
        }

        var orderShow = str.substring(0, cutIdx + 3);
        $("#subtotalorder").text("$" + orderShow);

        /*******************tax********************/

        ////tax process
        var T_tax = 0;
        var orgTax = $("#tax").text();
        orgTax = orgTax.substring(1, orgTax.length);
        var t_tax = parseFloat(sub, 2) * defaultTax;

        if (operFlag == 0)
            T_tax = parseFloat(orgTax, 2) + t_tax;
        else
            T_tax = parseFloat(orgTax, 2) - t_tax;

        var cutIdx1 = 0;
        var str1 = T_tax.toString();
        //alert(str1);
        for (var i = 0; i < (str1.length - 1); i++) {
            var temp = str1.substring(i, i + 1);
            if (temp == ".")
                cutIdx1 = i;
        }
        str1 = str1.substring(0, cutIdx1 + 3);
        $("#tax").text("$" + str1);

        /*******************total**********************/

        var subT = parseFloat(orderShow, 2) + parseFloat(str1, 2);
        $("#totalorder").text("$" + subT.toString());
    });
    /****************************shopping eventss**************************************/
    $(".shoppingNext").on("click", function () {

        var containObj = $(".steps");
        var idx = 0;
        for (var i = 0; i < (containObj.find("li").length - 1); i++) {

            if (containObj.find("li").eq(i).hasClass("active")) {
                idx = i;
            }
        }


        var prevId = containObj.find("li").eq(idx).attr("data-target");
        var contentId = containObj.find("li").eq(idx + 1).attr("data-target");

        ////billing process


        if (prevId == "#step2") {

            /*********************************payment process******************************************/

            if ($("#billingEmail").val().trim() == "") {
                alert("Please input E-Mail");
                return;
            } else if ($("#billingStreet").val().trim() == "") {
                alert("Please input Street Address");
            }
            else if ($("#billingZip").val().trim() == "") {
                alert("Please input Zip code");
            }
            else if ($("#billingCity").val().trim() == "") {
                alert("Please input City");
            }
            else if ($("#billingState").val().trim() == "") {
                alert("Please input State");
            }
            else if ($("#billingCountry").val().trim() == "") {
                alert("Please input Country");
            }
            else if ($("#cardHolder").val().trim() == "" || $("#cardNumber1").val().trim() == "" ||
                    $("#cardNumber2").val().trim() == "" || $("#cardNumber3").val().trim() == "" ||
                    $("#cardNumber4").val().trim() == "" || $("#cardCvv").val().trim() == "") {
                alert("Please input card Information");
            }
            else {

                containObj.find("li").eq(idx + 1).addClass("active");

                containObj.find("li").eq(idx).removeClass("active");
                containObj.find("li").eq(idx).addClass("complete");

                if ($(contentId).hasClass("step-pane")) {
                    $(prevId).removeClass("active");
                    $(contentId).addClass("active");
                }

                $("#payment-form").submit();
            }
        }
        else if (prevId == "#step3") {

            /*********************************shipping process******************************************/


            if ($("#shippingName").val().trim() == "") {
                alert("Please input Full Name");
            }
            else if ($("#shippingAddr1").val().trim() == "") {
                alert("Please input Address Line1");
            }
            else if ($("#shippingAddr2").val().trim() == "") {
                alert("Please input Address Line2");
            }
            else if ($("#shippingCity").val().trim() == "") {
                alert("Please input City");
            }
            else if ($("#shippingState").val().trim() == "") {
                alert("Please input State");
            }
            else if ($("#shippingZip").val().trim() == "") {
                alert("Please input Zip");
            }
            else if ($("#shippingCountry").val().trim() == "") {
                alert("Please select Country");
            }
            else {


                containObj.find("li").eq(idx + 1).addClass("active");

                containObj.find("li").eq(idx).removeClass("active");
                containObj.find("li").eq(idx).addClass("complete");

                if ($(contentId).hasClass("step-pane")) {
                    $(prevId).removeClass("active");
                    $(contentId).addClass("active");
                }
            }

        }

        else {
            containObj.find("li").eq(idx + 1).addClass("active");

            containObj.find("li").eq(idx).removeClass("active");
            containObj.find("li").eq(idx).addClass("complete");

            if ($(contentId).hasClass("step-pane")) {
                $(prevId).removeClass("active");
                $(contentId).addClass("active");
            }
        }


        if (prevId == "#step1") {
            /***************************shopping cart process***************************************/
            //alert("adding cart"); 
            alert($("#productCart.row-fluid").length);
            //var asin = $("#productCart.row-fluid a input") 
            //var cartList = new Array();
            var catStr = "{";
            for (var i = 0; i < $("#productCart.row-fluid").length; i++) {

                var asin = $("#productCart.row-fluid a input#itemclosed" + i).val();

                var mount = $(".quantyCls" + i).val();
                var idx = i + 1;
                catStr += "'Item." + idx + ".ASIN'" + ":" + "'" + asin + "',";
                catStr += "'Item." + idx + ".Quantity'" + ":" + "'" + mount + "',";

            }
            catStr += "'ResponseGroup':'Cart'}";

            $.post('/shopping-cart/add-cart', { "cart": catStr }, function (data) {

                if (data == "ok") {
                    alert("ased successfully.");
                }
                else {
                    alert(data);
                }
            });

        }

    });
    $(".shoppingPrev").on("click", function () {

        var containObj = $(".steps");
        var idx = 0;
        for (var i = 1; i < (containObj.find("li").length); i++) {

            if (containObj.find("li").eq(i).hasClass("active")) {

                idx = i;
            }
        }

        containObj.find("li").eq(idx).removeClass("active");
        containObj.find("li").eq(idx).removeClass("complete");

        containObj.find("li").eq(idx - 1).addClass("active");
        var prevId = containObj.find("li").eq(idx).attr("data-target");
        var contentId = containObj.find("li").eq(idx - 1).attr("data-target");

        if ($(contentId).hasClass("step-pane")) {
            $(prevId).removeClass("active");
            $(contentId).addClass("active");
        }

    });


    /****************************left/right hand clicked*********************************/

    var r_val = $(".r_checkCls").val();
    var l_val = $(".l_checkCls").val();

    if (r_val == "checked")
        $("#chk1").addClass("checked");
    if (l_val == "checked")
        $("#chk2").addClass("checked");

    $("label.checkbox.primary").click(function () {

        //alert($(this).attr("for"));

        if ($(this).attr("for") == "checkbox1") {
            if ($(this).hasClass("checked")) {

                $(".r_checkCls").val("checked");
            }
            else {
                $(".r_checkCls").val("unchecked");
            }
        }
        else {

            if ($(this).hasClass("checked")) {


                $(".l_checkCls").val("checked"); // unchecked
            }
            else {
                $(".l_checkCls").val("unchecked");
            }
        }

    });

    /***********************************Single product **************************/
    $("a.btn.btn-small.btn-info.btn-block").click(function () {
        //alert($(this).attr("name"));

    });

    /*********************           checkout process              *************************/



});