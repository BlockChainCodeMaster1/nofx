import { Brain } from 'lucide-react'
import { t, Language } from '../../../i18n/translations'
import { getModelIcon } from '../../ModelIcons'
import { getShortName } from '../utils'
import type { AIModel } from '../../../types'

interface AIModelsSectionProps {
  language: Language
  configuredModels: AIModel[]
  isModelInUse: (modelId: string) => boolean
  onModelClick: (modelId: string) => void
}

export function AIModelsSection({
  language,
  configuredModels,
  isModelInUse,
  onModelClick,
}: AIModelsSectionProps) {
  return (
    <div className="bg-darkmoon-surface border border-darkmoon-border rounded-xl p-4 md:p-6 h-full">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-darkmoon-text-primary">
        <Brain className="w-5 h-5 text-blue-400" />
        {t('aiModels', language)}
      </h3>
      <div className="space-y-3">
        {configuredModels.map((model) => {
          const inUse = isModelInUse(model.id)
          return (
            <div
              key={model.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all border ${
                inUse
                  ? 'cursor-not-allowed opacity-70 bg-darkmoon-surface border-darkmoon-border'
                  : 'cursor-pointer hover:bg-darkmoon-surface-hover border-darkmoon-border hover:border-darkmoon-gold/30'
              }`}
              onClick={() => onModelClick(model.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-darkmoon-bg rounded-lg p-1 border border-darkmoon-border">
                  {getModelIcon(model.provider || model.id, {
                    width: 24,
                    height: 24,
                  }) || (
                    <div
                      className="w-full h-full rounded-md flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background:
                          model.id === 'deepseek' ? '#60a5fa' : '#c084fc',
                      }}
                    >
                      {getShortName(model.name)[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-darkmoon-text-primary truncate">
                    {getShortName(model.name)}
                  </div>
                  <div className="text-xs text-darkmoon-text-secondary">
                    {inUse
                      ? t('inUse', language)
                      : model.enabled
                        ? t('enabled', language)
                        : t('configured', language)}
                  </div>
                </div>
              </div>
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${model.enabled ? 'bg-green-500 shadow-[0_0_5px_#10B981]' : 'bg-gray-500'}`}
              />
            </div>
          )
        })}
        {configuredModels.length === 0 && (
          <div className="text-center py-8 text-darkmoon-text-muted">
            <Brain className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <div className="text-sm">
              {t('noModelsConfigured', language)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
