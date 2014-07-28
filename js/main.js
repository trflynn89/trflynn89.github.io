/**
 * Scripts to handle the pop ups associated with the navigation links.
 *
 * @author Timothy Flynn
 * @version July 28, 2014
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
		id: 'trflynn89.j35n6m41'
	}).addTo(map);

	L.marker([42.252156, -71.003295]).addTo(map)
		.bindPopup(
			'<b>ViaSat, Inc.</b>' +
			'<br />1250 Hancock Street 701-N' +
			'<br />Quincy, MA 02169'
	).openPopup();

	// Hide all popups so jQuery has them loaded
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

	// Mouse click
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

var currStatus = TravelStatus.None;
var currText = "";
var currId = "";

function loadTravelImages()
{
	var html = '';
	
	html += '<div><img src="img/travel/001.jpg" class="image" id="trav-1" data-loc="Great Barrier Reef, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/002.jpg" class="image" id="trav-2" data-loc="Paradise, New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/003.jpg" class="image" id="trav-3" data-loc="Oahu, New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/004.jpg" class="image" id="trav-4" data-loc="Queenstown, New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/005.jpg" class="image" id="trav-5" data-loc="St. Kilda Beach - Melbourne, Victoria, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/006.jpg" class="image" id="trav-6" data-loc="Melbourne Zoo - Melbourne, Victoria, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/007.jpg" class="image" id="trav-7" data-loc="Melbourne Zoo - Melbourne, Victoria, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/008.jpg" class="image" id="trav-8" data-loc="The Twelve Apostles - Victoria, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/009.jpg" class="image" id="trav-9" data-loc="Grampians National Park - Victoria, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/010.jpg" class="image" id="trav-10" data-loc="Grampians National Park - Victoria, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/011.jpg" class="image" id="trav-11" data-loc="Melbourne Cricket Ground - Melbourne, Victoria, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/012.jpg" class="image" id="trav-12" data-loc="Werribee Open Range Zoo - Werribee, Victoria, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/013.jpg" class="image" id="trav-13" data-loc="Healesville Sanctuary - Healesville, Victoria, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/014.jpg" class="image" id="trav-14" data-loc="Healesville Sanctuary - Healesville, Victoria, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/015.jpg" class="image" id="trav-15" data-loc="Blue Mountains - New South Wales, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/016.jpg" class="image" id="trav-16" data-loc="Sydney Opera House - Sydney, New South Wales, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/017.jpg" class="image" id="trav-17" data-loc="Sydney Opera House - Sydney, New South Wales, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/018.jpg" class="image" id="trav-18" data-loc="Harbour Bridge - Sydney, New South Wales, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/019.jpg" class="image" id="trav-19" data-loc="Flynn Reef - Great Barrier Reef, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/020.jpg" class="image" id="trav-20" data-loc="Flynn Reef - Great Barrier Reef, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/021.jpg" class="image" id="trav-21" data-loc="Cook Strait - New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/022.jpg" class="image" id="trav-22" data-loc="New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/023.jpg" class="image" id="trav-23" data-loc="Zirakzigil - New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/024.jpg" class="image" id="trav-24" data-loc="Takaro Road, New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/025.jpg" class="image" id="trav-25" data-loc="Milford Sound, New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/026.jpg" class="image" id="trav-26" data-loc="Milford Sound, New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/027.jpg" class="image" id="trav-27" data-loc="Milford Sound, New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/028.jpg" class="image" id="trav-28" data-loc="New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/029.jpg" class="image" id="trav-29" data-loc="New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/030.jpg" class="image" id="trav-30" data-loc="New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/031.jpg" class="image" id="trav-31" data-loc="New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/032.jpg" class="image" id="trav-32" data-loc="New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/033.jpg" class="image" id="trav-33" data-loc="New Zealand" alt = "" /></div>'
	html += '<div><img src="img/travel/034.jpg" class="image" id="trav-34" data-loc="Pawtuckaway State Park - New Hampshire, US" alt = "" /></div>'
	html += '<div><img src="img/travel/035.jpg" class="image" id="trav-35" data-loc="Pawtuckaway State Park - New Hampshire, US" alt = "" /></div>'
	html += '<div><img src="img/travel/036.jpg" class="image" id="trav-36" data-loc="Townsville, Queensland, Australia" alt = "" /></div>'
	html += '<div><img src="img/travel/037.jpg" class="image" id="trav-37" data-loc="Cozumel, Mexico" alt = "" /></div>'

	$('#travelDiv').append(html);
}

$(document).ready(function()
{
	if (currStatus == TravelStatus.None)
	{
		currStatus = TravelStatus.Preview;
		loadTravelImages();
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
