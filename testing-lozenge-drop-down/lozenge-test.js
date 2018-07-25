/* 
 * Testing script to add tiles at top of modules tool:
 * 1. click on body scrolls down the modules page
 * 2. click on menu allows you to select 'page'
 * 3. coud also show completion e.g 10/12??
 */

/* Global variables */
var initCourseId = ENV.COURSE_ID;
var noOfColumnsPerRow = 4;  //no of columns per row of tiles at top of Modules page - 1, 2, 3, 4, 6 or 12
//used in Modules page

var moduleNav;
var divCourseHomeContent = document.getElementById('course_home_content');
var divContextModulesContainer = document.getElementById('context_modules_sortable_container');
//var divContextModulesTitle = document.querySelectorAll('.context-modules-title')[0];
var divContent = document.getElementById('content');
var moduleColours = ['#e8ab1e','#91b2c6','#517f96','#1c4f68','#400b42','#293f11','#640D14','#b29295','#002147'];
var delimiter = '.' //The character used to separate your module name and module description

//From: https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib
function msd_insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/* Trying plain JS so that it works in the app as well */
function msd_domReady () {
	if(divCourseHomeContent && divContextModulesContainer){
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
		msd_getSelfThenModules();
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
 * Get self id
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
			msd_getModules(initCourseId, data.id);
		})
		.catch(function(error) {
			console.log('getSelfId Request failed', error);
		}
	);
}

/*
 * Get modules for courseId
 */
function msd_getModules(courseId, userId) {
	var csrfToken = msd_getCsrfToken();
	fetch('/api/v1/courses/' + courseId + '/modules?include=items&student_id=' + userId,{
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
			data.forEach(function(module, index){
				//work out some properties
				var moduleName = module.name;
				//var moduleNameParts = moduleFullName.split(delimiter); 
				//var moduleName = moduleNameParts[0];
				//var moduleDescription = "&nbsp;"; //default to a non-breaking space
				//if(moduleNameParts.length>1) {
				//	moduleDescription = moduleNameParts[1];  //only update moduleDescription if there's something after the separator
				//}
				
				//create row for card
				if(index % noOfColumnsPerRow === 0) {
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
				var newModule = document.createElement("div");
				newModule.innerHTML = ''+
                    '<div class="ou-ModuleCard" title="' + moduleName + '">'+
                    '	<a href="#module_' + module.id + '">'+		
                    '		<div class="ou-ModuleCard__header_hero_short" style="background-color:' + moduleColours[index] + ';" aria-hidden="true">'+
                    '			<h4 class="ou-ModuleCard__header-title ellipsis">' + moduleName + '</h4>'+		
                    '		</div>'+
                    '       <div class="ou-ModuleCard__content grid-row"><div class="ou-ModuleCard__info col-xs-9">Items: ' + module.items_count + '</div><div class="ou-drop-down-arrow col-xs-3"><i class="icon-mini-arrow-right"></i></div></div>'+
                    '	</a>'+
                    '</div>';
				
				newColumn.appendChild(newModule);
				
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
				canvasModuleDiv.style.borderLeftColor = moduleColours[index];
				canvasModuleDiv.style.borderLeftWidth = '10px';
				canvasModuleDiv.style.borderLeftStyle = 'solid';
				
				
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
 */
function msd_json(response) {
	return response.json()
}
/*
 * Function which returns csrf_token from cookie see: https://community.canvaslms.com/thread/22500-mobile-javascript-development
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