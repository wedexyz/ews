

    var firebaseConfig = {
        apiKey: "AIzaSyBYVwVZUBLXSm7iR5Fp6k-dziJGEuhwExk",
        authDomain: "megaboth007.firebaseapp.com",
        databaseURL: "https://megaboth007.firebaseio.com",
        projectId: "megaboth007",
        storageBucket: "megaboth007.appspot.com",
        messagingSenderId: "942424390212",
        appId: "1:942424390212:web:c3622743b0fba57b5a1a11"
                    
      };
    firebase.initializeApp(firebaseConfig);
        var dbRef = firebase.database();
                
    //melakukan call back pada node firebase      
    var db = firebase.database();
    var angin = db.ref("/Jarak");
    var gyro = db.ref("/Gyro");;
    var tes = db.ref("/Tes");;
    var coba = db.ref("/Coba");
    
    
    
    const lightController = document.querySelector(".lights");
    const lights = document.querySelectorAll(".change-light");
    function clearLights() {
      lightController.className = "lights off";
    }
    
    function handleClick() {
      // Clear lights on any button click
      clearLights();
      
      /* One function handles all the lights by listening for a 
         class name within each button */
      if (this.classList.contains("stop")) {
        lightController.classList.add("stop");
      } else if (this.classList.contains("slow")) {
        lightController.classList.add("slow");
      } else if (this.classList.contains("go")) {
        lightController.classList.add("go");
      }
    }
    // Loop through each ligth and bind a click event 
    lights.forEach(light => {
      light.addEventListener("click", handleClick);
    });
    
    //melakukan call back pada node firebase      
    var angin = db.ref("/Jarak");
    
    
    gyro.on("value", function(snapshot) {
      
    if (snapshot.val()==1){
          clearLights()
          lightController.classList.add("stop")
          playAudio()
          pauseAudio1()
          pauseAudio2()
    
    }
    
    else if (snapshot.val()==0){
          clearLights()
          
          lightController.classList.add("go")
          playAudio2()
          pauseAudio()
          pauseAudio1()
    }
    
    
    })

    angin.on("value", function(snapshot) {
      
      if (snapshot.val()==1){
            clearLights()
            
            lightController.classList.add("stop")
            playAudio()
            pauseAudio1()
            pauseAudio2()
      
      }
      
      else if (snapshot.val()==0){
            clearLights()
            //lightController.classList.add("slow")
            lightController.classList.add("go")
            playAudio2()
            pauseAudio()
            pauseAudio1()
      }
      
      
      })
    

    am4core.ready(function() {
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0;
        chart.padding(0, 0, 0, 0);
        chart.zoomOutButton.disabled = true;
        
        var data = [];
        var visits = 0;
        var i = 0;
        
        for (i = 0; i <= 100; i++) {
            data.push({ date: new Date().setSeconds(i - 30), value: visits });
        }
        
        chart.data = data;
        
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 30;
        dateAxis.dateFormats.setKey("second", "ss");
        dateAxis.periodChangeDateFormats.setKey("second", "[bold]h:mm a");
        dateAxis.periodChangeDateFormats.setKey("minute", "[bold]h:mm a");
        dateAxis.periodChangeDateFormats.setKey("hour", "[bold]h:mm a");
        dateAxis.renderer.inside = true;
        dateAxis.renderer.axisFills.template.disabled = false;
        dateAxis.renderer.ticks.template.disabled = true;
        
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = false;
        valueAxis.interpolationDuration = 100;
        valueAxis.rangeChangeDuration = 100;
        valueAxis.renderer.inside = true;
        valueAxis.renderer.minLabelPosition = 0.05;
        valueAxis.renderer.maxLabelPosition = 0.95;
        valueAxis.renderer.axisFills.template.disabled = true;
        valueAxis.renderer.ticks.template.disabled = true;
        
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "value";
        series.interpolationDuration = 500;
        series.defaultState.transitionDuration = 0;
        series.tensionX = 0.8;
        
        chart.events.on("datavalidated", function () {
            dateAxis.zoom({ start: 1 / 15, end: 1.2 }, false, true);
        });
        
        dateAxis.interpolationDuration = 100;
        dateAxis.rangeChangeDuration = 100;
        
        document.addEventListener("visibilitychange", function() {
            if (document.hidden) {
                if (interval) {
                    clearInterval(interval);
                }
            }
            else {
                startInterval();
            }
        }, false);
        
        // add data
        var interval;
        function startInterval() {
            interval = setInterval(function() {
                angin.on("value", function(snapshot) {
                //console.log(snapshot.val())
                visits=  (snapshot.val());
                    });
                //visits =visits + Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
                console.log(visits)
                var lastdataItem = series.dataItems.getIndex(series.dataItems.length - 1);
                chart.addData(
                    { date: new Date(lastdataItem.dateX.getTime() + 1000), value: visits },
                    1
                );
            }, 1000);
        }
        
        startInterval();
        
        // all the below is optional, makes some fancy effects
        // gradient fill of the series
        series.fillOpacity = 1;
        var gradient = new am4core.LinearGradient();
        gradient.addColor(chart.colors.getIndex(0), 0.2);
        gradient.addColor(chart.colors.getIndex(0), 0);
        series.fill = gradient;
        
        // this makes date axis labels to fade out
        dateAxis.renderer.labels.template.adapter.add("fillOpacity", function (fillOpacity, target) {
            var dataItem = target.dataItem;
            return dataItem.position;
        })
        
        // need to set this, otherwise fillOpacity is not changed and not set
        dateAxis.events.on("validated", function () {
            am4core.iter.each(dateAxis.renderer.labels.iterator(), function (label) {
                label.fillOpacity = label.fillOpacity;
            })
        })
        
        // this makes date axis labels which are at equal minutes to be rotated
        dateAxis.renderer.labels.template.adapter.add("rotation", function (rotation, target) {
            var dataItem = target.dataItem;
            if (dataItem.date && dataItem.date.getTime() == am4core.time.round(new Date(dataItem.date.getTime()), "minute").getTime()) {
                target.verticalCenter = "middle";
                target.horizontalCenter = "left";
                return -90;
            }
            else {
                target.verticalCenter = "bottom";
                target.horizontalCenter = "middle";
                return 0;
            }
        })
        
        // bullet at the front of the line
        var bullet = series.createChild(am4charts.CircleBullet);
        bullet.circle.radius = 5;
        bullet.fillOpacity = 1;
        bullet.fill = chart.colors.getIndex(0);
        bullet.isMeasured = false;
        
        series.events.on("validated", function() {
            bullet.moveTo(series.dataItems.last.point);
            bullet.validatePosition();
        });
        
        }); // end am4core.ready()
      
    
    am4core.ready(function() {
        
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        var chart = am4core.create("chartdiv1", am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0;
        
        chart.padding(0, 0, 0, 0);
        
        chart.zoomOutButton.disabled = true;
        
        var data = [];
        var visits = 0;
        var i = 0;
        
        for (i = 0; i <= 100; i++) {
            //visits -= Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
            data.push({ date: new Date().setSeconds(i - 30), value: visits });
        }
        
        chart.data = data;
        
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 30;
        dateAxis.dateFormats.setKey("second", "ss");
        dateAxis.periodChangeDateFormats.setKey("second", "[bold]h:mm a");
        dateAxis.periodChangeDateFormats.setKey("minute", "[bold]h:mm a");
        dateAxis.periodChangeDateFormats.setKey("hour", "[bold]h:mm a");
        dateAxis.renderer.inside = true;
        dateAxis.renderer.axisFills.template.disabled = true;
        dateAxis.renderer.ticks.template.disabled = true;
        
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.interpolationDuration = 500;
        valueAxis.rangeChangeDuration = 100;
        valueAxis.renderer.inside = true;
        valueAxis.renderer.minLabelPosition = 0.05;
        valueAxis.renderer.maxLabelPosition = 0.95;
        valueAxis.renderer.axisFills.template.disabled = true;
        valueAxis.renderer.ticks.template.disabled = true;
        
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "value";
        series.interpolationDuration = 500;
        series.defaultState.transitionDuration = 0;
        series.tensionX = 0.8;
        
        chart.events.on("datavalidated", function () {
            dateAxis.zoom({ start: 1 / 15, end: 1.2 }, false, true);
        });
        
        dateAxis.interpolationDuration = 500;
        dateAxis.rangeChangeDuration = 500;
        
        document.addEventListener("visibilitychange", function() {
            if (document.hidden) {
                if (interval) {
                    clearInterval(interval);
                }
            }
            else {
                startInterval();
            }
        }, false);
        
        // add data
        var interval;
        function startInterval() {
            interval = setInterval(function() {
                gyro.on("value", function(snapshot) {
                //console.log(snapshot.val())
                visits=  (snapshot.val());
                    });
                //visits =visits + Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
                console.log(visits)
                var lastdataItem = series.dataItems.getIndex(series.dataItems.length - 1);
                chart.addData(
                    { date: new Date(lastdataItem.dateX.getTime() + 1000), value: visits },
                    1
                );
            }, 1000);
        }
        
        startInterval();
        
        // all the below is optional, makes some fancy effects
        // gradient fill of the series
        series.fillOpacity = 1;
        var gradient = new am4core.LinearGradient();
        gradient.addColor(chart.colors.getIndex(0), 0.2);
        gradient.addColor(chart.colors.getIndex(0), 0);
        series.fill = gradient;
        
        // this makes date axis labels to fade out
        dateAxis.renderer.labels.template.adapter.add("fillOpacity", function (fillOpacity, target) {
            var dataItem = target.dataItem;
            return dataItem.position;
        })
        
        // need to set this, otherwise fillOpacity is not changed and not set
        dateAxis.events.on("validated", function () {
            am4core.iter.each(dateAxis.renderer.labels.iterator(), function (label) {
                label.fillOpacity = label.fillOpacity;
            })
        })
        
        // this makes date axis labels which are at equal minutes to be rotated
        dateAxis.renderer.labels.template.adapter.add("rotation", function (rotation, target) {
            var dataItem = target.dataItem;
            if (dataItem.date && dataItem.date.getTime() == am4core.time.round(new Date(dataItem.date.getTime()), "minute").getTime()) {
                target.verticalCenter = "middle";
                target.horizontalCenter = "left";
                return -90;
            }
            else {
                target.verticalCenter = "bottom";
                target.horizontalCenter = "middle";
                return 0;
            }
        })
        
        // bullet at the front of the line
        var bullet = series.createChild(am4charts.CircleBullet);
        bullet.circle.radius = 5;
        bullet.fillOpacity = 1;
        bullet.fill = chart.colors.getIndex(0);
        bullet.isMeasured = false;
        
        series.events.on("validated", function() {
            bullet.moveTo(series.dataItems.last.point);
            bullet.validatePosition();
        });
        
        }); // end am4core.ready()


   
    am5.ready(function() {

            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("kompas");
            
            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
              am5themes_Animated.new(root)
            ]);
            
            // Create chart
            // https://www.amcharts.com/docs/v5/charts/radar-chart/
            var chart = root.container.children.push(
              am5radar.RadarChart.new(root, {
                panX: false,
                panY: false,
                startAngle: -90,
                endAngle: 270
              })
            );
            
            // Create axis and its renderer
            // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
            var axisRenderer = am5radar.AxisRendererCircular.new(root, {
              strokeOpacity: 1,
              strokeWidth: 5,
              minGridDistance: 10
            });
            axisRenderer.ticks.template.setAll({
              forceHidden: true
            });
            axisRenderer.grid.template.setAll({
              forceHidden: true
            });
            
            axisRenderer.labels.template.setAll({ forceHidden: true });
            
            var xAxis = chart.xAxes.push(
              am5xy.ValueAxis.new(root, {
                maxDeviation: 0,
                min: 0,
                max: 360,
                strictMinMax: true,
                renderer: axisRenderer
              })
            );
            
            // Add clock hand
            // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
            // north
            var axisDataItemN = xAxis.makeDataItem({ value: 0 });
            
            var clockHandN = am5radar.ClockHand.new(root, {
              pinRadius: 0,
              radius: am5.percent(90),
              bottomWidth: 40
            });
            
            clockHandN.hand.set("fill", am5.color(0xff0000));
            // do not change angle at all
            clockHandN.adapters.add("rotation", function () {
              return -90;
            });
            
            axisDataItemN.set(
              "bullet",
              am5xy.AxisBullet.new(root, {
                sprite: clockHandN
              })
            );
            
            xAxis.createAxisRange(axisDataItemN);
            
            //south
            var axisDataItemS = xAxis.makeDataItem({ value: 180 });
            
            var clockHandS = am5radar.ClockHand.new(root, {
              pinRadius: 0,
              radius: am5.percent(90),
              bottomWidth: 40
            });
            
            // do not change angle at all
            clockHandS.adapters.add("rotation", function () {
              return 90;
            });
            
            axisDataItemS.set(
              "bullet",
              am5xy.AxisBullet.new(root, {
                sprite: clockHandS
              })
            );
            
            xAxis.createAxisRange(axisDataItemS);
            
            function createLabel(text, value, tickOpacity) {
              var axisDataItem = xAxis.makeDataItem({ value: value });
              xAxis.createAxisRange(axisDataItem);
              var label = axisDataItem.get("label");
              label.setAll({
                text: text,
                forceHidden: false,
                inside: true,
                radius: 20
              });
            
              var tick = axisDataItem
                .get("tick")
                .setAll({
                  forceHidden: false,
                  strokeOpacity: tickOpacity,
                  length: 12 * tickOpacity,
                  visible: true,
                  inside: true
                });
            }
            
            createLabel("N", 0, 1);
            createLabel("NE", 45, 1);
            createLabel("E", 90, 1);
            createLabel("SE", 135, 1);
            createLabel("S", 180, 1);
            createLabel("SW", 225, 1);
            createLabel("W", 270, 1);
            createLabel("NW", 315, 1);
            
            for (var i = 0; i < 360; i = i + 5) {
              createLabel("", i, 0.5);
            }
            
            setInterval(function () {
              var newAngle = Math.random() * 360;
              chart.animate({
                key: "startAngle",
                to: newAngle,
                duration: 1000,
                easing: am5.ease.out(am5.ease.cubic)
              });
              chart.animate({
                key: "endAngle",
                to: newAngle + 360,
                duration: 1000,
                easing: am5.ease.out(am5.ease.cubic)
              });
              axisDataItemN.animate({
                key: "value",
                to: am5.math.normalizeAngle(-90 - newAngle),
                duration: 1000,
                easing: am5.ease.out(am5.ease.cubic)
              });
              axisDataItemS.animate({
                key: "value",
                to: am5.math.normalizeAngle(90 - newAngle),
                duration: 1000,
                easing: am5.ease.out(am5.ease.cubic)
              });
            }, 2000);
            
            // Make stuff animate on load
            chart.appear(1000, 100);
            
            }); // end am5.ready()
    am5.ready(function() {

                // Create root element
                // https://www.amcharts.com/docs/v5/getting-started/#Root_element
                var root = am5.Root.new("jam");
                
                
                // Set themes
                // https://www.amcharts.com/docs/v5/concepts/themes/
                root.setThemes([
                  am5themes_Animated.new(root)
                ]);
                
                
                // Create chart
                // https://www.amcharts.com/docs/v5/charts/radar-chart/
                var chart = root.container.children.push(am5radar.RadarChart.new(root, {
                  panX: false,
                  panY: false
                }));
                
                
                // Create axis and its renderer
                // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                var axisRenderer = am5radar.AxisRendererCircular.new(root, {
                  innerRadius: -10,
                  strokeOpacity: 1,
                  strokeWidth: 8,
                  minGridDistance: 10
                });
                
                var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
                  maxDeviation: 0,
                  min: 0,
                  max: 12,
                  strictMinMax: true,
                  renderer: axisRenderer,
                  maxPrecision: 0
                }));
                
                // second axis
                // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                var secondAxisRenderer = am5radar.AxisRendererCircular.new(root, {
                  innerRadius: -10,
                  radius: am5.percent(40),
                  strokeOpacity: 0,
                  minGridDistance: 1
                });
                
                var secondXAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
                  maxDeviation: 0,
                  min: 0,
                  max: 60,
                  strictMinMax: true,
                  renderer: secondAxisRenderer,
                  maxPrecision: 0
                }));
                
                
                // hides 0 value
                axisRenderer.labels.template.setAll({
                  minPosition: 0.02,
                  textType: "adjusted",
                  inside: true,
                  radius: 25
                });
                axisRenderer.grid.template.set("strokeOpacity", 1);
                
                
                secondAxisRenderer.labels.template.setAll({
                  forceHidden: true
                });
                secondAxisRenderer.grid.template.setAll({
                  forceHidden: true
                });
                secondAxisRenderer.ticks.template.setAll({
                  strokeOpacity: 1,
                  minPosition: 0.01,
                  visible: true,
                  inside: true,
                  length: 10
                });
                
                // Add clock hands
                // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                
                // hour
                var hourDataItem = xAxis.makeDataItem({});
                
                var hourHand = am5radar.ClockHand.new(root, {
                  radius: am5.percent(70),
                  topWidth: 14,
                  bottomWidth: 14,
                  innerRadius: am5.percent(43),
                  pinRadius: 0,
                  layer: 5
                })
                
                hourDataItem.set("bullet", am5xy.AxisBullet.new(root, {
                  sprite: hourHand
                }));
                
                xAxis.createAxisRange(hourDataItem);
                
                hourDataItem.get("grid").set("visible", false);
                
                // minutes
                var minutesDataItem = xAxis.makeDataItem({});
                
                var minutesHand = am5radar.ClockHand.new(root, {
                  radius: am5.percent(85),
                  topWidth: 10,
                  bottomWidth: 10,
                  innerRadius: am5.percent(43),
                  pinRadius: 0,
                  layer: 5
                })
                
                minutesDataItem.set("bullet", am5xy.AxisBullet.new(root, {
                  sprite: minutesHand
                }));
                
                xAxis.createAxisRange(minutesDataItem);
                
                minutesDataItem.get("grid").set("visible", false);
                
                // seconds
                var secondsDataItem = xAxis.makeDataItem({});
                
                var secondsHand = am5radar.ClockHand.new(root, {
                  radius: am5.percent(40),
                  innerRadius: -10,
                  topWidth: 5,
                  bottomWidth: 5,
                  pinRadius: 0,
                  layer: 5
                })
                
                secondsHand.hand.set("fill", am5.color(0xff0000));
                secondsHand.pin.set("fill", am5.color(0xff0000));
                
                secondsDataItem.set("bullet", am5xy.AxisBullet.new(root, {
                  sprite: secondsHand
                }));
                
                xAxis.createAxisRange(secondsDataItem);
                
                secondsDataItem.get("grid").set("visible", false);
                
                // week label
                var label = chart.radarContainer.children.push(am5.Label.new(root, {
                  fontSize: "2em",
                  centerX: am5.p50,
                  centerY: am5.p50
                }));
                
                
                setInterval(function() {
                  updateHands(300)
                }, 1000);
                
                function updateHands(duration) {
                  // get current date
                  var date = new Date();
                  var hours = date.getHours();
                  
                  if(hours > 12){
                    hours -= 12;
                  }  
                  
                  var minutes = date.getMinutes();
                  var seconds = date.getSeconds();
                
                  // set hours
                  hourDataItem.set("value", hours + minutes / 60 + seconds / 60 / 60);
                  // set minutes
                  minutesDataItem.set("value", 12 * (minutes + seconds / 60) / 60);
                  // set seconds
                  var current = secondsDataItem.get("value");
                  var value = 12 * date.getSeconds() / 60;
                  // otherwise animation will go from 59 to 0 and the hand will move backwards
                  if (value == 0) {
                    value = 11.999;
                  }
                  // if it's more than 11.99, set it to 0
                  if (current > 11.99) {
                    current = 0;
                  }
                  secondsDataItem.animate({
                    key: "value",
                    from: current,
                    to: value,
                    duration: duration
                  });
                
                  label.set("text", chart.getDateFormatter().format(date, "MMM dd"))
                }
                
                updateHands(0);
                
                // Make stuff animate on load
                chart.appear(1000, 100);
                
                // update on visibility
                document.addEventListener("visibilitychange", function() {
                  updateHands(0)
                });
                
                }); // end am5.ready()