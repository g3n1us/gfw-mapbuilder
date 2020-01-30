import DistanceMeasurement2D from 'esri/widgets/DistanceMeasurement2D';
import AreaMeasurement2D from 'esri/widgets/AreaMeasurement2D';

export interface LeftPanel {
  tabViewVisible: boolean;
  activeTab: string;
}

export interface MeasurementResults {
  geometry?: any;
  area?: number;
  permeter?: number;
  distance?: number;
}

export interface AppState {
  leftPanel: LeftPanel;
  renderModal: string;
  selectedLanguage: string;
  measurementResults: MeasurementResults;
}

//Action names available
export const RENDER_MODAL = 'RENDER_MODAL';
export const SELECT_ACTIVE_TAB = 'SELECT_ACTIVE_TAB';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const TOGGLE_TABVIEW_PANEL = 'TOGGLE_TABVIEW_PANEL';
export const SET_MEASURE_WIDGET_RESULTS = 'SET_MEASURE_WIDGET_RESULTS';

interface MeasureWidgetAction {
  type: typeof SET_MEASURE_WIDGET_RESULTS;
  payload: AppState['measurementResults'];
}

interface ToggleTabviewPanelAction {
  type: typeof TOGGLE_TABVIEW_PANEL;
  payload: LeftPanel['tabViewVisible'];
}

interface RenderModalAction {
  type: typeof RENDER_MODAL;
  payload: AppState['renderModal'];
}

interface SelectActiveTab {
  type: typeof SELECT_ACTIVE_TAB;
  payload: LeftPanel['activeTab'];
}

interface SetLanguageAction {
  type: typeof SET_LANGUAGE;
  payload: AppState['selectedLanguage'];
}

export type AppStateTypes =
  | ToggleTabviewPanelAction
  | RenderModalAction
  | SelectActiveTab
  | SetLanguageAction
  | MeasureWidgetAction;
