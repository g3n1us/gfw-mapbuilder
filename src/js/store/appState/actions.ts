import {
  TOGGLE_TABVIEW_PANEL,
  RENDER_MODAL,
  SELECT_ACTIVE_TAB,
  SET_LANGUAGE,
  AppState,
  LeftPanel
} from './types';

export function toggleTabviewPanel(
  payload: LeftPanel['tabViewVisible']
): object {
  return {
    type: TOGGLE_TABVIEW_PANEL,
    payload: payload
  };
}

export function renderModal(payload: AppState['renderModal']): object {
  return {
    type: RENDER_MODAL,
    payload: payload
  };
}

export function selectActiveTab(payload: LeftPanel['activeTab']): object {
  return {
    type: SELECT_ACTIVE_TAB,
    payload: payload
  };
}

export function setLanguage(payload: AppState['selectedLanguage']): object {
  return {
    type: SET_LANGUAGE,
    payload: payload
  };
}
