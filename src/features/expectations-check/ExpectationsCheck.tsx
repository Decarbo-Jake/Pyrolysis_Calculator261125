import { useState } from 'react';
import { AlertTriangle, ChevronDown, Check, ExternalLink } from 'lucide-react';
import { expectationsCheckContent, questionSettings } from './content';
import { Language, Translations } from '../../i18n';
import { PyrolysisInputs } from '../../calc/pyrolysisModel';

interface ExpectationsCheckProps {
  language: Language;
  t: Translations;
  inputs: PyrolysisInputs;
  clarified: number[];
  onToggleClarified: (index: number) => void;
  onRequest: () => void;
}

// Label key in the translations and unit for each linked calculator setting
const settingDisplay: Partial<Record<keyof PyrolysisInputs, { labelKey: string; unit: { de: string; en: string }; decimals?: number }>> = {
  feedstockCost: { labelKey: 'feedstockCost', unit: { de: '€/t', en: '€/t' } },
  biocharPrice: { labelKey: 'biocharPrice', unit: { de: '€/t', en: '€/t' } },
  heatYield: { labelKey: 'heatSoldPercentage', unit: { de: '%', en: '%' } },
  operatingHours: { labelKey: 'operatingHours', unit: { de: 'h/a', en: 'h/yr' } },
  certificateFeeRate: { labelKey: 'certificateFeeRate', unit: { de: '%', en: '%' } },
  lcaFactor: { labelKey: 'lcaFactor', unit: { de: 't CO₂/t', en: 't CO₂/t' }, decimals: 1 },
  biocharYield: { labelKey: 'biocharYield', unit: { de: '%', en: '%' } },
  plantCapacity: { labelKey: 'plantCapacity', unit: { de: 'kg/h', en: 'kg/h' } }
};

const HIGHLIGHT = ['ring-4', 'ring-orange-400', 'ring-offset-2', 'ring-offset-gray-800', 'rounded-lg'];

const ExpectationsCheck = ({ language, t, inputs, clarified, onToggleClarified, onRequest }: ExpectationsCheckProps) => {
  const c = expectationsCheckContent[language];
  const [hiddenNotice, setHiddenNotice] = useState<number | null>(null);
  const total = c.questions.length;
  const openCount = total - clarified.length;

  const goToSetting = (index: number, field: keyof PyrolysisInputs) => {
    const input = document.querySelector<HTMLInputElement>(`[data-setting="${field}"]`);
    if (!input) {
      setHiddenNotice(index);
      return;
    }
    setHiddenNotice(null);
    const block = input.parentElement ?? input;
    block.scrollIntoView({ behavior: 'smooth', block: 'center' });
    block.classList.add(...HIGHLIGHT);
    input.focus({ preventScroll: true });
    window.setTimeout(() => block.classList.remove(...HIGHLIGHT), 2500);
  };

  const number = (value: number, decimals = 0) =>
    value.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return (
    <div id="expectations-check" className="mt-6 bg-gradient-to-r from-orange-900/10 to-gray-800 p-6 rounded-lg border border-orange-500/30 scroll-mt-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1">{c.eyebrow}</p>
      <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
        <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-orange-600 rounded flex-shrink-0"></div>
        {c.title}
      </h3>
      <p className="text-gray-400 text-sm mb-5 max-w-3xl">{c.intro}</p>

      {/* Progress */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3">
        <span className="text-sm text-gray-300 tabular-nums">
          {c.progress.replace('{n}', String(clarified.length)).replace('{total}', String(total))}
        </span>
        <div className="flex gap-1" aria-hidden="true">
          {c.questions.map((_, i) => (
            <div key={i} className={`w-5 h-1.5 rounded-full ${clarified.includes(i) ? 'bg-green-500' : 'bg-gray-700'}`} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {c.questions.map((item, i) => {
          const isDone = clarified.includes(i);
          const field = questionSettings[i];
          const display = field ? settingDisplay[field] : undefined;
          return (
            <details
              key={i}
              className={`group bg-gray-900/50 border rounded-lg p-4 transition-colors ${isDone ? 'border-green-500/40' : 'border-gray-700 open:border-orange-500/40'} ${i === total - 1 && total % 2 === 1 ? 'md:col-span-2' : ''}`}
            >
              <summary className="cursor-pointer list-none flex items-start gap-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center ${isDone ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  {isDone ? <Check className="w-4 h-4" /> : i + 1}
                </span>
                <span className="flex-1">
                  <span className="block text-xs uppercase tracking-wide text-orange-400 mb-1">{item.topic}</span>
                  <span className="text-white font-medium">{item.question}</span>
                </span>
                <ChevronDown className="flex-shrink-0 w-5 h-5 text-gray-400 mt-1 transition-transform group-open:rotate-180" />
              </summary>

              <div className="mt-4 md:ml-10 space-y-3 text-sm leading-relaxed">
                <div>
                  <p className="flex items-center gap-2 font-semibold text-orange-300 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    {c.struggleLabel}
                  </p>
                  <p className="text-gray-300">{item.struggle}</p>
                </div>
                <div>
                  <p className="font-semibold text-green-400 mb-1">{c.evidenceLabel}</p>
                  <p className="text-gray-300">{item.evidence}</p>
                  {item.links && (
                    <p className="text-gray-400 mt-2">
                      {item.links.label}:{' '}
                      {item.links.items.map((link, j) => (
                        <span key={link.url}>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-blue-300 hover:text-blue-200 underline underline-offset-2">
                            {link.label}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {j < item.links!.items.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                      {' '}{item.links.more}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    aria-pressed={isDone}
                    onClick={() => onToggleClarified(i)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${isDone ? 'bg-green-800 border-green-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'}`}
                  >
                    {isDone ? '✓ ' : ''}{c.clarified}
                  </button>
                  {field && display && (
                    <>
                      <button
                        type="button"
                        onClick={() => goToSetting(i, field)}
                        className="px-3 py-1.5 rounded-md text-sm border border-blue-700 text-blue-300 hover:bg-blue-900/30 transition-colors"
                      >
                        {c.checkSetting}
                      </button>
                      <span className="text-xs text-gray-400">
                        {c.relatedSetting}: <span className="text-gray-200 tabular-nums">{(t as Record<string, string>)[display.labelKey]} · {number(inputs[field], display.decimals)} {display.unit[language]}</span>
                      </span>
                    </>
                  )}
                </div>
                {hiddenNotice === i && <p className="text-xs text-orange-300">{c.settingHidden}</p>}
              </div>
            </details>
          );
        })}
      </div>

      {/* Call to action: open points go along with the contact request */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-900/20 to-gray-800 border border-blue-500/30 rounded-lg px-5 py-4">
        <p className="text-sm text-gray-300 max-w-3xl">
          {openCount > 0 ? (
            <>
              <span className="font-semibold text-white">{openCount === 1 ? c.ctaOpenOne : c.ctaOpenMany.replace('{n}', String(openCount))}</span>{' '}
              {c.ctaOffer}
            </>
          ) : (
            <span className="font-semibold text-white">{c.ctaDone}</span>
          )}
        </p>
        <button
          type="button"
          onClick={onRequest}
          className="px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 border border-green-500 text-white text-sm font-semibold transition-colors"
        >
          {openCount > 0 ? c.ctaButton : c.ctaButtonDone}
        </button>
      </div>
    </div>
  );
};

export default ExpectationsCheck;
