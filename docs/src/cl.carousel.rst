===========
Cl.Carousel
===========

This is a list of all relevant options, methods, events and callbacks.


Options
-------

Options are set on initializing the carousel::

    new Cl.Carousel({
        // your options
        'index': 0,
        'move': 'single'
    });

==============     ========     ===========
Option             Default      Description
==============     ========     ===========
index              null         shows selected element[index]/group[index] starting form zero.
timeout            null         timeout in ms for autoplay, if ``0`` or ``null`` autoplay is ignored.
autoplay           false        continues timeout even after manual cancellation.
easing             'linear'     the jquery easing method for all animations.
duration           300          the jquery duration speed for all animations.
move               'auto'       either ``single`` to move one element at a time or ``auto`` to move all visible elements.
momentum           true         enables ``next`` and ``previous`` to jump to the end or beginning when reaching their bounds.
cls                object       the available css class getters and setters.
==============     ========     ===========


Option ``cls`` setters and getters:

==========     =====================     ===========
Option         Default                   Description
==========     =====================     ===========
active         'active'                  class will be added to the active item.
disabled       'disabled'                class will be added to the triggers when bound is reached and momentum is false.
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

    var carousel = new Cl.Carousel();
        // trigger the instanace
        carousel.toggle();

All Methods have appropriate events and callbacks.

.. js:function:: carousel.next()

    :description: goes to the next carousel slide.
    :returns: next callback.


.. js:function:: carousel.previous()

    :description: goes to the previous carousel slide.
    :returns: previous callback.


.. js:function:: carousel.move(index)

    :description: moves to a carousel entry.
    :param number index: index of the element to be moved to.
    :returns: move callback.


.. js:function:: carousel.play()

    :description: starts the carousel timeout.
    :returns: play callback.


.. js:function:: carousel.stop()

    :description: stops the carousel timeout.
    :returns: stop callback.


.. js:function:: carousel.destroy()

    :description: removes all states and events.
    :returns: destroy callback.


Events and Callbacks
--------------------

**Events** are always triggered **before** the method is excecuted on the ``document`` level.
You can interact with event as follows::

    var carousel = new Cl.Carousel();
    // attach event
    $(document).on('carousel-next', function (e) {
    	console.log('carousel is moving to the next position');
    });

**Callbacks** are always triggered **after** the method is excecuted.
You can interact with callbacks as follows::

    var carousel = new Cl.Carousel();
    // register callback
    carousel.callbacks.move = function (scope) {
        console.log('caoursel is moving to position ' + scope.index);
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

.. js:data:: destroy
    is called when triggering method ``destroy``.
