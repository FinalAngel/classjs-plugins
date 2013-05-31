=============
Cl.Mobilemenu
=============

This is a list of all relevant options, methods, events and callbacks.


Options
-------

Options are set on initializing the mobilemenu::

    new Cl.Mobilemenu({
        // your options
        'index': 0,
        'event': 'mouseenter'
    });

==============     ========     ===========
Option             Default      Description
==============     ========     ===========
easing             'swing'      the jquery easing method for all animations.
duration           300          the jquery duration speed for all animations.
bound              539          the bound used when the mobilemenu should show up.
ratio              70 / 100     the ratio used for how much the menu is taking from the viewport.
offset             object       offsets to left or top of the menu.
cls                object       the available css class getters and setters.
overlay            ''           the generated overlay.
==============     ========     ===========


Option ``cls`` setters and getters:

=========     ==============     ===========
Option        Default            Description
=========     ==============     ===========
menu          '.mainnav'         will be added on the trigger when expanded
inner         '> ul'             will be added on the trigger when collapsed
knob          '.mainnav-knob'    the element which triggers ``toggle``
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