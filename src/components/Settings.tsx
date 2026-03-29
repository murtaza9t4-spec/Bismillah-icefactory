import React from 'react';
import { Settings as SettingsType } from '../types';
import { Save } from 'lucide-react';

interface SettingsProps {
  settings: SettingsType;
  onSave: (settings: SettingsType) => void;
}

export default function Settings({ settings, onSave }: SettingsProps) {
  const [localSettings, setLocalSettings] = React.useState<SettingsType>(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
        <span className="text-xl">⚙️</span> Settings / سیٹنگز
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gola Price (گولا قیمت)
          </label>
          <input
            type="number"
            name="golaPrice"
            value={localSettings.golaPrice}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Next Receipt No (نمبر)
          </label>
          <input
            type="number"
            name="nextReceiptNo"
            value={localSettings.nextReceiptNo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Gola Stock (کل گولا اسٹاک)
          </label>
          <input
            type="number"
            name="totalStock"
            value={localSettings.totalStock}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
          />
        </div>

        <button
          onClick={() => onSave(localSettings)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 mt-8"
        >
          <Save size={24} />
          <div className="text-left">
            <p className="text-xs uppercase tracking-widest opacity-80">Configuration</p>
            <p className="text-lg">Save Settings / <span className="font-sindhi">محفوظ ڪريو</span></p>
          </div>
        </button>
      </div>
    </div>
  );
}
