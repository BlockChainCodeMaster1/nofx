import { AlertTriangle } from 'lucide-react'
import { t, type Language } from '../../../i18n/translations'

interface SignalSourceWarningProps {
  language: Language
  onConfigure: () => void
}

export function SignalSourceWarning({
  language,
  onConfigure,
}: SignalSourceWarningProps) {
  return (
    <div className="rounded-xl px-4 py-3 flex items-start gap-3 animate-slide-in bg-red-500/10 border border-red-500/20 text-red-500 mb-4">
      <AlertTriangle
        size={20}
        className="flex-shrink-0 mt-0.5"
      />
      <div className="flex-1">
        <div className="font-semibold mb-1">
          ⚠️ {t('signalSourceNotConfigured', language)}
        </div>
        <div className="text-sm text-red-400/80">
          <p className="mb-2">{t('signalSourceWarningMessage', language)}</p>
          <p className="text-red-400 font-medium">
            <strong>{t('solutions', language)}</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
            <li>点击"{t('signalSource', language)}"按钮配置API地址</li>
            <li>或在交易员配置中禁用"使用币种池"和"使用OI Top"</li>
            <li>或在交易员配置中设置自定义币种列表</li>
          </ul>
        </div>
        <button
          onClick={onConfigure}
          className="mt-3 px-3 py-1.5 rounded text-sm font-semibold transition-all hover:scale-105 bg-red-500 text-white shadow-lg shadow-red-500/20"
        >
          {t('configureSignalSourceNow', language)}
        </button>
      </div>
    </div>
  )
}
