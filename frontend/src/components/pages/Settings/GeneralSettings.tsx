import { useSettingsStore } from '../../../stores/settingsStore';
import { cn } from '../../../utils/cn';
import { useI18n } from '../../../i18n/useI18n';

export function GeneralSettings() {
  const { settings, setTheme, setAutoGenerateTitle, setPreserveInputDraft, language, setLanguage } = useSettingsStore();
  const { t } = useI18n();

  return (
    <div className="max-w-5xl mx-auto w-full px-8 py-8 animate-fade-in-up">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
          {t('gen_config')}
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface font-display tracking-tight leading-tight mb-4">
          {t('gen_global_settings')}
        </h2>
        <p className="text-on-surface-variant text-base md:text-lg max-w-2xl leading-relaxed">
          {t('gen_global_desc')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <section className="bg-surface-container rounded-xl p-6 transition-all duration-300 hover:bg-surface-bright">
          <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">palette</span>
            {t('gen_appearance')}
          </h3>

          {/* Language Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-on-surface-variant mb-3 block">{t('gen_language')}</label>
            <div className="flex gap-3">
              {(['system', 'en', 'zh'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                    language === lang
                      ? 'bg-primary-container text-on-primary-container ring-1 ring-primary/30'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                  )}
                >
                  {lang === 'system' ? t('gen_lang_system') : lang === 'zh' ? '中文' : 'English'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['dark', 'light', 'system'] as const).map((t_theme) => (
              <button
                key={t_theme}
                onClick={() => setTheme(t_theme)}
                className={cn(
                  'p-5 rounded-xl border transition-all duration-200 flex flex-col items-center gap-3',
                  settings.theme === t_theme
                    ? 'border-primary bg-primary-container/10 text-primary ring-1 ring-primary/20'
                    : 'border-outline-variant/20 hover:border-primary/30 text-on-surface-variant hover:bg-surface-container-highest'
                )}
              >
                <span className="material-symbols-outlined text-3xl">
                  {t_theme === 'dark' ? 'dark_mode' : t_theme === 'light' ? 'light_mode' : 'brightness_auto'}
                </span>
                <span className="text-sm font-bold tracking-wide">
                  {t_theme === 'dark' ? t('gen_theme_dark') : t_theme === 'light' ? t('gen_theme_light') : t('gen_theme_system')}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Application Behavior */}
        <section className="bg-surface-container rounded-xl overflow-hidden transition-all duration-300 hover:bg-surface-bright">
          <div className="px-6 pt-6 pb-2">
            <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">psychology</span>
              {t('gen_behavior')}
            </h3>
          </div>

          <div className="divide-y divide-outline-variant/10">
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <div className="text-sm font-bold text-on-surface mb-1">{t('gen_auto_title')}</div>
                <div className="text-xs text-on-surface-variant">{t('gen_auto_title_desc')}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.autoGenerateTitle} onChange={(e) => setAutoGenerateTitle(e.target.checked)} />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <div className="text-sm font-bold text-on-surface mb-1">{t('gen_draft')}</div>
                <div className="text-xs text-on-surface-variant">{t('gen_draft_desc')}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.preserveInputDraft} onChange={(e) => setPreserveInputDraft(e.target.checked)} />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="bg-surface-container rounded-xl p-6 flex flex-row items-center justify-between transition-all duration-300 hover:bg-surface-bright">
          <div>
            <h3 className="text-xl font-bold text-on-surface mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">database</span>
              {t('gen_data')}
            </h3>
            <div className="text-xs text-on-surface-variant pl-8">{t('gen_data_desc')}</div>
          </div>
          <button className="px-5 py-2.5 rounded-full border border-outline-variant/30 hover:border-primary hover:text-primary bg-surface-container-lowest text-sm text-on-surface font-bold transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-base">download</span>
            {t('gen_export')}
          </button>
        </section>
      </div>
    </div>
  );
}
