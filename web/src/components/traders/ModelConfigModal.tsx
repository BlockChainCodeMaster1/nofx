import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { t, type Language } from '../../i18n/translations'
import type { AIModel } from '../../types'
import { getModelIcon } from '../ModelIcons'
import { getShortName } from './utils'

interface ModelConfigModalProps {
  allModels: AIModel[]
  configuredModels: AIModel[]
  editingModelId: string | null
  onSave: (
    modelId: string,
    apiKey: string,
    baseUrl?: string,
    modelName?: string
  ) => void
  onDelete: (modelId: string) => void
  onClose: () => void
  language: Language
}

export function ModelConfigModal({
  allModels,
  configuredModels,
  editingModelId,
  onSave,
  onDelete,
  onClose,
  language,
}: ModelConfigModalProps) {
  const [selectedModelId, setSelectedModelId] = useState(editingModelId || '')
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [modelName, setModelName] = useState('')

  // 获取当前编辑的模型信息 - 编辑时从已配置的模型中查找,新建时从所有支持的模型中查找
  const selectedModel = editingModelId
    ? configuredModels?.find((m) => m.id === selectedModelId)
    : allModels?.find((m) => m.id === selectedModelId)

  // 如果是编辑现有模型,初始化API Key、Base URL和Model Name
  useEffect(() => {
    if (editingModelId && selectedModel) {
      setApiKey(selectedModel.apiKey || '')
      setBaseUrl(selectedModel.customApiUrl || '')
      setModelName(selectedModel.customModelName || '')
    }
  }, [editingModelId, selectedModel])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedModelId || !apiKey.trim()) return

    onSave(
      selectedModelId,
      apiKey.trim(),
      baseUrl.trim() || undefined,
      modelName.trim() || undefined
    )
  }

  // 可选择的模型列表(所有支持的模型)
  const availableModels = allModels || []

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        className="bg-darkmoon-surface rounded-xl w-full max-w-lg relative my-8 border border-darkmoon-border shadow-2xl"
        style={{
          maxHeight: 'calc(100vh - 4rem)',
        }}
      >
        <div
          className="flex items-center justify-between p-6 pb-4 sticky top-0 z-10 bg-darkmoon-surface rounded-t-xl border-b border-darkmoon-border"
        >
          <h3 className="text-xl font-bold text-darkmoon-text-primary">
            {editingModelId
              ? t('editAIModel', language)
              : t('addAIModel', language)}
          </h3>
          {editingModelId && (
            <button
              type="button"
              onClick={() => onDelete(editingModelId)}
              className="p-2 rounded hover:bg-red-500/20 transition-colors bg-red-500/10 text-red-500"
              title={t('delete', language)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4">
          <div
            className="space-y-4 overflow-y-auto custom-scrollbar pr-2"
            style={{ maxHeight: 'calc(100vh - 16rem)' }}
          >
            {!editingModelId && (
              <div>
                <label
                  className="block text-sm font-semibold mb-2 text-darkmoon-text-primary"
                >
                  {t('selectModel', language)}
                </label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-darkmoon-surface-light border border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold focus:outline-none"
                  required
                >
                  <option value="">{t('pleaseSelectModel', language)}</option>
                  {availableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {getShortName(model.name)} ({model.provider})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedModel && (
              <div
                className="p-4 rounded bg-darkmoon-surface-light border border-darkmoon-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 flex items-center justify-center text-darkmoon-text-primary">
                    {getModelIcon(selectedModel.provider || selectedModel.id, {
                      width: 32,
                      height: 32,
                    }) || (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          selectedModel.id === 'deepseek'
                            ? 'bg-blue-400'
                            : 'bg-purple-400'
                        }`}
                      >
                        {selectedModel.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-darkmoon-text-primary">
                      {getShortName(selectedModel.name)}
                    </div>
                    <div className="text-xs text-darkmoon-text-secondary">
                      {selectedModel.provider} • {selectedModel.id}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedModel && (
              <>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2 text-darkmoon-text-primary"
                  >
                    API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={t('enterAPIKey', language)}
                    className="w-full px-3 py-2 rounded bg-darkmoon-surface-light border border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold focus:outline-none placeholder-gray-600"
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2 text-darkmoon-text-primary"
                  >
                    {t('customBaseURL', language)}
                  </label>
                  <input
                    type="url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder={t('customBaseURLPlaceholder', language)}
                    className="w-full px-3 py-2 rounded bg-darkmoon-surface-light border border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold focus:outline-none placeholder-gray-600"
                  />
                  <div className="text-xs mt-1 text-darkmoon-text-secondary">
                    {t('leaveBlankForDefault', language)}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2 text-darkmoon-text-primary"
                  >
                    Model Name (可选)
                  </label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="例如: deepseek-chat, qwen3-max, gpt-5"
                    className="w-full px-3 py-2 rounded bg-darkmoon-surface-light border border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold focus:outline-none placeholder-gray-600"
                  />
                  <div className="text-xs mt-1 text-darkmoon-text-secondary">
                    留空使用默认模型名称
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
                  <div
                    className="text-xs space-y-1 text-darkmoon-text-secondary"
                  >
                    <div>{t('modelConfigInfo1', language)}</div>
                    <div>{t('modelConfigInfo2', language)}</div>
                    <div>{t('modelConfigInfo3', language)}</div>
                  </div>
                </div>
              </>
            )}
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
              disabled={!selectedModel || !apiKey.trim()}
              className="flex-1 px-4 py-2 rounded text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-darkmoon-gold text-black hover:bg-darkmoon-gold-light transition-colors"
            >
              {t('saveConfig', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
