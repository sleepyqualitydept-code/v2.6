import React from 'react';
import { 
  ShieldCheck, AlertTriangle, XCircle, CheckCircle2, 
  FileCheck, ArrowRight, ShieldAlert, Sparkles, Scale
} from 'lucide-react';
import { EngineeringComplianceReport, DomainCompliance } from '../../../services/engineeringComplianceEngine';

interface Props {
  compliance: EngineeringComplianceReport;
}

export const EngineeringCompliancePanel: React.FC<Props> = ({ compliance }) => {
  const getStatusBadge = (status: 'PASS' | 'WARNING' | 'FAIL') => {
    switch (status) {
      case 'PASS':
        return {
          icon: <CheckCircle2 size={16} className="text-emerald-500" />,
          label: 'اجتياز تام (PASS)',
          className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
        };
      case 'WARNING':
        return {
          icon: <AlertTriangle size={16} className="text-amber-500" />,
          label: 'تنبيه جودة (WARNING)',
          className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
        };
      case 'FAIL':
        return {
          icon: <XCircle size={16} className="text-rose-500" />,
          label: 'مرفوض هندسياً (FAIL)',
          className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-surface border border-border-main p-6 rounded-3xl shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-lg flex items-center gap-1.5 border border-blue-200 dark:border-blue-800">
              <ShieldCheck size={14} />
              Industrial Engineering Compliance Engine
            </span>
            <span className={`px-3 py-1 text-xs font-black rounded-lg border flex items-center gap-1.5 ${getStatusBadge(compliance.overallStatus).className}`}>
              {getStatusBadge(compliance.overallStatus).icon}
              الحالة الكلية: {getStatusBadge(compliance.overallStatus).label}
            </span>
          </div>
          <h3 className="text-lg font-black text-text-main mt-2">
            سجل الامتثال والمطابقة للمواصفات القياسية السعودية (SASO / ISO)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            تدقيق آلي شامل عبر 5 نطاقات تشغيلية للتحقق من سلامة التصميم، ضمان الجودة، والجاهزية اللوجستية قبل الإطلاق.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 px-5 py-3 rounded-2xl border border-border-main shrink-0">
          <div className="text-center">
            <div className="text-[11px] text-slate-400 font-bold">معدل الامتثال العام</div>
            <div className="text-3xl font-black text-text-main font-mono mt-0.5">
              {compliance.overallScore}%
            </div>
          </div>
        </div>
      </div>

      {/* 5 Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {compliance.domains.map(domain => {
          const badge = getStatusBadge(domain.status);
          return (
            <div 
              key={domain.domainKey}
              className="bg-surface border border-border-main p-5 rounded-2xl shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-text-main">
                    {domain.domainNameAr}
                  </h4>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {domain.domainNameEn}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 shrink-0 ${badge.className}`}>
                  {badge.icon}
                  {badge.label}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-medium">
                {domain.summaryAr}
              </div>

              {domain.detailsAr.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-400">البنود المدققة:</div>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    {domain.detailsAr.map((d, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
