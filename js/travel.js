(function($) {

    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)'
    });

    $(function() {

        loadTravelImages();

        var $window = $(window),
            $body = $('body'),
            $wrapper = $('#wrapper');

        // Hack: Enable IE workarounds.
            if (skel.vars.IEVersion < 12)
                $body.addClass('ie');

        // Touch?
            if (skel.vars.mobile)
                $body.addClass('touch');

        // Transitions supported?
            if (skel.canUse('transition')) {

                // Add (and later, on load, remove) "loading" class.
                    $body.addClass('loading');

                    $window.on('load', function() {
                        window.setTimeout(function() {
                            $body.removeClass('loading');
                        }, 100);
                    });

                // Prevent transitions/animations on resize.
                    var resizeTimeout;

                    $window.on('resize', function() {

                        window.clearTimeout(resizeTimeout);

                        $body.addClass('resizing');

                        resizeTimeout = window.setTimeout(function() {
                            $body.removeClass('resizing');
                        }, 100);

                    });

            }

        // Scroll back to top.
            $window.scrollTop(0);

        // Fix: Placeholder polyfill.
            $('form').placeholder();

        // Panels.
            var $panels = $('.panel');

            $panels.each(function() {

                var $this = $(this),
                    $toggles = $('[href="#' + $this.attr('id') + '"]'),
                    $closer = $('<div class="closer" />').appendTo($this);

                // Closer.
                    $closer
                        .on('click', function(event) {
                            $this.trigger('---hide');
                        });

                // Events.
                    $this
                        .on('click', function(event) {
                            event.stopPropagation();
                        })
                        .on('---toggle', function() {

                            if ($this.hasClass('active'))
                                $this.triggerHandler('---hide');
                            else
                                $this.triggerHandler('---show');

                        })
                        .on('---show', function() {

                            // Hide other content.
                                if ($body.hasClass('content-active'))
                                    $panels.trigger('---hide');

                            // Activate content, toggles.
                                $this.addClass('active');
                                $toggles.addClass('active');

                            // Activate body.
                                $body.addClass('content-active');

                        })
                        .on('---hide', function() {

                            // Deactivate content, toggles.
                                $this.removeClass('active');
                                $toggles.removeClass('active');

                            // Deactivate body.
                                $body.removeClass('content-active');

                        });

                // Toggles.
                    $toggles
                        .removeAttr('href')
                        .css('cursor', 'pointer')
                        .on('click', function(event) {

                            event.preventDefault();
                            event.stopPropagation();

                            $this.trigger('---toggle');

                        });

            });

            // Global events.
                $body
                    .on('click', function(event) {

                        if ($body.hasClass('content-active')) {

                            event.preventDefault();
                            event.stopPropagation();

                            $panels.trigger('---hide');

                        }

                    });

                $window
                    .on('keyup', function(event) {

                        if (event.keyCode == 27
                        &&  $body.hasClass('content-active')) {

                            event.preventDefault();
                            event.stopPropagation();

                            $panels.trigger('---hide');

                        }

                    });

        // Header.
            var $header = $('#header');

            // Links.
                $header.find('a').each(function() {

                    var $this = $(this),
                        href = $this.attr('href');

                    // Internal link? Skip.
                        if (!href
                        ||  href.charAt(0) == '#')
                            return;

                    // Redirect on click.
                        $this
                            .removeAttr('href')
                            .css('cursor', 'pointer')
                            .on('click', function(event) {

                                event.preventDefault();
                                event.stopPropagation();

                                window.location.href = href;

                            });

                });

        // Footer.
            var $footer = $('#footer');

            // Copyright.
            // This basically just moves the copyright line to the end of the *last* sibling of its current parent
            // when the "medium" breakpoint activates, and moves it back when it deactivates.
                $footer.find('.copyright').each(function() {

                    var $this = $(this),
                        $parent = $this.parent(),
                        $lastParent = $parent.parent().children().last();

                    skel
                        .on('+medium', function() {
                            $this.appendTo($lastParent);
                        })
                        .on('-medium', function() {
                            $this.appendTo($parent);
                        });

                });

        // Main.
            var $main = $('#main');

            // Thumbs.
                $main.children('.thumb').each(function() {

                    var $this = $(this),
                        $image = $this.find('.image'), $image_img = $image.children('img'),
                        x;

                    // No image? Bail.
                        if ($image.length == 0)
                            return;

                    // Image.
                    // This sets the background of the "image" <span> to the image pointed to by its child
                    // <img> (which is then hidden). Gives us way more flexibility.

                        // Set background.
                            $image.css('background-image', 'url(' + $image_img.attr('src') + ')');

                        // Set background position.
                            if (x = $image_img.data('position'))
                                $image.css('background-position', x);

                        // Hide original img.
                            $image_img.hide();

                    // Hack: IE<11 doesn't support pointer-events, which means clicks to our image never
                    // land as they're blocked by the thumbnail's caption overlay gradient. This just forces
                    // the click through to the image.
                        if (skel.vars.IEVersion < 11)
                            $this
                                .css('cursor', 'pointer')
                                .on('click', function() {
                                    $image.trigger('click');
                                });

                });

            // Poptrox.
                $main.poptrox({
                    baseZIndex: 20000,
                    caption: function($a) {

                        var s = '';

                        $a.nextAll().each(function() {
                            s += this.outerHTML;
                        });

                        return s;

                    },
                    fadeSpeed: 300,
                    onPopupClose: function() { $body.removeClass('modal-active'); },
                    onPopupOpen: function() { $body.addClass('modal-active'); },
                    overlayOpacity: 0,
                    popupCloserText: '',
                    popupHeight: 150,
                    popupLoaderText: '',
                    popupSpeed: 300,
                    popupWidth: 150,
                    selector: '.thumb > a.image',
                    usePopupCaption: true,
                    usePopupCloser: true,
                    usePopupDefaultStyling: false,
                    usePopupForceClose: true,
                    usePopupLoader: true,
                    usePopupNav: true,
                    windowMargin: 50
                });

                // Hack: Set margins to 0 when 'xsmall' activates.
                    skel
                        .on('-xsmall', function() {
                            $main[0]._poptrox.windowMargin = 50;
                        })
                        .on('+xsmall', function() {
                            $main[0]._poptrox.windowMargin = 0;
                        });
    });
})(jQuery);

/**
 * Pad an integer value with 0's until its string length is >= length.
 */
function pad0(val, length)
{
    val = val.toString();

    while (val.length < length)
    {
        val = '0' + val;
    }

    return val;
}

/**
 * Construct the HTML div to hold images.
 */
function getImageDiv(imageId, extension, header, location)
{
    var html = ''

    var imageName = pad0(imageId, 4) + '.' + extension;
    var thumbPath = '/img/travel/thumb/' + imageName;
    var fullPath = '/img/travel/full/' + imageName;

    html += '<article class="thumb">';
    html += '<a href="' + fullPath + '" class="image">';
    html += '<img src="' + thumbPath + '" alt="" />';
    html += '</a>'
    html += '<h2>' + header + '</h2>'

    if (location !== undefined)
    {
        html += '<p>' + location + '</p>'
    }

    html += '</article>'

    return html;
}

/**
 * Construct the HTMLfor all travel images.
 */
function loadTravelImages()
{
    var html = '';

    html += getImageDiv(41, 'png', 'Jackson Point', 'Little Cayman, Cayman Islands');
    html += getImageDiv(42, 'png', 'Jackson Point', 'Little Cayman, Cayman Islands');
    html += getImageDiv(43, 'jpg', 'Bus Stop', 'Little Cayman, Cayman Islands');
    html += getImageDiv(44, 'jpg', 'Bus Stop', 'Little Cayman, Cayman Islands');
    html += getImageDiv(45, 'jpg', 'Central Caribbean Marine Institute', 'Little Cayman, Cayman Islands');
    html += getImageDiv(46, 'jpg', 'Point of Sand', 'Little Cayman, Cayman Islands');
    html += getImageDiv(49, 'jpg', 'Korketrekkeren', 'Oslo, Norway');
    html += getImageDiv(47, 'jpg', 'Tour Eiffel', 'Paris, France');
    html += getImageDiv(48, 'jpg', 'Château de Versailles', 'Versailles, France');
    html += getImageDiv(51, 'jpg', 'San Juan', 'Puerto Rico');
    html += getImageDiv(52, 'jpg', 'Labadee', 'Haiti');
    html += getImageDiv(50, 'jpg', 'Cheyenne', 'Colorado / Wyoming Border');
    html += getImageDiv(1,  'jpg', 'Great Barrier Reef', 'Australia');
    html += getImageDiv(2,  'png', 'Paradise', 'New Zealand');
    html += getImageDiv(3,  'png', 'Oahu', 'New Zealand');
    html += getImageDiv(4,  'png', 'Queenstown', 'New Zealand');
    html += getImageDiv(5,  'png', 'St. Kilda Beach', 'Melbourne, Victoria, Australia');
    html += getImageDiv(6,  'png', 'Melbourne Zoo', 'Melbourne, Victoria, Australia');
    html += getImageDiv(7,  'png', 'Melbourne Zoo', 'Melbourne, Victoria, Australia');
    html += getImageDiv(8,  'png', 'The Twelve Apostles', 'Victoria, Australia');
    html += getImageDiv(9,  'png', 'Grampians National Park', 'Victoria, Australia');
    html += getImageDiv(10, 'png', 'Grampians National Park', 'Victoria, Australia');
    html += getImageDiv(11, 'png', 'Melbourne Cricket Ground', 'Melbourne, Victoria, Australia');
    html += getImageDiv(13, 'png', 'Werribee Open Range Zoo', 'Werribee, Victoria, Australia');
    html += getImageDiv(14, 'png', 'Werribee Open Range Zoo', 'Werribee, Victoria, Australia');
    html += getImageDiv(15, 'png', 'Healesville Sanctuary', 'Healesville, Victoria, Australia');
    html += getImageDiv(16, 'png', 'Healesville Sanctuary', 'Healesville, Victoria, Australia');
    html += getImageDiv(17, 'png', 'Healesville Sanctuary', 'Healesville, Victoria, Australia');
    html += getImageDiv(18, 'png', 'Blue Mountains', 'New South Wales, Australia');
    html += getImageDiv(19, 'png', 'Sydney Opera House', 'Sydney, New South Wales, Australia');
    html += getImageDiv(20, 'png', 'Sydney Opera House', 'Sydney, New South Wales, Australia');
    html += getImageDiv(21, 'png', 'Harbour Bridge', 'Sydney, New South Wales, Australia');
    html += getImageDiv(22, 'png', 'Flynn Reef', 'Great Barrier Reef, Australia');
    html += getImageDiv(23, 'png', 'Flynn Reef', 'Great Barrier Reef, Australia');
    html += getImageDiv(24, 'png', 'Cook Strait', 'New Zealand');
    html += getImageDiv(25, 'png', 'Canterbury', 'New Zealand');
    html += getImageDiv(26, 'png', 'Zirakzigil', 'New Zealand');
    html += getImageDiv(27, 'png', 'Takaro Road', 'New Zealand');
    html += getImageDiv(28, 'png', 'Milford Sound', 'New Zealand');
    html += getImageDiv(29, 'png', 'Milford Sound', 'New Zealand');
    html += getImageDiv(30, 'png', 'Milford Sound', 'New Zealand');
    html += getImageDiv(31, 'png', 'New Zealand');
    html += getImageDiv(32, 'png', 'New Zealand');
    html += getImageDiv(33, 'png', 'New Zealand');
    html += getImageDiv(34, 'png', 'New Zealand');
    html += getImageDiv(35, 'png', 'New Zealand');
    html += getImageDiv(36, 'png', 'New Zealand');
    html += getImageDiv(37, 'jpg', 'Pawtuckaway State Park', 'New Hampshire, US');
    html += getImageDiv(38, 'jpg', 'Pawtuckaway State Park', 'New Hampshire, US');
    html += getImageDiv(39, 'jpg', 'Townsville', 'Queensland, Australia');
    html += getImageDiv(40, 'jpg', 'Cozumel', 'Mexico');

    $('#main').html(html);
}
