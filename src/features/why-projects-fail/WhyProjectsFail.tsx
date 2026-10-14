import { AlertTriangle, ChevronDown } from 'lucide-react';
import { whyProjectsFailContent, Language } from './questions';

interface WhyProjectsFailProps {
  language: Language;
}

const WhyProjectsFail = ({ language }: WhyProjectsFailProps) => {
  const c = whyProjectsFailContent[language];

  return (
    <div id="why-projects-fail" className="mt-8 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-6">
      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded"></div>
        {c.title}
      </h2>
      <p className="text-gray-400 text-sm mb-6 max-w-3xl">{c.intro}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {c.questions.map((item, i) => (
          <details key={i} className="group bg-gray-900/50 border border-gray-700 rounded-lg p-4 open:border-orange-500/40 transition-colors">
            <summary className="cursor-pointer list-none flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <span className="flex-1">
                <span className="block text-xs uppercase tracking-wide text-orange-400 mb-1">{item.topic}</span>
                <span className="text-white font-medium">{item.question}</span>
              </span>
              <ChevronDown className="flex-shrink-0 w-5 h-5 text-gray-400 mt-1 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-4 ml-10 space-y-3 text-sm leading-relaxed">
              <div>
                <p className="flex items-center gap-2 font-semibold text-orange-300 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  {c.whyItFailsLabel}
                </p>
                <p className="text-gray-300">{item.whyItFails}</p>
              </div>
              <div>
                <p className="font-semibold text-green-400 mb-1">{c.evidenceLabel}</p>
                <p className="text-gray-300">{item.evidence}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default WhyProjectsFail;
