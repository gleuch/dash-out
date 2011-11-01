/*
  DASH OUT
  Bookmarklet, & browser extensions to white out the over-produced Kardashian reality.

  by Greg Leuch <http://gleuch.com> / @gleuch

  MIT License - http://creativecommons.org/licenses/MIT. Not for commerical use.

  ------------------------------------------------------------------------------------
 
*/

Array.prototype.in_array = function(p_val, sensitive) {for(var i = 0, l = this.length; i < l; i++) {if ((sensitive && this[i] == p_val) || (!sensitive && this[i].toLowerCase() == p_val.toLowerCase())) {return true;}} return false;};
function rgb2hex(rgb) {rgb = rgb.replace(/\s/g, "").replace(/^(rgb\()(\d+),(\d+),(\d+)(\))$/, "$2|$3|$4").split("|"); return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);} 
function hex(x) {var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8","9", "A", "B", "C", "D", "E", "F"); return isNaN(x) ? "00" : hexDigits[(x-x%16)/16] + hexDigits[x%16];}


function dash_out_start($_) {
  $_.fn.reverse = function(){return this.pushStack(this.get().reverse(), arguments);};

  (function($_) {
    $_.dash_out = function(data, c) {
      if (!$_.dash_out.settings.finish) $_.dash_out.init();
      $_(data).dash_out(c);
      if (!$_.dash_out.settings.finish) $_.dash_out.finish(c);
    };

    $_.fn.dash_out = function(c) {
      return this.filter(function() {
        return $_.dash_out.filter(this);
      }).each(function() {
        $_.dash_out.whiteout(this, c);
      });
    };

    $_.extend($_.dash_out, {
      settings : {hide_bg : true, href : false, page_height : 0, search: /((((kim(berly)?(\snoel)?(\s\"kim\")?|kris(topher)?|kourtney|khloe|khloé|rob(ert?))(\s|\-|\_)?)?(kardashian|jenner))|(((kris(topher)?)(\s|\-|\_)?)?(humphries))|((ryan(\s|\-|\_)?)?seacrest)|((dash\store|d\-a\-s\-h(\sstore)?))|(keeping\sup\swith\sthe\skardashians|kardashian\skonfidential|kortney\sand\skhloe\stake\smiami|kourtney\sand\skim\stake\snew\syork))/img, replace: '<ins class="dash_out" style="color: %C; background-color: %C;">$1</ins>', starred: '*** **********', init : false, finish : false},

      pluck : function(str) {return str.replace(/((kim(berly)?|kris(topher)?)\s)?(kardashian|humphries)/img, '*** **********').replace(/(kardashian)/img, '**********').replace(/(dash\sstore)/img, '**** *****');},

      filter : function(self) {
        if (self.nodeType == 1) {
          var tag = self.tagName.toLowerCase();
          return !(self.className.match('dash_out') || tag == 'head' || tag == 'img' || tag == 'textarea' || tag == 'option' || tag == 'style' || tag == 'script' || tag == 'code' || tag == 'samp');
        } else {
          return true;
        }
      },

      whiteout : function(self, c) {
        $_(self).css({'text-shadow' : 'none'});

        if (self.nodeType == 3) {
          if (self.nodeValue.replace(/\s/ig, '').match($_.dash_out.settings.search)) {
            if (!c) c = $_(self).parent() ? $_(self).parent().css('color') : '#FFFFFF';
            var text = self.nodeValue.replace($_.dash_out.settings.search, $_.dash_out.settings.replace.replace(/\%C/mg, c)),
                sp1 = document.createElement("span");
            sp1.className = 'dash_out';
            sp1.innerHTML = text;
            self.parentNode.replaceChild(sp1, self)
          }
        } else if (self.nodeType == 1) {
          if (!c) c = rgb2hex($_(self).css('color'));
          if ($_(self).children().length > 0) {
            $_.dash_out($_(self).contents(), c);
          } else {
            if ($_(self).html().match($_.dash_out.settings.search)) {
              text = $_(self).html().replace($_.dash_out.settings.search, $_.dash_out.settings.replace.replace(/\%C/mg, c) );
              $_(self).html(text);
            }
          }
        }
      },

      init : function() {
        $_.dash_out.settings.init = true;
      },

      finish : function(c) {
        $_(document).each(function() {this.title = $_.dash_out.pluck(this.title);});

        $_('img, input[type=image]').each(function() {
          try {
            if ($_(this).attr('alt').match($_.dash_out.settings.search) || $_(this).attr('title').match($_.dash_out.settings.search) || $_(this).attr('src').match($_.dash_out.settings.search)) {
              var r = $_(this), w = r.width(), h = r.height(), el_c = (c ? c : rgb2hex($_(this).css('color')));
              r.addClass('dash_out').css({background: el_c, width: r.width(), height: r.height()}).attr('src', 'http://assets.gleuch.com/blank.png').width(w).height(h);
            }
          } catch(e) {}
        });

        $_('input[type=text]').each(function() {if ($_(this).val().match($_.dash_out.settings.search) ) $_(this).val( $_.dash_out.pluck($_(this).val()) );});
        $_('textarea, option').each(function() {if ($_(this).html().match($_.dash_out.settings.search) ) $_(this).html( $_.dash_out.pluck($_(this).html()) );});

        var s = document.createElement("style");
        s.innerHTML = ".dash_out, .dash_out:hover {font-size: inherit !important; box-shadow: 0 1px 2px rgba(0,0,0,.12); text-decoration: none !important;"+ ($_.dash_out.settings.hide_bg ? "background-image: none !important;" : "") +"} .bg_dash_out {box-shadow: 0 1px 2px rgba(0,0,0,.12); "+ ($_.dash_out.settings.hide_bg ? "background-image: none !important;" : "") +"}";
        $_('head').append(s);

        $_.dash_out.settings.href = location.href;
        $_.dash_out.settings.page_height = $_('body').height();

        $_.dash_out.settings.finish = true;
      }
    });
  })($_);

  $_.dash_out('body', '#FFFFFF');

  /* Allow AJAX detection */
  setInterval(function() {
    var h = $_('body').height(), ch = $_.dash_out.settings.page_height;

    if (location.href != $_.dash_out.settings.href || Math.abs(ch-h) > 20 ) {
      $_.dash_out.settings.href = location.href;
      $_.dash_out.settings.page_height = h;
      $_.dash_out.settings.init = false;
      $_.dash_out.settings.finish = false;
      $_.dash_out('body', '#FFFFFF');
    }
  }, 1000);
}






/* Let start blocking the #winning */
try {
  if (!jQuery('body').hasClass('tigerblood')) {
    jQuery('body').addClass('tigerblood');
    dash_out_start(jQuery);
  }
} catch(err) {}