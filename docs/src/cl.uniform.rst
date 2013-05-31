==========
Cl.Uniform
==========

This is a list of all relevant options, methods, events and callbacks.


Options
-------

Options are set on initializing the carousel::

    new Cl.Uniform();

==============     ========     ===========
Option             Default      Description
==============     ========     ===========
offset             -9999        the offset of the input related to the surrounding container.
cls                object       the available css class getters and setters.
lang               object       the available language configurations.
tpl                object       the html template which will be used to replace the forms.
==============     ========     ===========


Option ``cls`` setters and getters:

==========     ============     ===========
Option         Default          Description
==========     ============     ===========
prefix         'uniform'        will be added before all following classes.
radio          'radio'          will be used as the wrapper for radio elements.
checkbox       'checkbox'       will be used as the wrapper for checkbox elements.
file           'file'           will be used as the wrapper for file elements.
select         'select'         will be used as the wrapper for select elements.
disabled       'disabled'       will be added whenever the attribute ``disabled="disabled"`` is defined.
focus          'focus'          will be added whenever ``focus`` is triggered on the element.
==========     ============     ===========


Option ``lang`` strings:

==========    ============
Option        Default
==========    ============
fileBtn       'Upload'
fileStatus    'Please select a file...'
==========    ============


Option ``tpl`` strings:

==========    ============
Option        Default
==========    ============
radio         dom element (string)
checkbox      dom element (string)
file          dom element (string)
select        dom element (string)
==========    ============


Methods
-------

Methods can be called using an instance of the class::

    var uniform = new Cl.Uniform();
        // trigger the instanace
        uniform.update();

All Methods have appropriate events and callbacks.

.. js:function:: uniform.update()

    :description: checks all form elements and updates their states accordingly.
    :returns: update callback.


.. js:function:: uniform.destroy()

    :description: removes uniform from form elements.
    :returns: destroy callback.


Callbacks
---------

**Callbacks** are always triggered **after** the method is excecuted.
You can interact with callbacks as follows::

    var uniform = new Cl.Uniform();
    // register callback
    uniform.callbacks.update = function (scope) {
        console.log('uniform is excecuting update');
    };

*Available keywords*:

.. js:data:: update
    is called when triggering method ``update``.

.. js:data:: destroy
    is called when triggering method ``destroy``.