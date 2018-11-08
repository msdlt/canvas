(function () {  //method from: https://community.canvaslms.com/thread/22500-mobile-javascript-development
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
    //loadScript("https://code.jquery.com/jquery-1.9.1.min.js", function () {
    //Now load anything that depenfds on JQuery
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/gist-embed/2.7.1/gist-embed.min.js", function () {   
            //loadScript("https://code.jquery.com/ui/1.12.1/jquery-ui.js", function () {   
            //should be able to use 
            
            //START UoB code
            
            // ====================================================================================================
            //
            // Generic top-level script for University of Birmingham's Canvas implementation. This script is
            // combined with the corresponding CSS file, jQuery and jQuery.UI will carry out a number of tasks.
            //
            //		Hides forgot-password link on login page
            // 		Add FindIt@Bham link to Help Corner
            //		Add footer with link to Gallery and Panopto warning when not using canvas.bham.ac.uk
            //		Change prompts for "email address" to "username"
            // 		Enables UoB Components: tables, boxes, layouts, widgets and commands.
            //		Adds option for teachers to download course analytics
            //		Adds Google viewer previews to compatible file links
            //		Adds Google Analytics with custom dimensions for course, sub-account, term and (role) type ID
            //		Adds custom menu items to the global navigation
            //
            // Filename: UoB14_PP.js
            // Version: 014
            // Date: 22/08/2018
            // Amended by: Steve Watts/Nathan Johnson
            //
            // Amendments:
            //		Fixed issue with setting solid background colour for UoB Component dialog box.
            //		Increased number of UoB components of each type from 25 to 100.
            //		Hide add course button in new account search interface
            //		Added custom navigation item "Portfolio" to the global navigation
            //
            // ====================================================================================================



            $(function() {
                // ================================================================================
                // Declare veriables that are used for multiple tasks.
                // --------------------------------------------------------------------------------
                var i;
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


                // ================================================================================
                // Amend document's CSS to hide all tables with uob- styles.
                // --------------------------------------------------------------------------------
                $(function() {
                    var aTableSelectors = [];
                    $.each(aTableStyles, function(index, value) { if (index > 0 && value.group != "Table") aTableSelectors.push("table.uob-" + value.class); });
                    var strTableSelectors = aTableSelectors.join(", ");
                    aTableSelectors = undefined;
                    uobSetDocumentStyle(document, strTableSelectors, "display: none;");
                });

                // ================================================================================
                // Enable MathJax.
                // --------------------------------------------------------------------------------

                //uobEmbedJavaScript("https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML");
                uobEmbedJavaScript("https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML");


                // ================================================================================
                // Hide Mute/Unmute assignment button in the SpeedGrader.
                // --------------------------------------------------------------------------------

                /*onPage(/^\/(courses)\/\d+\/gradebook\/speed_grader$/, function() {
                    $("#mute_link").hide();
                });*/


                // ================================================================================
                // Apply styling for UoB components.
                // --------------------------------------------------------------------------------

                onPage(/^\/(courses|groups)\/\d+/, function() {

                    // Determine page type
                    var strPageType = "";
                    if ($("body.pages").length == 1) { strPageType = "PAGES"; }
                    //if ($("body.syllabus").length == 1) { strPageType = "SYLLABUS"; }
                    //onPage(/^\/courses\/\d+\/pages\/[a-zA-Z0-9-]+\/revisions$/, function() { strPageType = "REVISIONS"; });
                    //onPage(/^\/courses\/\d+\/quizzes\/\d+\/edit$/, function() { strPageType = "QUIZZES-EDIT"; });
                    //onPage(/^\/(courses|groups)\/.*\/discussion_topics\/\d+$/, function() { strPageType = "DISCUSSION-TOPICS"; });

                    // Add components for standard user content
                    onElementRendered("div.user_content.enhanced, div.show-content.enhanced", function($content){
                        uobAddComponents("div.user_content.enhanced, div.show-content.enhanced");
                    });

                    // Add components for special cases
                    switch (strPageType) {

                        /*case "REVISIONS":			// Apply styling for page revision history
                            onElementRendered("article.show-content.user_content.enhanced header + *", function($content){
                                uobAddComponents("article.show-content.user_content.enhanced");
                            });

                            $("#content").on("click", "button.revision-details", function() {
                                setTimeout(function() {
                                    onElementRendered("article.show-content.user_content.enhanced", function($content){
                                        uobAddComponents("article.show-content.user_content.enhanced");
                                    });
                                }, 2500);
                            });

                            break;*/

                        /*case "SYLLABUS":			// Apply styling when syllabus is updated
                            $("#content").on("click", "button.btn-primary", function() {
                                setTimeout(function() {
                                    onElementRendered("#course_syllabus.user_content.enhanced", function($content){
                                        uobAddComponents("#course_syllabus.user_content.enhanced");
                                    });
                                }, 2500);
                            });

                            break;*/

                        /*case "QUIZZES-EDIT":		// Apply styling when "Questions" tab is selected in quiz editor
                            $("#quiz_tabs").on("tabsactivate", function(event, ui) {
                                if (ui.newTab.parent().parent().hasClass("uob-tabs")) { return(true); }

                                onElementRendered("div.question_text.user_content.enhanced", function(){
                                    uobAddComponents("div.question_text.user_content.enhanced");
                                });

                                return(true);
                            });

                            break;*/

                        case "PAGES":				// Apply styling when pages are published and unpublished
                            $("#content").on("mouseup", ".publish-button", function(){
                                $("div.user_content.enhanced, div.show-content.enhanced").removeClass("enhanced");

                                onElementRendered("div.user_content.enhanced, div.show-content.enhanced", function($content){
                                    uobAddComponents("div.user_content.enhanced, div.show-content.enhanced")
                                });
                            });

                            break;

                        /*case "DISCUSSION-TOPICS":	// Apply styling when searching in discussion topics
                            var MutationObserver = MutationObserver || window.MutationObserver || window.WebKitMutationObserver;

                            if (MutationObserver) {
                                var observer = new MutationObserver(function(mutations, observer) {
                                    observer.takeRecords();
                                    uobAddComponents("#filterResults");
                                    observer.takeRecords();
                                });

                                observer.observe(document.getElementById("filterResults"), {
                                    childList: true,
                                    subtree: true
                                });
                            }

                            $("#content").on("mouseup", ".ui-menu-item", function(){
                                if ($(this).find("a[data-event='edit']").length == 1) {
                                    var $node = $(this).parent().closest("li").find("div.message.user_content.enhanced");
                                    $node.removeClass("uob-components-loaded");
                                }

                                return true;
                            });

                            break;*/

                    }

                    // Apply styling when CEPLER data page is loaded
                    /*onPage(/^\/courses\/.*\/pages\/uob-cepler/, function() {
                        onElementRendered("#content p", function(){
                            $("#content p").hide();
                        });
                    });*/

                });


                // ================================================================================
                // Enable UoB component functions when tinyMCE editor is available.
                // --------------------------------------------------------------------------------

                onTinyMCE(function() {

                    // Initialise global flags.
                    var bClickEventsInitialised = false;

                    // Prepare list of UoB component's table selectors.
                    var aTableSelectors = [];
                    $.each(aTableStyles, function(index, value) { if (index > 0) aTableSelectors.push(".mce-item-table.uob-" + value.class); });
                    var strTableSelectors = aTableSelectors.join(", ");
                    aTableSelectors = undefined;


                    // Function to initialise new editors.
                    function initNewEditors() {
                        if(!bClickEventsInitialised) {
                            // Trap clicks on table menu button
                            $(top.document.body).on("click", "div[aria-label='Table']", function(e) {
                                // Initialise editor menu
                                initEditorMenu();

                                // Identify current editor and ensure that it has the focus
                                var uobTinyMCE = getTinyMCE();
                                var ed = uobTinyMCE.activeEditor;
                                var edID = uobTinyMCE.activeEditor.id;
                                var currentTable = uobTinyMCE.activeEditor.dom.getParent(ed.selection.getNode(), "table");

                                // Set visibility of UoB components' menu option
                                var iMenuID = $(this).attr("uobMenuID");

                                if (currentTable == null) {
                                    //$("#uobMenu" + iMenuID).addClass("mce-disabled").attr("aria-disabled", "true");
                                    $("#uobMenu").addClass("mce-disabled").attr("aria-disabled", "true");
                                } else {
                                    //$("#uobMenu" + iMenuID).removeClass("mce-disabled").attr("aria-disabled", "false");
                                    $("#uobMenu").removeClass("mce-disabled").attr("aria-disabled", "false");
                                }
                            });

                            // Trap clicks on UoB component menu item
                            $(top.document.body).on("click", "div.uob-menu-class[uob-menu-id]", function(e) {
                                displayTableDialog();
                                return true;
                            });

                            bClickEventsInitialised = true;
                        }

                        var iNumInitialised = 0;

                        setTimeout(function() {
                            var uobTinyMCE = getTinyMCE();

                            if (uobTinyMCE) {
                                $.each(uobTinyMCE.editors, function(index, ed) {
                                    if (ed.dom.doc.body.uobInitialised != true) {
                                        // Set styles for UoB Component tables
                                        uobSetDocumentStyle(ed.dom.doc, strTableSelectors, "border: 1px solid #ad393a;");

                                        // Set initialised flag
                                        ed.dom.doc.body.uobInitialised = true;
                                        iNumInitialised++;
                                    }
                                });
                            }
                        }, 500);

                        return(iNumInitialised);
                    }


                    // Initialise UoB Component menu option (single menu is shared between editors)
                    function initEditorMenu() {
                        var $menu = $("span.mce-text:contains('Delete table')").parent().parent().filter(function(index) {
                            return $(this).has("div[uob-menu-id]").length === 0;
                        });

                        $menu.find(".mce-text:contains('Delete table')").parent()
                        .after('<div id="uobMenu" uob-menu-id="true" class="uob-menu-class mce-menu-item mce-menu-item-normal mce-stack-layout-item" tabindex="-1" role="menuitem" aria-disabled="false"><i class="mce-ico mce-i-none"></i>&nbsp;<span class="mce-text">UoB Component</span></div>')
                        .after('<div class="mce-menu-item mce-menu-item-sep mce-menu-item-normal mce-stack-layout-item"></div>');

                        return(true);
                    }


                    // Initialise editor for pages.
                    onPage(/\/courses\/\d+\/pages\/[a-zA-Z0-9-]+\/edit$/, function() {
                        onTinyMCEEditor(function() {
                            initNewEditors();
                        });
                    });

                    // Initialise editor for new pages.
                    onPage(/\/courses\/\d+\/pages$/, function() {
                        onElementRendered(".new_page", function() {
                            $(top.document.body).on("click", ".new_page", function(e) {
                                initNewEditors();
                            });
                        });
                    });

                    // Initialise editor for syllabus.
                    /*onPage(/\/courses\/\d+/, function() {
                        $(".edit_syllabus_link").on("click", function(e) {
                            initNewEditors();
                        });
                    });*/

                    // Initialise editor for quiz edit.
                    /*onPage(/\/courses\/\d+\/quizzes\/\d+\/edit$/, function() {
                        onTinyMCEEditor(function() {
                            initNewEditors();
                        });

                        $(".edit_question_link").on("click", function(e) {
                            initNewEditors();
                        });
                    });*/


                    // Initialise editor for assignments.
                    /*onPage(/\/courses\/\d+\/assignments\/new$/, function() {
                        onTinyMCEEditor(function() {
                            initNewEditors();
                        });
                    });*/

                    /*onPage(/\/courses\/\d+\/assignments\/\d+\/edit/, function() {
                        onTinyMCEEditor(function() {
                            initNewEditors();
                        });
                    });*/


                    // Re-render UoB components for discussions/announcements and course syllabus.
                    /*tinyMCE.on("RemoveEditor", function(e) {

                        onPage(/^\/(courses|groups)\/.*discussion_topics/, function() {
                            setTimeout(function() {
                                onElementRendered("div.message.user_content.enhanced:not(.uob-components-loaded)", function() {
                                    uobAddComponents("div.message.user_content.enhanced:not(.uob-components-loaded)");
                                });
                            }, 2500);
                        });

                        onPage(/^\/courses\/.*\/assignments\/syllabus$/, function() {
                            $("#course_syllabus").removeClass("enhanced");

                            onElementRemoved("#uob-components-loaded", function() {
                                onElementRendered("#course_syllabus.user_content.enhanced, #course_syllabus.show-content.enhanced", function() {
                                    uobAddComponents("#course_syllabus");
                                });
                            });
                        });

                    });

                    // Re-render UoB components for quizzes.
                    onPage(/^\/courses\/.*\/quizzes\/.*\/edit$/, function() {
                        $("#questions").on("click", "button.submit_button.btn-primary", function() {
                            setTimeout(uobAddComponents, 2500, "#questions .text");
                        });
                    });*/

                });









                // ================================================================================
                // --------------------------------------------------------------------------------

                // ================================================================================
                // UoB table editor dialog
                // ================================================================================

                function displayTableDialog() {

                    // Set curent editor's focus and find selected table
                    var uobTinyMCE = getTinyMCE();
                    if (uobTinyMCE == null) { return(false) };
                    var ed = uobTinyMCE.activeEditor;
                    var edID = uobTinyMCE.activeEditor.id;
                    var currentTable = ed.dom.getParent(ed.selection.getNode(), "table");
                    uobTinyMCE.activeEditor.focus(false);

                    // Exit function if no table is selected or no editor found.
                    if (!currentTable || !ed) return;

                    // Get UoB component class for selected table
                    var possibleClasses = [];
                    $.each(aTableStyles, function(index, value) { possibleClasses.push(value.class); });

                    var currentClass = possibleClasses[0]; // "borderless"

                    $.each(aTableStyles, function(index, value) {
                        if ($(currentTable).hasClass("uob-" + value.class)) {
                            currentClass = value.class;
                            return false;
                        }
                    });

                    // Build listbox options
                    var bSU = (ENV.current_user_id.search(/^(991|548|1183|3236|6048|3963)$/) == 0);
                    var bCal = location.pathname.match(/\/(courses|users)\/.*\/calendar_events/);
                    var lbOptions = [];

                    for (var i = 0; i < aTableStyles.length; i++) {
                        if (aTableStyles[i].category == 0 || (!bCal && (aTableStyles[i].category == 1)) || bSU) {
                            var rec = {};
                            rec.text = aTableStyles[i].group + " - " + aTableStyles[i].label;
                            rec.value = aTableStyles[i].class;
                            lbOptions.push(rec);
                        }
                    }

                    // Open dialog
                    ed.windowManager.open({
                        title: 'UoB Component',
                        width: 380,
                        height: 200,
                        style: 'background-color: #fffff0;',
                        body: [{
                            type: 'label',
                            name: 'uobComponentIntroduction',
                            multiline: true,
                            style: 'height: 110px;',
                            close_previous: true,
                            text: "",
                            onPostRender : function() {
                                this.getEl().innerHTML = "UoB components are page elements defined by<br/>" +
                                "tables. For example, if you enter some text in a<br/>" +
                                "1 x 1 table and apply the 'Box - Tip' component<br/>" +
                                "type, the text will be displayed in a 'tip' box<br/>" +
                                "when the page is saved. Please see the Canvas<br/>" +
                                "Gallery for further information.";
                            }
                        },
                        {
                            type: 'listbox',
                            name: 'uobComponentType',
                            label: 'Component type:',
                            values: lbOptions,
                            value: currentClass
                        }],
                        onsubmit: function(v) {
                            var newClass = v.data.uobComponentType;
                            $(currentTable).removeClass("uob-" + possibleClasses.join(" uob-"));
                            $(currentTable).addClass("uob-" + newClass);

                            $(currentTable).attr("name", "UoB " + newClass + " table");
                        }
                    }, {
                        uobClass: currentClass,
                        currentTable: currentTable
                    });

                }


                // ================================================================================
                // UoB Sortable table - based on script from http://www.webtoolkit.info/
                // ================================================================================

                function SortableTable(tableEl) {

                    this.tbody = tableEl.getElementsByTagName('tbody');
                    this.thead = tableEl.getElementsByTagName('thead');
                    this.tfoot = tableEl.getElementsByTagName('tfoot');

                    this.getInnerText = function (el) {
                        if (typeof(el.textContent) != 'undefined') return el.textContent;
                        if (typeof(el.innerText) != 'undefined') return el.innerText;
                        if (typeof(el.innerHTML) == 'string') return el.innerHTML.replace(/<[^<>]+>/g,'');
                    }

                    this.getParent = function (el, pTagName) {
                        if (el == null) return null;
                        else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase())
                            return el;
                        else
                            return this.getParent(el.parentNode, pTagName);
                    }

                    this.sort = function (cell) {

                        var column = cell.cellIndex;
                        var itm = this.getInnerText(this.tbody[0].rows[0].cells[column]);
                        var sortfn = this.sortCaseInsensitive;

                        // By default, te format to be used for the sort is based on the content in the first row.
                        if (itm.match(/\d\d\/\d\d\/\d\d\d\d/)) sortfn = this.sortDate; // date format dd/mm/yyyy
                        if (itm.match(/\d\d\/\d\d\/\d\d\d\d.\d\d\:\d\d/)) sortfn = this.sortDateTime; // date-time format dd/mm/yyyy hh:mm
                        if (itm.replace(/^\s+|\s+$/g,"").match(/^[\d\.]+$/)) sortfn = this.sortNumeric;

                        // Use column header's class to determine the format to be used for the sort.
                        var columnHeadClass = this.thead[0].rows[0].cells[column].className;
                        if (columnHeadClass.match(/sortText/g)) sortfn = this.sortCaseInsensitive;	// Default is string format
                        if (columnHeadClass.match(/sortNumber/g)) sortfn = this.sortNumeric;		// numeric format
                        if (columnHeadClass.match(/sortDate/g)) sortfn = this.sortDate;				// date format dd/mm/yyyy
                        if (columnHeadClass.match(/sortDateTime/g)) sortfn = this.sortDateTime;		// date-time format dd/mm/yyyy hh:mm
                        if (columnHeadClass.match(/sortNone/g)) sortfn = this.sortNone;				// maintain existing order

                        // Create array of data to be sorted.
                        var newRows = new Array();

                        for (var j = 0; j < this.tbody[0].rows.length; j++) {
                            var oRow = new Object();
                            oRow.content = this.tbody[0].rows[j];
                            oRow.index = j;
                            newRows[j] = oRow;
                        }

                        // Sort the data in assending order unless the same column was used for the previous sort, in which case reverse the sort order.
                        var lastSortColumnIndex = this.sortColumnIndex;
                        this.sortColumnIndex = column;

                        if (lastSortColumnIndex != this.sortColumnIndex)
                            newRows.sort(sortfn);
                        else
                            newRows.reverse();

                        // Overwright table body with the sorted data.
                        for (var i = 0; i < newRows.length; i++) {
                            this.tbody[0].appendChild(newRows[i].content);
                        }
                    }

                    this.sortCaseInsensitive = function(a,b) {
                        aa = thisObject.getInnerText(a.content.cells[thisObject.sortColumnIndex]).toLowerCase();
                        bb = thisObject.getInnerText(b.content.cells[thisObject.sortColumnIndex]).toLowerCase();
                        if (aa==bb) return a.index - b.index;
                        if (aa<bb) return -1;
                        return 1;
                    }

                    this.sortDate = function(a,b) {
                        aa = thisObject.getInnerText(a.content.cells[thisObject.sortColumnIndex]);
                        bb = thisObject.getInnerText(b.content.cells[thisObject.sortColumnIndex]);
                        date1 = aa.substr(6,4)+aa.substr(3,2)+aa.substr(0,2);
                        date2 = bb.substr(6,4)+bb.substr(3,2)+bb.substr(0,2);
                        if (date1==date2) return a.index - b.index;
                        if (date1<date2) return -1;
                        return 1;
                    }

                    this.sortDateTime = function(a,b) {
                        aa = thisObject.getInnerText(a.content.cells[thisObject.sortColumnIndex]);
                        bb = thisObject.getInnerText(b.content.cells[thisObject.sortColumnIndex]);
                        date1 = "x" + aa.substr(6,4)+aa.substr(3,2)+aa.substr(0,2)+aa.substr(11,2)+aa.substr(14,2);
                        date2 = "x" + bb.substr(6,4)+bb.substr(3,2)+bb.substr(0,2)+bb.substr(11,2)+bb.substr(14,2);
                        if (date1==date2) return a.index - b.index;
                        if (date1<date2) return -1;
                        return 1;
                    }

                    this.sortNumeric = function(a,b) {
                        aa = parseFloat(thisObject.getInnerText(a.content.cells[thisObject.sortColumnIndex]));
                        if (isNaN(aa)) aa = 0;
                        bb = parseFloat(thisObject.getInnerText(b.content.cells[thisObject.sortColumnIndex]));
                        if (isNaN(bb)) bb = 0;
                        if (aa==bb) return a.index - b.index;
                        return aa-bb;
                    }

                    this.sortNone = function(a,b) {
                        return 0;
                    }

                    // define variables
                    var thisObject = this;
                    var sortSection = this.thead;

                    // constructor actions
                    if (!(this.tbody && this.tbody[0].rows && this.tbody[0].rows.length > 0)) return;

                    if (sortSection && sortSection[0].rows && sortSection[0].rows.length > 0) {
                        var sortRow = sortSection[0].rows[0];
                    } else {
                        return;
                    }

                    for (var i = 0; i < sortRow.cells.length; i++) {
                        sortRow.cells[i].sTable = this;
                        sortRow.cells[i].onclick = function () {
                            this.sTable.sort(this);
                            return false;
                        }
                    }

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

                    // ================================================================================
                    // Previews
                    //
                    // This code will append preview buttons immediately after each file link in the
                    // content of a page. File links are identified by the instructure_file_link class.
                    // When clicked the first time, the preview button will call a function to complete
                    // the DOM changes, which are not possible before the DOM manipulation carried out
                    // within Canvas is complete. The new HTML for the preview button will be similar
                    // to the following:
                    //
                    // <a href="javascript:uobShowPreviewDocument(0)" title="Preview example.pdf" id="uobPreview0">
                    //     <img src="/images/preview.png" alt="Preview example.pdf">
                    // </a>
                    // --------------------------------------------------------------------------------

                    $content.find(".instructure_file_link_holder.link_holder").has("a").each(function(_idx, _item) {
                        // Initialise varibles
                        var $item = $(_item);
                        var $anchor = $(_item).find('a').filter(':first');
                        var strHref = $anchor.attr('href') || "";	// if href is not found, set strHref to an empty string.
                        var iScribd = $(_item).find('.instructure_scribd_file_holder').length || 0;

                        if (iScribd > 0) {
                            strHref = "";
                        }

                        if (strHref.length > 0) {
                            // Obtain ID of the file (index is 4 or 6 respectivelly for non-draft and draft modes)
                            var file_id = strHref.split('/')[strHref.indexOf("/courses") == 0 ? 4 : 6];

                            // Use Canvas API to obtain information about the file being linked.
                            $.get('/api/v1/files/' + file_id, function(_d) {

                                // Check that the file type is compatible with the Google viewer.
                                if ($.isPreviewable(_d['content-type'], 'google') === 1) {

                                    // Initialise variables
                                    var displayName = _d['display_name'];

                                    // Create anchor element for the link. Note, _idx is used to make each
                                    // link unique. The file_id cannot be used in case when the same file
                                    // link appears more than once on a page.
                                    var $a = $(document.createElement('a'))
                                        .attr('href', 'javascript:uobShowPreviewDocument(' + _idx + ')')
                                        .attr('title', 'Preview ' + displayName)
                                        .attr('id', 'uobPreview' + _idx)
                                        .attr('style', 'padding-left: 5px;')
                                        .data('href2', strHref);

                                    // Create preview icon for the link
                                    var $img = $(document.createElement('img'))
                                        .attr('src', 'https://s3.amazonaws.com/SSL_Assets/bham/images/preview.png')
                                        .attr('alt', 'Preview ' + displayName);

                                    // Combine the preview icon with the anchor and add them to the DOM.
                                    $a.append($img);
                                    $anchor.after($a);
                                    //$(_item).append($a);
                                }
                            });
                        }
                    });


                    // ================================================================================
                    // Create dummy divs and/or classes to register UoB components have been added.
                    // --------------------------------------------------------------------------------

                    // Body of all pages
                    if ($("#uob-components-loaded").length == 0) {
                        var $div = $(document.createElement('div')).attr('id', 'uob-components-loaded');
                        $("body").append($div);
                    }

                    // ================================================================================
                    // --------------------------------------------------------------------------------

                }

                // ================================================================================
                // CSS/JS/style loader functions
                // ================================================================================

                /*function uobEmbedStyleSheet(urlCSS) {
                    var oCSS = document.createElement("link");
                    oCSS.rel = "stylesheet";
                    oCSS.type = "text/css";
                    oCSS.href = urlCSS;
                    document.getElementsByTagName("head")[0].appendChild(oCSS);
                }*/


                function uobEmbedJavaScript(urlJS) {
                    var oJS = document.createElement("script");
                    oJS.type = "text/javascript";
                    oJS.async = false;
                    oJS.src = urlJS;
                    document.getElementsByTagName("head")[0].appendChild(oJS);
                }


                function uobSetDocumentStyle(doc, selector, declarations) {

                    var sheet = doc.createElement('style');
                    sheet.innerHTML = selector + " {" + declarations + "}";
                    doc.body.appendChild(sheet);
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


            });

            // ================================================================================
            // uobShowPreviewDocument
            //
            // This function will amend a preview link so that when it is clicked, it will
            // display documents using the Google viewer. This function will only be called
            // once for each preview link, the first time it is clicked. When amended, the link
            // is moved into the SPAN element with a "link_holder" class which should
            // immediately precede the link. The preview link is given a new href attribute,
            // the "scribd_file_preview_link" class and the click event will be triggered.
            // ================================================================================

            function uobShowPreviewDocument(iFileID) {
                // Initialise object variables to simplify the code. $target is the preview link
                // and $holder is the preceding or parent SPAN element (if it exists).
                var $target = $('#uobPreview' + iFileID);
                var $holder = $target.prev('span.link_holder');

                if ($holder.length == 0) {
                    $holder = $target.parent('span.link_holder');
                }

                // Check that preceding element is a SPAN with the "link_holder" class.
                if ($holder.length) {

                    // Move the anchor element into the preceeding span element
                    $holder.append($target);

                    // Replace href value, add the "scribd_file_preview_link" class and click.
                    $target
                        .attr('href', $target.data('href2'))
                        .addClass('scribd_file_preview_link')
                        .click();
                }
            }
            //END UoB
    });
        //});    
    //});
    
    
    /*************************************************************
     *
     * Inserting Canvas_Module-Tiles from here: https://github.com/msdlt/canvas-module-tiles/blob/master/canvas-module-tiles.js
     *
     *************************************************************/
    
    /* 
     * Add tiles at top of modules tool:
     * - Tiles are generated by calling the Canvas api, not by scraping the Modules page as before (should be more reliable as Canvas in upgraded)
     * - Added a drop-down arrow which gives you a quick link to the Module item (page, discussion, etc) - NOTE: not if table id="homePageTableTilesOnly"
     * - Tiles will show any images put into a specific folder in the Course’s Files (this defaults to looking for a ’tiles’ folder). If no folder or too few images for the number of Modules, colours are used instead
     * - If Modules page is the Home Page:
     *      - Modules further down the page gain a coloured border to help tie things together - this relied on DOM staying the same so more likely to break with Canvas updates
     *      - I’ve added a Top button to each module which scrolls you back up to the dashboard view
     * - Clicking the tile anywhere except the drop-down arrow scrolls you down the Modules page to the appropriate Module - NOTE: this is the ONLY behaviour if table id="homePageTableTilesOnly"
     */

    // TODO Essential - add icons for all itemTypes
    // TODO Essential - Change positioning of moduleTileList to below tile to prevent menu being hidden on RH tiles when shown in a Home Page
    // TODO Essential - deal with noOfColumnsPerRow other than 4 - newColumn.className
    // TODO Should - create multi-level menu with first level defined by Text headers in a Module and items below that forming the second level
    // TODO Could - show completion either on links or as e.g 10/12 - will have to reinstate msd_getSelfThenModules AND chcek that the user is a students and will therefore have completion data

    /* Configurable variables */
    var showOnModulesHomePage = 0;	//Should the module tiles be shown at the top of the Modules Home Page. 0 = No; 1 = Yes. Suggest defaulting to 0, so all courses using the Modules Home Page aren't immediately affected when this is applied to a subaccount.
    var noOfColumnsPerRow = 4;  //no of columns per row of tiles at top of Modules page - 1, 2, 3, 4, 6 or 12 - ONLY USE 4 for the moment
    var tileImagesFolderName = "tiles";
    /* first 9 are requested colors, rest are randomly selected from: https://www.ox.ac.uk/public-affairs/style-guide/digital-style-guide */
    //JHM 2018-20-16: Removed some that were too light, and reordered some that did not look good next to each other, but only up to the first 14 colours (3.5 lines)
    var moduleColours = [
        '#e8ab1e','#91b2c6','#517f96','#1c4f68',
        '#400b42','#293f11','#640D14','#b29295',
        '#002147','#cf7a30','#a79d96','#aab300',
        '#872434','#043946','#fb8113','#be0f34',
        '#a1c4d0','#122f53','#0f7361','#3277ae',
        '#44687d','#517fa4','#177770','#be0f34',
        '#d34836','#70a9d6','#69913b','#d62a2a',
        '#5f9baf','#09332b','#44687d','#721627',
        '#9eceeb','#330d14','#006599','#cf7a30',
        '#a79d96','#be0f34','#001c3d','#ac48bf',
        '#9c4700','#c7302b','#ebc4cb','#1daced'
    ];

    /* DOM elements to chcek for */
    var divCourseHomeContent = document.getElementById('course_home_content');  //is this Home
    var divContent = document.getElementById('content');
    var divContextModulesContainer = document.getElementById('context_modules_sortable_container');  //are we on the Modules page
    var tableHomePageTable = document.getElementById('homePageTable');  // id of table which will be replaced in Page on web when it is the Home Page
    var tableHomePageTableTilesOnly = document.getElementById('homePageTableTilesOnly');  // id of table which will be replaced in Page on web when it is the Home Page - no drop-dwn list of items

    var initCourseId = msd_getCourseId();  //which course are we in ONLY WORKS ON WEB

    var moduleNav;
    var tileImageUrls = [];

    /* Wait until DOM ready before loading tiles */
    function msd_domReady () {
        if(divCourseHomeContent && divContextModulesContainer && showOnModulesHomePage){
            //we're in the modules page as a home page
            //first delete any existing nav container
            var existingModuleNav = document.getElementById('module_nav');
            if(existingModuleNav) {
                existingModuleNav.parentNode.removeChild(existingModuleNav);
            }
            //create our nav container
            moduleNav = document.createElement("div");
            moduleNav.id = "module_nav";
            moduleNav.className = "ou-ModuleCard__box";
            moduleNav.innerHTML = '<a id="module_nav_anchor"></a>';
            divContent.insertBefore(moduleNav, divContent.childNodes[0]); 
            //now get modules from api
            if(initCourseId) {
                msd_getTileFolder(initCourseId);
            }
        } else if(divCourseHomeContent && (tableHomePageTable || tableHomePageTableTilesOnly)){
            //we're in in a home page which contains a table with id="homePageTable"
            //create our nav container
            moduleNav = document.createElement("div");
            moduleNav.id = "module_nav";
            moduleNav.className = "ou-ModuleCard__box";
            moduleNav.innerHTML = '<a id="module_nav_anchor"></a>';
            //replace table#homePageTable with our moduleNav
            var tableToReplace = tableHomePageTable || tableHomePageTableTilesOnly;
            tableToReplace.parentNode.replaceChild(moduleNav, tableToReplace);
            //check whether we have a initCourseId
            if(!initCourseId) {
                //get it from table data-course-id
                if(tableHomePageTable) {
                    initCourseId = parseInt(tableHomePageTable.getAttribute("data-course-id"));
                } else if (tableHomePageTableTilesOnly) {
                    initCourseId = parseInt(tableHomePageTableTilesOnly.getAttribute("data-course-id"));
                }
            }
            //now get modules from api
            if(initCourseId) {
                msd_getTileFolder(initCourseId);
            }
        } 
    }

    //Function to work out when the DOM is ready: https://stackoverflow.com/questions/1795089/how-can-i-detect-dom-ready-and-add-a-class-without-jquery/1795167#1795167
    // Mozilla, Opera, Webkit 
    if ( document.addEventListener ) {
        document.addEventListener( "DOMContentLoaded", function(){
            document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
            msd_domReady();
        }, false );
    // If IE event model is used
    } else if ( document.attachEvent ) {
        // ensure firing before onload
        document.attachEvent("onreadystatechange", function(){
            if ( document.readyState === "complete" ) {
                document.detachEvent( "onreadystatechange", arguments.callee );
                msd_domReady();
            }
        });
    }

    /*
     * Get self id - actually only needed to show completion
     */
    function msd_getSelfThenModules() {
        var csrfToken = msd_getCsrfToken();
        fetch('/api/v1/users/self',{
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Accept": "application/json",
                    "X-CSRF-Token": csrfToken
                }
            })
            .then(msd_status)
            .then(msd_json)
            .then(function(data) {
                console.log(data);
                msd_getTileFolder(initCourseId, data.id);
            })
            .catch(function(error) {
                console.log('getSelfId Request failed', error);
            }
        );
    }

    /*
     * Get tileImages for courseId
     */
    //function msd_getTileFolder(courseId, userId) {
    function msd_getTileFolder(courseId) {
        var csrfToken = msd_getCsrfToken();
        fetch('/api/v1/courses/' + courseId + '/folders',{
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Accept": "application/json",
                    "X-CSRF-Token": csrfToken
                }
            })
            .then(msd_status)
            .then(msd_json)
            .then(function(data) {
                console.log(data);  
                var imagesFolderId;
                data.forEach(function(folder){
                    if(folder.name==tileImagesFolderName){
                        imagesFolderId = folder.id;  
                    }
                });
                //msd_getTileImageUrls(courseId, userId, imagesFolderId);
                msd_getTileImageUrls(courseId, imagesFolderId);
            });
    }

    //function msd_getTileImageUrls(courseId, userId, imagesFolderId) {
    function msd_getTileImageUrls(courseId, imagesFolderId) {
        /* temporarily getting file ids here - longer-term, replace with callbacks */
        var csrfToken = msd_getCsrfToken();
        if(imagesFolderId) {
            fetch('/api/v1/folders/' + imagesFolderId + '/files',{
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        "Accept": "application/json",
                        "X-CSRF-Token": csrfToken
                    }
                })
                .then(msd_status)
                .then(msd_json)
                .then(function(data) {
                    console.log(data);
                    data.forEach(function(image){
                        tileImageUrls.push(image.url);
                    });
                    msd_getModules(courseId, tileImageUrls);
                    //msd_getModules(courseId, userId, tileImageUrls);
                });
        } else {
            msd_getModules(courseId);
        }
    }

    /*
     * Get modules for courseId
     */
    //function msd_getModules(courseId, userId, tileImageUrls) {
    function msd_getModules(courseId, tileImageUrls) {
        var csrfToken = msd_getCsrfToken();
        //fetch('/api/v1/courses/' + courseId + '/modules?include=items&student_id=' + userId,{
        //JHM 2018-10-26: Added &per_page=100, otherwise only returns the first 10
        fetch('/api/v1/courses/' + courseId + '/modules?include=items&per_page=100',{
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Accept": "application/json",
                    "X-CSRF-Token": csrfToken
                }
            })
            .then(msd_status)
            .then(msd_json)
            .then(function(data) {
                console.log(data);
                var newRow; //store parent row to append to between iterations
                //run through each module
                data.forEach(function(module, mindex){
                    //work out some properties
                    var moduleName = module.name;

                    //create row for card
                    if(mindex % noOfColumnsPerRow === 0) {
                        newRow = document.createElement("div");
                        newRow.className = "grid-row center-sm";
                        moduleNav.appendChild(newRow);	
                    }
                    var newColumn = document.createElement("div");

                    // TODO work out classes for noOfColumnsPerRow != 4
                    //create column wrapper
                    newColumn.className = "col-xs-12 col-sm-6 col-lg-3";
                    newRow.appendChild(newColumn);

                    //create module div
                    var moduleTile = document.createElement("div");
                    moduleTile.className = "ou-ModuleCard";
                    moduleTile.title = moduleName;

                    var moduleTileLink = document.createElement("a");
                    if(divContextModulesContainer) {
                        moduleTileLink.href ="#module_" + module.id;    
                    } else {
                        moduleTileLink.href = '/courses/' + courseId + '/modules/' + module.id;   
                    }


                    var moduleTileHeader = document.createElement("div");
                    moduleTileHeader.className="ou-ModuleCard__header_hero_short";
                    if(tileImageUrls && tileImageUrls.length > mindex) {
                        moduleTileHeader.style.backgroundImage = "url(" + tileImageUrls[mindex] + ")";    
                    } else {
                        moduleTileHeader.style.backgroundColor = moduleColours[mindex];
                    }

                    var moduleTileContent = document.createElement("div");
                    moduleTileContent.className = "ou-ModuleCard__header_content";

                    if(!tableHomePageTableTilesOnly) {
                        //don't add drop-down if TilesOnly
                        var moduleTileActions = document.createElement("div");
                        moduleTileActions.className = "ou-drop-down-arrow";
                        moduleTileActions.title = "Click for contents";

                        var moduleTileArrowButton = document.createElement("a");
                        moduleTileArrowButton.classList.add("al-trigger");
                        //moduleTileArrowButton.classList.add("btn");
                        //moduleTileArrowButton.classList.add("btn-small");
                        moduleTileArrowButton.href ="#";

                        var moduleTileArrowIcon = document.createElement("i");
                        moduleTileArrowIcon.className = "icon-mini-arrow-down";

                        moduleTileArrowButton.appendChild(moduleTileArrowIcon);

                        var moduleTileList = document.createElement("ul");
                        moduleTileList.id = "toolbar-" + module.id + "-0";
                        moduleTileList.className = "al-options";
                        moduleTileList.setAttribute("role", "menu");
                        moduleTileList.tabIndex = 0;
                        moduleTileList.setAttribute("aria-hidden",true);
                        moduleTileList.setAttribute("aria-expanded",false);
                        moduleTileList.setAttribute("aria-activedescendant","toolbar-" + module.id + "-1");

                        /* Now create drop-down menu */
                        module.items.forEach(function(item, iindex){
                            var itemTitle = item.title;
                            //var moduleId = item.module_id;
                            var itemId = item.id;
                            var itemType = item.type;
                            var iconType;
                            switch(itemType) {
                                case "Page":
                                    iconType = "icon-document";
                                    break;
                                case "File":
                                    iconType = "icon-paperclip";
                                    break;
                                case "Discussion":
                                    iconType = "icon-discussion";
                                    break;
                                case "Quiz":
                                    iconType = "icon-quiz";
                                    break;
                                case "Assignment":
                                    iconType = "icon-assignment";
                                    break;
                                case "ExternalUrl":
                                    iconType = "icon-link";
                                    break;
                                default:
                                    iconType = "icon-document";
                            }
                            var listItem = document.createElement('li');
                            listItem.className = 'ou-menu-item-wrapper';

                            var listItemDest = '/courses/' + courseId + '/modules/items/' + itemId;

                            var listItemLink = document.createElement("a");
                            listItemLink.className = iconType;
                            listItemLink.href = listItemDest;
                            listItemLink.text = itemTitle;
                            listItemLink.tabindex = -1;
                            listItemLink.setAttribute("role", "menuitem");
                            listItemLink.title = itemTitle;

                            listItem.appendChild(listItemLink);
                            moduleTileList.appendChild(listItem);

                        });

                        moduleTileActions.appendChild(moduleTileArrowButton);
                        moduleTileActions.appendChild(moduleTileList);
                    }

                    var moduleTileTitle = document.createElement("div");
                    moduleTileTitle.classList.add("ou-ModuleCard__header-title");
                    moduleTileTitle.classList.add("ellipsis");
                    if(tableHomePageTableTilesOnly) {
                        //only leave space for actions if we're adding them
                        moduleTileTitle.classList.add("no-actions");    
                    }
                    moduleTileTitle.title = moduleName;
                    moduleTileTitle.style.color = moduleColours[mindex];
                    moduleTileTitle.innerHTML = moduleName; 

                    if(!tableHomePageTableTilesOnly) {
                        //only add actions if required
                        moduleTileContent.appendChild(moduleTileActions);
                    }

                    moduleTileContent.appendChild(moduleTileTitle);

                    moduleTileLink.appendChild(moduleTileHeader);
                    moduleTileLink.appendChild(moduleTileContent);

                    moduleTile.appendChild(moduleTileLink);



                    newColumn.appendChild(moduleTile);

                    /* Following only if we are on the Modules page */
                    if(divContextModulesContainer) {
                        //now remove then add top buttons to each Canvas module to take back up to menu
                        var topButtons = document.querySelectorAll(".ou-top_button");
                        topButtons.forEach(function(topButton) {
                            topButton.parentNode.removeChild(topButton);
                        });

                        var canvasModuleHeaders = document.querySelectorAll(".ig-header");
                        canvasModuleHeaders.forEach(function(canvasModuleHeader) {
                            newTopButton = document.createElement("a");
                            newTopButton.className = "btn ou-top_button";
                            newTopButton.href = "#module_nav_anchor";
                            newTopButton.innerHTML = '<i class="icon-arrow-up"></i>Top';
                            canvasModuleHeader.appendChild(newTopButton);

                        });

                        //try and colour in each module
                        var canvasModuleDiv = document.getElementById('context_module_'+module.id);
                        canvasModuleDiv.style.borderLeftColor = moduleColours[mindex];
                        canvasModuleDiv.style.borderLeftWidth = '10px';
                        canvasModuleDiv.style.borderLeftStyle = 'solid';    
                    }
                });
            })
            .catch(function(error) {
                console.log('msd_getModules request failed', error);
            }
        );
    }

    /* Utility functions */
    /*
     * Function which returns a promise (and error if rejected) if response status is OK
     * @param {Object} response
     * @returns {Promise} either error or response
     */
    function msd_status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }
    /*
     * Function which returns json from response
     * @param {Object} response
     * @returns {string} json from response
     */
    function msd_json(response) {
        return response.json();
    }
    /*
     * Function which returns csrf_token from cookie see: https://community.canvaslms.com/thread/22500-mobile-javascript-development
     * @returns {string} csrf token
     */
    function msd_getCsrfToken() {
        var csrfRegex = new RegExp('^_csrf_token=(.*)$');
        var csrf;
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            var match = csrfRegex.exec(cookie);
            if (match) {
                csrf = decodeURIComponent(match[1]);
                break;
            }
        }
        return csrf;
    }

    /**
     * Function which gets find course id from wherever it is available - currently ONLY ON WEB
     * @returns {string} id of course
     */
    function msd_getCourseId() {
        var courseId = ENV.COURSE_ID || ENV.course_id;
        if(!courseId){
            var urlPartIncludingCourseId = window.location.href.split("courses/")[1]; 
            if(urlPartIncludingCourseId) {
                courseId = urlPartIncludingCourseId.split("/")[0];    
            }
        }
        return courseId;
    }

    /*
     * Function which inserts newNode after reeferenceNode From: https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib
     * @param {HTMLElement } newNode - the node to be inserted
     * @param {HTMLElement } referenceNode - the node after which newNode will be inserted
     */
    function msd_insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    
    
    /*************************************************************
     *
     * End Canvas_Module-Tiles 
     *
     *************************************************************/
    
    
})();