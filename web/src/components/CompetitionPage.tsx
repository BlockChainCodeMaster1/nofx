import { useState } from 'react'
import { Trophy, Medal } from 'lucide-react'
import useSWR from 'swr'
import { api } from '../lib/api'
import type { CompetitionData } from '../types'
import { ComparisonChart } from './ComparisonChart'
import { TraderConfigViewModal } from './TraderConfigViewModal'
import { getTraderColor } from '../utils/traderColors'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../i18n/translations'

export function CompetitionPage() {
  const { language } = useLanguage()
  const [selectedTrader, setSelectedTrader] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: competition } = useSWR<CompetitionData>(
    'competition',
    api.getCompetition,
    {
      refreshInterval: 15000, // 15秒刷新（竞赛数据不需要太频繁更新）
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  )

  const handleTraderClick = async (traderId: string) => {
    try {
      const traderConfig = await api.getTraderConfig(traderId)
      setSelectedTrader(traderConfig)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Failed to fetch trader config:', error)
      // 对于未登录用户，不显示详细配置，这是正常行为
      // 竞赛页面主要用于查看排行榜和基本信息
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTrader(null)
  }

  if (!competition) {
    return (
      <div className="space-y-6">
        <div className="bg-darkmoon-surface border border-darkmoon-border rounded-xl p-8 animate-pulse shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-3 flex-1">
              <div className="h-8 w-64 bg-darkmoon-border rounded"></div>
              <div className="h-4 w-48 bg-darkmoon-border rounded"></div>
            </div>
            <div className="h-12 w-32 bg-darkmoon-border rounded"></div>
          </div>
        </div>
        <div className="bg-darkmoon-surface border border-darkmoon-border rounded-xl p-6 shadow-lg">
          <div className="h-6 w-40 mb-4 bg-darkmoon-border rounded"></div>
          <div className="space-y-3">
            <div className="h-20 w-full bg-darkmoon-border rounded"></div>
            <div className="h-20 w-full bg-darkmoon-border rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // 如果有数据返回但没有交易员，显示空状态
  if (!competition.traders || competition.traders.length === 0) {
    return (
      <div className="space-y-5 animate-fade-in">
        {/* Competition Header - 精简版 */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-darkmoon-gold to-[#FCD535] shadow-[0_4px_14px_rgba(240,185,11,0.4)]">
              <Trophy className="w-6 h-6 md:w-7 md:h-7 text-black" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-darkmoon-text-primary">
                {t('aiCompetition', language)}
                <span className="text-xs font-normal px-2 py-1 rounded bg-darkmoon-gold/15 text-darkmoon-gold">
                  0 {t('traders', language)}
                </span>
              </h1>
              <p className="text-xs text-darkmoon-text-secondary">
                {t('liveBattle', language)}
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-darkmoon-surface border border-darkmoon-border rounded-xl p-8 text-center shadow-lg">
          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-40 text-darkmoon-text-secondary" />
          <h3 className="text-lg font-bold mb-2 text-darkmoon-text-primary">
            {t('noTraders', language)}
          </h3>
          <p className="text-sm text-darkmoon-text-secondary">
            {t('createFirstTrader', language)}
          </p>
        </div>
      </div>
    )
  }

  // 按收益率排序
  const sortedTraders = [...competition.traders].sort(
    (a, b) => b.total_pnl_pct - a.total_pnl_pct
  )

  // 找出领先者
  const leader = sortedTraders[0]

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Competition Header - 精简版 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-darkmoon-gold to-[#FCD535] shadow-[0_4px_14px_rgba(240,185,11,0.4)]">
            <Trophy className="w-6 h-6 md:w-7 md:h-7 text-black" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-darkmoon-text-primary">
              {t('aiCompetition', language)}
              <span className="text-xs font-normal px-2 py-1 rounded bg-darkmoon-gold/15 text-darkmoon-gold">
                {competition.count} {t('traders', language)}
              </span>
            </h1>
            <p className="text-xs text-darkmoon-text-secondary">
              {t('liveBattle', language)}
            </p>
          </div>
        </div>
        <div className="text-left md:text-right w-full md:w-auto">
          <div className="text-xs mb-1 text-darkmoon-text-secondary">
            {t('leader', language)}
          </div>
          <div className="text-base md:text-lg font-bold text-darkmoon-gold">
            {leader?.trader_name}
          </div>
          <div
            className={`text-sm font-semibold ${
              (leader?.total_pnl ?? 0) >= 0 ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {(leader?.total_pnl ?? 0) >= 0 ? '+' : ''}
            {leader?.total_pnl_pct?.toFixed(2) || '0.00'}%
          </div>
        </div>
      </div>

      {/* Left/Right Split: Performance Chart + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Performance Comparison Chart */}
        <div className="bg-darkmoon-surface border border-darkmoon-border rounded-xl p-5 animate-slide-in shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-darkmoon-text-primary">
              {t('performanceComparison', language)}
            </h2>
            <div className="text-xs text-darkmoon-text-secondary">
              {t('realTimePnL', language)}
            </div>
          </div>
          <ComparisonChart traders={sortedTraders.slice(0, 5)} />
        </div>

        {/* Right: Leaderboard */}
        <div className="bg-darkmoon-surface border border-darkmoon-border rounded-xl p-5 animate-slide-in shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-darkmoon-text-primary">
              {t('leaderboard', language)}
            </h2>
            <div className="text-xs px-2 py-1 rounded bg-darkmoon-gold/10 text-darkmoon-gold border border-darkmoon-gold/20">
              {t('live', language)}
            </div>
          </div>
          <div className="space-y-2">
            {sortedTraders.map((trader, index) => {
              const isLeader = index === 0
              const traderColor = getTraderColor(
                sortedTraders,
                trader.trader_id
              )

              return (
                <div
                  key={trader.trader_id}
                  onClick={() => handleTraderClick(trader.trader_id)}
                  className={`rounded p-3 transition-all duration-300 hover:translate-y-[-1px] cursor-pointer hover:shadow-lg ${
                    isLeader
                      ? 'bg-gradient-to-br from-darkmoon-gold/10 to-darkmoon-surface border border-darkmoon-gold/40 shadow-[0_3px_15px_rgba(240,185,11,0.12),0_0_0_1px_rgba(240,185,11,0.15)]'
                      : 'bg-darkmoon-surface border border-darkmoon-border shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Rank & Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-6 flex items-center justify-center">
                        <Medal
                          className="w-5 h-5"
                          style={{
                            color:
                              index === 0
                                ? '#F0B90B'
                                : index === 1
                                  ? '#C0C0C0'
                                  : '#CD7F32',
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-darkmoon-text-primary">
                          {trader.trader_name}
                        </div>
                        <div
                          className="text-xs mono font-semibold"
                          style={{ color: traderColor }}
                        >
                          {trader.ai_model.toUpperCase()} +{' '}
                          {trader.exchange.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap md:flex-nowrap">
                      {/* Total Equity */}
                      <div className="text-right">
                        <div className="text-xs text-darkmoon-text-secondary">
                          {t('equity', language)}
                        </div>
                        <div className="text-xs md:text-sm font-bold mono text-darkmoon-text-primary">
                          {trader.total_equity?.toFixed(2) || '0.00'}
                        </div>
                      </div>

                      {/* P&L */}
                      <div className="text-right min-w-[70px] md:min-w-[90px]">
                        <div className="text-xs text-darkmoon-text-secondary">
                          {t('pnl', language)}
                        </div>
                        <div
                          className={`text-base md:text-lg font-bold mono ${
                            (trader.total_pnl ?? 0) >= 0
                              ? 'text-emerald-500'
                              : 'text-red-500'
                          }`}
                        >
                          {(trader.total_pnl ?? 0) >= 0 ? '+' : ''}
                          {trader.total_pnl_pct?.toFixed(2) || '0.00'}%
                        </div>
                        <div className="text-xs mono text-darkmoon-text-secondary">
                          {(trader.total_pnl ?? 0) >= 0 ? '+' : ''}
                          {trader.total_pnl?.toFixed(2) || '0.00'}
                        </div>
                      </div>

                      {/* Positions */}
                      <div className="text-right">
                        <div className="text-xs text-darkmoon-text-secondary">
                          {t('pos', language)}
                        </div>
                        <div className="text-xs md:text-sm font-bold mono text-darkmoon-text-primary">
                          {trader.position_count}
                        </div>
                        <div className="text-xs text-darkmoon-text-secondary">
                          {trader.margin_used_pct.toFixed(1)}%
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <div
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            trader.is_running
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {trader.is_running ? '●' : '○'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Head-to-Head Stats */}
      {competition.traders.length === 2 && (
        <div className="bg-darkmoon-surface border border-darkmoon-border rounded-xl p-5 animate-slide-in shadow-lg">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-darkmoon-text-primary">
            {t('headToHead', language)}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {sortedTraders.map((trader, index) => {
              const isWinning = index === 0
              const opponent = sortedTraders[1 - index]

              // Check if both values are valid numbers
              const hasValidData =
                trader.total_pnl_pct != null &&
                opponent.total_pnl_pct != null &&
                !isNaN(trader.total_pnl_pct) &&
                !isNaN(opponent.total_pnl_pct)

              const gap = hasValidData
                ? trader.total_pnl_pct - opponent.total_pnl_pct
                : NaN

              return (
                <div
                  key={trader.trader_id}
                  className={`p-4 rounded transition-all duration-300 hover:scale-[1.02] ${
                    isWinning
                      ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-2 border-emerald-500/30 shadow-[0_3px_15px_rgba(14,203,129,0.12)]'
                      : 'bg-darkmoon-surface border border-darkmoon-border shadow-sm'
                  }`}
                >
                  <div className="text-center">
                    <div
                      className="text-sm md:text-base font-bold mb-2"
                      style={{
                        color: getTraderColor(sortedTraders, trader.trader_id),
                      }}
                    >
                      {trader.trader_name}
                    </div>
                    <div
                      className={`text-lg md:text-2xl font-bold mono mb-1 ${
                        (trader.total_pnl ?? 0) >= 0
                          ? 'text-emerald-500'
                          : 'text-red-500'
                      }`}
                    >
                      {trader.total_pnl_pct != null &&
                      !isNaN(trader.total_pnl_pct)
                        ? `${trader.total_pnl_pct >= 0 ? '+' : ''}${trader.total_pnl_pct.toFixed(2)}%`
                        : '—'}
                    </div>
                    {hasValidData && isWinning && gap > 0 && (
                      <div className="text-xs font-semibold text-emerald-500">
                        {t('leadingBy', language, { gap: gap.toFixed(2) })}
                      </div>
                    )}
                    {hasValidData && !isWinning && gap < 0 && (
                      <div className="text-xs font-semibold text-red-500">
                        {t('behindBy', language, {
                          gap: Math.abs(gap).toFixed(2),
                        })}
                      </div>
                    )}
                    {!hasValidData && (
                      <div className="text-xs font-semibold text-darkmoon-text-secondary">
                        —
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Trader Config View Modal */}
      <TraderConfigViewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        traderData={selectedTrader}
      />
    </div>
  )
}
