// Portfolio Configuration and Language Switching
// =============================================

// Magnific Popup Configuration
$(document).ready(function() {
    // Configure image gallery
    $('#two').magnificPopup({
        delegate: '.work-item a.image:not(.video-link)',
        type: 'image',
        gallery: {
            enabled: true,
            navigateByImgClick: true
        },
        image: {
            titleSrc: function(item) {
                return item.el.next('h3').text();
            }
        }
    });
    
    // Configure video popup separately
    $('.video-link').magnificPopup({
        type: 'iframe',
        iframe: {
            patterns: {
                youtube: {
                    index: 'youtube.com/',
                    id: 'v=',
                    src: '//www.youtube.com/embed/%id%?autoplay=1'
                }
            }
        }
    });
});

// Language switching functionality
let currentLanguage = 'en';

function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update button states
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    document.getElementById('lang-es').classList.toggle('active', lang === 'es');
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update all translatable elements
    const translatableElements = document.querySelectorAll('[data-en], [data-es]');
    translatableElements.forEach(element => {
        const translation = element.getAttribute(`data-${lang}`);
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-en-placeholder], [data-es-placeholder]');
    placeholderElements.forEach(element => {
        const placeholder = element.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });
    
    // Update input values
    const valueElements = document.querySelectorAll('[data-en-value], [data-es-value]');
    valueElements.forEach(element => {
        const value = element.getAttribute(`data-${lang}-value`);
        if (value) {
            element.value = value;
        }
    });
    
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
        switchLanguage(savedLanguage);
    }

    // Smart YouTube thumbnail loader with multi-size fallback
    const videoLinks = document.querySelectorAll('.video-link');
    videoLinks.forEach(function(linkEl) {
        const href = linkEl.getAttribute('href') || '';
        const videoId = extractYouTubeId(href);
        if (!videoId) return;

        const imgEl = linkEl.querySelector('img');
        if (!imgEl) return;

        // If already using a local/non-YouTube image, don't override it
        const currentSrc = imgEl.getAttribute('src') || '';
        if (currentSrc && !/img\.youtube\.com\//.test(currentSrc)) {
            return;
        }

        setBestYouTubeThumbnail(imgEl, videoId);
    });
});

// Extracts a YouTube video ID from common URL formats
function extractYouTubeId(url) {
    try {
        // Short URL e.g. https://youtu.be/VIDEOID
        var shortMatch = url.match(/youtu\.be\/([\w-]{11})/);
        if (shortMatch && shortMatch[1]) return shortMatch[1];

        // watch?v=VIDEOID
        var watchMatch = url.match(/[?&]v=([\w-]{11})/);
        if (watchMatch && watchMatch[1]) return watchMatch[1];

        // embed/VIDEOID
        var embedMatch = url.match(/embed\/([\w-]{11})/);
        if (embedMatch && embedMatch[1]) return embedMatch[1];
    } catch (e) {}
    return null;
}

// Attempts multiple thumbnail sizes and avoids the grey 120x90 placeholder
function setBestYouTubeThumbnail(targetImgEl, videoId) {
    var sizes = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default'];
    var attemptIndex = 0;

    function attemptNext() {
        if (attemptIndex >= sizes.length) return; // Give up, keep whatever is set
        var size = sizes[attemptIndex++];
        var url = 'https://img.youtube.com/vi/' + videoId + '/' + size + '.jpg';

        var probe = new Image();
        probe.onload = function() {
            // YouTube grey placeholder is typically 120x90 or very small
            if ((probe.naturalWidth <= 120 && probe.naturalHeight <= 90) || probe.naturalWidth === 0) {
                attemptNext();
                return;
            }
            targetImgEl.src = url;
        };
        probe.onerror = function() {
            attemptNext();
        };
        probe.src = url;
    }

    attemptNext();
}
