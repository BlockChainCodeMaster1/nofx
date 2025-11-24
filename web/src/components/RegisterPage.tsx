import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../i18n/translations'
import { getSystemConfig } from '../lib/config'
import { toast } from 'sonner'
import { copyWithToast } from '../lib/clipboard'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './ui/input'
import PasswordChecklist from 'react-password-checklist'
import { RegistrationDisabled } from './RegistrationDisabled'

export function RegisterPage() {
  const { language } = useLanguage()
  const { register, completeRegistration } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<'register' | 'setup-otp' | 'verify-otp'>(
    'register'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [betaCode, setBetaCode] = useState('')
  const [betaMode, setBetaMode] = useState(false)
  const [registrationEnabled, setRegistrationEnabled] = useState(true)
  const [otpCode, setOtpCode] = useState('')
  const [userID, setUserID] = useState('')
  const [otpSecret, setOtpSecret] = useState('')
  const [qrCodeURL, setQrCodeURL] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    getSystemConfig()
      .then((config) => {
        setBetaMode(config.beta_mode || false)
        setRegistrationEnabled(config.registration_enabled !== false)
      })
      .catch((err) => {
        console.error('Failed to fetch system config:', err)
      })
  }, [])

  if (!registrationEnabled) {
    return <RegistrationDisabled />
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!passwordValid) {
      setError(t('passwordNotMeetRequirements', language))
      return
    }

    if (betaMode && !betaCode.trim()) {
      setError('内测期间，注册需要提供内测码')
      return
    }

    setLoading(true)

    const result = await register(email, password, betaCode.trim() || undefined)

    if (result.success && result.userID) {
      setUserID(result.userID)
      setOtpSecret(result.otpSecret || '')
      setQrCodeURL(result.qrCodeURL || '')
      setStep('setup-otp')
    } else {
      const msg = result.message || t('registrationFailed', language)
      setError(msg)
    }

    setLoading(false)
  }

  const handleSetupComplete = () => {
    setStep('verify-otp')
  }

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await completeRegistration(userID, otpCode)

    if (!result.success) {
      const msg = result.message || t('registrationFailed', language)
      setError(msg)
      toast.error(msg)
    }

    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    copyWithToast(text)
  }

  return (
    <div
      className="flex items-center justify-center py-12"
      style={{ minHeight: 'calc(100vh - 64px)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <img
              src="/icons/nofx.svg"
              alt="DarkMoon Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-darkmoon-text-primary">
            {t('appTitle', language)}
          </h1>
          <p className="text-sm mt-2 text-darkmoon-text-secondary">
            {step === 'register' && t('registerTitle', language)}
            {step === 'setup-otp' && t('setupTwoFactor', language)}
            {step === 'verify-otp' && t('verifyOTP', language)}
          </p>
        </div>

        {/* Registration Form */}
        <div className="rounded-xl p-8 bg-darkmoon-surface border border-darkmoon-border shadow-xl">
          {step === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-darkmoon-text-secondary">
                  {t('email', language)}
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder', language)}
                  required
                  className="bg-darkmoon-bg border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-darkmoon-text-secondary">
                  {t('password', language)}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 bg-darkmoon-bg border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold"
                    placeholder={t('passwordPlaceholder', language)}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 w-8 h-10 flex items-center justify-center rounded bg-transparent p-0 m-0 border-0 outline-none focus:outline-none focus:ring-0 appearance-none cursor-pointer text-darkmoon-text-secondary hover:text-darkmoon-text-primary"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-darkmoon-text-secondary">
                  {t('confirmPassword', language)}
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 bg-darkmoon-bg border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold"
                    placeholder={t('confirmPasswordPlaceholder', language)}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? '隐藏密码' : '显示密码'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 w-8 h-10 flex items-center justify-center rounded bg-transparent p-0 m-0 border-0 outline-none focus:outline-none focus:ring-0 appearance-none cursor-pointer text-darkmoon-text-secondary hover:text-darkmoon-text-primary"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* 密码规则清单 */}
              <div className="mt-1 text-xs text-darkmoon-text-secondary">
                <div className="mb-1 text-darkmoon-text-muted">
                  {t('passwordRequirements', language)}
                </div>
                <PasswordChecklist
                  rules={[
                    'minLength',
                    'capital',
                    'lowercase',
                    'number',
                    'specialChar',
                    'match',
                  ]}
                  minLength={8}
                  value={password}
                  valueAgain={confirmPassword}
                  messages={{
                    minLength: t('passwordRuleMinLength', language),
                    capital: t('passwordRuleUppercase', language),
                    lowercase: t('passwordRuleLowercase', language),
                    number: t('passwordRuleNumber', language),
                    specialChar: t('passwordRuleSpecial', language),
                    match: t('passwordRuleMatch', language),
                  }}
                  className="space-y-1"
                  onChange={(isValid) => setPasswordValid(isValid)}
                />
              </div>

              {betaMode && (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-darkmoon-text-secondary">
                    内测码 *
                  </label>
                  <input
                    type="text"
                    value={betaCode}
                    onChange={(e) =>
                      setBetaCode(
                        e.target.value.replace(/[^a-z0-9]/gi, '').toLowerCase()
                      )
                    }
                    className="w-full px-3 py-2 rounded font-mono bg-darkmoon-bg border border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold outline-none"
                    placeholder="请输入6位内测码"
                    maxLength={6}
                    required={betaMode}
                  />
                  <p className="text-xs mt-1 text-darkmoon-text-muted">
                    内测码由6位字母数字组成，区分大小写
                  </p>
                </div>
              )}

              {error && (
                <div className="text-sm px-3 py-2 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loading || (betaMode && !betaCode.trim()) || !passwordValid
                }
                className="w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50 bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black hover:shadow-darkmoon-gold/30"
              >
                {loading
                  ? t('loading', language)
                  : t('registerButton', language)}
              </button>
            </form>
          )}

          {step === 'setup-otp' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <h3 className="text-lg font-semibold mb-2 text-darkmoon-text-primary">
                  {t('setupTwoFactor', language)}
                </h3>
                <p className="text-sm text-darkmoon-text-secondary">
                  {t('setupTwoFactorDesc', language)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded bg-darkmoon-bg border border-darkmoon-border">
                  <p className="text-sm font-semibold mb-2 text-darkmoon-text-primary">
                    {t('authStep1Title', language)}
                  </p>
                  <p className="text-xs text-darkmoon-text-secondary">
                    {t('authStep1Desc', language)}
                  </p>
                </div>

                <div className="p-3 rounded bg-darkmoon-bg border border-darkmoon-border">
                  <p className="text-sm font-semibold mb-2 text-darkmoon-text-primary">
                    {t('authStep2Title', language)}
                  </p>
                  <p className="text-xs mb-2 text-darkmoon-text-secondary">
                    {t('authStep2Desc', language)}
                  </p>

                  {qrCodeURL && (
                    <div className="mt-2">
                      <p className="text-xs mb-2 text-darkmoon-text-secondary">
                        {t('qrCodeHint', language)}
                      </p>
                      <div className="bg-white p-2 rounded text-center w-fit mx-auto">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeURL)}`}
                          alt="QR Code"
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-2">
                    <p className="text-xs mb-1 text-darkmoon-text-secondary">
                      {t('otpSecret', language)}
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-2 py-1 text-xs rounded font-mono bg-darkmoon-surface-hover text-darkmoon-text-primary border border-darkmoon-border">
                        {otpSecret}
                      </code>
                      <button
                        onClick={() => copyToClipboard(otpSecret)}
                        className="px-2 py-1 text-xs rounded bg-darkmoon-gold text-black hover:bg-[#F3CF55]"
                      >
                        {t('copy', language)}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded bg-darkmoon-bg border border-darkmoon-border">
                  <p className="text-sm font-semibold mb-2 text-darkmoon-text-primary">
                    {t('authStep3Title', language)}
                  </p>
                  <p className="text-xs text-darkmoon-text-secondary">
                    {t('authStep3Desc', language)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSetupComplete}
                className="w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black hover:shadow-darkmoon-gold/30"
              >
                {t('setupCompleteContinue', language)}
              </button>
            </div>
          )}

          {step === 'verify-otp' && (
            <form onSubmit={handleOTPVerify} className="space-y-4">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🔐</div>
                <p className="text-sm text-darkmoon-text-secondary">
                  {t('enterOTPCode', language)}
                  <br />
                  {t('completeRegistrationSubtitle', language)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-darkmoon-text-secondary">
                  {t('otpCode', language)}
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  className="w-full px-3 py-2 rounded text-center text-2xl font-mono bg-darkmoon-bg border border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold outline-none"
                  placeholder={t('otpPlaceholder', language)}
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="text-sm px-3 py-2 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('setup-otp')}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-darkmoon-surface-hover text-darkmoon-text-secondary hover:text-darkmoon-text-primary border border-darkmoon-border"
                >
                  {t('back', language)}
                </button>
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50 bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black hover:shadow-darkmoon-gold/30"
                >
                  {loading
                    ? t('loading', language)
                    : t('completeRegistration', language)}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Login Link */}
        {step === 'register' && (
          <div className="text-center mt-6">
            <p className="text-sm text-darkmoon-text-secondary">
              已有账户？{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-semibold hover:underline transition-colors text-darkmoon-gold hover:text-[#F3CF55]"
              >
                立即登录
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
