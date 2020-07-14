jQuery(document).ready(function($) {

    'use strict';

    /**
     * A few globals
     */

    var $window = $(window),
        $body   = $('body');


    /**
     * Browser size testing
     */

    function jqUpdateSize(){
        // Get the dimensions of the viewport
        var width = $(window).width();
        var height = $(window).height();

        $('#jqWidth').html(width);
        $('#jqHeight').html(height);
    }
    $(document).ready(jqUpdateSize);
    $(window).resize(jqUpdateSize);

    /**
     * A tiny plugin to check if element exist and if
     * does act accordingly
     *
     * @param  {Function} callback A callback funciton to call if element exists
     * @return {object}            jQuery element object
     */
    $.fn.exists = function( callback ) {
        var args = [].slice.call( arguments, 1 );

        if ( ! callback ) {
            return this.length;
        }

        if ( this.length ) {
            callback.call( this, args );
        }

        return this;
    };


    /**
     * Mobile menu switch
     */
    $( '#btn-mobile-nav-switch' ).on( 'click', function( e ) {

       $( "#mobile-nav-dropdown" ).slideToggle();

        e.preventDefault();
    });


    /**
     * Main featured slider on homepage
     * @type {Boolean}
     */
    var owlFeaturedSliderHomepage = $('#featured-slider');

    owlFeaturedSliderHomepage.owlCarousel({
        navigation      : true, // Show next and prev buttons
        slideSpeed      : 300,
        paginationSpeed : 400,
        singleItem      : true,
        navigationText  : ['<i class="icon icon-hns-arrow-left icon-lg"></i>', '<i class="icon icon-hns-arrow-right icon-lg"></i>'],
        afterAction     : afterOwlFeaturedSliderHomepageAction,
        transitionStyle : 'fade'
    });

    function afterOwlFeaturedSliderHomepageAction() {
        $( "#featured-slider-pagination a:eq( " + this.prevItem + " )" ).removeClass( 'active' );
        $( "#featured-slider-pagination a:eq( " + this.owl.currentItem + " )" ).addClass( 'active' );
    }

    $( "#featured-slider-pagination" ).on( "click", "a", function( e ) {
        var $this  = $(this),
            target = $this.data('slide'),
            owl    = owlFeaturedSliderHomepage.data('owlCarousel');

        $( "#featured-slider-pagination a" ).removeClass( 'active' );

        $this.addClass('active');

        owl.goTo( target );

        e.preventDefault();
    });


    /**
     * Small dont miss ticker in header
     * @type {Boolean}
     */
    var owlDontMissTicker = $('#dont-miss-ticker');

    owlDontMissTicker.owlCarousel({
        navigation      : false,
        slideSpeed      : 300,
        paginationSpeed : 400,
        singleItem      : true,
        transitionStyle : 'goDown'
    });

    // Custom Navigation Events
    $("#dont-miss-ticker-button").click(function(e){
        owlDontMissTicker.trigger('owl.next');
        e.preventDefault();
    });


    /**
     * Small featured carousel on homepage
     * @type {Boolean}
     */
    var owlFeaturedCarouselHomepage = $('#featured-carousel');

    owlFeaturedCarouselHomepage.owlCarousel({
        navigation        : false,
        paginationNumbers : true,
        slideSpeed        : 300,
        paginationSpeed   : 400,
        singleItem        : true,
        navigationText    : ['<i class="icon icon-hns-arrow-left icon-lg"></i>', '<i class="icon icon-hns-arrow-right icon-lg"></i>']
    });


    /**
     * Follow on carousel on homepage
     * @type {Boolean}
     */
    var owlFollowOnCarousel = $('#follow-on-carousel');

    owlFollowOnCarousel.owlCarousel({
        navigation      : false,
        slideSpeed      : 300,
        paginationSpeed : 400,
        items           : 6,
        navigationText  : ['<i class="icon icon-hns-arrow-left icon-lg"></i>', '<i class="icon icon-hns-arrow-right icon-lg"></i>'],
        itemsCustom : [
            [0, 2],
            [320, 2],
            [480, 3],
            [768, 4],
            [992, 5],
            [1200, 6]
        ]
    });

    // Custom Navigation Events
    $("#follow-on-carousel--next").click(function(e){
        owlFollowOnCarousel.trigger('owl.next');
        e.preventDefault();
    });
    $("#follow-on-carousel--prev").click(function(e){
        owlFollowOnCarousel.trigger('owl.prev');
        e.preventDefault();
    });


    /**
     * Reviews carousel on homepage
     * @type {Boolean}
     */
    var owlReviewsCarousel = $('#reviews-carousel');

    owlReviewsCarousel.owlCarousel({
        navigation      : false,
        slideSpeed      : 300,
        paginationSpeed : 400,
        items           : 6,
        navigationText  : ['<i class="icon icon-hns-arrow-left icon-lg"></i>', '<i class="icon icon-hns-arrow-right icon-lg"></i>'],
        itemsCustom : [
            [0, 1],
            [320, 2],
            [480, 3],
            [768, 3],
            [992, 4],
            [1200, 5]
        ]
    });

    // Custom Navigation Events
    $("#reviews-carousel--next").click(function(e){
        owlReviewsCarousel.trigger('owl.next');
        e.preventDefault();
    });
    $("#reviews-carousel--prev").click(function(e){
        owlReviewsCarousel.trigger('owl.prev');
        e.preventDefault();
    });


    /**
     * Dont miss carousel on homepage
     * @type {Boolean}
     */
    var owlDontMissCarousel = $('#dont-miss-carousel');

    owlDontMissCarousel.owlCarousel({
        navigation      : false,
        slideSpeed      : 300,
        paginationSpeed : 400,
        items           : 6,
        navigationText  : ['<i class="icon icon-hns-arrow-left icon-lg"></i>', '<i class="icon icon-hns-arrow-right icon-lg"></i>'],
        itemsCustom : [
            [0, 1],
            [320, 2],
            [480, 3],
            [768, 3],
            [992, 4],
            [1200, 5]
        ]
    });

    // Custom Navigation Events
    $("#dont-miss-carousel--next").click(function(e){
        owlDontMissCarousel.trigger('owl.next');
        e.preventDefault();
    });
    $("#dont-miss-carousel--prev").click(function(e){
        owlDontMissCarousel.trigger('owl.prev');
        e.preventDefault();
    });


    /**
     * Floating entry share
     * @type {[type]}
     */

    var $entryShareFloat = $("#entry-share-float");

    if ( $entryShareFloat.length ) {
        var offset     = $entryShareFloat.offset(),
            topPadding = 15;

        $window.scroll(function() {
            if ($window.scrollTop() > offset.top) {
                $entryShareFloat.stop().animate({
                    marginTop: $window.scrollTop() - offset.top + topPadding
                });
            } else {
                $entryShareFloat.stop().animate({
                    marginTop: 0
                });
            }
        });
    }


    /**
     * Back to top regular social button
     */
    $('.back-to-top').click( function( event ) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 500);
        return false;
    });


    /**
     * Back to top mobile version with some nice anime and etc.
     */
    var mobile_offset         = 300,  // browser window scroll (in pixels) after which the "back to top" link is shown
        mobile_offset_opacity = 1200, // browser window scroll (in pixels) after which the "back to top" link opacity is reduced
        $back_to_top          = $('#bttm');

    $(window).scroll( function() {
        ( $(this).scrollTop() > mobile_offset ) ? $back_to_top.addClass( 'bttm-is-visible' ) : $back_to_top.removeClass( 'bttm-is-visible bttm-fade-out' );
        if ( $(this).scrollTop() > mobile_offset_opacity ) {
            $back_to_top.addClass('bttm-fade-out');
        }
    });

    $back_to_top.click( function( event ) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 500 );
        return false;
    });


    /**
     * Magazine cover / contributors padding
     */
    var $magazineSingleHeader = $('#magazine-single-header'),
        magazineSingleHeaderHeight;

    if ( $magazineSingleHeader.length ) {

        magazineSingleHeaderHeight = $magazineSingleHeader.height();

        if ( magazineSingleHeaderHeight > 317 && magazineSingleHeaderHeight < 430 ) {
            var magazineSingleHeaderExcess = magazineSingleHeaderHeight - 317;

            $('#magazine-contributors--id').css({
                'paddingTop' : 130 - magazineSingleHeaderExcess
            });
        } else if ( $magazineSingleHeader.height() > 430 ) {
            $('#magazine-contributors--id').css({
                'paddingTop' : 0
            });
        }
    }


    /**
     * Sticky magazine sidebar
     */

    $( '#magazine-sidebar' ).exists( function() {
        if ( $window.width() > 767 ) {
            this.stick_in_parent();
        }
    });


    /**
     * Mailchimp top bar covering mobile menu fix
     */

    $( '#mailchimp-top-bar' ).exists( function() {
        $body.addClass( 'mc-top-bar--active' );
    });


    /**
     * Modal
     */
    $.fn.getTitle = function() {
        var arr = $(".modal-gallery");
        $.each(arr, function() {
            var title = $(this).children("img").attr("title") || $(this).children("img").attr("alt");
                $(this).attr( 'data-title', title );
        });
    };

    var thumbnailsForModal = 'a:has(img)[href$=".bmp"],a:has(img)[href$=".gif"],a:has(img)[href$=".jpg"],a:has(img)[href$=".jpeg"],a:has(img)[href$=".png"],a:has(img)[href$=".BMP"],a:has(img)[href$=".GIF"],a:has(img)[href$=".JPG"],a:has(img)[href$=".JPEG"],a:has(img)[href$=".PNG"]';

    $( thumbnailsForModal ).addClass( "modal-gallery" ).attr( "data-lightbox", "gallery" ).getTitle();


    /**
     * Custom Social sharing
     */
    var hnsSocialShare = function( sharingEl ) {

        var sharePageURL         = window.location.href,
            sharePageImage       = $('meta[property="og:image"]').attr('content') || '[image]',
            sharePageTitle       = $('meta[property="og:title"]').attr('content') || '[title]',
            sharePageDescription = $('meta[property="og:description"]').attr('content') || '[description]',
            shareToURL           = {
                "facebook"   : "https://www.facebook.com/sharer.php?s=100&p[title]=" + (sharePageTitle) + "&p[summary]=" + sharePageDescription + "&p[url]=" + encodeURIComponent(sharePageURL) + "&p[images][0]=" + (sharePageImage),
                "googleplus" : "https://plus.google.com/share?url=" + encodeURIComponent(sharePageURL),
                "twitter"    : "https://twitter.com/home?status=" + escape(sharePageTitle) + "+" + encodeURIComponent(sharePageURL),
                "pinterest"  : "https://pinterest.com/pin/create/bookmarklet/?media=" + encodeURIComponent(sharePageImage) + "&url=" + encodeURIComponent(sharePageURL) + "& is_video=false&description=" + sharePageDescription,
                "tumblr"     : "https://www.tumblr.com/share/photo?source=" + encodeURIComponent(sharePageImage) + "&caption=" + (sharePageDescription) + "&clickthru=" + encodeURIComponent(sharePageURL),
                "linkedin"   : "https://www.linkedin.com/shareArticle?mini=true&url=" + encodeURIComponent(sharePageURL) + "&title=" + (sharePageTitle) + "&source=" + encodeURIComponent(sharePageURL),
                "email"      : "mailto:?subject=" + sharePageTitle + "&body=" + sharePageDescription + "%0A%0ALink: " + encodeURIComponent(sharePageURL)
            };

        $( sharingEl ).find( 'a' ).each( function( index, value ) {
            var $this   = $( this ),
                shareOn = $this.data('shareOn');

            if ( shareOn && shareToURL.hasOwnProperty( shareOn ) ) {
                $this.attr('href', shareToURL[ shareOn ]);
            }
        });
    };

    $('.hns-social-share').exists( function() {
        hnsSocialShare('.hns-social-share');
    });


    /**
     * GMap
     */

    /*
     *  new_map
     *
     *  This function will render a Google Map onto the selected jQuery element
     *
     *  @type    function
     *  @date    8/11/2013
     *  @since   4.3.0
     *
     *  @param   $el (jQuery element)
     *  @return  n/a
     */

    function new_map( $el ) {

        // var
        var $markers = $el.find('.marker');

        // vars
        var args = {
            zoom: 16,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // create map
        var map = new google.maps.Map( $el[0], args );

        // add a markers reference
        map.markers = [];

        // add markers
        $markers.each(function() {
            add_marker( $( this ), map );
        });

        // center map
        center_map( map );

        // return
        return map;
    }

    /*
     *  add_marker
     *
     *  This function will add a marker to the selected Google Map
     *
     *  @type    function
     *  @date    8/11/2013
     *  @since   4.3.0
     *
     *  @param   $marker (jQuery element)
     *  @param   map (Google Map object)
     *  @return  n/a
     */
    function add_marker( $marker, map ) {

        // var
        var latlng = new google.maps.LatLng($marker.attr('data-lat'), $marker.attr('data-lng'));

        // create marker
        var marker = new google.maps.Marker({
            position: latlng,
            map: map
        });

        // add to array
        map.markers.push(marker);

        // if marker contains HTML, add it to an infoWindow
        if ( $marker.html() ) {
            // create info window
            var infowindow = new google.maps.InfoWindow({
                content: $marker.html()
            });

            // show info window when marker is clicked
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });
        }
    }

    /*
     *  center_map
     *
     *  This function will center the map, showing all markers attached to this map
     *
     *  @type    function
     *  @date    8/11/2013
     *  @since   4.3.0
     *
     *  @param   map (Google Map object)
     *  @return  n/a
     */

    function center_map( map ) {

        // vars
        var bounds = new google.maps.LatLngBounds();

        // loop through all markers and create bounds
        $.each( map.markers, function( i, marker ) {
            var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );
            bounds.extend( latlng );
        });

        // only 1 marker?
        if (map.markers.length == 1) {
            // set center of map
            map.setCenter(bounds.getCenter());
            map.setZoom(16);
        } else {
            // fit to bounds
            map.fitBounds(bounds);
        }
    }

    /*
     *  document ready
     *
     *  This function will render each map when the document is ready (page has loaded)
     *
     *  @type    function
     *  @date    8/11/2013
     *  @since   5.0.0
     *
     *  @param   n/a
     *  @return  n/a
     */
    // global var
    var map = null;

    $('.entry-map').each(function() {
        // create map
        map = new_map( $( this ) );
    });


    var $eventFilterForm   = $('#hns-ordering-form'),
        $eventFilterSelect = $eventFilterForm.find('.event-filter-select');

    // Remove disabled on history go browser back
    if ( window.history ) {
        $eventFilterSelect.removeAttr( 'disabled');
    }

    $eventFilterSelect.on( 'change', function( e ) {

        $( this.form ).find( 'select' ).filter( function() {
            return ! this.value;
        }).attr( 'disabled', 'disabled' );

        this.form.submit();
    });


    // Background left or right
    var $fullGad = $('.full-gad'),
        $mainWrapper = $('#main-wrapper');

    if ( $fullGad.length ) {

        var adMaxSize = ( $(window).width() - 1210 ) / 2;
        if ( $(window).width() > 1300 && adMaxSize > 25 ) {

            var adPosition = $fullGad.data('side') || '',
                adCss = {
                    'display'  : 'block'
                };

            if ( adPosition ) {
                adCss.maxWidth = adMaxSize + 'px';

                switch ( adPosition ) {
                    case 'left' :
                        adCss.right = 'auto';
                    break;
                    case 'right' :
                        adCss.left = 'auto';
                    break;
                }
            }

            $fullGad.css( adCss );

        } else {
            // Hide
            $fullGad.css({
                'display'  : 'none'
            });
        }
    }


    /**
     * New Header
     */

    var $headerSearchPanel  = $('#headerSearchPanel'),
        $headerSearchToggle = $('.headerSearchToggle'),
        $headerCenter       = $('#headerCenter'),
        $headerMenuToggle   = $('#headerMenuToggle');

    /**
     * Search toggle
     */
    $headerSearchToggle.click( function(e) {

        let $this = $(this);

        // close menu first if it's open
        if ( $headerCenter.hasClass('open') ) {
            $headerCenter.hide().removeClass('open');
            $headerMenuToggle.attr( 'aria-expanded', false ).removeClass('open');
        }

        if ( $this.hasClass('open') ) {
            $headerSearchPanel.slideUp('fast').removeClass('open');
            $('.headerSearchToggle').attr( 'aria-expanded', false ).removeClass('open');
        } else {
            $headerSearchPanel.slideDown('fast').addClass('open');
            $('.headerSearchToggle').attr( 'aria-expanded', true ).addClass('open');
        }

        e.preventDefault();
    });


    /**
     * Mobile menu toggle
     */
    $headerMenuToggle.click( function(e) {
        let $this = $(this);

        // search menu first if it's open
        if ( $headerSearchPanel.hasClass('open') ) {
            $headerSearchPanel.hide().removeClass('open');
            $headerSearchToggle.attr( 'aria-expanded', false ).removeClass('open');
        }

        if ( $this.hasClass('open') ) {
            $headerCenter.slideUp().removeClass('open');
            $this.attr( 'aria-expanded', false ).removeClass('open');
        } else {
            $headerCenter.slideDown().addClass('open');
            $this.attr( 'aria-expanded', true ).addClass('open');
        }

        e.preventDefault();
    });


}); // jQuery end