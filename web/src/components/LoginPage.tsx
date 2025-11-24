import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../i18n/translations'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './ui/input'
import { toast } from 'sonner'
import { useSystemConfig } from '../hooks/useSystemConfig'

export function LoginPage() {
  const { language } = useLanguage()
  const { login, loginAdmin, verifyOTP } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [userID, setUserID] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const adminMode = false
  const { config: systemConfig } = useSystemConfig()
  const registrationEnabled = systemConfig?.registration_enabled !== false
  const [expiredToastId, setExpiredToastId] = useState<string | number | null>(null)

  // Show notification if user was redirected here due to 401
  useEffect(() => {
    if (sessionStorage.getItem('from401') === 'true') {
      const id = toast.warning(t('sessionExpired', language), {
        duration: Infinity // Keep showing until user dismisses or logs in
      })
      setExpiredToastId(id)
      sessionStorage.removeItem('from401')
    }
  }, [language])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await loginAdmin(adminPassword)
    if (!result.success) {
      const msg = result.message || t('loginFailed', language)
      setError(msg)
      toast.error(msg)
    } else {
      if (expiredToastId) {
        toast.dismiss(expiredToastId)
      }
    }
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      if (result.requiresOTP && result.userID) {
        setUserID(result.userID)
        setStep('otp')
      } else {
        if (expiredToastId) {
          toast.dismiss(expiredToastId)
        }
      }
    } else {
      const msg = result.message || t('loginFailed', language)
      setError(msg)
      toast.error(msg)
    }

    setLoading(false)
  }

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await verifyOTP(userID, otpCode)

    if (!result.success) {
      const msg = result.message || t('verificationFailed', language)
      setError(msg)
      toast.error(msg)
    } else {
      if (expiredToastId) {
        toast.dismiss(expiredToastId)
      }
    }

    setLoading(false)
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
            登录 DarkMoon
          </h1>
          <p className="text-sm mt-2 text-darkmoon-text-secondary">
            {step === 'login' ? '请输入您的邮箱和密码' : '请输入两步验证码'}
          </p>
        </div>

        {/* Login Form */}
        <div className="rounded-xl p-8 bg-darkmoon-surface border border-darkmoon-border shadow-xl">
          {adminMode ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-darkmoon-text-secondary">
                  管理员密码
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-darkmoon-bg border border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold outline-none"
                  placeholder="请输入管理员密码"
                  required
                />
              </div>

              {error && (
                <div className="text-sm px-3 py-2 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50 bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black hover:shadow-darkmoon-gold/30"
              >
                {loading ? t('loading', language) : '登录'}
              </button>
            </form>
          ) : step === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
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
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/reset-password')}
                    className="text-xs hover:underline text-darkmoon-gold hover:text-[#F3CF55]"
                  >
                    {t('forgotPassword', language)}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm px-3 py-2 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50 bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black hover:shadow-darkmoon-gold/30"
              >
                {loading ? t('loading', language) : t('loginButton', language)}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPVerify} className="space-y-4">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📱</div>
                <p className="text-sm text-darkmoon-text-secondary">
                  {t('scanQRCodeInstructions', language)}
                  <br />
                  {t('enterOTPCode', language)}
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
                  onClick={() => setStep('login')}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-darkmoon-surface-hover text-darkmoon-text-secondary hover:text-darkmoon-text-primary border border-darkmoon-border"
                >
                  {t('back', language)}
                </button>
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50 bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black hover:shadow-darkmoon-gold/30"
                >
                  {loading ? t('loading', language) : t('verifyOTP', language)}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Register Link */}
        {!adminMode && registrationEnabled && (
          <div className="text-center mt-6">
            <p className="text-sm text-darkmoon-text-secondary">
              还没有账户？{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-semibold hover:underline transition-colors text-darkmoon-gold hover:text-[#F3CF55]"
              >
                立即注册
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
