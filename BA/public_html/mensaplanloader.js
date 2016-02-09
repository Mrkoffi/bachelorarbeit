/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function () {
    var weekday = new Array(7);
    weekday[0] = "Sonntag";
    weekday[1] = "Montag";
    weekday[2] = "Dienstag";
    weekday[3] = "Mittwoch";
    weekday[4] = "Donnerstag";
    weekday[5] = "Freitag";
    weekday[6] = "Samstag";
    var resMensaC = [];
    var resMensaN = [];
//    var currentweek = [];
//    var nextweek = [];
    var kw = [];
    var url = "http://www.studentenwerk-wuerzburg.de/essen-trinken/speiseplaene/plan/show/mensa-am-hubland-wuerzburg.html";
    $.ajax({
        url: url,
        type: 'GET',
        success: function (res) {
            //alert("überhaupt");
            var headline = $(res.responseText);
            //alert(headline);

            var kwselectors = headline.find('aside.mensaselectors').each(function () {
                //alert("reponse "+$(this).text());
                var kws = $(this).find('section.kw').children(".week").each(function () {
                    //  alert("hier :" + $(this).text());
                    kw.push($(this).text());
                });
//                var cweeks = $(this).find('div.currentweek').children("article").each(function () {
//                    //alert("hier :"+$(this).text());
//                    currentweek.push($(this).text());
//                });
//                var nweeks = $(this).find('div.nextweek').children("article").each(function () {
//                    //alert("hier :"+$(this).text());
//                    nextweek.push($(this).text());
//                });
            });

            var menuselectors = headline.find('section.mensamenu').each(function () {

                var cwm = $(this).find('div.currentweek').children("div.day").each(function () {
                    var day = $(this).find('h5').text();
                    var price = "";
                    var title = "";
                    var menu = [];

                    var speisen = $(this).find('article.menu').each(function () {
                        title = $(this).find('div.title').text();
                        //alert(title);
                        price = $(this).find('div.price').text();
                        // alert(price);
                        var stoffe = [];
                        var zstoffe = $(this).find('div.toggler > ul').children("li").each(function () {
                            //alert($(this).text());
                            stoffe.push($(this).text());
                        });
                        //alert("hmm"+stoffe.length);
                        var m = new MensaPlan(title, price, stoffe);
                        menu.push(m);
                    });

                    var mensaday = new MensaDay(day, menu);
                    resMensaC.push(mensaday);
                });

                var nwm = $(this).find('div.nextweek').children("div.day").each(function () {
                    var day = $(this).find('h5').text();
                    var price = "";
                    var title = "";
                    var menu = [];
                    //alert(day);

                    var speisen = $(this).find('article.menu').each(function () {
                        title = $(this).find('div.title').text();
                        price = $(this).find('div.price').text();
                        var stoffe = [];
                        var zstoffe = $(this).find('div.toggler > ul').children("li").each(function () {
                            stoffe.push($(this).text());
                        });
                        var m = new MensaPlan(title, price, stoffe);
                        menu.push(m);
                    });

                    var mensaday = new MensaDay(day, menu);
                    resMensaN.push(mensaday);
                });
            });
            //alert(resMensaC.length+" "+resMensaN.length);
            getTodaysMenu();
            fillKalendar();
            var nowc = $("#mensaNow");
            var nown = $("#mensaNext");
            fillMensaList(resMensaC, nowc, "now");
            fillMensaList(resMensaN, nown, "next");
        }
    });

    function fillKalendar() {
        $('#currentw').empty();
        //alert(kw.length);
        $('#currentw').text(kw[0].replace('kw', 'Kalendarwoche '));
        $('#nextw').empty();
        $('#nextw').text(kw[1].replace('kw', 'Kalendarwoche '));
        event.preventDefault();
    }

    function addRowToContainer(row, container) {
        container.append(row);
    }
    function addNewRow(index, container, dif) {
        container.append('<div class="row" id="cRow' + dif + index + '"></div>');
    }

    function fillMensaList(resMenu, container, dif) {
        var rowcounter = 3;
        var simplecounter = -1;
        var newsContainer = container;
        addNewRow(simplecounter, newsContainer, dif);
        var roww = $('#cRow' + dif + simplecounter);

        for (var i = 0; i < resMenu.length; i++) {
            //alert(i);
            var title = resMenu[i].day;
            var sp = resMenu[i].speisen;
            var desc = '';
            var price = '';
            var stofs = [];
            var toAppend = '';
            var spdiv = '';
            for (var y = 0; y < sp.length; y++) {
                var stofli = '';
                desc = sp[y].title;
                price = sp[y].preis;
                stofs = sp[y].zustoffe;
                //alert(stofs.length);
                spdiv += '<div class="container">' + desc +
                        '<br><div class="btn-group"><button class="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        'Zusatzstoffe / Allergene<span class="caret"></span></button><ul class="dropdown-menu">';
                for (var x = 0; x < stofs.length; x++) {
                    //alert(stofs[x]);
                    stofli += '<li>' + stofs[x] + '</li>';
                }
                spdiv += stofli + '</ul></div>    <span class="badge">' + price + '</span>' + '</div>';
            }
            toAppend += '<div class="col-md-4 col-lg-4"><div class="jumbotron" id="jumb"><h3 class="text-center">' +
                    title + '</h3>' + spdiv + '</div></div>';

            $(roww).append(toAppend);
            //alert(row);
            if (i === (rowcounter - 1)) {
                //newsContainer.append(row);
                addRowToContainer(roww, newsContainer);
                rowcounter += 3;
                simplecounter++;
                addNewRow(simplecounter, newsContainer, dif);
                roww = $('#cRow' + dif + simplecounter);
            }
        }
    }
    function getThisDay() {
        var currentTime = new Date();
        var month = currentTime.getUTCMonth() + 1;
        var day = currentTime.getUTCDate();

        return  weekday[day] + (day > 9 ? day : ' 0' + day) + (month > 9 ? '.' + month : '.0' + month);
    }
    function getTodaysMenu() {
        var todaymenu='';
        for (var i = 0; i < resMensaC.length; i++) {
            var today = getThisDay();
            var title = resMensaC[i].day;
            if (title.indexOf(today) >= 0) {
                todaymenu = resMensaC[i];
                var title = todaymenu.day;
                var sp = resMensaC[i].speisen;
                var desc = '';
                var price = '';
                var stofs = [];
                var toAppend = '';
                var spdiv = '';
                for (var y = 0; y < sp.length; y++) {
                    var stofli = '';
                    desc = sp[y].title;
                    price = sp[y].preis;
                    stofs = sp[y].zustoffe;
                    //alert(stofs.length);
                    spdiv += '<div class="container">' + desc +
                            '<br><div class="btn-group"><button class="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                            'Zusatzstoffe / Allergene<span class="caret"></span></button><ul class="dropdown-menu">';
                    for (var x = 0; x < stofs.length; x++) {
                        stofli += '<li>' + stofs[x] + '</li>';
                    }
                    spdiv += stofli + '</ul></div>    <span class="badge">' + price + '</span>' + '</div>';
                }
                toAppend += '<h3 class="text-center">' +
                        title + '</h3>' + spdiv;

                $('#jumb1').append(toAppend);
            } else {
                //alert(" is a philosopher.is NOT a philosopher.");
            }
        }
    }
});