/*!
 * @author      Angelo Dini - github.com/finalangel/classjs-plugins
 * @copyright   Distributed under the BSD License.
 * @version     1.0.beta1
 */

// insure namespace is defined
var Cl = window.Cl || {};

(function($){

    // creating class
    Cl.Touch = new Class({

        options: {},

        initialize: function (elements, options) {
            this.elements = $(elements);
            this.options = $.extend(true, {}, this.options, options);

            this._setup();
        }

    });

})(jQuery);