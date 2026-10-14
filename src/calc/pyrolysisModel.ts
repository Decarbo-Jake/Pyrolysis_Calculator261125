// Pyrolysis plant model: inputs → energy flows, revenues, KPIs.
// Pure functions only (no React), so the calculator, the certification module
// and the scenario engine can all run the same calculation.

export interface PyrolysisInputs {
  plantCapacity: number;            // kW feedstock (dry mass)
  fuelBulkDensity: number;          // kg/m³
  fuelHeatValue: number;            // kWh/kg
  operatingHours: number;           // full-load hours per year
  projectLifetime: number;          // years
  discountRate: number;             // %
  electricalPower: number;          // kW
  electricityConsumptionPrice: number; // €/kWh
  thermalEfficiency: number;        // % heat exchanger efficiency
  initialInvestment: number;        // €
  feedstockCost: number;            // €/t
  laborCost: number;                // €/yr
  maintenanceCost: number;          // €/yr
  biocharYield: number;             // % of feedstock
  biocharCarbonContent: number;     // %
  biocharHeatingValue: number;      // MJ/kg
  biocharBulkDensity: number;       // kg/m³
  autothermalShare: number;         // %
  biocharPrice: number;             // €/t
  lcaFactor: number;                // t CO₂ / t biochar
  co2RemovalPrice: number;          // €/t CO₂
  certificateFeeRate: number;       // % deducted for trading + dMRV fees
  heatYield: number;                // % of heat sold
  heatPrice: number;                // €/kWh
  electricityYield: number;         // % electrical efficiency
  electricityPrice: number;         // €/kWh
  usableResidualHeat: number;       // %
  bioOilYield: number;              // % of feedstock
  bioOilPrice: number;              // €/t
  bioOilHeatingValue: number;       // MJ/kg
}

export interface PyrolysisProducts {
  biochar: boolean;
  heat: boolean;
  electricity: boolean;
  bioOil: boolean;
}

export const defaultProducts: PyrolysisProducts = {
  biochar: true,
  heat: false,
  electricity: false,
  bioOil: false
};

export const defaultInputs: PyrolysisInputs = {
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
  certificateFeeRate: 25,
  heatYield: 40,
  heatPrice: 0.08,
  electricityYield: 18,
  electricityPrice: 0.15,
  usableResidualHeat: 50,
  bioOilYield: 20,
  bioOilPrice: 400,
  bioOilHeatingValue: 22
};

export interface EnergyFlows {
  pyrolysisGasEnergyMW: number;
  oilEnergyMW: number;
  residualGasEnergyMW: number;
  waermestromMW: number;            // heat flow after autothermal share
  waermestromKW: number;
  elecPowerKW: number;
  elecProductionKWh: number;
  residualHeatMW: number;
  usableResidualHeatMW: number;
  thermalRatedPowerMW: number;
  thermalRatedPowerKW: number;
}

export interface YearlyCashFlow {
  year: number;
  cashFlow: number;
  discountedCashFlow: number;
  revenue: number;
  costs: number;
}

export interface EconomicResults {
  npv: number;                      // k€
  irr: number;                      // %
  paybackPeriod: number;            // years (0 = no payback)
  annualCashFlows: YearlyCashFlow[]; // €
  cumulativeCashFlows: { year: number; cumulative: number }[]; // k€
  annualRevenue: number;            // k€/yr
  annualCosts: number;              // k€/yr
  totalInvestment: number;          // k€
}

export interface Production {
  annualFeedstock: number;          // t/yr
  biocharProduction: number;        // t/yr
  annualCO2Removal: number;         // t CO₂/yr, biochar × LCA factor (basis for certificates)
  totalCO2Removal: number;          // t CO₂ over project lifetime
}

// All revenues and costs in €/yr
export interface RevenueBreakdown {
  biocharSales: number;
  certificateRevenue: number;
  heatSales: number;
  electricitySales: number;
  bioOilSales: number;
}

export interface PyrolysisModel {
  energy: EnergyFlows;
  production: Production;
  revenue: RevenueBreakdown;
  results: EconomicResults;
}

export const calculateEnergyFlows = (inputs: PyrolysisInputs, products: PyrolysisProducts): EnergyFlows => {
  const pyrolysisGasEnergyMW = (inputs.plantCapacity * inputs.fuelHeatValue / 1000) - (inputs.plantCapacity * (inputs.biocharYield / 100) * inputs.biocharHeatingValue / (1000 * 3.6));
  const oilEnergyMW = products.bioOil ? (inputs.plantCapacity * (1 - inputs.biocharYield / 100)) * (inputs.bioOilYield / 100) * inputs.bioOilHeatingValue / 3600 : 0;
  const residualGasEnergyMW = pyrolysisGasEnergyMW - oilEnergyMW;
  // Wärmestrom (heat flow after autothermal share; based on residual gas when oil condensation is active)
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

  return {
    pyrolysisGasEnergyMW, oilEnergyMW, residualGasEnergyMW, waermestromMW, waermestromKW,
    elecPowerKW, elecProductionKWh, residualHeatMW, usableResidualHeatMW, thermalRatedPowerMW, thermalRatedPowerKW
  };
};

// IRR via Newton-Raphson on a constant annual cash flow
const calculateIRR = (totalInvestment: number, annualCashFlow: number, projectLifetime: number): number => {
  const npvAtRate = (rate: number) => {
    let value = -totalInvestment;
    for (let year = 1; year <= projectLifetime; year++) {
      value += annualCashFlow / Math.pow(1 + rate, year);
    }
    return value;
  };

  const npvDerivative = (rate: number) => {
    let derivative = 0;
    for (let year = 1; year <= projectLifetime; year++) {
      derivative -= (year * annualCashFlow) / Math.pow(1 + rate, year + 1);
    }
    return derivative;
  };

  let irr = 0;
  let rate = 0.1; // Initial guess (10%)
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let iterations = 0; iterations < maxIterations; iterations++) {
    const npvValue = npvAtRate(rate);
    if (Math.abs(npvValue) < tolerance) {
      irr = rate * 100;
      break;
    }
    const derivative = npvDerivative(rate);
    if (Math.abs(derivative) < 1e-10) break; // Avoid division by very small number
    rate = rate - npvValue / derivative;
  }

  // Clamp IRR to reasonable range
  return Math.max(Math.min(irr, 100), -100);
};

export const calculatePyrolysis = (inputs: PyrolysisInputs, products: PyrolysisProducts): PyrolysisModel => {
  const energy = calculateEnergyFlows(inputs, products);
  const { operatingHours, projectLifetime, discountRate, initialInvestment } = inputs;

  const annualFeedstock = (inputs.plantCapacity * operatingHours) / 1000;
  const totalInvestment = initialInvestment;

  // Biochar Revenue
  const biocharProduction = annualFeedstock * (inputs.biocharYield / 100);
  const biocharSales = biocharProduction * inputs.biocharPrice;

  // CO₂ Certificate Revenue — biochar × LCA factor × certificate price, net of trading + dMRV fees
  const annualCO2Removal = biocharProduction * inputs.lcaFactor;
  const certificateRevenue = annualCO2Removal * inputs.co2RemovalPrice * (1 - inputs.certificateFeeRate / 100);

  // Heat Revenue — Thermische Nennleistung × Volllaststunden × Anteil verkaufter Wärme
  const heatSales = products.heat
    ? energy.thermalRatedPowerKW * (inputs.heatYield / 100) * operatingHours * inputs.heatPrice
    : 0;

  // Electricity Revenue (only surplus counted) — Stromproduktion = Wärmestrom × Stromausbeute
  const electricityProduction = products.electricity
    ? energy.waermestromKW * (inputs.electricityYield / 100) * operatingHours
    : 0;
  const grossElectricityConsumption = inputs.electricalPower * operatingHours;
  const electricitySales = products.electricity
    ? Math.max(0, electricityProduction - grossElectricityConsumption) * inputs.electricityPrice
    : 0;

  // Bio-Oil Revenue
  const bioOilSales = products.bioOil
    ? annualFeedstock * (inputs.bioOilYield / 100) * inputs.bioOilPrice
    : 0;

  const annualRevenue = biocharSales + certificateRevenue + heatSales + electricitySales + bioOilSales;

  const annualFeedstockCost = annualFeedstock * inputs.feedstockCost;
  // Electricity costs only for net consumption (gross consumption minus production)
  const netElectricityConsumption = Math.max(0, grossElectricityConsumption - electricityProduction);
  const annualElectricityCost = netElectricityConsumption * inputs.electricityConsumptionPrice;
  const totalAnnualCosts = annualFeedstockCost + inputs.laborCost + inputs.maintenanceCost + annualElectricityCost;
  const annualCashFlow = annualRevenue - totalAnnualCosts;

  let npv = -totalInvestment;
  const annualCashFlows: YearlyCashFlow[] = [];
  const cumulativeCashFlows: { year: number; cumulative: number }[] = [];
  let cumulative = -totalInvestment;

  for (let year = 1; year <= projectLifetime; year++) {
    const discountedCashFlow = annualCashFlow / Math.pow(1 + discountRate / 100, year);
    npv += discountedCashFlow;
    annualCashFlows.push({ year, cashFlow: annualCashFlow, discountedCashFlow, revenue: annualRevenue, costs: totalAnnualCosts });
    cumulative += annualCashFlow;
    cumulativeCashFlows.push({ year, cumulative: cumulative / 1000 });
  }

  const irr = calculateIRR(totalInvestment, annualCashFlow, projectLifetime);

  // If annual cash flow is zero or negative, payback is undefined
  const paybackPeriod = annualCashFlow > 0 ? totalInvestment / annualCashFlow : 0;

  return {
    energy,
    production: { annualFeedstock, biocharProduction, annualCO2Removal, totalCO2Removal: annualCO2Removal * projectLifetime },
    revenue: { biocharSales, certificateRevenue, heatSales, electricitySales, bioOilSales },
    results: {
      npv: npv / 1000,
      irr,
      paybackPeriod,
      annualCashFlows,
      cumulativeCashFlows,
      annualRevenue: annualRevenue / 1000,
      annualCosts: totalAnnualCosts / 1000,
      totalInvestment: totalInvestment / 1000
    }
  };
};
