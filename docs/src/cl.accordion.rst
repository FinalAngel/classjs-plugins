============
Cl.Accordion
============

This is a list of all relevant options, methods, events and callbacks.


Options
-------

Options are set on initializing the accordion::

    new Cl.Accordion({
        // your options
        'index': 0,
        'event': 'mouseenter'
    });

==============     ========     ===========
Option             Default      Description
==============     ========     ===========
index              0            shows selected element[index] starting form zero.
expanded           false        initial visibility of all items inside the selector.
event              'click'      the jquery element of which the accordion will listen to.
easing             'linear'     the jquery easing method for all animations.
duration           300          the jquery duration speed for all animations.
grouping           true         enables all elements to be grouped together, only one will be visible at any given time.
forceClose         false        if enabled, allows open element to be closed again.
disableAnchors     false        disables descending anchors from triggering. For example if the trigger is an ``li`` wrapping an anchor.
cls                object       the available css class getters and setters.
lang               object       the available language configurations.
==============     ========     ===========


Option ``cls`` setters and getters:

=========     ============     ===========
Option        Default          Description
=========     ============     ===========
expanded      'expanded'       will be added on the trigger when expanded
collapsed     'collapsed'      will be added on the trigger when collapsed
trigger       '.trigger'       the element which triggers ``toggle``
container     '.container'     the container to be expanded and collapsed
=========     ============     ===========


Option ``lang`` strings:

=========     ============
Option        Default
=========     ============
expanded      'Expanded '
collapsed     'Collapsed '
=========     ============


Methods
-------

Methods can be called using an instance of the Class::

    var accordion = new Cl.Accordion();
        // trigger the instanace
        accordion.toggle();

All Methods have appropriate events and callbacks.

.. js:function:: accordion.toggle(index)

    :description: toggles a specified accordion entry.
    :param number index: ``required`` the index of the element to be toggled.
    :returns: toggle callback.


.. js:function:: accordion.show(, [index])

    :description: opens an accordion entry.
    :param number index: optional index of the element to be shown, if empty shows all.
    :returns: open callback.


.. js:function:: accordion.hide(, [index])

    :description: hides an accordion entry.
    :param number index: optional index of the element to be shown, if empty hides all.
    :returns: close callback.


Events and Callbacks
--------------------

**Events** are always triggered **before** the method is excecuted on the ``document`` level.
You can interact with event as follows::

    var accordion = new Cl.Accordion();
    // attach event
    $(document).on('accordion-toggle', function (e) {
    	console.log('item is toggling');
    });

**Callbacks** are always triggered **after** the method is excecuted.
You can interact with callbacks as follows::

    var accordion = new Cl.Accordion();
    // register callback
    accordion.callbacks.toggle = function () {
        console.log('item has toggled');
    };

*Available keywords*:

.. js:data:: toggle
    is called when triggering method ``toggle``.

.. js:data:: open
    is called when triggering method ``open``.

.. js:data:: close
    is called when triggering method ``close``.