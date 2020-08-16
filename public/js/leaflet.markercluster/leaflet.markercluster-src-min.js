(function(r,p,t){r=80;0<ClusterOptions.maxClusterRadius.length&&(r=ClusterOptions.maxClusterRadius);L.MarkerClusterGroup=L.FeatureGroup.extend({options:{maxClusterRadius:r,iconCreateFunction:null,spiderfyOnMaxZoom:!0,showCoverageOnHover:!0,zoomToBoundsOnClick:!0,singleMarkerMode:!1,disableClusteringAtZoom:null,removeOutsideVisibleBounds:!0,animateAddingMarkers:!1,spiderfyDistanceMultiplier:1,chunkedLoading:!1,chunkInterval:200,chunkDelay:50,chunkProgress:null,polygonOptions:{}},initialize:function(a){L.Util.setOptions(this,
a);this.options.iconCreateFunction||(this.options.iconCreateFunction=this._defaultIconCreateFunction);this._featureGroup=L.featureGroup();this._featureGroup.on(L.FeatureGroup.EVENTS,this._propagateEvent,this);this._nonPointGroup=L.featureGroup();this._nonPointGroup.on(L.FeatureGroup.EVENTS,this._propagateEvent,this);this._inZoomAnimation=0;this._needsClustering=[];this._needsRemoving=[];this._currentShownBounds=null;this._queue=[]},addLayer:function(a){if(a instanceof L.LayerGroup){var b=[];for(c in a._layers)b.push(a._layers[c]);
return this.addLayers(b)}if(!a.getLatLng)return this._nonPointGroup.addLayer(a),this;if(!this._map)return this._needsClustering.push(a),this;if(this.hasLayer(a))return this;this._unspiderfy&&this._unspiderfy();this._addLayer(a,this._maxZoom);b=a;var c=this._map.getZoom();if(a.__parent)for(;b.__parent._zoom>=c;)b=b.__parent;this._currentShownBounds.contains(b.getLatLng())&&(this.options.animateAddingMarkers?this._animationAddLayer(a,b):this._animationAddLayerNonAnimated(a,b));return this},removeLayer:function(a){if(a instanceof
L.LayerGroup){var b=[],c;for(c in a._layers)b.push(a._layers[c]);return this.removeLayers(b)}if(!a.getLatLng)return this._nonPointGroup.removeLayer(a),this;if(!this._map)return!this._arraySplice(this._needsClustering,a)&&this.hasLayer(a)&&this._needsRemoving.push(a),this;if(!a.__parent)return this;this._unspiderfy&&(this._unspiderfy(),this._unspiderfyLayer(a));this._removeLayer(a,!0);this._featureGroup.hasLayer(a)&&(this._featureGroup.removeLayer(a),a.setOpacity&&a.setOpacity(1));return this},addLayers:function(a){var b=
this._featureGroup,c=this._nonPointGroup,d=this.options.chunkedLoading,h=this.options.chunkInterval,f=this.options.chunkProgress,g;if(this._map){var e=0,k=(new Date).getTime(),l=L.bind(function(){for(var g=(new Date).getTime();e<a.length&&!(d&&0===e%200&&(new Date).getTime()-g>h);e++)if(m=a[e],!m.getLatLng)c.addLayer(m);else if(!this.hasLayer(m)&&(this._addLayer(m,this._maxZoom),m.__parent&&2===m.__parent.getChildCount())){var n=m.__parent.getAllChildMarkers();b.removeLayer(n[0]===m?n[1]:n[0])}f&&
f(e,a.length,(new Date).getTime()-k);e===a.length?(this._featureGroup.eachLayer(function(a){a instanceof L.MarkerCluster&&a._iconNeedsUpdate&&a._updateIcon()}),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds)):setTimeout(l,this.options.chunkDelay)},this);l()}else{var q=[];var n=0;for(g=a.length;n<g;n++){var m=a[n];m.getLatLng?this.hasLayer(m)||q.push(m):c.addLayer(m)}this._needsClustering=this._needsClustering.concat(q)}return this},removeLayers:function(a){var b,
c=this._featureGroup,d=this._nonPointGroup;if(!this._map){var h=0;for(b=a.length;h<b;h++){var f=a[h];this._arraySplice(this._needsClustering,f);d.removeLayer(f)}return this}h=0;for(b=a.length;h<b;h++)f=a[h],f.__parent?(this._removeLayer(f,!0,!0),c.hasLayer(f)&&(c.removeLayer(f),f.setOpacity&&f.setOpacity(1))):d.removeLayer(f);this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds);c.eachLayer(function(a){a instanceof L.MarkerCluster&&a._updateIcon()});return this},
clearLayers:function(){this._map||(this._needsClustering=[],delete this._gridClusters,delete this._gridUnclustered);this._noanimationUnspiderfy&&this._noanimationUnspiderfy();this._featureGroup.clearLayers();this._nonPointGroup.clearLayers();this.eachLayer(function(a){delete a.__parent});this._map&&this._generateInitialClusters();return this},getBounds:function(){var a=new L.LatLngBounds;this._topClusterLevel&&a.extend(this._topClusterLevel._bounds);for(var b=this._needsClustering.length-1;0<=b;b--)a.extend(this._needsClustering[b].getLatLng());
a.extend(this._nonPointGroup.getBounds());return a},eachLayer:function(a,b){var c=this._needsClustering.slice(),d;this._topClusterLevel&&this._topClusterLevel.getAllChildMarkers(c);for(d=c.length-1;0<=d;d--)a.call(b,c[d]);this._nonPointGroup.eachLayer(a,b)},getLayers:function(){var a=[];this.eachLayer(function(b){a.push(b)});return a},getLayer:function(a){var b=null;this.eachLayer(function(c){L.stamp(c)===a&&(b=c)});return b},hasLayer:function(a){if(!a)return!1;var b,c=this._needsClustering;for(b=
c.length-1;0<=b;b--)if(c[b]===a)return!0;c=this._needsRemoving;for(b=c.length-1;0<=b;b--)if(c[b]===a)return!1;return!(!a.__parent||a.__parent._group!==this)||this._nonPointGroup.hasLayer(a)},zoomToShowLayer:function(a,b){var c=function(){if((a._icon||a.__parent._icon)&&!this._inZoomAnimation)if(this._map.off("moveend",c,this),this.off("animationend",c,this),a._icon)b();else if(a.__parent._icon){var d=function(){this.off("spiderfied",d,this);b()};this.on("spiderfied",d,this);a.__parent.spiderfy()}};
if(a._icon&&this._map.getBounds().contains(a.getLatLng()))b();else if(a.__parent._zoom<this._map.getZoom())this._map.on("moveend",c,this),this._map.panTo(a.getLatLng());else{var d=function(){this._map.off("movestart",d,this);d=null};this._map.on("movestart",d,this);this._map.on("moveend",c,this);this.on("animationend",c,this);a.__parent.zoomToBounds();d&&c.call(this)}},onAdd:function(a){this._map=a;var b;if(!isFinite(this._map.getMaxZoom()))throw"Map has no maxZoom specified";this._featureGroup.onAdd(a);
this._nonPointGroup.onAdd(a);this._gridClusters||this._generateInitialClusters();a=0;for(b=this._needsRemoving.length;a<b;a++){var c=this._needsRemoving[a];this._removeLayer(c,!0)}this._needsRemoving=[];this._zoom=this._map.getZoom();this._currentShownBounds=this._getExpandedVisibleBounds();this._map.on("zoomend",this._zoomEnd,this);this._map.on("moveend",this._moveEnd,this);this._spiderfierOnAdd&&this._spiderfierOnAdd();this._bindEvents();b=this._needsClustering;this._needsClustering=[];this.addLayers(b)},
onRemove:function(a){a.off("zoomend",this._zoomEnd,this);a.off("moveend",this._moveEnd,this);this._unbindEvents();this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim","");this._spiderfierOnRemove&&this._spiderfierOnRemove();this._hideCoverage();this._featureGroup.onRemove(a);this._nonPointGroup.onRemove(a);this._featureGroup.clearLayers();this._map=null},getVisibleParent:function(a){for(;a&&!a._icon;)a=a.__parent;return a||null},_arraySplice:function(a,b){for(var c=
a.length-1;0<=c;c--)if(a[c]===b)return a.splice(c,1),!0},_removeLayer:function(a,b,c){var d=this._gridClusters,h=this._gridUnclustered,f=this._featureGroup,g=this._map;if(b)for(var e=this._maxZoom;0<=e&&h[e].removeObject(a,g.project(a.getLatLng(),e));e--);e=a.__parent;for(this._arraySplice(e._markers,a);e;){e._childCount--;if(0>e._zoom)break;else if(b&&1>=e._childCount){var k=e._markers[0]===a?e._markers[1]:e._markers[0];d[e._zoom].removeObject(e,g.project(e._cLatLng,e._zoom));h[e._zoom].addObject(k,
g.project(k.getLatLng(),e._zoom));this._arraySplice(e.__parent._childClusters,e);e.__parent._markers.push(k);k.__parent=e.__parent;e._icon&&(f.removeLayer(e),c||f.addLayer(k))}else e._recalculateBounds(),c&&e._icon||e._updateIcon();e=e.__parent}delete a.__parent},_isOrIsParent:function(a,b){for(;b;){if(a===b)return!0;b=b.parentNode}return!1},_propagateEvent:function(a){if(a.layer instanceof L.MarkerCluster){if(a.originalEvent&&this._isOrIsParent(a.layer._icon,a.originalEvent.relatedTarget))return;
a.type="cluster"+a.type}this.fire(a.type,a)},_defaultIconCreateFunction:function(a){a=a.getChildCount();var b=" marker-cluster-";return new L.DivIcon({html:"<div><span>"+a+"</span></div>",className:"marker-cluster"+(10>a?b+"small":100>a?b+"medium":b+"large"),iconSize:new L.Point(40,40)})},_bindEvents:function(){var a=this._map,b=this.options.showCoverageOnHover,c=this.options.zoomToBoundsOnClick;if(this.options.spiderfyOnMaxZoom||c)this.on("clusterclick",this._zoomOrSpiderfy,this);b&&(this.on("clustermouseover",
this._showCoverage,this),this.on("clustermouseout",this._hideCoverage,this),a.on("zoomend",this._hideCoverage,this))},_zoomOrSpiderfy:function(a){var b=this._map;b.getMaxZoom()===b.getZoom()?this.options.spiderfyOnMaxZoom&&a.layer.spiderfy():this.options.zoomToBoundsOnClick&&a.layer.zoomToBounds();a.originalEvent&&13===a.originalEvent.keyCode&&b._container.focus()},_showCoverage:function(a){var b=this._map;this._inZoomAnimation||(this._shownPolygon&&b.removeLayer(this._shownPolygon),2<a.layer.getChildCount()&&
a.layer!==this._spiderfied&&(this._shownPolygon=new L.Polygon(a.layer.getConvexHull(),this.options.polygonOptions),b.addLayer(this._shownPolygon)))},_hideCoverage:function(){this._shownPolygon&&(this._map.removeLayer(this._shownPolygon),this._shownPolygon=null)},_unbindEvents:function(){var a=this.options.showCoverageOnHover,b=this.options.zoomToBoundsOnClick,c=this._map;(this.options.spiderfyOnMaxZoom||b)&&this.off("clusterclick",this._zoomOrSpiderfy,this);a&&(this.off("clustermouseover",this._showCoverage,
this),this.off("clustermouseout",this._hideCoverage,this),c.off("zoomend",this._hideCoverage,this))},_zoomEnd:function(){this._map&&(this._mergeSplitClusters(),this._zoom=this._map._zoom,this._currentShownBounds=this._getExpandedVisibleBounds())},_moveEnd:function(){if(!this._inZoomAnimation){var a=this._getExpandedVisibleBounds();this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,this._zoom,a);this._topClusterLevel._recursivelyAddChildrenToMap(null,this._map._zoom,a);
this._currentShownBounds=a}},_generateInitialClusters:function(){var a=this._map.getMaxZoom(),b=this.options.maxClusterRadius,c=b;"function"!==typeof b&&(c=function(){return b});this.options.disableClusteringAtZoom&&(a=this.options.disableClusteringAtZoom-1);this._maxZoom=a;this._gridClusters={};for(this._gridUnclustered={};0<=a;a--)this._gridClusters[a]=new L.DistanceGrid(c(a)),this._gridUnclustered[a]=new L.DistanceGrid(c(a));this._topClusterLevel=new L.MarkerCluster(this,-1)},_addLayer:function(a,
b){var c=this._gridClusters,d=this._gridUnclustered;this.options.singleMarkerMode&&(a.options.icon=this.options.iconCreateFunction({getChildCount:function(){return 1},getAllChildMarkers:function(){return[a]}}));for(;0<=b;b--){var h=this._map.project(a.getLatLng(),b);var f=c[b].getNearObject(h);if(f){f._addChild(a);a.__parent=f;return}if(f=d[b].getNearObject(h)){(h=f.__parent)&&this._removeLayer(f,!1);var g=new L.MarkerCluster(this,b,f,a);c[b].addObject(g,this._map.project(g._cLatLng,b));f.__parent=
g;var e=a.__parent=g;for(g=b-1;g>h._zoom;g--)e=new L.MarkerCluster(this,g,e),c[g].addObject(e,this._map.project(f.getLatLng(),g));h._addChild(e);for(g=b;0<=g&&d[g].removeObject(f,this._map.project(f.getLatLng(),g));g--);return}d[b].addObject(a,h)}this._topClusterLevel._addChild(a);a.__parent=this._topClusterLevel},_enqueue:function(a){this._queue.push(a);this._queueTimeout||(this._queueTimeout=setTimeout(L.bind(this._processQueue,this),300))},_processQueue:function(){for(var a=0;a<this._queue.length;a++)this._queue[a].call(this);
this._queue.length=0;clearTimeout(this._queueTimeout);this._queueTimeout=null},_mergeSplitClusters:function(){this._processQueue();this._zoom<this._map._zoom&&this._currentShownBounds.intersects(this._getExpandedVisibleBounds())?(this._animationStart(),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,this._zoom,this._getExpandedVisibleBounds()),this._animationZoomIn(this._zoom,this._map._zoom)):this._zoom>this._map._zoom?(this._animationStart(),this._animationZoomOut(this._zoom,
this._map._zoom)):this._moveEnd()},_getExpandedVisibleBounds:function(){if(!this.options.removeOutsideVisibleBounds)return this._map.getBounds();var a=this._map.getBounds(),b=a._southWest;a=a._northEast;var c=L.Browser.mobile?0:Math.abs(b.lat-a.lat),d=L.Browser.mobile?0:Math.abs(b.lng-a.lng);return new L.LatLngBounds(new L.LatLng(b.lat-c,b.lng-d,!0),new L.LatLng(a.lat+c,a.lng+d,!0))},_animationAddLayerNonAnimated:function(a,b){if(b===a)this._featureGroup.addLayer(a);else if(2===b._childCount){b._addToMap();
var c=b.getAllChildMarkers();this._featureGroup.removeLayer(c[0]);this._featureGroup.removeLayer(c[1])}else b._updateIcon()}});L.MarkerClusterGroup.include(L.DomUtil.TRANSITION?{_animationStart:function(){this._map._mapPane.className+=" leaflet-cluster-anim";this._inZoomAnimation++},_animationEnd:function(){this._map&&(this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim",""));this._inZoomAnimation--;this.fire("animationend")},_animationZoomIn:function(a,b){var c=
this._getExpandedVisibleBounds(),d=this._featureGroup,h;this._topClusterLevel._recursively(c,a,0,function(f){var g=f._latlng,e=f._markers;c.contains(g)||(g=null);f._isSingleParent()&&a+1===b?(d.removeLayer(f),f._recursivelyAddChildrenToMap(null,b,c)):(f.setOpacity(0),f._recursivelyAddChildrenToMap(g,b,c));for(h=e.length-1;0<=h;h--)f=e[h],c.contains(f._latlng)||d.removeLayer(f)});this._forceLayout();this._topClusterLevel._recursivelyBecomeVisible(c,b);d.eachLayer(function(a){a instanceof L.MarkerCluster||
!a._icon||a.setOpacity(1)});this._topClusterLevel._recursively(c,a,b,function(a){a._recursivelyRestoreChildPositions(b)});this._enqueue(function(){this._topClusterLevel._recursively(c,a,0,function(a){d.removeLayer(a);a.setOpacity(1)});this._animationEnd()})},_animationZoomOut:function(a,b){this._animationZoomOutSingle(this._topClusterLevel,a-1,b);this._topClusterLevel._recursivelyAddChildrenToMap(null,b,this._getExpandedVisibleBounds());this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,
a,this._getExpandedVisibleBounds())},_animationZoomOutSingle:function(a,b,c){var d=this._getExpandedVisibleBounds();a._recursivelyAnimateChildrenInAndAddSelfToMap(d,b+1,c);var h=this;this._forceLayout();a._recursivelyBecomeVisible(d,c);this._enqueue(function(){if(1===a._childCount){var f=a._markers[0];f.setLatLng(f.getLatLng());f.setOpacity&&f.setOpacity(1)}else a._recursively(d,c,0,function(a){a._recursivelyRemoveChildrenFromMap(d,b+1)});h._animationEnd()})},_animationAddLayer:function(a,b){var c=
this,d=this._featureGroup;d.addLayer(a);b!==a&&(2<b._childCount?(b._updateIcon(),this._forceLayout(),this._animationStart(),a._setPos(this._map.latLngToLayerPoint(b.getLatLng())),a.setOpacity(0),this._enqueue(function(){d.removeLayer(a);a.setOpacity(1);c._animationEnd()})):(this._forceLayout(),c._animationStart(),c._animationZoomOutSingle(b,this._map.getMaxZoom(),this._map.getZoom())))},_forceLayout:function(){L.Util.falseFn(p.body.offsetWidth)}}:{_animationStart:function(){},_animationZoomIn:function(a,
b){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,a);this._topClusterLevel._recursivelyAddChildrenToMap(null,b,this._getExpandedVisibleBounds());this.fire("animationend")},_animationZoomOut:function(a,b){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,a);this._topClusterLevel._recursivelyAddChildrenToMap(null,b,this._getExpandedVisibleBounds());this.fire("animationend")},_animationAddLayer:function(a,b){this._animationAddLayerNonAnimated(a,
b)}});L.markerClusterGroup=function(a){return new L.MarkerClusterGroup(a)};L.MarkerCluster=L.Marker.extend({initialize:function(a,b,c,d){L.Marker.prototype.initialize.call(this,c?c._cLatLng||c.getLatLng():new L.LatLng(0,0),{icon:this});this._group=a;this._zoom=b;this._markers=[];this._childClusters=[];this._childCount=0;this._iconNeedsUpdate=!0;this._bounds=new L.LatLngBounds;c&&this._addChild(c);d&&this._addChild(d)},getAllChildMarkers:function(a){a=a||[];for(var b=this._childClusters.length-1;0<=
b;b--)this._childClusters[b].getAllChildMarkers(a);for(b=this._markers.length-1;0<=b;b--)a.push(this._markers[b]);return a},getChildCount:function(){return this._childCount},zoomToBounds:function(){var a=this._childClusters.slice(),b=this._group._map,c=b.getBoundsZoom(this._bounds),d=this._zoom+1;b=b.getZoom();for(var h;0<a.length&&c>d;){d++;var f=[];for(h=0;h<a.length;h++)f=f.concat(a[h]._childClusters);a=f}c>d?this._group._map.setView(this._latlng,d):c<=b?this._group._map.setView(this._latlng,b+
1):this._group._map.fitBounds(this._bounds)},getBounds:function(){var a=new L.LatLngBounds;a.extend(this._bounds);return a},_updateIcon:function(){this._iconNeedsUpdate=!0;this._icon&&this.setIcon(this)},createIcon:function(){this._iconNeedsUpdate&&(this._iconObj=this._group.options.iconCreateFunction(this),this._iconNeedsUpdate=!1);return this._iconObj.createIcon()},createShadow:function(){return this._iconObj.createShadow()},_addChild:function(a,b){this._iconNeedsUpdate=!0;this._expandBounds(a);
a instanceof L.MarkerCluster?(b||(this._childClusters.push(a),a.__parent=this),this._childCount+=a._childCount):(b||this._markers.push(a),this._childCount++);this.__parent&&this.__parent._addChild(a,!0)},_expandBounds:function(a){var b=a._wLatLng||a._latlng;if(a instanceof L.MarkerCluster){this._bounds.extend(a._bounds);var c=a._childCount}else this._bounds.extend(b),c=1;this._cLatLng||(this._cLatLng=a._cLatLng||b);a=this._childCount+c;this._wLatLng?(this._wLatLng.lat=(b.lat*c+this._wLatLng.lat*this._childCount)/
a,this._wLatLng.lng=(b.lng*c+this._wLatLng.lng*this._childCount)/a):this._latlng=this._wLatLng=new L.LatLng(b.lat,b.lng)},_addToMap:function(a){a&&(this._backupLatlng=this._latlng,this.setLatLng(a));this._group._featureGroup.addLayer(this)},_recursivelyAnimateChildrenIn:function(a,b,c){this._recursively(a,0,c-1,function(a){a=a._markers;var c;for(c=a.length-1;0<=c;c--){var d=a[c];d._icon&&(d._setPos(b),d.setOpacity(0))}},function(a){a=a._childClusters;var c;for(c=a.length-1;0<=c;c--){var d=a[c];d._icon&&
(d._setPos(b),d.setOpacity(0))}})},_recursivelyAnimateChildrenInAndAddSelfToMap:function(a,b,c){this._recursively(a,c,0,function(d){d._recursivelyAnimateChildrenIn(a,d._group._map.latLngToLayerPoint(d.getLatLng()).round(),b);d._isSingleParent()&&b-1===c?(d.setOpacity(1),d._recursivelyRemoveChildrenFromMap(a,b)):d.setOpacity(0);d._addToMap()})},_recursivelyBecomeVisible:function(a,b){this._recursively(a,0,b,null,function(a){a.setOpacity(1)})},_recursivelyAddChildrenToMap:function(a,b,c){this._recursively(c,
-1,b,function(d){if(b!==d._zoom)for(var h=d._markers.length-1;0<=h;h--){var f=d._markers[h];c.contains(f._latlng)&&(a&&(f._backupLatlng=f.getLatLng(),f.setLatLng(a),f.setOpacity&&f.setOpacity(0)),d._group._featureGroup.addLayer(f))}},function(b){b._addToMap(a)})},_recursivelyRestoreChildPositions:function(a){for(var b=this._markers.length-1;0<=b;b--){var c=this._markers[b];c._backupLatlng&&(c.setLatLng(c._backupLatlng),delete c._backupLatlng)}if(a-1===this._zoom)for(a=this._childClusters.length-1;0<=
a;a--)this._childClusters[a]._restorePosition();else for(b=this._childClusters.length-1;0<=b;b--)this._childClusters[b]._recursivelyRestoreChildPositions(a)},_restorePosition:function(){this._backupLatlng&&(this.setLatLng(this._backupLatlng),delete this._backupLatlng)},_recursivelyRemoveChildrenFromMap:function(a,b,c){var d,h;this._recursively(a,-1,b-1,function(a){for(h=a._markers.length-1;0<=h;h--)d=a._markers[h],c&&c.contains(d._latlng)||(a._group._featureGroup.removeLayer(d),d.setOpacity&&d.setOpacity(1))},
function(a){for(h=a._childClusters.length-1;0<=h;h--)d=a._childClusters[h],c&&c.contains(d._latlng)||(a._group._featureGroup.removeLayer(d),d.setOpacity&&d.setOpacity(1))})},_recursively:function(a,b,c,d,h){var f=this._childClusters,g=this._zoom;if(b>g)for(g=f.length-1;0<=g;g--){var e=f[g];a.intersects(e._bounds)&&e._recursively(a,b,c,d,h)}else if(d&&d(this),h&&this._zoom===c&&h(this),c>g)for(g=f.length-1;0<=g;g--)e=f[g],a.intersects(e._bounds)&&e._recursively(a,b,c,d,h)},_recalculateBounds:function(){var a=
this._markers,b=this._childClusters,c;this._bounds=new L.LatLngBounds;delete this._wLatLng;for(c=a.length-1;0<=c;c--)this._expandBounds(a[c]);for(c=b.length-1;0<=c;c--)this._expandBounds(b[c])},_isSingleParent:function(){return 0<this._childClusters.length&&this._childClusters[0]._childCount===this._childCount}});L.DistanceGrid=function(a){this._cellSize=a;this._sqCellSize=a*a;this._grid={};this._objectPoint={}};L.DistanceGrid.prototype={addObject:function(a,b){var c=this._getCoord(b.x),d=this._getCoord(b.y),
h=this._grid;d=h[d]=h[d]||{};c=d[c]=d[c]||[];d=L.Util.stamp(a);this._objectPoint[d]=b;c.push(a)},updateObject:function(a,b){this.removeObject(a);this.addObject(a,b)},removeObject:function(a,b){var c=this._getCoord(b.x),d=this._getCoord(b.y),h=this._grid;d=h[d]=h[d]||{};h=d[c]=d[c]||[];var f;delete this._objectPoint[L.Util.stamp(a)];var g=0;for(f=h.length;g<f;g++)if(h[g]===a)return h.splice(g,1),1===f&&delete d[c],!0},eachObject:function(a,b){var c,d,h,f,g=this._grid;for(c in g){var e=g[c];for(d in e){var k=
e[d];var l=0;for(h=k.length;l<h;l++)if(f=a.call(b,k[l]))l--,h--}}},getNearObject:function(a){var b=this._getCoord(a.x),c=this._getCoord(a.y),d,h,f,g,e,k=this._objectPoint,l=this._sqCellSize,q=null;for(d=c-1;d<=c+1;d++)if(f=this._grid[d])for(h=b-1;h<=b+1;h++)if(g=f[h]){var n=0;for(e=g.length;n<e;n++){var m=g[n];var p=this._sqDist(k[L.Util.stamp(m)],a);p<l&&(l=p,q=m)}}return q},_getCoord:function(a){return Math.floor(a/this._cellSize)},_sqDist:function(a,b){var c=b.x-a.x,d=b.y-a.y;return c*c+d*d}};
(function(){L.QuickHull={getDistant:function(a,b){return(b[0].lng-b[1].lng)*(a.lat-b[0].lat)+(b[1].lat-b[0].lat)*(a.lng-b[0].lng)},findMostDistantPointFromBaseLine:function(a,b){var c=0,d=null,h=[],f;for(f=b.length-1;0<=f;f--){var g=b[f];var e=this.getDistant(g,a);0<e&&(h.push(g),e>c&&(c=e,d=g))}return{maxPoint:d,newPoints:h}},buildConvexHull:function(a,b){var c=[],d=this.findMostDistantPointFromBaseLine(a,b);return d.maxPoint?(c=c.concat(this.buildConvexHull([a[0],d.maxPoint],d.newPoints)),c=c.concat(this.buildConvexHull([d.maxPoint,
a[1]],d.newPoints))):[a[0]]},getConvexHull:function(a){var b=!1,c=!1,d=null,h=null,f;for(f=a.length-1;0<=f;f--){var g=a[f];if(!1===b||g.lat>b)d=g,b=g.lat;if(!1===c||g.lat<c)h=g,c=g.lat}return[].concat(this.buildConvexHull([h,d],a),this.buildConvexHull([d,h],a))}}})();L.MarkerCluster.include({getConvexHull:function(){var a=this.getAllChildMarkers(),b=[],c;for(c=a.length-1;0<=c;c--){var d=a[c].getLatLng();b.push(d)}return L.QuickHull.getConvexHull(b)}});L.MarkerCluster.include({_2PI:2*Math.PI,_circleFootSeparation:25,
_circleStartAngle:Math.PI/6,_spiralFootSeparation:28,_spiralLengthStart:11,_spiralLengthFactor:5,_circleSpiralSwitchover:9,spiderfy:function(){if(this._group._spiderfied!==this&&!this._group._inZoomAnimation){var a=this.getAllChildMarkers(),b=this._group._map.latLngToLayerPoint(this._latlng);this._group._unspiderfy();this._group._spiderfied=this;a.length>=this._circleSpiralSwitchover?b=this._generatePointsSpiral(a.length,b):(b.y+=10,b=this._generatePointsCircle(a.length,b));this._animationSpiderfy(a,
b)}},unspiderfy:function(a){this._group._inZoomAnimation||(this._animationUnspiderfy(a),this._group._spiderfied=null)},_generatePointsCircle:function(a,b){var c=this._group.options.spiderfyDistanceMultiplier*this._circleFootSeparation*(2+a)/this._2PI,d=this._2PI/a,h=[],f;h.length=a;for(f=a-1;0<=f;f--){var g=this._circleStartAngle+f*d;h[f]=(new L.Point(b.x+c*Math.cos(g),b.y+c*Math.sin(g)))._round()}return h},_generatePointsSpiral:function(a,b){var c=this._group.options.spiderfyDistanceMultiplier*this._spiralLengthStart,
d=this._group.options.spiderfyDistanceMultiplier*this._spiralFootSeparation,h=this._group.options.spiderfyDistanceMultiplier*this._spiralLengthFactor,f=0,g=[],e;g.length=a;for(e=a-1;0<=e;e--)f+=d/c+5E-4*e,g[e]=(new L.Point(b.x+c*Math.cos(f),b.y+c*Math.sin(f)))._round(),c+=this._2PI*h/f;return g},_noanimationUnspiderfy:function(){var a=this._group,b=a._map,c=a._featureGroup,d=this.getAllChildMarkers(),h;this.setOpacity(1);for(h=d.length-1;0<=h;h--){var f=d[h];c.removeLayer(f);f._preSpiderfyLatlng&&
(f.setLatLng(f._preSpiderfyLatlng),delete f._preSpiderfyLatlng);f.setZIndexOffset&&f.setZIndexOffset(0);f._spiderLeg&&(b.removeLayer(f._spiderLeg),delete f._spiderLeg)}a._spiderfied=null}});L.MarkerCluster.include(L.DomUtil.TRANSITION?{SVG_ANIMATION:-1<p.createElementNS("http://www.w3.org/2000/svg","animate").toString().indexOf("SVGAnimate"),_animationSpiderfy:function(a,b){var c=this._group,d=c._map,h=c._featureGroup,f=d.latLngToLayerPoint(this._latlng),g;for(g=a.length-1;0<=g;g--){var e=a[g];e.setOpacity?
(e.setZIndexOffset(1E6),e.setOpacity(0),h.addLayer(e),e._setPos(f)):h.addLayer(e)}c._forceLayout();c._animationStart();h=L.Path.SVG?0:.3;f=L.Path.SVG_NS;for(g=a.length-1;0<=g;g--){var k=d.layerPointToLatLng(b[g]);e=a[g];e._preSpiderfyLatlng=e._latlng;e.setLatLng(k);e.setOpacity&&e.setOpacity(1);k=new L.Polyline([this._latlng,k],{weight:1.5,color:"#222",opacity:h});d.addLayer(k);e._spiderLeg=k;if(L.Path.SVG&&this.SVG_ANIMATION){e=k._path.getTotalLength();k._path.setAttribute("stroke-dasharray",e+","+
e);var l=p.createElementNS(f,"animate");l.setAttribute("attributeName","stroke-dashoffset");l.setAttribute("begin","indefinite");l.setAttribute("from",e);l.setAttribute("to",0);l.setAttribute("dur",.25);k._path.appendChild(l);l.beginElement();l=p.createElementNS(f,"animate");l.setAttribute("attributeName","stroke-opacity");l.setAttribute("attributeName","stroke-opacity");l.setAttribute("begin","indefinite");l.setAttribute("from",0);l.setAttribute("to",.5);l.setAttribute("dur",.25);k._path.appendChild(l);
l.beginElement()}}this.setOpacity(.3);if(L.Path.SVG)for(this._group._forceLayout(),g=a.length-1;0<=g;g--)e=a[g]._spiderLeg,e.options.opacity=.5,e._path.setAttribute("stroke-opacity",.5);setTimeout(function(){c._animationEnd();c.fire("spiderfied")},200)},_animationUnspiderfy:function(a){var b=this._group,c=b._map,d=b._featureGroup;a=a?c._latLngToNewLayerPoint(this._latlng,a.zoom,a.center):c.latLngToLayerPoint(this._latlng);var h=this.getAllChildMarkers(),f=L.Path.SVG&&this.SVG_ANIMATION,g;b._animationStart();
this.setOpacity(1);for(g=h.length-1;0<=g;g--){var e=h[g];if(e._preSpiderfyLatlng&&(e.setLatLng(e._preSpiderfyLatlng),delete e._preSpiderfyLatlng,e.setOpacity?(e._setPos(a),e.setOpacity(0)):d.removeLayer(e),f)){var k=e._spiderLeg._path.childNodes[0];k.setAttribute("to",k.getAttribute("from"));k.setAttribute("from",0);k.beginElement();k=e._spiderLeg._path.childNodes[1];k.setAttribute("from",.5);k.setAttribute("to",0);k.setAttribute("stroke-opacity",0);k.beginElement();e._spiderLeg._path.setAttribute("stroke-opacity",
0)}}setTimeout(function(){var a=0;for(g=h.length-1;0<=g;g--)e=h[g],e._spiderLeg&&a++;for(g=h.length-1;0<=g;g--)e=h[g],e._spiderLeg&&(e.setOpacity&&(e.setOpacity(1),e.setZIndexOffset(0)),1<a&&d.removeLayer(e),c.removeLayer(e._spiderLeg),delete e._spiderLeg);b._animationEnd()},200)}}:{_animationSpiderfy:function(a,b){var c=this._group,d=c._map,h=c._featureGroup,f;for(f=a.length-1;0<=f;f--){var g=d.layerPointToLatLng(b[f]);var e=a[f];e._preSpiderfyLatlng=e._latlng;e.setLatLng(g);e.setZIndexOffset&&e.setZIndexOffset(1E6);
h.addLayer(e);g=new L.Polyline([this._latlng,g],{weight:1.5,color:"#222"});d.addLayer(g);e._spiderLeg=g}this.setOpacity(.3);c.fire("spiderfied")},_animationUnspiderfy:function(){this._noanimationUnspiderfy()}});L.MarkerClusterGroup.include({_spiderfied:null,_spiderfierOnAdd:function(){this._map.on("click",this._unspiderfyWrapper,this);if(this._map.options.zoomAnimation)this._map.on("zoomstart",this._unspiderfyZoomStart,this);this._map.on("zoomend",this._noanimationUnspiderfy,this);L.Path.SVG&&!L.Browser.touch&&
this._map._initPathRoot()},_spiderfierOnRemove:function(){this._map.off("click",this._unspiderfyWrapper,this);this._map.off("zoomstart",this._unspiderfyZoomStart,this);this._map.off("zoomanim",this._unspiderfyZoomAnim,this);this._unspiderfy()},_unspiderfyZoomStart:function(){if(this._map)this._map.on("zoomanim",this._unspiderfyZoomAnim,this)},_unspiderfyZoomAnim:function(a){L.DomUtil.hasClass(this._map._mapPane,"leaflet-touching")||(this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._unspiderfy(a))},
_unspiderfyWrapper:function(){this._unspiderfy()},_unspiderfy:function(a){this._spiderfied&&this._spiderfied.unspiderfy(a)},_noanimationUnspiderfy:function(){this._spiderfied&&this._spiderfied._noanimationUnspiderfy()},_unspiderfyLayer:function(a){a._spiderLeg&&(this._featureGroup.removeLayer(a),a.setOpacity(1),a.setZIndexOffset(0),this._map.removeLayer(a._spiderLeg),delete a._spiderLeg)}})})(window,document);