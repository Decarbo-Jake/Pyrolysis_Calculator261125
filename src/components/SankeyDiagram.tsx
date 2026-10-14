import { SectionProps } from './sectionProps';

// Sankey diagram of the energy flow (all values in MW)
const SankeyDiagram = ({ language, inputs, products, model }: Pick<SectionProps, 'language' | 'inputs' | 'products' | 'model'>) => {
  const { pyrolysisGasEnergyMW, oilEnergyMW, residualGasEnergyMW, waermestromMW } = model.energy;

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
};

export default SankeyDiagram;
