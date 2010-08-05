
		// BEGIN THE MENU FUNCTIONS
			function switchMenu(id) {
				$(".rightbar-group").hide();
				$("#rightmenu a").removeClass("selected");
				$("#rightmenu ." + id).addClass("selected");
				$("#" + id).show();
			}
		// END THE MENU FUNCTIONS
		
		// BEGIN THE FANCYBOX FUNCTIONS			
			// The function for the thumbs viewer
			$(document).ready(function() {
				$.fn.getTitle = function() {
					var arr = $("a.fancybox");
					$.each(arr, function() {
						var title = $(this).children("img").attr("title");
						$(this).attr('title',title);
					})
			}
				
				$(".thumb").addClass("fancybox").attr({ rel: "fancybox" }).getTitle();
				
				$(".thumb").fancybox({
					'frameWidth': 640,
					'frameHeight': 480,
					'hideOnContentClick': false,
					'centerOnScroll': true,
					'imageScale': true,
					'padding': 5
				});
			});
		// END THE FANCYBOX FUNCTIONS
		

		// BEGIN THE REGISTER FORM FUNCTIONS
			// The tooltip function for the register form
			$(document).ready(function() {
				$("#ajax-r-form :input").tooltip({
					position: "center right",
					offset: [0, 15],
					effect: "fade",
					opacity: 0.7,
				});
			});
			
			function registerOpen() {
				// We hide other opened bubbles
				$(".bubble").fadeOut('fast');
				
				// We show the necessary divs
				$("#registered").show();
			}
			

		// BEGIN THE LOGIN FORM FUNCTIONS
			// The tooltip function for the login form
			$(document).ready(function() {
				$("#ajax-l-form :input").tooltip({
					position: "bottom center",
					offset: [10, -85],
					effect: "fade",
					opacity: 0.7,
				});
			});


		// BEGIN THE SCROLLABLE FUNCTIONS
			// The scrolling effect of the video div
			$.easing.custom = function (x, t, b, c, d) { 
				var s = 1.70158;  
				if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b; 
				return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b; 
			}
		
			// The scrolling function of the video div
			$(document).ready(function() {
				$(".scrollable").scrollable({easing: 'custom', speed: 700}).mousewheel();
			});
		// END THE SCROLLABLE FUNCTIONS
		
