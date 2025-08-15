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
});
