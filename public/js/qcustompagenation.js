$(document).ready(function () {


    //alert(listData);

    $("#first").click(function () {


        var currentPage = 1;



        var lastcount = 0;

        var countperpage = 5;
        var returnStr = "";
        var rem = 0;
        if (listData.length % countperpage != 0)
            rem++;
        var pagecount = parseInt(listData.length / countperpage) + rem;

        var totalPage = pagecount;

        if (currentPage != totalPage ) {
            for (var i = lastcount; i < (lastcount + 5); i++) {  //.span11.well(style='margin-left: 0; background: #f9fafb;')

                var str = listData[i].name;

                returnStr += "<div class='span11 well perPageCls' id=" + "perPage" + i + " style='margin-left: 0; background: #f9fafb;'><strong><danger>" + str + "</danger></strong><strong><danger>></danger></strong></div>";
            }
        }
        else {

            lastcount = (totalPage - 1) * 5;
            for (var i = lastcount; i < listData.length; i++) {
                returnStr += "<div class='span11 well perPageCls' id=" + "perPage" + i + " style='margin-left: 0; background: #f9fafb;'><strong><danger>" + listData[i].name + "</danger></strong><strong><danger>></danger></strong></div>";
            }
        }
       
        $("#listpagenation li").removeClass("active");

        $("#listpagenation li").eq(1).addClass("active");
        $("#listPages").html(returnStr);
    });
    $("#last").click(function () {



        var currentPage = $(this).attr("id");



        var lastcount = 5 * currentPage;

        var countperpage = 5;
        var returnStr = "";
        var rem = 0;
        if (listData.length % countperpage != 0)
            rem++;
        var pagecount = parseInt(listData.length / countperpage) + rem;
        var totalPage = pagecount;


        lastcount = (totalPage - 1) * 5;

        for (var i = lastcount; i < listData.length; i++) {
            returnStr += "<div class='span11 well perPageCls' id=" + "perPage" + i + " style='margin-left: 0; background: #f9fafb;'><strong><danger>" + listData[i].name + "</danger></strong><strong><danger>></danger></strong></div>";
        }

        $("#listPages").html(returnStr);


        $("#listpagenation li").removeClass("active");

        $("#listpagenation li").eq(totalPage).addClass("active");


    });
    $(".itemPage").click(function () {


        var currentPage = $(this).attr("id");

        var lastcount = 5 * currentPage;

        var countperpage = 5;
        var returnStr = "";
        var rem = 0;
        if (listData.length % countperpage != 0)
            rem++;
        var pagecount = parseInt(listData.length / countperpage) + rem;
        var totalPage = pagecount;

        if (currentPage != (totalPage - 1)) {
            for (var i = lastcount; i < (lastcount + 5); i++) {  //.span11.well(style='margin-left: 0; background: #f9fafb;')

                var str = listData[i].name;

                returnStr += "<div class='span11 well perPageCls' id=" + "perPage" + i + " style='margin-left: 0; background: #f9fafb;'><strong><danger>" + str + "</danger></strong><strong><danger>></danger></strong></div>";
            }
        }
        else {

            lastcount = (totalPage - 1) * 5;
            for (var i = lastcount; i < listData.length; i++) {
                returnStr += "<div class='span11 well perPageCls' id=" + "perPage" + i + " style='margin-left: 0; background: #f9fafb;'><strong><danger>" + listData[i].name + "</danger></strong><strong><danger>></danger></strong></div>";
            }
        }


        $("#listpagenation li").removeClass("active");
        $(this).parent().addClass("active");


        $("#listPages").html(returnStr);
    });

    $(".perPageCls").click(function () {


        //  alert($(this).attr("id"));

    });

});