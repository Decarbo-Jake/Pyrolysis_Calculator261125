// ========================================
// TEIL 1 von 5: Imports, Translations und State Setup
// ========================================
// Last Updated: 2025-11-26
// Version: 2.0.1
// Changes: Biochar price minimum value set to 0 EUR
// Status: Production    Ready

import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Zap, Flame, Droplets, Leaf, Info, Globe, FileDown, ArrowDown, ArrowUp, ArrowRight, ArrowDownRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import decarboLogo from './assets/decarbo-logo.png';
import biocharEuropeLogo from './assets/Biochar Europe Logo Small White@3x.svg';
import ExpectationsCheck from './features/expectations-check/ExpectationsCheck';
import { expectationsCheckContent } from './features/expectations-check/content';
import ProcessFlow from './components/ProcessFlow';
import SankeyDiagram from './components/SankeyDiagram';
import Results from './components/Results';
import { SectionProps } from './components/sectionProps';
import { translations, Language } from './i18n';
import { calculatePyrolysis, defaultInputs, defaultProducts, PyrolysisInputs, PyrolysisProducts } from './calc/pyrolysisModel';

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
  
  const [language, setLanguage] = useState<Language>('de');
  const [cookieConsent, setCookieConsent] = useState(false);
  const t = translations[language];
  
  const [products, setProducts] = useState<PyrolysisProducts>(defaultProducts);

  const [inputs, setInputs] = useState<PyrolysisInputs>(defaultInputs);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [contactConsent, setContactConsent] = useState(false);
  const [formErrors, setFormErrors] = useState({ name: '', email: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Expectations Check: which questions the visitor marked as clarified (kept only in this browser session)
  const [clarified, setClarified] = useState<number[]>([]);
  const [checkUsed, setCheckUsed] = useState(false);
  const toggleClarified = (index: number) => {
    setCheckUsed(true);
    setClarified(prev => (prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index].sort((a, b) => a - b)));
  };
  const openPoints = expectationsCheckContent[language].questions
    .map((q, i) => ({ number: i + 1, topic: q.topic }))
    .filter(p => !clarified.includes(p.number - 1));
  const scrollToLeadForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('user-name')?.focus({ preventScroll: true });
  };

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

  // Computed: energy flows, revenues and KPIs (see calc/pyrolysisModel.ts)
  const model = useMemo(() => calculatePyrolysis(inputs, products), [inputs, products]);
  const { results, production, revenue } = model;
  const { elecProductionKWh, thermalRatedPowerKW } = model.energy;

  const handleProductChange = (product) => {
    if (product === 'biochar') return;
    setProducts(prev => ({ ...prev, [product]: !prev[product] }));
  };

  const handleInputChange = (field: keyof PyrolysisInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const sectionProps: SectionProps = { language, t, inputs, products, model, formatNumber, expandedInfo, toggleInfo, handleInputChange };

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
      const certRev = revenue.certificateRevenue / 1000;
      const annualCO2 = production.annualCO2Removal;
      const totalCO2 = production.totalCO2Removal;
      
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

        // Erwartungs-Check: offene Punkte (nur wenn der Besucher den Check genutzt hat)
        open_points: !checkUsed
          ? (language === 'de' ? 'Erwartungs-Check nicht genutzt' : 'Expectations Check not used')
          : openPoints.length === 0
            ? (language === 'de' ? 'Alle Punkte geklärt' : 'All points clarified')
            : openPoints.map(p => `${p.number}. ${p.topic}`).join(', '),
        
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
      
      // Pre-load logos as PNG data URLs (SVGs are rasterized, since jsPDF cannot embed SVG)
      const loadAsPng = (src: string, scale = 1) => new Promise<{ dataUrl: string; aspect: number } | null>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          if (!ctx || !img.width || !img.height) return resolve(null);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve({ dataUrl: canvas.toDataURL('image/png'), aspect: img.width / img.height });
        };
        img.onerror = () => resolve(null);
        img.src = src;
      });
      const [decarboPng, biocharEuropePng] = await Promise.all([loadAsPng(decarboLogo), loadAsPng(biocharEuropeLogo, 4)]);
      if (!decarboPng) console.warn('Decarbo logo could not be loaded for the PDF');
      if (!biocharEuropePng) console.warn('Biochar Europe logo could not be loaded for the PDF');

      // Header: Decarbo logo left, Biochar Europe (cooperation partner) right
      const addHeader = () => {
        pdf.setFillColor(17, 24, 39);
        pdf.rect(0, 0, pageWidth, 50, 'F');

        if (decarboPng) {
          const logoWidth = pageWidth / 3;
          const logoHeight = Math.min(logoWidth / decarboPng.aspect, 40);
          pdf.addImage(decarboPng.dataUrl, 'PNG', margin, (48 - logoHeight) / 2, logoHeight * decarboPng.aspect, logoHeight, 'decarbo-logo', 'FAST');
        }

        if (biocharEuropePng) {
          const partnerHeight = 18;
          const partnerWidth = partnerHeight * biocharEuropePng.aspect;
          const partnerX = pageWidth - margin - partnerWidth;
          const partnerY = (48 - partnerHeight) / 2 + 3;
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(7);
          pdf.setTextColor(255, 255, 255);
          pdf.text(language === 'de' ? 'In Kooperation mit:' : 'In cooperation with:', partnerX, partnerY - 2.5);
          pdf.addImage(biocharEuropePng.dataUrl, 'PNG', partnerX, partnerY, partnerWidth, partnerHeight, 'biochar-europe-logo', 'FAST');
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
      const certRev = revenue.certificateRevenue / 1000;
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
      
      const annualCO2 = production.annualCO2Removal;
      const totalCO2 = production.totalCO2Removal;
      
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
      
      // Expectations Check as the last page
      {
        const check = expectationsCheckContent[language];
        // Standard PDF fonts cannot render subscripts or arrows
        const pdfSafe = (s: string) => s.replace(/₂/g, '2').replace(/[→↑]/g, '');
        pdf.addPage();
        yPosition = addHeader();

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(16, 185, 129);
        const titleLines = pdf.splitTextToSize(pdfSafe(check.title), contentWidth);
        pdf.text(titleLines, margin, yPosition);
        yPosition += titleLines.length * 6 + 2;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(80, 80, 80);
        const introLines = pdf.splitTextToSize(pdfSafe(check.intro), contentWidth);
        pdf.text(introLines, margin, yPosition);
        yPosition += introLines.length * 4.2 + 4;

        // Status column only when the visitor used the check; otherwise the questions start at the margin
        const indent = checkUsed ? 22 : 0;
        const doneLabel = language === 'de' ? 'Geklärt' : 'Clarified';
        const openLabel = language === 'de' ? 'Offen' : 'Open';
        check.questions.forEach((q, i) => {
          const isDone = clarified.includes(i);
          const qLines = pdf.splitTextToSize(pdfSafe(q.question), contentWidth - indent);
          const blockH = 5 + qLines.length * 4.2 + 3;
          if (yPosition + blockH > pageHeight - 15) {
            pdf.addPage();
            yPosition = addHeader();
          }
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          if (isDone) pdf.setTextColor(22, 163, 74); else pdf.setTextColor(234, 88, 12);
          pdf.text(checkUsed ? (isDone ? doneLabel : openLabel) : '', margin, yPosition);
          pdf.setTextColor(30, 30, 30);
          pdf.text(`${i + 1}. ${pdfSafe(q.topic)}`, margin + indent, yPosition);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(60, 60, 60);
          pdf.text(qLines, margin + indent, yPosition + 4.5);
          yPosition += blockH;
        });

        if (checkUsed && openPoints.length > 0) {
          yPosition += 2;
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(80, 80, 80);
          const ctaLines = pdf.splitTextToSize(pdfSafe(check.ctaOffer), contentWidth);
          if (yPosition + ctaLines.length * 4.2 > pageHeight - 15) {
            pdf.addPage();
            yPosition = addHeader();
          }
          pdf.text(ctaLines, margin, yPosition);
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
                  <a href="#expectations-check" className="text-xs text-amber-200 hover:text-white underline underline-offset-2 cursor-pointer">
                    {expectationsCheckContent[language].heroTeaser}
                  </a>
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
                    <input data-setting="plantCapacity" id="plant-capacity" name="plantCapacity" type="range" min="200" max="20000" step="50" value={inputs.plantCapacity} onChange={(e) => handleInputChange('plantCapacity', e.target.value)} className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                    <input data-setting="plantCapacity" type="number" min="200" max="20000" step="50" value={inputs.plantCapacity} onChange={(e) => handleInputChange('plantCapacity', e.target.value)} className="w-28 px-2 py-1 text-sm text-white bg-gray-700 border border-blue-500/50 rounded-md text-right focus:outline-none focus:border-blue-400" />
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
                  <input data-setting="operatingHours" id="operating-hours" name="operatingHours" type="range" min="0" max="8500" step="100" value={inputs.operatingHours} onChange={(e) => handleInputChange('operatingHours', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
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
                  <input data-setting="feedstockCost" id="feedstock-cost" name="feedstockCost" type="range" min="0" max="300" step="1" value={inputs.feedstockCost} onChange={(e) => handleInputChange('feedstockCost', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
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

              <ProcessFlow {...sectionProps} />

              {/* ── SANKEY DIAGRAM ── */}
              <SankeyDiagram {...sectionProps} />

            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-6">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded"></div>
            {t.economicAnalysis}
          </h2>
          
          <Results {...sectionProps} />

          {/* Expectations Check */}
          <ExpectationsCheck language={language} t={t} inputs={inputs} clarified={clarified} onToggleClarified={toggleClarified} onRequest={scrollToLeadForm} />

          {/* Lead Capture Form */}
          <div id="lead-form" className="mt-6 bg-gradient-to-r from-blue-900/20 to-gray-800 p-6 rounded-lg border border-blue-500/30 scroll-mt-6">
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

            {checkUsed && (
              <p className="mt-3 text-xs text-gray-400">
                {language === 'de'
                  ? `Ihre Angaben aus dem Erwartungs-Check werden mit Ihrer Anfrage übermittelt${openPoints.length > 0 ? ` (offene Punkte: ${openPoints.map(p => p.number).join(', ')})` : ''}.`
                  : `Your Expectations Check answers are sent with your request${openPoints.length > 0 ? ` (open points: ${openPoints.map(p => p.number).join(', ')})` : ''}.`}
              </p>
            )}
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
