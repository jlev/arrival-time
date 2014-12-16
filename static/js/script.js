String.prototype.condenseSpaces = function() {
    return this.split(' ').join('');
};

function parseFeed(feed, agency) {
    var data = $.parseXML(feed.content);
    var agency_name = $(data).find('Agency').attr('Name').condenseSpaces();

    if (agency !== agency_name) {
        console.log('agency name mismatch');
        console.log(agency);
        console.log(agency_name);
        return false;
    }

    $(data).find('RouteList Route').each(function() {
        var route = $(this);
        var route_name = route.attr('Name');

        var departures = route.find('DepartureTimeList DepartureTime').map(function() {
            return $(this).text();
        }).get();

        if (departures.length === 0) {
            return true; //skip to next route
        }

        var direction = route.find('RouteDirection');
        var outputSel, stopName = null;

        if (direction.length > 0) {
            direction = direction.attr('Code');

            // special case for AC Transit Broadway shuttle
            if (agency === "ACTransit" && (route_name === "BSD" || route_name === "BSN")) {
                agency = "Broadway";
                route_name = "Broadway Shuttle";
            }

            // truncate Muni route numbers
            if (agency == "SF-MUNI") {
                route_name = route_name.split('-')[0];
            }

            stopName = route_name;
            outputSel = '.routes.'+agency+'.'+direction;
            console.log(outputSel);

        } else {
            //special case for BART directions
            if (agency === "BART") {
                direction = BART_DIRECTION_LOOKUP[route_name];
                outputSel = '.routes.'+agency+'.'+direction;
                stopName = route_name;
            } else {
                outputSel = '.routes.'+agency;
                stopName = route_name;
            }
        }
        var disp = $('<li><div class="stopName"></div><div class="departures"></div></li>');
        disp.addClass(route_name.condenseSpaces());

        disp.find('.stopName').text(stopName);
        disp.find('.departures').text(departures.join(', '));

        $(outputSel).append(disp);
    });
}

function getDeparturesForStops(stops, agency) {
    var proxy = "/crossdomain";
    var url = "http://services.my511.org/Transit2.0/GetNextDeparturesByStopCode.aspx";
    var token = "bfdbbd13-e63e-4292-8655-12bf955f6380";

    $(stops).each(function(index, element) {
        $.ajax({
            type: "GET",
            url: proxy,
            data: {
                'url':url+"?token="+token+"&stopcode="+element
            },
            dataType: "jsonp",
            success: function(data) { parseFeed(data, agency);}
        });
    });

    $("#lastUpdated span").text(new Date());
}
