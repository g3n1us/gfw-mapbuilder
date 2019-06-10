import layerActions from 'actions/LayerActions';
import layerKeys from 'constants/LayerConstants';
import utils from 'utils/AppUtils';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React, { Component, PropTypes } from 'react';
import Slider from 'rc-slider';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);


const lossOptions = [];

export default class FragControls extends Component {
  static contextTypes = {
    language: PropTypes.string.isRequired,
    map: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      sliderValue: 0,
      sliderMarks: {},
      holdSliderValueWhenPlaying: [],
      holdSliderMarksWhenPlaying: {}
    };
  }

  componentDidMount () {
    const min = 0;
    const max = 17;
    for ( let i = min; i <= max; i++ ) {
      lossOptions.push({ label: i < 10 ? `0${i} ` : `${i} `, value: i });
    }
    const sliderMarkLabels = lossOptions.map(lossOption => {
        return lossOption.label;
    });

    const sliderMarksObj = {};
    sliderMarkLabels.forEach((label, index) => {
      sliderMarksObj[index] = <small>{label}</small>;
    });

    //- Update the defaults to be the last year
    // layerActions.updateLossTimeline.defer({
    //   fromSelectedIndex: 0,
    //   toSelectedIndex: 16
    // });
    //- Set the options in the store so others can use it
    //layerActions.setLossOptions.defer(lossOptions);
    this.setState({
      //sliderValue: [lossOptions[0].value, lossOptions[lossOptions.length - 1].value],
      sliderMarks: sliderMarksObj
    });
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    const { map } = this.context;

    if (map.getLayer && prevState.sliderValue !== this.state.sliderValue) {
      this.updateDates(map.getLayer(layerKeys.FRAGMENTATION), this.state.sliderValue);
    }

    // if (this.props.lossFromSelectIndex !== this.state.sliderValue[0] - 1) {
    //   this.setState({sliderValue: [this.props.lossFromSelectIndex + 1, this.props.lossToSelectIndex + 1]});
    // }

    // if (this.props.lossToSelectIndex !== this.state.sliderValue[1] - 1) {
    //   this.setState({sliderValue: [this.props.lossFromSelectIndex + 1, this.props.lossToSelectIndex + 1]});
    // }

    //const {resetSlider} = this.props;
    const {sliderValue} = this.state;
  

    if (map.loaded) {

      if (this.props.lossOptions.length) {
        // if (resetSlider) {
        //   layerActions.shouldResetSlider(false);
        //   this.updateDates(map.getLayer(layerKeys.FRAGMENTATION), lossOptions[0].label, lossOptions[lossOptions.length - 1].label);
        //   this.setState({sliderValue: [lossOptions[0].value, lossOptions[lossOptions.length - 1].value]});
        // }

        if (prevContext.map !== map && Object.keys(prevContext.map).length !== 0) {
          const signal = map.on('update-end', () => {
            signal.remove();
            this.updateDates(map.getLayer(layerKeys.FRAGMENTATION), sliderValue);
          });
        }
      }
    }
  }

  componentWillUnmount () {
    if (this.timer) {
        clearInterval(this.timer);
    }
  }

  updateDates (layer, sliderValue) {
    // if (layer && layer.setDateRange) {
    //   //layer.setDateRange(fromYear, toYear);
    // }
    let yearValue = sliderValue.toString();
    if (yearValue.length === 1){
     yearValue = `0${yearValue}`;
    }
    console.log('updating');
    let baseUrl = layer.url;
    baseUrl = baseUrl.split('distance')[0] + 'distance_';
    baseUrl += yearValue;
    baseUrl += '/{level}/{col}/{row}.png';
    console.log('baseUrl', baseUrl);
    layer.url = baseUrl;
    layer.refresh();
    layer.hide();
    layer.show();
  }

  // updateFragmentation (layer, sliderValue) {
  //   const { settings } = this.context;
  //   const layerGroups = settings.layerPanel;
  //   const layerConf = utils.getObject(layerGroups.GROUP_LCD.layers, 'id', this.props.layerId);
  //   let baseUrl = layerConf.url;
  //   console.log('baseUrl', baseUrl);
  //   baseUrl = baseUrl.split('distance')[0] + 'distance_';
  //   baseUrl += sliderValue[1];
  //   baseUrl += '/{level}/{col}/{row}.png';
  //   console.log('baseUrl', baseUrl);
  //   layer.setUrl(baseUrl);
  // }

  startVisualization = () => {
    // const { sliderValue, sliderMarks } = this.state;
    // const layer = this.context.map.getLayer(layerKeys.FRAGMENTATION);
    // const start = sliderValue[0];
    // let currentValue = start;
    // const stop = sliderValue[1];

    // const visualizeLoss = () => {
    //   if (currentValue === stop + 1) {
    //     currentValue = start;
    //   }

    //   layer.setDateRange(start, currentValue);
    //   layerActions.updateLossTimeline({
    //     fromSelectedIndex: start,
    //     toSelectedIndex: currentValue
    //   });
    //   const nextMark = currentValue % 2 === 0 ? currentValue + 1 : currentValue + 2;
    //   const prevMark = currentValue % 2 === 0 ? currentValue - 1 : currentValue - 2;
    //   // const shouldHideNextMark = nextMark <= lossOptions[lossOptions.length - 1].value;
    //   // const shouldHidePrevMark = prevMark >= lossOptions[0].value;

    //   this.setState({
    //     sliderValue: [start, currentValue],
    //     sliderMarks: {
    //       ...sliderMarks,
    //       // ...(shouldHidePrevMark ? {[prevMark]: {
    //       //   style: {
    //       //     display: 'none'
    //       //   }
    //       // }} : {}),
    //       [currentValue]: {
    //         style: {
    //           color: '#F0AB00'
    //         },
    //         label: <small>{lossOptions[currentValue - 1].label}</small>
    //       },
    //       // ...(shouldHideNextMark ? {[nextMark]: {
    //       //   style: {
    //       //     display: 'none'
    //       //   }
    //       // }} : {})
    //     }
    //   });
    //   currentValue++;
    // };

    // this.timer = setInterval(visualizeLoss, 1000);

    // this.setState({
    //   playing: true,
    //   holdSliderValueWhenPlaying: sliderValue,
    //   holdSliderMarksWhenPlaying: sliderMarks
    // });
  }

  stopVisualization = () => {
    // const { holdSliderValueWhenPlaying, holdSliderMarksWhenPlaying } = this.state;
    // const fromYear = holdSliderValueWhenPlaying[0] - 1;
    // const toYear = holdSliderValueWhenPlaying[1] - 1;

    // const layer = this.context.map.getLayer(layerKeys.FRAGMENTATION);

    // clearInterval(this.timer);
    // layer.setDateRange(fromYear, toYear);
    // layerActions.updateLossTimeline({
    //   fromSelectedIndex: fromYear,
    //   toSelectedIndex: toYear
    // });
    // this.setState({
    //   playing: false,
    //   sliderValue: holdSliderValueWhenPlaying,
    //   sliderMarks: holdSliderMarksWhenPlaying
    // });
  }

  handleSliderChange = sliderValue => {
    console.log('slider value', sliderValue);
    this.setState({sliderValue});

    // layerActions.updateLossTimeline({
    //   fromSelectedIndex: sliderValue[0] - 1,
    //   toSelectedIndex: sliderValue[1] - 1
    // });
  }

  render () {
    const {sliderValue, sliderMarks, playing} = this.state;
    const disabled = false;
    const disabledStyles = {
      opacity: '.5',
      color: '#aaa',
      cursor: 'default'
    };

    if (lossOptions.length === 0) {
      return <div className='timeline-container loss flex'>loading...</div>;
    }
    console.log('slider value', sliderValue);
    return (
      <div className='timeline-container loss'>
        <Slider
          min={lossOptions[0].value}
          max={lossOptions[lossOptions.length - 1].value}
          value={sliderValue}
          disabled={playing}
          allowCross={false}
          onChange={this.handleSliderChange}
          tipFormatter={value => 2000 + value}
          dots={true}
          marks={sliderMarks}
          trackStyle={[{backgroundColor: '#F0AB00'}]}
          handleStyle={[{borderColor: '#F0AB00'}]}
          dotStyle={{border: '1px solid #e9e9e9'}}
          activeDotStyle={{border: '1px solid #F0AB00'}}
        />
        <div
          id="lossPlayButton"
          className={`${playing ? ' hidden' : ''}`}
          style={disabled ? disabledStyles : {}}
          onClick={disabled ? null : this.startVisualization}
          title={disabled ? 'Please select a range to view animation' : ''}
        >
          &#9658;
        </div>
        <div id="lossPauseButton" className={`${playing ? '' : ' hidden'}`} onClick={this.stopVisualization}>&#10074;&#10074;</div>
      </div>
    );
  }
}
