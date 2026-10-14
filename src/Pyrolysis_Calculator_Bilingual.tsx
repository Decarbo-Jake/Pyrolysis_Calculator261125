// ========================================
// TEIL 1 von 5: Imports, Translations und State Setup
// ========================================
// Last Updated: 2025-11-26
// Version: 2.0.1
// Changes: Biochar price minimum value set to 0 EUR
// Status: Production    Ready

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Calculator, Zap, Flame, Droplets, Leaf, Info, Globe, FileDown, ArrowDown, ArrowUp, ArrowRight, ArrowDownRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import decarboLogo from './assets/decarbo-logo.png';
import biocharEuropeLogo from './assets/Biochar Europe Logo Small White@3x.svg';
import WhyProjectsFail from './features/why-projects-fail/WhyProjectsFail';
import { Language } from './features/why-projects-fail/questions';

// Translation object
const translations = {
  de: {
    title: "Dateneingabe",
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
    revenueBiochar: "Umsatz Biochar",
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
    plantCapacity: "Anlagendurchsatz (Trockenmasse)",
    fuelBulkDensity: "Brennstoff Schüttdichte",
    fuelBulkDensityInfo: "Die Schüttdichte von Biomasse-Brennstoffen variiert stark je nach Material, Aufbereitung und Wassergehalt. Die folgenden Werte beziehen sich auf einen Wassergehalt von ca. 20%.",
    operatingHours: "Volllaststunden/Jahr",
    projectLifetime: "Projektlaufzeit",
    years: "Jahre",
    electricalPower: "Elektrische Nennleistung",
    electricalPowerInfo: "Je nach Anlagengröße und Typ fallen unterschiedliche elektrische Verbrauchsleistungen an. Die Angabe hier bezieht sich auf die durchschnittliche Last, die die gesamte Anlage produziert oder benötigt. Wichtig ist: Es gibt autotherme Anlagen, die die thermische Energie aus der Feuerung nutzen, um den Prozess aufrechtzuerhalten, und es gibt strombasierte Anlagen, die Strom beziehen, um die Biomasse zu erhitzen. Dieser kann aus der eigenen Produktion stammen oder aus dem Netz bezogen werden. Hier ist auf die Hersteller- und Projektdaten zu achten.",
    thermalEfficiency: "Wirkungsgrad Wärmetauscher",
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
    biocharCarbonContent: "C-Anteil in Biochar",
    biocharHeatingValue: "Heizwert Biochar",
    biocharBulkDensity: "Schüttdichte Biochar",
    autothermalShare: "Prozesswärmeanteil Autothermie",
    ofFeedstock: "vom Rohstoff",
    biocharProduction: "Biochar Produktion",
    biocharPrice: "Biochar Preis",
    biocharPriceInfo: "Der Marktpreis für Biokohle variiert erheblich in Abhängigkeit von Substrat, Anwendungsbereich, Vermarktungsstrategie, Vertriebskanälen und regionalem Standort. Für die Bodenanwendung in Europa kann ein konservativer Richtwert von 300 €/t angesetzt werden. Für spezifische Anwendungsfälle und alternative Absatzmärkte empfehlen wir eine individuelle Preisanalyse.",
    lcaFactor: "LCA Faktor",
    lcaFactorInfo: "Der LCA-Faktor beschreibt die tatsächliche CO₂-Senkenleistung der produzierten Biokohle unter Berücksichtigung aller Prozessemissionen. Was wird berücksichtigt? Biomasse-Logistik (Transport zur Anlage), Vorbehandlung und Trocknung, Energieverbrauch der Pyrolyseanlage, Nachbehandlung und Konfektionierung, Transport und Ausbringung der Biokohle. Berechnung: Physikalisch entspricht 1 kg gebundener Kohlenstoff in der Biokohle ca. 3,67 kg CO₂. Von diesem theoretischen Maximum werden die Lebenszyklusemissionen abgezogen, um die netto CO₂-Senkenleistung zu ermitteln. Typische Werte: Optimierte Anlagen: 2,5 - 3,0 tCO₂/t Biokohle; Durchschnittliche Anlagen: 2,0 - 2,5 tCO₂/t Biokohle; Konservative Kalkulation: 2,4 tCO₂/t Biokohle (Standardwert). Wichtig: Der finale LCA-Faktor ist projektspezifisch und erfordert eine detaillierte Lebenszyklusanalyse nach anerkannten Standards.",
    co2RemovalPrice: "CO₂ Removal Credit Preis",
    co2RemovalPriceInfo: "Der CO₂ Removal Credit Preis beschreibt den Marktwert für gehandelte CO₂-Entnahmezertifikate (Carbon Dioxide Removal, CDR). Die angegebenen Preise orientieren sich an aktuellen Marktdurchschnitten. Den tagesaktuellen Durchschnittspreis für gehandelte CO₂-Entnahmezertifikate finden Sie auf der Website www.cdr.fyi. Es ist wichtig zu beachten, dass auch höhere Preise erzielbar sind. Diese hängen stark von der Vermarktungsstrategie des Gesamtprojekts ab, einschließlich: Zertifizierungsstandards und deren Anerkennung, Transparenz und Nachverfolgung (Tracking), Kundengruppe und deren Bereitschaft zu Premium-Zahlung, und Langfristigkeit der Abnahmeverträge. Eine professionelle Vermarktungsstrategie kann daher erheblich zu besseren Preisen beitragen.",
    certificateFeeRate: "Handels- & dMRV-Kosten",
    certificateFeeRateInfo: "Kostenanteil, der vom Brutto-Zertifikatspreis für Handelsplattformgebühren und dMRV-Kosten (digitale Messung, Berichterstattung & Verifizierung) abgezogen wird. Typische Handelsplattformen berechnen 20–30%. Bei direkten Abnahmeverträgen können die Gebühren niedriger ausfallen. Der angezeigte Zertifikatserlös ist bereits um diesen Kostenanteil bereinigt.",
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
    electricityYield: "Stromausbeute/el. Wirkungsgrad (%)",
    electricityProduction: "Stromproduktion",
    electricitySalesRevenue: "Umsatz Stromverkauf",
    electricityPrice: "Strompreis (€/kWh)",
    bioOilYield: "Bio-Öl Ausbeute (% vom Rohstoff)",
    bioOilPrice: "Bio-Öl Preis (€/t)",
    bioOilHeatingValue: "Heizwert Pyrolyseöl (MJ/kg)",
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
    title: "Data Input",
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
    plantCapacity: "Plant Capacity (Dry Mass)",
    fuelBulkDensity: "Fuel Bulk Density",
    fuelBulkDensityInfo: "The bulk density of biomass fuels varies significantly depending on material, processing, and moisture content. The following values refer to a moisture content of approx. 20%.",
    operatingHours: "Full-Load-Hours/Year",
    projectLifetime: "Project Lifetime",
    years: "Years",
    electricalPower: "Electrical Rated Power",
    electricalPowerInfo: "Depending on plant size and type, different electrical power consumption levels occur. The specification here refers to the average load that the entire plant produces or requires. It is important to note: There are autothermal plants that use thermal energy from combustion to maintain the process, and there are electricity-based plants that purchase electricity to heat the biomass. This electricity can come from the plant's own production or from the grid. It is important to pay attention to manufacturer and project data.",
    thermalEfficiency: "Heat Exchanger Efficiency",
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
    biocharCarbonContent: "Carbon Content in Biochar",
    biocharHeatingValue: "Biochar Heating Value",
    biocharBulkDensity: "Biochar Bulk Density",
    autothermalShare: "Autothermal Process Heat Share",
    ofFeedstock: "of feedstock",
    biocharProduction: "Biochar Production",
    biocharPrice: "Biochar Price",
    biocharPriceInfo: "The market price for biochar varies significantly depending on substrate, application field, marketing strategy, distribution channels, and regional location. For soil application in Europe, a conservative reference value of €300/t can be assumed. For specific applications and alternative sales channels, we recommend individual price analysis.",
    lcaFactor: "LCA Factor",
    lcaFactorInfo: "The LCA factor describes the actual CO₂ removal performance of the produced biochar considering all process emissions. What is considered? Biomass logistics (transport to facility), pre-treatment and drying, energy consumption of the pyrolysis plant, post-treatment and packaging, transport and application of biochar. Calculation: Physically, 1 kg of bound carbon in biochar corresponds to approximately 3.67 kg CO₂. From this theoretical maximum, lifecycle emissions are subtracted to determine net CO₂ removal performance. Typical values: Optimized plants: 2.5 - 3.0 tCO₂/t biochar; Average plants: 2.0 - 2.5 tCO₂/t biochar; Conservative calculation: 2.4 tCO₂/t biochar (standard value). Important: The final LCA factor is project-specific and requires detailed lifecycle assessment according to recognized standards.",
    co2RemovalPrice: "CO₂ Removal Credit Price",
    co2RemovalPriceInfo: "The CO₂ Removal Credit Price describes the market value for traded CO₂ removal certificates (Carbon Dioxide Removal, CDR). The indicated prices are based on current market averages. You can find current average prices for traded CO₂ removal certificates on the website www.cdr.fyi. It is important to note that higher prices are achievable. These depend largely on the marketing strategy of the overall project, including: certification standards and their recognition, transparency and tracking, customer segment and willingness to pay premiums, and long-term offtake agreements. A professional marketing strategy can therefore contribute significantly to better prices.",
    certificateFeeRate: "Trading & dMRV Fees",
    certificateFeeRateInfo: "Cost share deducted from the gross certificate price for trading platform commissions and dMRV (digital Measurement, Reporting & Verification) fees. Typical trading platforms charge 20–30%. Direct offtake agreements may have lower fees. All displayed certificate revenues already reflect this deduction.",
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
    electricityYield: "Electricity Yield/el. Efficiency (%)",
    electricityProduction: "Electricity Production",
    electricitySalesRevenue: "Electricity Sales Revenue",
    electricitySurplus: "Electricity Surplus",
    electricityPrice: "Electricity Price (€/kWh)",
    electricitySalePriceLabel: "Electricity Sale Price",
    bioOilYield: "Bio-Oil Yield (% of feedstock)",
    bioOilPrice: "Bio-Oil Price (€/t)",
    bioOilHeatingValue: "Pyrolysis Oil Heating Value (MJ/kg)",
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
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_57s4c3x';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_or8cy4f';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '4EfMLLsNmJhAeX53T';
  
  const [language, setLanguage] = useState('de');
  const [cookieConsent, setCookieConsent] = useState(false);
  const t = translations[language];
  
  const [products, setProducts] = useState({
    biochar: true,
    heat: false,
    electricity: false,
    bioOil: false
  });

  const [inputs, setInputs] = useState({
    plantCapacity: 1000,
    fuelBulkDensity: 400,
    fuelHeatValue: 4,
    operatingHours: 7000,
    projectLifetime: 10,
    discountRate: 6,
    electricalPower: 100,
    electricityConsumptionPrice: 0.25,
    thermalEfficiency: 90,
    initialInvestment: 3000000,
    feedstockCost: 50,
    laborCost: 50000,
    maintenanceCost: 3000000 * 0.025, // 2.5% of initial investment
    biocharYield: 25,
    biocharCarbonContent: 80,
    biocharHeatingValue: 28,
    biocharBulkDensity: 250,
    autothermalShare: 10,
    biocharPrice: 300,
    lcaFactor: 2.4,
    co2RemovalPrice: 100,
    certificateFeeRate: 25,   // % deducted for trading + dMRV fees
    heatYield: 40,
    heatPrice: 0.08,
    electricityYield: 18,
    electricityPrice: 0.15,
    usableResidualHeat: 50,
    bioOilYield: 20,
    bioOilPrice: 400,
    bioOilHeatingValue: 22
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

  // Computed: Intermediate energy values
  const pyrolysisGasEnergyMW = (inputs.plantCapacity * inputs.fuelHeatValue / 1000) - (inputs.plantCapacity * (inputs.biocharYield / 100) * inputs.biocharHeatingValue / (1000 * 3.6));
  const oilEnergyMW = products.bioOil ? (inputs.plantCapacity * (1 - inputs.biocharYield / 100)) * (inputs.bioOilYield / 100) * inputs.bioOilHeatingValue / 3600 : 0;
  const residualGasEnergyMW = pyrolysisGasEnergyMW - oilEnergyMW;
  // Computed: Wärmestrom (heat flow after autothermal share; based on residual gas when oil condensation is active)
  const waermestromMW = residualGasEnergyMW * (1 - inputs.autothermalShare / 100);
  const waermestromKW = waermestromMW * 1000;
  // Electrical power and production from Wärmestrom × Stromausbeute
  const elecPowerKW = products.electricity ? waermestromKW * (inputs.electricityYield / 100) : 0;
  const elecProductionKWh = products.electricity ? elecPowerKW * inputs.operatingHours : 0;
  // Residual heat after electricity generation
  const residualHeatMW = products.electricity ? waermestromMW * (1 - inputs.electricityYield / 100) : waermestromMW;
  const usableResidualHeatMW = products.electricity ? residualHeatMW * (inputs.usableResidualHeat / 100) : waermestromMW;
  // Thermal rated power: based on usable residual heat (if electricity active) or full Wärmestrom
  const thermalRatedPowerMW = (products.electricity ? usableResidualHeatMW : waermestromMW) * (inputs.thermalEfficiency / 100);
  const thermalRatedPowerKW = thermalRatedPowerMW * 1000;

  const handleProductChange = (product) => {
    if (product === 'biochar') return;
    setProducts(prev => ({ ...prev, [product]: !prev[product] }));
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const calculateNPV = () => {
    const { plantCapacity, operatingHours, projectLifetime, discountRate, initialInvestment, feedstockCost, laborCost, maintenanceCost, biocharYield, biocharPrice, heatYield, heatPrice, electricityYield, electricityPrice, bioOilYield, bioOilPrice, certificateFeeRate } = inputs;
    
    const annualFeedstock = (plantCapacity * operatingHours) / 1000;
    
    const totalInvestment = initialInvestment;
    
    let annualRevenue = 0;
    
    // Biochar Revenue
    const biocharProduction = annualFeedstock * (biocharYield / 100);
    const biocharSalesRevenue = biocharProduction * biocharPrice;
    annualRevenue += biocharSalesRevenue;
    
    // CO₂ Certificate Revenue
    const annualCO2Removal = biocharProduction * (inputs.biocharCarbonContent / 100);
    const certificateRevenue =
      annualCO2Removal
      * inputs.co2RemovalPrice
      * (1 - certificateFeeRate / 100);
    annualRevenue += certificateRevenue;
    
    // Heat Revenue — Thermische Nennleistung × Volllaststunden × Anteil verkaufter Wärme
    if (products.heat) {
      const heatRevenue = thermalRatedPowerKW * (inputs.heatYield / 100) * operatingHours * heatPrice;
      annualRevenue += heatRevenue;
    }
    
    // Electricity Revenue (only surplus counted) — Stromproduktion = Wärmestrom × Stromausbeute
    let electricityProduction = 0;
    if (products.electricity) {
      electricityProduction = waermestromKW * (electricityYield / 100) * operatingHours;
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
    // Electricity costs only for net consumption (gross consumption minus production)
    const grossElectricityConsumption = inputs.electricalPower * operatingHours;
    const netElectricityConsumption = Math.max(0, grossElectricityConsumption - electricityProduction);
    const annualElectricityCost = netElectricityConsumption * inputs.electricityConsumptionPrice;
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

  // Automatisch Wartungskosten an 2.5% der Gesamtinvestition anpassen
  useEffect(() => {
    const guidanceValue = inputs.initialInvestment * 0.025;
    setInputs(prev => ({ ...prev, maintenanceCost: guidanceValue }));
  }, [inputs.initialInvestment]);

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
      const heatRev = products.heat ? (thermalRatedPowerKW * (inputs.heatYield / 100) * inputs.operatingHours * inputs.heatPrice / 1000) : 0;
      const elecRev = products.electricity ? Math.max(0, (elecProductionKWh - inputs.electricalPower * inputs.operatingHours) * inputs.electricityPrice / 1000) : 0;
      const bioOilRev = products.bioOil ? ((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.bioOilYield / 100) * inputs.bioOilPrice) : 0;
      const biocharRev = (inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * inputs.biocharPrice / 1000;
      const certRev = ((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * (inputs.biocharCarbonContent / 100) * inputs.co2RemovalPrice * (1 - inputs.certificateFeeRate / 100)) / 1000;
      const annualCO2 = (inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * (inputs.biocharCarbonContent / 100);
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
        biochar_carbon_content: inputs.biocharCarbonContent,
        co2_removal_price: formatNumber(inputs.co2RemovalPrice),
        certificate_fee_rate: inputs.certificateFeeRate,
        
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
      
      // Pre-load logo as data URL synchronously
      let logoDataUrl: string | null = null;
      let logoAspectRatio = 1;
      try {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          logoImg.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = logoImg.width;
            canvas.height = logoImg.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(logoImg, 0, 0);
              logoDataUrl = canvas.toDataURL('image/png');
              logoAspectRatio = logoImg.width / logoImg.height;
            }
            resolve();
          };
          logoImg.onerror = () => resolve();
          logoImg.src = decarboLogo;
        });
      } catch (err) {
        console.warn('Logo pre-load failed:', err);
      }
      
      // Header function with logo (1/3 page width, centered)
      const addHeader = () => {
        pdf.setFillColor(17, 24, 39);
        pdf.rect(0, 0, pageWidth, 50, 'F');
        
        if (logoDataUrl) {
          const logoWidth = pageWidth / 3;
          const logoHeight = logoWidth / logoAspectRatio;
          const logoX = (pageWidth - logoWidth) / 2;
          const logoY = (50 - logoHeight) / 2;
          pdf.addImage(logoDataUrl, 'PNG', logoX, Math.max(logoY, 2), logoWidth, Math.min(logoHeight, 46));
        }
        
        pdf.setDrawColor(34, 197, 94);
        pdf.setLineWidth(0.5);
        pdf.line(margin, 48, pageWidth - margin, 48);
        return 55;
      };
      
      yPosition = addHeader();
      
      // Title - "Pyrolyse-Anlagen Wirtschaftlichkeitsrechner" (0,5cm = ~3mm tiefer)
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55);
      const titleText = language === 'de' ? 'Pyrolyse-Anlagen ROI-Rechner Beta 2.0' : 'Pyrolysis Plant ROI Calculator Beta 2.0';
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
      const heatRev = products.heat ? (thermalRatedPowerKW * (inputs.heatYield / 100) * inputs.operatingHours * inputs.heatPrice / 1000) : 0;
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
      const elecRev = products.electricity ? Math.max(0, (elecProductionKWh - inputs.electricalPower * inputs.operatingHours) * inputs.electricityPrice / 1000) : 0;
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
      pdf.text('Umsatz Biochar', margin + 1, yPosition + 3);
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
      const certRev = ((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * (inputs.biocharCarbonContent / 100) * inputs.co2RemovalPrice * (1 - inputs.certificateFeeRate / 100)) / 1000;
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
      const operatingLabel = language === 'de' ? 'Volllaststunden' : 'Full-Load-Hours';
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
      const sankeyTitle = language === 'de' ? 'Sankey-Diagramm – Energiefluss' : 'Sankey Diagram – Energy Flow';
      
      const chartIds = ['cumulative-chart', 'revenue-chart', 'pie-chart', 'sankey-chart'];
      const chartTitles = [cumulativeTitle, revenueTitle, pieTitle, sankeyTitle];
      
      // Small delay before capturing charts
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Calculate max chart height so 2 charts fit per page (header=55, footer=15, title overhead=12 per chart, gap=4)
      const usablePageH = pageHeight - 55 - 15;
      const maxChartSlotH = (usablePageH - 12) / 2; // each slot: title(6) + chart + gap(8) ≈ 14 overhead
      const maxChartH = maxChartSlotH - 14;
      
      for (let i = 0; i < chartIds.length; i++) {
        try {
          const chartElement = document.getElementById(chartIds[i]);
          
          if (chartElement) {
            try {
              const canvas = await html2canvas(chartElement, {
                backgroundColor: '#111827',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true
              });
              
              // Scale proportionally: fit to contentWidth, then cap height
              const imgAspect = canvas.width / canvas.height;
              let drawW = contentWidth;
              let drawH = contentWidth / imgAspect;
              if (drawH > maxChartH) {
                drawH = maxChartH;
                drawW = drawH * imgAspect;
              }
              
              // Check if we need a new page
              if (yPosition + drawH + 14 > pageHeight - 15) {
                pdf.addPage();
                yPosition = addHeader();
              }
              
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(16, 185, 129);
              const chartTitle = String(chartTitles[i] || '');
              pdf.text(chartTitle, margin, yPosition);
              yPosition += 6;
              
              const imgData = canvas.toDataURL('image/png');
              const drawX = margin + (contentWidth - drawW) / 2;
              pdf.addImage(imgData, 'PNG', drawX, yPosition, drawW, drawH);
              yPosition += drawH + 8;
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
      {/* Cookie Consent Banner - Small Bottom Bar */}
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <a href="https://www.decarbo-engineering.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <img src={decarboLogo} alt="Decarbo Engineering" className="h-24 w-auto cursor-pointer" />
              </a>
              <div className="flex flex-col items-start ml-10">
                <span className="text-white text-xs font-bold mb-1 tracking-wide pl-[91px]">In cooperation with:</span>
                <img src={biocharEuropeLogo} alt="Biochar Europe" className="h-[81px] w-auto" />
              </div>
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
          <div className="flex flex-col lg:flex-row items-end gap-12 mb-12">
            {/* Left Content */}
            <div className="flex-1">
              {/* Title Section */}
              <div className="mb-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-2">
                  {language === 'de' ? 'Pyrolyse-Anlagen' : 'Pyrolysis Plants'}
                </h1>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  {language === 'de' ? 'ROI-Rechner Beta 2.0' : 'ROI Calculator Beta 2.0'}
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
                  <div className="flex items-center gap-3">
                    <input id="plant-capacity" name="plantCapacity" type="range" min="200" max="20000" step="50" value={inputs.plantCapacity} onChange={(e) => handleInputChange('plantCapacity', e.target.value)} className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                    <input type="number" min="200" max="20000" step="50" value={inputs.plantCapacity} onChange={(e) => handleInputChange('plantCapacity', e.target.value)} className="w-28 px-2 py-1 text-sm text-white bg-gray-700 border border-blue-500/50 rounded-md text-right focus:outline-none focus:border-blue-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="fuel-bulk-density" className="block text-sm font-medium text-blue-300 mb-2">
                      {t.fuelBulkDensity}: <span className="font-bold text-white">{inputs.fuelBulkDensity} kg/m³</span>
                    </label>
                    <button onClick={() => toggleInfo('fuelBulkDensity')} className="text-blue-400 hover:text-blue-300 ml-2">
                      <Info className="w-6 h-6" />
                    </button>
                  </div>
                  <input id="fuel-bulk-density" name="fuelBulkDensity" type="range" min="0" max="1000" step="10" value={inputs.fuelBulkDensity} onChange={(e) => handleInputChange('fuelBulkDensity', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  {expandedInfo['fuelBulkDensity'] && (
                    <div className="mt-2 text-xs text-gray-400 bg-blue-900/20 p-2 rounded">
                      <p className="mb-2">{t.fuelBulkDensityInfo}</p>
                      <table className="w-full text-xs border-collapse mt-2">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left py-1 pr-2 text-blue-300">{language === 'de' ? 'Brennstoff' : 'Fuel'}</th>
                            <th className="text-center py-1 px-2 text-blue-300">{language === 'de' ? 'Schüttdichte (20% H₂O)' : 'Bulk Density (20% H₂O)'}</th>
                            <th className="text-left py-1 pl-2 text-blue-300">{language === 'de' ? 'Anmerkung' : 'Note'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { fuel: language === 'de' ? 'Holzpellets (6mm)' : 'Wood Pellets (6mm)', density: '600–700', note: language === 'de' ? 'Normiert, hohe Dichte' : 'Standardized, high density' },
                            { fuel: language === 'de' ? 'Hartholz-Hackschnitzel (G30)' : 'Hardwood Chips (G30)', density: '350–450', note: language === 'de' ? 'Buche, Eiche – kompakt' : 'Beech, oak – compact' },
                            { fuel: language === 'de' ? 'Weichholz-Hackschnitzel (G30)' : 'Softwood Chips (G30)', density: '250–350', note: language === 'de' ? 'Fichte, Kiefer – lockerer' : 'Spruce, pine – looser' },
                            { fuel: language === 'de' ? 'Waldrestholz-Hackschnitzel' : 'Forest Residue Chips', density: '200–300', note: language === 'de' ? 'Mit Rinde und Ästen' : 'With bark and branches' },
                            { fuel: language === 'de' ? 'Landschaftspflegeholz' : 'Landscape Mgmt. Wood', density: '180–280', note: language === 'de' ? 'Heterogen, oft mit Grünschnitt' : 'Heterogeneous, often with green cuttings' },
                            { fuel: language === 'de' ? 'Rinde / Borke' : 'Bark', density: '250–350', note: language === 'de' ? 'Variabel je nach Holzart' : 'Variable depending on wood species' },
                            { fuel: language === 'de' ? 'Stroh (gehäckselt)' : 'Straw (chopped)', density: '80–120', note: language === 'de' ? 'Sehr locker, niedrige Dichte' : 'Very loose, low density' },
                            { fuel: language === 'de' ? 'Getrockneter Klärschlamm' : 'Dried Sewage Sludge', density: '600–800', note: language === 'de' ? 'Granulat, hoher Ascheanteil' : 'Granulate, high ash content' },
                            { fuel: language === 'de' ? 'Gärrest (getrocknet)' : 'Digestate (dried)', density: '400–550', note: language === 'de' ? 'Abhängig von Trocknungsgrad' : 'Depending on drying degree' },
                          ].map((row, i) => (
                            <tr key={i} className="border-b border-gray-700/50">
                              <td className="py-1 pr-2 text-gray-300">{row.fuel}</td>
                              <td className="py-1 px-2 text-center font-semibold text-blue-300">{row.density} kg/m³</td>
                              <td className="py-1 pl-2 text-gray-500">{row.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="mt-2 text-gray-500 italic">
                        {language === 'de'
                          ? '→ Alle Werte bei ca. 20% Wassergehalt. Die tatsächliche Schüttdichte hängt von Korngröße, Aufbereitung und Feuchte ab.'
                          : '→ All values at approx. 20% moisture content. Actual bulk density depends on particle size, processing, and moisture.'}
                      </p>
                    </div>
                  )}
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
                  <div className="flex items-center gap-3">
                    <input id="initial-investment" name="initialInvestment" type="range" min="100000" max="20000000" step="10000" value={inputs.initialInvestment} onChange={(e) => handleInputChange('initialInvestment', e.target.value)} className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    <input type="number" min="100000" max="20000000" step="10000" value={inputs.initialInvestment} onChange={(e) => handleInputChange('initialInvestment', e.target.value)} className="w-36 px-2 py-1 text-sm text-white bg-gray-700 border border-orange-500/50 rounded-md text-right focus:outline-none focus:border-orange-400" />
                  </div>
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
                  <input id="labor-cost" name="laborCost" type="range" min="0" max="500000" step="1000" value={inputs.laborCost} onChange={(e) => handleInputChange('laborCost', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
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
                    const guidanceValue = inputs.initialInvestment * 0.025;
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
                          ? Math.max(0, inputs.electricalPower * inputs.operatingHours - elecProductionKWh)
                          : inputs.electricalPower * inputs.operatingHours
                      )} kWh/{language === 'de' ? 'Jahr' : 'year'}
                    </span>
                  </div>
                  <div className="text-sm mt-2">
                    <span className="text-gray-400">{t.annualElectricityCost}: </span>
                    <span className="font-bold text-white">
                      {formatNumber(
                        products.electricity 
                          ? Math.max(0, inputs.electricalPower * inputs.operatingHours - elecProductionKWh) * inputs.electricityConsumptionPrice
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

            {/* ============================================ */}
            {/* PROCESS FLOW DIAGRAM                        */}
            {/* ============================================ */}
            <div className="lg:col-span-3 flex flex-col items-center space-y-0">

              {/* ── FEED INPUT BOX ── */}
              <div className="w-full bg-gradient-to-r from-blue-900/50 to-blue-800/30 p-4 rounded-lg border border-blue-500/40 text-center">
                <h3 className="text-lg font-bold text-blue-300 mb-1">
                  {language === 'de' ? '📥 Biomasse-Eingang' : '📥 Biomass Feed'}
                </h3>
                <div className="flex justify-center gap-6 text-sm">
                  <span className="text-gray-300">
                    {language === 'de' ? 'Durchsatz' : 'Throughput'}: <span className="font-bold text-white">{formatNumber(inputs.plantCapacity)} kg/h</span>
                    {inputs.fuelBulkDensity > 0 && (
                      <span className="text-gray-400 ml-1">({(inputs.plantCapacity / inputs.fuelBulkDensity).toFixed(1)} m³/h)</span>
                    )}
                  </span>
                  <span className="text-gray-300">
                    {language === 'de' ? 'Feuerungsleistung' : 'Combustion Power'}: <span className="font-bold text-white">{(inputs.plantCapacity * inputs.fuelHeatValue / 1000).toFixed(2)} MW</span>
                  </span>
                </div>
              </div>

              {/* Arrow: Feed → Pyrolysis */}
              <div className="flex flex-col items-center py-1">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-8 bg-blue-400"></div>
                  <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[14px] border-l-transparent border-r-transparent border-t-blue-400"></div>
                </div>
              </div>

              {/* ── PYROLYSIS BOX ── */}
              <div className="w-full bg-gradient-to-br from-orange-900/40 to-gray-800 p-5 rounded-lg border-2 border-orange-500/60">
                <h2 className="text-xl font-bold text-orange-400 mb-1 text-center">
                  🔥 {language === 'de' ? 'PYROLYSE' : 'PYROLYSIS'} (600°C – 700°C)
                </h2>
                <p className="text-xs text-gray-400 text-center mb-4">
                  {language === 'de' ? 'Thermochemische Zersetzung unter Sauerstoffausschluss' : 'Thermochemical decomposition in absence of oxygen'}
                </p>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="biochar-yield" className="block text-sm font-medium text-orange-300 mb-2">
                      {t.biocharYield}: <span className="font-bold text-white">{inputs.biocharYield}%</span>
                    </label>
                    <input id="biochar-yield" name="biocharYield" type="range" min="10" max="50" step="1" value={inputs.biocharYield} onChange={(e) => handleInputChange('biocharYield', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="biochar-carbon-content" className="block text-sm font-medium text-orange-300 mb-2">
                        {t.biocharCarbonContent}: <span className="font-bold text-white">{inputs.biocharCarbonContent}%</span>
                      </label>
                      <button onClick={() => toggleInfo('biocharCarbonContent')} className="text-orange-400 hover:text-orange-300 ml-2">
                        <Info className="w-6 h-6" />
                      </button>
                    </div>
                    <input id="biochar-carbon-content" name="biocharCarbonContent" type="range" min="0" max="100" step="1" value={inputs.biocharCarbonContent} onChange={(e) => handleInputChange('biocharCarbonContent', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    {expandedInfo['biocharCarbonContent'] && (
                      <div className="mt-2 text-xs text-gray-400 bg-orange-900/20 p-2 rounded">
                        <p className="mb-2 font-bold text-orange-300">
                          {language === 'de'
                            ? 'ℹ️ Dieser Parameter ist rein informativ und fließt nicht in die wirtschaftliche Berechnung ein. Die CO₂-Senkenleistung wird über den LCA-Faktor berechnet.'
                            : 'ℹ️ This parameter is for informational purposes only and does not affect the economic calculation. CO₂ removal performance is calculated via the LCA factor.'}
                        </p>
                        <p className="mb-2">
                          {language === 'de'
                            ? 'Der Kohlenstoffanteil (C-Anteil) in der Biokohle variiert stark je nach Ausgangsmaterial. Unterschiedliche Biomassen enthalten unterschiedlich hohe mineralische (Asche-)Anteile. Während der Pyrolyse werden diese mineralischen Bestandteile in der Kohle aufkonzentriert – der organische Anteil wird teils in Gas umgewandelt, die Mineralien bleiben jedoch vollständig in der Kohle. Je höher der Aschegehalt der Biomasse, desto niedriger der C-Anteil in der resultierenden Biokohle.'
                            : 'The carbon content (C-content) in biochar varies significantly depending on the feedstock. Different biomasses contain varying amounts of mineral (ash) components. During pyrolysis, these minerals become concentrated in the char – organic matter is partly converted to gas, but minerals remain entirely in the char. The higher the ash content of the biomass, the lower the C-content in the resulting biochar.'}
                        </p>
                        <table className="w-full text-xs border-collapse mt-2">
                          <thead>
                            <tr className="border-b border-gray-600">
                              <th className="text-left py-1 pr-2 text-orange-300">{language === 'de' ? 'Biomasse / Kohle' : 'Biomass / Char'}</th>
                              <th className="text-center py-1 px-2 text-orange-300">{language === 'de' ? 'Asche-gehalt Kohle' : 'Ash Content Char'}</th>
                              <th className="text-center py-1 px-2 text-orange-300">{language === 'de' ? 'C-Anteil Kohle' : 'C-Content Char'}</th>
                              <th className="text-left py-1 pl-2 text-orange-300">{language === 'de' ? 'Anmerkung' : 'Note'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { biomass: language === 'de' ? 'Klärschlamm-Kohle' : 'Sewage Sludge Char', ash: '50–70%', carbon: '30–50%', note: language === 'de' ? 'Sehr hoher Mineralanteil (P, Ca, Si)' : 'Very high mineral content (P, Ca, Si)' },
                              { biomass: language === 'de' ? 'Gärrest-Kohle' : 'Digestate Char', ash: '35–55%', carbon: '45–65%', note: language === 'de' ? 'Nährstoffreich, hoher Ascheanteil' : 'Nutrient-rich, high ash content' },
                              { biomass: language === 'de' ? 'Hühnermist-Kohle' : 'Poultry Manure Char', ash: '30–50%', carbon: '50–70%', note: language === 'de' ? 'Hoher Mineralanteil (Ca, P, K)' : 'High mineral content (Ca, P, K)' },
                              { biomass: language === 'de' ? 'Stroh-Kohle' : 'Straw Char', ash: '15–25%', carbon: '75–85%', note: language === 'de' ? 'Mittlerer Silizium-Anteil' : 'Medium silicon content' },
                              { biomass: language === 'de' ? 'Landschaftspflege-Kohle' : 'Landscape Mgmt. Char', ash: '8–18%', carbon: '82–92%', note: language === 'de' ? 'Variabel je nach Mischung' : 'Variable depending on mix' },
                              { biomass: language === 'de' ? 'Altholz-Kohle (A1–A2)' : 'Waste Wood Char (A1–A2)', ash: '5–12%', carbon: '88–95%', note: language === 'de' ? 'Leichte Verunreinigungen möglich' : 'Minor contamination possible' },
                              { biomass: language === 'de' ? 'Waldrestholz-Kohle' : 'Forest Residue Char', ash: '3–8%', carbon: '92–97%', note: language === 'de' ? 'Gute Qualität, etwas Rinde' : 'Good quality, some bark' },
                              { biomass: language === 'de' ? 'Saubere Hackschnitzel-Kohle' : 'Clean Woodchip Char', ash: '1–4%', carbon: '96–99%', note: language === 'de' ? 'Niedrigster Aschegehalt, höchster C-Anteil' : 'Lowest ash, highest C-content' },
                            ].map((row, i) => (
                              <tr key={i} className="border-b border-gray-700/50">
                                <td className="py-1 pr-2 text-gray-300">{row.biomass}</td>
                                <td className="py-1 px-2 text-center text-gray-300">{row.ash}</td>
                                <td className="py-1 px-2 text-center font-semibold text-orange-300">{row.carbon}</td>
                                <td className="py-1 pl-2 text-gray-500">{row.note}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p className="mt-2 text-gray-500 italic">
                          {language === 'de'
                            ? '→ Je sauberer das Holz, desto höher der C-Anteil in der Biokohle und desto mehr CO₂-Zertifikate können generiert werden.'
                            : '→ The cleaner the wood, the higher the C-content in biochar and the more CO₂ removal certificates can be generated.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Arrows: Pyrolysis → Biochar (left) + Pyrolysis Gas (right) + Autothermie (far right) */}
              <div className="w-full grid grid-cols-6 gap-0">
                <div className="col-start-2 flex flex-col items-center py-1">
                  <div className="w-6 h-8 bg-green-400"></div>
                  <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[14px] border-l-transparent border-r-transparent border-t-green-400"></div>
                  <span className="text-sm font-bold text-green-300 mt-0.5">
                    {language === 'de' ? 'Biokohle' : 'Biochar'}: {formatNumber(inputs.plantCapacity * inputs.biocharYield / 100)} kg/h
                  </span>
                  <span className="text-sm font-semibold text-green-400">
                    {((inputs.plantCapacity * (inputs.biocharYield / 100) * inputs.biocharHeatingValue) / (1000 * 3.6)).toFixed(2)} MW
                  </span>
                  <span className="text-xs text-green-300/70">
                    {formatNumber(((inputs.plantCapacity * (inputs.biocharYield / 100) * inputs.biocharHeatingValue) / (1000 * 3.6)) * inputs.operatingHours)} MWh/{language === 'de' ? 'a' : 'yr'}
                  </span>
                </div>
                <div className="col-start-4 flex flex-col items-center py-1">
                  <div className="w-6 h-8 bg-red-400"></div>
                  <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[14px] border-l-transparent border-r-transparent border-t-red-400"></div>
                  <span className="text-sm font-bold text-red-300 mt-0.5">
                    {language === 'de' ? 'Pyrolysegas' : 'Pyrolysis Gas'}: {formatNumber(inputs.plantCapacity * (1 - inputs.biocharYield / 100))} kg/h
                  </span>
                  <span className="text-sm font-semibold text-red-400">
                    {((inputs.plantCapacity * inputs.fuelHeatValue / 1000) - (inputs.plantCapacity * (inputs.biocharYield / 100) * inputs.biocharHeatingValue / (1000 * 3.6))).toFixed(2)} MW
                  </span>
                  <span className="text-xs text-red-300/70">
                    {formatNumber(((inputs.plantCapacity * inputs.fuelHeatValue / 1000) - (inputs.plantCapacity * (inputs.biocharYield / 100) * inputs.biocharHeatingValue / (1000 * 3.6))) * inputs.operatingHours)} MWh/{language === 'de' ? 'a' : 'yr'}
                  </span>
                </div>
                {/* Autothermie arrow – only shown here when oil condensation is NOT active */}
                {!products.bioOil && (
                <div className="col-start-6 flex flex-col items-center py-1">
                  <span className="text-xs text-yellow-500 mb-0.5">{language === 'de' ? 'zur Pyrolyse ↑' : 'to Pyrolysis ↑'}</span>
                  <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-b-[14px] border-l-transparent border-r-transparent border-b-yellow-500"></div>
                  <div className="w-6 h-8 bg-yellow-500"></div>
                  <span className="text-sm font-bold text-yellow-400 mt-0.5 text-center leading-tight">
                    {language === 'de' ? 'Prozessenergie' : 'Process Energy'}
                  </span>
                  <span className="text-sm font-bold text-yellow-400 text-center leading-tight">
                    {language === 'de' ? 'Autothermie' : 'Autothermal'}
                  </span>
                  <span className="text-sm font-semibold text-yellow-300">
                    {(pyrolysisGasEnergyMW * (inputs.autothermalShare / 100)).toFixed(2)} MW
                  </span>
                  <span className="text-xs text-yellow-300/70">
                    {formatNumber((pyrolysisGasEnergyMW * (inputs.autothermalShare / 100)) * inputs.operatingHours)} MWh/{language === 'de' ? 'a' : 'yr'}
                  </span>
                </div>
                )}
              </div>

              {/* Side-by-side: BIOCHAR box (left) | GAS PATH (right) */}
              <div className="w-full grid grid-cols-2 gap-4 overflow-visible">

                {/* ── LEFT: BIOCHAR BOX ── */}
                <div className="bg-gradient-to-br from-green-900/40 to-gray-800 p-4 rounded-lg border border-green-500/40 space-y-3">
                  <h3 className="text-lg font-bold text-green-400 flex items-center gap-2">
                    <Leaf className="w-5 h-5" /> {language === 'de' ? 'Biokohle' : 'Biochar'}
                  </h3>
                  {/* Biochar Heating Value */}
                  <div>
                    <label htmlFor="biochar-heating-value" className="block text-sm font-medium text-green-300 mb-1">
                      {t.biocharHeatingValue}: <span className="font-bold text-white">{inputs.biocharHeatingValue} MJ/kg</span>
                    </label>
                    <input id="biochar-heating-value" name="biocharHeatingValue" type="range" min="0" max="35" step="1" value={inputs.biocharHeatingValue} onChange={(e) => handleInputChange('biocharHeatingValue', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                  </div>
                  {/* Biochar Bulk Density */}
                  <div>
                    <label htmlFor="biochar-bulk-density" className="block text-sm font-medium text-green-300 mb-1">
                      {t.biocharBulkDensity}: <span className="font-bold text-white">{inputs.biocharBulkDensity} kg/m³</span>
                    </label>
                    <input id="biochar-bulk-density" name="biocharBulkDensity" type="range" min="0" max="700" step="10" value={inputs.biocharBulkDensity} onChange={(e) => handleInputChange('biocharBulkDensity', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                  </div>
                  {/* Biochar Price */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="biochar-price" className="block text-sm font-medium text-green-300 mb-1">
                        {t.biocharPrice}: <span className="font-bold text-white">{inputs.biocharPrice} €/t</span>
                      </label>
                      <button onClick={() => toggleInfo('biocharPrice')} className="text-green-400 hover:text-green-300 ml-1">
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                    <input id="biochar-price" name="biocharPrice" type="range" min="0" max="1000" step="10" value={inputs.biocharPrice} onChange={(e) => handleInputChange('biocharPrice', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                    {expandedInfo['biocharPrice'] && (
                      <p className="mt-1 text-xs text-gray-400 bg-green-900/20 p-2 rounded">{t.biocharPriceInfo}</p>
                    )}
                  </div>
                  {/* LCA Factor */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="lca-factor" className="block text-sm font-medium text-green-300 mb-1">
                        {t.lcaFactor}: <span className="font-bold text-white">{inputs.lcaFactor.toFixed(1)}</span>
                      </label>
                      <button onClick={() => toggleInfo('lcaFactor')} className="text-green-400 hover:text-green-300 ml-1">
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                    <input id="lca-factor" name="lcaFactor" type="range" min="0" max="3.6" step="0.1" value={inputs.lcaFactor} onChange={(e) => handleInputChange('lcaFactor', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                    {expandedInfo['lcaFactor'] && (
                      <div className="mt-1 text-xs text-gray-400 bg-green-900/20 p-2 rounded space-y-1">
                        {language === 'de' ? (
                          <>
                            <p><span className="font-semibold text-green-300">Definition:</span> Tatsächliche CO₂-Senkenleistung unter Berücksichtigung aller Prozessemissionen.</p>
                            <p className="mt-1"><span className="font-semibold text-green-300">Formel:</span></p>
                            <p className="font-mono text-green-200 bg-gray-900/50 px-2 py-1 rounded text-[11px]">LCA Factor = C_biochar + C_avoided_decomposition + E_coproducts − E_process</p>
                            <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-400">
                              <li><span className="text-green-300">C_biochar</span> – Dauerhaft im Biochar gebundener Kohlenstoff (Hauptsenke)</li>
                              <li><span className="text-green-300">C_avoided_decomposition</span> – Vermiedene Emissionen durch Verhinderung der natürlichen Zersetzung der Biomasse</li>
                              <li><span className="text-green-300">E_coproducts</span> – Gutschriften durch Koppelprodukte (Wärme, Strom, Öl), die fossile Energie ersetzen</li>
                              <li><span className="text-green-300">E_process</span> – Prozessemissionen (Transport, Vorbehandlung, Eigenverbrauch, Methan-Schlupf)</li>
                            </ul>
                            <p><span className="font-semibold text-green-300">Typische Werte:</span> Optimiert: 2,5–3,0 · Durchschnitt: 2,0–2,5 · Konservativ: 2,4 tCO₂/t</p>
                          </>
                        ) : (
                          <>
                            <p><span className="font-semibold text-green-300">Definition:</span> Actual CO₂ removal performance considering all process emissions.</p>
                            <p className="mt-1"><span className="font-semibold text-green-300">Formula:</span></p>
                            <p className="font-mono text-green-200 bg-gray-900/50 px-2 py-1 rounded text-[11px]">LCA Factor = C_biochar + C_avoided_decomposition + E_coproducts − E_process</p>
                            <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-400">
                              <li><span className="text-green-300">C_biochar</span> – Carbon permanently stored in biochar (main sink)</li>
                              <li><span className="text-green-300">C_avoided_decomposition</span> – Avoided emissions by preventing natural biomass decomposition</li>
                              <li><span className="text-green-300">E_coproducts</span> – Credits from co-products (heat, electricity, oil) replacing fossil energy</li>
                              <li><span className="text-green-300">E_process</span> – Process emissions (transport, pre-treatment, self-consumption, methane slip)</li>
                            </ul>
                            <p><span className="font-semibold text-green-300">Typical Values:</span> Optimized: 2.5–3.0 · Average: 2.0–2.5 · Conservative: 2.4 tCO₂/t</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {/* CO2 Removal Price */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-green-300 mb-1">
                        {t.co2RemovalPrice}: <span className="font-bold text-white">{inputs.co2RemovalPrice} €/t</span>
                      </label>
                      <button onClick={() => toggleInfo('co2RemovalPrice')} className="text-green-400 hover:text-green-300 ml-1">
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                    <input id="co2-removal-price" name="co2RemovalPrice" type="range" min="10" max="500" step="10" value={inputs.co2RemovalPrice} onChange={(e) => handleInputChange('co2RemovalPrice', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                    {expandedInfo['co2RemovalPrice'] && (
                      <div className="mt-1 text-xs text-gray-400 bg-green-900/20 p-2 rounded space-y-1">
                        {language === 'de' ? (
                          <p>Marktdurchschnitt auf <a href="https://www.cdr.fyi" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">www.cdr.fyi</a>. Höhere Preise durch professionelle Vermarktung möglich.</p>
                        ) : (
                          <p>Market average on <a href="https://www.cdr.fyi" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">www.cdr.fyi</a>. Higher prices achievable through professional marketing.</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-green-300 mb-1">
                        {t.certificateFeeRate}:{" "}
                        <span className="font-bold text-white">{inputs.certificateFeeRate}%</span>
                      </label>
                      <button
                        onClick={() => toggleInfo('certificateFeeRate')}
                        className="text-green-400 hover:text-green-300 ml-1"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                    <input
                      id="certificate-fee-rate"
                      name="certificateFeeRate"
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={inputs.certificateFeeRate}
                      onChange={(e) => handleInputChange('certificateFeeRate', e.target.value)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                    {expandedInfo['certificateFeeRate'] && (
                      <p className="mt-1 text-xs text-gray-400 bg-green-900/20 p-2 rounded">
                        {t.certificateFeeRateInfo}
                      </p>
                    )}
                  </div>
                  {/* KPI Summary */}
                  <div className="space-y-2 pt-1">
                    <div className="p-2 bg-green-900/20 rounded border border-green-500/30 text-sm">
                      <span className="text-gray-400">{t.biocharProduction}: </span>
                      <span className="font-bold text-white">{formatNumber((inputs.plantCapacity * inputs.operatingHours * inputs.biocharYield) / 100000, 1)} t/{language === 'de' ? 'a' : 'yr'}</span>
                    </div>
                    <div className="p-2 bg-green-900/20 rounded border border-green-500/30 text-sm">
                      <span className="text-gray-400">{language === 'de' ? 'Jahresvolumen' : 'Annual Volume'}: </span>
                      <span className="font-bold text-white">{inputs.biocharBulkDensity > 0 ? formatNumber(((inputs.plantCapacity * inputs.operatingHours * inputs.biocharYield) / 100000) / (inputs.biocharBulkDensity / 1000), 0) : '–'} m³/{language === 'de' ? 'a' : 'yr'}</span>
                    </div>
                    <div className="p-2 bg-green-900/20 rounded border border-green-500/30 text-sm">
                      <span className="text-gray-400">{language === 'de' ? 'Umsatz Biochar' : 'Biochar Sales'}: </span>
                      <span className="font-bold text-white">{formatNumber(((inputs.plantCapacity * inputs.operatingHours * inputs.biocharYield) / 100000) * inputs.biocharPrice)} €/{language === 'de' ? 'a' : 'yr'}</span>
                    </div>
                    <div className="p-2 bg-green-900/20 rounded border border-green-500/30 text-sm">
                      <span className="text-gray-400">CO₂: </span>
                      <span className="font-bold text-white">{formatNumber(((inputs.plantCapacity * inputs.operatingHours * inputs.biocharYield) / 100000) * inputs.lcaFactor, 1)} t/{language === 'de' ? 'a' : 'yr'}</span>
                    </div>
                    <div className="p-2 bg-green-900/20 rounded border border-green-500/30 text-sm">
                      <span className="text-gray-400">{t.certificateRevenue}: </span>
                      <span className="font-bold text-white">{formatNumber(((inputs.plantCapacity * inputs.operatingHours * inputs.biocharYield) / 100000) * (inputs.biocharCarbonContent / 100) * inputs.co2RemovalPrice * (1 - inputs.certificateFeeRate / 100))} €/{language === 'de' ? 'a' : 'yr'}</span>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT: GAS PATH (Oil → Combustion → Heat Exchanger → Electricity) ── */}
                <div className="flex flex-col items-center space-y-0 overflow-visible">

                  {/* Optional: Oil Condensation Box */}
                  {products.bioOil && (
                    <>
                      <div className="w-full flex gap-2 overflow-visible">
                        {/* Oil Condensation – 75% width */}
                        <div className="w-3/4 flex flex-col">
                          <div className="w-full bg-gradient-to-br from-purple-900/40 to-gray-800 p-4 rounded-lg border border-purple-500/40 space-y-3">
                            <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2">
                              <Droplets className="w-5 h-5" /> {language === 'de' ? 'Öl-Kondensation' : 'Oil Condensation'}
                            </h3>
                            <div>
                              <label htmlFor="bio-oil-yield" className="block text-sm font-medium text-purple-300 mb-1">
                                {t.bioOilYield}: <span className="font-bold text-white">{inputs.bioOilYield}%</span>
                              </label>
                              <input id="bio-oil-yield" name="bioOilYield" type="range" min="10" max="50" step="1" value={inputs.bioOilYield} onChange={(e) => handleInputChange('bioOilYield', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                            </div>
                            <div>
                              <label htmlFor="bio-oil-price" className="block text-sm font-medium text-purple-300 mb-1">
                                {t.bioOilPrice}: <span className="font-bold text-white">{inputs.bioOilPrice} €/t</span>
                              </label>
                              <input id="bio-oil-price" name="bioOilPrice" type="range" min="100" max="1000" step="10" value={inputs.bioOilPrice} onChange={(e) => handleInputChange('bioOilPrice', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                            </div>
                            <div>
                              <label htmlFor="bio-oil-heating-value" className="block text-sm font-medium text-purple-300 mb-1">
                                {t.bioOilHeatingValue}: <span className="font-bold text-white">{inputs.bioOilHeatingValue} MJ/kg</span>
                              </label>
                              <input id="bio-oil-heating-value" name="bioOilHeatingValue" type="range" min="5" max="40" step="1" value={inputs.bioOilHeatingValue} onChange={(e) => handleInputChange('bioOilHeatingValue', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                            </div>
                            <div className="p-2 bg-purple-900/20 rounded border border-purple-500/30 text-sm">
                              <span className="text-gray-400">{language === 'de' ? 'Produktion' : 'Production'}: </span>
                              <span className="font-bold text-white">{formatNumber((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.bioOilYield / 100), 1)} t/{language === 'de' ? 'a' : 'yr'}</span>
                              <span className="text-gray-400 ml-3">{language === 'de' ? 'Umsatz' : 'Sales'}: </span>
                              <span className="font-bold text-white">{formatNumber(((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.bioOilYield / 100)) * inputs.bioOilPrice)} €/{language === 'de' ? 'a' : 'yr'}</span>
                            </div>
                            <div className="p-2 bg-purple-900/20 rounded border border-purple-500/30 text-sm">
                              <span className="text-gray-400">{language === 'de' ? 'Feuerungsleistung Öl' : 'Oil Combustion Power'}: </span>
                              <span className="font-bold text-white">{oilEnergyMW.toFixed(2)} MW</span>
                            </div>
                          </div>
                          {/* Arrow: Oil → Combustion */}
                          <div className="flex flex-col items-center py-1">
                            <div className="flex flex-col items-center">
                              <div className="w-5 h-6 bg-red-400"></div>
                              <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[10px] border-l-transparent border-r-transparent border-t-red-400"></div>
                              <span className="text-xs text-gray-500">{language === 'de' ? 'Restgas' : 'Remaining Gas'}</span>
                              <span className="text-xs font-semibold text-red-300">
                                {residualGasEnergyMW.toFixed(2)} MW
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Autothermie arrow – passes right of Oil Condensation from Combustion → Pyrolysis */}
                        <div className="w-1/4 flex flex-col items-center py-1 -mt-[75px] z-10">
                          <div className="flex flex-col items-center flex-1">
                            <span className="text-xs text-yellow-500 mb-0.5">{language === 'de' ? 'zur Pyrolyse ↑' : 'to Pyrolysis ↑'}</span>
                            <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-b-[12px] border-l-transparent border-r-transparent border-b-yellow-500"></div>
                            <div className="w-5 flex-1 bg-yellow-500/80 rounded-sm min-h-[40px]"></div>
                          </div>
                          <span className="text-xs font-bold text-yellow-400 text-center leading-tight">
                            {language === 'de' ? 'Autothermie' : 'Autothermal'}
                          </span>
                          <span className="text-xs font-semibold text-yellow-300 text-center">
                            {(residualGasEnergyMW * (inputs.autothermalShare / 100)).toFixed(2)} MW
                          </span>
                          <span className="text-[10px] text-yellow-300/70 text-center">
                            {formatNumber((residualGasEnergyMW * (inputs.autothermalShare / 100)) * inputs.operatingHours)} MWh/{language === 'de' ? 'a' : 'yr'}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── COMBUSTION BOX ── */}
                  <div className="w-full bg-gradient-to-br from-red-900/40 to-gray-800 p-4 rounded-lg border-2 border-red-500/50 space-y-3">
                    <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                      <Flame className="w-5 h-5" /> {language === 'de' ? 'Verbrennung' : 'Combustion'}
                    </h3>
                    <div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="autothermal-share" className="block text-sm font-medium text-red-300 mb-1">
                          {t.autothermalShare}: <span className="font-bold text-white">{inputs.autothermalShare}%</span>
                        </label>
                        <button onClick={() => toggleInfo('autothermalShare')} className="text-red-400 hover:text-red-300 ml-2">
                          <Info className="w-5 h-5" />
                        </button>
                      </div>
                      <input id="autothermal-share" name="autothermalShare" type="range" min="0" max="20" step="1" value={inputs.autothermalShare} onChange={(e) => handleInputChange('autothermalShare', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                      {expandedInfo['autothermalShare'] && (
                        <p className="mt-1 text-xs text-gray-400 bg-red-900/20 p-2 rounded">
                          {language === 'de'
                            ? 'Pyrolyse ist ein endothermer Prozess – die thermochemische Zersetzung der Biomasse erfordert kontinuierliche Wärmezufuhr, um die Bindungsenergien der organischen Moleküle zu überwinden. Bei autothermen Anlagen wird ein Teil der im Pyrolysegas enthaltenen Energie durch Verbrennung rückgeführt, um den Reaktor auf Betriebstemperatur (600–700 °C) zu halten. Der Prozesswärmeanteil liegt typischerweise bei 5–15 % der Pyrolysegas-Energie und hängt von Faktoren wie Biomassefeuchte, Reaktorbauart und Isolierung ab.'
                            : 'Pyrolysis is an endothermic process – the thermochemical decomposition of biomass requires continuous heat input to overcome the bond energies of organic molecules. In autothermal systems, a portion of the energy contained in the pyrolysis gas is recirculated via combustion to maintain the reactor at operating temperature (600–700 °C). The process heat share is typically 5–15 % of pyrolysis gas energy and depends on factors such as biomass moisture content, reactor design, and insulation.'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Arrow: Combustion → Heat Exchanger */}
                  <div className="flex flex-col items-center py-1">
                    <div className="w-5 h-6 bg-orange-400"></div>
                    <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[10px] border-l-transparent border-r-transparent border-t-orange-400"></div>
                    <span className="text-sm font-bold text-orange-300">{language === 'de' ? 'Wärmestrom' : 'Heat Flow'}</span>
                    <span className="text-base font-bold text-orange-400">
                      {waermestromMW.toFixed(2)} MW
                    </span>
                    <span className="text-xs text-orange-300/70">
                      {formatNumber(waermestromMW * inputs.operatingHours)} MWh/{language === 'de' ? 'a' : 'yr'}
                    </span>
                  </div>

                  {/* ── ELECTRICITY GENERATION BOX (if active) ── */}
                  {products.electricity && (
                    <>
                      <div className="w-full bg-gradient-to-br from-yellow-900/40 to-gray-800 p-4 rounded-lg border border-yellow-500/40 space-y-3">
                        <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                          <Zap className="w-5 h-5" /> {language === 'de' ? 'Stromgenerierung' : 'Power Generation'}
                        </h3>
                        <div>
                          <label htmlFor="electricity-yield" className="block text-sm font-medium text-yellow-300 mb-1">
                            {t.electricityYield}: <span className="font-bold text-white">{inputs.electricityYield}%</span>
                          </label>
                          <input id="electricity-yield" name="electricityYield" type="range" min="5" max="50" step="1" value={inputs.electricityYield} onChange={(e) => handleInputChange('electricityYield', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                        </div>
                        <div>
                          <label htmlFor="electricity-price" className="block text-sm font-medium text-yellow-300 mb-1">
                            {t.electricityPrice}: <span className="font-bold text-white">{inputs.electricityPrice.toFixed(2)} €/kWh</span>
                          </label>
                          <input id="electricity-price" name="electricityPrice" type="range" min="0.05" max="0.5" step="0.01" value={inputs.electricityPrice} onChange={(e) => handleInputChange('electricityPrice', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                        </div>
                        <div className="p-2 bg-yellow-900/20 rounded border border-yellow-500/30 text-sm space-y-1">
                          <div>
                            <span className="text-gray-400">{language === 'de' ? 'Elektrische Leistung' : 'Electrical Power'}: </span>
                            <span className="font-bold text-white">
                              {formatNumber(elecPowerKW)} kW
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">{t.electricityProduction}: </span>
                            <span className="font-bold text-white">
                              {formatNumber(elecProductionKWh)} kWh/{language === 'de' ? 'a' : 'yr'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">{language === 'de' ? 'Eigenverbrauch' : 'Self-consumption'}: </span>
                            <span className="font-bold text-white">{formatNumber(inputs.electricalPower * inputs.operatingHours)} kWh/{language === 'de' ? 'a' : 'yr'}</span>
                          </div>
                          {elecProductionKWh > (inputs.electricalPower * inputs.operatingHours) && (
                            <div>
                              <span className="text-gray-400">{language === 'de' ? 'Überschuss' : 'Surplus'}: </span>
                              <span className="font-bold text-green-400">
                                {formatNumber(elecProductionKWh - inputs.electricalPower * inputs.operatingHours)} kWh/{language === 'de' ? 'a' : 'yr'}
                              </span>
                            </div>
                          )}
                        </div>
                        {elecProductionKWh >= (inputs.electricalPower * inputs.operatingHours) ? (
                          <div className="p-2 bg-green-900/30 border border-green-500/30 rounded text-sm text-green-300 font-semibold">
                            ✓ {language === 'de' ? 'Strombedarf vollständig gedeckt' : 'Power demand fully covered'}
                          </div>
                        ) : (
                          <div className="p-2 bg-orange-900/30 border border-orange-500/30 rounded text-sm text-orange-300 font-semibold">
                            ⚠️ {language === 'de' ? 'Strombedarf nur teilweise gedeckt' : 'Power demand only partially covered'}
                          </div>
                        )}
                        {/* Nutzbare Restwärme Slider */}
                        <div>
                          <div className="flex items-center justify-between">
                            <label htmlFor="usable-residual-heat" className="block text-sm font-medium text-yellow-300 mb-1">
                              {language === 'de' ? 'Nutzbare Restwärme' : 'Usable Residual Heat'}: <span className="font-bold text-white">{inputs.usableResidualHeat}%</span>
                            </label>
                            <button onClick={() => toggleInfo('usableResidualHeat')} className="text-yellow-400 hover:text-yellow-300 ml-2">
                              <Info className="w-5 h-5" />
                            </button>
                          </div>
                          <input id="usable-residual-heat" name="usableResidualHeat" type="range" min="0" max="100" step="1" value={inputs.usableResidualHeat} onChange={(e) => handleInputChange('usableResidualHeat', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                          {expandedInfo['usableResidualHeat'] && (
                            <div className="mt-2 text-xs text-gray-300 bg-yellow-900/30 p-3 rounded border border-yellow-500/20 space-y-2">
                              <p className="font-bold text-yellow-300">{language === 'de' ? 'Wärmenutzung bei verschiedenen KWK-Technologien' : 'Heat utilization for different CHP technologies'}</p>
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-yellow-900/40">
                                      <th className="border border-yellow-700/50 px-2 py-1 text-left">{language === 'de' ? 'Technologie' : 'Technology'}</th>
                                      <th className="border border-yellow-700/50 px-2 py-1">{language === 'de' ? 'Bezugsbasis' : 'Reference'}</th>
                                      <th className="border border-yellow-700/50 px-2 py-1">{language === 'de' ? 'El. Wirkungsgrad' : 'El. Efficiency'}</th>
                                      <th className="border border-yellow-700/50 px-2 py-1">{language === 'de' ? 'Therm. Nutzwärme' : 'Therm. Useful Heat'}</th>
                                      <th className="border border-yellow-700/50 px-2 py-1">{language === 'de' ? 'Abwärme' : 'Waste Heat'}</th>
                                      <th className="border border-yellow-700/50 px-2 py-1">{language === 'de' ? 'Gesamtwirkungsgrad' : 'Total Efficiency'}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[
                                      ['Gasmotor-BHKW (1,6 MW el)', 'Feuerungsleistung (Gas)', '38–42 %', '40–45 %', '13–22 %', '80–87 %'],
                                      ['Zündstrahlmotor-BHKW', 'Feuerungsleistung (Gas)', '35–40 %', '42–48 %', '12–23 %', '80–85 %'],
                                      ['Gasmikroturbine', 'Feuerungsleistung (Gas)', '25–33 %', '45–55 %', '12–30 %', '78–85 %'],
                                      ['ORC – Heißgas (≥300°C), Luftkühlung', 'Therm. Eingangsleistung', '18–24 %', '0–10 %', '66–82 %', '20–32 %'],
                                      ['ORC – Heißgas (≥300°C), Wärmeauskopplung', 'Therm. Eingangsleistung', '15–20 %', '45–60 %', '20–40 %', '65–78 %'],
                                      ['ORC – Warmwasser (95°C), Luftkühlung', 'Therm. Eingangsleistung', '8–12 %', '0–5 %', '83–92 %', '10–15 %'],
                                      ['ORC – Warmwasser (95°C), Wärmeauskopplung', 'Therm. Eingangsleistung', '6–10 %', '65–75 %', '15–28 %', '75–83 %'],
                                      ['Dampfturbine (Sattdampf, <10 bar)', 'Therm. Eingangsleistung (Dampf)', '10–18 %', '65–75 %', '10–20 %', '82–90 %'],
                                      ['Dampfturbine (Heißdampf, 20–50 bar)', 'Therm. Eingangsleistung (Dampf)', '22–32 %', '50–62 %', '10–20 %', '78–88 %'],
                                      ['Dampfturbine (Kondensationsbetrieb)', 'Therm. Eingangsleistung (Dampf)', '28–38 %', '0–15 %', '55–72 %', '30–45 %'],
                                    ].map((row, i) => (
                                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-800/40' : 'bg-gray-800/20'}>
                                        {row.map((cell, j) => (
                                          <td key={j} className="border border-yellow-700/30 px-2 py-1">{cell}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-yellow-900/20 rounded border border-yellow-500/30 text-sm">
                          <span className="text-gray-400">{language === 'de' ? 'Restwärme' : 'Residual Heat'}: </span>
                          <span className="font-bold text-orange-300">{residualHeatMW.toFixed(2)} MW</span>
                          <span className="text-gray-500 mx-2">→</span>
                          <span className="text-gray-400">{language === 'de' ? 'Nutzbar' : 'Usable'}: </span>
                          <span className="font-bold text-orange-300">{usableResidualHeatMW.toFixed(2)} MW</span>
                        </div>
                      </div>
                      {/* Arrow: Stromgenerierung → Wärmetauscher */}
                      <div className="flex flex-col items-center py-1">
                        <div className="flex flex-col items-center">
                          <div className="w-5 h-6 bg-orange-400"></div>
                          <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[10px] border-l-transparent border-r-transparent border-t-orange-400"></div>
                          <span className="text-xs text-orange-300">{language === 'de' ? 'Restwärme' : 'Residual Heat'}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── HEAT EXCHANGER BOX ── */}
                  <div className="w-full bg-gradient-to-br from-orange-800/30 to-red-900/20 p-4 rounded-lg border-2 border-orange-500/40 space-y-3">
                    <h3 className="text-lg font-bold text-orange-300 flex items-center gap-2">
                      🔄 {language === 'de' ? 'Wärmetauscher' : 'Heat Exchanger'}
                    </h3>
                    {/* Heat Exchanger Efficiency Slider */}
                    <div>
                      <label htmlFor="thermal-efficiency" className="block text-sm font-medium text-orange-200 mb-1">
                        {t.thermalEfficiency}: <span className="font-bold text-white">{inputs.thermalEfficiency}%</span>
                      </label>
                      <input id="thermal-efficiency" name="thermalEfficiency" type="range" min="0" max="100" step="1" value={inputs.thermalEfficiency} onChange={(e) => handleInputChange('thermalEfficiency', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-400" />
                    </div>
                    <div className="p-2 bg-orange-900/20 rounded border border-orange-500/30 text-sm">
                      <div>
                        <span className="text-gray-400">{language === 'de' ? 'Thermische Nennleistung' : 'Thermal Rated Power'}: </span>
                        <span className="font-bold text-white">
                          {thermalRatedPowerMW.toFixed(2)} MW
                        </span>
                        {products.electricity && (
                          <span className="text-xs text-gray-500 ml-2">({language === 'de' ? 'bezogen auf Restwärme' : 'based on residual heat'})</span>
                        )}
                      </div>
                    </div>
                    {products.heat ? (
                      <>
                        <div>
                          <label htmlFor="heat-yield" className="block text-sm font-medium text-orange-200 mb-1">
                            {t.heatSoldPercentage}: <span className="font-bold text-white">{inputs.heatYield}%</span>
                          </label>
                          <input id="heat-yield" name="heatYield" type="range" min="0" max="100" step="1" value={inputs.heatYield} onChange={(e) => handleInputChange('heatYield', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-400" />
                        </div>
                        <div>
                          <label htmlFor="heat-price" className="block text-sm font-medium text-orange-200 mb-1">
                            {t.heatSalePrice}: <span className="font-bold text-white">{inputs.heatPrice.toFixed(3)} €/kWh</span>
                          </label>
                          <input id="heat-price" name="heatPrice" type="range" min="0.01" max="0.5" step="0.01" value={inputs.heatPrice} onChange={(e) => handleInputChange('heatPrice', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-400" />
                        </div>
                        <div className="p-2 bg-orange-900/20 rounded border border-orange-500/30 text-sm space-y-1">
                          <div>
                            <span className="text-gray-400">{language === 'de' ? 'Verkaufte Wärme' : 'Heat Sold'}: </span>
                            <span className="font-bold text-white">
                              {formatNumber(Math.round(thermalRatedPowerMW * (inputs.heatYield / 100) * inputs.operatingHours))} MWh/{language === 'de' ? 'a' : 'yr'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">{language === 'de' ? 'Wärmeverkauf' : 'Heat Sales'}: </span>
                            <span className="font-bold text-white">
                              {formatNumber(thermalRatedPowerKW * (inputs.heatYield / 100) * inputs.operatingHours * inputs.heatPrice)} €/{language === 'de' ? 'a' : 'yr'}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        {language === 'de' ? 'Wärmeverkauf nicht aktiviert – Wärme wird nicht genutzt.' : 'Heat sales not activated – heat is not utilized.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── ENERGY BALANCE SUMMARY ── */}
              <div className="w-full mt-4 p-4 bg-gray-800/80 rounded-lg border border-gray-600/40">
                <h4 className="text-lg font-bold text-gray-300 mb-3">
                  {language === 'de' ? '⚡ Energiebilanz (vereinfacht)' : '⚡ Energy Balance (simplified)'}
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-900/20 rounded border border-blue-500/20 text-center">
                    <div className="text-sm text-gray-400">{language === 'de' ? 'Eingang' : 'Input'}</div>
                    <div className="text-lg font-bold text-blue-300">{formatNumber(inputs.plantCapacity)} kg/h</div>
                    <div className="text-xl font-bold text-blue-300">{(inputs.plantCapacity * inputs.fuelHeatValue / 1000).toFixed(2)} MW</div>
                  </div>
                  <div className="p-3 bg-green-900/20 rounded border border-green-500/20 text-center">
                    <div className="text-sm text-gray-400">{language === 'de' ? 'Biokohle' : 'Biochar'}</div>
                    <div className="text-lg font-bold text-green-300">{formatNumber(inputs.plantCapacity * inputs.biocharYield / 100)} kg/h</div>
                    <div className="text-xl font-bold text-green-300">{((inputs.plantCapacity * (inputs.biocharYield / 100) * inputs.biocharHeatingValue) / (1000 * 3.6)).toFixed(2)} MW</div>
                  </div>
                  <div className="p-3 bg-red-900/20 rounded border border-red-500/20 text-center">
                    <div className="text-sm text-gray-400">{language === 'de' ? 'Pyrolysegas' : 'Pyrolysis Gas'}</div>
                    <div className="text-lg font-bold text-red-300">{formatNumber(inputs.plantCapacity * (1 - inputs.biocharYield / 100))} kg/h</div>
                    <div className="text-xl font-bold text-red-300">{((inputs.plantCapacity * inputs.fuelHeatValue / 1000) - (inputs.plantCapacity * (inputs.biocharYield / 100) * inputs.biocharHeatingValue / (1000 * 3.6))).toFixed(2)} MW</div>
                  </div>
                </div>
              </div>

              {/* ── SANKEY DIAGRAM ── */}
              {(() => {
                // All energy values in MW
                const totalInputMW = inputs.plantCapacity * inputs.fuelHeatValue / 1000;
                const biocharMW = (inputs.plantCapacity * (inputs.biocharYield / 100) * inputs.biocharHeatingValue) / (1000 * 3.6);
                const pyGasMW = pyrolysisGasEnergyMW;
                const oilMW = oilEnergyMW;
                const resGasMW = residualGasEnergyMW;
                const autothermMW = resGasMW * (inputs.autothermalShare / 100);
                const combustionOutMW = waermestromMW;
                const elecMW = products.electricity ? combustionOutMW * (inputs.electricityYield / 100) : 0;
                const heatAfterElecMW = products.electricity ? combustionOutMW * (1 - inputs.electricityYield / 100) : combustionOutMW;
                const usableHeatMW = products.heat
                  ? (products.electricity ? heatAfterElecMW * (inputs.usableResidualHeat / 100) : heatAfterElecMW) * (inputs.thermalEfficiency / 100)
                  : 0;
                const lossHeatMW = heatAfterElecMW - usableHeatMW;

                const pct = (v: number) => totalInputMW > 0 ? ((v / totalInputMW) * 100).toFixed(1) : '0.0';
                const fmt = (v: number) => v.toFixed(2);

                // SVG layout constants
                const W = 1000;
                const H = 520;
                const minBand = 3;

                // Horizontal positions for each column (x centers)
                const colX = [60, 250, 440, 630, 820];

                // Scaling: total input height
                const maxBandH = 300;
                const scale = totalInputMW > 0 ? maxBandH / totalInputMW : 0;
                const bh = (mw: number) => Math.max(mw * scale, mw > 0 ? minBand : 0);

                // Column 0: Biomass Input
                const inputH = bh(totalInputMW);
                const inputY = (H - inputH) / 2;

                // Column 1: Biochar + Pyrolysis Gas
                const biocharH = bh(biocharMW);
                const pyGasH = bh(pyGasMW);
                const gap1 = 20;
                const col1TotalH = biocharH + pyGasH + gap1;
                const col1StartY = (H - col1TotalH) / 2;
                const biocharY = col1StartY;
                const pyGasY = biocharY + biocharH + gap1;

                // Column 2: (if oil active) Oil + Residual Gas, else just Gas pass-through
                let oilY = 0, oilH = 0, resGasY = 0, resGasH = 0;
                if (products.bioOil) {
                  oilH = bh(oilMW);
                  resGasH = bh(resGasMW);
                  const gap2 = 16;
                  const col2TotalH = oilH + resGasH + gap2;
                  const col2StartY = pyGasY + pyGasH / 2 - col2TotalH / 2;
                  oilY = col2StartY;
                  resGasY = oilY + oilH + gap2;
                } else {
                  resGasH = pyGasH;
                  resGasY = pyGasY;
                }

                // Column 3: Autothermie + Combustion output (Wärmestrom)
                const autothermH = bh(autothermMW);
                const combOutH = bh(combustionOutMW);
                const gap3 = 16;
                const col3TotalH = autothermH + combOutH + gap3;
                const col3StartY = resGasY + resGasH / 2 - col3TotalH / 2;
                const autothermY = col3StartY;
                const combOutY = autothermY + autothermH + gap3;

                // Column 4: Electricity + Heat (usable + loss)
                let elecY = 0, elecH = 0, usableHeatY2 = 0, usableHeatH = 0, lossHeatY = 0, lossHeatH = 0;
                if (products.electricity) {
                  elecH = bh(elecMW);
                  usableHeatH = bh(usableHeatMW);
                  lossHeatH = bh(lossHeatMW);
                  const gap4 = 12;
                  const col4TotalH = elecH + usableHeatH + lossHeatH + gap4 * 2;
                  const col4StartY = combOutY + combOutH / 2 - col4TotalH / 2;
                  elecY = col4StartY;
                  usableHeatY2 = elecY + elecH + gap4;
                  lossHeatY = usableHeatY2 + usableHeatH + gap4;
                } else {
                  usableHeatH = bh(usableHeatMW);
                  lossHeatH = bh(lossHeatMW);
                  const gap4 = 12;
                  const col4TotalH = usableHeatH + lossHeatH + gap4;
                  const col4StartY = combOutY + combOutH / 2 - col4TotalH / 2;
                  usableHeatY2 = col4StartY;
                  lossHeatY = usableHeatY2 + usableHeatH + gap4;
                }

                // Helper: curved band path between two vertical bars
                const bandPath = (x1: number, y1: number, h1: number, x2: number, y2: number, h2: number) => {
                  const cx = (x1 + x2) / 2;
                  return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2} L${x2},${y2 + h2} C${cx},${y2 + h2} ${cx},${y1 + h1} ${x1},${y1 + h1} Z`;
                };

                // Node rect helper
                const nodeW = 18;

                return (
                  <div id="sankey-chart" className="w-full mt-4 p-4 bg-gray-800/80 rounded-lg border border-gray-600/40">
                    <h4 className="text-lg font-bold text-gray-300 mb-3">
                      {language === 'de' ? '🔀 Sankey-Diagramm – Energiefluss' : '🔀 Sankey Diagram – Energy Flow'}
                    </h4>
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 480 }}>
                      <defs>
                        <linearGradient id="sg-input-biochar" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0.6"/></linearGradient>
                        <linearGradient id="sg-input-gas" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/><stop offset="100%" stopColor="#ef4444" stopOpacity="0.6"/></linearGradient>
                        <linearGradient id="sg-gas-oil" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#ef4444" stopOpacity="0.5"/><stop offset="100%" stopColor="#a855f7" stopOpacity="0.6"/></linearGradient>
                        <linearGradient id="sg-gas-resgas" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#ef4444" stopOpacity="0.5"/><stop offset="100%" stopColor="#f87171" stopOpacity="0.5"/></linearGradient>
                        <linearGradient id="sg-resgas-autotherm" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f87171" stopOpacity="0.5"/><stop offset="100%" stopColor="#eab308" stopOpacity="0.6"/></linearGradient>
                        <linearGradient id="sg-resgas-combout" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f87171" stopOpacity="0.5"/><stop offset="100%" stopColor="#f97316" stopOpacity="0.6"/></linearGradient>
                        <linearGradient id="sg-comb-elec" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f97316" stopOpacity="0.5"/><stop offset="100%" stopColor="#facc15" stopOpacity="0.6"/></linearGradient>
                        <linearGradient id="sg-comb-heat" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f97316" stopOpacity="0.5"/><stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6"/></linearGradient>
                        <linearGradient id="sg-comb-loss" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f97316" stopOpacity="0.4"/><stop offset="100%" stopColor="#6b7280" stopOpacity="0.4"/></linearGradient>
                        <linearGradient id="sg-oil-out" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#a855f7" stopOpacity="0.55"/><stop offset="100%" stopColor="#a855f7" stopOpacity="0.35"/></linearGradient>
                      </defs>

                      {/* ── BANDS ── */}
                      {/* Input → Biochar */}
                      <path d={bandPath(colX[0] + nodeW, inputY, bh(biocharMW), colX[1], biocharY, biocharH)} fill="url(#sg-input-biochar)" />
                      {/* Input → Pyrolysis Gas */}
                      <path d={bandPath(colX[0] + nodeW, inputY + bh(biocharMW), bh(pyGasMW), colX[1], pyGasY, pyGasH)} fill="url(#sg-input-gas)" />

                      {/* Pyrolysis Gas → Oil (if active) */}
                      {products.bioOil && oilMW > 0 && (
                        <path d={bandPath(colX[1] + nodeW, pyGasY, bh(oilMW), colX[2], oilY, oilH)} fill="url(#sg-gas-oil)" />
                      )}
                      {/* Pyrolysis Gas → Residual Gas / pass-through */}
                      <path d={bandPath(colX[1] + nodeW, pyGasY + (products.bioOil ? bh(oilMW) : 0), products.bioOil ? bh(resGasMW) : pyGasH, products.bioOil ? colX[2] : colX[2], resGasY, resGasH)} fill="url(#sg-gas-resgas)" />

                      {/* Residual Gas → Autothermie */}
                      {autothermMW > 0 && (
                        <path d={bandPath(colX[2] + nodeW, resGasY, autothermH, colX[3], autothermY, autothermH)} fill="url(#sg-resgas-autotherm)" />
                      )}
                      {/* Residual Gas → Combustion output */}
                      <path d={bandPath(colX[2] + nodeW, resGasY + autothermH, bh(combustionOutMW), colX[3], combOutY, combOutH)} fill="url(#sg-resgas-combout)" />

                      {/* Combustion output → Electricity */}
                      {products.electricity && elecMW > 0 && (
                        <path d={bandPath(colX[3] + nodeW, combOutY, elecH, colX[4], elecY, elecH)} fill="url(#sg-comb-elec)" />
                      )}
                      {/* Combustion output → Usable Heat */}
                      {usableHeatMW > 0 && (
                        <path d={bandPath(colX[3] + nodeW, combOutY + (products.electricity ? elecH : 0), usableHeatH, colX[4], usableHeatY2, usableHeatH)} fill="url(#sg-comb-heat)" />
                      )}
                      {/* Combustion output → Loss Heat */}
                      {lossHeatMW > 0 && (
                        <path d={bandPath(colX[3] + nodeW, combOutY + (products.electricity ? elecH : 0) + usableHeatH, lossHeatH, colX[4], lossHeatY, lossHeatH)} fill="url(#sg-comb-loss)" />
                      )}

                      {/* Oil → Nutzung (if oil active, band from condensation to utilization column) */}
                      {products.bioOil && oilMW > 0 && (
                        <path d={bandPath(colX[2] + nodeW, oilY, oilH, colX[4], oilY, oilH)} fill="url(#sg-oil-out)" />
                      )}

                      {/* ── NODE BARS ── */}
                      {/* Input */}
                      <rect x={colX[0]} y={inputY} width={nodeW} height={inputH} rx={4} fill="#3b82f6" />
                      {/* Biochar */}
                      <rect x={colX[1]} y={biocharY} width={nodeW} height={biocharH} rx={4} fill="#22c55e" />
                      {/* Pyrolysis Gas */}
                      <rect x={colX[1]} y={pyGasY} width={nodeW} height={pyGasH} rx={4} fill="#ef4444" />
                      {/* Oil Condensation (if active) */}
                      {products.bioOil && oilMW > 0 && (
                        <rect x={colX[2]} y={oilY} width={nodeW} height={oilH} rx={4} fill="#a855f7" />
                      )}
                      {/* Residual Gas / Pass-through bar at column 2 (always visible) */}
                      <rect x={colX[2]} y={resGasY} width={nodeW} height={resGasH} rx={4} fill="#f87171" />
                      {/* Autothermie */}
                      {autothermMW > 0 && (
                        <rect x={colX[3]} y={autothermY} width={nodeW} height={autothermH} rx={4} fill="#eab308" />
                      )}
                      {/* Combustion output (Wärmestrom) */}
                      <rect x={colX[3]} y={combOutY} width={nodeW} height={combOutH} rx={4} fill="#f97316" />
                      {/* Electricity */}
                      {products.electricity && elecMW > 0 && (
                        <rect x={colX[4]} y={elecY} width={nodeW} height={elecH} rx={4} fill="#facc15" />
                      )}
                      {/* Usable Heat */}
                      {usableHeatMW > 0 && (
                        <rect x={colX[4]} y={usableHeatY2} width={nodeW} height={usableHeatH} rx={4} fill="#06b6d4" />
                      )}
                      {/* Loss Heat */}
                      {lossHeatMW > 0 && (
                        <rect x={colX[4]} y={lossHeatY} width={nodeW} height={lossHeatH} rx={4} fill="#6b7280" />
                      )}
                      {/* Oil output at Nutzung column (if oil active) */}
                      {products.bioOil && oilMW > 0 && (
                        <rect x={colX[4]} y={oilY} width={nodeW} height={oilH} rx={4} fill="#a855f7" />
                      )}

                      {/* ── LABELS ── */}
                      <style>{`text.sk{font-family:system-ui,sans-serif;} text.sk-title{font-size:12px;font-weight:700;fill:#e5e7eb;} text.sk-val{font-size:11px;font-weight:600;} text.sk-pct{font-size:10px;fill:#9ca3af;}`}</style>

                      {/* Input label */}
                      <text x={colX[0] + nodeW / 2} y={inputY - 18} textAnchor="middle" className="sk sk-title">{language === 'de' ? 'Biomasse' : 'Biomass'}</text>
                      <text x={colX[0] + nodeW / 2} y={inputY - 5} textAnchor="middle" className="sk sk-val" fill="#93c5fd">{fmt(totalInputMW)} MW</text>
                      <text x={colX[0] + nodeW / 2} y={inputY + inputH + 14} textAnchor="middle" className="sk sk-pct">100%</text>

                      {/* Biochar label */}
                      <text x={colX[1] + nodeW / 2} y={biocharY - 18} textAnchor="middle" className="sk sk-title">{language === 'de' ? 'Biokohle' : 'Biochar'}</text>
                      <text x={colX[1] + nodeW / 2} y={biocharY - 5} textAnchor="middle" className="sk sk-val" fill="#86efac">{fmt(biocharMW)} MW</text>
                      <text x={colX[1] + nodeW / 2} y={biocharY + biocharH + 14} textAnchor="middle" className="sk sk-pct">{pct(biocharMW)}%</text>

                      {/* Pyrolysis Gas label */}
                      <text x={colX[1] + nodeW / 2} y={pyGasY + pyGasH + 14} textAnchor="middle" className="sk sk-title">{language === 'de' ? 'Pyrolysegas' : 'Pyr. Gas'}</text>
                      <text x={colX[1] + nodeW / 2} y={pyGasY + pyGasH + 28} textAnchor="middle" className="sk sk-val" fill="#fca5a5">{fmt(pyGasMW)} MW</text>
                      <text x={colX[1] + nodeW / 2} y={pyGasY + pyGasH + 42} textAnchor="middle" className="sk sk-pct">{pct(pyGasMW)}%</text>

                      {/* Oil label (if active) */}
                      {products.bioOil && oilMW > 0 && (
                        <>
                          <text x={colX[2] + nodeW / 2} y={oilY - 18} textAnchor="middle" className="sk sk-title">{language === 'de' ? 'Bio-Öl' : 'Bio-Oil'}</text>
                          <text x={colX[2] + nodeW / 2} y={oilY - 5} textAnchor="middle" className="sk sk-val" fill="#c084fc">{fmt(oilMW)} MW</text>
                          <text x={colX[2] + nodeW / 2} y={oilY + oilH + 14} textAnchor="middle" className="sk sk-pct">{pct(oilMW)}%</text>
                        </>
                      )}

                      {/* Residual Gas / Pass-through label at column 2 */}
                      {products.bioOil ? (
                        <>
                          <text x={colX[2] + nodeW / 2} y={resGasY + resGasH + 14} textAnchor="middle" className="sk sk-title">{language === 'de' ? 'Restgas' : 'Res. Gas'}</text>
                          <text x={colX[2] + nodeW / 2} y={resGasY + resGasH + 28} textAnchor="middle" className="sk sk-val" fill="#fca5a5">{fmt(resGasMW)} MW</text>
                          <text x={colX[2] + nodeW / 2} y={resGasY + resGasH + 42} textAnchor="middle" className="sk sk-pct">{pct(resGasMW)}%</text>
                        </>
                      ) : (
                        <>
                          <text x={colX[2] + nodeW / 2} y={resGasY - 5} textAnchor="middle" className="sk sk-val" fill="#fca5a5">{fmt(pyGasMW)} MW</text>
                        </>
                      )}

                      {/* Autothermie label */}
                      {autothermMW > 0 && (
                        <>
                          <text x={colX[3] + nodeW / 2} y={autothermY - 18} textAnchor="middle" className="sk sk-title" fill="#facc15">{language === 'de' ? 'Autothermie' : 'Autothermal'}</text>
                          <text x={colX[3] + nodeW / 2} y={autothermY - 5} textAnchor="middle" className="sk sk-val" fill="#fde047">{fmt(autothermMW)} MW</text>
                          <text x={colX[3] + nodeW / 2} y={autothermY + autothermH + 14} textAnchor="middle" className="sk sk-pct">{pct(autothermMW)}%</text>
                        </>
                      )}

                      {/* Wärmestrom label */}
                      <text x={colX[3] + nodeW / 2} y={combOutY + combOutH + 14} textAnchor="middle" className="sk sk-title">{language === 'de' ? 'Wärmestrom' : 'Heat Flow'}</text>
                      <text x={colX[3] + nodeW / 2} y={combOutY + combOutH + 28} textAnchor="middle" className="sk sk-val" fill="#fdba74">{fmt(combustionOutMW)} MW</text>
                      <text x={colX[3] + nodeW / 2} y={combOutY + combOutH + 42} textAnchor="middle" className="sk sk-pct">{pct(combustionOutMW)}%</text>

                      {/* Electricity label */}
                      {products.electricity && elecMW > 0 && (
                        <>
                          <text x={colX[4] + nodeW + 5} y={elecY + elecH / 2 - 8} textAnchor="start" className="sk sk-title" fill="#fde047">{language === 'de' ? 'Strom' : 'Electricity'}</text>
                          <text x={colX[4] + nodeW + 5} y={elecY + elecH / 2 + 6} textAnchor="start" className="sk sk-val" fill="#facc15">{fmt(elecMW)} MW ({pct(elecMW)}%)</text>
                        </>
                      )}

                      {/* Usable Heat label */}
                      {usableHeatMW > 0 && (
                        <>
                          <text x={colX[4] + nodeW + 5} y={usableHeatY2 + usableHeatH / 2 - 8} textAnchor="start" className="sk sk-title" fill="#67e8f9">{language === 'de' ? 'Nutzwärme' : 'Usable Heat'}</text>
                          <text x={colX[4] + nodeW + 5} y={usableHeatY2 + usableHeatH / 2 + 6} textAnchor="start" className="sk sk-val" fill="#06b6d4">{fmt(usableHeatMW)} MW ({pct(usableHeatMW)}%)</text>
                        </>
                      )}

                      {/* Loss Heat label */}
                      {lossHeatMW > 0 && (
                        <>
                          <text x={colX[4] + nodeW + 5} y={lossHeatY + lossHeatH / 2 - 8} textAnchor="start" className="sk sk-title" fill="#9ca3af">{language === 'de' ? 'Verluste' : 'Losses'}</text>
                          <text x={colX[4] + nodeW + 5} y={lossHeatY + lossHeatH / 2 + 6} textAnchor="start" className="sk sk-val" fill="#6b7280">{fmt(lossHeatMW)} MW ({pct(lossHeatMW)}%)</text>
                        </>
                      )}

                      {/* Oil output label at Nutzung column */}
                      {products.bioOil && oilMW > 0 && (
                        <>
                          <text x={colX[4] + nodeW + 5} y={oilY + oilH / 2 - 8} textAnchor="start" className="sk sk-title" fill="#c084fc">{language === 'de' ? 'Bio-Öl' : 'Bio-Oil'}</text>
                          <text x={colX[4] + nodeW + 5} y={oilY + oilH / 2 + 6} textAnchor="start" className="sk sk-val" fill="#a855f7">{fmt(oilMW)} MW ({pct(oilMW)}%)</text>
                        </>
                      )}

                      {/* Column headers */}
                      <text x={colX[0] + nodeW / 2} y={18} textAnchor="middle" className="sk" style={{ fontSize: 11, fill: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>{language === 'de' ? 'EINGANG' : 'INPUT'}</text>
                      <text x={colX[1] + nodeW / 2} y={18} textAnchor="middle" className="sk" style={{ fontSize: 11, fill: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>{language === 'de' ? 'PYROLYSE' : 'PYROLYSIS'}</text>
                      <text x={colX[2] + nodeW / 2} y={18} textAnchor="middle" className="sk" style={{ fontSize: 11, fill: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>{products.bioOil ? (language === 'de' ? 'KONDENSATION' : 'CONDENSATION') : (language === 'de' ? 'OHNE KONDENS.' : 'NO CONDENS.')}</text>
                      <text x={colX[3] + nodeW / 2} y={18} textAnchor="middle" className="sk" style={{ fontSize: 11, fill: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>{language === 'de' ? 'VERBRENNUNG' : 'COMBUSTION'}</text>
                      <text x={colX[4] + nodeW / 2} y={18} textAnchor="middle" className="sk" style={{ fontSize: 11, fill: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>{language === 'de' ? 'NUTZUNG' : 'UTILIZATION'}</text>
                    </svg>
                  </div>
                );
              })()}

            </div>
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
                const heatRevenue = products.heat ? thermalRatedPowerKW * (inputs.heatYield / 100) * inputs.operatingHours * inputs.heatPrice / 1000 : 0;
                const elecProd = elecProductionKWh;
                const elecConsumption = inputs.electricalPower * inputs.operatingHours;
                const electricityRevenue = products.electricity ? Math.max(0, (elecProd - elecConsumption) * inputs.electricityPrice / 1000) : 0;
                const bioOilRevenue = products.bioOil ? (inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.bioOilYield / 100) * inputs.bioOilPrice / 1000 : 0;
                const biocharRevenue = ((inputs.plantCapacity * inputs.operatingHours / 1000) * (inputs.biocharYield / 100) * inputs.biocharPrice) / 1000;
                const certificateRevenue =
                  ((inputs.plantCapacity * inputs.operatingHours / 1000)
                  * (inputs.biocharYield / 100)
                  * (inputs.biocharCarbonContent / 100)
                  * inputs.co2RemovalPrice
                  * (1 - inputs.certificateFeeRate / 100)) / 1000;
                
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
                    <div className={`${certClass} ${baseClass} relative`}>
                      <div className="flex items-center justify-between">
                        <h3 className={certText}>{t.revenueCertificates}</h3>
                        <button onClick={() => toggleInfo('certRevenueInfo')} className="text-emerald-300 hover:text-emerald-200">
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-2xl font-bold text-white">{formatNumber(certificateRevenue)}k €/{language === 'de' ? 'a' : 'y'}</p>
                      {expandedInfo['certRevenueInfo'] && (
                        <div className="mt-2 text-xs text-gray-200 bg-black/30 p-2 rounded">
                          {language === 'de'
                            ? 'Netto-Umsatz: Ca. 25% des Bruttoumsatzes gehen an dMRV-Dienstleister und CO₂-Händler (Zertifizierung, Verifizierung, Vermarktung).'
                            : 'Net revenue: Approx. 25% of gross revenue goes to dMRV service providers and CO₂ traders (certification, verification, marketing).'}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Cost KPIs */}
          <div className="mt-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-red-600 rounded"></div>
              {language === 'de' ? 'Kosten KPIs' : 'Cost KPIs'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {(() => {
                const annualFeedstockCost = (inputs.plantCapacity * inputs.operatingHours / 1000) * inputs.feedstockCost;
                const laborCost = inputs.laborCost;
                const maintenanceCost = inputs.maintenanceCost;
                const grossElectricityConsumption = inputs.electricalPower * inputs.operatingHours;
                const elecProd = elecProductionKWh;
                const netElectricityConsumption = Math.max(0, grossElectricityConsumption - elecProd);
                const grossAnnualElectricityCost = grossElectricityConsumption * inputs.electricityConsumptionPrice / 1000;
                const netAnnualElectricityCost = netElectricityConsumption * inputs.electricityConsumptionPrice / 1000;
                
                const baseClass = 'p-4 rounded-lg shadow-lg';
                const feedstockClass = 'bg-gradient-to-br from-orange-600 to-orange-700 border border-orange-500';
                const laborClass = 'bg-gradient-to-br from-pink-600 to-pink-700 border border-pink-500';
                const maintenanceClass = 'bg-gradient-to-br from-red-600 to-red-700 border border-red-500';
                const electricityClass = grossAnnualElectricityCost === 0 ? 'bg-gradient-to-br from-gray-600 to-gray-700 border border-gray-500' : 'bg-gradient-to-br from-red-600 to-red-700 border border-red-500';
                
                const feedstockText = 'text-xs font-medium text-orange-100 mb-2';
                const laborText = 'text-xs font-medium text-pink-100 mb-2';
                const maintenanceText = 'text-xs font-medium text-red-100 mb-2';
                const electricityText = grossAnnualElectricityCost === 0 ? 'text-xs font-medium text-gray-300 mb-2' : 'text-xs font-medium text-red-100 mb-2';
                
                return (
                  <>
                    <div className={`${feedstockClass} ${baseClass}`}><h3 className={feedstockText}>{language === 'de' ? 'Rohstoffkosten' : 'Feedstock Costs'}</h3><p className="text-2xl font-bold text-white">{formatNumber(annualFeedstockCost / 1000)}k €/{language === 'de' ? 'a' : 'y'}</p></div>
                    <div className={`${laborClass} ${baseClass}`}><h3 className={laborText}>{language === 'de' ? 'Arbeitskosten' : 'Labor Costs'}</h3><p className="text-2xl font-bold text-white">{formatNumber(laborCost / 1000)}k €/{language === 'de' ? 'a' : 'y'}</p></div>
                    <div className={`${maintenanceClass} ${baseClass}`}><h3 className={maintenanceText}>{language === 'de' ? 'Wartungskosten' : 'Maintenance Costs'}</h3><p className="text-2xl font-bold text-white">{formatNumber(maintenanceCost / 1000)}k €/{language === 'de' ? 'a' : 'y'}</p></div>
                    <div className={`${electricityClass} ${baseClass}`}><h3 className={electricityText}>{language === 'de' ? 'Stromkosten' : 'Electricity Costs'}</h3><p className="text-2xl font-bold text-white">{formatNumber(grossAnnualElectricityCost)}k €/{language === 'de' ? 'a' : 'y'}</p></div>
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
            {(() => {
              const grossElectricityConsumption = inputs.electricalPower * inputs.operatingHours;
              const elecProd = elecProductionKWh;
              const netElectricityConsumption = Math.max(0, grossElectricityConsumption - elecProd);
              const annualElectricityCost = netElectricityConsumption * inputs.electricityConsumptionPrice / 1000;
              
              return (
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
              );
            })()}
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
              <div style={{ width: '100%', height: '400px' }}>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={results.cumulativeCashFlows} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '11px' }} labelStyle={{ color: '#ffffff' }} formatter={(value) => [`${formatNumber(value)}k €`, t.cumulative]} />
                    <Line type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Annual Revenue vs Costs */}
            <div id="revenue-chart" className="bg-gray-900 p-3 rounded-lg border border-gray-700">
              <h3 className="text-xs font-semibold text-white mb-2">{t.annualRevenueVsCosts}</h3>
              <div style={{ width: '100%', height: '400px' }}>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={[
                    { category: t.revenues, value: results.annualRevenue || 0 },
                    { category: t.costs, value: results.annualCosts || 0 },
                    { category: t.cashFlow, value: (results.annualRevenue || 0) - (results.annualCosts || 0) }
                  ]} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9ca3af" style={{ fontSize: '10px' }} angle={-20} textAnchor="end" height={40} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '11px' }} labelStyle={{ color: '#ffffff' }} formatter={(value) => `${formatNumber(value || 0)}k €`} />
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
            <div id="pie-chart" className="bg-gray-900 p-3 rounded-lg border border-gray-700 flex flex-col items-center justify-center">
              <h3 className="text-xs font-semibold text-white mb-2">{t.revenueBreakdownChart}</h3>
              <div style={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie data={(() => {
                      const annualFeedstock = (inputs.plantCapacity * inputs.operatingHours) / 1000;
                      const biocharProduction = annualFeedstock * (inputs.biocharYield / 100);
                      const biocharSales = biocharProduction * inputs.biocharPrice / 1000;
                      const co2Certificates =
                        biocharProduction
                        * (inputs.biocharCarbonContent / 100)
                        * inputs.co2RemovalPrice
                        * (1 - inputs.certificateFeeRate / 100) / 1000;
                      let heatSales = 0;
                      if (products.heat) {
                        heatSales = (thermalRatedPowerKW * (inputs.heatYield / 100) * inputs.operatingHours * inputs.heatPrice) / 1000;
                      }
                      let electricitySales = 0;
                      if (products.electricity) {
                        electricitySales = Math.max(0, (elecProductionKWh - inputs.electricalPower * inputs.operatingHours) * inputs.electricityPrice) / 1000;
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
                    })()} cx="50%" cy="50%" labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`} outerRadius={110} innerRadius={0} dataKey="value" />
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

        {/* Why Projects Fail */}
        <WhyProjectsFail language={language as Language} />
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

      {/* Cookie Consent Banner - Small Bottom Bar as Overlay */}
      {!cookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-blue-500/30 shadow-2xl z-50 p-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-2">
                  {language === 'de'
                    ? '🔒 Diese Website verwendet Cookies und ähnliche Technologien, um Ihre Erfahrung zu verbessern. Durch die Nutzung stimmen Sie unserer '
                    : '🔒 This website uses cookies and similar technologies to enhance your experience. By using it, you agree to our '
                  }
                  <a 
                    href={language === 'de' ? 'https://www.decarbo-engineering.com/datenschutz' : 'https://www.decarbo-engineering.com/en/datenschutz'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {language === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
                  </a>
                  {language === 'de' ? ' zu.' : '.'}
                </p>
              </div>
              <button
                onClick={() => setCookieConsent(true)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all shadow-lg whitespace-nowrap flex-shrink-0"
              >
                {language === 'de' ? '✓ Akzeptieren' : '✓ Accept'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PyrolysisCalculator;
