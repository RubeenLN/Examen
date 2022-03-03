require([
  "esri/map",
  "esri/geometry/Extent",
  "esri/layers/FeatureLayer",
  "esri/tasks/QueryTask",
  "esri/tasks/query",
  "esri/tasks/ServiceAreaParameters",
  "esri/tasks/ServiceAreaTask",
  "esri/tasks/FeatureSet",
  "esri/graphic",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/Color",

  "dojo/on",
  "dojo/_base/Color",
  "dojo/_base/array",
  "dojo/dom",
  "dojo/parser",
  "dojo/ready",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/TitlePane",
  "dijit/layout/TabContainer",
  "dojo/domReady!",
    ], 
    function (Map, Extent, FeatureLayer, QueryTask, Query, ServiceAreaParameters, ServiceAreaTask, FeatureSet, Graphic, SimpleFillSymbol, SimpleMarkerSymbol, Color,
              on, Color, array, dom, parser, ready, BorderContainer, ContentPane){


        var mapMain = new Map("map",{
            basemap: "topo",
            extent: new Extent({
                xmin: -415811.796930644,
                ymin: 4919170.17081106,
                xmax: -400757.003653631,
                ymax: 4930449.88246117,
                spatialReference: {
                wkid: 102100}
            })
        })

        var hospitales = new FeatureLayer('https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUDPF/FeatureServer/0',{
            outFields: ['*'],
        })
        mapMain.addLayer(hospitales)
        console.log("hospitales", hospitales)



        var queryTask = new QueryTask('https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUDPF/FeatureServer/0')

        var query = new Query()
        query.outFields = ['*']
        query.where = "1 = 1";
        query.returnGeometry = true

        hospitales.selectFeatures(query)
        queryTask.execute(query, consultaEjecutada)




        var color1 = new SimpleFillSymbol();
        color1.setColor(new Color([230, 0, 0, 0.69]));
        
        var color2 = new SimpleFillSymbol();
        color2.setColor(new Color([255, 255, 0, 0.69]));   

        var color3 = new SimpleFillSymbol();
        color3.setColor(new Color([56, 168, 0, 0.69]));
        var facilities





        function consultaEjecutada (todoshospitales){

            console.log("todoshospitales", todoshospitales)
            mapMain.graphics.clear();
            

            var features= [];
            var graphic = new Graphic(todoshospitales);
            features.push(graphic);
            facilities = new FeatureSet();
            facilities.features = features;
  


            var params = new ServiceAreaParameters();
            console.log("parametros", params);
            params.defaultBreaks = [3, 5, 10];
            params.facilities = facilities;
            params.impedanceAttribute = "WalkTime";

    

            var serviceAreaTask = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer/Service%20Area")


            for (var centrosalud in todoshospitales){
                serviceAreaTask.solve(params,function(serviceAreaSolveResult){
                    serviceAreaSolveResult.serviceAreaPolygons[0],function(graphic){
                        map.graphics.add(graphic);
                      }
                })
            }




    }

    
            
              });

        


