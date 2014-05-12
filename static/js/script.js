BART_DIRECTION_LOOKUP = {
    'Daly City': 'South',
    'Dublin Pleasanton': 'South',
    'Fremont': 'North',
    'Millbrae': 'South',
    'North Concord': 'South',
    'Pittsburg Bay Point': 'South',
    'Richmond': 'North',
    'SF Airport then Millbrae': 'South',
    'SF Airport then Pittsburg Bay Point': 'South'
};

String.prototype.condenseSpaces = function() {
    return this.split(' ').join('');
};

function parseFeed(feed, agency) {
    data = $.parseXML(feed.content);
    agency_name = $(data).find('Agency').attr('Name').condenseSpaces();

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

        direction = route.find('RouteDirection');
        if (direction.length > 0) {
            outputSel = '.routes.'+agency+'.'+direction.attr('Code');
            stopName = route_name + " " + direction.attr('Code');
        } else {
            //TODO: special case for BART directions
            direction = BART_DIRECTION_LOOKUP[route_name];
            outputSel = '.routes.'+agency+'.'+direction;
            stopName = route_name;
        }
        var disp = $('<li><div class="stopName"></div><div class="departures"></div></li>');
        disp.addClass(route_name.condenseSpaces());

        disp.find('.stopName').text(stopName);
        disp.find('.departures').text(departures.join(', '));

        $(outputSel).append(disp);
    });
}

function getDeparturesForStops(stops, agency) {
    proxy = "/crossdomain";
    url = "http://services.my511.org/Transit2.0/GetNextDeparturesByStopCode.aspx";
    token = "bfdbbd13-e63e-4292-8655-12bf955f6380";

    div = $(".routes."+agency);
    //clear routes
    div.empty();

    $(stops).each(function(index, element) {
        $.ajax({
            type: "GET",
            url: proxy,
            data: {
                'url':url+"?token="+token+"&stopcode="+element
            },
            dataType: "jsonp",
            success: function(data) { parseFeed(data, agency); }
        });
    });

    $("#lastUpdated span").text(new Date());
}

function updateFeeds() {
    BART_stops = [66]; //19th St. Oakland
    ACTransit_stops = [53335, //Broadway and 17th St 19th St BART Station ~ North
                       50958 //Broadway and 17th St 19th St BART Station ~ South
                    ];

    getDeparturesForStops(BART_stops, "BART");
    getDeparturesForStops(ACTransit_stops, "ACTransit");
}

$(document).ready(function() {
    updateFeeds();
    window.setInterval('updateFeeds()',30*1000);
    console.log('update');
});
