// Content for the "Why Projects Fail" panel.
// Kept as plain data (no React) so it can be reused for LinkedIn posts, newsletters or a PDF.
// DRAFT – to be reviewed by Decarbo Engineering before publishing.

import { Language } from '../../i18n';

export interface FailureQuestion {
  topic: string;
  question: string;
  whyItFails: string;
  evidence: string;
}

export interface WhyProjectsFailContent {
  title: string;
  intro: string;
  whyItFailsLabel: string;
  evidenceLabel: string;
  questions: FailureQuestion[];
}

export const whyProjectsFailContent: Record<Language, WhyProjectsFailContent> = {
  de: {
    title: "Warum Projekte scheitern",
    intro: "Die meisten Biochar-Projekte scheitern nicht an der Technik, sondern an Annahmen, die nie überprüft wurden. Diese acht Fragen sollten Sie beantworten können, bevor Sie investieren.",
    whyItFailsLabel: "Warum Projekte hier scheitern",
    evidenceLabel: "Welche Nachweise Sie verlangen sollten",
    questions: [
      {
        topic: "Rohstoff",
        question: "Ist die Biomasse für die gesamte Projektlaufzeit gesichert – in Menge, Qualität, Wassergehalt und Preis?",
        whyItFails: "Rohstoffpreise und -verfügbarkeit ändern sich, sobald Wettbewerber auftreten. Schwankender Wassergehalt oder Fremdstoffe senken Durchsatz und Biochar-Qualität.",
        evidence: "Langfristige Lieferverträge, Analysen mehrerer Chargen, ein Plan B für Ersatzbiomasse."
      },
      {
        topic: "Biochar-Abnahme",
        question: "Wer kauft die Biochar, zu welchem Preis und für welche Anwendung?",
        whyItFails: "Ohne Abnehmer stapelt sich die Biochar auf dem Hof. Oft muss erst ein passendes Produkt entwickelt werden, in dem die Biochar eingesetzt wird – etwa Erdensubstrate, Zuschlagstoff in Beton oder Kunststoff oder Graphitersatz. Dieser Aufwand wird häufig unterschätzt. Außerdem ist nicht jede Anwendung als dauerhafte Kohlenstoffsenke anerkannt – das entscheidet über die Zertifikatserlöse.",
        evidence: "Absichtserklärungen oder Abnahmeverträge, ein Plan für Produktentwicklung und Anwendungstests, Logistik bis zum Endnutzer."
      },
      {
        topic: "Wärmeabnahme",
        question: "Gibt es überhaupt einen Wärmeabnehmer – auf welchem Temperaturniveau, und ganzjährig oder nur im Winter?",
        whyItFails: "Zuerst muss geklärt sein, ob Wärme direkt thermisch genutzt werden kann und ob das Temperaturniveau zum Bedarf passt, etwa Heizwasser oder Prozessdampf. Viele Business Cases rechnen zudem mit voller Wärmeabnahme über alle Volllaststunden. In der Realität fehlt im Sommer der Bedarf, und die Erlöse brechen ein.",
        evidence: "Benötigte Temperaturniveaus, Lastgänge des Abnehmers über ein ganzes Jahr, Wärmeliefervertrag, Konzept für Überschusswärme."
      },
      {
        topic: "Volllaststunden",
        question: "Sind die angenommenen Volllaststunden realistisch – auch im ersten Betriebsjahr?",
        whyItFails: "Inbetriebnahme, Wartung, Störungen und Rohstoffengpässe reduzieren die Laufzeit. Außerdem hängen die Volllaststunden von der Wärmeabnahme ab: Fehlt der Wärmebedarf, wird die Anlage gedrosselt oder abgeschaltet. Schon 1.000 Stunden weniger können die Amortisation um Jahre verschieben.",
        evidence: "Betriebsdaten von Referenzanlagen, Verfügbarkeitsgarantie des Herstellers, Abgleich mit dem Lastgang des Wärmeabnehmers, konservative Hochlaufkurve."
      },
      {
        topic: "Zertifizierung",
        question: "Nach welchem Standard wird zertifiziert, und ist der Weg bis zum verifizierten Zertifikat geklärt?",
        whyItFails: "Zertifizierung dauert länger und kostet mehr als erwartet. Fehlende Nachverfolgung der Biochar bis zur Anwendung kann Zertifikate ungültig machen.",
        evidence: "Gewählter Standard (z. B. EBC/WBC C-Sink, Isometric, Puro.earth, Rainbow oder Verra VM0044), Zeitplan, Kostenaufstellung für dMRV und Handel."
      },
      {
        topic: "LCA",
        question: "Basiert die CO₂-Senkenleistung auf einer projektspezifischen Ökobilanz – oder auf einem Pauschalwert?",
        whyItFails: "Transportwege, Trocknung und Strombezug können den LCA-Faktor deutlich senken. Ein zu optimistischer Wert überschätzt Zertifikatsmenge und Erlöse.",
        evidence: "Projektspezifische LCA nach anerkanntem Standard, offengelegte Annahmen zu Transport und Energie."
      },
      {
        topic: "Genehmigung",
        question: "Sind Genehmigungen, Emissionsgrenzwerte und Ausbringungsregeln für Standort und Rohstoff geklärt?",
        whyItFails: "Genehmigungsverfahren dauern oft länger als geplant. Biomassen, die mit einem Abfallschlüssel belegt sind (z. B. Altholz oder Grünschnitt), unterliegen dem Abfallrecht und strengeren Regeln für Verwertung und Ausbringung.",
        evidence: "Abstimmung mit der Genehmigungsbehörde, Emissionsprognose, rechtliche Prüfung der Biochar-Verwertung."
      },
      {
        topic: "Technologie",
        question: "Läuft die Technologie bereits mit genau diesem Rohstoff in vergleichbarer Größe?",
        whyItFails: "Eine Anlage, die mit Holzhackschnitzeln funktioniert, läuft nicht automatisch mit Stroh oder Gärresten. Fehlender Service vor Ort verlängert jeden Stillstand.",
        evidence: "Referenzanlagen mit gleichem Rohstoff, Leistungsgarantien, Servicevertrag und Ersatzteilverfügbarkeit."
      }
    ]
  },
  en: {
    title: "Why Projects Fail",
    intro: "Most biochar projects don't fail because of the technology, but because of assumptions nobody checked. You should be able to answer these eight questions before you invest.",
    whyItFailsLabel: "Why projects fail here",
    evidenceLabel: "What evidence to ask for",
    questions: [
      {
        topic: "Feedstock",
        question: "Is the biomass secured for the full project lifetime – in quantity, quality, moisture content and price?",
        whyItFails: "Feedstock prices and availability change as soon as competitors appear. Fluctuating moisture or contaminants reduce throughput and biochar quality.",
        evidence: "Long-term supply contracts, analyses of several batches, a plan B for substitute biomass."
      },
      {
        topic: "Biochar offtake",
        question: "Who buys the biochar, at what price, and for which application?",
        whyItFails: "Without buyers, biochar piles up on site. Often a suitable product has to be developed first – such as soil substrates, an additive in concrete or plastics, or a graphite substitute. This effort is often underestimated. Also, not every application is recognised as a permanent carbon sink – which determines certificate revenue.",
        evidence: "Letters of intent or offtake contracts, a plan for product development and application trials, logistics to the end user."
      },
      {
        topic: "Heat offtake",
        question: "Is there a heat customer at all – at what temperature level, and year-round or only in winter?",
        whyItFails: "First you need to know whether the heat can be used directly and whether its temperature level matches the demand, such as hot water or process steam. Many business cases also assume all heat is sold across all full-load hours. In reality, summer demand is missing and revenue collapses.",
        evidence: "Required temperature levels, the customer's load profile over a full year, a heat supply contract, a concept for surplus heat."
      },
      {
        topic: "Full-load hours",
        question: "Are the assumed full-load hours realistic – including in the first year of operation?",
        whyItFails: "Commissioning, maintenance, breakdowns and feedstock shortages reduce run time. Full-load hours also depend on heat offtake: without heat demand, the plant is throttled or shut down. Just 1,000 fewer hours can push payback back by years.",
        evidence: "Operating data from reference plants, the manufacturer's availability guarantee, a check against the heat customer's load profile, a conservative ramp-up curve."
      },
      {
        topic: "Certification",
        question: "Which standard will certify the project, and is the path to a verified certificate clear?",
        whyItFails: "Certification takes longer and costs more than expected. Missing tracking of the biochar to its final application can invalidate certificates.",
        evidence: "Chosen standard (e.g. EBC/WBC C-Sink, Isometric, Puro.earth, Rainbow or Verra VM0044), timeline, cost breakdown for dMRV and trading."
      },
      {
        topic: "LCA",
        question: "Is the CO₂ removal based on a project-specific life cycle assessment – or on a generic value?",
        whyItFails: "Transport distances, drying and grid electricity can lower the LCA factor significantly. An optimistic value overstates certificate volume and revenue.",
        evidence: "A project-specific LCA under a recognised standard, disclosed assumptions on transport and energy."
      },
      {
        topic: "Permits",
        question: "Are permits, emission limits and application rules clear for the site and the feedstock?",
        whyItFails: "Permitting often takes longer than planned. Biomass classified as waste with a waste code (e.g. waste wood or green cuttings) falls under waste law and stricter rules on use and application.",
        evidence: "Early alignment with the permitting authority, an emissions forecast, a legal review of biochar use."
      },
      {
        topic: "Technology",
        question: "Is the technology already running on exactly this feedstock at a comparable scale?",
        whyItFails: "A plant that works with wood chips won't automatically run on straw or digestate. Missing local service turns every outage into a long one.",
        evidence: "Reference plants with the same feedstock, performance guarantees, a service contract and spare-part availability."
      }
    ]
  }
};
