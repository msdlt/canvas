(function () {  //method from: https://community.canvaslms.com/thread/22500-mobile-javascript-development
    
    /* Global UoB variables and style definitions */
    var iUoBSetNum = 0;
    var aTableStyles = [
        {group: "Table",	label: "Normal",		class: "borderless", 	category: 0},
        {group: "Table",	label: "Thin borders",	class: "thinborder", 	category: 0},
        {group: "Table",	label: "Striped",		class: "striped", 		category: 1},
        {group: "Table",	label: "Sortable",		class: "sortable", 		category: 1},

        {group: "Box",		label: "Plain", 		class: "box",			category: 1},
        {group: "Box",		label: "Info",			class: "info",			category: 1},
        {group: "Box",		label: "Tip",			class: "tip",			category: 1},
        {group: "Box",		label: "Warning",		class: "warning",		category: 1},
        {group: "Box",		label: "Question",		class: "question",		category: 1},
        {group: "Box",		label: "Quote",			class: "quote",			category: 1},
        {group: "Box",		label: "Quote 6699*",	class: "quote6699",		category: 2},
        {group: "Box",		label: "Header",		class: "header",		category: 1},
        {group: "Box",		label: "Group",		    class: "group",		  category: 1}, //UoO

        {group: "Layout",	label: "Accordion",		class: "accordion",		category: 1},
        {group: "Layout",	label: "Accordion EA",	class: "accordion-ea",	category: 1},
        {group: "Layout",	label: "Tabs",			class: "tabs",			category: 1},
        {group: "Layout",	label: "Parallax*",		class: "parallax",		category: 2},
        {group: "Layout",	label: "Columns*",		class: "columns",		category: 2},

        {group: "Widget",	label: "Reveal",		class: "reveal",		category: 1},
        {group: "Widget",	label: "RegExp",		class: "regexp",		category: 1},
        {group: "Widget",	label: "MCQ",			class: "mcq",			category: 1},
        {group: "Widget",	label: "Button*",		class: "button",		category: 2},
        {group: "Widget",	label: "QR Code*",		class: "qrcode",		category: 2},
        {group: "Widget",	label: "Rating*",		class: "rating",		category: 2}//,

        //{group: "Command",	label: "Style Header*",		class: "stylehead",			category: 2},
        //{group: "Command",	label: "Hide Header*",		class: "hidehead",			category: 2},
        //{group: "Command",	label: "Hide Left Side*",	class: "hideleftside",		category: 2},
        //{group: "Command",	label: "Hide Right Side*",	class: "hiderightside",		category: 2}
    ];

    var aTableStylesOld = ["accordion", "tabs", "reveal", "regexp", "tip", "info", "warning", "header", "question", "quote", "box"];
    
    // The following function will retrieve and load a JavaScript file - https://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    
    
    // First load jQuery and then load jQuery UI
    loadScript("https://code.jquery.com/jquery-1.9.1.min.js", function () {
        //Now load anything that depenfds on JQuery
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/gist-embed/2.7.1/gist-embed.min.js", function () {   
            //should be able to use GistEmbed
            loadScript("https://code.jquery.com/ui/1.12.1/jquery-ui.js", function () {   
                //should be able to use JQuery UI
                loadScript("https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML", function () { 
                    //START UoO PlainJS version
                    // ================================================================================
                    // Amend document's CSS to hide all tables with uob- styles.
                    // --------------------------------------------------------------------------------
                    var aTableSelectors = [];
                    Array.prototype.forEach.call(aTableStyles, function(value, index){
                        if (index > 0 && value.group != "Table") {
                            aTableSelectors.push("table.uob-" + value.class);
                        }
                    });
                    var strTableSelectors = aTableSelectors.join(", ");
                    aTableSelectors = undefined;
                    $(function() {
                        uobSetDocumentStyle(document, strTableSelectors, "display: none;");
                        uobAddComponents(document.getElementById('content'));
                    });
                });
            });
        });    
    });
    
    // ================================================================================
    // CSS/JS/style loader functions
    // ================================================================================

    /*function uobEmbedJavaScript(urlJS) {
        var oJS = document.createElement("script");
        oJS.type = "text/javascript";
        oJS.async = false;
        oJS.src = urlJS;
        document.getElementsByTagName("head")[0].appendChild(oJS);
    }*/


    function uobSetDocumentStyle(doc, selector, declarations) {
        var sheet = doc.createElement('style');
        sheet.innerHTML = selector + " {" + declarations + "}";
        doc.body.appendChild(sheet);
    }
    
    
    // ================================================================================
	// uobAddComponents
	//
	// This function will enable the following UoB components in the specified context:
	//		boxes (tip, info, warning, header, question, quote, quote6699, box)
	//		tables (borderless, thinborder, striped, sortable)
	//		widgets (accordion, tabs, reveal, regexp, mcq)
	//		misc (previews)
	// ================================================================================

	function uobAddComponents(strContent) {

		// ================================================================================
		// Initialise function
		// --------------------------------------------------------------------------------

		// Initialise $content
		var $content;

		if (strContent.length > 0) {
			$content = $(strContent);
		} else {
			$content = $("#content");
		}

		// Declare key variables
		var $table;


		// ================================================================================
		// Convert old-style UoB component tables to new.
		// --------------------------------------------------------------------------------

		for (var i = 0; i < aTableStylesOld.length; i++) {
			var strTag = aTableStylesOld[i];

			$content.find("table > tbody > tr > td:first-child:contains([uob-" + strTag + "])").each(function(index, tableTag){
				$(tableTag).parent().parent().parent().addClass("uob-" + strTag);
				$(tableTag).parent().remove();
			});
		}


		// ================================================================================
		// Accordian
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-accordion tables to required format.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-accordion table.
			$table = $content.find("table[class~='uob-accordion'],table[class~='uob-accordion-ea']").last();

			// Break loop if no more accordions are to be displayed.
			if ($table.length != 1) break;

			// Determine new ID for this accordion.
			var iSetNum = getSetNum();
			var strAnchor = "set" + iSetNum;

			// Add "Expand all" button
			if ($table.filter("table:first[class~=uob-accordion-ea]").length > 0) {
				$table.before("<p class=\"uob-accordion-button-container\"><a id=\"" + strAnchor + "button\" href=\"#" + strAnchor + "\" class=\"uob-accordion-button Button\">Expand all</a></p>");
			}

			// Convert table into HTML for an accordian.
			$table.before("<div id=\"" + strAnchor + "\" class='uob-accordion'></div>");

			$table.find("tbody:first > tr > td").each(function(_idx, _item) {
				if ((_idx + 1) % 2) {
					// Add heading 4 for accordion bar.
					$table.prev().append("<h4></h4>");
					$table.prev().children().last().append($(_item).text().trim());
				} else {
					// Add div for accordion content.
					$table.prev().append("<div></div>");
					$table.prev().children().last().append($(_item).contents());
				}
			});

			// Remove original table from the DOM
			$table.remove();
		}

		// Initialise accordions. Accordions will be contained within elements with a
		// uob-accordion class and headings will be restricted to h4 tags.
		var $accordion = $content.find(".uob-accordion");

		if ($accordion.length) {
			$accordion.accordion({
				icons: null,
				heightStyle: "content",
				header: "> h4",
				collapsible: true,
				active: false,
				beforeActivate: function( event, ui ) {
					ui.oldPanel.find(".hide_youtube_embed_link").click();
					var $button = $("#" + $(this).attr("id") + "button");
					var body = $button.attr("href");

					if ($button.prop("uobExpanded")) {
						$(body).accordion({active: false});
						$(body + ' > .ui-accordion-header').next().slideUp();
						$button.removeClass("Button--primary");
						$button.removeProp("uobExpanded");
					}
				}
			});
		}

		// Initialise accordion buttons.
		var $accordionButton = $content.find(".uob-accordion-button");

		if ($accordionButton.length) {
			$accordionButton.button()
				.click(function(event) {
					var $button = $(this);
					var body = $button.attr("href");
					var options;

					$(body).accordion({active: false});

					if ($button.prop("uobExpanded")) {
						$(body + ' > .ui-accordion-header').next().slideUp();
						$button.removeClass("Button--primary");
						$button.removeProp("uobExpanded");
					} else {
						$(body + ' > .ui-accordion-header').next().slideDown();
						$button.addClass("Button--primary");
						$button.prop("uobExpanded", "1");
					}

					return(false);
				});
		}


		// ================================================================================
		// Tabs
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-tabs tables to format required for tabs.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-tabs table.
			$table = $content.find("table[class~='uob-tabs']").last();

			// Break loop if no more tabs are to be displayed.
			if ($table.length != 1) break;

			// Convert table into a set of tabs.
			$table.before("<div class='uob-tabs'><ul></ul></div>");
			var iSetNum = getSetNum();

			$table.find("tbody:first > tr > td").each(function(_idx, _item) {
				var strAnchor = "set" + iSetNum + "tab" + ((_idx - (_idx % 2)) / 2);

				if ((_idx + 1) % 2) {
					// Add list item for the tab label.
					var strHTML = "<li><a href=\"#" + strAnchor + "\">" + $(_item).text().trim() + "</a></li>";
					$table.prev().find("ul").first().append(strHTML);
				}

				if (_idx % 2) {
					// Add div for the tab content.
					$table.prev().append("<div id=\"" + strAnchor + "\"></div>");
					$("#" + strAnchor).append($(_item).contents());
				}
			});

			// Remove original table from the DOM
			$table.remove();
		}

		// Initialise tabs. Tabs will be contained within elements with a uob-tabs class.
		var $tabs = $content.find(".uob-tabs");
        
        console.log($tabs);

		if ($tabs.length > 0) {
			$tabs.tabs({
				active: 0,
				collapsible: false,
				heightStyle: "content",
				beforeActivate: function( event, ui ) {
					ui.oldPanel.find(".hide_youtube_embed_link").click();
				}
			});
		}


		// ================================================================================
		// Parallax
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-parallax tables to format required for parallax.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-parallax table.
			$table = $content.find("table[class~='uob-parallax']").last();

			// Break loop if no more parallax blocks are to be displayed.
			if ($table.length != 1) break;

			// Convert table into a set of parallax blocks.
			$table.before("<div class='uob-parallax'><ul></ul></div>");
			var strImageSrc = "";

			$table.find("tbody:first > tr > td").each(function(_idx, _item) {
				if ((_idx + 1) % 2) {
					// Store source of image
					strImageSrc = $(_item).find("img[src]").first().attr("src");
				}

				if (_idx % 2) {
					// Add div for the parallax content (if an image source exists).
					if (strImageSrc.length > 0) {
						var iSetNum = getSetNum();
						var strAnchor = "parallax" + iSetNum.toString();
						var strHTML = "<div class=\"parallax-block bg00\" style=\"background-image: url('" + strImageSrc + "')\">";
						strHTML += "<div id=\"" + strAnchor + "\" class=\"parallax-foreground\"></div>";
						strHTML += "</div>";
						$table.prev().append(strHTML);
						$("#" + strAnchor).append($(_item).contents());
					}
				}
			});

			// Remove original table from the DOM
			$table.remove();
		}


		// ================================================================================
		// Reveals
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-reveal tables to format required for reveals.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-reveal table
			var $table = $content.find("table[class~='uob-reveal']").last();

			// Break loop if no more reveal tables are to be converted.
			if ($table.length != 1) break;

			// Convert table into a reveal
			var iSetNum = getSetNum();

			$table.find("tbody:first > tr > td").each(function(_idx, _item) {
				var strAnchor = "set" + iSetNum + "reveal" + ((_idx - (_idx % 2)) / 2);

				if ((_idx + 1) % 2) {
					// Add new reveal button immediately before table
					$table.before("<p><a href=\"#" + strAnchor + "\" class=\"uob-reveal-button\"></a></p>");
					$table.prev().children().append($(_item).text().trim());
				}

				if (_idx % 2) {
					// Add new reveal content immediately before table
					$table.before("<div id=\"" + strAnchor + "\" class=\"uob-reveal-content\"></div>");
					$table.prev().append($(_item).contents());
				}
			});

			// Remove original table
			$table.remove();
		}

		// Initialise reveal contents. The uob-reveal-button and uob-reveal-content classes are required for reveals.
		var $revealBody = $content.find(".uob-reveal");

		if ($revealBody.length) {
			for (var i = 0; i < $revealBody.length; i++) {
				var strSelector = $revealBody[i].href;
				var iHashPos = strSelector.lastIndexOf("#");

				if (iHashPos >= 0) {
					$(strSelector.slice(iHashPos + 1)).css("display", "none");
				}
			};
		}

		// Initialise reveal buttons.
		var $revealButton = $content.find(".uob-reveal-button");

		if ($revealButton.length) {
			$revealButton.button({ icons: { secondary: "ui-icon-triangle-1-e" } })
				.click(function(event) {
					var $button = $(this);
					var body = $button.attr("href");
					var options;

					if ($(body).css("display") != "none") {
						$(body).slideUp(400);
						$(body).find(".hide_youtube_embed_link").click();
						options = { icons: { secondary: "ui-icon-triangle-1-e" } };
					} else {
						$(body).slideDown(400);
						options = {	icons: { secondary: "ui-icon-triangle-1-s" } };
					}

					$button.button("option", options);
					return(false);
				});
		}


		// ================================================================================
		// RegExp
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-regexp tables to format required for regexps.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-regexp table
			var $table = $content.find("table[class~='uob-regexp']").last();

			// Break loop if no more regexp tables are to be converted.
			if ($table.length != 1) break;

			// Convert table into a regexps
			var iSetNum = getSetNum();

			// Generate HTML for input and button/anchor controls, and add to the DOM.
			var strAnchor = "RE" + iSetNum;

			var strHTML = "<p><input id=\"input" + strAnchor + "\" class=\"uob-regexp-input\" type=\"text\" size=\"40\" />&nbsp;<a href=\"#" + strAnchor + "\" id=\"button" + strAnchor + "\" class=\"uob-regexp-button\">Check Answer</a></p>";
			strHTML += "<div id='content" + strAnchor + "'></div>";
			$table.before(strHTML);

			// Store regular expressions in button and create DIVs to store the contents.
			$table.find("tbody:first > tr > td").each(function(_idx, _item) {
				var strValue = $(_item).html();
				var strIndex = ((_idx - (_idx % 2)) / 2);

				if ((_idx + 1) % 2) {		// set RegExp
					strValue = $(_item).text().trim();
					$("#button" + strAnchor).attr("regexp" + strIndex, strValue);
				}

				if (_idx % 2) {			// set Content
					//$("#data" + strAnchor).attr("content" + strIndex, strValue);
					strHTML = "<div id=\"data" + strAnchor + "ID" + strIndex + "\" class=\"uob-regexp-content\"></div>";
					$("#content" + strAnchor).append(strHTML);
					$("#data" + strAnchor + "ID" + strIndex).append($(_item).contents());
				}
			});

			// Store IDs of input and button to button and input respectively.
			$("#button" + strAnchor).attr("regexpInput", "input" + strAnchor);
			$("#input" + strAnchor).attr("regexpButton", "button" + strAnchor);

			// Store default selection in button.
			$("#button" + strAnchor).attr("regexpData", "data" + strAnchor + "ID0");
			$("#button" + strAnchor).attr("regexpDataRoot", "data" + strAnchor + "ID");

			// Remove original table
			$table.remove();
		}

		// Initialise regexp inputs. The uob-regexp-input, uob-regexp-button and
		// uob-regexp-content classes are required for regexp.
		var $regexpInput = $content.find(".uob-regexp-input");

		if ($regexpInput.length) {
			$regexpInput.focus(function(event) {
				var $input = $(this);
				var $button = $("#" + $input.attr("regexpButton"));

				var strData = $button.attr("regexpData");
				var strDataRoot = $button.attr("regexpDataRoot");

				if (strData != "") {
					var $data = $("#" + strData);
					var options;

					// Hide current display if visible
					if ($data.css("display") != "none") {
						$data.slideUp(400);
						$data.find(".hide_youtube_embed_link").click();
						options = { icons: { secondary: "ui-icon-triangle-1-e" } };
						$button.button("option", options);
						$button.attr("regexpData", "");
					}
				}
			});
		}

		// Initialise regexp buttons.
		var $regexpButton = $content.find(".uob-regexp-button");

		if ($regexpButton.length) {
			$regexpButton.button({ icons: { secondary: "ui-icon-triangle-1-e" } })
				.click(function(event) {
					var $button = $(this);
					var $input = $("#" + $button.attr("regexpInput"));

					var strData = $button.attr("regexpData");
					var strDataRoot = $button.attr("regexpDataRoot");
					if (strData == "") strData = strDataRoot + "0";
					var $data = $("#" + strData);
					var options;

					// Hide current display if visible
					if ($data.css("display") != "none") {
						$data.slideUp(400);
						options = { icons: { secondary: "ui-icon-triangle-1-e" } };
						$button.button("option", options);
						$button.attr("regexpData", "");
					} else {
						// Locate content to be displayed
						var strInput = $input.val();

						// Loop through regexp looking for a match and identify content.
						for (var i = 0; i < 100; i++) {
							var strRegExp = $button.attr("regexp" + i);

							if (strRegExp == undefined || strRegExp.length == 0)
								break;

							var re = new RegExp("^" + strRegExp.trim() + "$");

							if (strRegExp == "default" || re.test(strInput)) {
								$button.attr("regexpData", "" + strDataRoot + i);
								$data = $("#" + strDataRoot + i);
								break;
							}
						}

						$data.slideDown(400);
						options = {	icons: { secondary: "ui-icon-triangle-1-s" } };
						$button.button("option", options);
						return(false);
					}
				});
		}


		// ================================================================================
		// MCQs
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-mcq tables to format required for MCQs.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-mcq table
			var $table = $content.find("table[class~='uob-mcq']").last();

			// Break loop if no more mcq tables are to be converted.
			if ($table.length != 1) break;

			// Convert table into a MCQs
			// Determine the name used to identify each MCQ. It will take the form MCQ# where # is a number.
			var iSetNum = getSetNum();
			var strName = "MCQ" + iSetNum;

			// Add skeleton HTML, including the main button, to the DOM (positioned just above the table).
			$table.before("<div> <div></div> <p><a href=\"#" + strName + "\" id=\"button" + strName + "\" mcqData=\"\" mcqName=\"" + strName + "\" class=\"uob-mcq-button\">Show feedback</a></p> <div></div> </div>");
			var $mcqOptions = $table.prev().children().filter(":first");
			var $mcqFeedback = $table.prev().children().filter(":last");

			// Compile HTML for options (strHTML1) and feedback (strHTML2).
			$table.find("tbody:first > tr").each(function(_idx, _item) {
				// Determine the value used to identify each option. It will take the form MCQ#OPT# where # is a number.
				var strValue = strName +  "OPT" + _idx;

				// Append the HTML for the option to the DOM.
				var $option = $(_item).find("td:first");
				$mcqOptions.append("<div><label class=\"uob-mcq-option\"><div class=\"uob-mcq-option1\"><input name=\"" + strName + "\" type=\"radio\" value=\"" + strValue + "\" /></div><div class=\"uob-mcq-option2\"></div></label></div>");
				$mcqOptions.children().last().children().children(".uob-mcq-option2").append($option.contents());

				// Append the HTML for the feedback to the DOM.
				var $feedback = $(_item).find("td:nth-of-type(2)");
				$mcqFeedback.append("<div id=\"" + strValue + "\" class=\"uob-mcq-feedback\"></div>");
				$mcqFeedback.children().last().append($feedback.contents());
			});

			// Remove original table from the DOM.
			$table.remove();
		}

		// Initialise mcq options. The uob-regexp-input, uob-regexp-button and
		// uob-regexp-content classes are required for MCQ.
		$("div.uob-mcq-option1 input").on("change", function(event){
			var $button = $("#button" + $(this).attr("name"));
			var strData = $button.attr("mcqData");
			var $data = $("#" + strData);

			if ($data.length > 0 && $data.css("display") != "none") {
				$data.slideUp(400);
				$data.find(".hide_youtube_embed_link").click();
				options = { icons: { secondary: "ui-icon-triangle-1-e" } };
				$button.button("option", options);
			}

			return(true);
		});

		// Initialise mcq button.
		var $mcqButton = $content.find(".uob-mcq-button");

		if ($mcqButton.length) {
			$mcqButton.button({ icons: { secondary: "ui-icon-triangle-1-e" } })
				.click(function(event) {
					var $button = $(this);
					var strName = $button.attr("mcqName");
					var strData = $button.attr("mcqData");
					var $data = $("#" + strData);
					var options;

					// Hide current feedback display if visible
					if ($data.length > 0 && $data.css("display") != "none") {
						$data.slideUp(400);
						$data.find(".hide_youtube_embed_link").click();
						options = { icons: { secondary: "ui-icon-triangle-1-e" } };
						$button.button("option", options);
					} else {
						// Locate content to be displayed
						var strCorrect = $button.attr("mcqCorrect");
						var strSelected = $("input[name=" + strName + "]:checked").val();
						$button.attr("mcqData", strSelected);
						$data = $("#" + strSelected);

						// Show feedback display
						$data.slideDown(400);
						options = {	icons: { secondary: "ui-icon-triangle-1-s" } };
						$button.button("option", options);
					}

					return(false);
				});
		}


		// ================================================================================
		// Rating
		//
		// A rating will be constructed using radio buttons.
		// See http://www.fyneworks.com/jquery/star-rating/
		// --------------------------------------------------------------------------------

		// Convert uob-rating table to format required for ratings.
		var $ratingTable = $content.find("table[class~='uob-rating']");

		if ($ratingTable.length) {
			// Cut table from the DOM
			$ratingTable.remove();

			// Determine is user is more than a student.
			var isTeacher = false;

			hasAnyRole("teacher", "admin", function() {
				isTeacher = true;
			});

			// Add rating control to DOM
			var strParams = "?page_loc=" + encodeURIComponent(location.pathname);
			strParams += "&page_title=" + encodeURIComponent(document.title);
			strParams += "&user_id=" + ENV.current_user_id;
			strParams += "&user_name=" + encodeURIComponent(ENV.current_user.display_name);
			var strRating = "<iframe src=\"https://www.vampire.bham.ac.uk/canvas/rating.aspx" + strParams + "\" width=\"100%\" height=\"32\"></iframe>";
			strRating = "<div id='uob-rating-container-x'>" + strRating + "</div>";
			$content.append(strRating);
		}


		// ================================================================================
		// Boxes
		//
		// Create boxes from all tables with the codes: uob-tip, uob-info, uob-warning,
		// uob-header, uob-quote, uob-quote6699 and uob-question.
		// --------------------------------------------------------------------------------

		for (var i = 0; i < aTableStyles.length; i++) {
			if (aTableStyles[i].group == "Box") {
				var strTag = aTableStyles[i].class;
				var $boxTable = $content.find("table[class~='uob-" + strTag + "']");

				if ($boxTable.length) {
					$boxTable.each(function(_idx, _item) {
						// Add new container immediately before table
						$table = $(_item);

						if (strTag == "header")
							$table.before("<h2 class=\"uob-" + strTag + "\"></h2>");
						else
							$table.before("<div class=\"uob-" + strTag + "\"></div>");

						// Move content from table to container
						$table.prev().append($table.find("th,td").first().contents());

						// Remove original table
						$table.remove();
					});

					// Replace double quotes in uob-quot6699 text with corresponding SVG images
					replaceText("div.uob-quote6699", /(\u201C|\")([^\s\"]+)(\u201D|\")/g, "<span class=\"uob-nowrap\"><span class=\"uob-quote66\"></span>$2<span class=\"uob-quote99\"></span></span>");
					replaceText("div.uob-quote6699", /(\u201C|\")([^\s\"]+)/g, "<span class=\"uob-nowrap\"><span class=\"uob-quote66\"></span>$2</span>");
					replaceText("div.uob-quote6699", /([^\s\"]+)(\u201D|\")/g, "<span class=\"uob-nowrap\">$1<span class=\"uob-quote99\"></span></span>");
					replaceText("div.uob-quote6699", /(\u201C|\")(\u201D|\")/g, "<span class=\"uob-nowrap\"><span class=\"uob-quote66\"></span><span class=\"uob-quote99\"></span></span>");
					replaceText("div.uob-quote6699", /(\u201C)/g, "<span class=\"uob-quote66\"></span>");
					replaceText("div.uob-quote6699", /(\u201D|\")/g, "<span class=\"uob-quote99\"></span>");
				}
			}
		}


		// ================================================================================
		// Columns
		//
		// Create column layout from all tables with the code uob-columns.
		// --------------------------------------------------------------------------------

		// Convert all uob-columns tables to div with columns.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-columns table.
			$table = $content.find("table[class~='uob-columns']").last();

			// Break loop if no more columns are to be displayed.
			if ($table.length != 1) break;

			// Convert table into columns.
			$table.before("<div class='uob-columns'></div>");
			$table.prev().append($table.find("th,td").first().contents());

			// Remove original table from the DOM
			$table.remove();
		}


		// ================================================================================
		// Apply styling for striped and sortable tables
		// --------------------------------------------------------------------------------

		// Apply styling for striped tables
		$content.find("table.uob-striped > tbody > tr:odd, table.uob-striped > tr:odd").addClass("odd");

		// Apply styling for sortable tables
		$content.find("table.uob-sortable").each(function(index) {
			var t = new SortableTable(this);
		});


		// ================================================================================
		// QR codes
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-qrcode tables to format required for QR codes.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-qrcode table
			var $table = $content.find("table[class~='uob-qrcode']").last();

			// Break loop if no more QR code tables are to be converted.
			if ($table.length != 1) break;

			// Convert table into a QR code
			var iSetNum = getSetNum();
			var strString = $table.find("th,td").first().text().trim();
			if (strString.length == 0) strString = location.href;
			var strAnchor = "qrcode" + iSetNum;
			var strImage = "<img src=\"http://chart.apis.google.com/chart?cht=qr&chs=128x128&amp;chl=" + encodeURI(strString) + "&chld=H|0\" alt=\"QR Code\">"
			$table.before("<div id=\"" + strAnchor + "\" class=\"uob-qrcode\">" + strImage + "</div>");

			// Remove original table
			$table.remove();
		}


  		// ================================================================================
		// Buttons
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-button tables to buttons.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-button table
			var $table = $content.find("table[class~='uob-button']").last();

			// Break loop if no more button tables are to be converted.
			if ($table.length != 1) break;

			// Convert table into buttons
			$table.find("tbody:first > tr").each(function(_idx, _item) {
				// Pull in row of data
				var $anchors = $(_item).find("td").eq(0);
				var $options = $(_item).find("td").eq(1);
				var strOptions = $options.text();

				// Set the button's style (based on width option)
				var strWidth = "";
				var reWidth = new RegExp("\\bwidth\\s*\\=\\s*(\\d+)(em\\b|px\\b|%)", "gi");
				var aWidth = reWidth.exec(strOptions);
				if (aWidth != null) strWidth = "" + aWidth[1] + aWidth[2];

				// Set the button's class (based on type option)
				var strType = "";
				var reColour = new RegExp("\\btype\\s*\\=\\s*(\\w+)\\b", "gi");
				var aColour = reColour.exec(strOptions);
				if (aColour != null) strColour = aColour[1]; else strColour = "";

				switch (strColour) {
					case "primary": case "secondary": case "success": case "warning": case "danger": case "link":
						strType = "Button Button--" + strColour;
						break;
					default:
						strType = "Button";
				}

				// Loop through anchors
				$anchors.find("a").each(function(_a_idx, _a_item) {
					// Amend style and class of the anchor, insert paragraph before table, and move anchor to the paragraph.
					if ($(_a_item).text().length) {
						$(_a_item).addClass(strType).css("width", strWidth);
						$table.before("<p></p>");
						$table.prev().append($(_a_item));
					}
				});

			});

			// Remove original table
			$table.remove();
		}
    }
    
    // ================================================================================
    // Instructure/rpflorence and other toolbox functions
    //
    // (see http://youtu.be/ag6mxnBMTnQ and https://gist.github.com/rpflorence/5817898)
    // Functions slightly amended and new functions added by TLB.
    // ================================================================================

    function onPage(regex, fnTrue, fnFalse) {
        if (location.pathname.match(regex))
            fnTrue();
        else if (arguments[2])
            fnFalse();
    }


    function hasAnyRole(/* role1, role2..., cb */) {
        var roles = [].slice.call(arguments, 0);
        var cb = roles.pop();

        if (typeof ENV != "object") return cb(false);
        if (typeof ENV.current_user_roles != "object") return cb(false);
        if (ENV.current_user_roles == null) return cb(false);

        for (var i = 0; i < roles.length; i++) {
            if (ENV.current_user_roles.indexOf(roles[i]) !== -1) return cb(true);
        }

        return cb(false);
    }


    function isUser(id, cb) {
        cb(ENV.current_user_id == id);
    }


    function onElementRendered(selector, cb, _attempts) {
        var el = $(selector);
        _attempts = ++_attempts || 1;
        if (el.length) return cb(el);
        if (_attempts > 55) return(false);

        setTimeout(function() {
            onElementRendered(selector, cb, _attempts);
        }, 367);
        return(false);
    }


    function onElementRemoved(selector, cb, _attempts) {
        var el = $(selector);
        _attempts = ++_attempts || 1;
        if (!el.length) return cb(el);
        if (_attempts > 55) return(false);

        setTimeout(function() {
            onElementRemoved(selector, cb, _attempts);
        }, 367);
        return(false);
    }


    function onCanvasObject(apiCall, cb) {
        $.get(apiCall).done(function(_d) {
            cb(_d);
        });
    }


    function onTinyMCE(cb, _attempts) {
        if (typeof tinyMCE == 'object' && typeof tinyMCE.editors == "object") {
            setTimeout(function() { cb(); }, 200);
            return(true);
        }

        if (typeof tinyRCE == 'object' && typeof tinyRCE.editors == "object") {
            setTimeout(function() { cb(); }, 200);
            return(true);
        }

        _attempts = ++_attempts || 1;
        if (_attempts >= 60) return(false);

        setTimeout(function() { onTinyMCE(cb, _attempts); }, 200);
        return(false);
    }


    function onTinyMCEEditor(cb, _attempts) {
        if (typeof tinyRCE == 'object' && typeof tinyRCE.editors == "object" && tinyRCE.editors.length) {
            setTimeout(function() { cb(); }, 200);
            return(true);
        }

        if (typeof tinyMCE == 'object' && typeof tinyMCE.editors == "object" && tinyMCE.editors.length) {
            setTimeout(function() { cb(); }, 200);
            return(true);
        }

        _attempts = ++_attempts || 1;
        if (_attempts >= 60) return(false);

        setTimeout(function() { onTinyMCEEditor(cb, _attempts); }, 200);
        return(false);
    }


    function getTinyMCE() {
        if (typeof tinyRCE == 'object' && typeof tinyRCE.editors == "object" && tinyRCE.editors.length)
            return(tinyRCE);

        if (typeof tinyMCE == 'object' && typeof tinyMCE.editors == "object" && tinyMCE.editors.length)
            return(tinyMCE);

        return(null);
    }


    function onActiveEditorTinyMCE(cb, _attempts) {
        if ((typeof tinyRCE) == "object" && tinyRCE.activeEditor && tinyRCE.activeEditor.dom && tinyRCE.activeEditor.dom.doc) {
            return cb(tinyRCE.activeEditor.dom.doc);
        }

        if ((typeof tinyMCE) == "object" && tinyMCE.activeEditor && tinyMCE.activeEditor.dom && tinyMCE.activeEditor.dom.doc) {
            return cb(tinyMCE.activeEditor.dom.doc);
        }

        _attempts = ++_attempts || 1;
        if (_attempts >= 60) return(false);

        setTimeout(function() { onActiveEditorTinyMCE(cb, _attempts); }, 200);
        return(false);
    }


    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }

        return(false);
    }


    function getSetNum() {
        return(++iUoBSetNum);
    }


    function replaceText(selector, search, replace) {
        var iCounter = iCounter || 0;

        $(selector).each(function(){
            if(this.nodeType === 3) {
                var textOld = this.nodeValue;
                var textNew = textOld.replace(search, replace);

                if(textOld != textNew) {
                    $(this).replaceWith(textNew);
                    iCounter++;
                }
            } else {
                iCounter += replaceText($(this).contents(), search, replace);
            }
        });

        return(iCounter);
    }    
    
})();