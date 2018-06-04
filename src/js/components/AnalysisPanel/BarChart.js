//- These charts have a dependency of highcharts
import React, {PropTypes, Component} from 'react';
import charts from 'utils/charts';

export default class BarChart extends Component {

  constructor(props) {
    super(props);
    this.state = { isEmpty: false, isError: false };
  }

  componentDidMount() {
    const { labels, colors, counts, name, results, encoder } = this.props;
    if (typeof results === 'object' && results.hasOwnProperty('error')) {
      this.setState({ isError: true });
    } else {

      if (!counts.some(item => item !== 0)) {
        this.setState({ isEmpty: true });
      } else {
        let series = [];

        if (encoder) {
          const chartInfo = charts.formatSeriesWithEncoder({
            isSimple: true,
            encoder: encoder,
            counts: counts,
            labels: labels,
            colors: colors,
            Xs: encoder.A, // Loss Bounds
            Ys: encoder.B // Raster were crossing with
          });
          series = chartInfo.series;
        } else {
          series = [{
            name: name,
            data: counts
          }];
        }

        this.setState({ isEmpty: false });
        charts.makeTotalLossBarChart(this.refs.chart, labels, colors, series);
      }
    }
  }

  render () {
    const { isError } = this.state;
    const { results } = this.props;

    if (isError) {
      return (
        <div className='data-error'>
          <h5>{results.message}</h5>
        </div>
      );
    } else {
      return (
        <div>
          <div ref='chart' className='analysis__chart-container'></div>
          <div id='chartError' className={`chart-error ${this.state.isEmpty ? '' : ' hidden'}`}>No data available.</div>
        </div>
      );
    }
  }
}

BarChart.propTypes = {
  counts: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired
};
