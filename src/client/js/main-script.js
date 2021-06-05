$(document).ready(function(){
  //const dataField = document.getElementById("data");
  const serverBaseUrl = 'https://gps-embedded-project.herokuapp.com';
  //const serverBaseUrl = 'http://localhost:8081';
  const test = "GPRMC,220516,A,3012.63195388,S,3127.02476407,W,2.5,231.8,060421,004.2,W*70";
  let connection = "Not Connected", distance, latitude, longitude, time, date, speed;
  updateUi();

  setInterval(function(){
      getData()
      .then(function(dataObj){
          let data = dataObj.data;
          if (data == "connecting" || data == "Not Connected"){
            connection = data;
          }else if(data == "reached distination"){
            connection = data;
            distance = dataObj.distance;
          }else{
            connection = "connected";
            distance = dataObj.distance;
            // const dataArr = test.split(",");
            const dataArr = data.split(",");
            time = dataArr[1].substring(0,2) + ":" + dataArr[1].substring(2,4) + ":" + dataArr[1].substring(4,6);
            date = dataArr[9].substring(0,2) + "/" + dataArr[9].substring(2,4) + "/20" + dataArr[9].substring(4,6);
            speed = dataArr[7] * 0.514444;
            dataArr[3] = parseFloat(dataArr[3]).toString();
            dataArr[5] = parseFloat(dataArr[5]).toString();
            latitude = parseInt(dataArr[3].substring(0,2)) + (parseFloat(dataArr[3].substring(2,dataArr[3].length)) / 60);
            if(dataArr[4] == "S") latitude *= -1;
            longitude = parseInt(dataArr[5].substring(0,2)) + (parseFloat(dataArr[5].substring(2,dataArr[5].length)) / 60);
            if(dataArr[6] == "W") longitude *= -1;
            
          }
          console.log(dataObj)
          updateUi();
      })
  }, 3000)

  const getData = async (e)=>{
      const response = await fetch(`${serverBaseUrl}/getdata`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
    });
      try {
        const newData = await response.json();
        return newData;
      }catch(error) {
        console.log("error", error);
      }
  }

  function updateUi(){
    $("#status").removeClass("status-danger").removeClass("status-success");
    if(connection == "Not Connected"){
      $("#status").text(connection).addClass("status-danger");
    }else if(connection == "connecting"){
      $("#status").html("Connecting...<br><span>Please stay outdoors<span>")
    }else if(connection == "reached distination"){
      $("#status").html("Connected<br><span>You reached your distination<span>").addClass("status-success");
      $("#distance").text(distance + " m");
    }else if(connection == "connected"){
      $("#status").text("Connected").addClass("status-success");
      $("#distance").text(distance + " m");
      $("#latitude").text(latitude.toFixed(5));
      $("#longitude").text(longitude.toFixed(5));
      $("#time").text(time);
      $("#date").text(date);
      $("#speed").text(speed.toFixed(3));
    }
  }
  // var map = new ol.Map({
  //   target: "map",
  //   layers: [
  //     new ol.layer.Tile({
  //       source: new ol.source.OSM(),
  //     }),
  //   ],
  //   view: new ol.View({
  //     center: ol.proj.fromLonLat([14.44, 50.07]),
  //     zoom: 4,
  //   }),
  // });
})