========================================
classjs-plugins - class.js based plugins
========================================

https://github.com/finalangel/classjs-plugins

The idea behind this project is to provide a set of plugins which are supported by all major platforms including
Windows, Mac OSX, iOS and Android. Using the latest technologies such as HTML5, CSS3 and progressive enhancement
whenever possible.


Documentation
=============

Go to `http://classjs-plugins.rtfd.org` for a full documentation.

Please use github to report bugs or feature requests. Include a `jsfiddle <http://jsfiddle.net>`_
or equivalent example whenever possible for issues and bugs.

Testet in Chrome, Fierfox 4+, Internet Explorer 7+ and Opera.


How to compile the examples
===========================

* install `jekyll <http://jekyllrb.com/>`_
* navigate to the project folder and run
::

	jekyll --safe

How to run the examples
=======================

* install `virtualenv <http://www.virtualenv.org/>`_
* navigate to the project folder
* create a virtualenv with
::

	virtualenv env --prompt="(classjs-plugins)"
* activate the virtualenv
::

	source env/bin/activate
* install requirements
::

	pip install -r requirements.txt
* run the server
::

	python run.py



License
=======

Distributed under the BSD Licence.

Copyright (c) 2012 Angelo Dini and contributors