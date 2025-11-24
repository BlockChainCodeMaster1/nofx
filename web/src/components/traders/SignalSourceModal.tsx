import { useState } from 'react'
import { t, type Language } from '../../i18n/translations'

interface SignalSourceModalProps {
  coinPoolUrl: string
  oiTopUrl: string
  onSave: (coinPoolUrl: string, oiTopUrl: string) => void
  onClose: () => void
  language: Language
}

export function SignalSourceModal({
  coinPoolUrl,
  oiTopUrl,
  onSave,
  onClose,
  language,
}: SignalSourceModalProps) {
  const [coinPool, setCoinPool] = useState(coinPoolUrl || '')
  const [oiTop, setOiTop] = useState(oiTopUrl || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(coinPool.trim(), oiTop.trim())
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        className="bg-darkmoon-surface rounded-xl w-full max-w-lg relative my-8 border border-darkmoon-border shadow-2xl"
        style={{
          maxHeight: 'calc(100vh - 4rem)',
        }}
      >
        <div className="p-6 pb-4 border-b border-darkmoon-border">
          <h3 className="text-xl font-bold text-darkmoon-text-primary">
            {t('signalSourceConfig', language)}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4">
          <div
            className="space-y-4 overflow-y-auto custom-scrollbar pr-2"
            style={{ maxHeight: 'calc(100vh - 16rem)' }}
          >
            <div>
              <label
                className="block text-sm font-semibold mb-2 text-darkmoon-text-primary"
              >
                COIN POOL URL
              </label>
              <input
                type="url"
                value={coinPool}
                onChange={(e) => setCoinPool(e.target.value)}
                placeholder="https://api.example.com/coinpool"
                className="w-full px-3 py-2 rounded bg-darkmoon-surface-light border border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold focus:outline-none placeholder-gray-600"
              />
              <div className="text-xs mt-1 text-darkmoon-text-secondary">
                {t('coinPoolDescription', language)}
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2 text-darkmoon-text-primary"
              >
                OI TOP URL
              </label>
              <input
                type="url"
                value={oiTop}
                onChange={(e) => setOiTop(e.target.value)}
                placeholder="https://api.example.com/oitop"
                className="w-full px-3 py-2 rounded bg-darkmoon-surface-light border border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold focus:outline-none placeholder-gray-600"
              />
              <div className="text-xs mt-1 text-darkmoon-text-secondary">
                {t('oiTopDescription', language)}
              </div>
            </div>

            <div
              className="p-4 rounded bg-darkmoon-gold/10 border border-darkmoon-gold/20"
            >
              <div
                className="text-sm font-semibold mb-2 text-darkmoon-gold"
              >
                ℹ️ {t('information', language)}
              </div>
              <div className="text-xs space-y-1 text-darkmoon-text-secondary">
                <div>{t('signalSourceInfo1', language)}</div>
                <div>{t('signalSourceInfo2', language)}</div>
                <div>{t('signalSourceInfo3', language)}</div>
              </div>
            </div>
          </div>

          <div
            className="flex gap-3 mt-6 pt-4 sticky bottom-0 bg-darkmoon-surface border-t border-darkmoon-border"
          >
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded text-sm font-semibold bg-darkmoon-surface-light text-darkmoon-text-secondary hover:bg-darkmoon-surface hover:text-darkmoon-text-primary transition-colors"
            >
              {t('cancel', language)}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded text-sm font-semibold bg-darkmoon-gold text-black hover:bg-darkmoon-gold-light transition-colors"
            >
              {t('save', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
