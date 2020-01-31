import { OVERWRITE_SETTINGS, AppSettings } from './types';

export function overwriteSettings(newSettings: AppSettings): object {
  return {
    type: OVERWRITE_SETTINGS,
    payload: newSettings
  };
}
