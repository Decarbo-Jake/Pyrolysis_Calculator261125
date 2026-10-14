import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Info } from 'lucide-react';
import { SectionProps } from './sectionProps';

// Economic results: key metrics, revenue / cost / invest / CO2 KPIs and charts
const Results = ({ language, t, inputs, products, model, formatNumber, expandedInfo, toggleInfo }: Omit<SectionProps, 'handleInputChange'>) => {
  const { results, production, revenue } = model;
  const { elecProductionKWh, thermalRatedPowerKW } = model.energy;

  return (
    <>
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
            const certificateRevenue = revenue.certificateRevenue / 1000;
            
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
              {formatNumber(production.annualCO2Removal)} t CO₂/{language === 'de' ? 'Jahr' : 'year'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-5 rounded-lg shadow-lg border border-teal-500">
            <h3 className="text-sm font-medium text-teal-100 mb-2">{t.totalCo2Removal}</h3>
            <p className="text-3xl font-bold text-white">
              {formatNumber(production.totalCO2Removal)} t CO₂
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
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '11px' }} labelStyle={{ color: '#ffffff' }} formatter={(value) => [`${formatNumber(Number(value))}k €`, t.cumulative]} />
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
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '11px' }} labelStyle={{ color: '#ffffff' }} formatter={(value) => `${formatNumber(Number(value || 0))}k €`} />
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
                  const co2Certificates = revenue.certificateRevenue / 1000;
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
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '11px' }} labelStyle={{ color: '#ffffff' }} formatter={(value) => `${formatNumber(Number(value))}k €`} />
                <Legend verticalAlign="bottom" height={60} wrapperStyle={{ color: '#9ca3af', fontSize: '10px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Results;
