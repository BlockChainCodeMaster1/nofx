import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import { api } from '../lib/api'
import { EquityChart } from '../components/EquityChart'
import AILearning from '../components/AILearning'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { t, type Language } from '../i18n/translations'
import {
  AlertTriangle,
  Bot,
  Brain,
  RefreshCw,
  TrendingUp,
  PieChart,
  Inbox,
  Send,
  Check,
  X,
  XCircle,
} from 'lucide-react'
import { stripLeadingIcons } from '../lib/text'
import type {
  SystemStatus,
  AccountInfo,
  Position,
  DecisionRecord,
  Statistics,
  TraderInfo,
} from '../types'

// 获取友好的AI模型名称
function getModelDisplayName(modelId: string): string {
  switch (modelId.toLowerCase()) {
    case 'deepseek':
      return 'DeepSeek'
    case 'qwen':
      return 'Qwen'
    case 'claude':
      return 'Claude'
    default:
      return modelId.toUpperCase()
  }
}

export default function TraderDashboard() {
  const { language } = useLanguage()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedTraderId, setSelectedTraderId] = useState<string | undefined>(
    searchParams.get('trader') || undefined
  )
  const [lastUpdate, setLastUpdate] = useState<string>('--:--:--')

  // 决策记录数量选择（从 localStorage 读取，默认 5）
  const [decisionLimit, setDecisionLimit] = useState<number>(() => {
    const saved = localStorage.getItem('decisionLimit')
    return saved ? parseInt(saved, 10) : 5
  })

  // 当 limit 变化时保存到 localStorage
  const handleLimitChange = (newLimit: number) => {
    setDecisionLimit(newLimit)
    localStorage.setItem('decisionLimit', newLimit.toString())
  }

  // 获取trader列表（仅在用户登录时）
  const { data: traders, error: tradersError } = useSWR<TraderInfo[]>(
    user && token ? 'traders' : null,
    api.getTraders,
    {
      refreshInterval: 10000,
      shouldRetryOnError: false,
    }
  )

  // 当获取到traders后，设置默认选中第一个
  useEffect(() => {
    if (traders && traders.length > 0 && !selectedTraderId) {
      const firstTraderId = traders[0].trader_id
      setSelectedTraderId(firstTraderId)
      setSearchParams({ trader: firstTraderId })
    }
  }, [traders, selectedTraderId, setSearchParams])

  // 更新URL参数
  const handleTraderSelect = (traderId: string) => {
    setSelectedTraderId(traderId)
    setSearchParams({ trader: traderId })
  }

  // 如果在trader页面，获取该trader的数据
  const { data: status } = useSWR<SystemStatus>(
    user && token && selectedTraderId ? `status-${selectedTraderId}` : null,
    () => api.getStatus(selectedTraderId),
    {
      refreshInterval: 15000,
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  )

  const { data: account } = useSWR<AccountInfo>(
    user && token && selectedTraderId ? `account-${selectedTraderId}` : null,
    () => api.getAccount(selectedTraderId),
    {
      refreshInterval: 15000,
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  )

  const { data: positions } = useSWR<Position[]>(
    user && token && selectedTraderId ? `positions-${selectedTraderId}` : null,
    () => api.getPositions(selectedTraderId),
    {
      refreshInterval: 15000,
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  )

  const { data: decisions } = useSWR<DecisionRecord[]>(
    user && token && selectedTraderId
      ? `decisions/latest-${selectedTraderId}-${decisionLimit}`
      : null,
    () => api.getLatestDecisions(selectedTraderId, decisionLimit),
    {
      refreshInterval: 30000,
      revalidateOnFocus: false,
      dedupingInterval: 20000,
    }
  )

  const { data: stats } = useSWR<Statistics>(
    user && token && selectedTraderId ? `statistics-${selectedTraderId}` : null,
    () => api.getStatistics(selectedTraderId),
    {
      refreshInterval: 30000,
      revalidateOnFocus: false,
      dedupingInterval: 20000,
    }
  )

  // Avoid unused variable warning
  void stats

  useEffect(() => {
    if (account) {
      const now = new Date().toLocaleTimeString()
      setLastUpdate(now)
    }
  }, [account])

  const selectedTrader = traders?.find((t) => t.trader_id === selectedTraderId)

  // If API failed with error, show empty state
  if (tradersError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-darkmoon-gold/10 border-2 border-darkmoon-gold/30">
            <Bot className="w-12 h-12 text-darkmoon-gold" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-darkmoon-text-primary">
            {t('dashboardEmptyTitle', language)}
          </h2>
          <p className="text-base mb-6 text-darkmoon-text-secondary">
            {t('dashboardEmptyDescription', language)}
          </p>
          <button
            onClick={() => navigate('/traders')}
            className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black shadow-lg hover:shadow-darkmoon-gold/20"
          >
            {t('goToTradersPage', language)}
          </button>
        </div>
      </div>
    )
  }

  // If traders is loaded and empty, show empty state
  if (traders && traders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-darkmoon-gold/10 border-2 border-darkmoon-gold/30">
            <Bot className="w-12 h-12 text-darkmoon-gold" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-darkmoon-text-primary">
            {t('dashboardEmptyTitle', language)}
          </h2>
          <p className="text-base mb-6 text-darkmoon-text-secondary">
            {t('dashboardEmptyDescription', language)}
          </p>
          <button
            onClick={() => navigate('/traders')}
            className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black shadow-lg hover:shadow-darkmoon-gold/20"
          >
            {t('goToTradersPage', language)}
          </button>
        </div>
      </div>
    )
  }

  // If traders is still loading or selectedTrader is not ready, show skeleton
  if (!selectedTrader) {
    return (
      <div className="space-y-6">
        <div className="bg-darkmoon-surface border border-darkmoon-border p-6 rounded-xl animate-pulse">
          <div className="h-8 w-48 mb-3 bg-darkmoon-border rounded"></div>
          <div className="flex gap-4">
            <div className="h-4 w-32 bg-darkmoon-border rounded"></div>
            <div className="h-4 w-24 bg-darkmoon-border rounded"></div>
            <div className="h-4 w-28 bg-darkmoon-border rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-darkmoon-surface border border-darkmoon-border p-5 rounded-xl animate-pulse">
              <div className="h-4 w-24 mb-3 bg-darkmoon-border rounded"></div>
              <div className="h-8 w-32 bg-darkmoon-border rounded"></div>
            </div>
          ))}
        </div>
        <div className="bg-darkmoon-surface border border-darkmoon-border p-6 rounded-xl animate-pulse">
          <div className="h-6 w-40 mb-4 bg-darkmoon-border rounded"></div>
          <div className="h-64 w-full bg-darkmoon-border rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Trader Header */}
      <div className="mb-6 rounded-xl p-6 animate-scale-in bg-gradient-to-br from-darkmoon-gold/10 to-transparent border border-darkmoon-gold/20 shadow-glow">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-darkmoon-text-primary">
            <span className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-darkmoon-gold to-[#F3CF55]">
              <Bot className="w-5 h-5 text-black" />
            </span>
            {selectedTrader.trader_name}
          </h2>

          {/* Trader Selector */}
          {traders && traders.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-darkmoon-text-secondary">
                {t('switchTrader', language)}:
              </span>
              <select
                value={selectedTraderId}
                onChange={(e) => handleTraderSelect(e.target.value)}
                className="rounded px-3 py-2 text-sm font-medium cursor-pointer transition-colors bg-darkmoon-surface border border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold outline-none"
              >
                {traders.map((trader) => (
                  <option key={trader.trader_id} value={trader.trader_id}>
                    {trader.trader_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-darkmoon-text-secondary">
          <span>
            AI Model:{' '}
            <span className="font-semibold text-darkmoon-gold">
              {getModelDisplayName(
                selectedTrader.ai_model.split('_').pop() ||
                  selectedTrader.ai_model
              )}
            </span>
          </span>
          <span className="text-darkmoon-border">•</span>
          <span>
            Prompt: <span className="font-semibold text-darkmoon-gold">{selectedTrader.system_prompt_template || '-'}</span>
          </span>
          {status && (
            <>
              <span className="text-darkmoon-border">•</span>
              <span>Cycles: {status.call_count}</span>
              <span className="text-darkmoon-border">•</span>
              <span>Runtime: {status.runtime_minutes} min</span>
            </>
          )}
        </div>
      </div>

      {/* Debug Info */}
      {account && (
        <div className="mb-4 p-3 rounded text-xs font-mono bg-darkmoon-surface border border-darkmoon-border text-darkmoon-text-muted">
          <div>
            <RefreshCw className="inline w-4 h-4 mr-1 align-text-bottom" />
            Last Update: {lastUpdate} | Total Equity:{' '}
            {account?.total_equity?.toFixed(2) || '0.00'} | Available:{' '}
            {account?.available_balance?.toFixed(2) || '0.00'} | P&L:{' '}
            {account?.total_pnl?.toFixed(2) || '0.00'} (
            {account?.total_pnl_pct?.toFixed(2) || '0.00'}%)
          </div>
        </div>
      )}

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title={t('totalEquity', language)}
          value={`${account?.total_equity?.toFixed(2) || '0.00'} USDT`}
          change={account?.total_pnl_pct || 0}
          positive={(account?.total_pnl ?? 0) > 0}
        />
        <StatCard
          title={t('availableBalance', language)}
          value={`${account?.available_balance?.toFixed(2) || '0.00'} USDT`}
          subtitle={`${account?.available_balance && account?.total_equity ? ((account.available_balance / account.total_equity) * 100).toFixed(1) : '0.0'}% ${t('free', language)}`}
        />
        <StatCard
          title={t('totalPnL', language)}
          value={`${account?.total_pnl !== undefined && account.total_pnl >= 0 ? '+' : ''}${account?.total_pnl?.toFixed(2) || '0.00'} USDT`}
          change={account?.total_pnl_pct || 0}
          positive={(account?.total_pnl ?? 0) >= 0}
        />
        <StatCard
          title={t('positions', language)}
          value={`${account?.position_count || 0}`}
          subtitle={`${t('margin', language)}: ${account?.margin_used_pct?.toFixed(1) || '0.0'}%`}
        />
      </div>

      {/* 主要内容区：左右分屏 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 左侧：图表 + 持仓 */}
        <div className="space-y-6">
          {/* Equity Chart */}
          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <EquityChart traderId={selectedTrader.trader_id} />
          </div>

          {/* Current Positions */}
          <div className="bg-darkmoon-surface border border-darkmoon-border rounded-xl p-6 animate-slide-in" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold flex items-center gap-2 text-darkmoon-text-primary">
                <TrendingUp className="w-5 h-5 text-darkmoon-gold" />
                {t('currentPositions', language)}
              </h2>
              {positions && positions.length > 0 && (
                <div className="text-xs px-3 py-1 rounded bg-darkmoon-gold/10 text-darkmoon-gold border border-darkmoon-gold/20">
                  {positions.length} {t('active', language)}
                </div>
              )}
            </div>
            {positions && positions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left border-b border-darkmoon-border">
                    <tr>
                      <th className="pb-3 font-semibold text-darkmoon-text-secondary">
                        {t('symbol', language)}
                      </th>
                      <th className="pb-3 font-semibold text-darkmoon-text-secondary">
                        {t('side', language)}
                      </th>
                      <th className="pb-3 font-semibold text-darkmoon-text-secondary">
                        {t('entryPrice', language)}
                      </th>
                      <th className="pb-3 font-semibold text-darkmoon-text-secondary">
                        {t('markPrice', language)}
                      </th>
                      <th className="pb-3 font-semibold text-darkmoon-text-secondary">
                        {t('quantity', language)}
                      </th>
                      <th className="pb-3 font-semibold text-darkmoon-text-secondary">
                        {t('positionValue', language)}
                      </th>
                      <th className="pb-3 font-semibold text-darkmoon-text-secondary">
                        {t('leverage', language)}
                      </th>
                      <th className="pb-3 font-semibold text-darkmoon-text-secondary">
                        {t('unrealizedPnL', language)}
                      </th>
                      <th className="pb-3 font-semibold text-darkmoon-text-secondary">
                        {t('liqPrice', language)}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos, i) => (
                      <tr
                        key={i}
                        className="border-b border-darkmoon-border last:border-0 hover:bg-darkmoon-surface-hover transition-colors"
                      >
                        <td className="py-3 font-mono font-semibold text-darkmoon-text-primary">
                          {pos.symbol}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              pos.side === 'long'
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-red-500/10 text-red-500'
                            }`}
                          >
                            {t(
                              pos.side === 'long' ? 'long' : 'short',
                              language
                            )}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-darkmoon-text-primary">
                          {pos.entry_price.toFixed(4)}
                        </td>
                        <td className="py-3 font-mono text-darkmoon-text-primary">
                          {pos.mark_price.toFixed(4)}
                        </td>
                        <td className="py-3 font-mono text-darkmoon-text-primary">
                          {pos.quantity.toFixed(4)}
                        </td>
                        <td className="py-3 font-mono font-bold text-darkmoon-text-primary">
                          {(pos.quantity * pos.mark_price).toFixed(2)} USDT
                        </td>
                        <td className="py-3 font-mono text-darkmoon-gold">
                          {pos.leverage}x
                        </td>
                        <td className="py-3 font-mono">
                          <span
                            className={
                              pos.unrealized_pnl >= 0 ? 'text-green-500 font-bold' : 'text-red-500 font-bold'
                            }
                          >
                            {pos.unrealized_pnl >= 0 ? '+' : ''}
                            {pos.unrealized_pnl.toFixed(2)} (
                            {pos.unrealized_pnl_pct.toFixed(2)}%)
                          </span>
                        </td>
                        <td className="py-3 font-mono text-darkmoon-text-secondary">
                          {pos.liquidation_price.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-darkmoon-text-muted">
                <div className="mb-4 opacity-50 flex justify-center">
                  <PieChart className="w-16 h-16" />
                </div>
                <div className="text-lg font-semibold mb-2">
                  {t('noPositions', language)}
                </div>
                <div className="text-sm">
                  {t('noActivePositions', language)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：Recent Decisions */}
        <div
          className="bg-darkmoon-surface border border-darkmoon-border p-6 rounded-xl animate-slide-in h-fit lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)]"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-darkmoon-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-darkmoon-text-primary">
                  {t('recentDecisions', language)}
                </h2>
                {decisions && decisions.length > 0 && (
                  <div className="text-xs text-darkmoon-text-secondary">
                    {t('lastCycles', language, { count: decisions.length })}
                  </div>
                )}
              </div>
            </div>

            {/* 显示数量选择器 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-darkmoon-text-secondary">
                {language === 'zh' ? '显示' : 'Show'}:
              </span>
              <select
                value={decisionLimit}
                onChange={(e) => handleLimitChange(parseInt(e.target.value, 10))}
                className="rounded px-2 py-1 text-xs font-medium cursor-pointer transition-colors bg-darkmoon-bg border border-darkmoon-border text-darkmoon-text-primary outline-none focus:border-darkmoon-gold"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-xs text-darkmoon-text-secondary">
                {language === 'zh' ? '条' : ''}
              </span>
            </div>
          </div>

          <div
            className="space-y-4 overflow-y-auto pr-2"
            style={{ maxHeight: 'calc(100vh - 280px)' }}
          >
            {decisions && decisions.length > 0 ? (
              decisions.map((decision, i) => (
                <DecisionCard key={i} decision={decision} language={language} />
              ))
            ) : (
              <div className="py-16 text-center text-darkmoon-text-muted">
                <div className="mb-4 opacity-30 flex justify-center">
                  <Brain className="w-16 h-16" />
                </div>
                <div className="text-lg font-semibold mb-2 text-darkmoon-text-primary">
                  {t('noDecisionsYet', language)}
                </div>
                <div className="text-sm">
                  {t('aiDecisionsWillAppear', language)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Learning & Performance Analysis */}
      <div className="mb-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
        <AILearning traderId={selectedTrader.trader_id} />
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  positive,
  subtitle,
}: {
  title: string
  value: string
  change?: number
  positive?: boolean
  subtitle?: string
}) {
  return (
    <div className="bg-darkmoon-surface border border-darkmoon-border p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-darkmoon-gold/30 hover:shadow-glow">
      <div className="text-xs mb-2 font-mono uppercase tracking-wider text-darkmoon-text-secondary">
        {title}
      </div>
      <div className="text-2xl font-bold mb-1 font-mono text-darkmoon-text-primary">
        {value}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1">
          <div
            className={`text-sm font-mono font-bold ${
              positive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {positive ? '▲' : '▼'} {positive ? '+' : ''}
            {change.toFixed(2)}%
          </div>
        </div>
      )}
      {subtitle && (
        <div className="text-xs mt-2 font-mono text-darkmoon-text-muted">
          {subtitle}
        </div>
      )}
    </div>
  )
}

// Decision Card Component
function DecisionCard({
  decision,
  language,
}: {
  decision: DecisionRecord
  language: Language
}) {
  const [showInputPrompt, setShowInputPrompt] = useState(false)
  const [showCoT, setShowCoT] = useState(false)

  return (
    <div className="bg-darkmoon-bg border border-darkmoon-border p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-darkmoon-text-primary">
            {t('cycle', language)} #{decision.cycle_number}
          </div>
          <div className="text-xs text-darkmoon-text-secondary">
            {new Date(decision.timestamp).toLocaleString()}
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded text-xs font-bold ${
            decision.success
              ? 'bg-green-500/10 text-green-500'
              : 'bg-red-500/10 text-red-500'
          }`}
        >
          {t(decision.success ? 'success' : 'failed', language)}
        </div>
      </div>

      {/* Input Prompt - Collapsible */}
      {decision.input_prompt && (
        <div className="mb-3">
          <button
            onClick={() => setShowInputPrompt(!showInputPrompt)}
            className="flex items-center gap-2 text-sm transition-colors text-blue-400 hover:text-blue-300"
          >
            <span className="font-semibold flex items-center gap-2">
              <Inbox className="w-4 h-4" /> {t('inputPrompt', language)}
            </span>
            <span className="text-xs">
              {showInputPrompt
                ? t('collapse', language)
                : t('expand', language)}
            </span>
          </button>
          {showInputPrompt && (
            <div className="mt-2 rounded p-4 text-sm font-mono whitespace-pre-wrap max-h-96 overflow-y-auto bg-black/30 border border-darkmoon-border text-darkmoon-text-secondary">
              {decision.input_prompt}
            </div>
          )}
        </div>
      )}

      {/* AI Chain of Thought - Collapsible */}
      {decision.cot_trace && (
        <div className="mb-3">
          <button
            onClick={() => setShowCoT(!showCoT)}
            className="flex items-center gap-2 text-sm transition-colors text-darkmoon-gold hover:text-[#F3CF55]"
          >
            <span className="font-semibold flex items-center gap-2">
              <Send className="w-4 h-4" />{' '}
              {stripLeadingIcons(t('aiThinking', language))}
            </span>
            <span className="text-xs">
              {showCoT ? t('collapse', language) : t('expand', language)}
            </span>
          </button>
          {showCoT && (
            <div className="mt-2 rounded p-4 text-sm font-mono whitespace-pre-wrap max-h-96 overflow-y-auto bg-black/30 border border-darkmoon-border text-darkmoon-text-secondary">
              {decision.cot_trace}
            </div>
          )}
        </div>
      )}

      {/* Decisions Actions */}
      {decision.decisions && decision.decisions.length > 0 && (
        <div className="space-y-2 mb-3">
          {decision.decisions.map((action, j) => (
            <div
              key={j}
              className="flex items-center gap-2 text-sm rounded px-3 py-2 bg-black/20"
            >
              <span className="font-mono font-bold text-darkmoon-text-primary">
                {action.symbol}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  action.action.includes('open')
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-darkmoon-gold/10 text-darkmoon-gold'
                }`}
              >
                {action.action}
              </span>
              {action.leverage > 0 && (
                <span className="text-darkmoon-gold">{action.leverage}x</span>
              )}
              {action.price > 0 && (
                <span className="font-mono text-xs text-darkmoon-text-secondary">
                  @{action.price.toFixed(4)}
                </span>
              )}
              <span className={action.success ? 'text-green-500' : 'text-red-500'}>
                {action.success ? (
                  <Check className="w-3 h-3 inline" />
                ) : (
                  <X className="w-3 h-3 inline" />
                )}
              </span>
              {action.error && (
                <span className="text-xs ml-2 text-red-500">
                  {action.error}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Account State Summary */}
      {decision.account_state && (
        <div className="flex gap-4 text-xs mb-3 rounded px-3 py-2 bg-black/20 text-darkmoon-text-secondary">
          <span>
            净值: {decision.account_state.total_balance.toFixed(2)} USDT
          </span>
          <span>
            可用: {decision.account_state.available_balance.toFixed(2)} USDT
          </span>
          <span>
            保证金率: {decision.account_state.margin_used_pct.toFixed(1)}%
          </span>
          <span>持仓: {decision.account_state.position_count}</span>
          <span
            className={
              decision.candidate_coins &&
              decision.candidate_coins.length === 0
                ? 'text-red-500'
                : 'text-darkmoon-text-secondary'
            }
          >
            {t('candidateCoins', language)}:{' '}
            {decision.candidate_coins?.length || 0}
          </span>
        </div>
      )}

      {/* Candidate Coins Warning */}
      {decision.candidate_coins && decision.candidate_coins.length === 0 && (
        <div className="text-sm rounded px-4 py-3 mb-3 flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-500">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold mb-1">
              {t('candidateCoinsZeroWarning', language)}
            </div>
            <div className="text-xs space-y-1 text-darkmoon-text-secondary">
              <div>{t('possibleReasons', language)}</div>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>{t('coinPoolApiNotConfigured', language)}</li>
                <li>{t('apiConnectionTimeout', language)}</li>
                <li>{t('noCustomCoinsAndApiFailed', language)}</li>
              </ul>
              <div className="mt-2">
                <strong>{t('solutions', language)}</strong>
              </div>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>{t('setCustomCoinsInConfig', language)}</li>
                <li>{t('orConfigureCorrectApiUrl', language)}</li>
                <li>{t('orDisableCoinPoolOptions', language)}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Execution Logs */}
      {decision.execution_log && decision.execution_log.length > 0 && (
        <div className="space-y-1">
          {decision.execution_log.map((log, k) => (
            <div
              key={k}
              className={`text-xs font-mono ${
                log.includes('✓') || log.includes('成功')
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {decision.error_message && (
        <div className="text-sm rounded px-3 py-2 mt-3 flex items-center gap-2 text-red-500 bg-red-500/10">
          <XCircle className="w-4 h-4" /> {decision.error_message}
        </div>
      )}
    </div>
  )
}
