/**
 * Scripts to handle the pop ups associated with the navigation links.
 *
 * @author Timothy Flynn
 * @version July 28, 2014
 */

/********** IE DETECTION **********/

$(document).ready(function()
{
    var isEarlierThanIE11 = RegExp('msie', 'i').test(navigator.userAgent);

    if (isEarlierThanIE11)
    {
        window.location.replace('http://timothy-flynn.com/ie.html');
    }
});

/********** PAGE SETUP **********/

var contactMap;

$(document).ready(function()
{
    // Display background image
    $.backstretch('http://timothy-flynn.com/img/background.jpg');

    // Display resume - converted with zamzar.com
    $(NavId[Nav.Resume]).append('<img src="img/TimothyFlynnResume-030215.png" alt="" />');

    // Display YouTube videos
    $('.lazyYT').lazyYT();

    // Display map
    var coord = L.latLng(42.252156, -71.003295);
    contactMap = L.map('map').setView(coord, 16);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        id: 'trflynn89.j35n6m41'
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

var Nav = { Resume : 0, Projects : 1, Travel : 2, TravelEnlarged : 3, Music : 4, Contact : 5, NumNav : 6 };
var NavId = new Array('#popupResume', '#popupProjects', '#popupTravel', '#popupTravelEnlarged', '#popupMusic', '#popupContact');
var NavLink = new Array('#resume', '#projects', '#travel', '#travel', '#music', '#contact');
var NavSpeed = new Array(200, 200, 50, 200, 50, 'auto');
var NavInertia = new Array(950, 950, 600, 950, 600, 950);

/**
 * Class to represent a basic stack.
 */
function Stack()
{
    this.m_stack = Array();

    /**
     * Push an element onto the stack.
     */
    this.Push = function(element)
    {
        this.m_stack.push(element);
    }

    /**
     * Pop an element from the stack. Return false if there was nothing to pop.
     */
    this.Pop = function()
    {
        if (this.m_stack.length > 0)
        {
            return this.m_stack.pop();
        }
        return false;
    }

    /**
     * Peek at the stack. Return false if there was nothing to look at.
     */
    this.Peek = function()
    {
        if (this.m_stack.length > 0)
        {
            return this.m_stack[this.m_stack.length - 1];
        }
        return false;
    }

    /**
     * Check if an element is in the stack.
     */
    this.Contains = function(element)
    {
        return (this.m_stack.indexOf(element) != -1);
    }

    /**
     * Check if any of a list of elements are in the stack. Uses the arguments
     * array instead of any named arguments.
     */
    this.ContainsAnyOf = function()
    {
        for (var i = 0; i < arguments.length; ++i)
        {
            if (this.Contains(arguments[i]))
            {
                return true;
            }
        }

        return false;
    }
}

var navArrowId = '#navArrow';
var popupStack = new Stack();

/**
 * Check if the navigation link is valid.
 */
function isValidNav(nav)
{
    return ((nav >= 0) && (nav < Nav.NumNav));
}

/**
 * Reset the navigation arrow's position, based on the currently selected nav
 * pane.
 */
function setNavArrowPos()
{
    var nav = popupStack.Peek();

    if (nav === false)
    {
        $(navArrowId).css({ 'visibility' : 'hidden' });
        return;
    }

    var navLink = NavLink[nav];

    var left = $(navLink).position().left
        + parseInt($(navLink).css('padding-left'))
        + $(navLink).width() / 2
        - $(navArrowId).width() / 2;

    var top = $('nav').position().top
        + $('nav').height()
        - $(navArrowId).height();

    $(navArrowId).css({ 'visibility' : 'visible' });
    $(navArrowId).css({ 'left' : left });
    $(navArrowId).css({ 'top' : top });
}

/**
 * Display the pop up for the given navigation link.
 */
function loadPopup(nav)
{
    if (!isValidNav(nav))
    {
        return;
    }

    popupStack.Push(nav);

    $(navArrowId).addClass('transition');
    setNavArrowPos();

    $(NavId[nav]).parents('.popup').css('visibility', 'visible');

    $(NavId[nav]).parents('.popup').fadeIn('slow', function()
    {
        $(navArrowId).removeClass('transition');
    });

    $(NavId[nav]).parents('.popupContainer').mCustomScrollbar(
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

/**
 * Hide the topmost pop up. Return the hidden element, or false.
 */
function disablePopup()
{
    var nav = popupStack.Pop();

    if (nav !== false)
    {
        $(NavId[nav]).parents('.popup').fadeOut('slow');
        setNavArrowPos();
    }

    return nav;
}

/**
 * Hide all pop ups.
 */
function disableAllPopups(except)
{
    while (disablePopup() !== false) { }
}

/**
 * Handle a click on the given navigation link. Hide all other popups and
 * display this one.
 */
function handleClick(nav)
{
    if (!popupStack.Contains(nav))
    {
        disableAllPopups();
        loadPopup(nav);
    }
}

/**
 * Initialize the events associated with pop ups.
 */
$(document).ready(function()
{
    // Key presses
    $(document).keyup(function(event)
    {
        if (event.keyCode === 0x1B)
        {
            disablePopup();
        }
        else if (event.keyCode === 0x25)
        {
            updateEnlargedImageDiv(Direction.Left);
        }
        else if (event.keyCode === 0x27)
        {
            updateEnlargedImageDiv(Direction.Right);
        }
    });

    // Close button
    $('.popupClose').click(function()
    {
        disablePopup();
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

/**
 * Reset the navigation's arrow position when the window is resized.
 */
$(window).resize(function()
{
    setNavArrowPos();
});

/********** TRAVEL POP UP **********/

var Direction = { None : 0, Left : 1, Right : 2 };

var minImageId = 1000;
var maxImageId = -1;

var idHeader = 'trav-';
var idPadLen = 3;

var locationMap = Array();
var currId = '';

/**
 * Pad an integer value with 0's until its string length is >= idPadLen.
 */
function pad0(val)
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
    imageIdStr = pad0(imageId);
    locationMap[imageId] = imageLocation;

    minImageId = Math.min(imageId, minImageId);
    maxImageId = Math.max(imageId, maxImageId);

    return '<img src="img/travel/' + imageIdStr + '.jpg" id="' + idHeader + imageIdStr + '" class="image" alt="' + locationMap[imageId] + '" />'
}

/**
 * Construct the HTML div to hold an enlarged image.
 */
function getEnlargedImageDiv(imageId)
{
    imageIdStr = pad0(imageId);

    var html = '<h3>' + locationMap[imageId] + '</h3>';

    html += '<img src="img/nav/left.png" id="navLeft" class="popupNav" alt="" />'
    html += '<img src="img/travel/' + imageIdStr + '.jpg" id="' + idHeader + imageIdStr + '" class="image enlargedImage" alt="' + locationMap[imageId] + '" />';
    html += '<img src="img/nav/right.png" id="navRight" class="popupNav" alt="" />'

    return html;
}

/**
 * Change the current enlarged image. If direction is left or right, use the
 * image that is +/- 1 of the current enlarged image (wrapping around).
 */
function updateEnlargedImageDiv(direction)
{
    var imageId = parseInt(currId.substring(1 + idHeader.length));

    if (isNaN(imageId) || !popupStack.ContainsAnyOf(Nav.Travel, Nav.TravelEnlarged))
    {
        return;
    }
    else if (direction === Direction.Left)
    {
        imageId = (imageId > minImageId ? imageId - 1 : maxImageId);
        currId = '#' + idHeader + pad0(imageId);
    }
    else if (direction === Direction.Right)
    {
        imageId = (imageId < maxImageId ? imageId + 1 : minImageId);
        currId = '#' + idHeader + pad0(imageId);
    }

    var html = getEnlargedImageDiv(imageId);
    $(NavId[Nav.TravelEnlarged]).html(html);

    if (direction === Direction.None)
    {
        loadPopup(Nav.TravelEnlarged);
    }
}

/**
 * Load the set of travel preview images.
 */
function loadTravelImages()
{
    var html = '';

    html += getPreviewImageDiv(38, 'Jackson Point - Little Cayman, Cayman Islands');
    html += getPreviewImageDiv(39, 'Bus Stop - Little Cayman, Cayman Islands');
    html += getPreviewImageDiv(40, 'Bus Stop - Little Cayman, Cayman Islands');
    html += getPreviewImageDiv(41, 'Central Caribbean Marine Institute - Little Cayman, Cayman Islands');
    html += getPreviewImageDiv(42, 'Little Cayman, Cayman Islands');
    html += getPreviewImageDiv(1,  'Great Barrier Reef, Australia');
    html += getPreviewImageDiv(2,  'Paradise, New Zealand');
    html += getPreviewImageDiv(3,  'Oahu, New Zealand');
    html += getPreviewImageDiv(4,  'Queenstown, New Zealand');
    html += getPreviewImageDiv(5,  'St. Kilda Beach - Melbourne, Victoria, Australia');
    html += getPreviewImageDiv(6,  'Melbourne Zoo - Melbourne, Victoria, Australia');
    html += getPreviewImageDiv(7,  'Melbourne Zoo - Melbourne, Victoria, Australia');
    html += getPreviewImageDiv(8,  'The Twelve Apostles - Victoria, Australia');
    html += getPreviewImageDiv(9,  'Grampians National Park - Victoria, Australia');
    html += getPreviewImageDiv(10, 'Grampians National Park - Victoria, Australia');
    html += getPreviewImageDiv(11, 'Melbourne Cricket Ground - Melbourne, Victoria, Australia');
    html += getPreviewImageDiv(12, 'Werribee Open Range Zoo - Werribee, Victoria, Australia');
    html += getPreviewImageDiv(13, 'Healesville Sanctuary - Healesville, Victoria, Australia');
    html += getPreviewImageDiv(14, 'Healesville Sanctuary - Healesville, Victoria, Australia');
    html += getPreviewImageDiv(15, 'Blue Mountains - New South Wales, Australia');
    html += getPreviewImageDiv(16, 'Sydney Opera House - Sydney, New South Wales, Australia');
    html += getPreviewImageDiv(17, 'Sydney Opera House - Sydney, New South Wales, Australia');
    html += getPreviewImageDiv(18, 'Harbour Bridge - Sydney, New South Wales, Australia');
    html += getPreviewImageDiv(19, 'Flynn Reef - Great Barrier Reef, Australia');
    html += getPreviewImageDiv(20, 'Flynn Reef - Great Barrier Reef, Australia');
    html += getPreviewImageDiv(21, 'Cook Strait - New Zealand');
    html += getPreviewImageDiv(22, 'New Zealand');
    html += getPreviewImageDiv(23, 'Zirakzigil - New Zealand');
    html += getPreviewImageDiv(24, 'Takaro Road - New Zealand');
    html += getPreviewImageDiv(25, 'Milford Sound - New Zealand');
    html += getPreviewImageDiv(26, 'Milford Sound - New Zealand');
    html += getPreviewImageDiv(27, 'Milford Sound - New Zealand');
    html += getPreviewImageDiv(28, 'New Zealand');
    html += getPreviewImageDiv(29, 'New Zealand');
    html += getPreviewImageDiv(30, 'New Zealand');
    html += getPreviewImageDiv(31, 'New Zealand');
    html += getPreviewImageDiv(32, 'New Zealand');
    html += getPreviewImageDiv(33, 'New Zealand');
    html += getPreviewImageDiv(34, 'Pawtuckaway State Park - New Hampshire, US');
    html += getPreviewImageDiv(35, 'Pawtuckaway State Park - New Hampshire, US');
    html += getPreviewImageDiv(36, 'Townsville, Queensland, Australia');
    html += getPreviewImageDiv(37, 'Cozumel, Mexico');

    $(NavId[Nav.Travel]).html(html);
}

$(document).ready(function()
{
    loadTravelImages();

    $(NavId[Nav.Travel]).click(function(event)
    {
        currId = '#' + event.target.id;
        updateEnlargedImageDiv(Direction.None);
    });

    $(NavId[Nav.TravelEnlarged]).click(function(event)
    {
        if (event.target.id.indexOf(idHeader) === -1)
        {
            if (event.target.id === 'navLeft')
            {
                updateEnlargedImageDiv(Direction.Left);
            }
            else if (event.target.id === 'navRight')
            {
                updateEnlargedImageDiv(Direction.Right);
            }
        }
        else
        {
            updateEnlargedImageDiv(Direction.Right);
        }
    });
});
