import AnalysisPanel from 'components/AnalysisPanel/AnalysisPanel';
import LayerPanel from 'components/LayerPanel/LayerPanel';
import MobileMenu from 'components/TabPanel/MobileMenu';
import LayerToggles from 'components/LayerPanel/LayerToggles';
import InfoWindow from 'components/TabPanel/InfoWindow';
import Documents from 'components/TabPanel/Documents';
import tabKeys from 'constants/TabViewConstants';
import text from 'js/languages';
import React, {
  Component,
  PropTypes
} from 'react';

const {
  DOCUMENTS,
  LAYERS,
  ANALYSIS,
  INFO_WINDOW,
  MORE
} = tabKeys;

export default class TabView extends Component {

  static contextTypes = {
    settings: PropTypes.object.isRequired,
    language: PropTypes.string.isRequired,
    map: PropTypes.object.isRequired
  };

  getClassName = (id) => {
    return `tab-view__content ${id === this.props.activeTab ? 'selected' : ''}`;
  };

  getContainerClass = () => {
    const {activeTab, tableOfContentsVisible} = this.props;
    return (
      activeTab === DOCUMENTS ||
      activeTab === LAYERS ||
      activeTab === ANALYSIS ||
      activeTab === INFO_WINDOW ||
      activeTab === MORE
    ) && tableOfContentsVisible ? '' : 'hidden';
  };

  render () {
    let {map, settings, language} = this.context;

    return (
      <div className={`tab-view map-component custom-scroll shadow ${this.getContainerClass()}`}>
        <div className={this.getClassName(LAYERS)}>
          <h3 className='tab-view__mobile-header mobile-show'>{text[language].LAYERS}</h3>
          <LayerToggles />
          <LayerPanel loaded={map.loaded} {...this.props} />
        </div>
        <div className={this.getClassName(INFO_WINDOW)}>
          <h3 className='tab-view__mobile-header mobile-show'>{text[language].DATA}</h3>
          <InfoWindow map={map} />
        </div>
        <div className={this.getClassName(ANALYSIS)}>
          <h3 className='tab-view__mobile-header mobile-show'>{text[language].ANALYZE}</h3>
          <AnalysisPanel {...this.props} />
        </div>
        {!settings.includeDocumentsTab ? null :
          <div className={this.getClassName(DOCUMENTS)}>
            <h3 className='tab-view__mobile-header mobile-show'>{text[language].DOCS}</h3>
            <Documents active={this.props.activeTab === DOCUMENTS} />
          </div>
        }
        <div className={`${this.getClassName(MORE)} mobile-show`}>
          <h3 className='tab-view__mobile-header mobile-show'>{text[language].MORE}</h3>
          <MobileMenu />
        </div>
      </div>
    );
  }

}

TabView.propTypes = {
  activeTab: React.PropTypes.string.isRequired
};
