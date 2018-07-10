/*
 * JS to resize H5P in a frame
 */
/*var h5pScript = document.createElement('script');
h5pScript.setAttribute('charset', 'UTF-8');
h5pScript.setAttribute('src', 'https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js');
document.body.appendChild(h5pScript);*/

/* Global variables */
var initCourseId = ENV.COURSE_ID;
//used in Modules page
var moduleNav;
var divCourseHomeContent = document.getElementById('course_home_content');
var divContextModulesContainer = document.getElementById('context_modules_sortable_container');
//var divContextModulesTitle = document.querySelectorAll('.context-modules-title')[0];
var divContent = document.getElementById('content');
var moduleColours = ['#e8ab1e','#91b2c6','#517f96','#1c4f68','#400b42','#293f11','#640D14','#b29295','#002147'];
var delimiter = '.' //The character used to separate your module name and module description

//From: https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/* Trying plain JS so that it works in the app as well */
function domReady () {
	//populate progress bars
	showProgressBars();
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
		getSelfThenModules();
	} else if(divCourseHomeContent){
		//we're in a home page
		rewriteModuleLinks();
        getSelfThenModules(); //testing
	}
}

//Function to work out when the DOM is ready: https://stackoverflow.com/questions/1795089/how-can-i-detect-dom-ready-and-add-a-class-without-jquery/1795167#1795167
// Mozilla, Opera, Webkit 
if ( document.addEventListener ) {
	document.addEventListener( "DOMContentLoaded", function(){
		document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
		domReady();
	}, false );
// If IE event model is used
} else if ( document.attachEvent ) {
	// ensure firing before onload
	document.attachEvent("onreadystatechange", function(){
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", arguments.callee );
			domReady();
		}
	});
}

/*
 * Get self id
 */
function getSelfThenModules() {
	var csrfToken = getCsrfToken();
	fetch('/api/v1/users/self',{
			method: 'GET',
			credentials: 'include',
			headers: {
				"Accept": "application/json",
				"X-CSRF-Token": csrfToken
			}
		})
		.then(status)
		.then(json)
		.then(function(data) {
			getModules(initCourseId, data.id);
		})
		.catch(function(error) {
			console.log('getSelfId Request failed', error);
		}
	);
}

/*
 * Get modules for courseId
 */
function getModules(courseId, userId) {
	var csrfToken = getCsrfToken();
	fetch('/api/v1/courses/' + courseId + '/modules?include=items&student_id=' + userId,{
			method: 'GET',
			credentials: 'include',
			headers: {
				"Accept": "application/json",
				"X-CSRF-Token": csrfToken
			}
		})
		.then(status)
		.then(json)
		.then(function(data) {
            console.log(data);
			/*var newRow; //store parent row to append to between iterations
			//run through each module
			data.forEach(function(module, index){
				//work out some properties
				var moduleFullName = module.name;
				var moduleNameParts = moduleFullName.split(delimiter); 
				var moduleName = moduleNameParts[0];
				var moduleDescription = "&nbsp;"; //default to a non-breaking space
				if(moduleNameParts.length>1) {
					moduleDescription = moduleNameParts[1];  //only update moduleDescription if there's something after the separator
				}
				
				//create row for card
				if(index == 0 || index == 1 || index == 4 || index == 8) {
					newRow = document.createElement("div");
					newRow.className = "grid-row center-sm";
					moduleNav.appendChild(newRow);	
				}
				var newColumn = document.createElement("div");
				
				//create column wrapper
				if(index == 0 || index == 8) {
					newColumn.className = "col-xs-12";
				} else if (index > 0 && index < 4) {
					newColumn.className = "col-xs-12 col-md-4";
				} else if (index > 3 && index < 8) {
					newColumn.className = "col-xs-12 col-sm-6 col-lg-3";
				}
				newRow.appendChild(newColumn);
				
				//create module div
				var newModule = document.createElement("div");
				if(index == 0 || index == 8) {
					newModule.innerHTML = ''+
						'<div class="ou-ModuleCard" title="' + moduleName + '">'+
						'	<a href="#module_' + module.id + '">'+		
						'		<div class="ou-ModuleCard__header_hero_short" style="background-color:' + moduleColours[index] + ';" aria-hidden="true">'+
						'			<h2 class="ou-ModuleCard__header-title ellipsis">' + moduleName + '<span class="ou-ModuleCard__header-subtitle-short ellipsis"> ' + moduleDescription + '</span></h2>'+		
						'		</div>'+		
						'	</a>'+
						'</div>';
				} else {
					newModule.innerHTML = ''+
						'<div class="ou-ModuleCard" title="' + moduleName + '">'+
						'	<a href="#module_' + module.id + '">'+		
						'		<div class="ou-ModuleCard__header_hero" style="background-color:' + moduleColours[index] + ';" aria-hidden="true">'+
						'			<h2 class="ou-ModuleCard__header-title ellipsis">Mod<span class="visible-lg-inline">ule</span> ' + index + '</h2>'+	
						'			<div class="ou-ModuleCard__header-subtitle ellipsis">' + moduleDescription + '</div>'+
						'		</div>'+		
						'	</a>'+
						'</div>';
				}
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
				
				
			});*/
		})
		.catch(function(error) {
			console.log('getModules request failed', error);
		}
	);
}

/*
 * Function which replaces all <div id="module_x" class="ou-insert-progress-bar">y</div> with graphical progress bars
 * x = module number
 * y = % complete
 */
function showProgressBars() {
	//get all elements with classname ou-insert-progress-bar
	var progressBarPlaceholders = document.getElementsByClassName('ou-insert-progress-bar');
	Array.prototype.forEach.call(progressBarPlaceholders, function(progressBarPlaceholder) {
		var value = progressBarPlaceholder.innerHTML;
		var className = progressBarPlaceholder.id;
		//UC first letter
		var viewName = className.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			return letter.toUpperCase();
		});
		//replace underscore with space
		viewName = viewName.replace(/_/g, ' ');
		//create our new element
		var progressBarContainer = document.createElement("div");
		progressBarContainer.innerHTML = ''+
				'<h4 class="ou-space-before-progress-bar">Current position in ' + viewName + ':</h4>' +
				'<div class="ou-ProgressBar ' + className + '" style="width: 100%; height: 15px;" role="progressbar" aria-valuemax="100" aria-valuemin="0" aria-valuenow="'+ value +'">' +
				'	<div class="ou-ProgressBarBar" style="width: '+ value +'%;" title="'+ value +'%"></div>' +
				'</div>';
		//insert it after the placeholder using the function insertAfter
		insertAfter(progressBarContainer, progressBarPlaceholder);
		//now delete the placeholder
		progressBarPlaceholder.parentNode.removeChild(progressBarPlaceholder);
	});
}

function rewriteModuleLinks() {
	/* START rewriting links to go to Modules anchor */
	var moduleLinks = document.getElementsByTagName('a'), i;
    for (i in moduleLinks) {
        var cn = moduleLinks[i].className;
		var matchClass = "ou-ModuleLink";
        if(cn && cn.match(new RegExp("(^|\\s)" + matchClass + "(\\s|$)"))) {
			moduleLinks[i].onclick = function(event) {
				var destination = event.currentTarget.href;  //attached to the a, even if user clicked something inside the a
				var destinationParts = destination.split('/');
				j=0;
				while (destinationParts[j]!="modules"){
					j=j+1;
				}
				var moduleId = destinationParts[j + 1];
				window.location = '/courses/' + initCourseId + "/modules" + "#module_" + moduleId;
				return false;  //prevent default
			}
        }
    }
}

/* Utility functions */
/*
 * Function which returns a promise (and error if rejected) if response status is OK
 */
function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return Promise.resolve(response)
	} else {
		return Promise.reject(new Error(response.statusText))
	}
}
/*
 * Function which returns json from response
 */
function json(response) {
	return response.json()
}
/*
 * Function which returns csrf_token from cookie see: https://community.canvaslms.com/thread/22500-mobile-javascript-development
 */
function getCsrfToken() {
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