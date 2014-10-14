======================
Class.js Documentation
======================

A full documentation can be found on read the docs - classjs-plugins.rtfd.org

To extend and run the documentation, you will have to manually install `Sphinx <http://sphinx-doc.org/>`_.
The automated setup takes care of the rest:

#. navigate to docs ``cd docs``
#. run ``make init`` to install additional requirements
#. run ``make run`` to let the server run
#. run ``make run PORT=8001`` to let the server run on a separate port

When opening localhost:8000 the screen might appear blank. This is due to the fact that the docs/_build folder is
not yet created. Simply change something within an *.rst file and refresh the page. Livereload will than take care
of the rest to auto refresh your page on change.
