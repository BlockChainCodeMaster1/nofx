import useSWR from 'swr'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../i18n/translations'
import { stripLeadingIcons } from '../lib/text'
import { api } from '../lib/api'
import {
  Brain,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Coins,
  Trophy,
  ScrollText,
  Lightbulb,
} from 'lucide-react'

interface TradeOutcome {
  symbol: string
  side: string
  quantity: number
  leverage: number
  open_price: number
  close_price: number
  position_value: number
  margin_used: number
  pn_l: number
  pn_l_pct: number
  duration: string
  open_time: string
  close_time: string
  was_stop_loss: boolean
}

interface SymbolPerformance {
  symbol: string
  total_trades: number
  winning_trades: number
  losing_trades: number
  win_rate: number
  total_pn_l: number
  avg_pn_l: number
}

interface PerformanceAnalysis {
  total_trades: number
  winning_trades: number
  losing_trades: number
  win_rate: number
  avg_win: number
  avg_loss: number
  profit_factor: number
  sharpe_ratio: number
  recent_trades: TradeOutcome[]
  symbol_stats: { [key: string]: SymbolPerformance }
  best_symbol: string
  worst_symbol: string
}

interface AILearningProps {
  traderId: string
}

export default function AILearning({ traderId }: AILearningProps) {
  const { language } = useLanguage()
  const { data: performance, error } = useSWR<PerformanceAnalysis>(
    traderId ? `performance-${traderId}` : 'performance',
    () => api.getPerformance(traderId),
    {
      refreshInterval: 30000, // 30秒刷新（AI学习分析数据更新频率较低）
      revalidateOnFocus: false,
      dedupingInterval: 20000,
    }
  )

  if (error) {
    return (
      <div className="rounded p-6 bg-darkmoon-surface border border-darkmoon-border">
        <div className="text-red-500">
          {stripLeadingIcons(t('loadingError', language))}
        </div>
      </div>
    )
  }

  if (!performance) {
    return (
      <div className="rounded p-6 bg-darkmoon-surface border border-darkmoon-border">
        <div className="flex items-center gap-2 text-darkmoon-text-secondary">
          <BarChart3 className="w-4 h-4" /> {t('loading', language)}
        </div>
      </div>
    )
  }

  if (!performance || performance.total_trades === 0) {
    return (
      <div className="rounded p-6 bg-darkmoon-surface border border-darkmoon-border">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-violet-500" />
          <h2 className="text-lg font-bold text-darkmoon-text-primary">
            {t('aiLearning', language)}
          </h2>
        </div>
        <div className="text-darkmoon-text-secondary">
          {t('noCompleteData', language)}
        </div>
      </div>
    )
  }

  const symbolStats = performance.symbol_stats || {}
  const symbolStatsList = Object.values(symbolStats)
    .filter((stat) => stat != null)
    .sort((a, b) => (b.total_pn_l || 0) - (a.total_pn_l || 0))

  return (
    <div className="space-y-8">
      {/* 标题区 - 优化设计 */}
      <div className="relative rounded-2xl p-6 overflow-hidden bg-gradient-to-br from-violet-500/15 via-indigo-500/10 to-darkmoon-surface/80 border border-violet-500/30 shadow-[0_8px_32px_rgba(139,92,246,0.2)]">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-[60px] bg-[radial-gradient(circle,_#8B5CF6_0%,_transparent_70%)]" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] shadow-[0_8px_24px_rgba(139,92,246,0.5)] border-2 border-white/10">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-1 text-darkmoon-text-primary drop-shadow-[0_2px_8px_rgba(139,92,246,0.3)]">
              {t('aiLearning', language)}
            </h2>
            <p className="text-base text-violet-300">
              {t('tradesAnalyzed', language, {
                count: performance.total_trades,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* 核心指标卡片 - 4列网格 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 总交易数 */}
        <div className="rounded-2xl p-5 relative overflow-hidden group hover:scale-105 transition-transform bg-gradient-to-br from-indigo-500/20 to-darkmoon-surface/80 border border-indigo-500/30 shadow-[0_4px_16px_rgba(99,102,241,0.2)]">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 blur-[20px] bg-[radial-gradient(circle,_#6366F1_0%,_transparent_70%)]" />
          <div className="relative">
            <div className="text-xs font-semibold mb-3 uppercase tracking-wider text-indigo-300">
              {t('totalTrades', language)}
            </div>
            <div className="text-4xl font-bold mono mb-1 text-indigo-100">
              {performance.total_trades}
            </div>
            <div className="text-xs flex items-center gap-1 text-indigo-500">
              <BarChart3 className="w-3 h-3" /> Trades
            </div>
          </div>
        </div>

        {/* 胜率 */}
        <div
          className={`rounded-2xl p-5 relative overflow-hidden group hover:scale-105 transition-transform ${
            (performance.win_rate || 0) >= 50
              ? 'bg-gradient-to-br from-emerald-500/20 to-darkmoon-surface/80 border-emerald-500/40 shadow-[0_4px_16px_rgba(16,185,129,0.2)]'
              : 'bg-gradient-to-br from-red-500/20 to-darkmoon-surface/80 border-red-500/40 shadow-[0_4px_16px_rgba(248,113,113,0.2)]'
          } border`}
        >
          <div
            className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 blur-[20px] ${
              (performance.win_rate || 0) >= 50
                ? 'bg-[radial-gradient(circle,_#10B981_0%,_transparent_70%)]'
                : 'bg-[radial-gradient(circle,_#F87171_0%,_transparent_70%)]'
            }`}
          />
          <div className="relative">
            <div
              className={`text-xs font-semibold mb-3 uppercase tracking-wider ${
                (performance.win_rate || 0) >= 50
                  ? 'text-emerald-300'
                  : 'text-red-300'
              }`}
            >
              {t('winRate', language)}
            </div>
            <div
              className={`text-4xl font-bold mono mb-1 ${
                (performance.win_rate || 0) >= 50
                  ? 'text-emerald-500'
                  : 'text-red-500'
              }`}
            >
              {(performance.win_rate || 0).toFixed(1)}%
            </div>
            <div className="text-xs text-darkmoon-text-secondary">
              {performance.winning_trades || 0}W /{' '}
              {performance.losing_trades || 0}L
            </div>
          </div>
        </div>

        {/* 平均盈利 */}
        <div className="rounded-2xl p-5 relative overflow-hidden group hover:scale-105 transition-transform bg-gradient-to-br from-green-500/20 to-darkmoon-surface/80 border border-green-500/30 shadow-[0_4px_16px_rgba(14,203,129,0.2)]">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 blur-[20px] bg-[radial-gradient(circle,_#0ECB81_0%,_transparent_70%)]" />
          <div className="relative">
            <div className="text-xs font-semibold mb-3 uppercase tracking-wider text-green-300">
              {t('avgWin', language)}
            </div>
            <div className="text-4xl font-bold mono mb-1 text-emerald-500">
              +{(performance.avg_win || 0).toFixed(2)}
            </div>
            <div className="text-xs flex items-center gap-1 text-emerald-300">
              <TrendingUp className="w-3 h-3" /> USDT Average
            </div>
          </div>
        </div>

        {/* 平均亏损 */}
        <div className="rounded-2xl p-5 relative overflow-hidden group hover:scale-105 transition-transform bg-gradient-to-br from-red-500/20 to-darkmoon-surface/80 border border-red-500/30 shadow-[0_4px_16px_rgba(246,70,93,0.2)]">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 blur-[20px] bg-[radial-gradient(circle,_#F6465D_0%,_transparent_70%)]" />
          <div className="relative">
            <div className="text-xs font-semibold mb-3 uppercase tracking-wider text-red-300">
              {t('avgLoss', language)}
            </div>
            <div className="text-4xl font-bold mono mb-1 text-red-500">
              {(performance.avg_loss || 0).toFixed(2)}
            </div>
            <div className="text-xs flex items-center gap-1 text-red-300">
              <TrendingDown className="w-3 h-3" /> USDT Average
            </div>
          </div>
        </div>
      </div>

      {/* 关键指标：夏普比率 & 盈亏比 - 2列网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 夏普比率 */}
        <div className="rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-violet-500/25 via-indigo-500/15 to-darkmoon-surface/90 border-2 border-violet-500/50 shadow-[0_12px_40px_rgba(139,92,246,0.3)]">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-[40px] bg-[radial-gradient(circle,_#8B5CF6_0%,_transparent_70%)]" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-violet-500/30 border border-violet-500/50">
                <Sparkles className="w-6 h-6 text-violet-300" />
              </div>
              <div>
                <div className="text-lg font-bold text-violet-200">
                  夏普比率
                </div>
                <div className="text-xs text-darkmoon-text-secondary">
                  风险调整后收益 · AI自我进化指标
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between mb-4">
              <div
                className={`text-6xl font-bold mono drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${
                  (performance.sharpe_ratio || 0) >= 2
                    ? 'text-emerald-500'
                    : (performance.sharpe_ratio || 0) >= 1
                      ? 'text-cyan-400'
                      : (performance.sharpe_ratio || 0) >= 0
                        ? 'text-darkmoon-gold'
                        : 'text-red-400'
                }`}
              >
                {performance.sharpe_ratio
                  ? performance.sharpe_ratio.toFixed(2)
                  : 'N/A'}
              </div>

              {performance.sharpe_ratio !== undefined && (
                <div className="text-right mb-2">
                  <div
                    className={`text-sm font-bold px-3 py-1 rounded-lg ${
                      (performance.sharpe_ratio || 0) >= 2
                        ? 'text-emerald-500 bg-emerald-500/20'
                        : (performance.sharpe_ratio || 0) >= 1
                          ? 'text-cyan-400 bg-cyan-400/20'
                          : (performance.sharpe_ratio || 0) >= 0
                            ? 'text-darkmoon-gold bg-darkmoon-gold/20'
                            : 'text-red-400 bg-red-400/20'
                    }`}
                  >
                    {performance.sharpe_ratio >= 2
                      ? '🟢 卓越表现'
                      : performance.sharpe_ratio >= 1
                        ? '🟢 良好表现'
                        : performance.sharpe_ratio >= 0
                          ? '🟡 波动较大'
                          : '🔴 需要调整'}
                  </div>
                </div>
              )}
            </div>

            {performance.sharpe_ratio !== undefined && (
              <div className="rounded-xl p-4 bg-black/40 border border-violet-500/30">
                <div className="text-sm leading-relaxed text-violet-100">
                  {performance.sharpe_ratio >= 2 &&
                    '✨ AI策略非常有效！风险调整后收益优异，可适度扩大仓位但保持纪律。'}
                  {performance.sharpe_ratio >= 1 &&
                    performance.sharpe_ratio < 2 &&
                    '✅ 策略表现稳健，风险收益平衡良好，继续保持当前策略。'}
                  {performance.sharpe_ratio >= 0 &&
                    performance.sharpe_ratio < 1 &&
                    '⚠️ 收益为正但波动较大，AI正在优化策略，降低风险。'}
                  {performance.sharpe_ratio < 0 &&
                    '🚨 当前策略需要调整！AI已自动进入保守模式，减少仓位和交易频率。'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 盈亏比 */}
        <div className="rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-darkmoon-gold/25 via-[#FCD535]/15 to-darkmoon-surface/90 border-2 border-darkmoon-gold/50 shadow-[0_12px_40px_rgba(240,185,11,0.3)]">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-[40px] bg-[radial-gradient(circle,_#F0B90B_0%,_transparent_70%)]" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-darkmoon-gold/30 border border-darkmoon-gold/50">
                <Coins className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-300">
                  {t('profitFactor', language)}
                </div>
                <div className="text-xs text-darkmoon-text-secondary">
                  {t('avgWinDivLoss', language)}
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between mb-4">
              <div
                className={`text-6xl font-bold mono drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${
                  (performance.profit_factor || 0) >= 2.0
                    ? 'text-emerald-500'
                    : (performance.profit_factor || 0) >= 1.5
                      ? 'text-darkmoon-gold'
                      : (performance.profit_factor || 0) >= 1.0
                        ? 'text-orange-400'
                        : 'text-red-400'
                }`}
              >
                {(performance.profit_factor || 0) > 0
                  ? (performance.profit_factor || 0).toFixed(2)
                  : 'N/A'}
              </div>

              <div className="text-right mb-2">
                <div
                  className={`text-sm font-bold px-3 py-1 rounded-lg ${
                    (performance.profit_factor || 0) >= 2.0
                      ? 'text-emerald-500 bg-emerald-500/20'
                      : (performance.profit_factor || 0) >= 1.5
                        ? 'text-darkmoon-gold bg-darkmoon-gold/20'
                        : 'text-slate-400 bg-slate-400/20'
                  }`}
                >
                  {(performance.profit_factor || 0) >= 2.0 &&
                    t('excellent', language)}
                  {(performance.profit_factor || 0) >= 1.5 &&
                    (performance.profit_factor || 0) < 2.0 &&
                    t('good', language)}
                  {(performance.profit_factor || 0) >= 1.0 &&
                    (performance.profit_factor || 0) < 1.5 &&
                    t('fair', language)}
                  {(performance.profit_factor || 0) > 0 &&
                    (performance.profit_factor || 0) < 1.0 &&
                    t('poor', language)}
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4 bg-black/40 border border-darkmoon-gold/30">
              <div className="text-sm leading-relaxed text-yellow-100">
                {(performance.profit_factor || 0) >= 2.0 &&
                  '🔥 盈利能力出色！每亏1元能赚' +
                    (performance.profit_factor || 0).toFixed(1) +
                    '元，AI策略表现优异。'}
                {(performance.profit_factor || 0) >= 1.5 &&
                  (performance.profit_factor || 0) < 2.0 &&
                  '✓ 策略稳定盈利，盈亏比健康，继续保持纪律性交易。'}
                {(performance.profit_factor || 0) >= 1.0 &&
                  (performance.profit_factor || 0) < 1.5 &&
                  '⚠️ 策略略有盈利但需优化，AI正在调整仓位和止损策略。'}
                {(performance.profit_factor || 0) > 0 &&
                  (performance.profit_factor || 0) < 1.0 &&
                  '❌ 平均亏损大于盈利，需要调整策略或降低交易频率。'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 最佳/最差币种 - 独立行 */}
      {(performance.best_symbol || performance.worst_symbol) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {performance.best_symbol && (
            <div className="rounded-2xl p-6 backdrop-blur-sm bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/30 shadow-[0_4px_16px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-6 h-6 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-300">
                  {t('bestPerformer', language)}
                </span>
              </div>
              <div className="text-3xl font-bold mono mb-1 text-emerald-500">
                {performance.best_symbol}
              </div>
              {symbolStats[performance.best_symbol] && (
                <div className="text-lg font-semibold text-emerald-300">
                  {symbolStats[performance.best_symbol].total_pn_l > 0
                    ? '+'
                    : ''}
                  {symbolStats[performance.best_symbol].total_pn_l.toFixed(2)}{' '}
                  USDT {t('pnl', language)}
                </div>
              )}
            </div>
          )}

          {performance.worst_symbol && (
            <div className="rounded-2xl p-6 backdrop-blur-sm bg-gradient-to-br from-red-500/15 to-red-500/5 border border-red-500/30 shadow-[0_4px_16px_rgba(248,113,113,0.1)]">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-6 h-6 text-red-400" />
                <span className="text-sm font-semibold text-red-300">
                  {t('worstPerformer', language)}
                </span>
              </div>
              <div className="text-3xl font-bold mono mb-1 text-red-400">
                {performance.worst_symbol}
              </div>
              {symbolStats[performance.worst_symbol] && (
                <div className="text-lg font-semibold text-red-300">
                  {symbolStats[performance.worst_symbol].total_pn_l > 0
                    ? '+'
                    : ''}
                  {symbolStats[performance.worst_symbol].total_pn_l.toFixed(2)}{' '}
                  USDT {t('pnl', language)}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 币种表现 & 历史成交 - 左右分屏 2列布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：币种表现统计表格 */}
        {symbolStatsList.length > 0 && (
          <div
            className="rounded-2xl overflow-hidden bg-darkmoon-surface/40 border border-indigo-500/20 shadow-lg"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            <div className="p-5 border-b border-indigo-500/20 sticky top-0 z-10 bg-darkmoon-surface/95 backdrop-blur-md">
              <h3 className="font-bold flex items-center gap-2 text-lg text-indigo-100">
                <BarChart3 className="w-5 h-5" />{' '}
                {stripLeadingIcons(t('symbolPerformance', language))}
              </h3>
            </div>
            <div
              className="overflow-y-auto custom-scrollbar"
              style={{ maxHeight: 'calc(100vh - 280px)' }}
            >
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-900/95 backdrop-blur-md">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-darkmoon-text-secondary">
                      Symbol
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-darkmoon-text-secondary">
                      Trades
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-darkmoon-text-secondary">
                      Win Rate
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-darkmoon-text-secondary">
                      Total P&L (USDT)
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-darkmoon-text-secondary">
                      Avg P&L (USDT)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {symbolStatsList.map((stat, idx) => (
                    <tr
                      key={stat.symbol}
                      className={`transition-colors hover:bg-white/5 ${
                        idx > 0 ? 'border-t border-indigo-500/10' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-bold mono text-sm text-indigo-100">
                          {stat.symbol}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right mono text-sm text-slate-300">
                        {stat.total_trades}
                      </td>
                      <td
                        className={`px-4 py-3 text-right mono text-sm font-semibold ${
                          (stat.win_rate || 0) >= 50
                            ? 'text-emerald-500'
                            : 'text-red-400'
                        }`}
                      >
                        {(stat.win_rate || 0).toFixed(1)}%
                      </td>
                      <td
                        className={`px-4 py-3 text-right mono text-sm font-bold ${
                          (stat.total_pn_l || 0) > 0
                            ? 'text-emerald-500'
                            : 'text-red-400'
                        }`}
                      >
                        {(stat.total_pn_l || 0) > 0 ? '+' : ''}
                        {(stat.total_pn_l || 0).toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right mono text-sm ${
                          (stat.avg_pn_l || 0) > 0
                            ? 'text-emerald-500'
                            : 'text-red-400'
                        }`}
                      >
                        {(stat.avg_pn_l || 0) > 0 ? '+' : ''}
                        {(stat.avg_pn_l || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 右侧：历史成交记录 */}
        <div
          className="rounded-2xl overflow-hidden bg-darkmoon-surface/40 border border-darkmoon-gold/20 shadow-lg"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          <div className="p-5 border-b border-darkmoon-gold/30 sticky top-0 z-10 bg-darkmoon-gold/10 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <ScrollText className="w-6 h-6 text-yellow-300" />
              <div>
                <h3 className="font-bold text-lg text-yellow-300">
                  {t('tradeHistory', language)}
                </h3>
                <p className="text-xs text-darkmoon-text-secondary">
                  {performance?.recent_trades &&
                  performance.recent_trades.length > 0
                    ? t('completedTrades', language, {
                        count: performance.recent_trades.length,
                      })
                    : t('completedTradesWillAppear', language)}
                </p>
              </div>
            </div>
          </div>

          <div
            className="overflow-y-auto p-4 space-y-3 custom-scrollbar"
            style={{ maxHeight: 'calc(100vh - 280px)' }}
          >
            {performance?.recent_trades &&
            performance.recent_trades.length > 0 ? (
              performance.recent_trades.map(
                (trade: TradeOutcome, idx: number) => {
                  const isProfitable = trade.pn_l >= 0
                  const isRecent = idx === 0

                  return (
                    <div
                      key={idx}
                      className={`rounded-xl p-4 backdrop-blur-sm transition-all hover:scale-[1.02] ${
                        isRecent
                          ? isProfitable
                            ? 'bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/40 shadow-[0_4px_16px_rgba(139,92,246,0.2)]'
                            : 'bg-gradient-to-br from-red-500/15 to-red-500/5 border border-red-500/40 shadow-[0_4px_16px_rgba(139,92,246,0.2)]'
                          : 'bg-darkmoon-surface/40 border border-slate-700/30 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold mono text-indigo-100">
                            {trade.symbol}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded font-bold ${
                              trade.side === 'long'
                                ? 'bg-emerald-500/20 text-emerald-500'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {trade.side.toUpperCase()}
                          </span>
                          {isRecent && (
                            <span className="text-xs px-2 py-0.5 rounded font-semibold bg-darkmoon-gold/20 text-yellow-300">
                              {t('latest', language)}
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-lg font-bold mono ${
                            isProfitable ? 'text-emerald-500' : 'text-red-400'
                          }`}
                        >
                          {isProfitable ? '+' : ''}
                          {trade.pn_l_pct.toFixed(2)}%
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div>
                          <div className="text-darkmoon-text-secondary">
                            {t('entry', language)}
                          </div>
                          <div className="font-mono font-semibold text-slate-300">
                            {trade.open_price.toFixed(4)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-darkmoon-text-secondary">
                            {t('exit', language)}
                          </div>
                          <div className="font-mono font-semibold text-slate-300">
                            {trade.close_price.toFixed(4)}
                          </div>
                        </div>
                      </div>

                      {/* Position Details */}
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div>
                          <div className="text-darkmoon-text-secondary">
                            Quantity
                          </div>
                          <div className="font-mono font-semibold text-slate-300">
                            {trade.quantity ? trade.quantity.toFixed(4) : '-'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-darkmoon-text-secondary">
                            Leverage
                          </div>
                          <div className="font-mono font-semibold text-yellow-300">
                            {trade.leverage ? `${trade.leverage}x` : '-'}
                          </div>
                        </div>
                        <div>
                          <div className="text-darkmoon-text-secondary">
                            Position Value
                          </div>
                          <div className="font-mono font-semibold text-slate-300">
                            {trade.position_value
                              ? `$${trade.position_value.toFixed(2)}`
                              : '-'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-darkmoon-text-secondary">
                            Margin Used
                          </div>
                          <div className="font-mono font-semibold text-violet-400">
                            {trade.margin_used
                              ? `$${trade.margin_used.toFixed(2)}`
                              : '-'}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`rounded-lg p-2 mb-2 ${
                          isProfitable
                            ? 'bg-emerald-500/10'
                            : 'bg-red-500/10'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-darkmoon-text-secondary">
                            P&L
                          </span>
                          <span
                            className={`font-bold mono ${
                              isProfitable
                                ? 'text-emerald-500'
                                : 'text-red-400'
                            }`}
                          >
                            {isProfitable ? '+' : ''}
                            {trade.pn_l.toFixed(2)} USDT
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-darkmoon-text-secondary">
                        <span>⏱️ {formatDuration(trade.duration)}</span>
                        {trade.was_stop_loss && (
                          <span className="px-2 py-0.5 rounded font-semibold bg-red-500/20 text-red-300">
                            {t('stopLoss', language)}
                          </span>
                        )}
                      </div>

                      <div className="text-xs mt-2 pt-2 border-t border-slate-700/30 text-slate-500">
                        {new Date(trade.close_time).toLocaleString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  )
                }
              )
            ) : (
              <div className="p-6 text-center">
                <div className="mb-2 flex justify-center opacity-50">
                  <ScrollText className="w-10 h-10 text-darkmoon-text-secondary" />
                </div>
                <div className="text-darkmoon-text-secondary">
                  {t('noCompletedTrades', language)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI学习说明 - 现代化设计 */}
      <div className="rounded-2xl p-6 backdrop-blur-sm bg-gradient-to-br from-darkmoon-gold/10 to-[#FCD535]/5 border border-darkmoon-gold/20 shadow-[0_4px_16px_rgba(240,185,11,0.1)]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-darkmoon-gold/20 border border-darkmoon-gold/30">
            <Lightbulb className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold mb-3 text-base text-yellow-300">
              {stripLeadingIcons(t('howAILearns', language))}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-darkmoon-gold">•</span>
                <span className="text-slate-300">
                  {t('aiLearningPoint1', language)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-darkmoon-gold">•</span>
                <span className="text-slate-300">
                  {t('aiLearningPoint2', language)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-darkmoon-gold">•</span>
                <span className="text-slate-300">
                  {t('aiLearningPoint3', language)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-darkmoon-gold">•</span>
                <span className="text-slate-300">
                  {t('aiLearningPoint4', language)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 格式化持仓时长
function formatDuration(duration: string | undefined): string {
  if (!duration) return '-'

  const match = duration.match(/(\d+h)?(\d+m)?(\d+\.?\d*s)?/)
  if (!match) return duration

  const hours = match[1] || ''
  const minutes = match[2] || ''
  const seconds = match[3] || ''

  let result = ''
  if (hours) result += hours.replace('h', '小时')
  if (minutes) result += minutes.replace('m', '分')
  if (!hours && seconds) result += seconds.replace(/(\d+)\.?\d*s/, '$1秒')

  return result || duration
}
