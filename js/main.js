/**
 * Scripts to handle the pop ups associated with the navigation links.
 *
 * @author Timothy Flynn
 * @version July 28, 2014
 */

/********** PAGE SETUP **********/

var contactMap;

$(document).ready(function()
{
	// Display background image
	$.backstretch('http://www.timothy-flynn.com/img/background.jpg');

	// Display resume - converted with zamzar.com
	$('#resumeDiv').append('<img src="img/TimothyFlynnResume-030215.png" alt="" />');

	// Display YouTube videos
	$('.lazyYT').lazyYT();

	// Display map
	var coord = L.latLng(42.252156, -71.003295);
	contactMap = L.map('map').setView(coord, 16);

	L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
		id: 'trflynn89.j35n6m41',
	}).addTo(contactMap);

	L.marker(coord).addTo(contactMap)
		.bindPopup(
			'<b>ViaSat, Inc.</b>' +
			'<br />1250 Hancock Street 701-N' +
			'<br />Quincy, MA 02169'
	).openPopup();

	// Hide all popups so jQuery has them loaded
	$('.popup').hide();
});

/********** GENERAL POP UPS **********/

var Status = { Hidden : 0, Visible : 1 };

var Nav = { Resume : 0, Projects : 1, Travel : 2, Music : 3, Contact : 4, NumNav : 5 };
var NavId = new Array('#popupResume', '#popupProjects', '#popupTravel', '#popupMusic', '#popupContact');
var NavLink = new Array('#resume', '#projects', '#travel', '#music', '#contact');
var NavStatus = new Array();
var NavScroll = new Array();
var NavSpeed = new Array(200, 200, 50, 50, 'auto');
var NavInertia = new Array(950, 950, 600, 600, 950);

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

	var navId = NavId[nav];
	NavStatus[nav] = Status.Visible;

	$(navId).fadeIn('slow', function()
	{
		handlingClick = false;
	});

	if (NavScroll[nav] == Status.Hidden)
	{
		NavScroll[nav] = Status.Visible;

		$(navId).mCustomScrollbar(
		{
			alwaysShowScrollbar : 1,
			scrollInertia : NavInertia[nav],
			theme : 'dark-thin',
			mouseWheel :
			{
				deltaFactor : NavSpeed[nav]
			},
			advanced :
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

	var navId = NavId[nav];
	var navLink = NavLink[nav];

	$(navLink).removeClass('selected');

	NavStatus[nav] = Status.Hidden;
	$(navId).fadeOut('slow', function()
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

	handlingClick = true;

	var navId = NavId[nav];
	var navLink = NavLink[nav];

	$(navLink).addClass('selected');

	if (NavStatus[nav] == Status.Hidden)
	{
		$(navId).css('visibility', 'visible');

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

	// Close button
	$('.popupClose').click(function()
	{
		disableAllPopups();
	});

	// Resume
	$('#resume').click(function()
	{
		handleClick(Nav.Resume);
	});

	// Projects
	$('#projects').click(function()
	{
		handleClick(Nav.Projects);
	});

	// Travel
	$('#travel').click(function()
	{
		handleClick(Nav.Travel);
	});

	// Music
	$('#music').click(function()
	{
		handleClick(Nav.Music);
	});

	// Contact
	$('#contact').click(function()
	{
		handleClick(Nav.Contact);
		contactMap.invalidateSize();
	});
});

/********** TRAVEL POP UP **********/

var TravelStatus = { None : 0, Preview : 1, Enlarged : 2, Resizing : 3 };

var currStatus = TravelStatus.None;
var baseHtml = '';
var currId = '';

function getTravelImageDiv(imageId, imageLoc)
{
	var html = '<div>'
	html += '<img src="img/travel/' + imageId + '.jpg" '
	html += 'class="image" id="trav-' + imageId + '" '
	html += 'data-location="' + imageLoc + '" alt="" />'
	html += '</div>'

	return html;
}

function loadTravelImages()
{
	baseHtml += getTravelImageDiv('038', 'Jackson Point - Little Cayman, Cayman Islands');
	baseHtml += getTravelImageDiv('039', 'Bus Stop - Little Cayman, Cayman Islands');
	baseHtml += getTravelImageDiv('040', 'Bus Stop - Little Cayman, Cayman Islands');
	baseHtml += getTravelImageDiv('041', 'Central Caribbean Marine Institute - Little Cayman, Cayman Islands');
	baseHtml += getTravelImageDiv('042', 'Little Cayman, Cayman Islands');
	baseHtml += getTravelImageDiv('001', 'Great Barrier Reef, Australia');
	baseHtml += getTravelImageDiv('002', 'Paradise, New Zealand');
	baseHtml += getTravelImageDiv('003', 'Oahu, New Zealand');
	baseHtml += getTravelImageDiv('004', 'Queenstown, New Zealand');
	baseHtml += getTravelImageDiv('005', 'St. Kilda Beach - Melbourne, Victoria, Australia');
	baseHtml += getTravelImageDiv('006', 'Melbourne Zoo - Melbourne, Victoria, Australia');
	baseHtml += getTravelImageDiv('007', 'Melbourne Zoo - Melbourne, Victoria, Australia');
	baseHtml += getTravelImageDiv('008', 'The Twelve Apostles - Victoria, Australia');
	baseHtml += getTravelImageDiv('009', 'Grampians National Park - Victoria, Australia');
	baseHtml += getTravelImageDiv('010', 'Grampians National Park - Victoria, Australia');
	baseHtml += getTravelImageDiv('011', 'Melbourne Cricket Ground - Melbourne, Victoria, Australia');
	baseHtml += getTravelImageDiv('012', 'Werribee Open Range Zoo - Werribee, Victoria, Australia');
	baseHtml += getTravelImageDiv('013', 'Healesville Sanctuary - Healesville, Victoria, Australia');
	baseHtml += getTravelImageDiv('014', 'Healesville Sanctuary - Healesville, Victoria, Australia');
	baseHtml += getTravelImageDiv('015', 'Blue Mountains - New South Wales, Australia');
	baseHtml += getTravelImageDiv('016', 'Sydney Opera House - Sydney, New South Wales, Australia');
	baseHtml += getTravelImageDiv('017', 'Sydney Opera House - Sydney, New South Wales, Australia');
	baseHtml += getTravelImageDiv('018', 'Harbour Bridge - Sydney, New South Wales, Australia');
	baseHtml += getTravelImageDiv('019', 'Flynn Reef - Great Barrier Reef, Australia');
	baseHtml += getTravelImageDiv('020', 'Flynn Reef - Great Barrier Reef, Australia');
	baseHtml += getTravelImageDiv('021', 'Cook Strait - New Zealand');
	baseHtml += getTravelImageDiv('022', 'New Zealand');
	baseHtml += getTravelImageDiv('023', 'Zirakzigil - New Zealand');
	baseHtml += getTravelImageDiv('024', 'Takaro Road - New Zealand');
	baseHtml += getTravelImageDiv('025', 'Milford Sound - New Zealand');
	baseHtml += getTravelImageDiv('026', 'Milford Sound - New Zealand');
	baseHtml += getTravelImageDiv('027', 'Milford Sound - New Zealand');
	baseHtml += getTravelImageDiv('028', 'New Zealand');
	baseHtml += getTravelImageDiv('029', 'New Zealand');
	baseHtml += getTravelImageDiv('030', 'New Zealand');
	baseHtml += getTravelImageDiv('031', 'New Zealand');
	baseHtml += getTravelImageDiv('032', 'New Zealand');
	baseHtml += getTravelImageDiv('033', 'New Zealand');
	baseHtml += getTravelImageDiv('034', 'Pawtuckaway State Park - New Hampshire, US');
	baseHtml += getTravelImageDiv('035', 'Pawtuckaway State Park - New Hampshire, US');
	baseHtml += getTravelImageDiv('036', 'Townsville, Queensland, Australia');
	baseHtml += getTravelImageDiv('037', 'Cozumel, Mexico');

	$('#travelDiv').append(baseHtml);
}

$(document).ready(function()
{
	if (currStatus == TravelStatus.None)
	{
		currStatus = TravelStatus.Preview;
		loadTravelImages();
	}
});

$('#travelDiv').click(function(event)
{
	if (event.target.nodeName != 'IMG')
	{
		return;
	}

	if (currStatus == TravelStatus.Preview)
	{
		currStatus = TravelStatus.Resizing;
		currId = '#' + event.target.id;

		$('#travelDiv').fadeOut(function()
		{
			var html = '<div>';
			html += '<h3>' + $(currId).data('location') + '</h3>';
			html += '<img src="' + event.target.src + '" class="image enlarge" alt ="" />';
			html += '</div>';

			$('#travelDiv').html(html).fadeIn(function()
			{
				currStatus = TravelStatus.Enlarged;
			});
		});
	}
	else if (currStatus == TravelStatus.Enlarged)
	{
		currStatus = TravelStatus.Resizing;

		$('#travelDiv').fadeOut(function()
		{
			$('#travelDiv').html(baseHtml).fadeIn(function()
			{
				$(NavId[Nav.Travel]).mCustomScrollbar('scrollTo', currId);
				currStatus = TravelStatus.Preview;
			});
		});
	}
});
