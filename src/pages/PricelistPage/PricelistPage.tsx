import { useEffect } from "react";
import { useLang } from "../../context/LanguageContext";
import SEO from "../../components/SEO/SEO";
import "./PricelistPage.css";

const pricingData = {
  it: [
    {
      title: "Inviti personalizzati",
      price: "Da 10€",
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
      description: "Oltre agli scatti, realizzo fotolibri personalizzati per custodire i ricordi più belli dei tuoi eventi: compleanni, diciottesimi, cerimonie e occasioni uniche. Ogni dettaglio è curato con eleganza, per trasformare le tue fotografie in una storia da sfogliare, rivivere e condividere nel tempo.",
      features: [
        "Fotolibro personalizzato",
        "Design elegante",
        "Perfetti per compleanni, feste ed eventi speciali",
        "Ricordi sempre a portata di libro",
        "Consegna rapida"
      ],
      popular: true,
    },
    {
      title: "Eventi",
      price: "Da 150€",
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
      popular: false,
    }
  ],
  en: [
    {
      title: "Custom Invitations",
      price: "From 10€",
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
    }
  ]
};

export default function PricelistPage() {
  const { lang, t } = useLang();
  const data = pricingData[lang];

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
              ? 'Trasparenza e pacchetti pensati per ogni tua esigenza. Ogni servizio è personalizzabile per adattarsi perfettamente alla tua visione.'
              : 'Transparency and packages designed for every need. Each service can be customized to perfectly fit your vision.'}
          </p>
        </div>
      </section>

      {/* PRICING GRID */}
      <section className="section pricelist-cards-section">
        <div className="container">
          <div className="pricelist-grid">
            {data.map((pack, index) => (
              <div key={index} className={`pricing-card ${pack.popular ? 'pricing-card--popular' : ''}`}>
                {pack.popular && (
                  <div className="pricing-badge">
                    {lang === 'it' ? 'Più Richiesto' : 'Most Popular'}
                  </div>
                )}

                <div className="pricing-card-header">
                  <h3 className="pricing-title">{pack.title}</h3>
                  <div className="pricing-price">{pack.price}</div>
                  <p className="pricing-description">{pack.description}</p>
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
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="pricelist-custom">
            <h3>{lang === 'it' ? 'Cerchi qualcosa di diverso?' : 'Looking for something different?'}</h3>
            <p>
              {lang === 'it'
                ? 'Se i pacchetti standard non si adattano alle tue esigenze, contattami per un preventivo personalizzato su misura per il tuo progetto e il tuo budget.'
                : 'If the standard packages don\'t fit your needs, contact me for a custom quote tailored to your project and budget.'}
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
