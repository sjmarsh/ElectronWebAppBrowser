import { ISettingsDefinition } from "../types/ISettingsDefinition";

class SettingsRenderer {
    constructor() {
        // Initialization code if needed
        this.init();
    }

    private async init() {
      const getById = (id: string)=> document.getElementById(id);
      const frmSettings = getById('frmSettings') as HTMLFormElement | null;
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

      if (!frmSettings || !txtAppDisplayName || !txtAppPath || !txtExecutableName || !chkHideConsoleWindow || !txtAppUrl || !txtAppIcon || !btnBrowseAppPath || !btnBrowseAppIcon || !btnSaveSettings || !btnCancel) {
        throw new Error('Required DOM elements not found');
      }

      window.electronAPI.log('Settings Renderer initialized - logged with api');

      // add validation messages
      this.setValidationMessage(txtAppPath, 'Please select or enter a valid path for the Web Application');
      this.setValidationMessage(txtExecutableName, 'Please select or enter a valid executalbe name for the Web Application');
      this.setValidationMessage(txtAppUrl, 'Please enter a valid URL for the Web Application');

      const populateSettings = async () => {
        try {
          // load settings
          const settings = await window.electronAPI.readSettings();
          if(settings) {
            if (txtAppDisplayName) txtAppDisplayName.value = settings.AppDisplayName;
            if (txtAppPath) txtAppPath.value = settings.AppPath;
            if (txtExecutableName) txtExecutableName.value = settings.ExecutableName;
            if (chkHideConsoleWindow) chkHideConsoleWindow.checked = settings.HideConsoleWindow;
            if (txtAppUrl) txtAppUrl.value = settings.AppUrl;
            if (txtAppIcon) txtAppIcon.value = settings.AppIcon;
          }
          else {
            window.electronAPI.log('No existing settings.')
          }
        } catch (err) {
            window.electronAPI.logErrorDetail('Failed to load settings:', err);
        }
      }
      await populateSettings();

      btnBrowseAppPath.addEventListener('click', async () => {
        const fileResult = await window.electronAPI.selectFile({ filters: [{ name: 'Executables', extensions: ['exe', '*'] }] });
        window.electronAPI.logErrorDetail('Browse App Path Selection: ', fileResult);
        const file = Array.isArray(fileResult) && fileResult.length > 0 ? fileResult[0] : null;
        if (file) {
          // store directory and executable name separately
          try {
            const parts = file.split(/\\|\//);
            const exe = parts.pop();
            const dir = parts.join('//');
            txtAppPath.value = dir;
            txtExecutableName.value = exe ?? '';
          } catch (e) {
            txtAppPath.value = file;
          }
        }
      });

      btnBrowseAppIcon.addEventListener('click', async () => {
        const fileResult = await window.electronAPI.selectFile({ filters: [{ name: 'Icons', extensions: ['ico', 'png', 'svg'] }] });
        window.electronAPI.logDetail('Browse App Icon selection:', fileResult);
        const file = Array.isArray(fileResult) && fileResult.length > 0 ? fileResult[0] : null;
        if (file) txtAppIcon.value = file;
      });

      frmSettings.addEventListener('submit', async () => {
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
          //setTimeout(() => window.electronAPI.closeSettingsWindow(), 600);
        } else {
          alert('Failed to save settings: ' + (res && res.error));
        }
      });

      btnCancel.addEventListener('click', async () => { 
        await populateSettings();
        window.electronAPI.closeSettingsWindow() 
      });
    }

    private setValidationMessage = (el: HTMLInputElement, message: string) => {
      el.oninvalid = (ev: Event) => {
        el.setCustomValidity(message);
      }
      el.onblur = (ev: Event) => {
        el.setCustomValidity('');
      }
    }
}

new SettingsRenderer();