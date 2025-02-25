"use strict";
jQuery(document).ready(function ($) {

    $(window).load(function () {
        $(".loaded").fadeOut();
        $(".preloader").delay(1000).fadeOut("slow");
    });
    /*---------------------------------------------*
     * Mobile menu
     ---------------------------------------------*/
    $('#bs-example-navbar-collapse-1').find('a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: (target.offset().top - 0)
                }, 1000);
                if ($('.navbar-toggle').css('display') != 'none') {
                    $(this).parents('.container').find(".navbar-toggle").trigger("click");
                }
                return false;
            }
        }
    });


// slick slider active 
    $(".main_home_slider").slick({
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow:"<i class='fa fa-angle-left nextprevleft'></i>",
        nextArrow:"<i class='fa fa-angle-right nextprevright'></i>"
    });

//    $(".study_slider").slick({
//        dots: true,
//        slidesToShow: 1,
//        slidesToScroll: 1
//    });
    $(".study_slider").slick({
        dots: true,
        arrows:false,
        slidesToShow: 1,
        slidesToScroll: 1
    });

    /*---------------------------------------------*
     * STICKY scroll
     ---------------------------------------------*/

    $("").localScroll();

    /*---------------------------------------------*
     * WOW
     ---------------------------------------------*/

    var wow = new WOW({
        mobile: false // trigger animations on mobile devices (default is true)
    });
    wow.init();


// magnificPopup

    $('.portfolio-img').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });




//---------------------------------------------
// Counter 
//---------------------------------------------

    $('.statistic-counter').counterUp({
        delay: 10,
        time: 2000
    });

// main-menu-scroll

    jQuery(window).scroll(function () {
        var top = jQuery(document).scrollTop();
        var height = 300;
        //alert(batas);

        if (top > height) {
            jQuery('.navbar-fixed-top').addClass('menu-scroll');
        } else {
            jQuery('.navbar-fixed-top').removeClass('menu-scroll');
        }
    });

// scroll Up

    $(window).scroll(function () {
        if ($(this).scrollTop() > 600) {
            $('.scrollup').fadeIn('slow');
        } else {
            $('.scrollup').fadeOut('slow');
        }
    });

    $('.scrollup').click(function () {
        $("html, body").animate({scrollTop: 0}, 1000);
        return false;
    });


// scrool Down
    $('.scrooldown a').bind('click', function () {
        $('html , body').stop().animate({
            scrollTop: $($(this).attr('href')).offset().top - 160
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });



// Portfoliowork init
    jQuery('#portfoliowork').mixItUp({
        selectors: {
            target: '.tile',
            filter: '.filter'
                    //           sort: '.sort-btn'
        },
        animation: {
            animateResizeContainer: false,
            effects: 'fade scale'
        }

    });

// dropdown menu
    $('.dropdown-menu').click(function (e) {
        e.stopPropagation();
    });

    //End

});



$(document).on("scroll", function () {
    if ($(document).scrollTop() > 120) {
        $("nav").addClass("small");
    } else {
        $("nav").removeClass("small");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("customModal");
    const modalBody = document.getElementById("modal-body");
    const closeBtn = document.querySelector(".close");
    const learnMoreButtons = document.querySelectorAll(".learn-more-btn");
    const expandedContents = document.querySelectorAll(".expanded-content");
    const expandedBlogContents = document.querySelectorAll(".expanded-blog-content");
    const slider = document.querySelector(".main_home_slider"); // The slider container
    const readMoreButtons = document.querySelectorAll(".read_more");
    const savedPosition = localStorage.getItem("scrollPosition");
    const closeButtons = document.querySelectorAll(".close-content-btn");

    closeButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            // Find the parent expanded-blog-content and hide it
            this.parentElement.style.display = "none";
        });
    });
    if (savedPosition !== null) {
        window.scrollTo({
            top: parseInt(savedPosition),
            behavior: "smooth"
        });

        // Remove stored scroll position after restoring
        localStorage.removeItem("scrollPosition");
    }
    readMoreButtons.forEach((btn) => {
            btn.addEventListener("click", function () {
                const targetId = this.getAttribute("data-target");
                const content = document.getElementById(targetId);
                if (content.style.display === "block") {
                    content.style.display = "none";
                    this.textContent = "Read More >>";
                } else {
                    content.style.display = "block";
                    this.textContent = "Read Less <<";
                }
            });
        });
    // Toggle expansion on button click

    
    // Toggle expansion on button click
    // Open modal and load specific content
    learnMoreButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            const content = document.getElementById(targetId).innerHTML;

            // Load the selected content into the modal
            modalBody.innerHTML = content;
            modal.style.display = "flex";
        });
    });

    // Close modal when clicking "X"
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close modal when clicking outside the modal-content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });


    // Auto-collapse expanded content when swiping slides
    $(".main_home_slider").on("beforeChange", function () {
        expandedContents.forEach(content => content.style.display = "none");
        readMoreButtons.forEach(btn => btn.textContent = "Read More >>");
    });
});
// Function to scroll up to create space for the expanded content
function scrollSomeUp(expandedContent) {
    const screenHeight = window.innerHeight;
    const expandedHeight = screenHeight / 3; // Targeting 1/3 of screen height
    const btnPosition = expandedContent.getBoundingClientRect().top + window.pageYOffset;
    const scrollTarget = btnPosition - expandedHeight; // Adjusting the scroll position

    window.scrollTo({
        top: scrollTarget,
        behavior: "smooth"
    });
}
/*
function scrollSomeUp() {
    // Get all elements with class "home_btn"
    const homeButtons = document.querySelectorAll('.rtn_pt');

    homeButtons.forEach((btn) => {
        btn.addEventListener('click', function () {
            // Get the position of the clicked button
            const returnPosition = btn.getBoundingClientRect().top + window.pageYOffset;

            // Scroll to the button smoothly
            window.scrollTo({
                top: returnPosition - 600, // Adjust this value if needed
                behavior: 'smooth'
            });
        });
    });
}*/
