import ScrollReveal from 'scrollreveal';

const sr = ScrollReveal();

sr.reveal('.about-list__item', {
  interval: 100,
  distance: '50px',
  origin: 'bottom',
});

sr.reveal('.faq__question-wrapper', {
  interval: 100,
  distance: '50px',
  origin: 'bottom',
});
