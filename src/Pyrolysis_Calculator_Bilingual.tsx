// ========================================
// TEIL 1 von 5: Imports, Translations und State Setup
// ========================================
// Last Updated: 2025-11-26
// Version: 2.0.1
// Changes: Biochar price minimum value set to 0 EUR
// Status: Production Ready

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Calculator, Zap, Flame, Droplets, Leaf, Info, Globe, FileDown } from 'lucide-react';
import emailjs from '@emailjs/browser';
import decarboLogo from './assets/decarbo-logo.png';

// Translation object
const translations = {
  de: {
    title: "Pyrolyse-Anlagen Wirtschaftlichkeitsrechner",
    subtitle: "ENABLING NET-ZERO",
    tagline: "Produzieren Sie regenerative Energie und negative Emissionen mit Pyrolyse Anlagen",
    productSelection: "Produktauswahl",
    basicParameters: "Grundparameter",
    investmentCosts: "Investition & Kosten",
    biocharParams: "Biochar Parameter",
    heatParams: "Wärme Parameter",
    electricityParams: "Strom Parameter",
    bioOilParams: "Bio-Öl Parameter",
    economicAnalysis: "Wirtschaftlichkeits KPIs",
    revenueHeat: "Umsatz Wärme",
    revenueElectricity: "Umsatz Strom",
    revenueBioOil: "Umsatz Bio-Öl",
    revenueBiochar: "Umsatz Biokohle",
    revenueCertificates: "Umsatz Zertifikate",
    biochar: "Biochar (Pflanzenkohle)",
    standardProduct: "(Standardprodukt)",
    heatGeneration: "Wärmeerzeugung",
    electricityGeneration: "Stromerzeugung",
    bioOilProduction: "Bio-Öl Produktion",
    fuelHeatValue: "Heizwert des Brennstoffs (max. 20% Wasseranteil)",
    fuelHeatValueInfo: "Holzartige Brennstoffe haben etwa einen Heizwert von 4 kWh/kg. Weichhölzer liegen in der Regel etwas darüber und Harthölzer entsprechend etwas niedriger. Reststoffe und halmgutartige Brennstoffe haben in der Regel einen geringeren Heizwert.",
    moreInfo: "→ Weitere Informationen zu Heizwerten",
    combustionPower: "Feuerungsleistung",
    usableThermalPower: "Nutzbare thermische Leistung",
    plantCapacity: "Anlagendurchsatz",
    operatingHours: "Volllaststunden/Jahr",
    projectLifetime: "Projektlaufzeit",
    years: "Jahre",
    electricalPower: "Elektrische Nennleistung",
    electricalPowerInfo: "Je nach Anlagengröße und Typ fallen unterschiedliche elektrische Verbrauchsleistungen an. Die Angabe hier bezieht sich auf die durchschnittliche Last, die die gesamte Anlage produziert oder benötigt. Wichtig ist: Es gibt autotherme Anlagen, die die thermische Energie aus der Feuerung nutzen, um den Prozess aufrechtzuerhalten, und es gibt strombasierte Anlagen, die Strom beziehen, um die Biomasse zu erhitzen. Dieser kann aus der eigenen Produktion stammen oder aus dem Netz bezogen werden. Hier ist auf die Hersteller- und Projektdaten zu achten.",
    thermalEfficiency: "Thermischer Wirkungsgrad",
    thermalEfficiencyInfo: "Der thermische Wirkungsgrad beschreibt den Anteil der Feuerungsleistung, der als nutzbare Wärme verfügbar ist. Der thermische Wirkungsgrad liegt in der Regel unterhalb von 50%, da ca. 25% der Biomasse in hochkalorische Biokohle umgewandelt werden, die nicht thermisch verwertet wird. Der verbleibende Prozessverlust entsteht durch Strahlungs- und Konvektionsverluste sowie incomplete Verbrennung.",
    annualElectricityConsumption: "Jährlicher Stromverbrauch",
    grossElectricityConsumption: "Bruttostromverbrauch",
    netElectricityConsumption: "Nettostromverbrauch",
    electricityConsumptionPrice: "Strompreis (Verbrauch)",
    annualElectricityCost: "Jährliche Stromkosten",
    totalInvestment: "Gesamtinvestitionskosten",
    discountRate: "Kalkulationszins",
    discountRateInfo: "Der voreingestellte kalkulatorische Zinssatz beträgt 6 %. Dieser Wert orientiert sich an typischen branchenüblichen Annahmen für technische Investitionen und bildet sowohl Fremdkapitalkosten als auch den Renditeanspruch des eingesetzten Eigenkapitals ab.",
    feedstockCost: "Rohstoffkosten",
    laborCost: "Personalkosten",
    perYear: "€/Jahr",
    maintenanceCost: "Wartungskosten",
    maintenanceInfo: "Wartungskosten können variieren je nach Projekt, Anlagentyp und Biomasse, aber als Orientierung kann man mit 2,5% anlagenbezogenen Investitionskosten rechnen.",
    biocharYield: "Biochar Ausbeute",
    ofFeedstock: "vom Rohstoff",
    biocharProduction: "Biochar Produktion",
    biocharPrice: "Biochar Preis",
    biocharPriceInfo: "Der Marktpreis für Biokohle variiert erheblich in Abhängigkeit von Substrat, Anwendungsbereich, Vermarktungsstrategie, Vertriebskanälen und regionalem Standort. Für die Bodenanwendung in Europa kann ein konservativer Richtwert von 300 €/t angesetzt werden. Für spezifische Anwendungsfälle und alternative Absatzmärkte empfehlen wir eine individuelle Preisanalyse.",
    lcaFactor: "LCA Faktor",
    lcaFactorInfo: "Der LCA-Faktor beschreibt die tatsächliche CO₂-Senkenleistung der produzierten Biokohle unter Berücksichtigung aller Prozessemissionen. Was wird berücksichtigt? Biomasse-Logistik (Transport zur Anlage), Vorbehandlung und Trocknung, Energieverbrauch der Pyrolyseanlage, Nachbehandlung und Konfektionierung, Transport und Ausbringung der Biokohle. Berechnung: Physikalisch entspricht 1 kg gebundener Kohlenstoff in der Biokohle ca. 3,67 kg CO₂. Von diesem theoretischen Maximum werden die Lebenszyklusemissionen abgezogen, um die netto CO₂-Senkenleistung zu ermitteln. Typische Werte: Optimierte Anlagen: 2,5 - 3,0 tCO₂/t Biokohle; Durchschnittliche Anlagen: 2,0 - 2,5 tCO₂/t Biokohle; Konservative Kalkulation: 2,4 tCO₂/t Biokohle (Standardwert). Wichtig: Der finale LCA-Faktor ist projektspezifisch und erfordert eine detaillierte Lebenszyklusanalyse nach anerkannten Standards.",
    co2RemovalPrice: "CO₂ Removal Credit Preis",
    co2RemovalPriceInfo: "Der CO₂ Removal Credit Preis beschreibt den Marktwert für gehandelte CO₂-Entnahmezertifikate (Carbon Dioxide Removal, CDR). Die angegebenen Preise orientieren sich an aktuellen Marktdurchschnitten. Den tagesaktuellen Durchschnittspreis für gehandelte CO₂-Entnahmezertifikate finden Sie auf der Website www.cdr.fyi. Es ist wichtig zu beachten, dass auch höhere Preise erzielbar sind. Diese hängen stark von der Vermarktungsstrategie des Gesamtprojekts ab, einschließlich: Zertifizierungsstandards und deren Anerkennung, Transparenz und Nachverfolgung (Tracking), Kundengruppe und deren Bereitschaft zu Premium-Zahlung, und Langfristigkeit der Abnahmeverträge. Eine professionelle Vermarktungsstrategie kann daher erheblich zu besseren Preisen beitragen.",
    annualRevenues: "Jährliche Erträge",
    biocharSalesRevenue: "Erträge aus Biochar Verkauf",
    co2CertificateRevenue: "Erträge aus CO₂ Entnahme Zertifikaten",
    totalBiocharRevenue: "Gesamt Biochar-Erträge",
    calculatedThermalPower: "Berechnete Feuerungsleistung",
    thermalRatedPower: "Thermische Nennleistung (ca. 45%)",
    annualHeatProduction: "Jährlich produzierte Wärmeenergie",
    heatSoldPercentage: "Anteil verkaufter Wärme",
    heatSalePrice: "Verkaufswärme Preis",
    annualHeatRevenue: "Jährliche Wärme-Erlöse",
    electricityYield: "Stromausbeute (% Energieinhalt)",
    electricityProduction: "Stromproduktion",
    electricitySalesRevenue: "Umsatz Stromverkauf",
    electricityPrice: "Strompreis (€/kWh)",
    additionalInvestment: "Zusätzliche Investition (€)",
    bioOilYield: "Bio-Öl Ausbeute (% vom Rohstoff)",
    bioOilPrice: "Bio-Öl Preis (€/t)",
    npv: "Kapitalwert (NPV)",
    irr: "Interner Zinsfuß (IRR)",
    paybackPeriod: "Amortisationszeit",
    annualCashFlow: "Jährl. Cash Flow",
    cumulativeCashFlow: "Kumulierter Cash Flow",
    cumulative: "Kumuliert",
    annualRevenueVsCosts: "Jährliche Erlöse vs. Kosten",
    revenues: "Erlöse",
    costs: "Kosten",
    cashFlow: "Cash Flow",
    investmentSummary: "Invest KPIs",
    totalInvestmentLabel: "Gesamtinvestition",
    annualRevenuesLabel: "Jährliche Erlöse",
    annualCostsLabel: "Jährliche Kosten",
    revenueBreakdownChart: "Umsatzverteilung",
    biocharRevenue: "Biochar Erlöse",
    heatRevenue: "Wärme Erlöse",
    electricityRevenue: "Strom Erlöse",
    bioOilRevenue: "Bio-Öl Erlöse",
    generatePdfReport: "PDF-Bericht erstellen",
    generatingPdf: "PDF wird erstellt...",
    pdfReportTitle: "Wirtschaftlichkeitsanalyse - Pyrolyse-Anlage",
    inputParameters: "Eingabeparameter",
    financialResults: "Finanzielle Ergebnisse",
    revenueBreakdown: "Erlös-Aufschlüsselung",
    revenueDistribution: "Umsatzverteilung",
    biocharSales: "Biochar-Verkauf",
    co2Certificates: "CO₂-Zertifikate",
    certificateRevenue: "Umsatz Zertifikate",
    heatSales: "Wärme-Verkauf",
    electricitySales: "Strom-Verkauf",
    bioOilSales: "Bio-Öl-Verkauf",
    beforeDownload: "Bitte geben Sie Ihre Daten ein, um das PDF herunterzuladen",
    yourName: "Ihr Name",
    yourEmail: "Ihre E-Mail",
    namePlaceholder: "Max Mustermann",
    emailPlaceholder: "max@firma.de",
    nameRequired: "Name ist erforderlich",
    emailRequired: "E-Mail ist erforderlich",
    emailInvalid: "Bitte geben Sie eine gültige E-Mail ein",
    contactConsent: "Ich möchte von Decarbo Engineering für weitere technische Unterstützung kontaktiert werden",
    toolUsageNote: "Sie können dieses Tool gerne nutzen, um einen ersten Eindruck von Ihrem Projekt zu erhalten. Wenn Sie bereit sind, können Sie sich jederzeit für weitere Unterstützung an uns wenden.",
    downloadPdf: "PDF herunterladen",
    co2RemovalKpis: "CO₂ Entnahme KPIs",
    annualCo2SinkingPerformance: "Jährliche CO₂ Senkenleistung",
    totalCo2Removal: "CO₂ Entfernt über Projektlaufzeit"
  },
  en: {
    title: "Pyrolysis Plant Economic Calculator",
    subtitle: "ENABLING NET-ZERO",
    tagline: "Produce renewable energy and negative emissions with pyrolysis plants",
    productSelection: "Product Selection",
    basicParameters: "Basic Parameters",
    investmentCosts: "Investment & Costs",
    biocharParams: "Biochar Parameters",
    heatParams: "Heat Parameters",
    electricityParams: "Electricity Parameters",
    bioOilParams: "Bio-Oil Parameters",
    economicAnalysis: "Economic KPIs",
    revenueHeat: "Heat Revenue",
    revenueElectricity: "Electricity Revenue",
    revenueBioOil: "Bio-Oil Revenue",
    revenueBiochar: "Biochar Revenue",
    revenueCertificates: "Certificate Revenue",
    biochar: "Biochar",
    standardProduct: "(Standard Product)",
    heatGeneration: "Heat Generation",
    electricityGeneration: "Electricity Generation",
    bioOilProduction: "Bio-Oil Production",
    fuelHeatValue: "Fuel Heating Value (max. 20% moisture)",
    fuelHeatValueInfo: "Wood-like fuels have a heating value of approximately 4 kWh/kg. Softwoods are usually slightly higher and hardwoods correspondingly lower. Residues and herbaceous fuels typically have a lower heating value.",
    moreInfo: "→ More information on heating values",
    combustionPower: "Combustion Power",
    usableThermalPower: "Usable Thermal Power",
    plantCapacity: "Plant Capacity",
    operatingHours: "Operating Hours/Year",
    projectLifetime: "Project Lifetime",
    years: "Years",
    electricalPower: "Electrical Rated Power",
    electricalPowerInfo: "Depending on plant size and type, different electrical power consumption levels occur. The specification here refers to the average load that the entire plant produces or requires. It is important to note: There are autothermal plants that use thermal energy from combustion to maintain the process, and there are electricity-based plants that purchase electricity to heat the biomass. This electricity can come from the plant's own production or from the grid. It is important to pay attention to manufacturer and project data.",
    thermalEfficiency: "Thermal Efficiency",
    thermalEfficiencyInfo: "Thermal efficiency describes the proportion of combustion power available as usable heat. Thermal efficiency typically lies below 50% because approximately 25% of the biomass is converted into high-calorific biochar that is not thermally recovered. The remaining process loss results from radiation and convection losses as well as incomplete combustion.",
    annualElectricityConsumption: "Annual Electricity Consumption",
    grossElectricityConsumption: "Gross Electricity Consumption",
    netElectricityConsumption: "Net Electricity Consumption",
    electricityConsumptionPrice: "Electricity Price (Consumption)",
    annualElectricityCost: "Annual Electricity Cost",
    totalInvestment: "Total Investment Costs",
    discountRate: "Discount Rate",
    discountRateInfo: "The default discount rate is 6%. This value is based on typical industry-standard assumptions for technical investments and reflects both debt capital costs and the return requirements of invested equity capital.",
    feedstockCost: "Feedstock Cost",
    laborCost: "Labor Cost",
    perYear: "€/year",
    maintenanceCost: "Maintenance Cost",
    maintenanceInfo: "Maintenance costs can vary depending on the project, plant type and biomass, but as a guideline, 2.5% of plant-related investment costs can be used.",
    biocharYield: "Biochar Yield",
    ofFeedstock: "of feedstock",
    biocharProduction: "Biochar Production",
    biocharPrice: "Biochar Price",
    biocharPriceInfo: "The market price for biochar varies significantly depending on substrate, application field, marketing strategy, distribution channels, and regional location. For soil application in Europe, a conservative reference value of €300/t can be assumed. For specific applications and alternative sales channels, we recommend individual price analysis.",
    lcaFactor: "LCA Factor",
    lcaFactorInfo: "The LCA factor describes the actual CO₂ removal performance of the produced biochar considering all process emissions. What is considered? Biomass logistics (transport to facility), pre-treatment and drying, energy consumption of the pyrolysis plant, post-treatment and packaging, transport and application of biochar. Calculation: Physically, 1 kg of bound carbon in biochar corresponds to approximately 3.67 kg CO₂. From this theoretical maximum, lifecycle emissions are subtracted to determine net CO₂ removal performance. Typical values: Optimized plants: 2.5 - 3.0 tCO₂/t biochar; Average plants: 2.0 - 2.5 tCO₂/t biochar; Conservative calculation: 2.4 tCO₂/t biochar (standard value). Important: The final LCA factor is project-specific and requires detailed lifecycle assessment according to recognized standards.",
    co2RemovalPrice: "CO₂ Removal Credit Price",
    co2RemovalPriceInfo: "The CO₂ Removal Credit Price describes the market value for traded CO₂ removal certificates (Carbon Dioxide Removal, CDR). The indicated prices are based on current market averages. You can find current average prices for traded CO₂ removal certificates on the website www.cdr.fyi. It is important to note that higher prices are achievable. These depend largely on the marketing strategy of the overall project, including: certification standards and their recognition, transparency and tracking, customer segment and willingness to pay premiums, and long-term offtake agreements. A professional marketing strategy can therefore contribute significantly to better prices.",
    annualRevenues: "Annual Revenues",
    biocharSalesRevenue: "Revenue from Biochar Sales",
    co2CertificateRevenue: "Revenue from CO₂ Removal Certificates",
    totalBiocharRevenue: "Total Biochar Revenue",
    calculatedThermalPower: "Calculated Thermal Power",
    thermalRatedPower: "Thermal Rated Power (approx. 45%)",
    annualHeatProduction: "Annual Heat Energy Production",
    heatSoldPercentage: "Percentage of Heat Sold",
    heatSalePrice: "Heat Sale Price",
    annualHeatRevenue: "Annual Heat Revenue",
    electricityYield: "Electricity Yield (% Energy Content)",
    electricityProduction: "Electricity Production",
    electricitySalesRevenue: "Electricity Sales Revenue",
    electricitySurplus: "Electricity Surplus",
    electricityPrice: "Electricity Price (€/kWh)",
    electricitySalePriceLabel: "Electricity Sale Price",
    additionalInvestment: "Additional Investment (€)",
    bioOilYield: "Bio-Oil Yield (% of feedstock)",
    bioOilPrice: "Bio-Oil Price (€/t)",
    npv: "Net Present Value (NPV)",
    irr: "Internal Rate of Return (IRR)",
    paybackPeriod: "Payback Period",
    annualCashFlow: "Annual Cash Flow",
    cumulativeCashFlow: "Cumulative Cash Flow",
    cumulative: "Cumulative",
    annualRevenueVsCosts: "Annual Revenue vs. Costs",
    revenues: "Revenues",
    costs: "Costs",
    cashFlow: "Cash Flow",
    investmentSummary: "Invest KPIs",
    totalInvestmentLabel: "Total Investment",
    annualRevenuesLabel: "Annual Revenues",
    annualCostsLabel: "Annual Costs",
    revenueBreakdownChart: "Revenue Distribution",
    biocharRevenue: "Biochar Revenue",
    heatRevenue: "Heat Revenue",
    electricityRevenue: "Electricity Revenue",
    bioOilRevenue: "Bio-Oil Revenue",
    generatePdfReport: "Generate PDF Report",
    generatingPdf: "Generating PDF...",
    pdfReportTitle: "Economic Analysis - Pyrolysis Plant",
    inputParameters: "Input Parameters",
    financialResults: "Financial Results",
    revenueBreakdown: "Revenue Breakdown",
    revenueDistribution: "Revenue Distribution",
    biocharSales: "Biochar Sales",
    co2Certificates: "CO₂ Certificates",
    certificateRevenue: "Certificate Revenue",
    heatSales: "Heat Sales",
    electricitySales: "Electricity Sales",
    bioOilSales: "Bio-Oil Sales",
    beforeDownload: "Please enter your details to download the PDF",
    yourName: "Your Name",
    yourEmail: "Your Email",
    namePlaceholder: "John Doe",
    emailPlaceholder: "john@company.com",
    nameRequired: "Name is required",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email",
    contactConsent: "I would like to be contacted by Decarbo Engineering for further engineering support",
    toolUsageNote: "Feel free to use this tool to get a first impression of your project. When you're ready, you can always reach out to us for further support.",
    downloadPdf: "Download PDF",
    co2RemovalKpis: "CO₂ Removal KPIs",
    annualCo2SinkingPerformance: "Annual CO₂ Sinking Performance",
    totalCo2Removal: "CO₂ Removed over Project Lifetime",
    heatingValuesTable: "Heating Values Reference Table",
    tableSymbol: "Symbol",
    tableBiomass: "Biomass",
    tableTS: "TS (%)",
    tableHeatingValueMJ: "Heating Value (MJ/kg)",
    tableHeatingValuekWh: "Heating Value (kWh/kg)"
  }
};

// Create a helper function to render the heating values table
const renderHeatingValuesTable = (language: string) => {
  const biomassList = language === 'de' ? [
    { icon: '🌲', name: 'Weichholz', ts: '80', mjkg: '14,8 – 15,6', kwhkg: '4,11 – 4,33' },
    { icon: '🌳', name: 'Hartholz', ts: '80', mjkg: '15,2 – 16,0', kwhkg: '4,22 – 4,44' },
    { icon: '💧', name: 'Klärschlamm', ts: '90', mjkg: '9,0 – 11,3', kwhkg: '2,50 – 3,14' },
    { icon: '🌾', name: 'Reisspelzen', ts: '80', mjkg: '12,0 – 13,2', kwhkg: '3,33 – 3,67' },
    { icon: '🌿', name: 'Stroh / Heu', ts: '85', mjkg: '12,3 – 14,5', kwhkg: '3,42 – 4,03' },
    { icon: '🍂', name: 'Grünschnitt', ts: '75', mjkg: '9,8 – 11,6', kwhkg: '2,72 – 3,22' },
    { icon: '🌰', name: 'Nussschalen', ts: '90', mjkg: '17,6 – 18,9', kwhkg: '4,89 – 5,25' },
    { icon: '🌽', name: 'Maisstroh', ts: '85', mjkg: '14,0 – 15,3', kwhkg: '3,89 – 4,25' },
    { icon: '☕', name: 'Kaffeebohnenschalen', ts: '90', mjkg: '18,0 – 19,8', kwhkg: '5,00 – 5,50' },
    { icon: '🥜', name: 'Oliventrester', ts: '85', mjkg: '15,5 – 17,0', kwhkg: '4,31 – 4,72' }
  ] : [
    { icon: '🌲', name: 'Softwood', ts: '80', mjkg: '14.8 – 15.6', kwhkg: '4.11 – 4.33' },
    { icon: '🌳', name: 'Hardwood', ts: '80', mjkg: '15.2 – 16.0', kwhkg: '4.22 – 4.44' },
    { icon: '💧', name: 'Sewage Sludge', ts: '90', mjkg: '9.0 – 11.3', kwhkg: '2.50 – 3.14' },
    { icon: '🌾', name: 'Rice Husks', ts: '80', mjkg: '12.0 – 13.2', kwhkg: '3.33 – 3.67' },
    { icon: '🌿', name: 'Straw / Hay', ts: '85', mjkg: '12.3 – 14.5', kwhkg: '3.42 – 4.03' },
    { icon: '🍂', name: 'Green Waste', ts: '75', mjkg: '9.8 – 11.6', kwhkg: '2.72 – 3.22' },
    { icon: '🌰', name: 'Nut Shells', ts: '90', mjkg: '17.6 – 18.9', kwhkg: '4.89 – 5.25' },
    { icon: '🌽', name: 'Corn Straw', ts: '85', mjkg: '14.0 – 15.3', kwhkg: '3.89 – 4.25' },
    { icon: '☕', name: 'Coffee Bean Hulls', ts: '90', mjkg: '18.0 – 19.8', kwhkg: '5.00 – 5.50' },
    { icon: '🥜', name: 'Olive Trester', ts: '85', mjkg: '15.5 – 17.0', kwhkg: '4.31 – 4.72' }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-blue-500/30">
            <th className="px-2 py-1 text-left">{language === 'de' ? 'Symbol' : 'Symbol'}</th>
            <th className="px-2 py-1 text-left">{language === 'de' ? 'Biomasse' : 'Biomass'}</th>
            <th className="px-2 py-1 text-center">TS (%)</th>
            <th className="px-2 py-1 text-center">{language === 'de' ? 'Heizwert (MJ/kg)' : 'Heating Value (MJ/kg)'}</th>
            <th className="px-2 py-1 text-center">{language === 'de' ? 'Heizwert (kWh/kg)' : 'Heating Value (kWh/kg)'}</th>
          </tr>
        </thead>
        <tbody className="text-gray-300">
          {biomassList.map((item, idx) => (
            <tr key={idx} className={idx < biomassList.length - 1 ? "border-b border-blue-500/20" : ""}>
              <td className="px-2 py-1 text-center">{item.icon}</td>
              <td className="px-2 py-1">{item.name}</td>
              <td className="px-2 py-1 text-center">{item.ts}</td>
              <td className="px-2 py-1 text-center">{item.mjkg}</td>
              <td className="px-2 py-1 text-center font-bold text-blue-300">{item.kwhkg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PyrolysisCalculator = () => {
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
  
  const [language, setLanguage] = useState('de');
  const t = translations[language];
  
  const [products, setProducts] = useState({
    biochar: true,
    heat: false,
    electricity: false,
    bioOil: false
  });

  const [inputs, setInputs] = useState({
    plantCapacity: 1000,
    fuelHeatValue: 3.8,
    operatingHours: 7000,
    projectLifetime: 10,
    discountRate: 6,
    electricalPower: 100,
    electricityConsumptionPrice: 0.25,
    thermalEfficiency: 45,
    initialInvestment: 3000000,
    feedstockCost: 50,
    laborCost: 50000,
    maintenanceCost: 500000 * 0.025, // 2.5% of total investment
    biocharYield: 25,
    biocharPrice: 300,
    lcaFactor: 2.4,
    co2RemovalPrice: 100,
    heatYield: 40,
    heatPrice: 0.08,
    heatInvestment: 50000,
    electricityYield: 25,
    electricityPrice: 0.15,
    electricityInvestment: 500000,
    bioOilYield: 20,
    bioOilPrice: 400,
    bioOilInvestment: 1000000
  });

  const [results, setResults] = useState({
    npv: 0,
    irr: 0,
    paybackPeriod: 0,
    annualCashFlows: [],
    cumulativeCashFlows: [],
    annualRevenue: 0,
    annualCosts: 0,
    totalInvestment: 0,
    revenueBreakdown: {
      biocharSales: 0,
      co2Certificates: 0,
      heatSales: 0,
      electricitySales: 0,
      bioOilSales: 0
    }
  });

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [contactConsent, setContactConsent] = useState(false);
  const [formErrors, setFormErrors] = useState({ name: '', email: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

// ========================================
// ENDE TEIL 1 - Weiter mit Teil 2
// ========================================
// ========================================
// TEIL 2 von 5: Helper Functions und Berechnungslogik
// ========================================
// WICHTIG: Dieser Teil kommt DIREKT nach Teil 1, innerhalb der PyrolysisCalculator-Komponente

  const formatNumber = (num, decimals = 0) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const [expandedInfo, setExpandedInfo] = useState<{ [key: string]: boolean }>({});

  const toggleInfo = (key: string) => {
    setExpandedInfo(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProductChange = (product) => {
    if (product === 'biochar') return;
    setProducts(prev => ({ ...prev, [product]: !prev[product] }));
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const calculateNPV = () => {
    const { plantCapacity, operatingHours, projectLifetime, discountRate, initialInvestment, feedstockCost, laborCost, maintenanceCost, biocharYield, biocharPrice, heatYield, heatPrice, heatInvestment, electricityYield, electricityPrice, electricityInvestment, bioOilYield, bioOilPrice, bioOilInvestment } = inputs;
    
    const annualFeedstock = (plantCapacity * operatingHours) / 1000;
    
    let totalInvestment = initialInvestment;
    if (products.heat) totalInvestment += heatInvestment;
    if (products.electricity) totalInvestment += electricityInvestment;
    if (products.bioOil) totalInvestment += bioOilInvestment;
    
    let annualRevenue = 0;
    
    // Biochar Revenue
    const biocharProduction = annualFeedstock * (biocharYield / 100);
    const biocharSalesRevenue = biocharProduction * biocharPrice;
    annualRevenue += biocharSalesRevenue;
    
    // CO₂ Certificate Revenue (25% deduction for MRV/trading costs = 0.75 multiplier)
    const annualCO2Removal = biocharProduction * inputs.lcaFactor;
    const certificateRevenue = annualCO2Removal * inputs.co2RemovalPrice * 0.75;
    annualRevenue += certificateRevenue;
    
    // Heat Revenue
    if (products.heat) {
      const combustionPower = inputs.plantCapacity * inputs.fuelHeatValue / 1000;
      const usableThermalPower = combustionPower * inputs.thermalEfficiency / 100;
      const totalHeatProduction = usableThermalPower * operatingHours;
      const soldHeatProduction = totalHeatProduction * (inputs.heatYield / 100);
      const heatRevenue = soldHeatProduction * heatPrice;
      annualRevenue += heatRevenue;
    }
    
    // Electricity Revenue (only surplus counted)
    if (products.electricity) {
      const combustionPower = inputs.plantCapacity * inputs.fuelHeatValue / 1000;
      const usableThermalPower = combustionPower * inputs.thermalEfficiency / 100;
      const electricityProduction = usableThermalPower * (electricityYield / 100) * operatingHours;
      const grossElectricityConsumption = inputs.electricalPower * operatingHours;
      const surplusElectricity = Math.max(0, electricityProduction - grossElectricityConsumption);
      const electricityRevenue = surplusElectricity * electricityPrice;
      annualRevenue += electricityRevenue;
    }
    
    // Bio-Oil Revenue
    if (products.bioOil) {
      const bioOilProduction = annualFeedstock * (bioOilYield / 100);
      const bioOilRevenue = bioOilProduction * bioOilPrice;
      annualRevenue += bioOilRevenue;
    }
    
    const annualFeedstockCost = annualFeedstock * feedstockCost;
    const annualElectricityCost = inputs.electricalPower * inputs.operatingHours * inputs.electricityConsumptionPrice;
    const totalAnnualCosts = annualFeedstockCost + laborCost + maintenanceCost + annualElectricityCost;
    const annualCashFlow = annualRevenue - totalAnnualCosts;
    
    let npv = -totalInvestment;
    const cashFlows = [];
    const cumulativeFlows = [];
    let cumulative = -totalInvestment;
    
    for (let year = 1; year <= projectLifetime; year++) {
      const discountedCashFlow = annualCashFlow / Math.pow(1 + discountRate / 100, year);
      npv += discountedCashFlow;
      cashFlows.push({ year, cashFlow: annualCashFlow, discountedCashFlow, revenue: annualRevenue, costs: totalAnnualCosts });
      cumulative += annualCashFlow;
      cumulativeFlows.push({ year, cumulative: cumulative / 1000 });
    }
    
    // Calculate IRR using Newton-Raphson method for better accuracy
    let irr = 0;
    const calculateNPVAtRate = (rate: number) => {
      let npvAtRate = -totalInvestment;
      for (let year = 1; year <= projectLifetime; year++) {
        npvAtRate += annualCashFlow / Math.pow(1 + rate, year);
      }
      return npvAtRate;
    };
    
    const calculateNPVDerivative = (rate: number) => {
      let derivative = 0;
      for (let year = 1; year <= projectLifetime; year++) {
        derivative -= (year * annualCashFlow) / Math.pow(1 + rate, year + 1);
      }
      return derivative;
    };
    
    // Newton-Raphson iteration
    let rate = 0.1; // Initial guess (10%)
    let iterations = 0;
    const maxIterations = 100;
    const tolerance = 1e-6;
    
    while (iterations < maxIterations) {
      const npvValue = calculateNPVAtRate(rate);
      if (Math.abs(npvValue) < tolerance) {
        irr = rate * 100; // Convert back to percentage
        break;
      }
      const derivative = calculateNPVDerivative(rate);
      if (Math.abs(derivative) < 1e-10) break; // Avoid division by very small number
      rate = rate - npvValue / derivative;
      iterations++;
    }
    
    // Clamp IRR to reasonable range
    irr = Math.max(Math.min(irr, 100), -100);
    
    // Guard against division-by-zero: if annual cash flow is zero or negative, payback is undefined
    let paybackPeriod = 0;
    if (annualCashFlow > 0) {
      paybackPeriod = totalInvestment / annualCashFlow;
    }
    setResults({ npv: npv / 1000, irr, paybackPeriod, annualCashFlows: cashFlows, cumulativeCashFlows: cumulativeFlows, annualRevenue: annualRevenue / 1000, annualCosts: totalAnnualCosts / 1000, totalInvestment: totalInvestment / 1000 });
  };

  useEffect(() => { calculateNPV(); }, [inputs, products]);

  const getProductIcon = (product) => {
    switch (product) {
      case 'biochar': return <Leaf className="w-4 h-4" />;
      case 'heat': return <Flame className="w-4 h-4" />;
      case 'electricity': return <Zap className="w-4 h-4" />;
      case 'bioOil': return <Droplets className="w-4 h-4" />;
      default: return null;
    }
  };

  const validateForm = () => {
    const errors = { name: '', email: '' };
    let isValid = true;
    if (!userName.trim()) { errors.name = t.nameRequired; isValid = false; }
    if (!userEmail.trim()) { errors.email = t.emailRequired; isValid = false; } 
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) { errors.email = t.emailInvalid; isValid = false; }
    setFormErrors(errors);
    return isValid;
  };

  const sendEmailNotification = async () => {
    try {
      // Calculate all relevant KPIs
      const heatRev = products.heat ? ((inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency / 1000) * (inputs.heatYield / 100) * inputs.heatPrice * inputs.operatingHours / 1000) : 0;
      const elecRev = products.electricity ? Math.max(0, ((inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency / 1000) * (inputs.electricityYield / 100) * inputs.operatingHours - inputs.electricalPower * inputs.operatingHours) * inputs.electricityPrice / 1000) : 0;
      const bioOilRev = products.bioOil ? ((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.bioOilYield / 100) * inputs.bioOilPrice) : 0;
      const biocharRev = (inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * inputs.biocharPrice / 1000;
      const certRev = ((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * inputs.lcaFactor * inputs.co2RemovalPrice * 0.75) / 1000;
      const annualCO2 = (inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * inputs.lcaFactor;
      const totalCO2 = annualCO2 * inputs.projectLifetime;
      
      const templateParams = {
        // Kontaktdaten
        user_name: userName,
        user_email: userEmail,
        contact_consent: contactConsent ? (language === 'de' ? 'Ja - Kontakt erwünscht' : 'Yes - Contact requested') : (language === 'de' ? 'Nein - Nur Information' : 'No - Information only'),
        language: language === 'de' ? 'Deutsch' : 'English',
        
        // Grundparameter
        plant_capacity: formatNumber(inputs.plantCapacity),
        fuel_heat_value: inputs.fuelHeatValue.toFixed(1),
        operating_hours: formatNumber(inputs.operatingHours),
        project_lifetime: inputs.projectLifetime,
        discount_rate: inputs.discountRate,
        thermal_efficiency: inputs.thermalEfficiency,
        feedstock_cost: formatNumber(inputs.feedstockCost),
        
        // Investitionen
        total_investment: formatNumber(inputs.initialInvestment),
        electricity_investment: formatNumber(inputs.electricityInvestment),
        bio_oil_investment: formatNumber(inputs.bioOilInvestment),
        heat_investment: formatNumber(inputs.heatInvestment),
        
        // Produkte aktiviert
        heat_enabled: products.heat ? 'Ja' : 'Nein',
        electricity_enabled: products.electricity ? 'Ja' : 'Nein',
        bio_oil_enabled: products.bioOil ? 'Ja' : 'Nein',
        
        // Produktparameter
        heat_yield: inputs.heatYield,
        heat_price: formatNumber(inputs.heatPrice),
        electricity_yield: inputs.electricityYield,
        electricity_price: formatNumber(inputs.electricityPrice),
        electrical_power: formatNumber(inputs.electricalPower),
        electricity_consumption_price: formatNumber(inputs.electricityConsumptionPrice),
        bio_oil_yield: inputs.bioOilYield,
        bio_oil_price: formatNumber(inputs.bioOilPrice),
        biochar_yield: inputs.biocharYield,
        biochar_price: formatNumber(inputs.biocharPrice),
        
        // Kostenparameter
        labor_cost: formatNumber(inputs.laborCost),
        maintenance_cost: formatNumber(inputs.maintenanceCost),
        
        // CO2 Parameter
        lca_factor: inputs.lcaFactor,
        co2_removal_price: formatNumber(inputs.co2RemovalPrice),
        
        // Wirtschaftliche KPIs
        npv: formatNumber(results.npv || 0),
        irr: (results.irr || 0).toFixed(1),
        payback_period: (results.paybackPeriod || 0).toFixed(1),
        annual_revenue: formatNumber(results.annualRevenue || 0),
        annual_costs: formatNumber(results.annualCosts || 0),
        annual_cash_flow: formatNumber((results.annualRevenue || 0) - (results.annualCosts || 0)),
        
        // Umsatz KPIs
        heat_revenue: formatNumber(heatRev),
        electricity_revenue: formatNumber(elecRev),
        bio_oil_revenue: formatNumber(bioOilRev),
        biochar_revenue: formatNumber(biocharRev),
        certificate_revenue: formatNumber(certRev),
        total_revenue_breakdown: `Wärme: ${formatNumber(heatRev)}k€, Strom: ${formatNumber(elecRev)}k€, Bio-Öl: ${formatNumber(bioOilRev)}k€, Biokohle: ${formatNumber(biocharRev)}k€, Zertifikate: ${formatNumber(certRev)}k€`,
        
        // CO2 KPIs
        annual_co2_removal: formatNumber(annualCO2, 0),
        total_co2_removal: formatNumber(totalCO2, 0),
        
        date: new Date().toLocaleString(language === 'de' ? 'de-DE' : 'en-US'),
        to_email: 'th@decarbo-engineering.com'
      };
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      console.log('Email notification sent successfully');
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  };

// ========================================
// ENDE TEIL 2 - Weiter mit Teil 3
// ========================================
// ========================================
// TEIL 3 von 5: PDF Generation Function
// ========================================
// WICHTIG: Dieser Teil kommt DIREKT nach Teil 2

  const generatePdfReport = async () => {
    console.log('PDF generation started');
    if (!validateForm()) {
      console.error('Form validation failed');
      alert(language === 'de' ? 'Bitte füllen Sie alle erforderlichen Felder aus' : 'Please fill in all required fields');
      return;
    }
    setIsGeneratingPdf(true);
    
    try {
      console.log('Starting email notification');
      // Try to send email, but don't block PDF generation if it fails
      try {
        await sendEmailNotification();
        setFormSubmitted(true);
        console.log('Email sent successfully');
      } catch (emailError) {
        console.warn('Email notification failed, but continuing with PDF:', emailError);
        setFormSubmitted(true);
      }
      
      console.log('Importing PDF libraries');
      const { default: jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      console.log('Creating PDF document');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;
      
      // Header function
      const addHeader = () => {
        pdf.setFillColor(17, 24, 39);
        pdf.rect(0, 0, pageWidth, 50, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(20);
        pdf.text('DECARBO-ENGINEERING', margin, 18);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(14);
        pdf.text('Enabling Net-Zero', margin, 27);
        pdf.setDrawColor(34, 197, 94);
        pdf.setLineWidth(0.5);
        pdf.line(margin, 42, pageWidth - margin, 42);
        return 55;
      };
      
      yPosition = addHeader();
      
      // Title - "Pyrolyse-Anlagen Wirtschaftlichkeitsrechner" (0,5cm = ~3mm tiefer)
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55);
      const titleText = language === 'de' ? 'Pyrolyse-Anlagen Wirtschaftlichkeitsrechner' : 'Pyrolysis Plant Economic Calculator';
      pdf.text(titleText, margin, yPosition + 3.5);
      yPosition += 13;
      
      // Date
      pdf.setFillColor(249, 250, 251);
      pdf.roundedRect(margin, yPosition, contentWidth, 6, 2, 2, 'F');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(31, 41, 55);
      const dateText = `${language === 'de' ? 'Erstellt am' : 'Generated on'}: ${new Date().toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}`;
      pdf.text(dateText, margin + 2, yPosition + 4);
      yPosition += 8;
      
      // Financial Results Section
      pdf.setFillColor(16, 185, 129);
      pdf.rect(margin, yPosition, contentWidth, 7, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const finResultsTitle = language === 'de' ? 'Wirtschaftliche Ergebnisse' : 'Financial Results';
      pdf.text(finResultsTitle, margin + 2, yPosition + 5);
      yPosition += 10;
      
      // Key Metrics - Farbige KPI Boxen wie im Web-Tool
      pdf.setFillColor(16, 185, 129);
      pdf.rect(margin, yPosition, contentWidth, 7, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      const kpiTitle = language === 'de' ? 'Wirtschaftlichkeits KPIs' : 'Financial KPIs';
      pdf.text(kpiTitle, margin + 2, yPosition + 5);
      yPosition += 10;
      
      // NPV Box (Green)
      pdf.setFillColor(34, 197, 94);
      pdf.rect(margin, yPosition, (contentWidth - 3) / 2, 14, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Kapitalwert (NPV)', margin + 2, yPosition + 3);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      const npvValue = `${(results.npv || 0) > 0 ? '+' : ''}${formatNumber(results.npv || 0)}k €`;
      pdf.text(npvValue, margin + 2, yPosition + 10);
      
      // IRR Box (Blue)
      pdf.setFillColor(59, 130, 246);
      pdf.rect(margin + (contentWidth - 3) / 2 + 3, yPosition, (contentWidth - 3) / 2, 14, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Interner Zinsfuß (IRR)', margin + (contentWidth - 3) / 2 + 5, yPosition + 3);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      const irrValue = `${(results.irr || 0).toFixed(1)}%`;
      pdf.text(irrValue, margin + (contentWidth - 3) / 2 + 5, yPosition + 10);
      
      yPosition += 16;
      
      // Payback Box (Orange)
      pdf.setFillColor(249, 115, 22);
      pdf.rect(margin, yPosition, (contentWidth - 3) / 2, 14, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Amortisationszeit', margin + 2, yPosition + 3);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      const paybackValue = `${(results.paybackPeriod || 0).toFixed(1)} Jahre`;
      pdf.text(paybackValue, margin + 2, yPosition + 10);
      
      // Annual Cash Flow Box (Purple)
      pdf.setFillColor(168, 85, 247);
      pdf.rect(margin + (contentWidth - 3) / 2 + 3, yPosition, (contentWidth - 3) / 2, 14, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Jährlicher Cash Flow', margin + (contentWidth - 3) / 2 + 5, yPosition + 3);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      const cashFlowValue = `${formatNumber((results.annualRevenue || 0) - (results.annualCosts || 0))}k €`;
      pdf.text(cashFlowValue, margin + (contentWidth - 3) / 2 + 5, yPosition + 10);
      
      yPosition += 16;
      
      // Umsatz KPIs Section
      if (yPosition + 20 > pageHeight - 15) {
        pdf.addPage();
        yPosition = addHeader();
      }
      
      pdf.setFillColor(16, 185, 129);
      pdf.rect(margin, yPosition, contentWidth, 7, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      const revenueSectionTitle = language === 'de' ? 'Umsatz KPIs' : 'Revenue KPIs';
      pdf.text(revenueSectionTitle, margin + 2, yPosition + 5);
      yPosition += 10;
      
      // Heat Revenue Box (Cyan)
      pdf.setFillColor(6, 182, 212);
      pdf.rect(margin, yPosition, (contentWidth - 4) / 3, 14, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Umsatz Wärme', margin + 1, yPosition + 3);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      const heatRev = products.heat ? ((inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency / 1000) * (inputs.heatYield / 100) * inputs.heatPrice * inputs.operatingHours / 1000) : 0;
      pdf.text(`${formatNumber(heatRev)}k €/a`, margin + 1, yPosition + 10);
      
      // Electricity Revenue Box (Gray/Dark)
      pdf.setFillColor(75, 85, 99);
      pdf.rect(margin + (contentWidth - 4) / 3 + 2, yPosition, (contentWidth - 4) / 3, 14, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Umsatz Strom', margin + (contentWidth - 4) / 3 + 3, yPosition + 3);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      const elecRev = products.electricity ? Math.max(0, ((inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency / 1000) * (inputs.electricityYield / 100) * inputs.operatingHours - inputs.electricalPower * inputs.operatingHours) * inputs.electricityPrice / 1000) : 0;
      pdf.text(`${formatNumber(elecRev)}k €/a`, margin + (contentWidth - 4) / 3 + 3, yPosition + 10);
      
      // Bio-Oil Revenue Box (Purple)
      pdf.setFillColor(168, 85, 247);
      pdf.rect(margin + 2 * ((contentWidth - 4) / 3 + 2), yPosition, (contentWidth - 4) / 3, 14, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Umsatz Bio-Öl', margin + 2 * ((contentWidth - 4) / 3 + 2) + 1, yPosition + 3);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      const bioOilRev = products.bioOil ? ((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.bioOilYield / 100) * inputs.bioOilPrice) : 0;
      pdf.text(`${formatNumber(bioOilRev)}k €/a`, margin + 2 * ((contentWidth - 4) / 3 + 2) + 1, yPosition + 10);
      
      yPosition += 16;
      
      // Biochar Revenue Box (Green)
      pdf.setFillColor(34, 197, 94);
      pdf.rect(margin, yPosition, (contentWidth - 4) / 3, 14, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Umsatz Biokohle', margin + 1, yPosition + 3);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      const biocharRev = (inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * inputs.biocharPrice / 1000;
      pdf.text(`${formatNumber(biocharRev)}k €/a`, margin + 1, yPosition + 10);
      
      // Certificate Revenue Box (Emerald)
      pdf.setFillColor(5, 150, 105);
      pdf.rect(margin + (contentWidth - 4) / 3 + 2, yPosition, (contentWidth - 4) / 3 * 2 + 2, 14, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Umsatz Zertifikate', margin + (contentWidth - 4) / 3 + 3, yPosition + 3);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      const certRev = ((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * inputs.lcaFactor * inputs.co2RemovalPrice * 0.75) / 1000;
      pdf.text(`${formatNumber(certRev)}k €/a`, margin + (contentWidth - 4) / 3 + 3, yPosition + 10);
      
      yPosition += 16;
      
      // CO2 Entnahme KPIs
      if (yPosition + 16 > pageHeight - 15) {
        pdf.addPage();
        yPosition = addHeader();
      }
      
      pdf.setFillColor(16, 185, 129);
      pdf.rect(margin, yPosition, contentWidth, 7, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      const co2Title = language === 'de' ? 'CO₂ Entnahme KPIs' : 'CO₂ Removal KPIs';
      pdf.text(co2Title, margin + 2, yPosition + 5);
      yPosition += 10;
      
      const annualCO2 = (inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * inputs.lcaFactor;
      const totalCO2 = annualCO2 * inputs.projectLifetime;
      
      // Annual CO2 Box (Green)
      pdf.setFillColor(34, 197, 94);
      pdf.rect(margin, yPosition, (contentWidth - 3) / 2, 14, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Jährliche CO₂ Entnahme', margin + 2, yPosition + 3);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${formatNumber(annualCO2, 0)} t CO₂/a`, margin + 2, yPosition + 10);
      
      // Total CO2 Box (Emerald)
      pdf.setFillColor(5, 150, 105);
      pdf.rect(margin + (contentWidth - 3) / 2 + 3, yPosition, (contentWidth - 3) / 2, 14, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Gesamte CO₂ Entnahme', margin + (contentWidth - 3) / 2 + 5, yPosition + 3);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${formatNumber(totalCO2, 0)} t CO₂`, margin + (contentWidth - 3) / 2 + 5, yPosition + 10);
      
      yPosition += 16;
      pdf.setFillColor(16, 185, 129);
      pdf.rect(margin, yPosition, contentWidth, 7, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const investTitle = language === 'de' ? 'Invest KPIs' : 'Invest KPIs';
      pdf.text(investTitle, margin + 2, yPosition + 5);
      yPosition += 12;
      
      const totalInvLabel = language === 'de' ? 'Gesamtinvestition' : 'Total Investment';
      const annualRevLabel = language === 'de' ? 'Jährliche Einnahmen' : 'Annual Revenues';
      const annualCostLabel = language === 'de' ? 'Jährliche Kosten' : 'Annual Costs';
      
      const investment = [
        [totalInvLabel, `${formatNumber(results.totalInvestment || 0)}k €`],
        [annualRevLabel, `${formatNumber(results.annualRevenue || 0)}k €`],
        [annualCostLabel, `${formatNumber(results.annualCosts || 0)}k €`]
      ];
      
      for (let i = 0; i < investment.length; i += 2) {
        if (yPosition + 6 > pageHeight - 15) {
          pdf.addPage();
          yPosition = addHeader();
        }
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        const invLabel1 = String(investment[i][0] || '');
        const invValue1 = String(investment[i][1] || '');
        pdf.text(invLabel1, margin + 1, yPosition + 2);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(31, 41, 55);
        pdf.text(invValue1, margin + 1, yPosition + 5);
        
        if (investment[i + 1]) {
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 100, 100);
          const invLabel2 = String(investment[i + 1][0] || '');
          const invValue2 = String(investment[i + 1][1] || '');
          pdf.text(invLabel2, margin + contentWidth / 2 + 3, yPosition + 2);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(31, 41, 55);
          pdf.text(invValue2, margin + contentWidth / 2 + 3, yPosition + 5);
        }
        
        yPosition += 8;
      }
      
      yPosition += 3;
      
      // Input Parameters Section
      if (yPosition + 20 > pageHeight - 15) {
        pdf.addPage();
        yPosition = addHeader();
      }
      
      pdf.setFillColor(16, 185, 129);
      pdf.rect(margin, yPosition, contentWidth, 7, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const inputParamTitle = language === 'de' ? 'Eingabeparameter' : 'Input Parameters';
      pdf.text(inputParamTitle, margin + 2, yPosition + 5);
      yPosition += 12;
      
      const capacityLabel = language === 'de' ? 'Kapazität' : 'Capacity';
      const operatingLabel = language === 'de' ? 'Betriebsstunden' : 'Operating Hours';
      const lifetimeLabel = language === 'de' ? 'Projektlaufzeit' : 'Project Lifetime';
      const discountLabel = language === 'de' ? 'Diskontrate' : 'Discount Rate';
      const efficiencyLabel = language === 'de' ? 'Wärmewirkungsgrad' : 'Thermal Efficiency';
      const feedstockLabel = language === 'de' ? 'Rohstoffkosten' : 'Feedstock Cost';
      
      const inputParams = [
        [capacityLabel, `${formatNumber(inputs.plantCapacity)} kg/h`],
        [operatingLabel, `${formatNumber(inputs.operatingHours)} h/Jahr`],
        [lifetimeLabel, `${inputs.projectLifetime} Jahre`],
        [discountLabel, `${inputs.discountRate}%`],
        [efficiencyLabel, `${inputs.thermalEfficiency}%`],
        [feedstockLabel, `${formatNumber(inputs.feedstockCost)} €/t`]
      ];
      
      for (let i = 0; i < inputParams.length; i += 2) {
        if (yPosition + 6 > pageHeight - 15) {
          pdf.addPage();
          yPosition = addHeader();
        }
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        const paramLabel1 = String(inputParams[i][0] || '');
        const paramValue1 = String(inputParams[i][1] || '');
        pdf.text(paramLabel1, margin + 1, yPosition + 2);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(31, 41, 55);
        pdf.text(paramValue1, margin + 1, yPosition + 5);
        
        if (inputParams[i + 1]) {
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 100, 100);
          const paramLabel2 = String(inputParams[i + 1][0] || '');
          const paramValue2 = String(inputParams[i + 1][1] || '');
          pdf.text(paramLabel2, margin + contentWidth / 2 + 3, yPosition + 2);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(31, 41, 55);
          pdf.text(paramValue2, margin + contentWidth / 2 + 3, yPosition + 5);
        }
        
        yPosition += 8;
      }
      
      // === PAGE WITH CHARTS ===
      pdf.addPage();
      yPosition = addHeader();
      
      pdf.setFillColor(16, 185, 129);
      pdf.rect(margin, yPosition, contentWidth, 7, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const chartsTitle = language === 'de' ? 'Finanzielle Diagramme' : 'Financial Charts';
      pdf.text(chartsTitle, margin + 2, yPosition + 5);
      yPosition += 12;
      
      const cumulativeTitle = language === 'de' ? 'Kumulativer Cash Flow' : 'Cumulative Cash Flow';
      const revenueTitle = language === 'de' ? 'Jährliche Einnahmen vs. Kosten' : 'Annual Revenue vs. Costs';
      const pieTitle = language === 'de' ? 'Umsatzverteilung' : 'Revenue Distribution';
      
      const chartIds = ['cumulative-chart', 'revenue-chart', 'pie-chart'];
      const chartTitles = [cumulativeTitle, revenueTitle, pieTitle];
      
      // Small delay before capturing charts
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const chartWidth = 80;
      const chartHeight = 60;
      
      for (let i = 0; i < chartIds.length; i++) {
        try {
          if (yPosition + chartHeight + 15 > pageHeight - 15) {
            pdf.addPage();
            yPosition = addHeader();
          }
          
          const chartElement = document.getElementById(chartIds[i]);
          
          if (chartElement) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(16, 185, 129);
            const chartTitle = String(chartTitles[i] || '');
            pdf.text(chartTitle, margin, yPosition);
            yPosition += 6;
            
            try {
              const canvas = await html2canvas(chartElement, {
                backgroundColor: '#111827',
                scale: 1,
                logging: false,
                useCORS: true,
                allowTaint: true
              });
              
              const imgData = canvas.toDataURL('image/png');
              pdf.addImage(imgData, 'PNG', margin, yPosition, chartWidth, chartHeight);
              yPosition += chartHeight + 8;
              console.log(`Chart ${i} captured successfully`);
            } catch (canvasError) {
              console.warn(`Could not capture chart ${i}:`, canvasError);
              yPosition += 8;
            }
          }
        } catch (error) {
          console.warn(`Error processing chart ${i}:`, error);
        }
      }
      
      // Add footer to all pages
      console.log('Generating footer');
      const pageCount = pdf.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.3);
        pdf.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.setFont('helvetica', 'normal');
        const pageText = language === 'de' ? `Seite ${i} / ${pageCount}` : `Page ${i} / ${pageCount}`;
        pdf.text(pageText, pageWidth / 2, pageHeight - 6);
      }
      
      console.log('Saving PDF file');
      const fileName = `Pyrolysis_Analysis_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      console.log('PDF saved successfully:', fileName);
      const successMsg = language === 'de' ? 'PDF erfolgreich erstellt und heruntergeladen!' : 'PDF created and downloaded successfully!';
      alert(successMsg);
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      alert(language === 'de' ? `Fehler beim Erstellen der PDF: ${error instanceof Error ? error.message : String(error)}` : `Error creating PDF: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="https://www.decarbo-engineering.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <img src={decarboLogo} alt="Decarbo Engineering" className="h-24 w-auto cursor-pointer" />
              </a>
            </div>
            <button onClick={() => setLanguage(language === 'de' ? 'en' : 'de')} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700">
              <Globe className="w-5 h-5" />
              <span className="font-medium">{language === 'de' ? 'DE' : 'EN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Main Hero Content - Left Aligned with Image Right */}
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-12">
            {/* Left Content */}
            <div className="flex-1">
              {/* Title Section */}
              <div className="mb-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-2">
                  {language === 'de' ? 'Pyrolyse-Anlagen' : 'Pyrolysis Plants'}
                </h1>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  {language === 'de' ? 'ROI-Rechner' : 'ROI Calculator'}
                </h1>
              </div>

              {/* Subtitle */}
              <div className="mb-8">
                <p className="text-lg text-gray-300">
                  {language === 'de' 
                    ? 'Entdecken Sie die wirtschaftlichen Potenziale der Pyrolyse-Technologie – für negative Emissionen und regenerative Energie.'
                    : 'Discover the economic potential of pyrolysis technology – for negative emissions and renewable energy.'
                  }
                </p>
              </div>

              {/* Info Cards with Hover Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: What Can Calculator Do */}
                <div className="group relative bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-xl p-5 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-help">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                      <span className="text-blue-300 font-bold">1</span>
                    </div>
                    <h3 className="text-sm font-semibold text-blue-300">
                      {language === 'de' ? 'Was kann dieser Rechner?' : 'What can this calculator do?'}
                    </h3>
                  </div>
                  {/* Dropdown Content */}
                  <div className="hidden group-hover:block absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-blue-500/50 rounded-xl p-4 shadow-xl z-10">
                    <ul className="text-gray-300 text-xs space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{language === 'de' ? 'Schnelle Ersteinschätzung der Wirtschaftlichkeit Ihres Pyrolyseprojekts' : 'Quick assessment of your pyrolysis project economics'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{language === 'de' ? 'Berechnung von NPV, IRR und Amortisationszeit' : 'Calculate NPV, IRR and payback period'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{language === 'de' ? 'Szenarien-Analysen mit flexiblen Parametern' : 'Scenario analysis with flexible parameters'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{language === 'de' ? 'Professionelle PDF-Reports zum Download' : 'Professional PDF reports for download'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Card 2: For Whom */}
                <div className="group relative bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-xl p-5 hover:border-green-400/60 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 cursor-help">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center">
                      <span className="text-green-300 font-bold">2</span>
                    </div>
                    <h3 className="text-sm font-semibold text-green-300">
                      {language === 'de' ? 'Für wen ist das Tool?' : 'Who is this for?'}
                    </h3>
                  </div>
                  {/* Dropdown Content */}
                  <div className="hidden group-hover:block absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-green-500/50 rounded-xl p-4 shadow-xl z-10">
                    <ul className="text-gray-300 text-xs space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{language === 'de' ? 'Projektentwickler und Investoren' : 'Project developers and investors'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{language === 'de' ? 'Anlagenbetreiber und Planer' : 'Plant operators and planners'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{language === 'de' ? 'Finanzierungspartner und Banken' : 'Financing partners and banks'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{language === 'de' ? 'Nachhaltigkeits- und ESG-Profis' : 'Sustainability and ESG professionals'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Card 3: Important Notes */}
                <div className="group relative bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-500/30 rounded-xl p-5 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 cursor-help">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/30 flex items-center justify-center">
                      <span className="text-amber-300 font-bold">!</span>
                    </div>
                    <h3 className="text-sm font-semibold text-amber-300">
                      {language === 'de' ? 'Wichtige Hinweise' : 'Important Notes'}
                    </h3>
                  </div>
                  {/* Dropdown Content */}
                  <div className="hidden group-hover:block absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-amber-500/50 rounded-xl p-4 shadow-xl z-10">
                    <ul className="text-gray-300 text-xs space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span>{language === 'de' ? 'Dies ist eine Ersteinschätzung, keine Bankierbarkeitsanalyse' : 'This is a preliminary assessment, not a bankability analysis'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span>{language === 'de' ? 'Standardwerte basieren auf typischen Marktszenarien' : 'Standard values based on typical market scenarios'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span>{language === 'de' ? 'Alle Eingaben sind anpassbar für Ihre Situation' : 'All inputs can be customized for your situation'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span>{language === 'de' ? 'Kontaktieren Sie uns für detaillierte Analysen' : 'Contact us for detailed analyses'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 flex justify-center">
              <img 
                src="/pyrolysis-hero.png"
                alt="Pyrolysis Technology" 
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Call-to-Action Button */}
          <div className="flex justify-start mt-8">
            <a 
              href={language === 'de' 
                ? 'https://www.decarbo-engineering.com/kontakt' 
                : 'https://www.decarbo-engineering.com/contact'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105"
            >
              <span className="text-lg">
                {language === 'de' ? 'Decarbo Kontaktieren' : 'Contact Decarbo'}
              </span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Input Parameters Section */}
        <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded"></div>
            {t.title}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Selection */}
            <div className="bg-gradient-to-br from-green-900/40 to-gray-800 p-5 rounded-lg border border-green-500/40">
              <h2 className="text-xl font-semibold text-green-400 mb-4">{t.productSelection}</h2>
              <div className="space-y-3">
                {[
                  { key: 'biochar', label: t.biochar, locked: true },
                  { key: 'heat', label: t.heatGeneration, locked: false },
                  { key: 'electricity', label: t.electricityGeneration, locked: false },
                  { key: 'bioOil', label: t.bioOilProduction, locked: false }
                ].map(({ key, label, locked }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={(products as any)[key]} disabled={locked} onChange={() => handleProductChange(key)} className="w-5 h-5 rounded border-gray-600 text-green-500 focus:ring-green-500 focus:ring-offset-gray-800 disabled:opacity-50" />
                    <div className="flex items-center gap-2">
                      {getProductIcon(key)}
                      <span className={`${locked ? 'font-semibold text-green-400' : 'text-gray-300'} group-hover:text-white transition-colors`}>
                        {label}
                        {locked && ` ${t.standardProduct}`}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-6 p-4 bg-amber-900/30 border border-amber-500/40 rounded-lg">
                <p className="text-sm text-amber-100 leading-relaxed">
                  {language === 'de' 
                    ? '💡 Empfehlung: Mindestens Wärmeerzeugung sollte mitaktiviert werden, um die entstehende regenerative Wärme sinnvoll zu nutzen. Projekte sind wirtschaftlich am erfolgreichsten, wenn die erzeugte Energie mitgenutzt wird – ob thermisch oder veredelt als Strom oder Bio-Öl. Allerdings sollten Sie berücksichtigen, dass jede weitere Veredelung zusätzliche Komplexität ins Projekt bringt.'
                    : '💡 Recommendation: At least heat generation should be activated to make meaningful use of the regenerated heat produced. Projects are most economically successful when the generated energy is utilized – whether thermally or refined as electricity or bio-oil. However, keep in mind that each additional processing step adds complexity to the project.'
                  }
                </p>
              </div>
            </div>

            {/* Basic Parameters - Verkürzt für Platzersparnis */}
            <div className="bg-gradient-to-br from-blue-900/30 to-gray-800 p-5 rounded-lg border border-blue-500/30">
              <h2 className="text-xl font-semibold text-blue-400 mb-4">{t.basicParameters}</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="plant-capacity" className="block text-sm font-medium text-blue-300 mb-2">
                    {t.plantCapacity}: <span className="font-bold text-white">{formatNumber(inputs.plantCapacity)} kg/h</span>
                  </label>
                  <input id="plant-capacity" name="plantCapacity" type="range" min="100" max="50000" step="100" value={inputs.plantCapacity} onChange={(e) => handleInputChange('plantCapacity', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="fuel-heat-value" className="block text-sm font-medium text-blue-300 mb-2">
                      {t.fuelHeatValue}: <span className="font-bold text-white">{inputs.fuelHeatValue.toFixed(1)} kWh/kg</span>
                    </label>
                    <button onClick={() => toggleInfo('fuelHeatValue')} className="text-blue-400 hover:text-blue-300 ml-2">
                      <Info className="w-6 h-6" />
                    </button>
                  </div>
                  <input id="fuel-heat-value" name="fuelHeatValue" type="range" min="2" max="6" step="0.1" value={inputs.fuelHeatValue} onChange={(e) => handleInputChange('fuelHeatValue', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  {expandedInfo['fuelHeatValue'] && (
                    <div className="mt-2 text-xs text-gray-400 bg-blue-900/20 p-2 rounded">
                      <p className="mb-3">{t.fuelHeatValueInfo}</p>
                      {renderHeatingValuesTable(language)}
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="operating-hours" className="block text-sm font-medium text-blue-300 mb-2">
                    {t.operatingHours}: <span className="font-bold text-white">{formatNumber(inputs.operatingHours)} h</span>
                  </label>
                  <input id="operating-hours" name="operatingHours" type="range" min="0" max="8500" step="100" value={inputs.operatingHours} onChange={(e) => handleInputChange('operatingHours', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                <div>
                  <label htmlFor="project-lifetime" className="block text-sm font-medium text-blue-300 mb-2">
                    {t.projectLifetime}: <span className="font-bold text-white">{inputs.projectLifetime} {t.years}</span>
                  </label>
                  <input id="project-lifetime" name="projectLifetime" type="range" min="5" max="20" step="1" value={inputs.projectLifetime} onChange={(e) => handleInputChange('projectLifetime', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="discount-rate" className="block text-sm font-medium text-blue-300 mb-2">
                      {t.discountRate}: <span className="font-bold text-white">{inputs.discountRate}%</span>
                    </label>
                    <button onClick={() => toggleInfo('discountRate')} className="text-blue-400 hover:text-blue-300 ml-2">
                      <Info className="w-6 h-6" />
                    </button>
                  </div>
                  <input id="discount-rate" name="discountRate" type="range" min="0" max="20" step="0.5" value={inputs.discountRate} onChange={(e) => handleInputChange('discountRate', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  {expandedInfo['discountRate'] && (
                    <p className="mt-2 text-xs text-gray-400 bg-blue-900/20 p-2 rounded">{t.discountRateInfo}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="electrical-power" className="block text-sm font-medium text-blue-300 mb-2">
                      {t.electricalPower}: <span className="font-bold text-white">{formatNumber(inputs.electricalPower)} kW</span>
                    </label>
                    <button onClick={() => toggleInfo('electricalPower')} className="text-blue-400 hover:text-blue-300 ml-2">
                      <Info className="w-6 h-6" />
                    </button>
                  </div>
                  <input id="electrical-power" name="electricalPower" type="range" min="10" max="500" step="10" value={inputs.electricalPower} onChange={(e) => handleInputChange('electricalPower', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  {expandedInfo['electricalPower'] && (
                    <p className="mt-2 text-xs text-gray-400 bg-blue-900/20 p-2 rounded">{t.electricalPowerInfo}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="electricity-consumption-price" className="block text-sm font-medium text-blue-300 mb-2">
                    {t.electricityConsumptionPrice}: <span className="font-bold text-white">{inputs.electricityConsumptionPrice.toFixed(2)} €/kWh</span>
                  </label>
                  <input id="electricity-consumption-price" name="electricityConsumptionPrice" type="range" min="0.05" max="1" step="0.01" value={inputs.electricityConsumptionPrice} onChange={(e) => handleInputChange('electricityConsumptionPrice', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="thermal-efficiency" className="block text-sm font-medium text-blue-300 mb-2">
                      {t.thermalEfficiency}: <span className="font-bold text-white">{inputs.thermalEfficiency}%</span>
                    </label>
                    <button onClick={() => toggleInfo('thermalEfficiency')} className="text-blue-400 hover:text-blue-300 ml-2">
                      <Info className="w-6 h-6" />
                    </button>
                  </div>
                  <input id="thermal-efficiency" name="thermalEfficiency" type="range" min="0" max="70" step="1" value={inputs.thermalEfficiency} onChange={(e) => handleInputChange('thermalEfficiency', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  {expandedInfo['thermalEfficiency'] && (
                    <p className="mt-2 text-xs text-gray-400 bg-blue-900/20 p-2 rounded">{t.thermalEfficiencyInfo}</p>
                  )}
                </div>
                <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                  <div className="text-sm">
                    <span className="text-gray-400">{t.combustionPower}: </span>
                    <span className="font-bold text-white">
                      {formatNumber((inputs.plantCapacity * inputs.fuelHeatValue) / 1000, 1)} MW
                    </span>
                  </div>
                  <div className="text-sm mt-2">
                    <span className="text-gray-400">{t.usableThermalPower}: </span>
                    <span className="font-bold text-white">
                      {formatNumber((inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency) / (1000 * 100), 1)} MW
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment & Costs - Verkürzt */}
            <div className="bg-gradient-to-br from-orange-900/30 to-gray-800 p-5 rounded-lg border border-orange-500/30">
              <h2 className="text-xl font-semibold text-orange-400 mb-4">{t.investmentCosts}</h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="initial-investment" className="block text-sm font-medium text-orange-300 mb-2">
                    {t.totalInvestment}: <span className="font-bold text-white">{formatNumber(inputs.initialInvestment)} €</span>
                  </label>
                  <input id="initial-investment" name="initialInvestment" type="range" min="100000" max="20000000" step="10000" value={inputs.initialInvestment} onChange={(e) => handleInputChange('initialInvestment', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                </div>
                <div>
                  <label htmlFor="feedstock-cost" className="block text-sm font-medium text-orange-300 mb-2">
                    {t.feedstockCost}: <span className="font-bold text-white">{inputs.feedstockCost} €/t</span>
                  </label>
                  <input id="feedstock-cost" name="feedstockCost" type="range" min="0" max="300" step="1" value={inputs.feedstockCost} onChange={(e) => handleInputChange('feedstockCost', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                </div>
                <div>
                  <label htmlFor="labor-cost" className="block text-sm font-medium text-orange-300 mb-2">
                    {t.laborCost}: <span className="font-bold text-white">{formatNumber(inputs.laborCost)} {t.perYear}</span>
                  </label>
                  <input id="labor-cost" name="laborCost" type="range" min="10000" max="200000" step="1000" value={inputs.laborCost} onChange={(e) => handleInputChange('laborCost', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="maintenance-cost" className="block text-sm font-medium text-orange-300 mb-2">
                      {t.maintenanceCost}: <span className="font-bold text-white">{formatNumber(inputs.maintenanceCost)} {t.perYear}</span>
                    </label>
                    <button onClick={() => toggleInfo('maintenanceCost')} className="text-orange-400 hover:text-orange-300 ml-2">
                      <Info className="w-6 h-6" />
                    </button>
                  </div>
                  <input id="maintenance-cost" name="maintenanceCost" type="range" min="5000" max="500999" step="500" value={inputs.maintenanceCost} onChange={(e) => handleInputChange('maintenanceCost', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                  {(() => {
                    let totalInvestment = inputs.initialInvestment;
                    if (products.heat) totalInvestment += inputs.heatInvestment;
                    if (products.electricity) totalInvestment += inputs.electricityInvestment;
                    if (products.bioOil) totalInvestment += inputs.bioOilInvestment;
                    const guidanceValue = totalInvestment * 0.025;
                    return (
                      <p className="mt-2 text-xs text-gray-400">
                        {language === 'de' ? 'Orientierungswert (2,5% der Gesamtinvestition): ' : 'Guidance value (2.5% of total investment): '}
                        <span className="font-semibold text-orange-400">{formatNumber(guidanceValue)} €</span>
                      </p>
                    );
                  })()}
                  {expandedInfo['maintenanceCost'] && (
                    <p className="mt-2 text-xs text-gray-400 bg-orange-900/20 p-2 rounded">{t.maintenanceInfo}</p>
                  )}
                </div>
                <div className="p-3 bg-orange-900/20 rounded-lg border border-orange-500/30">
                  <div className="text-sm">
                    <span className="text-gray-400">{t.grossElectricityConsumption}: </span>
                    <span className="font-bold text-white">
                      {formatNumber(inputs.electricalPower * inputs.operatingHours)} kWh/{language === 'de' ? 'Jahr' : 'year'}
                    </span>
                  </div>
                  <div className="text-sm mt-2">
                    <span className="text-gray-400">{t.netElectricityConsumption}: </span>
                    <span className="font-bold text-white">
                      {formatNumber(
                        products.electricity
                          ? Math.max(0, inputs.electricalPower * inputs.operatingHours - ((inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency / 1000) * (inputs.electricityYield / 100) * inputs.operatingHours))
                          : inputs.electricalPower * inputs.operatingHours
                      )} kWh/{language === 'de' ? 'Jahr' : 'year'}
                    </span>
                  </div>
                  <div className="text-sm mt-2">
                    <span className="text-gray-400">{t.annualElectricityCost}: </span>
                    <span className="font-bold text-white">
                      {formatNumber(
                        products.electricity 
                          ? Math.max(0, inputs.electricalPower * inputs.operatingHours - ((inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency / 1000) * (inputs.electricityYield / 100) * inputs.operatingHours)) * inputs.electricityConsumptionPrice
                          : inputs.electricalPower * inputs.operatingHours * inputs.electricityConsumptionPrice
                      )} €/{language === 'de' ? 'Jahr' : 'year'}
                    </span>
                  </div>
                </div>
                {products.electricity && (
                  <div className="p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                    <p className="text-sm text-orange-100">
                      {language === 'de' 
                        ? '💡 Hinweis: Der Nettostromverbrauch errechnet sich aus dem Bruttoverbrauch abzüglich der produzierten Strommengen. Falls die Stromproduktion den Verbrauch übersteigt, sind die Stromkosten gleich 0.'
                        : '💡 Note: Net electricity consumption is calculated as gross consumption minus generated electricity. If electricity production exceeds consumption, electricity costs equal 0.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Biochar Parameters - Verkürzt */}
            <div className="bg-gradient-to-br from-green-900/40 to-gray-800 p-5 rounded-lg border border-green-500/40">
              <h2 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                {t.biocharParams}
              </h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="biochar-yield" className="block text-sm font-medium text-green-300 mb-2">
                    {t.biocharYield}: <span className="font-bold text-white">{inputs.biocharYield}%</span>
                  </label>
                  <input id="biochar-yield" name="biocharYield" type="range" min="10" max="50" step="1" value={inputs.biocharYield} onChange={(e) => handleInputChange('biocharYield', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="biochar-price" className="block text-sm font-medium text-green-300 mb-2">
                      {t.biocharPrice}: <span className="font-bold text-white">{inputs.biocharPrice} €/t</span>
                    </label>
                    <button onClick={() => toggleInfo('biocharPrice')} className="text-green-400 hover:text-green-300 ml-2">
                      <Info className="w-6 h-6" />
                    </button>
                  </div>
                  <input id="biochar-price" name="biocharPrice" type="range" min="0" max="1000" step="10" value={inputs.biocharPrice} onChange={(e) => handleInputChange('biocharPrice', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                  {expandedInfo['biocharPrice'] && (
                    <p className="mt-2 text-xs text-gray-400 bg-green-900/20 p-2 rounded">{t.biocharPriceInfo}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="lca-factor" className="block text-sm font-medium text-green-300 mb-2">
                      {t.lcaFactor}: <span className="font-bold text-white">{inputs.lcaFactor.toFixed(1)}</span>
                    </label>
                    <button onClick={() => toggleInfo('lcaFactor')} className="text-green-400 hover:text-green-300 ml-2">
                      <Info className="w-6 h-6" />
                    </button>
                  </div>
                  <input id="lca-factor" name="lcaFactor" type="range" min="1" max="5" step="0.1" value={inputs.lcaFactor} onChange={(e) => handleInputChange('lcaFactor', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                  {expandedInfo['lcaFactor'] && (
                    <div className="mt-2 text-xs text-gray-400 bg-green-900/20 p-2 rounded space-y-2">
                      {language === 'de' ? (
                        <>
                          <p>
                            <span className="font-semibold text-green-300">Definition:</span> Der LCA-Faktor beschreibt die tatsächliche CO₂-Senkenleistung der produzierten Biokohle unter Berücksichtigung aller Prozessemissionen.
                          </p>
                          <p>
                            <span className="font-semibold text-green-300">Was wird berücksichtigt?</span><br />
                            • Biomasse-Logistik (Transport zur Anlage)<br />
                            • Vorbehandlung und Trocknung<br />
                            • Energieverbrauch der Pyrolyseanlage<br />
                            • Nachbehandlung und Konfektionierung<br />
                            • Transport und Ausbringung der Biokohle
                          </p>
                          <p>
                            <span className="font-semibold text-green-300">Berechnung:</span> Physikalisch entspricht 1 kg Kohlenstoff ≈ 3,67 kg CO₂. Abzüglich Lebenszyklusemissionen ergibt sich die netto CO₂-Senkenleistung.
                          </p>
                          <p>
                            <span className="font-semibold text-green-300">Typische Werte:</span><br />
                            • Optimierte Anlagen: 2,5 - 3,0 tCO₂/t Biokohle<br />
                            • Durchschnittliche Anlagen: 2,0 - 2,5 tCO₂/t Biokohle<br />
                            • Konservativ: 2,4 tCO₂/t Biokohle (Standardwert)
                          </p>
                          <p className="text-yellow-400">
                            <span className="font-semibold">Wichtig:</span> Projektspezifisch – erfordert detaillierte Lebenszyklusanalyse nach anerkannten Standards.
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            <span className="font-semibold text-green-300">Definition:</span> The LCA factor describes the actual CO₂ removal performance of produced biochar considering all process emissions.
                          </p>
                          <p>
                            <span className="font-semibold text-green-300">What is considered?</span><br />
                            • Biomass logistics (transport to facility)<br />
                            • Pre-treatment and drying<br />
                            • Energy consumption of pyrolysis plant<br />
                            • Post-treatment and packaging<br />
                            • Transport and application of biochar
                          </p>
                          <p>
                            <span className="font-semibold text-green-300">Calculation:</span> Physically, 1 kg of carbon ≈ 3.67 kg CO₂. Minus lifecycle emissions equals net CO₂ removal performance.
                          </p>
                          <p>
                            <span className="font-semibold text-green-300">Typical Values:</span><br />
                            • Optimized plants: 2.5 - 3.0 tCO₂/t biochar<br />
                            • Average plants: 2.0 - 2.5 tCO₂/t biochar<br />
                            • Conservative: 2.4 tCO₂/t biochar (standard value)
                          </p>
                          <p className="text-yellow-400">
                            <span className="font-semibold">Important:</span> Project-specific – requires detailed lifecycle assessment per recognized standards.
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-green-300 mb-2">
                      {t.co2RemovalPrice}: <span className="font-bold text-white">{inputs.co2RemovalPrice} €/t CO₂</span>
                    </label>
                    <button onClick={() => toggleInfo('co2RemovalPrice')} className="text-green-400 hover:text-green-300 ml-2">
                      <Info className="w-6 h-6" />
                    </button>
                  </div>
                  <input id="co2-removal-price" name="co2RemovalPrice" type="range" min="10" max="500" step="10" value={inputs.co2RemovalPrice} onChange={(e) => handleInputChange('co2RemovalPrice', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                  {expandedInfo['co2RemovalPrice'] && (
                    <div className="mt-2 text-xs text-gray-400 bg-green-900/20 p-2 rounded space-y-2">
                      {language === 'de' ? (
                        <>
                          <p>
                            Der CO₂ Removal Credit Preis beschreibt den Marktwert für gehandelte CO₂-Entnahmezertifikate (Carbon Dioxide Removal, CDR).
                          </p>
                          <p>
                            <span className="font-semibold text-green-300">Marktpreise:</span> Die angegebenen Preise orientieren sich an aktuellen Marktdurchschnitten. Den tagesaktuellen Durchschnittspreis finden Sie auf der Website: <a href="https://www.cdr.fyi" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">www.cdr.fyi</a>
                          </p>
                          <p>
                            <span className="font-semibold text-green-300">MRV und Handelskosten:</span> In der Berechnung werden 25% des CO₂ Removal Credit Preises für Monitoring, Reporting & Verification (MRV) sowie Handelsgebühren abgezogen. Dies spiegelt die tatsächlichen Kosten für die Verifizierung und den Handel der Zertifikate wider.
                          </p>
                          <p>
                            <span className="font-semibold text-green-300">Höhere Preise erzielen:</span> Es ist wichtig zu beachten, dass auch höhere Preise erzielbar sind. Diese hängen stark von der Vermarktungsstrategie des Gesamtprojekts ab, einschließlich:
                          </p>
                          <p className="ml-2">
                            • Zertifizierungsstandards und deren Anerkennung<br />
                            • Transparenz und Nachverfolgung (Tracking)<br />
                            • Kundengruppe und deren Bereitschaft zu Premium-Zahlungen<br />
                            • Langfristigkeit der Abnahmeverträge
                          </p>
                          <p>
                            Eine professionelle Vermarktungsstrategie kann daher erheblich zu besseren Preisen beitragen.
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            The CO₂ Removal Credit Price describes the market value for traded CO₂ removal certificates (Carbon Dioxide Removal, CDR).
                          </p>
                          <p>
                            <span className="font-semibold text-green-300">Market Prices:</span> The indicated prices are based on current market averages. Find the current average price for traded CO₂ removal certificates on: <a href="https://www.cdr.fyi" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">www.cdr.fyi</a>
                          </p>
                          <p>
                            <span className="font-semibold text-green-300">MRV and Trading Costs:</span> In the calculation, 25% of the CO₂ Removal Credit Price is deducted for Monitoring, Reporting & Verification (MRV) and trading fees. This reflects the actual costs of verifying and trading the certificates.
                          </p>
                          <p>
                            <span className="font-semibold text-green-300">Achieving Higher Prices:</span> It is important to note that higher prices are achievable. These depend largely on the marketing strategy of your overall project, including:
                          </p>
                          <p className="ml-2">
                            • Certification standards and their recognition<br />
                            • Transparency and tracking<br />
                            • Customer segment and willingness to pay premiums<br />
                            • Long-term offtake agreements
                          </p>
                          <p>
                            A professional marketing strategy can contribute significantly to better prices.
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <div className="text-sm">
                    <span className="text-gray-400">{t.biocharProduction}: </span>
                    <span className="font-bold text-white">
                      {formatNumber((inputs.plantCapacity * inputs.operatingHours * inputs.biocharYield) / 100000, 1)} t/{language === 'de' ? 'Jahr' : 'year'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <div className="text-sm">
                    <span className="text-gray-400">{language === 'de' ? 'Umsatz Biokohle' : 'Biochar Sales'}: </span>
                    <span className="font-bold text-white">
                      {formatNumber(((inputs.plantCapacity * inputs.operatingHours * inputs.biocharYield) / 100000) * inputs.biocharPrice)} €/{language === 'de' ? 'Jahr' : 'year'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <div className="text-sm">
                    <span className="text-gray-400">{language === 'de' ? 'CO₂ Entfernt' : 'CO₂ Removed'}: </span>
                    <span className="font-bold text-white">
                      {formatNumber(((inputs.plantCapacity * inputs.operatingHours * inputs.biocharYield) / 100000) * inputs.lcaFactor, 1)} t CO₂/{language === 'de' ? 'Jahr' : 'year'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <div className="text-sm">
                    <span className="text-gray-400">{t.certificateRevenue}: </span>
                    <span className="font-bold text-white">
                      {formatNumber(((inputs.plantCapacity * inputs.operatingHours * inputs.biocharYield) / 100000) * inputs.lcaFactor * inputs.co2RemovalPrice * 0.75)} €/{language === 'de' ? 'Jahr' : 'year'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Heat Parameters wenn aktiviert */}
            {products.heat && (
              <div className="bg-gradient-to-br from-red-900/30 to-gray-800 p-5 rounded-lg border border-red-500/30">
                <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  {t.heatParams}
                </h2>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="heat-yield" className="block text-sm font-medium text-red-300 mb-2">
                      {t.heatSoldPercentage}: <span className="font-bold text-white">{inputs.heatYield}%</span>
                    </label>
                    <input id="heat-yield" name="heatYield" type="range" min="0" max="100" step="1" value={inputs.heatYield} onChange={(e) => handleInputChange('heatYield', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                  </div>
                  <div>
                    <label htmlFor="heat-price" className="block text-sm font-medium text-red-300 mb-2">
                      {t.heatSalePrice}: <span className="font-bold text-white">{inputs.heatPrice.toFixed(3)} €/kWh</span>
                    </label>
                    <input id="heat-price" name="heatPrice" type="range" min="0.01" max="0.5" step="0.01" value={inputs.heatPrice} onChange={(e) => handleInputChange('heatPrice', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                  </div>
                  <div>
                    <label htmlFor="heat-investment" className="block text-sm font-medium text-red-300 mb-2">
                      {t.additionalInvestment} (Wärme): <span className="font-bold text-white">{formatNumber(inputs.heatInvestment)} €</span>
                    </label>
                    <input id="heat-investment" name="heatInvestment" type="range" min="0" max="500000" step="5000" value={inputs.heatInvestment} onChange={(e) => handleInputChange('heatInvestment', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                  </div>
                  <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                    <div className="text-sm">
                      <span className="text-gray-400">{language === 'de' ? 'Wärmeverkauf' : 'Heat Sales'}: </span>
                      <span className="font-bold text-white">
                        {formatNumber((inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency * (inputs.heatYield / 100) * inputs.heatPrice * inputs.operatingHours) / 100)} €/{language === 'de' ? 'Jahr' : 'year'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Electricity Parameters wenn aktiviert */}
            {products.electricity && (
              <div className="bg-gradient-to-br from-yellow-900/30 to-gray-800 p-5 rounded-lg border border-yellow-500/30">
                <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {t.electricityParams}
                </h2>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="electricity-yield" className="block text-sm font-medium text-yellow-300 mb-2">
                      {t.electricityYield}: <span className="font-bold text-white">{inputs.electricityYield}%</span>
                    </label>
                    <input id="electricity-yield" name="electricityYield" type="range" min="5" max="50" step="1" value={inputs.electricityYield} onChange={(e) => handleInputChange('electricityYield', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                  </div>
                  <div>
                    <label htmlFor="electricity-price" className="block text-sm font-medium text-yellow-300 mb-2">
                      {t.electricityPrice}: <span className="font-bold text-white">{inputs.electricityPrice.toFixed(2)} €/kWh</span>
                    </label>
                    <input id="electricity-price" name="electricityPrice" type="range" min="0.05" max="0.5" step="0.01" value={inputs.electricityPrice} onChange={(e) => handleInputChange('electricityPrice', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                  </div>
                  <div>
                    <label htmlFor="electricity-investment" className="block text-sm font-medium text-yellow-300 mb-2">
                      {t.additionalInvestment} (Strom): <span className="font-bold text-white">{formatNumber(inputs.electricityInvestment)} €</span>
                    </label>
                    <input id="electricity-investment" name="electricityInvestment" type="range" min="20000" max="1000000" step="10000" value={inputs.electricityInvestment} onChange={(e) => handleInputChange('electricityInvestment', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                  </div>
                  <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                    <div className="text-sm">
                      <span className="text-gray-400">{t.electricityProduction}: </span>
                      <span className="font-bold text-white">
                        {formatNumber((inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency / 1000) * (inputs.electricityYield / 100) * inputs.operatingHours)} kWh/{language === 'de' ? 'Jahr' : 'year'}
                      </span>
                    </div>
                    <div className="text-sm mt-2">
                      <span className="text-gray-400">{language === 'de' ? 'Bruttostromverbrauch: ' : 'Gross Electricity Consumption: '}</span>
                      <span className="font-bold text-white">
                        {formatNumber(inputs.electricalPower * inputs.operatingHours)} kWh/{language === 'de' ? 'Jahr' : 'year'}
                      </span>
                    </div>
                    {((inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency / 1000) * (inputs.electricityYield / 100) * inputs.operatingHours) > (inputs.electricalPower * inputs.operatingHours) && (
                      <>
                        <div className="text-sm mt-2">
                          <span className="text-gray-400">{language === 'de' ? 'Stromüberschuss: ' : 'Electricity Surplus: '}</span>
                          <span className="font-bold text-green-400">
                            {formatNumber((inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency / 1000) * (inputs.electricityYield / 100) * inputs.operatingHours - inputs.electricalPower * inputs.operatingHours)} kWh/{language === 'de' ? 'Jahr' : 'year'}
                          </span>
                        </div>
                        <div className="text-sm mt-2">
                          <span className="text-gray-400">{t.electricitySalesRevenue}: </span>
                          <span className="font-bold text-green-400">
                            {formatNumber(((inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency / 1000) * (inputs.electricityYield / 100) * inputs.operatingHours - inputs.electricalPower * inputs.operatingHours) * inputs.electricityPrice)} €/{language === 'de' ? 'Jahr' : 'year'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-100">
                      {language === 'de' 
                        ? '⚠️ Hinweis: Bei Stromerzeugung steht weniger Wärme zur Verfügung. Achten Sie darauf, dass die Wärme- und Stromparameter aufeinander abgestimmt sind, um realistische Szenarien zu modellieren.'
                        : '⚠️ Note: When producing electricity, less heat is available. Make sure heat and electricity parameters are coordinated to model realistic scenarios.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bio-oil Parameters wenn aktiviert */}
            {products.bioOil && (
              <div className="bg-gradient-to-br from-purple-900/30 to-gray-800 p-5 rounded-lg border border-purple-500/30">
                <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  {t.bioOilParams}
                </h2>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="bio-oil-yield" className="block text-sm font-medium text-purple-300 mb-2">
                      {t.bioOilYield}: <span className="font-bold text-white">{inputs.bioOilYield}%</span>
                    </label>
                    <input id="bio-oil-yield" name="bioOilYield" type="range" min="10" max="50" step="1" value={inputs.bioOilYield} onChange={(e) => handleInputChange('bioOilYield', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                  </div>
                  <div>
                    <label htmlFor="bio-oil-price" className="block text-sm font-medium text-purple-300 mb-2">
                      {t.bioOilPrice}: <span className="font-bold text-white">{inputs.bioOilPrice} €/t</span>
                    </label>
                    <input id="bio-oil-price" name="bioOilPrice" type="range" min="100" max="1000" step="10" value={inputs.bioOilPrice} onChange={(e) => handleInputChange('bioOilPrice', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                  </div>
                  <div>
                    <label htmlFor="bio-oil-investment" className="block text-sm font-medium text-purple-300 mb-2">
                      {t.additionalInvestment} (Bio-Öl): <span className="font-bold text-white">{formatNumber(inputs.bioOilInvestment)} €</span>
                    </label>
                    <input id="bio-oil-investment" name="bioOilInvestment" type="range" min="20000" max="2000000" step="5000" value={inputs.bioOilInvestment} onChange={(e) => handleInputChange('bioOilInvestment', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                  </div>
                  <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <div className="text-sm">
                      <span className="text-gray-400">{language === 'de' ? 'Bio-Öl Produktion' : 'Bio-Oil Production'}: </span>
                      <span className="font-bold text-white">
                        {formatNumber((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.bioOilYield / 100), 1)} t/{language === 'de' ? 'Jahr' : 'year'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <div className="text-sm">
                      <span className="text-gray-400">{language === 'de' ? 'Umsatz Bio-Öl' : 'Bio-Oil Sales'}: </span>
                      <span className="font-bold text-white">
                        {formatNumber(((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.bioOilYield / 100)) * inputs.bioOilPrice)} €/{language === 'de' ? 'Jahr' : 'year'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <p className="text-sm text-purple-100">
                      {language === 'de' 
                        ? '⚠️ Hinweis: Bei Bio-Öl-Produktion kann weniger bis kein Strom produziert werden und nur limitiert Restwärme genutzt werden. Achten Sie darauf, dass Ihre Parameter diese Konkurrenzsituation um Energie realistisch abbilden.'
                        : '⚠️ Note: When producing bio-oil, little to no electricity can be generated and only limited residual heat can be utilized. Make sure your parameters realistically reflect this competition for energy.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-6">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded"></div>
            {t.economicAnalysis}
          </h2>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-600 to-green-700 p-5 rounded-lg shadow-lg border border-green-500">
              <h3 className="text-sm font-medium text-green-100 mb-2">{t.npv}</h3>
              <p className="text-3xl font-bold text-white">
                {(results.npv || 0) > 0 ? '+' : ''}{formatNumber(results.npv || 0)}k €
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 rounded-lg shadow-lg border border-blue-500">
              <h3 className="text-sm font-medium text-blue-100 mb-2">{t.irr}</h3>
              <p className="text-3xl font-bold text-white">{(results.irr || 0).toFixed(1)}%</p>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-5 rounded-lg shadow-lg border border-orange-500">
              <h3 className="text-sm font-medium text-orange-100 mb-2">{t.paybackPeriod}</h3>
              <p className="text-3xl font-bold text-white">{(results.paybackPeriod || 0).toFixed(1)} {t.years}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-5 rounded-lg shadow-lg border border-purple-500">
              <h3 className="text-sm font-medium text-purple-100 mb-2">{t.annualCashFlow}</h3>
              <p className="text-3xl font-bold text-white">
                {formatNumber((results.annualRevenue || 0) - (results.annualCosts || 0))}k €
              </p>
            </div>
          </div>

          {/* Revenue KPIs */}
          <div className="mt-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded"></div>
              {language === 'de' ? 'Umsatz KPIs' : 'Revenue KPIs'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {(() => {
                const heatRevenue = products.heat ? (inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency / 1000) * (inputs.heatYield / 100) * inputs.heatPrice * inputs.operatingHours / 1000 : 0;
                const elecProd = ((inputs.plantCapacity * inputs.fuelHeatValue * inputs.thermalEfficiency / 1000) * (inputs.electricityYield / 100) * inputs.operatingHours);
                const elecConsumption = inputs.electricalPower * inputs.operatingHours;
                const electricityRevenue = products.electricity ? Math.max(0, (elecProd - elecConsumption) * inputs.electricityPrice / 1000) : 0;
                const bioOilRevenue = products.bioOil ? (inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.bioOilYield / 100) * inputs.bioOilPrice / 1000 : 0;
                const biocharRevenue = ((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * inputs.biocharPrice) / 1000;
                const certificateRevenue = ((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * inputs.lcaFactor * inputs.co2RemovalPrice * 0.75) / 1000;
                
                const baseClass = 'p-4 rounded-lg shadow-lg';
                const heatClass = heatRevenue === 0 ? 'bg-gradient-to-br from-gray-600 to-gray-700 border border-gray-500' : 'bg-gradient-to-br from-cyan-600 to-cyan-700 border border-cyan-500';
                const elecClass = electricityRevenue === 0 ? 'bg-gradient-to-br from-gray-600 to-gray-700 border border-gray-500' : 'bg-gradient-to-br from-yellow-600 to-yellow-700 border border-yellow-500';
                const bioOilClass = bioOilRevenue === 0 ? 'bg-gradient-to-br from-gray-600 to-gray-700 border border-gray-500' : 'bg-gradient-to-br from-purple-600 to-purple-700 border border-purple-500';
                const biocharClass = biocharRevenue === 0 ? 'bg-gradient-to-br from-gray-600 to-gray-700 border border-gray-500' : 'bg-gradient-to-br from-green-600 to-green-700 border border-green-500';
                const certClass = certificateRevenue === 0 ? 'bg-gradient-to-br from-gray-600 to-gray-700 border border-gray-500' : 'bg-gradient-to-br from-emerald-600 to-emerald-700 border border-emerald-500';
                
                const heatText = heatRevenue === 0 ? 'text-xs font-medium text-gray-300 mb-2' : 'text-xs font-medium text-cyan-100 mb-2';
                const elecText = electricityRevenue === 0 ? 'text-xs font-medium text-gray-300 mb-2' : 'text-xs font-medium text-yellow-100 mb-2';
                const bioOilText = bioOilRevenue === 0 ? 'text-xs font-medium text-gray-300 mb-2' : 'text-xs font-medium text-purple-100 mb-2';
                const biocharText = biocharRevenue === 0 ? 'text-xs font-medium text-gray-300 mb-2' : 'text-xs font-medium text-green-100 mb-2';
                const certText = certificateRevenue === 0 ? 'text-xs font-medium text-gray-300 mb-2' : 'text-xs font-medium text-emerald-100 mb-2';
                
                return (
                  <>
                    <div className={`${heatClass} ${baseClass}`}><h3 className={heatText}>{t.revenueHeat}</h3><p className="text-2xl font-bold text-white">{formatNumber(heatRevenue)}k €/{language === 'de' ? 'a' : 'y'}</p></div>
                    <div className={`${elecClass} ${baseClass}`}><h3 className={elecText}>{t.revenueElectricity}</h3><p className="text-2xl font-bold text-white">{formatNumber(electricityRevenue)}k €/{language === 'de' ? 'a' : 'y'}</p></div>
                    <div className={`${bioOilClass} ${baseClass}`}><h3 className={bioOilText}>{t.revenueBioOil}</h3><p className="text-2xl font-bold text-white">{formatNumber(bioOilRevenue)}k €/{language === 'de' ? 'a' : 'y'}</p></div>
                    <div className={`${biocharClass} ${baseClass}`}><h3 className={biocharText}>{t.revenueBiochar}</h3><p className="text-2xl font-bold text-white">{formatNumber(biocharRevenue)}k €/{language === 'de' ? 'a' : 'y'}</p></div>
                    <div className={`${certClass} ${baseClass}`}><h3 className={certText}>{t.revenueCertificates}</h3><p className="text-2xl font-bold text-white">{formatNumber(certificateRevenue)}k €/{language === 'de' ? 'a' : 'y'}</p></div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Invest KPIs */}
          <div className="mt-6 mb-6 bg-gradient-to-r from-gray-900 to-gray-800 p-5 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded"></div>
              {t.investmentSummary}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">{t.totalInvestmentLabel}: </span>
                <span className="font-bold text-white text-lg">{formatNumber(results.totalInvestment || 0)}k €</span>
              </div>
              <div>
                <span className="text-gray-400">{t.annualRevenuesLabel}: </span>
                <span className="font-bold text-green-400 text-lg">{formatNumber(results.annualRevenue || 0)}k €</span>
              </div>
              <div>
                <span className="text-gray-400">{t.annualCostsLabel}: </span>
                <span className="font-bold text-red-400 text-lg">{formatNumber(results.annualCosts || 0)}k €</span>
              </div>
            </div>
          </div>

          {/* CO2 Entnahme KPIs */}
          <div className="mt-8 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded"></div>
              {t.co2RemovalKpis}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-5 rounded-lg shadow-lg border border-emerald-500">
                <h3 className="text-sm font-medium text-emerald-100 mb-2">{t.annualCo2SinkingPerformance}</h3>
                <p className="text-3xl font-bold text-white">
                  {formatNumber((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * inputs.lcaFactor)} t CO₂/{language === 'de' ? 'Jahr' : 'year'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-5 rounded-lg shadow-lg border border-teal-500">
                <h3 className="text-sm font-medium text-teal-100 mb-2">{t.totalCo2Removal}</h3>
                <p className="text-3xl font-bold text-white">
                  {formatNumber(((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * inputs.lcaFactor) * inputs.projectLifetime)} t CO₂
                </p>
              </div>
            </div>
          </div>

          {/* Charts - Alle nebeneinander in 3 Spalten */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {/* Cumulative Cash Flow Chart */}
            <div id="cumulative-chart" className="bg-gray-900 p-3 rounded-lg border border-gray-700">
              <h3 className="text-xs font-semibold text-white mb-2">{t.cumulativeCashFlow}</h3>
              <div style={{ width: '100%', height: '350px' }}>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={results.cumulativeCashFlows} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '11px' }} labelStyle={{ color: '#f3f4f6' }} formatter={(value) => [`${formatNumber(value)}k €`, t.cumulative]} />
                    <Line type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Annual Revenue vs Costs */}
            <div id="revenue-chart" className="bg-gray-900 p-3 rounded-lg border border-gray-700">
              <h3 className="text-xs font-semibold text-white mb-2">{t.annualRevenueVsCosts}</h3>
              <div style={{ width: '100%', height: '350px' }}>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={[
                    { category: t.revenues, value: results.annualRevenue || 0 },
                    { category: t.costs, value: results.annualCosts || 0 },
                    { category: t.cashFlow, value: (results.annualRevenue || 0) - (results.annualCosts || 0) }
                  ]} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9ca3af" style={{ fontSize: '10px' }} angle={-20} textAnchor="end" height={60} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '11px' }} labelStyle={{ color: '#f3f4f6' }} formatter={(value) => `${formatNumber(value || 0)}k €`} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      <Cell fill="#10b981" />
                      <Cell fill="#6ee7b7" />
                      <Cell fill="#34d399" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Distribution Pie Chart */}
            <div id="pie-chart" className="bg-gray-900 p-3 rounded-lg border border-gray-700">
              <h3 className="text-xs font-semibold text-white mb-2">{t.revenueBreakdownChart}</h3>
              <div style={{ width: '100%', height: '350px' }}>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie data={(() => {
                      const annualFeedstock = (inputs.plantCapacity * inputs.operatingHours) / 1000;
                      const biocharProduction = annualFeedstock * (inputs.biocharYield / 100);
                      const biocharSales = biocharProduction * inputs.biocharPrice / 1000;
                      const co2Certificates = biocharProduction * inputs.lcaFactor * inputs.co2RemovalPrice / 1000;
                      let heatSales = 0;
                      if (products.heat) {
                        const thermalPower = inputs.plantCapacity * inputs.fuelHeatValue * 0.45;
                        const totalHeatProduction = thermalPower * inputs.operatingHours;
                        const soldHeatProduction = totalHeatProduction * (inputs.heatYield / 100);
                        heatSales = soldHeatProduction * inputs.heatPrice / 1000;
                      }
                      let electricitySales = 0;
                      if (products.electricity) {
                        const electricityProduction = annualFeedstock * 4.5 * (inputs.electricityYield / 100) * 1000;
                        electricitySales = electricityProduction * inputs.electricityPrice / 1000;
                      }
                      let bioOilSales = 0;
                      if (products.bioOil) {
                        const bioOilProduction = annualFeedstock * (inputs.bioOilYield / 100);
                        bioOilSales = bioOilProduction * inputs.bioOilPrice / 1000;
                      }
                      return [
                        { name: t.biocharRevenue, value: biocharSales, fill: '#10b981' },
                        { name: 'CO₂', value: co2Certificates, fill: '#34d399' },
                        { name: t.heatRevenue, value: heatSales, fill: '#ef4444' },
                        { name: t.electricityRevenue, value: electricitySales, fill: '#fbbf24' },
                        { name: t.bioOilRevenue, value: bioOilSales, fill: '#a855f7' }
                      ].filter(item => item.value > 0);
                    })()} cx={140} cy={100} labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`} outerRadius={75} innerRadius={0} dataKey="value" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '11px' }} labelStyle={{ color: '#ffffff' }} formatter={(value) => `${formatNumber(value)}k €`} />
                    <Legend verticalAlign="bottom" height={60} wrapperStyle={{ color: '#9ca3af', fontSize: '10px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Lead Capture Form */}
          <div className="mt-6 bg-gradient-to-r from-blue-900/20 to-gray-800 p-6 rounded-lg border border-blue-500/30">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">{t.beforeDownload}</h3>
            <p className="text-gray-400 text-sm mb-4">
              {language === 'de' ? 'Um den PDF-Bericht zu erstellen, geben Sie bitte Ihre Kontaktdaten an:' : 'To generate the PDF report, please provide your contact information:'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="user-name" className="block text-sm font-medium text-gray-300 mb-2">{t.yourName} *</label>
                <input id="user-name" name="userName" type="text" value={userName} onChange={(e) => { setUserName(e.target.value); setFormErrors(prev => ({ ...prev, name: '' })); }} placeholder={t.namePlaceholder} className={`w-full px-4 py-3 bg-gray-700 border ${formErrors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} />
                {formErrors.name && <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="user-email" className="block text-sm font-medium text-gray-300 mb-2">{t.yourEmail} *</label>
                <input id="user-email" name="userEmail" type="email" value={userEmail} onChange={(e) => { setUserEmail(e.target.value); setFormErrors(prev => ({ ...prev, email: '' })); }} placeholder={t.emailPlaceholder} className={`w-full px-4 py-3 bg-gray-700 border ${formErrors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} />
                {formErrors.email && <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>}
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-green-900/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-gray-300 leading-relaxed">💡 {t.toolUsageNote}</p>
            </div>
            
            <div className="mt-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input id="contact-consent" name="contactConsent" type="checkbox" checked={contactConsent} onChange={(e) => setContactConsent(e.target.checked)} className="mt-1 w-5 h-5 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-0 cursor-pointer" />
                <span className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">{t.contactConsent}</span>
              </label>
            </div>
          </div>

          {/* PDF Generation Button */}
          <div className="mt-6 flex justify-center">
            <button onClick={generatePdfReport} disabled={isGeneratingPdf} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-green-500">
              <FileDown className="w-6 h-6" />
              <span className="text-lg">{isGeneratingPdf ? t.generatingPdf : t.generatePdfReport}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t border-gray-800 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
              <Info className="w-5 h-5" />
              {language === 'de' ? 'Haftungsausschluss' : 'Disclaimer'}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {language === 'de' ? 'Diese Wirtschaftlichkeitsberechnung stellt eine Modellrechnung dar und dient ausschließlich einer ersten Einschätzung. Es wird keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der bereitgestellten Informationen und Berechnungsergebnisse übernommen.' : 'This economic calculation represents a model calculation and serves exclusively for an initial assessment. No guarantee is given for the accuracy, completeness or timeliness of the information and calculation results provided.'}
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Decarbo-Engineering GmbH</p>
            <p className="text-gray-500 text-xs">Eupener Str. 9, 53117 Bonn, Germany</p>
            <div className="pt-4">
              <a href="https://www.decarbo-engineering.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 text-sm transition-colors">
                www.decarbo-engineering.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PyrolysisCalculator;
