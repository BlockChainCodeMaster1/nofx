import { Bot, BarChart3, Trash2, Pencil } from 'lucide-react'
import { t, type Language } from '../../../i18n/translations'
import { getModelDisplayName } from '../utils'
import type { TraderInfo } from '../../../types'

interface TradersGridProps {
  language: Language
  traders: TraderInfo[] | undefined
  onTraderSelect: (traderId: string) => void
  onEditTrader: (traderId: string) => void
  onDeleteTrader: (traderId: string) => void
  onToggleTrader: (traderId: string, running: boolean) => void
}

export function TradersGrid({
  language,
  traders,
  onTraderSelect,
  onEditTrader,
  onDeleteTrader,
  onToggleTrader,
}: TradersGridProps) {
  if (!traders || traders.length === 0) {
    return (
      <div className="text-center py-16 text-darkmoon-text-muted bg-darkmoon-surface/30 border border-dashed border-darkmoon-border rounded-xl">
        <Bot className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <div className="text-lg font-semibold mb-2">
          {t('noTraders', language)}
        </div>
        <div className="text-sm">
          {t('createFirstTrader', language)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {traders.map((trader) => (
        <div
          key={trader.trader_id}
          className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl transition-all hover:translate-y-[-2px] gap-4 bg-darkmoon-surface border border-darkmoon-border hover:border-darkmoon-gold/30 hover:shadow-glow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-darkmoon-gold to-[#F3CF55] shadow-lg shadow-darkmoon-gold/10">
              <Bot className="w-6 h-6 text-black" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-lg text-darkmoon-text-primary truncate">
                {trader.trader_name}
              </div>
              <div className="text-sm text-darkmoon-text-secondary flex items-center gap-2">
                <span className={trader.ai_model.includes('deepseek') ? 'text-blue-400' : 'text-violet-400'}>
                    {getModelDisplayName(
                    trader.ai_model.split('_').pop() || trader.ai_model
                    )}
                </span>
                <span className="text-darkmoon-border">•</span>
                <span>{trader.exchange_id?.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
            {/* Status */}
            <div className="text-center min-w-[80px]">
              <div
                className={`px-3 py-1 rounded text-xs font-bold ${
                  trader.is_running
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}
              >
                {trader.is_running
                  ? t('running', language)
                  : t('stopped', language)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 overflow-x-auto items-center pb-1 md:pb-0">
              <button
                onClick={() => onTraderSelect(trader.trader_id)}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
              >
                <BarChart3 className="w-4 h-4" />
                {t('view', language)}
              </button>

              <button
                onClick={() => onEditTrader(trader.trader_id)}
                disabled={trader.is_running}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap ${
                    trader.is_running
                    ? 'bg-darkmoon-bg text-darkmoon-text-muted cursor-not-allowed'
                    : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                }`}
              >
                <Pencil className="w-4 h-4" />
                {t('edit', language)}
              </button>

              <button
                onClick={() =>
                  onToggleTrader(trader.trader_id, trader.is_running || false)
                }
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 whitespace-nowrap ${
                    trader.is_running
                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                    : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                }`}
              >
                {trader.is_running ? t('stop', language) : t('start', language)}
              </button>

              <button
                onClick={() => onDeleteTrader(trader.trader_id)}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 bg-red-500/10 text-red-500 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
