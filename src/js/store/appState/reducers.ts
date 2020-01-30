import {
  AppState,
  AppStateTypes,
  TOGGLE_TABVIEW_PANEL,
  SELECT_ACTIVE_TAB,
  SET_LANGUAGE,
  RENDER_MODAL,
  SET_MEASURE_WIDGET_RESULTS
} from './types';

const initialState: AppState = {
  selectedLanguage: 'en',
  renderModal: '',
  leftPanel: {
    tabViewVisible: true,
    activeTab: 'layers'
  },
  measurementResults: {}
};

export function appStateReducer(
  state = initialState,
  action: AppStateTypes
): AppState {
  switch (action.type) {
    case TOGGLE_TABVIEW_PANEL:
      return {
        ...state,
        leftPanel: {
          ...state.leftPanel,
          tabViewVisible: action.payload
        }
      };
    case RENDER_MODAL:
      return { ...state, renderModal: action.payload };
    case SELECT_ACTIVE_TAB:
      return {
        ...state,
        leftPanel: {
          ...state.leftPanel,
          activeTab: action.payload
        }
      };
    case SET_LANGUAGE:
      return { ...state, selectedLanguage: action.payload };
    case SET_MEASURE_WIDGET_RESULTS:
      return { ...state, measurementResults: action.payload };
    default:
      return state;
  }
}
