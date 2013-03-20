===========
Cl.Lightbox
===========

1.1.0
-----
- Change "enableKeys" to "keys" and "keys" to "keyCodes"
- Internal API refactor (_triggerAPI to _triggerEvent and triggerCallback)
- Changed image loader to be in default tpl
- Content does not need to inject loader anymore
- Move more variables to initialization (_setup)
- Refactor control handling and added options to disable
- Renamed build to _setup to be mor consistent
- Fixed dimmer jumpint error
- Reset cursor when using modalClickable and modalClosable
- Inverse forceLoad option to disable it using false
- Renamed transition to easing to be aligned with jquery animation
- Added correct use of duration and speed
- The responsive option was ignored
- Remove autoscale option, this can be handeled using css only
- Remove scrolling option, this can be handeled using css only
- Removed link from options.lang.errorMessage
- Added basic accessibility features

1.0.2
-----
- Added feature to grab the title from an element and add it to a description element
- Updated width and height calculations to description element

1.0.1
-----
- Save type into this.type
- IFRAME tag name did not work
- Fixed width and height calculations for images

1.0.0
-----
- Initial release