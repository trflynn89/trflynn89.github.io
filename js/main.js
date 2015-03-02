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
var selectedNavClass = 'selected';

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

	$(navLink).removeClass(selectedNavClass);

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

	$(navLink).addClass(selectedNavClass);

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
		else if (event.keyCode === 0x25)
		{
			updateEnlargedImageDiv('left');
		}
		else if (event.keyCode === 0x27)
		{
			updateEnlargedImageDiv('right');
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

var minImageId = 1000;
var maxImageId = -1;

var idHeader = 'trav-';
var idPadLen = 3;

var locationMap = Array();

/**
 * Pad an integer value with 0's until its string length is >= idPadLen.
 */
function pad(val)
{
	val = val.toString();

	while (val.length < idPadLen)
	{
		val = '0' + val;
	}

	return val;
}

/**
 * Construct the HTML div to hold image previews.
 */
function getPreviewImageDiv(imageId, imageLocation)
{
	imageIdStr = pad(imageId);
	locationMap[imageId] = imageLocation;

	var html = '<div>'
	html += '<img src="img/travel/' + imageIdStr + '.jpg" '
	html += 'class="image" id="' + idHeader + imageIdStr + '" alt="" />'
	html += '</div>'

	if (imageId < minImageId)
	{
		minImageId = imageId;
	}
	if (imageId > maxImageId)
	{
		maxImageId = imageId;
	}

	return html;
}

/**
 * Construct the HTML div to hold an enlarged image.
 */
function getEnlargedImageDiv(imageId)
{
	imageIdStr = pad(imageId);

	var html = '<div class="enlargedDiv">';
	html += '<h3>' + locationMap[imageId] + '</h3>';
	html += '<img src="img/nav/left.png" id="navLeft" class="popupNav" alt="" />'
	html += '<img src="img/travel/' + imageIdStr + '.jpg" id="' + idHeader + imageIdStr + '" class="image enlargedImage" alt="" />';
	html += '<img src="img/nav/right.png" id="navRight" class="popupNav" alt="" />'
	html += '</div>';

	return html;
}

/**
 * Change the current enlarged image. If direction is left or right, use the
 * image that is +/- 1 of the current enlarged image (wrapping around).
 */
function updateEnlargedImageDiv(direction)
{
	imageId = parseInt(currId.substring(1 + idHeader.length));

	if ((NavStatus[Nav.Travel] == Status.Hidden) || isNaN(imageId))
	{
		return;
	}
	else if (direction == 'left')
	{
		imageId = (imageId > minImageId ? imageId - 1 : maxImageId);
		currId = '#' + idHeader + pad(imageId);
	}
	else if (direction == 'right')
	{
		imageId = (imageId < maxImageId ? imageId + 1 : minImageId);
		currId = '#' + idHeader + pad(imageId);
	}

	currStatus = TravelStatus.Resizing;

	$('#travelDiv').fadeOut(function()
	{
		var html = getEnlargedImageDiv(imageId);

		$('#travelDiv').html(html).fadeIn(function()
		{
			currStatus = TravelStatus.Enlarged;
		});
	});
}

function loadTravelImages()
{
	baseHtml += getPreviewImageDiv(38, 'Jackson Point - Little Cayman, Cayman Islands');
	baseHtml += getPreviewImageDiv(39, 'Bus Stop - Little Cayman, Cayman Islands');
	baseHtml += getPreviewImageDiv(40, 'Bus Stop - Little Cayman, Cayman Islands');
	baseHtml += getPreviewImageDiv(41, 'Central Caribbean Marine Institute - Little Cayman, Cayman Islands');
	baseHtml += getPreviewImageDiv(42, 'Little Cayman, Cayman Islands');
	baseHtml += getPreviewImageDiv(1,  'Great Barrier Reef, Australia');
	baseHtml += getPreviewImageDiv(2,  'Paradise, New Zealand');
	baseHtml += getPreviewImageDiv(3,  'Oahu, New Zealand');
	baseHtml += getPreviewImageDiv(4,  'Queenstown, New Zealand');
	baseHtml += getPreviewImageDiv(5,  'St. Kilda Beach - Melbourne, Victoria, Australia');
	baseHtml += getPreviewImageDiv(6,  'Melbourne Zoo - Melbourne, Victoria, Australia');
	baseHtml += getPreviewImageDiv(7,  'Melbourne Zoo - Melbourne, Victoria, Australia');
	baseHtml += getPreviewImageDiv(8,  'The Twelve Apostles - Victoria, Australia');
	baseHtml += getPreviewImageDiv(9,  'Grampians National Park - Victoria, Australia');
	baseHtml += getPreviewImageDiv(10, 'Grampians National Park - Victoria, Australia');
	baseHtml += getPreviewImageDiv(11, 'Melbourne Cricket Ground - Melbourne, Victoria, Australia');
	baseHtml += getPreviewImageDiv(12, 'Werribee Open Range Zoo - Werribee, Victoria, Australia');
	baseHtml += getPreviewImageDiv(13, 'Healesville Sanctuary - Healesville, Victoria, Australia');
	baseHtml += getPreviewImageDiv(14, 'Healesville Sanctuary - Healesville, Victoria, Australia');
	baseHtml += getPreviewImageDiv(15, 'Blue Mountains - New South Wales, Australia');
	baseHtml += getPreviewImageDiv(16, 'Sydney Opera House - Sydney, New South Wales, Australia');
	baseHtml += getPreviewImageDiv(17, 'Sydney Opera House - Sydney, New South Wales, Australia');
	baseHtml += getPreviewImageDiv(18, 'Harbour Bridge - Sydney, New South Wales, Australia');
	baseHtml += getPreviewImageDiv(19, 'Flynn Reef - Great Barrier Reef, Australia');
	baseHtml += getPreviewImageDiv(20, 'Flynn Reef - Great Barrier Reef, Australia');
	baseHtml += getPreviewImageDiv(21, 'Cook Strait - New Zealand');
	baseHtml += getPreviewImageDiv(22, 'New Zealand');
	baseHtml += getPreviewImageDiv(23, 'Zirakzigil - New Zealand');
	baseHtml += getPreviewImageDiv(24, 'Takaro Road - New Zealand');
	baseHtml += getPreviewImageDiv(25, 'Milford Sound - New Zealand');
	baseHtml += getPreviewImageDiv(26, 'Milford Sound - New Zealand');
	baseHtml += getPreviewImageDiv(27, 'Milford Sound - New Zealand');
	baseHtml += getPreviewImageDiv(28, 'New Zealand');
	baseHtml += getPreviewImageDiv(29, 'New Zealand');
	baseHtml += getPreviewImageDiv(30, 'New Zealand');
	baseHtml += getPreviewImageDiv(31, 'New Zealand');
	baseHtml += getPreviewImageDiv(32, 'New Zealand');
	baseHtml += getPreviewImageDiv(33, 'New Zealand');
	baseHtml += getPreviewImageDiv(34, 'Pawtuckaway State Park - New Hampshire, US');
	baseHtml += getPreviewImageDiv(35, 'Pawtuckaway State Park - New Hampshire, US');
	baseHtml += getPreviewImageDiv(36, 'Townsville, Queensland, Australia');
	baseHtml += getPreviewImageDiv(37, 'Cozumel, Mexico');

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
	if (event.target.id.indexOf(idHeader) == -1)
	{
		if (event.target.id == 'navLeft')
		{
			updateEnlargedImageDiv('left');
		}
		else if (event.target.id == 'navRight')
		{
			updateEnlargedImageDiv('right');
		}
	}
	else if (currStatus == TravelStatus.Preview)
	{
		currId = '#' + event.target.id;
		updateEnlargedImageDiv();
	}
	else if (currStatus == TravelStatus.Enlarged)
	{
		currId = '';
		currStatus = TravelStatus.Resizing;

		$('#travelDiv').fadeOut(function()
		{
			$('#travelDiv').html(baseHtml).fadeIn(function()
			{
				//$(NavId[Nav.Travel]).mCustomScrollbar('scrollTo', currId);
				currStatus = TravelStatus.Preview;
			});
		});
	}
});
