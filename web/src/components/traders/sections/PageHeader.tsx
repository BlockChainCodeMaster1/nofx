import { Bot, Plus, Radio } from 'lucide-react'
import { t, type Language } from '../../../i18n/translations'

interface PageHeaderProps {
  language: Language
  tradersCount: number
  configuredModelsCount: number
  configuredExchangesCount: number
  onAddModel: () => void
  onAddExchange: () => void
  onConfigureSignalSource: () => void
  onCreateTrader: () => void
}

export function PageHeader({
  language,
  tradersCount,
  configuredModelsCount,
  configuredExchangesCount,
  onAddModel,
  onAddExchange,
  onConfigureSignalSource,
  onCreateTrader,
}: PageHeaderProps) {
  const canCreateTrader =
    configuredModelsCount > 0 && configuredExchangesCount > 0

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-darkmoon-gold to-[#F3CF55] shadow-lg shadow-darkmoon-gold/20">
          <Bot className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-darkmoon-text-primary">
            {t('aiTraders', language)}
            <span className="text-xs font-normal px-2 py-1 rounded bg-darkmoon-gold/10 text-darkmoon-gold border border-darkmoon-gold/20">
              {tradersCount} {t('active', language)}
            </span>
          </h1>
          <p className="text-xs text-darkmoon-text-secondary mt-1">
            {t('manageAITraders', language)}
          </p>
        </div>
      </div>

      <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <button
          onClick={onAddModel}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap bg-darkmoon-surface border border-darkmoon-border text-darkmoon-text-primary hover:border-darkmoon-gold hover:text-darkmoon-gold"
        >
          <Plus className="w-4 h-4" />
          {t('aiModels', language)}
        </button>

        <button
          onClick={onAddExchange}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap bg-darkmoon-surface border border-darkmoon-border text-darkmoon-text-primary hover:border-darkmoon-gold hover:text-darkmoon-gold"
        >
          <Plus className="w-4 h-4" />
          {t('exchanges', language)}
        </button>

        <button
          onClick={onConfigureSignalSource}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap bg-darkmoon-surface border border-darkmoon-border text-darkmoon-text-primary hover:border-darkmoon-gold hover:text-darkmoon-gold"
        >
          <Radio className="w-4 h-4" />
          {t('signalSource', language)}
        </button>

        <button
          onClick={onCreateTrader}
          disabled={!canCreateTrader}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap shadow-lg ${
            canCreateTrader 
                ? 'bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black hover:shadow-darkmoon-gold/30' 
                : 'bg-darkmoon-surface border border-darkmoon-border text-darkmoon-text-muted cursor-not-allowed opacity-50'
          }`}
        >
          <Plus className="w-4 h-4" />
          {t('createTrader', language)}
        </button>
      </div>
    </div>
  )
}
