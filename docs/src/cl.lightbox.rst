***********
cl.lightbox
***********

The following methods can be attached to a new class.


API Reference
=============

This is a list of all relevant options, methods, events and callbacks.


Options
-------

Options are set on initializing the lightbox::

    new Cl.Lightbox({
        'group': false,
        'responsive': false
    });

.. js:data:: prefix: 'cl'
    the prefix is attached to :js:data: all internal events and css classes for example cl-lightbox or cl-lightbox.

.. js:data:: group: true
    allows grouping of matching elements and enables status and navigation.

.. js:data:: cycle: true
    ``requires group`` allows previous and next methods to cycle through matching elements.

.. js:data:: modal: true
    enables the dimmer functionality.

.. js:data:: modalClickable: true
    ``requires modal`` allows the dimmer to be closed onclick.

.. js:data:: modalClosable: true
    ``requires modal`` disables alls close events, lightbox can be only closed using the API.

.. js:data:: modalClosable: true
    ``requires modal`` disables alls close events, lightbox can be only closed using the API.

.. js:data:: forceLoad: true
    shows preloader until content is fully loaded (specifically when loading iframes).

.. js:data:: transition: 'linear'
    jquery transition effect for all animations.

.. js:data:: duration: 500
    jquery duration time for all animations.

.. js:data:: speed: 300
    defines the speed of which the content is shown besides the regular animations.

.. js:data:: fixed: true
    sets position to fixed or uses absolute positioning with automated top calculations.

.. js:data:: responsive: true
    enables responsive behaviour of the lightbox.

.. js:data:: autoScale: true
    sets the width and height to 100% for the inner html so images can be scaled.

.. js:data:: scrolling: false
    enables the inner html to be scrollable, this might be set to true if using inline html.

.. js:data:: ajax: false
    forces ajax loading??????????????.

.. js:data:: controls: true
    enables controllable elements.

.. js:data:: styles: {}
    adds jquery style css object to gallery content element.

.. js:data:: dimensions: {}
    object includes ``initialWidth``, ``initialHeight``, ``bound`` for outer bound, ``offset`` for content padding, ``width`` and ``height``.

.. js:data:: keys: true
    enables control for the lightbox using the keyboard.

.. js:data:: keyCodes: {}
    ``requires keys`` enables key control for ``close``, ``next`` and ``previous``.

.. js:data:: lang: {}
    translatable strings used inside the lightbox.


Methods
-------

Methods can be called using the instance of the Class::

    var lightbox = new Lightbox();

    lightbox.open($('.lightbox'));

All Methods have appropriate events and callbacks.

.. js:function:: instance.open(elements)

    :description: opens the lightbox with the provided set of elements.
    :param jquery elements: a set of elements to be opened.
    :returns: open callback


.. js:function:: instance.close()

    :description: closes the lightbox.
    :returns: close callback


.. js:function:: instance.resize(width, height)

    :description: resizes the lightbox to the specified dimensions.
    :param number width: the width the lightbox should be resized to.
    :param number height: the height the lightbox should be resized to.
    :returns: resize callback


.. js:function:: instance.destroy()

    :description: removes the lightbox from the dom.
    :returns: destroy callback


.. js:function:: instance.next()

    :description: movies to the next element.
    :returns: next callback


.. js:function:: instance.previous()

    :description: movies to the previous element.
    :returns: previous callback


.. js:function:: instance.getElement()

    :returns: the current visible element


.. js:function:: instance.getCollection()

    :returns: all current elements in the collection


Events
------

You can also interact with events, for example::

    var lightbox ) bew Cl.Lightbox();

    lightbox.on('cl-open', function (e) {
    	console.log('lightbox is opening');
    });

Events are always triggered **before** the function is excecuted.

.. js:attribute:: open
    is called when opening the lightbox.

.. js:attribute:: close
    is called when closing the lightbox.

.. js:attribute:: resize
    is called when resizing the lightbox.

.. js:attribute:: destroy
    is called when the lightbox gets destroyed.

Additional:

.. js:attribute:: setup
    is called as soon as the instance is being created.

.. js:attribute:: load
    is called when preloading data.

.. js:attribute:: complete
    is called when preloading is completed.

.. js:attribute:: unload
    is called when data is unloaded.


Callbacks
---------

Write your own callbacks using the options, for example::

    var lightbox = new Cl.Lightbox();

    lightbox.callbacks.open = function () {
        console.log('lightbox has opened');
    };

.. js:attribute:: open
    'open': function (self) {}.

.. js:attribute:: close
    'close': function (self) {}.

.. js:attribute:: resize
    'resize': function (self) {}.

.. js:attribute:: destroy
    'destroy': function (self) {}.

.. js:attribute:: next
    'next': function (self) {}.

.. js:attribute:: previous
    'previous': function (self) {}.

Additional:

.. js:attribute:: setup
    'setup': function (self) {}.

.. js:attribute:: load
    'load': function (self) {}.

.. js:attribute:: complete
    'complete': function (self) {}.

.. js:attribute:: unload
    'unload': function (self) {}.


Callbacks are always triggered **after** the function is excecuted.


Demos
=====

.. raw:: html
    :file: demo.html
