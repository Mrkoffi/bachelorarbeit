/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function () {

//$(".mThumbnailScrollers").mThumbnailScroller({
//              axis:"y" //change to "y" for vertical scroller
//            });

    var resNews = [];
    var prefix = 'http://www.welearn.de/';

    function addRowToContainer(row, container) {
        container.append(row);
    }
    function addNewRow(index, container) {
        container.append('<div class="row mThumbnailScrollers" id="cRow' + index + '"></div>');
    }

    function fillList(resNew) {
        var rowcounter = 3;
        var simplecounter = -1;

        var newsContainer = $("#nContainer");
//var row='<div class="row" id="cRow"></div>';
// newsContainer.append(row);

        addNewRow(simplecounter, newsContainer);
        var roww = $('#cRow' + simplecounter);
        for (var i = 0; i < resNews.length; i++) {
            //alert(i);
            var title = resNew[i].title;
            var date = resNew[i].date;
            var desc = resNew[i].desc;
            var link = resNew[i].link;
            var image = resNew[i].image;

            var myDiv = '<div class="col-md-4 portfolio-item" id="divN' + i + '"><a href="' + link + '">' +
                    '<img class="img-responsive" src="' + image + '" id="imageN' + i + '" alt="">' +
                    '</a><h3><a href="' + link + '">' + title + '</a></h3><h5><a href="' + link + '">' + date + '</a></h5>' +
                    ' <p>' + desc + '</p></div>';

            $(roww).append(myDiv);
            //alert(row);
            if (i === (rowcounter - 1)) {
                //newsContainer.append(row);
                addRowToContainer(roww, newsContainer);
                rowcounter += 3;
                simplecounter++;
                addNewRow(simplecounter, newsContainer);
                roww = $('#cRow' + simplecounter);
            }
        }
    }

    $.ajax({
        url: 'http://www.welearn.de/aktuelles/news.html',
        type: 'GET',
        success: function (res) {
            var headline = $(res.responseText).find('li.fiwnews').text();
            //alert(headline);
            $(res.responseText).find('li.fiwnews').each(function (item) {
                //alert("hat geklappt für li");

                var newsText = $(this).find("div.news_block").text();  //.each(function(index,a){
                //alert(newsText);

                var imgtexts = $(this).find("div.fiwnews_img");  //.each(function(index,a){

                var newsimgs = $(imgtexts).find('img').attr('src');
                //alert(prefix+newsimgs);

                var newslink = $(imgtexts).find('a').attr('href');
                //alert(prefix+newslink);
                //});

                var newsDate = $(this).find("span").text();
                //alert(newsDate);

                var newsTitle = $(this).find("strong").text();
                // alert(newsTitle);

                var myNews = new News(newsTitle, newsDate, newsText, prefix + newsimgs, prefix + newslink);
                resNews.push(myNews);
                //alert("Current Length :"+resNews.length);
            });
           
             fillList(resNews);
             fillRecentNews(resNews[resNews.length - 1]);
        }
    });

    function fillRecentNews(news) {
        var title = news.title;
        var date = news.date;
        var desc = news.desc;
        var link = news.link;
        var image = news.image;
        
        var myDiv = '<a href="' + link + '">' +
                '<img class="img-responsive" src="' + image + '"  alt="">' +
                '</a><h3><a href="' + link + '">' + title + '</a></h3><h5><a href="' + link + '">' + date + '</a></h5>' +
                ' <p>' + desc + '</p>';

        $('#jumb2').append(myDiv);
    }

});
