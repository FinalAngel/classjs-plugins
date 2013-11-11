============
Cl.Accordion
============

1.1.5
-----
- removed chrome window.load fix

1.1.4
-----
- added ability to set initial open element using URL hash fragment
- fixed issue #39: actually assign correct index
- fixed an issue with ``disableAnchors``

1.1.3
-----
- removed ``_fire`` event calls

1.1.2
-----
- added window.load so contents height can be correctly loaded
- added option ``autoHeight`` with the default ``false``
- fixed an issue where show doesn't trigger an event or callback

1.1.1
-----
- added ``options.lang``
- added ``option.cls.text``
- added language display if element is shown or hidden
- added ``options.disableAnchor``
- added more WAI-ARIA labels
- changed event triggers to be combined in ``_fire``
- changed from jQuery 1.4+ to 1.7+ using ``on`` instead of ``bind``
- refactored internal expanded/collapsed handling

1.1.0
-----
- added events and callbacks
- added WAI-ARIA labels
- changed ``options.transition`` to ``options.easing``
- changed ``options.active`` to ``options.index``
- changed method ``trigger`` to ``toggle``
- changed methods ``_show`` and ``_hide`` into ``show`` and ``hide``
- changed all ``bind``methods to ``on``
- removed not required option ``timeout``
- removed option ``fx``
- fixed an issue where slideUp / slideDown jumps
- fixed an issue when using ``options.index`` and ``options.expanded``
- fixed an issue with expanding and collapsable class additions

1.0.1
-----
- changed code setup to be aligned with other classjs-plugins

1.0.0
-----
- initial release