/**
 * Scripts to handle the pop ups associated with the navigation links.
 *
 * @author Timothy Flynn
 * @version May 7, 2013
 */

/********** PAGE SETUP **********/

$(document).ready(function()
{
	// Display background image
	$.backstretch("../img/background.jpg");

	// Display resume - converted with zamzar.com
	$("#resumeDiv").append("<img src='img/TimothyFlynnResume-042213.png' alt='' />");

	// Display YouTube videos
	$('.lazyYT').lazyYT();
	
	// Display map
	var map = L.map('map').setView([42.252156, -71.003295], 16);

	L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
		id: 'examples.map-9ijuk24y'
	}).addTo(map);

	L.marker([42.252156, -71.003295]).addTo(map)
		.bindPopup(
			'<b>ViaSat, Inc.</b>' +
			'<br />1250 Hancock Street 701-N' +
			'<br />Quincy, MA 02169'
	).openPopup();

	// Hide all popups so nothing jQuery has them loaded
	$(".popup").hide();
});

/********** GENERAL POP UPS **********/

var Status = { Hidden : 0, Visible : 1 };

var Nav = { Resume : 0, Projects : 1, Travel : 2, Music : 3, Contact : 4, NumNav : 5 };
var NavId = new Array("#popupResume", "#popupProjects", "#popupTravel", "#popupMusic", "#popupContact");
var NavStatus = new Array();
var NavScroll = new Array();
var NavSpeed = new Array(200, 200, 350, 350, "auto");
var NavInertia = new Array(950, 950, 500, 500, 950);

var handlingClick = false;

/**
 * Check if the naviagation link is valid.
 */
function isValidNav(nav)
{
	return ((nav >= 0) && (nav < Nav.NumNav));
}

/**
 * Display the pop up for the given navigation link.
 */
function loadPopup(nav)
{
	if (!isValidNav(nav) || (NavStatus[nav] == Status.Visible))
	{
		return;
	}

	txt = NavId[nav];
	NavStatus[nav] = Status.Visible;

	$(txt).fadeIn("slow", function()
	{
		handlingClick = false;
	});

	if (NavScroll[nav] == Status.Hidden)
	{
		NavScroll[nav] = Status.Visible;

		$(txt).mCustomScrollbar(
		{
			autoHideScrollbar: true,
			mouseWheelPixels: NavSpeed[nav],
			scrollInertia: NavInertia[nav],
			theme: "light-thin",
			advanced:
			{
				updateOnContentResize: true
			},
			callbacks:
			{
				whileScrolling: function()
				{
					if (nav == Nav.Travel)
					{
						updateTravelPopup();
					}
				}
			}
		});
	}
}

/**
 * Hide the pop up for the given navigation link.
 */
function disablePopup(nav)
{
	if (!isValidNav(nav) || (NavStatus[nav] == Status.Hidden))
	{
		return;
	}

	txt = NavId[nav];
		
	NavStatus[nav] = Status.Hidden;
	$(txt).fadeOut("slow", function()
	{
		handlingClick = false;
	});
}

/**
 * Hide all pop ups except for the (optionally) given navigation link.
 */
function disableAllPopups(except)
{
	for (var i = 0; i < Nav.NumNav; ++i)
	{
		if (i != except)
		{
			disablePopup(i);
		}
	}
}

/**
 * Handle a click on the given navigation link. Hide all other popups and
 * display this one.
 */
function handleClick(nav)
{
	if (handlingClick || !isValidNav(nav))
	{
		return;
	}

	var txt = NavId[nav];
	handlingClick = true;

	if (NavStatus[nav] == Status.Hidden)
	{
		$(txt).css(
		{
			"visibility" : "visible"
		});

		disableAllPopups(nav);
		loadPopup(nav);
	}
	else
	{
		disablePopup(nav);
	}
}

/**
 * Initialize the events associated with pop ups.
 */
$(document).ready(function()
{
	for (var i = 0; i < Nav.NumNav; ++i)
	{
		NavStatus.push(Status.Hidden);
		NavScroll.push(Status.Hidden);
	}

	// Key presses
	$(document).keyup(function(event) 
	{
		if (event.keyCode === 0x1B)
		{
			disableAllPopups();
		}
	});
	$('body').click(function(event)
	{
		if (event.target == $('body')[0])
		{
			disableAllPopups();
		}
	});

	// Resume
	$("#resume").click(function() 
	{
		handleClick(Nav.Resume);
	});
	$("#popupResumeClose").click(function() 
	{
		disablePopup(Nav.Resume);
	});
	
	// Projects
	$("#projects").click(function() 
	{
		handleClick(Nav.Projects);
	});
	$("#popupProjectsClose").click(function() 
	{
		disablePopup(Nav.Projects);
	});
	
	// Travel
	$("#travel").click(function() 
	{
		handleClick(Nav.Travel);
	});
	$("#popupTravelClose").click(function() 
	{
		disablePopup(Nav.Travel);
	});

	// Music
	$("#music").click(function()
	{
		handleClick(Nav.Music);
	});
	$("#popupMusicClose").click(function()
	{
		disablePopup(Nav.Music);
	});
	
	// Contact
	$("#contact").click(function() 
	{
		handleClick(Nav.Contact);
	});
	$("#popupContactClose").click(function() 
	{
		disablePopup(Nav.Contact);
	});
});

/********** TRAVEL POP UP **********/

var TravelStatus = { None : 0, Preview : 1, Enlarged : 2, Resizing : 3 };

var servicingRequest = false;
var currStatus = TravelStatus.None;
var currText = "";
var currPage = 1;
var currId = "";
var imageLimit;
var imageCount;
var maxPages;

function setTravelParams(lim, cnt)
{
	imageLimit = lim;
	imageCount = cnt;
	maxPages = Math.ceil(cnt / imageLimit);
}

function sendRequest()
{
	for (var i = ((currPage - 1) * imageLimit) + 1; (i <= (currPage * imageLimit)) && (i <= imageCount); ++i)
	{
		file = 'img/travel/';
		id = 'trav-' + i.toString();

		if (i < 10)
		{
			file += '00' + i.toString() + '.jpg';
		}
		else
		{
			file += '0' + i.toString() + '.jpg';
		}

		var res = '<div>';
		res += '<img src="' + file + '" class="image" id="' + id + '" data-loc="loc" alt="" />';
		res += '</div>';

		$('#travelDiv').append(res);
	}

	servicingRequest = false;
}

function updateTravelPopup()
{
	if (servicingRequest)
	{
		return;
	}

	if ((mcs.topPct > 80) && (currStatus == TravelStatus.Preview))
	{
		if (++currPage <= maxPages) 
		{
			servicingRequest = true;
			sendRequest();
		}
	}
}

$(document).ready(function()
{
	if (currStatus == TravelStatus.None)
	{
		currStatus = TravelStatus.Preview;
		sendRequest();
	}
});

$("#travelDiv").click(function(event)
{
	if (event.target.nodeName != 'IMG')
	{
		return;
	}

	if (currStatus == TravelStatus.Preview)
	{
		currStatus = TravelStatus.Resizing;

		currText = $("#travelDiv").html();
		currId = "#" + event.target.id;

		$("#travelDiv").fadeOut(function()
		{
			var html = "<div>";
			html += "<h3>" + $(currId).data("loc") + "</h3>";
			html += "<img src='" + event.target.src + "' class='image enlarge' alt ='' />";
			html += "</div>";
	
			$("#travelDiv").html(html).fadeIn(function()
			{
				currStatus = TravelStatus.Enlarged;
			});
		});
	}
	else if (currStatus == TravelStatus.Enlarged)
	{
		currStatus = TravelStatus.Resizing;

		$("#travelDiv").fadeOut(function()
		{
			$("#travelDiv").html(currText).fadeIn(function()
			{
				$(NavId[Nav.Travel]).mCustomScrollbar("scrollTo", currId);
				currStatus = TravelStatus.Preview;
			});
		});
	}
});
