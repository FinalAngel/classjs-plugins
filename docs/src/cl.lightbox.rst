===========
Cl.Lightbox
===========

This is a list of all relevant options, methods, events and callbacks.


Options
-------

Options are set on initializing the lightbox::

    new Cl.Lightbox({
        'group': false,
        'responsive': false
    });

==============     ========     ===========
Option             Default      Description
==============     ========     ===========
prefix             'cl'         the prefix is attached to all internal events and css classes for example cl-lightbox or cl-lightbox.
group              true         allows grouping of matching elements and enables status and navigation.
cycle              true         ``requires group`` allows previous and next methods to cycle through matching elements.
modal              true         enables the dimmer functionality.
modalClickable     true         ``requires modal`` allows the dimmer to be closed onclick.
modalClosable      true         ``requires modalClickable`` disables all close events, lightbox can be only closed using the API.
forceLoad          false        if enabled, insures that iframes are fully loaded before display.
easing             'linear'     jquery easing effect for all animations.
duration           300          duration until the lightbox is fully expanded.
speed              300          speed for all regular animations.
fixed              true         sets the lightbox always inside the viewport of the user even when scrolling.
responsive         true         enables responsive behaviour of the lightbox.
easing             'linear'     jquery easing effect for all animations.
ajax               false        ajax loads the provided url and tries to inject the html into the lightbox. It does not create an iframe in order to maintain the css style.
controls           true         ``requires group`` enables controllable elements when a collection is active.
styles             Object       adds jquery style css object to gallery content element.
easing             Object       object includes ``initialWidth``, ``initialHeight``, ``bound`` for outer bound, ``offset`` for content padding, ``width`` and ``height``.
keys               true         enables control for the lightbox using the keyboard.
keyCodes           Object       ``requires keys`` enables key control for ``close``, ``next`` and ``previous``.
lang               Object       the available language configurations.
==============     ========     ===========


Option ``lang`` strings:

============     ============
Option           Default
============     ============
close            'Close lightbox'
errorMessage     '<p><strong>The requested element...</p>'
next             'Next'
previous         'Previous'
status           'Slide {current} of {total}.'
============     ============


Methods
-------

Methods can be called using an instance of the class::

    var lightbox = new Cl.Lightbox();
        // trigger the instanace
        lightbox.open();

All Methods have appropriate events and callbacks.

.. js:function:: instance.open(url)

    :description: opens the lightbox with the provided url or jQuery element.
    :param jquery type: either url or jQuery element.
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


Events and Callbacks
--------------------

**Events** are always triggered **before** the method is excecuted on the ``document`` level.
You can interact with event as follows::

    var lightbox = new Cl.Lightbox();
    // attach event
    $(document).on('cl-lightbox-open', function (e) {
    	console.log('lightbox is opening');
    });

**Callbacks** are always triggered **after** the method is excecuted.
You can interact with callbacks as follows::

    var lightbox = new Cl.Lightbox();
    // register callback
    lightbox.callbacks.close = function () {
        console.log('lightbox is closing');
    };

*Available keywords*:

.. js:attribute:: open
    is called when triggering method ``open``.

.. js:attribute:: close
    is called when triggering method ``close``.

.. js:attribute:: resize
    is called when triggering method ``resize``.

.. js:attribute:: destroy
    is called when triggering method ``destroy``.

.. js:attribute:: next
    is called when triggering method ``next``.

.. js:attribute:: previous
    is called when triggering method ``previous``.

*Private keywords*:

.. js:attribute:: load
    is called when triggering private method ``load``.

.. js:attribute:: complete
    is called when triggering private method ``complete``.

.. js:attribute:: unload
    is called when triggering private method ``unload``.