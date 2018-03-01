import request from 'dojo/request';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import Graphic from 'esri/graphic';
import webMercatorUtils from 'esri/geometry/webMercatorUtils';
import SimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';
import SimpleLineSymbol from 'esri/symbols/SimpleLineSymbol';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import Color from 'esri/Color';
import layerUtils from 'utils/layerUtils';
import layerActions from 'actions/LayerActions';
import geoJsonUtils from 'utils/arcgis-to-geojson';
import * as topojson from 'topojson-client';

export const setupCartoLayers = (cartoUser, cartoTemplateId, cartoApiKey, cartoGroupLabel, lang) => {

  const templateUrl = `https://${cartoUser}.carto.com/api/v1/map/named/${cartoTemplateId}?api_key=${cartoApiKey}`;
  
  const cartoGroup = {
      groupType: 'carto',
      label: cartoGroupLabel,
      layers: []
  };

  layerActions.fetchingCartoData(true);
  request(templateUrl).then((res) => {
    const templateJson = JSON.parse(res);
    const cartoTemplate = templateJson.template;
    const { layergroup: layerGroup, placeholders } = cartoTemplate;
    const { layers: templateLayers, stat_tag: templateKey} = layerGroup;
    
    const cartoLayers = templateLayers.filter(l => l.type === 'cartodb');
    
    cartoLayers.forEach((layer, idx) => {
      const {
        id,
        options: {
          sql,
          cartocss: cartoCss,
          layer_name: layerName,
        }
      } = layer;
      
      // const symbolDictionary = {};
      
      // if there is a placeholder figure out how to use it. For now use the default in 'placeholders'
      let queryString = sql;
      const sqlPlaceholder = sql.match(/<%=.+?%>/);
      if (sqlPlaceholder && sqlPlaceholder[0]) {
        const placeholderLookupItem = sqlPlaceholder[0].split(' ')[1];
        const placeholderDefaultValue = placeholders[placeholderLookupItem].default;
        queryString = sql.replace(sqlPlaceholder[0], String(placeholderDefaultValue));
      }
      const tableQuery = queryString.match(/\((.*?)\)/)[1];
      const splitTableQuery = tableQuery.split(' ');
      // we will use this later in the query section as well.
      // I'm just putting it here because the layer may or may not have
      // a layer name and I need something to put in the symbol dictionary
      const tableName = splitTableQuery[splitTableQuery.length - 1];

      // we need to do something with the cartoCss here
      // it is a bunch of actual css rules that look like this:
      // #layerName[someAttribute="somevalue"] {
      //   ...css rules
      // }
      // so we should be able to take this and create some symbol for
      // each feature where it has 'someAttribute' = 'value'
      // we will just need to match the css rules to symbol values
      // console.log(cartoCss);
      // const singleLineCss = cartoCss.replace(/[\r\n]/g, '');
      // const cssRuleType = singleLineCss.match(/\/\*\* (.*?) \*\//)[1].split(' ')[1].toLowerCase();
      // const splitCss = singleLineCss.replace(cssRuleType, '').replace(/ |\/\*\*|\*\//g, '').split('}');

      // splitCss.forEach((line, idx) => {
      //   if (line.length === 0) { return; }
      //   let layerNameToAdd = null;
      //   if (idx === 0) {
      //     const splitLine = line.split('{');
      //     layerNameToAdd = splitLine[0].substr(1);
      //     symbolDictionary[layerNameToAdd] = {
      //       outline: {},
      //       fill: {},
      //       categories: {},
      //     };
      //   }

      //     const rules = splitLine[1].split(';');
      //     console.log(rules);
      //     rules.forEach(rule => {
      //       const splitRule = rule.split(':');
      //       const property = splitRule[0];
      //       const value = splitRule[1];

      //       switch (property) {

      //        case 'polygon-fill':
      //           symbolDictionary[layerNameToAdd].fill.color = value;
      //           break;
      //         case 'line-color':
      //           symbolDictionary[layerNameToAdd].outline.color = value;
      //           break;
      //       }
      //     })

      //   switch (cssRuleType) {
      //     case 'category': {
      //       if (line.charAt(0) !== '#') { return; }
      //       // if (line.includes('{')) {
      //       //   symbolDictionary[layerNameToAdd] = 
      //       // }
      //     }
      //   }
        
      // });
      // console.log(splitCss);
      const layerId = id ? id : `${templateKey}_${layerName}`;
      // create a CartoLayer/GraphicsLayer for this layer
      const esriLayer = new GraphicsLayer({
        id: layerId,
        visible: false,
      });

      // Query Section
      // we have to get all of the column names....this is unfortunate
      const columnQuery = `SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}'`;
      const columnQueryUrl = `https://${cartoUser}.cartodb.com/api/v2/sql?format=JSON&q=${columnQuery}&api_key=${cartoApiKey}`;
      request(columnQueryUrl).then((columnRes) => {
        const columnJSON = JSON.parse(columnRes);
        const columnsToQuery = columnJSON.rows.reduce((prevVal, currentVal) => {
          if (currentVal.column_name.includes('the_geom')) { return prevVal; }
          return prevVal + `, ${currentVal.column_name}`;
        }, '');

        // simplify the geometries
        const tableQueryWithSimplify = tableQuery.replace('*', `ST_Simplify(the_geom, 0.1, true) AS the_geom${columnsToQuery}`);
        queryString = queryString.replace(tableQuery, tableQueryWithSimplify);
        queryString += ' LIMIT 10000';
        // make a request to the carto sql api with the sql from the layer
        const sqlUrl = `https://${cartoUser}.cartodb.com/api/v2/sql?format=TopoJSON&q=${queryString}&api_key=${cartoApiKey}`;
        request(sqlUrl, { timeout: 30000 }).then((sqlRes) => {
          
          sqlRes = sqlRes.replace('undefined', '\"undefined\"');
          const cartoTopoJson = JSON.parse(sqlRes, (key, value) => {
            if (value === 'undefined') { return undefined; }
            return value;
          });
          const geometryObjects = { ...cartoTopoJson.objects };
          cartoTopoJson.objects = {
            geometries: Object.entries(geometryObjects).map(entry => entry[1]),
            type: 'GeometryCollection'
          };
          const cartoGeoJson = topojson.feature(cartoTopoJson, cartoTopoJson.objects);
          // const cartoGeoJson = JSON.parse(sqlRes);
          const esriJson = geoJsonUtils.geojsonToArcGIS(cartoGeoJson);
          esriJson.forEach((feature) => {
            // create a graphic out of the feature
            const graphic = new Graphic(feature);
            
            // convert to webmercator if necessary
            if (graphic.geometry.spatialReference.wkid === 4326) {
              const wmGeom = webMercatorUtils.geographicToWebMercator(graphic.geometry);
              graphic.setGeometry(wmGeom);
            }
            
            // create a symbolMap above and get the symbol colors from that
              
            let graphicSymbol;

            switch (graphic.geometry.type) {
              case 'polygon':
                graphicSymbol = new SimpleFillSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color('red'),
                    1
                  ),
                  new Color('blue'),
                );
                break;
              case 'point':
                graphicSymbol = new SimpleMarkerSymbol(
                  SimpleMarkerSymbol.STYLE_CIRCLE,
                  5,
                  new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color('red'),
                    1
                  ),
                  new Color('blue'),
                );
                break;
            }
              
            graphic.setSymbol(graphicSymbol);

            const popup = {
              title: {
                [lang]: 'Feature Title (change later)'
              },
              content: {
                [lang]: []
              }
            };

            Object.keys(graphic.attributes).forEach(attribute => {
              popup.content[lang].push({
                label: attribute,
                fieldExpression: attribute,
              });
            });
            
            // const graphicInfoTemplate = new InfoTemplate('Attributes', '${*}');
            graphic.setInfoTemplate(layerUtils.makeInfoTemplate(popup, lang));
            
            esriLayer.add(graphic);
            // return graphic;
          });
        });
      });
      cartoGroup.layers.push({
        esriLayer,
        order: idx + 1,
        id: esriLayer.id,
        label: {
          [lang]: tableName,
        },
      });
      brApp.map.addLayer(esriLayer);
      layerActions.fetchingCartoData(false);
      // take the returned features and turn them into graphics
      // add the graphics to the cartoLayer or graphics layer
      // console.log('sql', sql);
    });
  });
  return cartoGroup;
};
