import { Landmark } from 'lucide-react'
import { t, type Language } from '../../../i18n/translations'
import { getExchangeIcon } from '../../ExchangeIcons'
import { getShortName } from '../utils'
import type { Exchange } from '../../../types'

interface ExchangesSectionProps {
  language: Language
  configuredExchanges: Exchange[]
  isExchangeInUse: (exchangeId: string) => boolean
  onExchangeClick: (exchangeId: string) => void
}

export function ExchangesSection({
  language,
  configuredExchanges,
  isExchangeInUse,
  onExchangeClick,
}: ExchangesSectionProps) {
  return (
    <div className="bg-darkmoon-surface border border-darkmoon-border rounded-xl p-4 md:p-6 h-full">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-darkmoon-text-primary">
        <Landmark className="w-5 h-5 text-darkmoon-gold" />
        {t('exchanges', language)}
      </h3>
      <div className="space-y-3">
        {configuredExchanges.map((exchange) => {
          const inUse = isExchangeInUse(exchange.id)
          return (
            <div
              key={exchange.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all border ${
                inUse
                  ? 'cursor-not-allowed opacity-70 bg-darkmoon-surface border-darkmoon-border'
                  : 'cursor-pointer hover:bg-darkmoon-surface-hover border-darkmoon-border hover:border-darkmoon-gold/30'
              }`}
              onClick={() => onExchangeClick(exchange.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-white rounded-lg p-1">
                  {getExchangeIcon(exchange.id, { width: 24, height: 24 })}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-darkmoon-text-primary truncate">
                    {getShortName(exchange.name)}
                  </div>
                  <div className="text-xs text-darkmoon-text-secondary">
                    {exchange.type.toUpperCase()} •{' '}
                    {inUse
                      ? t('inUse', language)
                      : exchange.enabled
                        ? t('enabled', language)
                        : t('configured', language)}
                  </div>
                </div>
              </div>
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${exchange.enabled ? 'bg-green-500 shadow-[0_0_5px_#10B981]' : 'bg-gray-500'}`}
              />
            </div>
          )
        })}
        {configuredExchanges.length === 0 && (
          <div className="text-center py-8 text-darkmoon-text-muted">
            <Landmark className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <div className="text-sm">
              {t('noExchangesConfigured', language)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
