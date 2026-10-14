import { Language, Translations } from '../i18n';
import { PyrolysisInputs, PyrolysisModel, PyrolysisProducts } from '../calc/pyrolysisModel';

// Props shared by the calculator sections (process flow, Sankey, results)
export interface SectionProps {
  language: Language;
  t: Translations;
  inputs: PyrolysisInputs;
  products: PyrolysisProducts;
  model: PyrolysisModel;
  formatNumber: (num: number, decimals?: number) => string;
  expandedInfo: { [key: string]: boolean };
  toggleInfo: (key: string) => void;
  handleInputChange: (field: keyof PyrolysisInputs, value: string) => void;
}
