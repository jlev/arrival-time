Arrival Time
============

Display screen for transit arrival times using 511 SFBay API.

Installation
------------

This application requires a small Flask server running to make the cross-domain API calls. It can be run in a virtual environment by using pip to install requirements.txt, and then `python server.py`

Example running on Heroku at http://arrival-time.herokuapp.com

New Locations
-------------
Add a new location by copying the location template, and adjusting the initialization script to provide the desired stop ids.

Determine route identifier by using the 511 API calls GetRoutesForAgency, `routeIDF=AgencyName~RouteCode~RouteDirectionCode`. Then use then GetStopsForRoute to find stop ids. See [docs/RTT API V2.0 Reference](docs/RTT API V2.0 Reference.pdf)

Terms of Service
----------------
511 provides this data [AS IS](http://511.org/developer-resources_api-terms_rtt.asp) and makes no warranty as to its accuracy, completeness, reliability, timeliness, or usefulness. Code released under the [GPLv3](https://github.com/jlev/arrival-time/raw/master/LICENSE).
