import { useEffect } from "react";
import { useLang } from "../../context/LanguageContext";
import SEO from "../../components/SEO/SEO";
import { getOptimizedUrl, getSrcSet } from "../../data/photos";
import useEmblaCarousel from "embla-carousel-react";
import "./PricelistPage.css";

const pricingData = {
  it: [
    {
      title: "Inviti personalizzati",
      price: "Da 10€",
      image: "images/inviti.jpeg",
      description: "Rendi unico il tuo evento fin dal primo dettaglio con inviti digitali personalizzati, curati nello stile e nel design. Perfetti per compleanni, feste ed eventi speciali. Pratici, raffinati e pronti da condividere in pochi istanti.",
      features: [
        "Invito digitale personalizzato",
        "Design curato e raffinato",
        "Perfetti per compleanni, feste ed eventi speciali",
        "Pratici, raffinati e pronti da condividere in pochi istanti",
        "Consegna rapida"
      ],
      popular: false,
    },
    {
      title: "Fotolibri per eventi",
      price: "Da 60€",
      image: "images/fotolibro.jpeg",
      description: "Oltre agli scatti, realizzo fotolibri personalizzati per custodire i ricordi più belli dei tuoi eventi: compleanni, diciottesimi, cerimonie e occasioni uniche. Ogni dettaglio è curato con eleganza, per trasformare le tue fotografie in una storia da sfogliare, rivivere e condividere nel tempo.",
      features: [
        "Fotolibro personalizzato",
        "Design elegante",
        "Perfetti per compleanni, feste ed eventi speciali",
        "Ricordi sempre a portata di libro",
        "Consegna rapida"
      ],
      popular: false,
    },
    {
      title: "Eventi",
      price: "Da 150€",
      image: "images/shooting.jpeg",
      description: "Ci sono momenti che passano in un attimo... ma restano per sempre nel cuore. Battesimi, comunioni, compleanni: emozioni vere, sorrisi spontanei, ricordi preziosi. Io sarò lì per raccontarli, così potrai riviverli ogni volta che vorrai.",
      features: [
        "Copertura completa",
        "Tutte le foto più belle",
        "Post-produzione curata",
        "Consegna entro 2 settimane",
        "Cofanetto USB elegante + album fotografico",
        "Possibilità di aggiungere un fotolibro",
        "Possibilità di aggiungere stampe",
        "Possibilità di avere un link dedicato per la condivisione con amici e parenti"
      ],
      popular: true,
    },
    {
      title: "Biglietti da visita",
      price: "Da 10€",
      image: "images/biglietti-visita.jpeg",
      description: "Progettazione e stampa di biglietti da visita personalizzati, curati nello stile e nel design. Perfetti per compleanni, feste ed eventi speciali ed altre occasioni. Pratici, raffinati e pronti da condividere in pochi istanti.",
      features: [
        "Biglietto da visita personalizzato",
        "Design curato e raffinato",
        "Perfetti per compleanni, feste ed eventi speciali",
        "Pratici, raffinati e pronti da condividere in pochi istanti",
        "Consegna rapida"
      ],
      popular: false,
    }
  ],
  en: [
    {
      title: "Custom Invitations",
      price: "From 10€",
      image: "images/inviti.jpeg",
      description: "Make your event unique from the very first detail with custom digital invitations, carefully styled and designed. Perfect for birthdays, parties, and special events. Practical, refined, and ready to share in moments.",
      features: [
        "Custom digital invitation",
        "Careful and refined design",
        "Perfect for birthdays, parties, and special events",
        "Practical, refined, and ready to share in moments",
        "Fast delivery"
      ],
      popular: false,
    },
    {
      title: "Event Photobooks",
      price: "From 60€",
      image: "images/fotolibro.jpeg",
      description: "In addition to photos, I create custom photobooks to preserve the most beautiful memories of your events: birthdays, 18ths, ceremonies, and unique occasions. Every detail is elegantly curated to turn your photographs into a story to leaf through, relive, and share over time.",
      features: [
        "Custom photobook",
        "Elegant design",
        "Perfect for birthdays, parties, and special events",
        "Memories always at hand in a book",
        "Fast delivery"
      ],
      popular: true,
    },
    {
      title: "Events",
      price: "From 150€",
      image: "images/shooting.jpeg",
      description: "There are moments that pass in an instant... but remain in the heart forever. Baptisms, communions, birthdays: true emotions, spontaneous smiles, precious memories. I will be there to capture them, so you can relive them whenever you want.",
      features: [
        "Full coverage",
        "All the best photos",
        "Careful post-production",
        "Delivery within 2 weeks",
        "Elegant USB box + photo album",
        "Option to add a photobook",
        "Option to add prints",
        "Option to have a dedicated link to share with friends and family"
      ],
      popular: false,
    },
    {
      title: "Business Cards",
      price: "From 10€",
      image: "images/biglietti-visita.jpeg",
      description: "Design and printing of custom business cards, carefully styled and designed. Perfect for birthdays, parties, special events, and other occasions. Practical, refined, and ready to share in moments.",
      features: [
        "Custom business card",
        "Careful and refined design",
        "Perfect for birthdays, parties, and special events",
        "Practical, refined, and ready to share in moments",
        "Fast delivery"
      ],
      popular: false,
    }
  ]
};

export default function PricelistPage() {
  const { lang } = useLang();
  const data = pricingData[lang];
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start"
  });

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title={lang === "it" ? "Listino Prezzi — Isabel Finaldi Photography" : "Pricelist — Isabel Finaldi Photography"}
        description={lang === "it" ? "Scopri i pacchetti fotografici e i prezzi per ritratti, eventi e matrimoni." : "Discover the photography packages and pricing for portraits, events, and weddings."}
      />

      {/* HEADER SECTION */}
      <section className="pricelist-header">
        <div className="container">
          <h1 className="section-title" style={{ marginTop: 'var(--space-xl)' }}>
            {lang === 'it' ? 'Listino' : 'Price'} <em>{lang === 'it' ? 'Prezzi' : 'List'}</em>
          </h1>
          <div className="section-divider" style={{ margin: "0 auto var(--space-lg)" }} />
          <p className="pricelist-lead">
            {lang === 'it'
              ? 'Benvenuti nel listino prezzi ufficiale di Isabel Finaldi Photography. In questa pagina troverai un elenco dettagliato dei miei servizi fotografici, pensati per catturare i tuoi momenti più preziosi. La trasparenza è al primo posto: esplora il mio listino prezzi per scoprire pacchetti chiari e flessibili per ogni esigenza. Ogni servizio è personalizzabile per adattarsi perfettamente alla tua visione. Sfoglia il listino per individuare la soluzione ideale per te.'
              : 'Welcome to the official price list of Isabel Finaldi Photography. On this page, you will find a detailed pricelist of my photography services, designed to capture your most precious moments. Transparency is my top priority: explore my price list to discover clear and flexible packages for every need. Each service can be customized to perfectly fit your vision. Browse the price list to find the ideal solution for you.'}
          </p>
        </div>
      </section>

      {/* PRICING GRID */}
      <section className="section pricelist-cards-section" itemScope itemType="https://schema.org/OfferCatalog">
        <meta itemProp="name" content={lang === 'it' ? 'Servizi fotografici' : 'Photography services'} />
        <div className="container pricelist-carousel-wrapper">
          <div className="embla" ref={emblaRef}>
            <div className="embla__container" style={{ display: 'flex' }}>
              {data.map((pack, index) => (
                <div key={index} className="embla__slide" style={{ flex: '0 0 var(--slide-size)', minWidth: 0, paddingLeft: '1rem' }}>
                  <div className={`pricing-card ${pack.popular ? 'pricing-card--popular' : ''}`} itemProp="itemListElement" itemScope itemType="https://schema.org/Offer">
                    {pack.popular && (
                      <div className="pricing-badge">
                        {lang === 'it' ? 'Più Richiesto' : 'Most Popular'}
                      </div>
                    )}

                    <div className="pricing-card-header">
                      <h3 className="pricing-title" itemProp="name">{pack.title}</h3>
                      <div className="pricing-price" itemProp="price">{pack.price}</div>
                      <meta itemProp="priceCurrency" content="EUR" />
                      {pack.image && (
                        <div className="pricing-image">
                          <img
                            src={getOptimizedUrl(`${import.meta.env.BASE_URL}${pack.image}`, 600)}
                            srcSet={getSrcSet(`${import.meta.env.BASE_URL}${pack.image}`)}
                            sizes="(max-width: 768px) 100vw, 400px"
                            alt={pack.title}
                            loading="lazy"
                          />
                        </div>
                      )}
                      <p className="pricing-description" itemProp="description">{pack.description}</p>
                    </div>

                    <div className="pricing-card-body">
                      <ul className="pricing-features">
                        {pack.features.map((feature, i) => (
                          <li key={i}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pricing-card-footer">
                      <a
                        href={`https://wa.me/393514791225?text=${encodeURIComponent(
                          lang === 'it'
                            ? 'Ciao, vorrei avere maggiori informazioni riguardo il pacchetto "' + pack.title + '"'
                            : 'Hello, I would like more information about the "' + pack.title + '" package'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn ${pack.popular ? 'btn-primary' : 'btn-outline'}`}
                      >
                        {lang === 'it' ? 'Richiedi Info' : 'Request Info'}
                        <span className="sr-only"> - {pack.title}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Navigation Buttons */}
          <button className="embla__prev" onClick={scrollPrev} aria-label="Previous slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="embla__next" onClick={scrollNext} aria-label="Next slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <div className="pricelist-custom">
            <h3>{lang === 'it' ? 'Cerchi qualcosa di diverso?' : 'Looking for something different?'}</h3>
            <p>
              {lang === 'it'
                ? 'Cerchi un\'offerta fuori dal listino prezzi standard? Se i pacchetti presenti in questo listino non si adattano perfettamente alle tue esigenze specifiche, non esitare a contattarmi. Come fotografa professionista, so che ogni evento è unico. Insieme a Isabel Finaldi Photography, potremo elaborare un preventivo personalizzato e su misura per il tuo progetto e il tuo budget. Raccontami la tua idea e creeremo insieme qualcosa di speciale, con prezzi sempre trasparenti.'
                : 'Looking for an offer outside the standard price list? If the packages in this pricelist don\'t perfectly fit your specific needs, please don\'t hesitate to contact me. As a professional photographer, I know every event is unique. Together with Isabel Finaldi Photography, we can create a custom quote tailored specifically to your project and budget. Tell me your ideas and we will create something special together, always with transparent prices.'}
            </p>
            <a
              href={`https://wa.me/393514791225?text=${encodeURIComponent(
                lang === 'it'
                  ? 'Ciao, vorrei avere maggiori informazioni per un preventivo personalizzato'
                  : 'Hello, I would like more information for a custom quote'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              {lang === 'it' ? 'Contattami ora' : 'Contact me now'}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
