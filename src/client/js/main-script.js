const dataField = document.getElementById("data");
const serverBaseUrl = 'https://gps-embedded-project.herokuapp.com'; //will be changed if deployed on any live server as heroku

setInterval(function(){
    getData()
    .then(function(dataObj){
        dataField.innerText = dataObj.data;
        console.log(dataObj);
    })
}, 3000)

const getData = async (e)=>{
    const response = await fetch(`${serverBaseUrl}/getdata`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
    //body: JSON.stringify(data),
  });
    try {
      const newData = await response.json();
      return newData;
    }catch(error) {
      console.log("error", error);
    }
}