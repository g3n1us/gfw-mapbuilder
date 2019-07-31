import layerActions from 'actions/LayerActions';
import layerKeys from 'constants/LayerConstants';
import utils from 'utils/AppUtils';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React, { Component, PropTypes } from 'react';
import Slider, {createSliderWithTooltip} from 'rc-slider';
import WebTiledLayer from 'esri/layers/WebTiledLayer';

const fragOptions = [];

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
      fragOptions.push({ label: i < 10 ? `0${i} ` : `${i} `, value: i });
    }
    const sliderMarkLabels = fragOptions.map(fragOption => {
        return fragOption.label;
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
    //layerActions.setfragOptions.defer(fragOptions);
    
    this.setState({
      sliderValue: fragOptions[0].value,
      sliderMarks: sliderMarksObj
    });
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    const { map } = this.context;
    const {sliderValue} = this.state;

    if (map.getLayer && prevState.sliderValue !== sliderValue) {
      if (map.getLayer(layerKeys.FRAGMENTATION)){
        this.updateDates(map.getLayer(layerKeys.FRAGMENTATION), sliderValue);
      }
    }

    if (this.props.fragIndex !== this.state.sliderValue) {
      this.setState({sliderValue: this.props.fragIndex});
    }

    console.log('frag index', this.props.fragIndex);

    // if (this.props.lossToSelectIndex !== this.state.sliderValue[1] - 1) {
    //   this.setState({sliderValue: [this.props.lossFromSelectIndex + 1, this.props.lossToSelectIndex + 1]});
    // }

    //const {resetSlider} = this.props;
  

    if (map.loaded) {

      if (this.props.lossOptions.length) {
        // if (resetSlider) {
        //   layerActions.shouldResetSlider(false);
        //   this.updateDates(map.getLayer(layerKeys.FRAGMENTATION), fragOptions[0].label, fragOptions[fragOptions.length - 1].label);
        //   this.setState({sliderValue: [fragOptions[0].value, fragOptions[fragOptions.length - 1].value]});
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
    const {map} = this.context;
    let yearValue = sliderValue.toString();
    if (yearValue.length === 1){
     yearValue = `0${yearValue}`;
    }
    let baseUrl = layer.url;
    baseUrl = baseUrl.split('distance')[0] + 'distance_';
    baseUrl += yearValue;
    baseUrl += '/{level}/{col}/{row}';
    console.log('baseUrl', baseUrl);
    layer.url = baseUrl;
    const layerCopy = new WebTiledLayer(layer.url, {id: layer.id, visible: true});
    map.removeLayer(layer);
    map.addLayer(layerCopy);
    // layerCopy.on('visibility-change', () => {
    //   map.removeLayer(layer);
    //   console.log('removed');
    // });
    // layer.refresh();
    // layer.hide();
    // layer.show();
  }

  startVisualization = () => {
  //   const { sliderValue, sliderMarks } = this.state;
  //   const layer = this.context.map.getLayer(layerKeys.FRAGMENTATION);
  //   const start = sliderValue;
  //   let currentValue = start;
  //   const stop = fragOptions[fragOptions.length - 1].value;

  //   const visualizeLoss = () => {
  //     if (currentValue === stop + 1) {
  //       currentValue = start;
  //     }

  //     layer.setDateRange(start, currentValue);
  //     // layerActions.updateLossTimeline({
  //     //   fromSelectedIndex: start,
  //     //   toSelectedIndex: currentValue
  //     // });
  //   //   // const nextMark = currentValue % 2 === 0 ? currentValue + 1 : currentValue + 2;
  //   //   // const prevMark = currentValue % 2 === 0 ? currentValue - 1 : currentValue - 2;
  //   //   // const shouldHideNextMark = nextMark <= fragOptions[fragOptions.length - 1].value;
  //   //   // const shouldHidePrevMark = prevMark >= fragOptions[0].value;

  //     this.setState({
  //       //sliderValue: currentValue,
  //       sliderMarks: {
  //         ...sliderMarks,
  //         // ...(shouldHidePrevMark ? {[prevMark]: {
  //         //   style: {
  //         //     display: 'none'
  //         //   }
  //         // }} : {}),
  //         [currentValue]: {
  //           style: {
  //             color: '#F0AB00'
  //           },
  //           label: <small>{fragOptions[currentValue - 1].label}</small>
  //         },
  //         // ...(shouldHideNextMark ? {[nextMark]: {
  //         //   style: {
  //         //     display: 'none'
  //         //   }
  //         // }} : {})
  //       }
  //     });
  //     currentValue++;
  //   };

  //   this.timer = setInterval(visualizeLoss, 1000);

  //   this.setState({
  //     playing: true,
  //     holdSliderValueWhenPlaying: sliderValue,
  //     holdSliderMarksWhenPlaying: sliderMarks
  //   });
  }

  stopVisualization = () => {
  //   const { holdSliderValueWhenPlaying, holdSliderMarksWhenPlaying } = this.state;
  //   // const fromYear = holdSliderValueWhenPlaying[0] - 1;
  //   // const toYear = holdSliderValueWhenPlaying[1] - 1;

  //   //const layer = this.context.map.getLayer(layerKeys.FRAGMENTATION);

  //   clearInterval(this.timer);
  //   // layer.setDateRange(fromYear, toYear);
  //   // layerActions.updateLossTimeline({
  //   //   fromSelectedIndex: fromYear,
  //   //   toSelectedIndex: toYear
  //   // });
  //   this.setState({
  //     playing: false,
  //     sliderValue: holdSliderValueWhenPlaying,
  //     sliderMarks: holdSliderMarksWhenPlaying
  //   });
  }

  handleSliderChange = sliderValue => {
    this.setState({sliderValue});
    layerActions.updateFragTimeline({
      fragIndex: sliderValue
    });
  }

  render () {
    const {sliderValue, sliderMarks, playing} = this.state;
    const disabled = false;
    const disabledStyles = {
      opacity: '.5',
      color: '#aaa',
      cursor: 'default'
    };

    if (fragOptions.length === 0) {
      return <div className='timeline-container loss flex'>loading...</div>;
    }
    console.log('slider value', sliderValue);
    return (
      <div className='timeline-container loss'>
        <Slider
          min={fragOptions[0].value}
          max={fragOptions[fragOptions.length - 1].value}
          value={sliderValue}
          disabled={playing}
          allowCross={false}
          onChange={this.handleSliderChange}
          dots={true}
          marks={sliderMarks}
          trackStyle={[{backgroundColor: '#F0AB00'}]}
          handleStyle={[{borderColor: '#F0AB00'}]}
          dotStyle={{border: '1px solid #e9e9e9'}}
          activeDotStyle={{border: '1px solid #F0AB00'}}
          included={false}
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
