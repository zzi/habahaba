/* BEGIN JQUERY TOOLTIP v1.1.2 */
    (function($) { 

        var instances = [];
    
        // static constructs
        $.tools = $.tools || {};
    
        $.tools.tooltip = {
            version: '1.1.2',
        
            conf: { 
            
                // default effect variables
                effect: 'toggle',            
                fadeOutSpeed: "fast",
                tip: null,
            
                predelay: 0,
                delay: 30,
                opacity: 1,            
                lazy: undefined,
            
                // 'top', 'bottom', 'right', 'left', 'center'
                position: ['top', 'center'], 
                offset: [0, 0],            
                cancelDefault: true,
                relative: false,
                oneInstance: true,
            
            
                // type to event mapping 
                events: {
                    def:             "mouseover,mouseout",
                    input:         "focus,blur",
                    widget:        "focus mouseover,blur mouseout",
                    tooltip:        "mouseover,mouseout"
                },            
            
                api: false
            },
        
            addEffect: function(name, loadFn, hideFn) {
                effects[name] = [loadFn, hideFn];    
            } 
        };
    
    
        var effects = { 
            toggle: [ 
                function(done) { 
                    var conf = this.getConf(), tip = this.getTip(), o = conf.opacity;
                    if (o < 1) { tip.css({opacity: o}); }
                    tip.show();
                    done.call();
                },
            
                function(done) { 
                    this.getTip().hide();
                    done.call();
                } 
            ],
        
            fade: [
                function(done) { this.getTip().fadeIn(this.getConf().fadeInSpeed, done); },  
                function(done) { this.getTip().fadeOut(this.getConf().fadeOutSpeed, done); } 
            ]        
        };   

        function Tooltip(trigger, conf) {

            var self = this, $self = $(this);
        
            trigger.data("tooltip", self);
        
            // find the tip
            var tip = trigger.next();
        
            if (conf.tip) {
            
                tip = $(conf.tip);
            
                // multiple tip elements
                if (tip.length > 1) {
                
                    // find sibling
                    tip = trigger.nextAll(conf.tip).eq(0);    
                
                    // find sibling from the parent element
                    if (!tip.length) {
                        tip = trigger.parent().nextAll(conf.tip).eq(0);
                    }
                } 
            }                 
        
            /* calculate tip position relative to the trigger */      
            function getPosition(e) {    
            
                // get origin top/left position 
                var top = conf.relative ? trigger.position().top : trigger.offset().top, 
                     left = conf.relative ? trigger.position().left : trigger.offset().left,
                     pos = conf.position[0];

                top  -= tip.outerHeight() - conf.offset[0];
                left += trigger.outerWidth() + conf.offset[1];
            
                // adjust Y        
                var height = tip.outerHeight() + trigger.outerHeight();
                if (pos == 'center')     { top += height / 2; }
                if (pos == 'bottom')     { top += height; }
            
                // adjust X
                pos = conf.position[1];     
                var width = tip.outerWidth() + trigger.outerWidth();
                if (pos == 'center')     { left -= width / 2; }
                if (pos == 'left')       { left -= width; }     
            
                return {top: top, left: left};
            }        

        
            // event management
            var isInput = trigger.is(":input"), 
                 isWidget = isInput && trigger.is(":checkbox, :radio, select, :button"),            
                 type = trigger.attr("type"),
                 evt = conf.events[type] || conf.events[isInput ? (isWidget ? 'widget' : 'input') : 'def']; 
        
            evt = evt.split(/,\s*/); 
            if (evt.length != 2) { throw "Tooltip: bad events configuration for " + type; }
                
            trigger.bind(evt[0], function(e) {
            
                // close all instances
                if (conf.oneInstance) {
                    $.each(instances, function()  {
                        this.hide();        
                    });
                }
                
                // see if the tip was launched by this trigger
                var t = tip.data("trigger");            
                if (t && t[0] != this) { tip.hide().stop(true, true); }            
            
                e.target = this;
                self.show(e); 
            
                // tooltip close events
                evt = conf.events.tooltip.split(/,\s*/);
                tip.bind(evt[0], function() { self.show(e); });
                if (evt[1]) { tip.bind(evt[1], function() { self.hide(e); }); }
            
            });
        
            trigger.bind(evt[1], function(e) {
                self.hide(e); 
            });
        
            // ensure that the tip really shows up. IE cannot catch up with this.
            if (!$.browser.msie && !isInput && !conf.predelay) {
                trigger.mousemove(function()  {                    
                    if (!self.isShown()) {
                        trigger.triggerHandler("mouseover");    
                    }
                });
            }

            // avoid "black box" bug in IE with PNG background images
            if (conf.opacity < 1) {
                tip.css("opacity", conf.opacity);        
            }
        
            var pretimer = 0, title = trigger.attr("title");
        
            if (title && conf.cancelDefault) { 
                trigger.removeAttr("title");
                trigger.data("title", title);            
            }                        
        
            $.extend(self, {
                
                show: function(e) {
                
                    if (e) { trigger = $(e.target); }                

                    clearTimeout(tip.data("timer"));                    

                    if (tip.is(":animated") || tip.is(":visible")) { return self; }
                
                    function show() {
                    
                        // remember the trigger element for this tip
                        tip.data("trigger", trigger);
                    
                        // get position
                        var pos = getPosition(e);                    
                    
                        // title attribute                    
                        if (conf.tip && title) {
                            tip.html(trigger.data("title"));
                        }                 
                    
                        // onBeforeShow
                        e = e || $.Event();
                        e.type = "onBeforeShow";
                        $self.trigger(e, [pos]);                
                        if (e.isDefaultPrevented()) { return self; }
            
                    
                        // onBeforeShow may have altered the configuration
                        pos = getPosition(e);
                    
                        // set position
                        tip.css({position:'absolute', top: pos.top, left: pos.left});                    
                    
                        // invoke effect
                        var eff = effects[conf.effect];
                        if (!eff) { throw "Nonexistent effect \"" + conf.effect + "\""; }
                    
                        eff[0].call(self, function() {
                            e.type = "onShow";
                            $self.trigger(e);            
                        });                    
                    
                    }
                
                    if (conf.predelay) {
                        clearTimeout(pretimer);
                        pretimer = setTimeout(show, conf.predelay);    
                    
                    } else {
                        show();    
                    }
                
                    return self;
                },
            
                hide: function(e) {

                    clearTimeout(tip.data("timer"));
                    clearTimeout(pretimer);
                
                    if (!tip.is(":visible")) { return; }
                
                    function hide() {
                    
                        // onBeforeHide
                        e = e || $.Event();
                        e.type = "onBeforeHide";
                        $self.trigger(e);                
                        if (e.isDefaultPrevented()) { return; }
                    
                        effects[conf.effect][1].call(self, function() {
                            e.type = "onHide";
                            $self.trigger(e);        
                        });
                    }
                     
                    if (conf.delay && e) {
                        tip.data("timer", setTimeout(hide, conf.delay));
                    
                    } else {
                        hide();    
                    }            
                
                    return self;
                },
            
                isShown: function() {
                    return tip.is(":visible, :animated");    
                },
                
                getConf: function() {
                    return conf;    
                },
                
                getTip: function() {
                    return tip;    
                },
            
                getTrigger: function() {
                    return trigger;    
                },
            
                // callback functions            
                bind: function(name, fn) {
                    $self.bind(name, fn);
                    return self;    
                },
            
                onHide: function(fn) {
                    return this.bind("onHide", fn);
                },

                onBeforeShow: function(fn) {
                    return this.bind("onBeforeShow", fn);
                },
            
                onShow: function(fn) {
                    return this.bind("onShow", fn);
                },
            
                onBeforeHide: function(fn) {
                    return this.bind("onBeforeHide", fn);
                },

                unbind: function(name) {
                    $self.unbind(name);
                    return self;    
                }            

            });        

            // bind all callbacks from configuration
            $.each(conf, function(name, fn) {
                if ($.isFunction(fn)) { self.bind(name, fn); }
            });         
        
        }
        
    
        // jQuery plugin implementation
        $.prototype.tooltip = function(conf) {
        
            // return existing instance
            var api = this.eq(typeof conf == 'number' ? conf : 0).data("tooltip");
            if (api) { return api; }
        
            // setup options
            var globals = $.extend(true, {}, $.tools.tooltip.conf);        
        
            if ($.isFunction(conf)) {
                conf = {onBeforeShow: conf};
            
            } else if (typeof conf == 'string') {
                conf = {tip: conf};    
            }

            conf = $.extend(true, globals, conf);
        
            // can also be given as string
            if (typeof conf.position == 'string') {
                conf.position = conf.position.split(/,?\s/);    
            }
        
            // assign tip's only when apiement is being mouseovered        
            if (conf.lazy !== false && (conf.lazy === true || this.length > 20)) {    
                
                this.one("mouseover", function(e) {    
                    api = new Tooltip($(this), conf);
                    api.show(e);
                    instances.push(api);
                }); 
            
            } else {
            
                // install tooltip for each entry in jQuery object
                this.each(function() {
                    api = new Tooltip($(this), conf); 
                    instances.push(api);
                });
            } 

            return conf.api ? api: this;        
        
        };
        
    }) (jQuery);
    
    (function($) { 

        // version number
        var t = $.tools.tooltip;
        t.effects = t.effects || {};
        t.effects.slide = {version: '1.0.0'}; 
        
        // extend global configuragion with effect specific defaults
        $.extend(t.conf, { 
            direction: 'up', // down, left, right 
            bounce: false,
            slideOffset: 10,
            slideInSpeed: 200,
            slideOutSpeed: 200, 
            slideFade: !$.browser.msie
        });            
    
        // directions for slide effect
        var dirs = {
            up: ['-', 'top'],
            down: ['+', 'top'],
            left: ['-', 'left'],
            right: ['+', 'left']
        };
    
        /* default effect: "slide"  */
        $.tools.tooltip.addEffect("slide", 
        
            // show effect
            function(done) { 

                // variables
                var conf = this.getConf(), 
                     tip = this.getTip(),
                     params = conf.slideFade ? {opacity: conf.opacity} : {}, 
                     dir = dirs[conf.direction] || dirs.up;

                // direction            
                params[dir[1]] = dir[0] +'='+ conf.slideOffset;
            
                // perform animation
                if (conf.slideFade) { tip.css({opacity:0}); }
                tip.show().animate(params, conf.slideInSpeed, done); 
            }, 
        
            // hide effect
            function(done) {
            
                // variables
                var conf = this.getConf(), 
                     offset = conf.slideOffset,
                     params = conf.slideFade ? {opacity: 0} : {}, 
                     dir = dirs[conf.direction] || dirs.up;
            
                // direction
                var sign = "" + dir[0];
                if (conf.bounce) { sign = sign == '+' ? '-' : '+'; }            
                params[dir[1]] = sign +'='+ offset;            
            
                // perform animation
                this.getTip().animate(params, conf.slideOutSpeed, function()  {
                    $(this).hide();
                    done.call();        
                });
            }
        );  
    
    })(jQuery);
    
    (function($) { 

        // version number
        var t = $.tools.tooltip;
        t.plugins = t.plugins || {};
    
        t.plugins.dynamic = {
            version: '1.0.1',
    
            conf: {
                api: false,
                classNames: "top right bottom left"
            }
        };
        
        /* 
         * See if element is on the viewport. Returns an boolean array specifying which
         * edges are hidden. Edges are in following order:
         * 
         * [top, right, bottom, left]
         * 
         * For example following return value means that top and right edges are hidden
         * 
         * [true, true, false, false]
         * 
         */
        function getCropping(el) {
        
            var w = $(window); 
            var right = w.width() + w.scrollLeft();
            var bottom = w.height() + w.scrollTop();        
        
            return [
                el.offset().top <= w.scrollTop(),                         // top
                right <= el.offset().left + el.width(),                // right
                bottom <= el.offset().top + el.height(),            // bottom
                w.scrollLeft() >= el.offset().left                     // left
            ]; 
        }
    
        /*
            Returns true if all edges of an element are on viewport. false if not
        
            @param crop the cropping array returned by getCropping function
         */
        function isVisible(crop) {
            var i = crop.length;
            while (i--) {
                if (crop[i]) { return false; }    
            }
            return true;
        }
    
        // scrollable mousewheel implementation
        $.fn.dynamic = function(conf) {
        
            var globals = $.extend({}, t.plugins.dynamic.conf), ret;
            if (typeof conf == 'number') { conf = {speed: conf}; }
            conf = $.extend(globals, conf);
        
            var cls = conf.classNames.split(/\s/), orig;    
            
            this.each(function() {        
                
                if ($(this).tooltip().jquery)  {
                    throw "Lazy feature not supported by dynamic plugin. set lazy: false for tooltip";    
                }
                
                var api = $(this).tooltip().onBeforeShow(function(e, pos) {                

                    // get nessessary variables
                    var tip = this.getTip(), tipConf = this.getConf();  

                    /*
                        We store the original configuration and use it to restore back to the original state.
                    */                    
                    if (!orig) {
                        orig = [
                            tipConf.position[0], 
                            tipConf.position[1], 
                            tipConf.offset[0], 
                            tipConf.offset[1], 
                            $.extend({}, tipConf)
                        ];
                    }
                
                    /*
                        display tip in it's default position and by setting visibility to hidden.
                        this way we can check whether it will be on the viewport
                    */
                    $.extend(tipConf, orig[4]);
                    tipConf.position = [orig[0], orig[1]];
                    tipConf.offset = [orig[2], orig[3]];
                
                    tip.css({
                        visibility: 'hidden',
                        position: 'absolute',
                        top: pos.top,
                        left: pos.left
                    
                    }).show(); 
                
                    // now let's see for hidden edges
                    var crop = getCropping(tip);        
                                
                    // possibly alter the configuration
                    if (!isVisible(crop)) {
                    
                        // change the position and add class
                        if (crop[2]) { $.extend(tipConf, conf.top);        tipConf.position[0] = 'top';         tip.addClass(cls[0]); }
                        if (crop[3]) { $.extend(tipConf, conf.right);    tipConf.position[1] = 'right';     tip.addClass(cls[1]); }                    
                        if (crop[0]) { $.extend(tipConf, conf.bottom);     tipConf.position[0] = 'bottom';    tip.addClass(cls[2]); } 
                        if (crop[1]) { $.extend(tipConf, conf.left);        tipConf.position[1] = 'left';     tip.addClass(cls[3]); }                    
                    
                        // vertical offset
                        if (crop[0] || crop[2]) { tipConf.offset[0] *= -1; }
                    
                        // horizontal offset
                        if (crop[1] || crop[3]) { tipConf.offset[1] *= -1; }
                    }  
                
                    tip.css({visibility: 'visible'}).hide();
        
                });
            
                // restore positioning
                api.onShow(function() {
                    var c = this.getConf(), tip = this.getTip();                
                    c.position = [orig[0], orig[1]];
                    c.offset = [orig[2], orig[3]];                
                });
            
                // remove custom class names and restore original effect
                api.onHide(function() {
                    var tip = this.getTip(); 
                    tip.removeClass(conf.classNames);
                });
                
                ret = api;
            
            });
        
            return conf.api ? ret : this;
        };    
    
    }) (jQuery);
/* END JQUERY TOOLTIP v1.1.2 */

