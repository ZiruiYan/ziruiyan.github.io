$(document).ready(function() {

  // Variables
  var $codeSnippets = $('.code-example-body'),
      $nav = $('.navbar'),
      $body = $('body'),
      $window = $(window),
      $popoverLink = $('[data-popover]'),
      navOffsetTop = $nav.offset().top,
      $document = $(document),
      publicationRequests = {},
      softPublicationNavigation = false,
      entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
      }

  function init() {
    $window.on('scroll', onScroll)
    $window.on('resize', resize)
    $window.on('popstate', reloadPublication)
    $popoverLink.on('click', openPopover)
    $document.on('click', closePopover)
    $document.on('click', '.publication-next', openNextPublication)
    $('a[href^="#"]').on('click', smoothScroll)
    onScroll()
    prefetchNextPublication()
    buildSnippets();
  }

  function fetchPublication(url) {
    var requestUrl = new URL(url, window.location.href)
    requestUrl.hash = ''
    requestUrl = requestUrl.href

    if (!publicationRequests[requestUrl]) {
      publicationRequests[requestUrl] = $.get(requestUrl).fail(function() {
        delete publicationRequests[requestUrl]
      })
    }

    return publicationRequests[requestUrl]
  }

  function prefetchNextPublication() {
    var nextUrl = $('.publication-next').attr('href')

    if (nextUrl) {
      fetchPublication(nextUrl)
    }
  }

  function syncMetadata(parsedDocument) {
    var selectors = [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:type"]',
      'meta[property="og:url"]',
      'link[rel="canonical"]'
    ]

    document.title = parsedDocument.title

    selectors.forEach(function(selector) {
      var currentElement = document.head.querySelector(selector),
          nextElement = parsedDocument.head.querySelector(selector)

      if (currentElement && nextElement) {
        currentElement.replaceWith(nextElement.cloneNode(true))
      }
    })

    document.head.querySelectorAll('meta[name^="citation_"]').forEach(function(element) {
      element.remove()
    })
    parsedDocument.head.querySelectorAll('meta[name^="citation_"]').forEach(function(element) {
      document.head.appendChild(element.cloneNode(true))
    })
  }

  function showPublication(html, url) {
    var parsedDocument = new DOMParser().parseFromString(html, 'text/html'),
        currentPublication = document.getElementById('publication'),
        nextPublication = parsedDocument.getElementById('publication'),
        currentNavigation = currentPublication.querySelector('.publication-bottom-nav'),
        nextNavigation = nextPublication && nextPublication.querySelector('.publication-bottom-nav'),
        currentNext = currentNavigation && currentNavigation.querySelector('.publication-next'),
        nextNext = nextNavigation && nextNavigation.querySelector('.publication-next')

    if (!currentPublication || !nextPublication) {
      window.location.assign(url)
      return
    }

    if (currentNavigation && nextNavigation) {
      if (currentNext && nextNext) {
        currentNext.href = nextNext.href
        currentNext.innerHTML = nextNext.innerHTML
        currentNext.setAttribute('aria-label', nextNext.getAttribute('aria-label'))
      } else if (currentNext) {
        currentNext.remove()
      } else if (nextNext) {
        currentNavigation.appendChild(nextNext.cloneNode(true))
      }
      nextNavigation.replaceWith(currentNavigation)
    }

    currentPublication.replaceWith(nextPublication)
    syncMetadata(parsedDocument)
    softPublicationNavigation = true
    window.history.pushState({ publication: true }, '', url)

    var publicationTop = $('#publication').offset().top,
        visibleNavHeight = $nav.is(':visible') ? $nav.outerHeight() : 0

    window.scrollTo(0, Math.max(0, publicationTop - visibleNavHeight - 20))
    onScroll()
    prefetchNextPublication()
  }

  function openNextPublication(e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.which !== 1) {
      return
    }

    e.preventDefault()
    var url = this.href

    fetchPublication(url).done(function(html) {
      showPublication(html, url)
    }).fail(function() {
      window.location.assign(url)
    })
  }

  function reloadPublication() {
    if (softPublicationNavigation) {
      window.location.reload()
    }
  }

  function smoothScroll(e) {
    e.preventDefault();
    $(document).off("scroll");
    var target = this.hash,
        menu = target;
    $target = $(target);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top-40
    }, 0, 'swing', function () {
        window.location.hash = target;
        $(document).on("scroll", onScroll);
    });
  }

  function openPopover(e) {
    e.preventDefault()
    closePopover();
    var popover = $($(this).data('popover'));
    popover.toggleClass('open')
    e.stopImmediatePropagation();
  }

  function closePopover(e) {
    if($('.popover.open').length > 0) {
      $('.popover').removeClass('open')
    }
  }

  $("#button").click(function() {
    $('html, body').animate({
        scrollTop: $("#elementtoScrollToID").offset().top
    }, 2000);
});

  function resize() {
    $body.removeClass('has-docked-nav')
    navOffsetTop = $nav.offset().top
    onScroll()
  }

  function onScroll() {
    if(navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
      $body.addClass('has-docked-nav')
    }
    if(navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
      $body.removeClass('has-docked-nav')
    }
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function buildSnippets() {
    $codeSnippets.each(function() {
      var newContent = escapeHtml($(this).html())
      $(this).html(newContent)
    })
  }


  init();

});
