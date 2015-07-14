/*
* jquery.clamp.js
* 
* Copyright 2015, ichi5 https://github.com/ichi5/
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
* 
* Original
* https://github.com/josephschmitt/Clamp.js/
*/
(function($) {
  $.fn.clamp = function(options) {

    var settings = $.extend({
      clamp:          2,
      splitOnChars:   ['.', '-', '–', '—', ' '],
      animate:        false,
      truncationChar: '…',
      truncationHTML: '',
      alwaysDisplay:  false
    }, options);

    return this.each(function(){
      var $this = $(this);
      var originalText = $(this).text();
      var clampValue = settings.clamp;
      var truncationHTMLContainer;
      var splitOnChars = settings.splitOnChars.slice(0);
      var splitChar = splitOnChars[0];
      var chunks;
      var lastChunk;

      if (settings.truncationHTML) {
        truncationHTMLContainer = document.createElement('span');
        truncationHTMLContainer.innerHTML = settings.truncationHTML;
      }

      function startClamp() {
        var clampedText;
        var height = getMaxHeight(clampValue);
        if (height < $this.height()) {
          clampedText = truncate($this, height);
        }
        else {
          $this.html($this.html().replace(settings.truncationChar, ''));
          if (settings.alwaysDisplay) {
            var truncation = (truncationHTMLContainer) ? truncationHTMLContainer.innerHTML + settings.truncationChar : settings.truncationChar;
            $this.html($this.html() + ' ' + truncation);
          }
        }
      }

      /**
       * Return the current style for an element.
       * @param {HTMLElement} elem The element to compute.
       * @param {string} prop The style property.
       * @returns {number}
       */
      function computeStyle(elem, prop) {
        if (!getComputedStyle) {
          getComputedStyle = function(el, pseudo) {
            this.el = el;
            this.getPropertyValue = function(prop) {
              var re = /(\-([a-z]){1})/g;
              if (prop == 'float') prop = 'styleFloat';
              if (re.test(prop)) {
                prop = prop.replace(re, function () {
                  return arguments[2].toUpperCase();
                });
              }
              return el.currentStyle && el.currentStyle[prop] ? el.currentStyle[prop] : null;
            }
            return this;
          }
        }

        return getComputedStyle(elem, null).getPropertyValue(prop);
      }

      /**
       * Returns the maximum height a given element should have based on the line-
       * height of the text and the given clamp value.
       */
      function getMaxHeight(clmp) {
        var lineHeight = getLineHeight();
        return lineHeight * clmp;
      }

      /**
       * Returns the line-height of an element as an integer.
       */
      function getLineHeight() {
        var lh = computeStyle($this[0], 'line-height');
        if (lh == 'normal') {
          // Normal line heights vary from browser to browser. The spec recommends
          // a value between 1.0 and 1.2 of the font size. Using 1.1 to split the diff.
          lh = parseInt(computeStyle($this[0], 'font-size')) * 1.2;
        }
        return parseInt(lh);
      }

      /**
       * Removes one character at a time from the text until its width or
       * height is beneath the passed-in max param.
       */
      function truncate($target, maxHeight) {
        if (!maxHeight) {return;}
        
        /**
         * Resets global variables.
         */
        function reset() {
          splitOnChars = settings.splitOnChars.slice(0);
          splitChar = splitOnChars[0];
          chunks = null;
          lastChunk = null;
        }
        
        var nodeValue = $target.html().replace(settings.truncationChar, '');
        
        //Grab the next chunks
        if (!chunks) {
          //If there are more characters to try, grab the next one
          if (splitOnChars.length > 0) {
            splitChar = splitOnChars.shift();
          }
          //No characters to chunk by. Go character-by-character
          else {
            splitChar = '';
          }
          
          chunks = nodeValue.split(splitChar);
        }
        
        //If there are chunks left to remove, remove the last one and see if
        // the nodeValue fits.
        if (chunks.length > 1) {
          // console.log('chunks', chunks);
          lastChunk = chunks.pop();
          // console.log('lastChunk', lastChunk);
          applyEllipsis($target, chunks.join(splitChar));
        }
        //No more chunks can be removed using this character
        else {
          chunks = null;
        }
        
        //Insert the custom HTML before the truncation character
        if (truncationHTMLContainer) {
          $target.html($target.html().replace(settings.truncationChar, ''));
          $this.html($target.html() + ' ' + truncationHTMLContainer.innerHTML + settings.truncationChar);
        }

        //Search produced valid chunks
        if (chunks) {
          //It fits
          if ($this.height() <= maxHeight) {
            //There's still more characters to try splitting on, not quite done yet
            if (splitOnChars.length >= 0 && splitChar != '') {
              applyEllipsis($target, chunks.join(splitChar) + splitChar + lastChunk);
              chunks = null;
            }
            //Finished!
            else {
              return $this.html();
            }
          }
        }
        //No valid chunks produced
        else {
          //No valid chunks even when splitting by letter, time to move
          //on to the next node
          if (splitChar == '') {
            applyEllipsis($target, '');
            reset();
          }
        }
        
        //If you get here it means still too big, let's keep truncating
        if (settings.animate) {
          setTimeout(function() {
            truncate($target, maxHeight);
          }, settings.animate === true ? 10 : settings.animate);
        }
        else {
          return truncate($target, maxHeight);
        }
      }
      
      function applyEllipsis($elem, str) {
        $elem.html(str + settings.truncationChar);
      }

      startClamp();

    });
  };
})(jQuery);
