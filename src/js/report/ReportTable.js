import React, {Component} from 'react';
import QueryTask from 'esri/tasks/QueryTask';
import Query from 'esri/tasks/query';
import locale from 'dojo/date/locale';
import number from 'dojo/number';

export default class ReportTable extends Component {
    constructor(props){
        super(props);
        this.state = ({
          tableFields: []
        });
    }

    addTableAttributes = () => {
        const {map, params} = this.props;
        console.log('params', params);
        const { layerId, OBJECTID, OBJECTID_Field} = params;
        if (layerId && OBJECTID) {
          const hashDecoupled = layerId.split('--');
          const url = hashDecoupled[0];
          console.log('url', url);
          const id = hashDecoupled[1];
          const mapLayer = map.getLayer(id);
          console.log('mapLayer', mapLayer);
          const queryTask = new QueryTask(mapLayer.url);
          const query = new Query();
          query.where = OBJECTID_Field + ' = ' + OBJECTID;
          query.returnGeometry = false;
          query.outFields = ['*'];
          queryTask.execute(query).then(res => {
            console.log('res', res);
            if (res.features && res.features.length > 0) {
              if (mapLayer && mapLayer.infoTemplate) {
                const tableFields = [];
                mapLayer.infoTemplate.info.fieldInfos.filter(fieldInfo => fieldInfo.visible).forEach((fieldInfo) => {
                  let fieldValue = res.features[0].attributes[fieldInfo.fieldName];
                  console.log('fieldValue', fieldValue);
                  //- If it is a date, format that correctly
                  if (fieldInfo.format && fieldInfo.format.dateFormat) {
                    fieldValue = locale.format(new Date(fieldValue));
                  //- If it is a number, format that here, may need a better way
                  } else if (fieldInfo.format && fieldInfo.format.places !== undefined) {
                    fieldValue = number.format(fieldValue, fieldInfo.format);
                  }
                  if (fieldValue && fieldValue.trim) {
                    fieldValue = fieldValue.trim();
                    tableFields.push({
                      fieldLabel: fieldInfo.label,
                      fieldValue
                    });
                  }
                });
                this.setState({
                  tableFields
                });
              }
            }
          }).catch(err => {
            console.log('error:', err);
          });
        }
    };
    
    componentDidMount() {
      this.addTableAttributes();
    }
    
    render() {
        const {tableFields} = this.state;
        console.log('table fields', tableFields);
        return (
          <div className="report-table-container">
            {tableFields.length > 0 &&
              <table className="report-table">
                <tbody>
                {tableFields.map((tableField, index) => {
                  return (
                      <tr key={`field-row-${index}`} className="field-row">
                        <td className="field-label">{tableField.fieldLabel}</td>
                        <td className="field-value">{tableField.fieldValue}</td>
                      </tr>
                  );
                })}
                </tbody>
              </table>
            }
          </div>
        );
    }
}


