
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
		
