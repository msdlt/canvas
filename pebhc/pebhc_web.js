/** Development notes

...Thinking maybe that we look for ENV.COURSE_ID and, if there, we know that we're in a course and so can just wrap div#content and place menu on right of that...
BUT maybe hide on index pages for modules, announcements, discssions, etc where we already have a RH bar...

All Canvas web pages seem to contain:

div#content
div#content-wrapper

Inside these: (child of div#content but maybe with other siblings (in brackets is ENV variable that uniquely tells us we are in the page type) foolowed by how e might get identifier for this page to match up with/modules api feed)

Home: 			div#course_home_content											n/a
Discussions: 	div.discussion-collections 			(ENV.openTopics)			n/a
Discussion: 	div#discussion_container 			(ENV.DISCUSSION) 			ENV.DISCUSSION.TOPIC.ID/Module | Item | content_id
Announcements:	div.announcements-v2__wrapper 		(ENV.ANNOUNCEMENTS_LOCKED)	n/a
Announcement:	div#discussion_container 			(ENV.DISCUSSION)			Don't seem to be able to add announcement to module so won't appear in modules api
Assignments: 	div data-view="assignmentGroups"	(ENV.HAS_ASSIGNMENTS)		NOTE: Assignments doesn't expose ENV.COURSE_ID so menu won't be shown!
Assignment:		div#assignment_show					(ENV.ASSIGNMENT_ID)			ENV.ASSIGNMENT_ID/Module | Item | content_id
Grades:																			NOTE: Grades doesn't expose ENV.COURSE_ID so menu won't be shown!
People:																			NOTE: People doesn't expose ENV.COURSE_ID so menu won't be shown!
Pages: 																			Actually quite useful to have it in Pages!
Files: 			div.ef-main							(ENV.FILES_CONTEXTS)		n/a
Syllabus:																		NOTE: Syllabus doesn't expose ENV.COURSE_ID so menu won't be shown!
Quizzes:																		Actually quite useful to have it in Quizzes!
Quiz:			div#quiz_show						(ENV.QUIZ)					ENV.QUIZ.id/Module | Item | content_id
Modules:		div#context_modules					(ENV.MODULE_FILE_DETAILS)	n/a
Conferences: 																	NOTE: Conferences doesn't expose ENV.COURSE_ID so menu won't be shown!
Collaborations: 																NOTE: Collaborations doesn't expose ENV.COURSE_ID so menu won't be shown!
Chat: 																			NOTE: Chat doesn't expose ENV.COURSE_ID (although does have ENV.course_id) so menu won't be shown!
Attendance: 																	NOTE: Attendance doesn't expose ENV.COURSE_ID so menu won't be shown!
Settings: 		div#course_details_tabs				(ENV.SETTINGS)				n/a

Things which can be added to a module and may therefore appear in Modules api feed:

Assignment
Quiz
File
Content Page
Discussion
Text header
External URL
External tool
*/


/* Global variables */
var courseId = ENV.COURSE_ID;// || ENV.course_id;
//used in Modules page
var moduleNav;

var divCourseHomeContent = document.getElementById('course_home_content');
var divPageTitle = document.querySelectorAll('.page-title')[0];

var dontShowMenuOnTheseElementIds=new Array(
    'course_home_content', 
    'context_modules',
    'course_details_tabs'
    );
var dontShowMenuOnTheseElementClasses=new Array(
    'discussion-collections', 
    'announcements-v2__wrapper',
    'ef-main'
    );



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
	if(divContent && courseId && courseId==2777 && elementsWithTheseIdsDontExist(dontShowMenuOnTheseElementIds) && elementsWithTheseClassesDontExist(dontShowMenuOnTheseElementClasses)){
		//console.log("I'm in a course");
		getSelfThenModulesForPage();
	} else if(divCourseHomeContent){
		//we're in a home page
		rewriteModuleLinks();
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

/**
 * Get self id
 */
function getSelfThenModulesForPage() {
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
			getModulesForPage(courseId, data.id);
		})
		.catch(function(error) {
			console.log('getSelfId Request failed', error);
		}
	);
}

function elementsWithTheseIdsDontExist(ids) {
    for(var i = 0; i < ids.length; i++) {
        console.log(ids[i]);
        console.log(document.getElementById(ids[i]));
        if(document.getElementById(ids[i])!==null){
            return false; //it does exist
        }
    }
    return true;
}

function elementsWithTheseClassesDontExist(classes) {
   for(var i = 0; i < classes.length; i++) {
        console.log(classes[i]);
        console.log(document.querySelectorAll(classes[i])[0]);
        if(document.querySelectorAll(classes[i]).length!==0){
            return false; //it does exist
        }
    }
    return true;
}

/*
 * Get modules and items for courseId
 * @param {number} courseId - ID of course
 * @param {number} userId - ID of user - used to return progress info.
 * TODO make userId optional
 */
function getModulesForPage(courseId, userId) {
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
			
			/* Create page structure */
			//get Content div
			var divContent = document.getElementById('content');
			
			//let's start by creating a content-wrapper and moving divContent into it
			//TODO going to have to put div names/classes into an array to move
			var divContentWrapper = document.createElement('div');
			divContentWrapper.className = "ou-content-wrapper grid-row";
			
			divContent.classList.add("col-xs-12");
			divContent.classList.add("col-sm-9");
			divContent.classList.add("col-lg-10");
			divContent.classList.add("col-xl-11");
			wrap(divContent, divContentWrapper);
			
			//now add 
			var divMenuWrapper = document.createElement('div');
			divMenuWrapper.classList.add("col-xs-12");
			divMenuWrapper.classList.add("col-sm-3");
			divMenuWrapper.classList.add("col-lg-2");
			divMenuWrapper.classList.add("col-xl-1");
			divContentWrapper.appendChild(divMenuWrapper); //add module to content
			
			//adding click event listener to divMenuWrapper to ensure it is there 
			//menu items themselves won't exist yet
			divMenuWrapper.addEventListener('click',function(e){
				if(e.target && (e.target.className.match(/\bou-menu-module-title\b/) || e.target.className.match(/\bou-menu-module-arrow\b/))){
					//click on either div with class=ou-module-title or <i> class=ou-module-arrow 
					var moduleId = e.target.getAttribute('data-module-id');
					var targetItemsId = 'ouModuleItemsWrappper_' + moduleId;
					var targetItemsElement = document.getElementById(targetItemsId);
					targetItemsElement.classList.toggle('is-visible');
					var targetArrowId = 'ouModuleTitleArrow_' + moduleId;
					var targetArrowElement = document.getElementById(targetArrowId);
					if(targetArrowElement.classList.contains('icon-mini-arrow-right')) {
						targetArrowElement.classList.remove('icon-mini-arrow-right')
						targetArrowElement.classList.add('icon-mini-arrow-down');
					} else {
						targetArrowElement.classList.remove('icon-mini-arrow-down')
						targetArrowElement.classList.add('icon-mini-arrow-right');
					}
				}
			})
			
			//run through each module
			data.forEach(function(module, index){
				//work out some properties
				var moduleName = module.name;
				var moduleId = module.id;
								
				//create module div
				var newModule = document.createElement('div');
				newModule.className = 'ou-module-wrapper';
				newModule.innerHTML = '<div class="ou-menu-module-title" title="' + moduleName + '" data-module-id="' + moduleId + '"><i id="ouModuleTitleArrow_' + moduleId + '" class="icon-mini-arrow-right ou-menu-module-arrow" data-module-id="' + moduleId + '"></i> ' + moduleName + '</div>';
				var moduleItemsWrapper = document.createElement('div');
				moduleItemsWrapper.className = 'toggle-content';
				moduleItemsWrapper.id = 'ouModuleItemsWrappper_'+moduleId;
				newModule.appendChild(moduleItemsWrapper); //add module to content
				
				module.items.forEach(function(item, index){
					var itemTitle = item.title;
					var moduleId = item.module_id;
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
						default:
							iconType = "icon-document";
					}
					var newItem = document.createElement('div');
					newItem.className = 'ou-menu-item-wrapper';
					var itemLink = 'https://universityofoxford.instructure.com/courses/' + courseId + '/modules/items/' + itemId;  //construct hopefully app-compatible URL
					newItem.innerHTML = '<a class="'+iconType+'" title="'+itemTitle+'" href="'+itemLink+'">'+itemTitle+'</a>';
					moduleItemsWrapper.appendChild(newItem); //add item to module
					
					/* Check if this is the live item and leave menu open if it is */
					if(ENV.WIKI_PAGE){
						//we're in a wiki page
						if(item.page_url){
							//we're processing a wiki page
							if(ENV.WIKI_PAGE.url==item.page_url) {
								moduleItemsWrapper.classList.add('is-visible');
								newItem.classList.add('ou-menu-item-active');
							}
						}
					}
					
					
				});
				
				divMenuWrapper.appendChild(newModule); //add module to content
			
			});
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

/*
 * Rewriting links in the format https://oxforduniversity.instructure.com/courses/[courseId]/modules/[moduleId]/items/first
 * which works in the app by taking users to the Modules page and opens the appropriate Module
 * However, in the web app, we need to rewrite this to go to the appropriate anchor on the Modules page
 */
function rewriteModuleLinks() {
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
				window.location = "https://oxforduniversity.instructure.com/courses/" + courseId + "/modules" + "#module_" + moduleId;
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

/**
 * Function which wraps one element in another div - see: https://stackoverflow.com/questions/6838104/pure-javascript-method-to-wrap-content-in-a-di
 * @param {element} toWrap - element to be wrapped
 * @param {element} [wrapper] - element to wrap it in - new div if not provided
 */
var wrap = function (toWrap, wrapper) {
    wrapper = wrapper || document.createElement('div');
    toWrap.parentNode.appendChild(wrapper);
    return wrapper.appendChild(toWrap);
};