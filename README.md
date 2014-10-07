html5-pollmaster
=================

An HTML5/angular.js app built to run as a Cambrian App inside the Cambrian GUI.

The Pollmaster app is an administration interface for Polls.

It offers UI's to create new polls, delete polls, manage poll templates, send
polls, and view poll results.


Usage
----

    $ git clone https://github.com/SocietyPro/html5-pollmaster.git
    $ cd html5-pollmaster
    $ node --version        # should be >= 10.25
    $ git submodule update --init
    $ npm install
      # if using in Society Pro, point the SoPro web browser to this directory's index.html
    $ npm start             # starts serving static http content in this terminal
    $ npm test              # run tests
    $ npm run karma         # start karma monitor and auto run unit tests


Tests
-----

Protractor e2e tests:

    $ cd html5-pollmaster
    $ npm start 
    # that starts an http server. background with &, or use another terminal.
    $ npm test

Karma unit tests:

Note that Karma needs a reference to your browser binary if it's not named
something common. For instance, linux mint/ubuntu use "chromium-browser" instead
of "google-chrome".

To tell Karma where to find the browser:
 
    $ which chromium-browser
    $ export CHROME_BIN=/usr/bin/chromium-browser
    $ #or...
    $ echo "export CHROME_BIN=/usr/bin/chromium-browser" >> ~/.xsession
    $ #or some other appropriate file that is sourced on login

To run the Karma tests:

    $ cd html5-pollmaster
    $ npm run karma
    
