import React from 'react';
import { Settings as SettingsType } from '../types';
import { Save, Trash2, Download, Upload } from 'lucide-react';

interface SettingsProps {
  settings: SettingsType;
  onSave: (settings: SettingsType) => void;
  onClearData: () => void;
  onExportData: () => void;
  onImportData: (data: string) => void;
}

export default function Settings({ settings, onSave, onClearData, onExportData, onImportData }: SettingsProps) {
  const [localSettings, setLocalSettings] = React.useState<SettingsType>(settings);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onImportData(content);
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
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

      <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Data Management / ڊيٽا مينيجمينٽ</h3>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={onExportData}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Download size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">Export Data</p>
                <p className="text-xs text-gray-500">Download backup file</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                <Upload size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">Import Data</p>
                <p className="text-xs text-gray-500">Restore from backup</p>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </button>

          <button
            onClick={onClearData}
            className="flex items-center justify-between p-4 border border-red-100 rounded-xl hover:bg-red-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
                <Trash2 size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-red-600">Clear All Data</p>
                <p className="text-xs text-red-400">Delete all records permanently</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
