===========
Cl.Lightbox
===========

1.2.0
-----
- added ``options.cls``
- added ``options.opacity``
- changed from bind/unbind events to on/off
- changed from ``_triggerEvent`` tp ``_fire``
- changed internal event handling to one single method ``_fire``
- fixed an issue with type ajax
- fixed height calculations on very large images
- fixed several IE issues
- fixed an issue when opening a collection manually
- fixed an issue when lightbox is to large
- fixed an issue with scrolling availability
- fixed an issue with positioning
- removed ``_fire`` event calls

1.1.0
-----
- added cursor reset when using modalClickable and modalClosable
- added basic accessibility features
- added more variables to initialization (_setup)
- changed open method so urls and jquery elements can be passed
- changed ``options.enableKeys`` into ``options.keys`` and ``options.keys`` into ``options.keyCodes``
- changed internal API for _triggerAPI into _triggerEvent and triggerCallback
- changed control handling and added options to disable
- changed image loader to be inside default tpl
- changed ``build`` method to ``_setup``
- changed ``option.transition`` to ``option.easing`` to be aligned with jquery animation
- changed ``option.forceLoad`` option to disable it using false
- fixed an issue when fast loading elements using the keyboard
- fixed an issue with duration and speed placements
- fixed an issue with the ``option.responsive``
- fixed dimmer jumping error
- removed content loader from content element and placed it outside
- removed youtube autodetect as you can use the embed link directly
- removed ``scrolling`` option, this can be handeled using css only
- removed ``autoscale`` option, this can be handeled using css only
- removed link from ``options.lang.errorMessage``

1.0.2
-----
- added feature to grab the title from an element and add it to a description element
- fixed an issue with the description width and height calculations

1.0.1
-----
- added global variable ``this.type``
- fixed an issue where the IFRAME tag name did not work
- fixed an issue with width and height calculations

1.0.0
-----
- initial release