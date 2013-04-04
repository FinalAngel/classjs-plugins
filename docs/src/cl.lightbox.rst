***********
cl.lightbox
***********


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
    the prefix is attached to all internal events and css classes for example cl-lightbox or cl-lightbox.

.. js:data:: group: true
    allows grouping of matching elements and enables status and navigation.

.. js:data:: cycle: true
    ``requires group`` allows previous and next methods to cycle through matching elements.

.. js:data:: modal: true
    enables the dimmer functionality.

.. js:data:: modalClickable: true
    ``requires modal`` allows the dimmer to be closed onclick.

.. js:data:: modalClosable: true
    ``requires modalClickable`` disables all close events, lightbox can be only closed using the API.

.. js:data:: forceLoad: false
    if enabled, insures that iframes are fully loaded before display.

.. js:data:: easing: 'linear'
    jquery easing effect for all animations.

.. js:data:: duration: 300
    duration until the lightbox is fully expanded.

.. js:data:: speed: 300
    speed for all regular animations.

.. js:data:: fixed: true
    sets the lightbox always inside the viewport of the user even when scrolling.

.. js:data:: responsive: true
    enables responsive behaviour of the lightbox.

.. js:data:: ajax: false
    ajax loads the provided url and tries to inject the html into the lightbox. It does not create an iframe in order to maintain the css style.

.. js:data:: controls: true
    ``requires group``enables controllable elements when a collection is active.

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

Methods can be called using the instance of the class::

    var lightbox = new Cl.Lightbox();

    lightbox.open($('.lightbox'));

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

**Events** are always triggered **before** the function is excecuted and on the document level.

You can also interact with events, for example::

    var lightbox = new Cl.Lightbox();

    $(document).bind('cl-lightbox-open', function (e) {
    	console.log('lightbox is opening');
    });

**Callbacks** are always triggered **after** the function is excecuted.

Write your own callbacks using the options, for example::

    var lightbox = new Cl.Lightbox();

    lightbox.callbacks.open = function () {
        console.log('lightbox has opened');
    };

.. js:attribute:: open
    is called when opening the lightbox.

.. js:attribute:: close
    is called when closing the lightbox.

.. js:attribute:: resize
    is called when resizing the lightbox.

.. js:attribute:: destroy
    is called when the lightbox gets destroyed.

.. js:attribute:: next
    'next': function (self) {}.

.. js:attribute:: previous
    'previous': function (self) {}.

Additional:

.. js:attribute:: load
    is called when preloading data.

.. js:attribute:: complete
    is called when preloading is completed.

.. js:attribute:: unload
    is called when data is unloaded.