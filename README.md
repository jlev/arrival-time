Arrival Time
============

Display screen for transit arrival times using 511 SFBay API.

Installation
------------

It's already running on Heroku at http://arrival-time.herokuapp.com

Currently configured to show BART and AC Transit arrivals at 19th St, because that's where I work.
Once we have pilot screens deployed, it will be configurable for multiple locations.

Development
-----------
This application requires a small Flask server running to make the cross-domain API calls. It can be run in a virtual environment by using pip to install requirements.txt, and then `python server.py`

Terms of Service
----------------
511 provides this data [AS IS](http://511.org/developer-resources_api-terms_rtt.asp) and makes no warranty as to its accuracy, completeness, reliability, timeliness, or usefulness. Code released under the [GPLv3](https://github.com/jlev/arrival-time/raw/master/LICENSE).
