// Warm Signal — minimal site JS.
// Smooth-scroll for in-page anchor links. (Dark mode and the contact form
// were removed in the redesign; the RAG chat logic lives in mohamed-rag.html.)

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#top') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - 12,
                    behavior: 'smooth'
                });
            }
        });
    });
});
