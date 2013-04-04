==========
Cl.Gallery
==========

This is a list of all relevant options, methods, events and callbacks.


Options
-------

Options are set on initializing the gallery::

    new Cl.Gallery({
        // your options
        'index': 0,
        'engine': 'slide'
    });

==============     ========     ===========
Option             Default      Description
==============     ========     ===========
index              null         shows selected element[index]/group[index] starting form zero.
timeout            5000         timeout in ms for autoplay, if ``0`` or ``null`` autoplay is ignored.
autoplay           false        continues timeout even after manual cancellation.
easing             'linear'     the jquery easing method for all animations.
duration           300          the jquery duration speed for all animations.
engine             'fade'       this is the engine to be loaded when animating. Build-in are ``fade`` and ``slide``.
cls                object       the available css class getters and setters.
==============     ========     ===========


Option ``cls`` setters and getters:

==========     =====================     ===========
Option         Default                   Description
==========     =====================     ===========
active         'active'                  class will be added to the active item.
wrapper        '.wrapper'                the outer relative positioned wrapper where the height will be added.
viewport       '.viewport'               the inner absolute positioned wrapper that will be moved.
elements       '.item'                   the element / individual items.
next           '.trigger-next a'         element which triggers the method ``next``.
previous       '.trigger-previous a'     element which triggers the method ``previous``.
navigation     '.nav a'                  navigation elements which trigger the method ``move`` whith their corresponding index.
==========     =====================     ===========


Methods
-------

Methods can be called using an instance of the class::

    var gallery = new Cl.Gallery();
        // trigger the instanace
        gallery.toggle();

All Methods have appropriate events and callbacks.

.. js:function:: gallery.next()

    :description: goes to the next gallery slide.
    :returns: next callback.


.. js:function:: gallery.previous()

    :description: goes to the previous gallery slide.
    :returns: previous callback.


.. js:function:: gallery.move(index)

    :description: moves to a gallery entry.
    :param number index: index of the element to be moved to.
    :returns: move callback.


.. js:function:: gallery.play()

    :description: starts the gallery timeout.
    :returns: play callback.


.. js:function:: gallery.stop()

    :description: stops the gallery timeout.
    :returns: stop callback.


.. js:function:: gallery.update()

    :description: updates gallery to current index.
    :returns: update callback.


Events and Callbacks
--------------------

**Events** are always triggered **before** the method is excecuted on the ``document`` level.
You can interact with event as follows::

    var gallery = new Cl.Gallery();
    // attach event
    $(document).on('gallery-next', function (e) {
    	console.log('gallery is moving to the next element');
    });

**Callbacks** are always triggered **after** the method is excecuted.
You can interact with callbacks as follows::

    var gallery = new Cl.Gallery();
    // register callback
    gallery.callbacks.move = function (scope) {
        console.log('galery is moving to element ' + scope.index);
    };

*Available keywords*:

.. js:data:: next
    is called when triggering method ``next``.

.. js:data:: previous
    is called when triggering method ``previous``.

.. js:data:: move
    is called when triggering method ``move``.

.. js:data:: play
    is called when triggering method ``play``.

.. js:data:: stop
    is called when triggering method ``stop``.

.. js:data:: update
    is called when triggering method ``update``.
