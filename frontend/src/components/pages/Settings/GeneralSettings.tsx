import { useSettingsStore } from '../../../stores/settingsStore';
import { cn } from '../../../utils/cn';

export function GeneralSettings() {
  const { settings, setTheme, setAutoGenerateTitle, setPreserveInputDraft } = useSettingsStore();

  return (
    <div className="max-w-5xl mx-auto w-full px-8 py-8 animate-fade-in-up">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
          Configuration
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface font-display tracking-tight leading-tight mb-4">
          Global Settings
        </h2>
        <p className="text-on-surface-variant text-base md:text-lg max-w-2xl leading-relaxed">
          Configure your application preferences, interface themes, and data management.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <section className="bg-surface-container rounded-xl p-6 transition-all duration-300 hover:bg-surface-bright">
          <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">palette</span>
            Appearance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['dark', 'light', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  'p-5 rounded-xl border transition-all duration-200 flex flex-col items-center gap-3',
                  settings.theme === t
                    ? 'border-primary bg-primary-container/10 text-primary ring-1 ring-primary/20'
                    : 'border-outline-variant/20 hover:border-primary/30 text-on-surface-variant hover:bg-surface-container-highest'
                )}
              >
                <span className="material-symbols-outlined text-3xl">
                  {t === 'dark' ? 'dark_mode' : t === 'light' ? 'light_mode' : 'brightness_auto'}
                </span>
                <span className="capitalize text-sm font-bold tracking-wide">{t} Theme</span>
              </button>
            ))}
          </div>
        </section>

        {/* Application Behavior */}
        <section className="bg-surface-container rounded-xl overflow-hidden transition-all duration-300 hover:bg-surface-bright">
          <div className="px-6 pt-6 pb-2">
            <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">psychology</span>
              Application Behavior
            </h3>
          </div>
          
          <div className="divide-y divide-outline-variant/10">
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <div className="text-sm font-bold text-on-surface mb-1">Auto-generate Session Titles</div>
                <div className="text-xs text-on-surface-variant">Use AI to automatically extract a concise title from your first message.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.autoGenerateTitle} onChange={(e) => setAutoGenerateTitle(e.target.checked)} />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <div className="text-sm font-bold text-on-surface mb-1">Preserve Input Draft</div>
                <div className="text-xs text-on-surface-variant">Keep unsent text in the input box when effortlessly switching between sessions.</div>
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
              Data Management
            </h3>
            <div className="text-xs text-on-surface-variant pl-8">Download all your sessions, agent configuration, and tags as a unified backup.</div>
          </div>
          <button className="px-5 py-2.5 rounded-full border border-outline-variant/30 hover:border-primary hover:text-primary bg-surface-container-lowest text-sm text-on-surface font-bold transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-base">download</span>
            Export Backup
          </button>
        </section>
      </div>
    </div>
  );
}
