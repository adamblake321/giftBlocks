$(document).ready(function () {
    var currentPage = 1;
    var totalPage;

    $.post('/profile/showlist', "", function (data) {

        var curPage = $("#currentPage").val();
        //alert(curPage);

        listData = data;
        
        var pageIdx = 1;
        var countperpage = 5;
        var rem = 0;
        if (data.length % countperpage != 0)
            rem++;
        var pagecount = parseInt(data.length / countperpage) + rem;
        totalPage = pagecount;
        //alert(pagecount);
        //currentPage = 1;
        var pagenationHTML = "<li><a id='first'><</a></li>"
        for (var i = 0; i < pagecount; i++) {

            var tmp = i + 1;
            if (i == 0)
                pagenationHTML += "<li class='active'><input type='hidden' id=" + i + "/><a id="+ i + " class='itemPage'><span class='badge'>" + tmp + "</span></a></li>";
            else
                pagenationHTML += "<li><input type='hidden' id=" + i + "/><a id=" +  i + " class='itemPage'><span class='badge'>" + tmp + "</span></a></li>";
        }
        pagenationHTML += "<li><a id='last' class='perPage'>></a></li>";

        $("#listpagenation").html(pagenationHTML);


        var listperHTML = "";


        var lastcount = 5 * (currentPage - 1);
        var returnStr = "";
        if (currentPage != totalPage) {
            for (var i = lastcount; i < (lastcount + 5); i++) {  //.span11.well(style='margin-left: 0; background: #f9fafb;')
                returnStr += "<div class='span11 well perPageCls' id=" + i + " style='word-wrap:break-word;margin-left: 0; background: #f9fafb;'><strong><danger>" + data[i].name + "</danger></strong><strong><danger>></danger></strong></div>";
            }
        }
        else {

            for (var i = (totalPage - 1); i < data.length; i++) {
                returnStr += "<div class='span11 well perPageCls' id=" + i + " style='word-wrap:break-word;margin-left: 0; background: #f9fafb;'><strong><danger>" + data[i].name + "</danger></strong><strong><danger>></danger></strong></div>";
            }
        }


        $("#listPages").html(returnStr);
        var scriptLib = '<script src="js/qcustompagenation.js" />';
        $("#listPages").append(scriptLib);

    });

    
    /***********************profile page*******************/
    //alert("aa");
    if ($("#gender-val").val() == 'female') {
        $("#gender-photo").attr("src", 'img/man-small.png');
    }
    else {
        $("#gender-photo").attr("src", 'img/woman-small.png');
    }

    $("#listcreatbtn").click(function () {

        var listname = $("#listname").val();
        var level = "test";

        if (listname.trim() != "" && level.trim() !== "") {
            $.post('/profile/add-list', { "listname": listname, "level": level }, function (data) {

                if (data == "ok") {
                    location.href = "/search?search=' '&listname="+listname;
                }
                else
                    alert(data);
            });

        }

    });
    $(".close.close-add-list").click(function () {
      
    });

});