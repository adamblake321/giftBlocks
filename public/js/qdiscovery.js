$(document).ready(function () {


    $("button.btn.btn-discovery.btn-lg").click(function () {

        var asin = $(this).attr("asin");
        location.href = "shopping-cart?asin=" + asin;
    });


});