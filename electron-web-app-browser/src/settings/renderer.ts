import { ISettingsDefinition } from "../types/ISettingsDefinition";

class SettingsRenderer {
    constructor() {
        // Initialization code if needed
        this.init();
    }

    private async init() {
      const getById = (id: string)=> document.getElementById(id);
      const txtAppDisplayName = getById('txtAppDisplayName') as HTMLInputElement | null;
      const txtAppPath = getById('txtAppPath') as HTMLInputElement | null;
      const txtExecutableName = getById('txtExecutableName') as HTMLInputElement | null;
      const chkHideConsoleWindow = getById('chkHideConsoleWindow') as HTMLInputElement | null;
      const txtAppUrl = getById('txtAppUrl') as HTMLInputElement | null;
      const txtAppIcon = getById('txtAppIcon') as HTMLInputElement | null;
      const btnBrowseAppPath = getById('btnBrowseAppPath') as HTMLButtonElement | null;
      const btnBrowseAppIcon = getById('btnBrowseAppIcon') as HTMLButtonElement | null;
      const btnSaveSettings = getById('btnSaveSettings') as HTMLButtonElement | null;
      const btnCancel = getById('btnCancel') as HTMLButtonElement | null;

      if (!txtAppDisplayName || !txtAppPath || !txtExecutableName || !chkHideConsoleWindow || !txtAppUrl || !txtAppIcon || !btnBrowseAppPath || !btnBrowseAppIcon || !btnSaveSettings || !btnCancel) {
        throw new Error('Required DOM elements not found');
      }

      console.log('Settings Renderer initialized');
      window.electronAPI.logConsole('Settings Renderer initialized - logged with api');

      try {
          // load settings
          const settings = await window.electronAPI.readSettings();
          if(settings) {
            console.log('Settings read');
            console.log(settings);
            let parsed = null;
            try { parsed = JSON.parse(settings); } catch (e) { parsed = null; }
            
            if (txtAppDisplayName) txtAppDisplayName.value = parsed.AppDisplayName || parsed.appDisplayName || '';
            if (txtAppPath) txtAppPath.value = parsed.AppPath || parsed.appPath || '';
            if (txtExecutableName) txtExecutableName.value = parsed.ExecutableName || parsed.executableName || '';
            if (chkHideConsoleWindow) chkHideConsoleWindow.checked = parsed.HideConsoleWindow || false;
            if (txtAppUrl) txtAppUrl.value = parsed.AppUrl || parsed.appUrl || '';
            if (txtAppIcon) txtAppIcon.value = parsed.AppIcon || parsed.appIcon || '';

          }
          else {
            window.electronAPI.logConsole('No existing settings.')
          }

      } catch (err) {
          console.error('Failed to load settings:', err);
      }


      btnBrowseAppPath.addEventListener('click', async () => {
      const fileResult = await window.electronAPI.selectFile({ filters: [{ name: 'Executables', extensions: ['exe', '*'] }] });
      const file = Array.isArray(fileResult) && fileResult.length > 0 ? fileResult[0] : null;
      if (file) {
        // store directory and executable name separately, like WPF
        try {
          const parts = file.split(/\\|\//);
          const exe = parts.pop();
          const dir = parts.join('\\');
          txtAppPath.value = dir;
          txtExecutableName.value = exe;
        } catch (e) {
          txtAppPath.value = file;
        }
      }
      });

      btnBrowseAppIcon.addEventListener('click', async () => {
        const fileResult = await window.electronAPI.selectFile({ filters: [{ name: 'Icons', extensions: ['ico', 'png', 'svg'] }] });
        const file = Array.isArray(fileResult) && fileResult.length > 0 ? fileResult[0] : null;
        if (file) txtAppIcon.value = file;
      });

      btnSaveSettings.addEventListener('click', async () => {
        const settings: ISettingsDefinition = {
          AppDisplayName: txtAppDisplayName.value || '',
          AppPath: txtAppPath.value || '',
          ExecutableName: txtExecutableName.value || '',
          AppUrl: txtAppUrl.value || '',
          HideConsoleWindow: !!chkHideConsoleWindow.checked,
          AppIcon: txtAppIcon.value || ''
        };
        const res = await window.electronAPI.saveSettings(settings);
        if (res && res.ok) {
          btnSaveSettings.textContent = '✔ Saved';
          setTimeout(() => window.close(), 600);
        } else {
          alert('Failed to save settings: ' + (res && res.error));
        }
      });


      btnCancel.addEventListener('click', () => window.close());
    }
}

new SettingsRenderer();