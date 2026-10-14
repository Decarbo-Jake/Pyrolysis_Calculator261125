import { Zap, Flame, Droplets, Leaf, Info } from 'lucide-react';
import { SectionProps } from './sectionProps';

// Process flow diagram: feed -> pyrolysis -> biochar box | gas path, plus the simplified energy balance
const ProcessFlow = ({ language, t, inputs, products, model, formatNumber, expandedInfo, toggleInfo, handleInputChange }: SectionProps) => {
  const { production, revenue } = model;
  const { pyrolysisGasEnergyMW, oilEnergyMW, residualGasEnergyMW, waermestromMW, elecPowerKW, elecProductionKWh, residualHeatMW, usableResidualHeatMW, thermalRatedPowerMW, thermalRatedPowerKW } = model.energy;

  return (
    <>
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
              <span className="font-bold text-white">{formatNumber(production.annualCO2Removal, 1)} t/{language === 'de' ? 'a' : 'yr'}</span>
            </div>
            <div className="p-2 bg-green-900/20 rounded border border-green-500/30 text-sm">
              <span className="text-gray-400">{t.certificateRevenue}: </span>
              <span className="font-bold text-white">{formatNumber(revenue.certificateRevenue)} €/{language === 'de' ? 'a' : 'yr'}</span>
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
    </>
  );
};

export default ProcessFlow;
