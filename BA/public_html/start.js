/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    //$('#fancyClock').tzineClock();
    var weekday = new Array(7);
    weekday[0] = "Sonntag";
    weekday[1] = "Montag";
    weekday[2] = "Dienstag";
    weekday[3] = "Mittwoch";
    weekday[4] = "Donnerstag";
    weekday[5] = "Freitag";
    weekday[6] = "Samstag";

    var currentTime = new Date();
    var month = currentTime.getUTCMonth() + 1;
    var day = currentTime.getUTCDate();
    heute = weekday[day] + (day > 9 ? day : ' 0' + day) + (month > 9 ? '.' + month : '.0' + month);
    //alert(heute);


    var upComing = [];
    var bus214 = [];
    var bus214ab19 = [];
    fillBus214();
    fillBus214ab19();
    prepareTableRow(bus214, $('#fahr214'));
    prepareTableRow(bus214ab19, $('#fahr214ab'));
    var h = currentTime.getHours();
    var m = currentTime.getMinutes();
    getTheNextCombination(h, m);

    // For the time
    setInterval(function () {
        var currentTime = new Date();
        var h = currentTime.getHours();
        var m = currentTime.getMinutes();
        var s = currentTime.getSeconds();
        var time = (h > 9 ? h : '0' + h) + " : " + (m > 9 ? m : '0' + m) + " : " + (s > 9 ? s : '0' + s);
        $('#time').text(time);
    }, 1000);

    //For checking the bus each 40 minutes
    setInterval(function () {
        var h = currentTime.getHours();
        var m = currentTime.getMinutes();
        getTheNextCombination(h, m);
    }, 2400000);

// For the Busplan

    function fillBus214() {
        bus214.push('07:51;FHWS;Busbahnhof');

        var goby = 51;
        var start = 7;
        var ende = 21;

        while (start <= ende) {

            goby += 20;
            if (goby > 60) {
                goby %= 60;
                start += 1;
            }
            var pref = (start < 10 ? '0' + start : start);
            if ((start === 19) && (goby === 11)) {
                bus214.push(pref + ':' + goby + ';FHWS;Busbahnhof');
                start = 22;
            } else
                bus214.push(pref + ':' + goby + ';FHWS;Busbahnhof');

        }
//
//        for (var y = 0; y < bus214.length; y++) {
//            console.log(bus214[y].toString());
//        }
    }
    function fillBus214ab19() {
        bus214ab19.push('19:14;Universitätszentrum;Busbahnhof');
        bus214ab19.push('19:23;Universitätszentrum;Busbahnhof');
        bus214ab19.push('19:43;Universitätszentrum;Busbahnhof');
        bus214ab19.push('20:16;Universitätszentrum;Busbahnhof');
        bus214ab19.push('20:40;Universitätszentrum;Busbahnhof');
        bus214ab19.push('21:00;Universitätszentrum;Busbahnhof');
        bus214ab19.push('21:40;Universitätszentrum;Busbahnhof');
    }

    function getTheNextCombination(hour, minute) {
        var timeInList = [];

        var index;

        for (var i = 0; i < bus214.length; i++) {
            timeInList = bus214[i].split(';')[0].split(':');
            //alert(timeInList[0]+' '+timeInList[1]);

            if (parseInt(hour) === parseInt(timeInList[0])) {
                if (parseInt(minute) > parseInt(timeInList[1])) {
                    index = i + 1;
                } else
                    index = i;
            } else if (parseInt(hour) > 19 && parseInt(minute) > 11) {
                index = 0;
            } else
                index = -1;
        }
        upComing = [];
        if (index > 0) {
            var toGo = (index + 4 > bus214.length - 1 ? bus214.length - 1 : index + 4);

            for (var i = index; i < toGo; i++) {
                upComing.push(bus214[i]);
            }

        } else if (index === 0) {
            for (var i = index; i < bus214ab19.length; i++) {
                upComing.push(bus214ab19[i]);
            }
        } else {
            for (var i = 0; i < 5; i++) {
                upComing.push(bus214[i]);
            }
        }
        var bod = $('#fahrbody');
        prepareTableRow(upComing, bod);
    }

    function prepareTableRow(arr, bd) {
        var row = '';
        for (var i = 0; i < arr.length; i++) {
            row += '<tr class="' + (i === 0 ? 'danger' : 'success') + '">' +
                    '<td>' + arr[i].split(';')[0] + '</td><td>' + arr[i].split(';')[1] +
                    '</td><td>' + arr[i].split(';')[2] + '</td></tr>';
        }
        bd.append(row);
    }

});
