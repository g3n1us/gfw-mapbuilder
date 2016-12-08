//>>built
require({cache:{"url:esri/dijit/templates/BasemapGallery.html":'\x3cdiv class\x3d"esriBasemapGallery"\x3e\r\n  \x3cdiv dojoAttachPoint\x3d"flowContainer"\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e'}});
define("esri/dijit/BasemapGallery","require dojo/_base/declare dojo/_base/array dojo/_base/connect dojo/_base/lang dojo/_base/kernel dojo/_base/sniff dojo/has dojo/query dojo/Deferred dojo/DeferredList dojo/dom dojo/dom-construct dojo/dom-class dijit/_Widget dijit/_Templated ../kernel ../lang ../urlUtils ../request ../geometry/Extent ../SpatialReference ../virtualearth/VETiledLayer ../layers/OpenStreetMapLayer ../layers/ArcGISTiledMapServiceLayer ../layers/ArcGISDynamicMapServiceLayer ../layers/WebTiledLayer ../layers/VectorTileLayer ../layers/TileInfo ../layers/ArcGISImageServiceLayer ../layers/ImageServiceParameters ../layers/ImageParameters ./Basemap ./_EventedWidget dojo/text!./templates/BasemapGallery.html".split(" "),function(E,
k,f,s,e,x,F,G,S,H,I,J,h,y,K,L,m,t,z,n,l,A,p,M,u,v,N,w,O,B,C,D,P,Q,R){k=k([Q,K,L],{declaredClass:"esri.dijit.BasemapGallery",widgetsInTemplate:!0,templateString:R,loaded:!1,basemaps:[],bingMapsKey:null,flowContainer:null,_hasUI:!1,_supportsVTL:null,_selectedBasemap:null,_selectBasemapInProgress:!1,_eventMap:{load:!0,"selection-change":!0,add:["basemap"],remove:["basemap"],error:["message"]},constructor:function(a,b){a=a||{};a.map||console.error("esri.dijit.BasemapGallery: Unable to find the 'map' property in parameters");
this.map=a.map;this._hasUI=b?!0:!1;this.bingMapsKey=a.bingMapsKey&&0<a.bingMapsKey.length?a.bingMapsKey:null;this.showArcGISBasemaps=!1!==a.showArcGISBasemaps;this.basemaps=a.basemaps||[];this.basemapIds=a.basemapIds;this.referenceIds=a.referenceIds;this.basemapsGroup=a.basemapsGroup;this.arcgisUrl=m.dijit._arcgisUrl;a.portalUrl&&(this.arcgisUrl=a.portalUrl+"/sharing/rest");0>this.arcgisUrl.indexOf("://")?this.arcgisUrl=z.getProtocolForWebResource()+"//"+this.arcgisUrl:"https:"===window.location.protocol&&
(this.arcgisUrl=this.arcgisUrl.replace("http:","https:"));this.init()},init:function(){this.inherited(arguments);f.forEach(this.basemaps,function(a){if(!a.id||0===a.id.length)a.id=this._getUniqueId();f.forEach(a.layers,function(a){a.opacity=0<=a.opacity?a.opacity:1;a.visibility=!0},this)},this);this.basemapIds&&0<this.basemapIds.length&&f.forEach(this.basemapIds,function(a){this.map.getLayer(a)._basemapGalleryLayerType="basemap"},this);this.referenceIds&&0<this.referenceIds.length&&f.forEach(this.referenceIds,
function(a){a=this.map.getLayer(a);a._basemapGalleryLayerType="reference";a.attr("data-reference",!0)},this);this.basemapsGroup&&(this.basemapsGroup.owner&&this.basemapsGroup.title||this.basemapsGroup.id)?this._findCustomBasemapsGroup(e.hitch(this,"_handleArcGISBasemapsResponse")):this.showArcGISBasemaps?this._findArcGISBasemapsGroup(e.hitch(this,"_handleArcGISBasemapsResponse")):this._finishStartup();this._checkVTLSupport().then(e.hitch(this,function(a){this._supportsVTL=a}))},startup:function(){this.loaded?
this._refreshUI():s.connect(this,"onLoad",e.hitch(this,function(){this._refreshUI()}))},select:function(a){this._select(a)},getSelected:function(){return this._selectedBasemap},get:function(a){var b;for(b=0;b<this.basemaps.length;b++)if(this.basemaps[b].id===a)return this.basemaps[b];return null},add:function(a){return a&&!a.id?(a.id=this._getUniqueId(),this.basemaps.push(a),this._refreshUI(),this.onAdd(a),!0):a&&this._isUniqueId(a.id)?(this.basemaps.push(a),this._refreshUI(),this.onAdd(a),!0):!1},
remove:function(a){var b;for(b=0;b<this.basemaps.length;b++){var d=this.basemaps[b];if(d.id===a)return this._selectedBasemap&&this._selectedBasemap.id===d.id&&(this._selectedBasemap=null),this.basemaps.splice(b,1),this._refreshUI(),this.onRemove(d),d}return null},onLoad:function(){},onSelectionChange:function(){},onAdd:function(a){},onRemove:function(a){},onError:function(a){},_defaultBasemapGalleryGroupQuery:'title:"ArcGIS Online Basemaps" AND owner:esri',_basemapGalleryGroupQuery:null,_finishStartup:function(){this.loaded=
!0;this.onLoad();0===this.map.layerIds.length&&(0<this.basemaps.length&&!this._selectBasemapInProgress)&&this._select(this.basemaps[0].id)},_findCustomBasemapsGroup:function(a){this.basemapsGroup&&this.basemapsGroup.id?this._findArcGISBasemaps(this.basemapsGroup.id,a):(this._basemapGalleryGroupQuery='title:"'+this.basemapsGroup.title+'" AND owner:'+this.basemapsGroup.owner,this._findArcGISBasemapsGroup(a))},_findArcGISBasemapsGroup:function(a){if(this._basemapGalleryGroupQuery)this._findArcGISBasemapsGroupContent(a);
else{var b=this.arcgisUrl+"/portals/self",d={f:"json"};d.culture=x.locale;n({url:b,content:d,callbackParamName:"callback",load:e.hitch(this,function(b,d){this._basemapGalleryGroupQuery=b&&b.basemapGalleryGroupQuery?b.basemapGalleryGroupQuery:this._defaultBasemapGalleryGroupQuery;this._findArcGISBasemapsGroupContent(a)}),error:e.hitch(this,function(a,b){this._basemapGalleryGroupQuery=this._defaultBasemapGalleryGroupQuery})})}},_findArcGISBasemapsGroupContent:function(a){var b=e.hitch(this,"_findArcGISBasemaps"),
d=this.arcgisUrl+"/community/groups",c={};c.q=this._basemapGalleryGroupQuery;c.f="json";n({url:d,content:c,callbackParamName:"callback",load:e.hitch(this,function(d,c){if(0<d.results.length)b(d.results[0].id,a);else this.onError("esri.dijit.BasemapGallery: could not find group for basemaps.")}),error:e.hitch(this,function(a){this.onError("esri.dijit.BasemapGallery: could not find group for basemaps.")})})},_findArcGISBasemaps:function(a,b){var d=this.arcgisUrl+"/search",c={};c.q="group:"+a+' AND type:"web map"';
c.sortField="name";c.sortOrder="desc";c.num=50;c.f="json";n({url:d,content:c,callbackParamName:"callback",load:e.hitch(this,function(a,d){if(0<a.results.length)b(a.results);else this.onError("esri.dijit.BasemapGallery: could not find group for basemaps.")}),error:e.hitch(this,function(a,b){this.onError("esri.dijit.BasemapGallery: could not find group for basemaps.")})})},_handleArcGISBasemapsResponse:function(a){0<a.length&&(f.forEach(a,function(a,d){if(this.bingMapsKey||!this.bingMapsKey&&a.title&&
-1===a.title.indexOf("Bing Maps")){var c={};c.id=this._getUniqueId();c.title=a.title;c.thumbnailUrl="";if(a.thumbnail&&a.thumbnail.length&&(c.thumbnailUrl=this.arcgisUrl+"/content/items/"+a.id+"/info/"+a.thumbnail,m.id)){var e=m.id.findCredential(z.urlToObject(this.arcgisUrl).path);e&&(c.thumbnailUrl+="?token\x3d"+e.token)}c.itemId=a.id;c=new P(c,this);this.basemaps.splice(0,0,c)}},this),this._finishStartup())},_refreshUI:function(){this._hasUI&&(h.empty(this.flowContainer),f.forEach(this.basemaps,
function(a,b){a.id||(a.id="basemap_"+b);this.flowContainer.appendChild(this._buildNodeLayout(a))},this),h.create("br",{style:{clear:"both"}},this.flowContainer),this._markSelected(this._selectedBasemap))},_buildNodeLayout:function(a){var b=h.create("div",{id:"galleryNode_"+a.id,"class":"esriBasemapGalleryNode"}),d=h.create("a",{href:"javascript:void(0);"},b);s.connect(d,"onclick",e.hitch(this,"_onNodeClick",a));var c=a.title||"";a.thumbnailUrl?h.create("img",{"class":"esriBasemapGalleryThumbnail",
src:a.thumbnailUrl,title:c,alt:c},d):h.create("img",{"class":"esriBasemapGalleryThumbnail",src:E.toUrl("./images/transparent.gif"),title:c,alt:c},d);a=h.create("div",{"class":"esriBasemapGalleryLabelContainer"},b);h.create("span",{innerHTML:c,alt:c,title:c},a);return b},_onNodeClick:function(a,b){b.preventDefault();this._markSelected(a);this.select(a.id)},_markSelected:function(a){a&&(f.forEach(x.query(".esriBasemapGallerySelectedNode",this.domNode),function(a){y.remove(a,"esriBasemapGallerySelectedNode")}),
(a=J.byId("galleryNode_"+a.id))&&y.add(a,"esriBasemapGallerySelectedNode"))},_select:function(a){this._selectBasemapInProgress=!0;var b=this.get(a);b?(b.layers?this._getServiceInfos(b):(a=b.getLayers(this.arcgisUrl),e.isArray(a)?this._getServiceInfos(b):a.addCallback(e.hitch(this,function(a){this._getServiceInfos(b)}))),this._markSelected(b)):this._selectBasemapInProgress=!1},_getServiceInfos:function(a){"https:"===location.protocol&&f.forEach(a.layers,function(a){if(this._isAgolService(a.url)||this._isHostedService(a.url))a.url=
a.url.replace("http:","https:")},this);this._selectedBasemap=a;var b=[];f.forEach(a.layers,function(a){a.url&&(0<a.url.length&&!a.isReference&&!a.type)&&(a.deferredsPos=b.length,b.push(this._getServiceInfo(a.url)))},this);0<b.length?(new I(b)).addCallback(e.hitch(this,function(b){var c=null;f.forEach(a.layers,function(a){if(0===a.deferredsPos||a.deferredsPos){a.serviceInfoResponse=b[a.deferredsPos][1];var e=a.serviceInfoResponse.fullExtent;e||(e=a.serviceInfoResponse.extent);c=c?c.union(new l(e)):
new l(e)}},this);this.map.extent&&5>this._getIntersectionPercent(c,this.map.extent)&&this.map.setExtent(c,!0);this._switchBasemapLayers(a);this._updateReferenceLayer(a)})):(this._switchBasemapLayers(a),this._updateReferenceLayer(a))},_checkVTLSupport:function(){var a=new H;F("ie")?a.resolve(!1):a.resolve(w.supported());return a},_switchBasemapLayers:function(a){var b=a.layers,d=!1,c,h,q;f.forEach(b,function(a){"VectorTileLayer"===a.type&&(d=!0)});if(d&&!0!==this._supportsVTL)this.onError("esri.dijit.BasemapGallery: Unable to switch basemap because layer type is not supported by your current browser version.");
else if(0<this.map.layerIds.length&&0===this.map.getNumLevels()&&("OpenStreetMap"===b[0].type||b[0].type&&-1<b[0].type.indexOf("BingMaps")||"WebTiledLayer"===b[0].type||"VectorTileLayer"===b[0].type))this.onError("esri.dijit.BasemapGallery: Unable to switch basemap because new basemap is a tiled service and cannot be loaded as a dynamic layer.");else{f.forEach(b,function(a){if(!a.isReference&&a.type&&-1<a.type.indexOf("BingMaps")&&!this.bingMapsKey)this.onError("esri.dijit.BasemapGallery: Invalid Bing Maps key.")},
this);var r=0;f.forEach(b,function(a,d){if(!a.isReference){var g;if("OpenStreetMap"===a.type){if(0<this.map.layerIds.length&&0===this.map.getNumLevels()){this.onError("esri.dijit.BasemapGallery: Unable to switch basemap because new basemap is a tiled service and cannot be loaded as a dynamic layer.");return}g=new M({id:"layer_osm",opacity:a.opacity})}else if(a.type&&-1<a.type.indexOf("BingMaps")){if(0<this.map.layerIds.length&&0===this.map.getNumLevels()){this.onError("esri.dijit.BasemapGallery: Unable to switch basemap because new basemap is a tiled service and cannot be loaded as a dynamic layer.");
return}g=p.MAP_STYLE_AERIAL_WITH_LABELS;"BingMapsAerial"===a.type?g=p.MAP_STYLE_AERIAL:"BingMapsRoad"===a.type&&(g=p.MAP_STYLE_ROAD);g=new p({id:"layer_bing",bingMapsKey:this.bingMapsKey,mapStyle:g,opacity:a.opacity})}else if("WebTiledLayer"===a.type){if(0<this.map.layerIds.length&&0===this.map.getNumLevels()){this.onError("esri.dijit.BasemapGallery: Unable to switch basemap because new basemap is a tiled service and cannot be loaded as a dynamic layer.");return}g=a.initialExtent||a.fullExtent;g=
new N(a.templateUrl||a.url,{visible:a.visibility,opacity:a.opacity,copyright:a.copyright,fullExtent:a.fullExtent&&new l(a.fullExtent),initialExtent:g&&new l(g),subDomains:a.subDomains,tileInfo:a.tileInfo?new O(a.tileInfo):null,tileServers:a.tileServers})}else if("VectorTileLayer"===a.type){g=new w(a.styleUrl,{visible:a.visibility,opacity:a.opacity});0===d&&1<b.length&&this._removeBasemapLayers();var f=this;s.connect(g,"onLoad",e.hitch(this,function(a,c,d){var e;if(f._sameSpatialReference(d.spatialReference,
f.map.spatialReference))if(0<f.map.getNumLevels())if(e=f._sameTilingScheme(d.tileInfo,f.map.__tileInfo))0===c&&1===b.length&&f._removeBasemapLayers(),d._basemapGalleryLayerType="basemap",f.map.addLayer(d,a);else f.onError("esri.dijit.BasemapGallery: Unable to switch basemap because new basemap has a different tiling scheme.");else f.onError("esri.dijit.BasemapGallery: Unable to switch basemap because new basemap is a tiled service and cannot be loaded as a dynamic layer.");else f.onError("esri.dijit.BasemapGallery: Unable to switch basemap because new basemap has a different spatial reference.")},
r,d))}else if(a.serviceInfoResponse&&a.serviceInfoResponse.mapName){c=new A(a.serviceInfoResponse.spatialReference);h=this._sameSpatialReference(c,this.map.spatialReference);if(!h){this.onError("esri.dijit.BasemapGallery: Unable to switch basemap because new basemap has a different spatial reference.");return}if(!0===a.serviceInfoResponse.singleFusedMapCache&&0<this.map.getNumLevels()){if(q=this._sameTilingScheme(a.serviceInfoResponse.tileInfo,this.map.__tileInfo),!q){this.onError("esri.dijit.BasemapGallery: Unable to switch basemap because new basemap has a different tiling scheme.");
return}}else if(!0===a.serviceInfoResponse.singleFusedMapCache&&-1<a.serviceInfoResponse.capabilities.toLowerCase().indexOf("tilesonly")&&0===this.map.getNumLevels()){this.onError("esri.dijit.BasemapGallery: Unable to switch basemap because new basemap is a tiled service and cannot be loaded as a dynamic layer.");return}g=(0===this.map.layerIds.length||0<this.map.getNumLevels())&&!0===a.serviceInfoResponse.singleFusedMapCache?this._loadAsCached(a):this._loadAsDynamic(a)}else if(a.serviceInfoResponse&&
a.serviceInfoResponse.pixelSizeX){c=new A(a.serviceInfoResponse.spatialReference);h=this._sameSpatialReference(c,this.map.spatialReference);if(!h){this.onError("esri.dijit.BasemapGallery: Unable to switch basemap because new basemap has a different spatial reference.");return}if(!0===a.serviceInfoResponse.singleFusedMapCache&&0<this.map.getNumLevels()&&(q=this._sameTilingScheme(a.serviceInfoResponse.tileInfo,this.map.__tileInfo),!q)){this.onError("esri.dijit.BasemapGallery: Unable to switch basemap because new basemap has a different tiling scheme.");
return}a.serviceInfoResponse.singleFusedMapCache?g=new u(a.url,{resourceInfo:a.serviceInfoResponse,opacity:a.opacity,visible:a.visibility}):a.serviceInfoResponse.pixelSizeX?(g=new C,g.bandIds=a.bandIds,!a.bandIds&&(a.serviceInfoResponse.bandCount&&3<parseInt(a.serviceInfoResponse.bandCount,10))&&(g.bandIds=[0,1,2]),g=new B(a.url,{resourceInfo:a.serviceInfoResponse,opacity:a.opacity,visible:a.visibility,imageServiceParameters:g})):(g=new D,g.format="png24",a.serviceInfoResponse.supportedImageFormatTypes&&
-1<a.serviceInfoResponse.supportedImageFormatTypes.indexOf("PNG32")&&(g.format="png32"),g=new v(a.url,{resourceInfo:a.serviceInfoResponse,opacity:a.opacity,visible:a.visibility,imageParameters:g}))}"VectorTileLayer"===a.type?r++:g&&(0===d&&this._removeBasemapLayers(),g._basemapGalleryLayerType="basemap",this.map.addLayer(g,r),r++)}},this);this._selectBasemapInProgress=!1;this.onSelectionChange()}},_removeBasemapLayers:function(){var a=this.map.layerIds,b=[];f.forEach(a,function(a){a=this.map.getLayer(a);
"basemap"===a._basemapGalleryLayerType&&b.push(a)},this);0===b.length&&0<a.length&&b.push(this.map.getLayer(a[0]));0<b.length&&f.forEach(b,function(a){this.map.removeLayer(a)},this)},_updateReferenceLayer:function(a){var b;this._removeReferenceLayer();for(b=0;b<a.layers.length;b++)!0===a.layers[b].isReference&&this._addReferenceLayer(a.layers[b])},_removeReferenceLayer:function(){var a;for(a=this.map.layerIds.length-1;0<=a;a--){var b=this.map.getLayer(this.map.layerIds[a]);"reference"===b._basemapGalleryLayerType&&
this.map.removeLayer(b)}},_addReferenceLayer:function(a){"VectorTileLayer"===a.type?this._handleReferenceServiceInfoResponse(a):this._getServiceInfo(a.url,e.hitch(this,"_handleReferenceServiceInfoResponse",a))},_handleReferenceServiceInfoResponse:function(a,b,d){var c;a.serviceInfoResponse=b;"VectorTileLayer"===a.type?c=new w(a.styleUrl,{visible:a.visibility,opacity:a.opacity}):b&&b.mapName?c=!0===b.singleFusedMapCache?this._loadAsCached(a):this._loadAsDynamic(a):b&&b.pixelSizeX&&(a.serviceInfoResponse.singleFusedMapCache?
c=new u(a.url,{resourceInfo:a.serviceInfoResponse,opacity:a.opacity,visible:a.visibility}):a.serviceInfoResponse.pixelSizeX?(d=new C,d.bandIds=a.bandIds,!a.bandIds&&(b.bandCount&&3<parseInt(b.bandCount,10))&&(d.bandIds=[0,1,2]),c=new B(a.url,{resourceInfo:b,opacity:a.opacity,visible:a.visibility,imageServiceParameters:d})):(b=new D,b.format="png24",a.serviceInfoResponse.supportedImageFormatTypes&&-1<a.serviceInfoResponse.supportedImageFormatTypes.indexOf("PNG32")&&(b.format="png32"),b.transparent=
!0,c=new v(a.url,{resourceInfo:a.serviceInfoResponse,opacity:a.opacity,visible:a.visibility,imageParameters:b})));c&&(c._basemapGalleryLayerType="reference",c.attr("data-reference",!0),this.map.addLayer(c))},_getServiceInfo:function(a,b){return n({url:a,content:{f:"json"},callbackParamName:"callback",load:function(a,c){b&&b(a,c)},error:e.hitch(this,function(a,b){this.onError("esri.dijit.BasemapGallery: service not accessible.")})})},_loadAsCached:function(a){var b=[];a.displayLevels||(b=f.map(a.serviceInfoResponse.tileInfo.lods,
function(a){return a.level}));var d=null;a.exclusionAreas&&a.exclusionAreas.length&&(d=[],f.forEach(a.exclusionAreas,function(a){d.push({minZoom:a.minZoom,maxZoom:a.maxZoom,minScale:a.minScale,maxScale:a.maxScale,geometry:new l(a.geometry)})}));return new u(a.url,{resourceInfo:a.serviceInfoResponse,opacity:a.opacity,visible:a.visibility,exclusionAreas:d,displayLevels:a.displayLevels||b})},_loadAsDynamic:function(a){var b=new v(a.url,{resourceInfo:a.serviceInfoResponse,opacity:a.opacity,visible:a.visibility});
a.visibleLayers&&b.setVisibleLayers(a.visibleLayers);return b},_getIntersectionPercent:function(a,b){var d=b.intersects(a);if(d){var d=d.getWidth()*d.getHeight(),c=b.getWidth()*b.getHeight();return 100*(d/c)}return 0},_getIds:function(){var a=[];f.forEach(this.basemaps,function(b){a.push(b.id)},this);return a},_getUniqueId:function(){for(var a=","+this._getIds().toString()+",",b=0;;)if(-1<a.indexOf(",basemap_"+b+","))b++;else return"basemap_"+b},_isUniqueId:function(a){return-1===(","+this._getIds().toString()+
",").indexOf(","+a+",")?!0:!1},_isAgolService:function(a){return!a?!1:-1!==a.indexOf("/services.arcgisonline.com/")||-1!==a.indexOf("/server.arcgisonline.com/")},_isHostedService:function(a){return!a?!1:-1!==a.indexOf(".arcgis.com/")},_sameSpatialReference:function(a,b){return a&&b&&a.wkt==b.wkt&&(a.wkid===b.wkid||t.isDefined(a.latestWkid)&&a.latestWkid===b.wkid||t.isDefined(b.latestWkid)&&a.wkid===b.latestWkid||t.isDefined(a.latestWkid)&&a.latestWkid===b.latestWkid)||a&&b&&a.isWebMercator()&&b.isWebMercator()?
!0:!1},_sameTilingScheme:function(a,b){var d=this.map,d=d.width>d.height?d.width:d.height,c=!1,f=!1,e,h;for(e=0;e<a.lods.length;e++){var l=a.lods[e].scale;a.dpi!==b.dpi&&(l=a.lods[e].scale/a.dpi);for(h=0;h<b.lods.length;h++){var k=b.lods[h].scale;a.dpi!==b.dpi&&(k=b.lods[h].scale/b.dpi);if(Math.abs(k-l)/k<1/d)if(c){f=!0;break}else c=!0;if(k<l)break}if(f)break}return f||c&&(1===a.lods.length||1===b.lods.length)?!0:!1}});G("extend-esri")&&e.setObject("dijit.BasemapGallery",k,m);return k});