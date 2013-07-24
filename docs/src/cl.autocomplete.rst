===============
Cl.Autocomplete
===============

This is a list of all relevant options, methods, events and callbacks.


Options
-------

Options are set on initializing autocomplete::

    new Cl.Autocomplete({
        // your options
        'minLength': 1,
        'fx': 'toggle'
    });

==============     ========     ===========
Option             Default      Description
==============     ========     ===========
url                false        sd
minLength          3            sd
easing             'swing'      the jquery easing method for all animations.
duration           300          the jquery duration speed for all animations.
delay              300          the jquery duration speed for all animations.
fx                 'slide'      the jquery duration speed for all animations.
cls                object       the available css class getters and setters.
lang               object       the available language strings.
==============     ========     ===========


Option ``cls`` setters and getters:

=========     ==============     ===========
Option        Default            Description
=========     ==============     ===========
field          '.mainnav'         will be added on the trigger when expanded
results         '> ul'             will be added on the trigger when collapsed
item          '.mainnav-knob'    the element which triggers ``toggle``
close          '.mainnav-knob'    the element which triggers ``toggle``
submit          '.mainnav-knob'    the element which triggers ``toggle``
=========     ==============     ===========


Methods
-------

Methods can be called using an instance of the class::

    var mobilemenu = new Cl.Mobilemenu();
        // trigger the method
        mobilemenu.toggle();

All Methods have appropriate events and callbacks.

.. js:function:: mobilemenu.toggle(index)

    :description: toggles a specified mobilemenu entry.
    :param number index: ``required`` the index of the element to be toggled.
    :returns: toggle callback.


.. js:function:: mobilemenu.show(, [index])

    :description: opens an mobilemenu entry.
    :param number index: optional index of the element to be shown, if empty shows all.
    :returns: open callback.


.. js:function:: mobilemenu.hide(, [index])

    :description: hides an mobilemenu entry.
    :param number index: optional index of the element to be shown, if empty hides all.
    :returns: close callback.


Callbacks
---------

**Callbacks** are always triggered **after** the method is excecuted.
You can interact with callbacks as follows::

    var mobilemenu = new Cl.Mobilemenu();
    // register callback
    mobilemenu.callbacks.toggle = function () {
        console.log('item has toggled');
    };

*Available keywords*:

.. js:data:: toggle
    is called when triggering method ``toggle``.

.. js:data:: open
    is called when triggering method ``open``.

.. js:data:: close
    is called when triggering method ``close``.