===========
Cl.Carousel
===========

1.3.2
-----
- removed ``_fire`` event calls

1.3.1
-----
- added missing event and callback triggers for play, stop and destroy
- added WAI-ARIA labels
- added method ``update``
- fixed an issue where ``destroy`` did not remove all types
- fixed an issue using ``options.index``
- changed internal event handling to one single method ``_fire``
- changed from ``bind`` to ``on``
- changed from ``unbind`` to ``off``
- changed index setter from next and previous to move
- changed play and pause handling
- removed swipe implementation in favor of external solutions

1.3.0
-----
- added ``options.easing``
- added ``options.autoplay``
- added method ``destroy``
- added methods ``play`` and ``stop``
- changed elements cls from article to .item
- changed triggerRight to triggers.next and triggerLeft to triggers.previous
- changed ``moveLeft`` to ``previous``
- changed ``moveRight`` to ``next``
- changed ``move`` method to be more simple
- changed interval clear on triggers into their event functions instead of next and previous methods
- fixed an issue when using document.ready
- fixed an issue when using ``options.move: 'auto'``

1.2.2
-----
- fixed an issue where the height got calculated first and than the width

1.2.1
-----
- added additional comments
- changed code setup to be aligned with other classjs-plugins
- fixed an issue where carousel calculated an incorrect width

1.2.0
-----
- added option ``navigation``

1.1.0
-----
- removed redundant option ``autoplay``; the carousel now starts if timeout is greater than 0
- fixed an issue with the carousel incorrectly calculating number of items

1.0.0
-----
- initial release