# Pyrolysis Calculator - Calculation Logic Report

Date: 2026-04-30
Project: Pyrolysis_Calculator261125 - v3
Primary source reviewed: src/Pyrolysis_Calculator_Bilingual.tsx

## 1. Purpose of this document

This document explains all major calculations used in the calculator and how the app behaves when users change inputs or generate a report. The goal is to support partner-side counter-checking.

## 2. App behavior and execution flow

1. The app initializes default inputs and selected products:
   - Biochar is always enabled.
   - Heat, electricity, and bio-oil are optional and can be toggled.
2. Any input change is handled by a generic handler that parses values to numbers.
3. A reactive calculation cycle is implemented via `useEffect(() => { calculateNPV(); }, [inputs, products])`.
4. A second effect auto-updates maintenance cost guidance to 2.5% of total investment (initial + optional module investments).
5. The form for PDF download validates name/email before generating output.
6. On PDF generation:
   - It attempts to send an EmailJS notification.
   - Then it creates a PDF via jsPDF + html2canvas.
   - Failure in email does not block PDF generation.

## 3. Input variables and units

Key variables and assumed units:

- `plantCapacity`: kg dry feedstock per hour (kg/h)
- `fuelHeatValue`: kWh/kg
- `operatingHours`: h/year
- `projectLifetime`: years
- `discountRate`: %
- `electricalPower`: kW (internal/gross plant electrical load)
- `electricityConsumptionPrice`: EUR/kWh
- `initialInvestment`: EUR
- `feedstockCost`: EUR/t
- `laborCost`: EUR/year
- `maintenanceCost`: EUR/year
- `biocharYield`: % of feedstock mass
- `biocharCarbonContent`: % carbon in biochar
- `biocharHeatingValue`: MJ/kg
- `autothermalShare`: % of residual gas energy used internally
- `biocharPrice`: EUR/t
- `lcaFactor`: tCO2 per t biochar (used in some UI calculations)
- `co2RemovalPrice`: EUR/tCO2
- `heatYield`: % of thermal output sold
- `heatPrice`: EUR/kWh
- `electricityYield`: %
- `electricityPrice`: EUR/kWh
- `electricityInvestment`: EUR
- `usableResidualHeat`: %
- `bioOilYield`: %
- `bioOilPrice`: EUR/t
- `bioOilHeatingValue`: MJ/kg
- `bioOilInvestment`: EUR

## 4. Core thermodynamic/energy model

All equations below reflect direct implementation logic.

### 4.1 Input and split energies

1. Input energy stream:

$$
E_{in,MW} = \frac{plantCapacity \cdot fuelHeatValue}{1000}
$$

2. Biochar energy stream:

$$
E_{biochar,MW} = \frac{plantCapacity \cdot (biocharYield/100) \cdot biocharHeatingValue}{1000 \cdot 3.6}
$$

3. Pyrolysis gas energy:

$$
E_{pyGas,MW} = E_{in,MW} - E_{biochar,MW}
$$

4. Oil energy (if bio-oil enabled):

$$
E_{oil,MW} = \frac{plantCapacity \cdot (1 - biocharYield/100) \cdot (bioOilYield/100) \cdot bioOilHeatingValue}{3600}
$$

Else: $E_{oil,MW} = 0$.

5. Residual gas energy:

$$
E_{resGas,MW} = E_{pyGas,MW} - E_{oil,MW}
$$

### 4.2 Autothermal share and usable heat chain

6. Heat flow after autothermal share:

$$
E_{waermestrom,MW} = E_{resGas,MW} \cdot (1 - autothermalShare/100)
$$

7. Electricity conversion (if enabled):

$$
P_{el,kW} = E_{waermestrom,MW} \cdot 1000 \cdot (electricityYield/100)
$$

$$
E_{elProd,kWh} = P_{el,kW} \cdot operatingHours
$$

8. Remaining heat after electricity conversion:

$$
E_{resHeat,MW} =
\begin{cases}
E_{waermestrom,MW} \cdot (1 - electricityYield/100), & electricity\ enabled \\
E_{waermestrom,MW}, & otherwise
\end{cases}
$$

9. Usable residual heat gate:

$$
E_{usableRes,MW} =
\begin{cases}
E_{resHeat,MW} \cdot (usableResidualHeat/100), & electricity\ enabled \\
E_{waermestrom,MW}, & otherwise
\end{cases}
$$

10. Thermal rated power used for heat revenue:

$$
P_{th,kW} =
\left(\begin{cases}
E_{usableRes,MW}, & electricity\ enabled \\
E_{waermestrom,MW}, & otherwise
\end{cases}\right)
\cdot (thermalEfficiency/100) \cdot 1000
$$

## 5. Annual mass flows and revenues used in `calculateNPV`

### 5.1 Feedstock and product mass

1. Annual feedstock mass:

$$
M_{feed,t/a} = \frac{plantCapacity \cdot operatingHours}{1000}
$$

2. Biochar production:

$$
M_{biochar,t/a} = M_{feed,t/a} \cdot (biocharYield/100)
$$

3. Bio-oil production (if enabled):

$$
M_{bioOil,t/a} = M_{feed,t/a} \cdot (bioOilYield/100)
$$

### 5.2 Revenue blocks

1. Biochar sales revenue:

$$
R_{biochar} = M_{biochar,t/a} \cdot biocharPrice
$$

2. Certificate quantity in NPV engine:

$$
Q_{CO2,NPV} = M_{biochar,t/a} \cdot (biocharCarbonContent/100)
$$

3. Certificate revenue in NPV engine:

$$
R_{cert,NPV} = Q_{CO2,NPV} \cdot co2RemovalPrice
$$

4. Heat revenue (if enabled):

$$
R_{heat} = P_{th,kW} \cdot (heatYield/100) \cdot operatingHours \cdot heatPrice
$$

5. Electricity revenue (if enabled):

$$
E_{grossCons,kWh} = electricalPower \cdot operatingHours
$$

$$
E_{surplus,kWh} = \max(0, E_{elProd,kWh} - E_{grossCons,kWh})
$$

$$
R_{el} = E_{surplus,kWh} \cdot electricityPrice
$$

6. Bio-oil revenue (if enabled):

$$
R_{bioOil} = M_{bioOil,t/a} \cdot bioOilPrice
$$

7. Total annual revenue:

$$
R_{annual} = R_{biochar} + R_{cert,NPV} + R_{heat} + R_{el} + R_{bioOil}
$$

## 6. Cost model in `calculateNPV`

1. Annual feedstock cost:

$$
C_{feed} = M_{feed,t/a} \cdot feedstockCost
$$

2. Net electricity purchase:

$$
E_{netBuy,kWh} = \max(0, E_{grossCons,kWh} - E_{elProd,kWh})
$$

3. Annual electricity cost:

$$
C_{el} = E_{netBuy,kWh} \cdot electricityConsumptionPrice
$$

4. Total annual costs:

$$
C_{annual} = C_{feed} + laborCost + maintenanceCost + C_{el}
$$

5. Annual cash flow:

$$
CF_{annual} = R_{annual} - C_{annual}
$$

## 7. Investment, NPV, IRR, and payback

### 7.1 Total investment in NPV engine

$$
I_{total} = initialInvestment + [electricityInvestment\ if\ electricity\ enabled] + [bioOilInvestment\ if\ bioOil\ enabled]
$$

Note: `heatInvestment` exists as input, but is not included in this investment sum in the current NPV implementation.

### 7.2 NPV

$$
NPV = -I_{total} + \sum_{y=1}^{projectLifetime} \frac{CF_{annual}}{(1 + discountRate/100)^y}
$$

In state/UI, `npv` is stored divided by 1000 (kEUR).

### 7.3 IRR

IRR is solved by Newton-Raphson on:

$$
f(r) = -I_{total} + \sum_{y=1}^{projectLifetime} \frac{CF_{annual}}{(1+r)^y}
$$

with derivative:

$$
f'(r) = -\sum_{y=1}^{projectLifetime} \frac{y\cdot CF_{annual}}{(1+r)^{y+1}}
$$

Algorithm settings:

- initial guess $r_0 = 0.1$
- max iterations = 100
- tolerance = $10^{-6}$
- clamped output range: [-100%, 100%]

### 7.4 Payback period

$$
Payback =
\begin{cases}
I_{total}/CF_{annual}, & CF_{annual} > 0 \\
0, & otherwise
\end{cases}
$$

## 8. Time-series outputs used for charts

For each year `y` in 1..projectLifetime:

- discounted cash flow for NPV accumulation
- undiscouted annual cash flow kept constant each year
- cumulative cash flow updated linearly:

$$
Cumulative_y = -I_{total} + y \cdot CF_{annual}
$$

The cumulative series is stored in kEUR.

## 9. UI and report logic notes

1. The UI includes an energy balance/sankey section derived from the same energy chain variables above.
2. PDF report generation includes KPI cards and chart screenshots from DOM elements:
   - `cumulative-chart`
   - `revenue-chart`
   - `pie-chart`
3. Form validation requires:
   - non-empty name
   - valid email format regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$`

## 10. Important consistency findings for partner counter-check

The following are important for verification because not all screens use exactly the same formula basis:

1. Certificate basis differs across app sections:
   - NPV engine uses `biocharCarbonContent`.
   - CO2 KPI and some charts use `lcaFactor`.
   - Revenue KPI card applies an additional `* 0.75` factor to certificate revenue.
2. CO2 KPI cards use `lcaFactor`, while the email/PDF sections calculate annual CO2 using `biocharCarbonContent` in some places.
3. Cost KPI card shows electricity cost from gross consumption (`grossAnnualElectricityCost`), while NPV engine costs electricity on net purchase after self-generation.
4. `heatInvestment` input is defined but not added to NPV total investment.

These differences can produce materially different values between charts/KPI cards and financial core outputs.

## 11. Default values at initialization (for reproducibility)

- plantCapacity = 1000 kg/h
- fuelHeatValue = 4 kWh/kg
- operatingHours = 7000 h/a
- projectLifetime = 10 years
- discountRate = 6%
- electricalPower = 100 kW
- electricityConsumptionPrice = 0.25 EUR/kWh
- thermalEfficiency = 90%
- initialInvestment = 3,000,000 EUR
- feedstockCost = 50 EUR/t
- laborCost = 50,000 EUR/a
- maintenanceCost = 2.5% of initial investment (initially 75,000 EUR/a)
- biocharYield = 25%
- biocharCarbonContent = 80%
- biocharHeatingValue = 28 MJ/kg
- autothermalShare = 10%
- biocharPrice = 300 EUR/t
- lcaFactor = 2.4
- co2RemovalPrice = 100 EUR/tCO2
- heatYield = 40%
- heatPrice = 0.08 EUR/kWh
- electricityYield = 18%
- electricityPrice = 0.15 EUR/kWh
- electricityInvestment = 500,000 EUR
- usableResidualHeat = 50%
- bioOilYield = 20%
- bioOilPrice = 400 EUR/t
- bioOilHeatingValue = 22 MJ/kg
- bioOilInvestment = 1,000,000 EUR

## 12. Conclusion

The app contains a clear and mostly consistent economic core (`calculateNPV`) with dynamic UI components around it. For external financial validation, partner checks should primarily anchor on the NPV engine equations in Sections 5 to 7, and explicitly reconcile the formula differences listed in Section 10.
