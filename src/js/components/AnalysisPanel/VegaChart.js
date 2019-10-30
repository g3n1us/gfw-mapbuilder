import React, { Component } from 'react';
import charts from 'utils/charts';
import SVGIcon from 'utils/svgIcon';
import { urls } from 'js/config';
import ReportSettings from '../../report/ReportSettings';
import Loader from '../Loader';
import Measure from 'react-measure';
import resources from '../../../resources';
import {defaultColorTheme} from '../../config';

export default class VegaChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isError: false,
      errorMsg: null,
      showDownloadOptions: false,
      downloadOptions: [],
      chartDownloadTitle: 'analysis.png',
      chartImgDownloadUrl: null,
      chartName: '',
      description: '',
      showSettings: false,
      isLoading: false,
      dimensions: {
        width: -1,
        height: -1
      }
    };
  }

  handleError(errorMsg) {
    this.setState({
      isError: true,
      errorMsg,
      isLoading: false
    });
    if (this.props.setLoading) {
      this.props.setLoading();
    }
  }

  componentDidMount() {
    if (this.props.results.hasOwnProperty('error')) {
      this.handleError();
    } else {
      this.setState({
        isLoading: true
      });
      const config = this.props.results.data.attributes.widgetConfig;
      console.log('config widgetConfig!', config);
      const selectedFeature = this.props.selectedFeature;
      const selectedAttributes = selectedFeature && selectedFeature.attributes ? selectedFeature.attributes : null; //Only WCS-specific widgets need this property
      console.log('this.props', this.props);
      debugger
      
      if (this.props.component === 'Report') {
        if (!config.signals) {
          config.signals = [];
        }
        config.autosize = {
          type: 'fit',
          resize: true
        };

        const resizeWidthSignal = {
          name: 'width',
          update: 'containerSize()[0]*0.95',
          value: '',
          on: [
            {
              events: {
                source: 'window',
                type: 'resize'
              },
              update: 'containerSize()[0]*0.95'
            }
          ]
        };
        config.signals.push(resizeWidthSignal);
      }

      // let baseUrl;
      const {setLoading, language} = this.props;
      console.log('config.data[0].url 1:');
      console.log( config.data[0].url);
      if (config.data[0].url.indexOf('?&') > -1) {
        const urlPieces = config.data[0].url.split('?&');
        config.data[0].url = `${urlPieces[0]}?${urlPieces[1]}`;
      }
      console.log('config.data[0].url 2:');
      console.log( config.data[0].url);
      console.log('');

      //IF WCS
      if (selectedAttributes && config.featureDataFieldsToPass) { // WCS Specific logic
        let analysisSuffix = '';
        let queryParams;
        const baseConfig = resources.analysisModules.find(mod => mod.widgetId === this.props.id);
        console.log('baseConfig', baseConfig);
        const baseUrl = config.data[0].url.split('?')[0];
        // url = config.data[0].url.split('?')[0];
        queryParams = encodeURI(config.featureDataFieldsToPass
          .filter(fieldName => {
            const fieldToSubstitute = baseConfig.fieldToSubstitute ? baseConfig.fieldToSubstitute : 'analyticId';
            return selectedAttributes[fieldName === 'analyticid' ? fieldToSubstitute : fieldName];
          })
          .map(fieldName => {
          const fieldToSubstitute = baseConfig.fieldToSubstitute ? baseConfig.fieldToSubstitute : 'analyticId';
          fieldName = fieldName === 'analyticid' ? fieldToSubstitute : fieldName;
          const value = selectedAttributes[fieldName];
          fieldName = fieldName === fieldToSubstitute ? 'analyticid' : fieldName;
          return `${fieldName}=${value}`;
        }).join('&'));
  
        //We have the correct queryParams, but this 'MapBuilderVegaSQL' also requires the analysisId from the analysisModule sent in as a param: analysisId=...
        if (baseConfig.analysisId) {
          analysisSuffix = encodeURI('analysisId=' + baseConfig.analysisId);
          queryParams += '&' + analysisSuffix;
          console.log('queryParams', queryParams);
          
          // url = `${baseUrl}?${queryParams}`;
          config.data[0].url = `${baseUrl}?${queryParams}`;
        }
      }

      const dataset = this.props.results.data.attributes.dataset;
      const id = this.props.results.data.id;
      // console.log('dataset', dataset);
      // console.log('id', id);

      // console.log('this.props', this.props);
      // debugger
      // console.log('urlurlurl', url);
      

      
      if (this.props.component === 'Report'){
        fetch(`https://production-api.globalforestwatch.org/v1/dataset/${dataset}/widget/${id}/metadata?language=${language}`).then(res => {
          res.json().then(json => {
            if (res.status !== 200) {
              this.setState({
                description: `Error retrieving description for ${this.props.reportLabel}`
              });
            } else {
              if (json.data && json.data.length > 0 && json.data[0].attributes) {
                this.setState({
                  description: json.data[0].attributes.description
                });
              }
            }
          });
        });
      }

        //TODO:


      //for WCS we USED TO just fire off the `makeVegaChart` function with lots of arguments and let that function run the makeEsriRequest get back data after
        //appending lots of params onto the URL. For Mapbuild we actually do that here (ANND we make a direct GFW API call for the `description` from the report which we'll get to)
            //let's do it all from here and let the charts.js render it! (change the wcs 'esriRequest' in charts.js to the 'fetch' call here after adding to url params!)

      // const selectedFeature = this.props.selectedFeature;
      // const attributes = selectedFeature && selectedFeature.attributes ? selectedFeature.attributes : null; //Only WCS-specific widgets need this property
      // charts.makeVegaChart(this.chart, config, this.props.setLoading, attributes, this.props.results.data.id, this.handleError);

      // charts.makeVegaChart(this.chart, config, language, setLoading, this.addChartDownload);


      //we have 6 for WCS, 5 for MB - we need to add language, addChartDownload to WCS. We need to add attributes, results.data.id, handleError to MB.
      //we need to figure out WHERE to make the analysis Request - in MB it is done Here, in WCS its done inside the charts.js makeVegaChart

      //we need to somehow differentiate if this request is a GFW API request!
        //Can we check for those 2 config properties that they use: 'featureDataFieldsToPass' and 'fieldToSubstitute' ?
      
      fetch(config.data[0].url).then(res => {
      // fetch(url).then(res => {
        if (res.status !== 200) {
          this.handleError(`Error creating analysis for ${this.props.reportLabel}`);
        } else {
          res.json().then(json => {
            console.log('we in??');
            
            charts.makeVegaChart(this.chart, json, language, setLoading, this.addChartDownload);
            const downloadOptions = [];
            if (json.data && json.data.attributes && json.data.attributes.downloadUrls && !json.data.attributes.downloadUrls.csv.includes('month') && !config.title) {
              const downloadUrls = json.data.attributes.downloadUrls;
              const label = 'csv';
              downloadOptions.push({label, url: downloadUrls[label]});
            }
            const chartDownloadTitle = json.data && json.data.type ? json.data.type + '-analysis.png' : 'analysis.png';
            this.setState({
              downloadOptions,
              chartDownloadTitle
            });
          }).then(
            this.setState({
              isLoading: false
            })
          );
        }
      })
      .catch(() => this.handleError(`Error creating analysis for ${this.props.reportLabel}`));
    }
  }

  addChartDownload = (url) => {
    this.setState({ chartImgDownloadUrl: url, isLoading: false });
  };

  renderdownloadOptions = (option, i) => {
    const baseUrl = urls.analysisDataBaseUrl;
    return (
      <a className="download-option" href={option.url.includes('cartodb') ? option.url : baseUrl + option.url} target="_blank" download key={`option-${i}`}>
        <span className='download-option-label'>Download Alerts as .CSV</span>
      </a>
    );
  };

  reRenderChart = (config) => {
    this.setState({
      isLoading: true
    });
    const {language, setLoading} = this.props;
    const widgetConfig = config.data.attributes.widgetConfig;
    widgetConfig.autosize = {
      type: 'fit',
      resize: true
    };
    if (!widgetConfig.signals) {
      widgetConfig.signals = [];
    }
    const resizeWidthSignal = {
      name: "width",
      update: "containerSize()[0]*0.95",
      value: "",
      on: [
        {
          events: {
            source: "window",
            type: "resize"
          },
          update: "containerSize()[0]*0.95"
        }
      ]
    };
    widgetConfig.signals.push(resizeWidthSignal);
    charts.makeVegaChart(this.chart, widgetConfig, language, setLoading, this.addChartDownload);
  };

  render() {
    const { isError, errorMsg, showDownloadOptions, downloadOptions, chartDownloadTitle, chartImgDownloadUrl, description, isLoading, showSettings } = this.state;
    const {width, height} = this.state.dimensions;
    const { results, component, reportLabel, module, params, language, analysisId, chartType, toggle, toggleChart} = this.props;
    
    let colorTheme;
    const { customColorTheme } = resources;
    if (!toggle && customColorTheme && customColorTheme !== '') {
        colorTheme = customColorTheme;
    } else if (!toggle && (!customColorTheme || customColorTheme === '')) {
        colorTheme = defaultColorTheme;
    } else {
        colorTheme = '#929292';
    }
    
    if (isError) {
      return (
        <div className='data-error'>
          <h5>{results.message || errorMsg}</h5>
        </div>
      );
    } else {
       //TODO:
      // case 'FRAGMENTATION':
      //       console.log('results', results);
      //       console.log('config', config);
      //       // results.startYearValue = startCount;
      //       // results.totalRangeValue = totalCount;
      //       const diff = results.totalRangeValue - results.startYearValue;
      //       // debugger

      //       const style = {
      //         borderColor: 'purple',
      //         color: 'purple'
      //       };
      //       chartComponent = <div className='results__badge' style={style}>
      //         <div className='results__badge-label'>Frag Loss {config.startYear}-{config.endYear}</div>
      //         <div className='results__badge-value'>{diff.toFixed(3)}</div>
      //       </div>;

      //       break;
      return (
        <div className='vega-chart_container'>
          { showDownloadOptions &&
            <div className='vega-chart_click-area' onClick={() => this.setState({ showDownloadOptions: false })}></div>
          }
          {component === 'Report' ?
            <div className={component === 'Report' ? 'vega-chart_download-container-report' : 'vega-chart_download-container'}>
              <h3 className={`vega-chart-label ${toggle ? 'print-hide' : ''}`}>{reportLabel}</h3>
              <div className='vega-chart-menu-container'>
                {
                  (
                  analysisId === 'TC_LOSS' ||
                  analysisId === 'TC_LOSS_GAIN' ||
                  analysisId === 'IFL' ||
                  analysisId === 'Loss_LandCover' ||
                  analysisId === 'BIO_LOSS' ||
                  analysisId === 'TOTAL_GLAD_ALERTS'
                  ) ?
                  <div className="vega-chart-menu-settings">
                    <div className='vega-chart-menu' onClick={() => this.setState({ showSettings: !showSettings })}>
                      <SVGIcon className="vega-chart-menu-icon" id={'icon-gear'} />
                    </div>
                  </div> :
                  null
                }
                {
                  (
                  analysisId === 'TC_LOSS' ||
                  analysisId === 'TC_LOSS_GAIN' ||
                  analysisId === 'IFL' ||
                  analysisId === 'Loss_LandCover' ||
                  analysisId === 'BIO_LOSS' ||
                  analysisId === 'TOTAL_GLAD_ALERTS'
                  ) ?
                  <div className="vega-chart-divider"></div> :
                  null
                }
                <div className='vega-chart-menu' onClick={() => this.setState({showDownloadOptions: !showDownloadOptions})}>
                  <SVGIcon className="vega-chart-menu-icon" id={'icon-download-grey'} />
                </div>
                <div className="vega-chart-divider"></div>
                <div style={{backgroundColor: `${colorTheme}`}} className={`vega-chart-toggle-${toggle}`} onClick={toggleChart}>
                  <span className="vega-chart-toggle-dot"></span>
                </div>
              </div>
            </div> :
            <div className={component === 'Report' ? 'vega-chart_download-container-report' : 'vega-chart_download-container'}>
              <h3 className="vega-chart-label">{reportLabel}</h3>
              <div className='vega-chart-menu-container'>
              {!isLoading && <div className='vega-chart-menu' onClick={() => this.setState({showDownloadOptions: !showDownloadOptions})}>
                  <SVGIcon className="vega-chart-menu-icon" id={'icon-download-grey'} />
                </div>}
              </div>
            </div>
          }
          {component === 'Report' &&
            <div className={`vega-chart-report-settings-container ${(showSettings && !toggle) ? '' : 'vega-chart-hide'}`}>
              <ReportSettings module={module} params={params} language={language} reRenderChart={this.reRenderChart} />
            </div>
          }
          { showDownloadOptions &&
            <div className={component === 'Report' ? 'vega-chart_download-options-report' : 'vega-chart_download-options'} onClick={() => this.setState({showDownloadOptions: !showDownloadOptions})}>
              {downloadOptions.map(this.renderdownloadOptions)}
              {this.chart &&
                <a className="download-option" href={chartImgDownloadUrl} download={chartDownloadTitle}>
                  <span className='download-option-label'>Download PNG</span>
                </a>
              }
            </div>
          }
          {component === 'Report' ?
          <div className={`loader-wrapper ${toggle ? 'vega-chart-hide' : ''}`}>
              {
                isLoading &&
                <div className="loader">
                  <Loader active={isLoading} />
                </div>
              }
              <Measure
                bounds
                onResize={contentRect => {
                this.setState({ dimensions: contentRect.bounds });
                }}
              >
                {({ measureRef }) => (
                  <div
                    ref={measureRef}
                    className={
                    `${chartType && chartType === 'bar' && 'vega-chart-bar-container'}
                    ${chartType && chartType === 'line' && 'vega-chart-line-container'}
                    ${chartType && chartType === 'badge' && 'vega-chart-badge-container'}
                    ${chartType && chartType === 'pie' && 'vega-chart-pie-container'}
                    ${(toggle || isLoading) ? 'vega-chart-hidden' : ''}`
                    }
                  >
                    <div width={width} height={height} className={`vega-chart ${(toggle || isLoading) ? 'vega-chart-hidden' : ''}`} id='AnalysisVegaChart' ref={(chart) => { this.chart = chart; }}></div>
                  </div>
                )}
              </Measure>
              {!isLoading && description && description !== '' &&
                <div className={`vega-chart-info-container ${toggle ? 'vega-chart-hide' : ''}`}>
                  <div className="vega-chart-info">
                      {description}
                  </div>
                </div>
              }
            </div>
            :
            <div className="vega-chart-container">
              <div className={`vega-chart ${toggle && 'vega-chart-hide'}`} id='AnalysisVegaChart' ref={(chart) => { this.chart = chart; }}></div>
            </div>
          }
        </div>
      );
    }
  }
}
