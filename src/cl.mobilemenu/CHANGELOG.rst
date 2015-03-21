=============
Cl.MobileMenu
=============

1.1.7
-----
- moved overlay initialization from ``toggle`` to ``show``

1.1.6
-----
- added option ``heightCalc``
- added option ``overlayContainer``
- removed bindings to html in favor of the body
- removed not required css bindings on body

1.1.5
-----
- added fixedRatio option

1.1.4
-----
- added resize calculations

1.1.3
-----
- rename ``MobileMenu`` to ``Mobilemenu``
- removed ``_fire`` event calls
- fixes an issue with show being triggered outside of bound
- fixes issues with height calculation

1.1.2
-----
- added option ``inner`` for cls which is used for the height calculation
- fixed an issue where _fire triggered wrong event

1.1.1
-----
- changed all ``bind`` events to ``on``
- fixed an issue with the height calculation
- fixed an issue with the ``_fire`` method

1.1.0
-----
- added WAI-ARIA flags
- added ``options.ratio``
- added ``options.offset``
- added ``options.easing``
- added ``options.cls``
- added ``options.overlay``
- changed option ``speed`` to ``duration``
- changed methods ``open`` and ``close`` to ``show`` and ``hide``
- changed private method ``_events`` to ``_setup``
- refactored internal structure
- fixed an issue where content is resized

1.0.1
-----
- fixed an issue with the menu visibility
- added cl namespace to mobilemenu

1.0.0
-----
- initial release
