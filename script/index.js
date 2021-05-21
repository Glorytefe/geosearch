let searchWord = document.getElementById('searchs');
let myForm = document.getElementById('se');
let lowRegStr;
let KEY = '0APCbQcxTRAh55cLG73H2GH0oOJmEY23'
let newLat;
let newLng;
let reqLocation;
let msk = 'pk.eyJ1IjoiZ2xvd3JlZSIsImEiOiJja290cXB6djIwZTVmMndtd2Q3bWU0M3QxIn0.cMy5eJA-SvBuijq1L-a57A'

// store data in object.. this can be gotten from the api
const weather = {};
let submits = false;
weather.temperature = {
  unit: "celsius",
};
// app const..
const KELVIN = 273;
// api key
const keyweath = "853b5d2ce3bb8180f0b86df75c062cd5";

 class getData{
//    get predictions
      async predictns(searchStr) {
        const ss = new SEARCH()
        let url = `
        https://api.mapbox.com/geocoding/v5/mapbox.places/${searchWord.value}.json?access_token=${msk}&cachebuster=1621526161170&autocomplete=true
        `;
            try {
              let response = await fetch(url);
              let data = await response.json();
            let  newData = data.features;
            // array to store predictn result
                const searchRes = []
           if(newData){
            newData.forEach((dispStr)=>{
                // object to hold req data
                   let searchdata = {
                      name: dispStr.place_name,
                      lng: dispStr.center[0],
                      lats: dispStr.center[1],
                   }
                   searchRes.push(searchdata);
               })
            ss.dispSearch(searchRes, searchStr); 
           }
            } catch (error) {
              console.log(error);
            }
          }  

          async mapsLoc() {
            //   to get coordinates of location not found in prediction
            const nopredMap = new mapdisp
            let url = `https://open.mapquestapi.com/geocoding/v1/address?key=${KEY}&location=${lowRegStr}`;
                try {
                  let response = await fetch(url);
                  let data = await response.json();
                  reqLocation  = data.results[0].locations[0].latLng;
                  newLng = reqLocation.lng;
                  newLat = reqLocation.lat;
                nopredMap.displayMap();
                } catch (error) {
                  console.log(error);
                }
              } 
              
      async getWeather(){
        //   weather info
       let url = `https://api.openweathermap.org/data/2.5/weather?lat=${newLat}&lon=${newLng}&appid=${keyweath}`;
       try {
            let response = await fetch(url);
            let data = await response.json();
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.IconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.windspeed = data.wind.speed;
            weather.humidity = data.main.humidity;
            weather.unit = "celsius";
                } catch (error) {
                  console.log(error);
                }
              }
 }


// search class
class SEARCH {
    constructor(){
        this.searchHold = document.getElementById('hold');
        this.vis = document.getElementById('hide');
    }
    
// get search value function
    getword(stringSearched){
       let searchStr = stringSearched.toLowerCase();
        const getdataMap = new getData();
        // get prediction for entered input
        getdataMap.predictns(searchStr);
        if(searchWord.value === ''){
            this.vis.style.visibility = 'hidden';
        }
        
    }

    // display search for predictns
    dispSearch(searchRes, searchStr){
        if(searchRes){
            // display prediction if available
            const displayd = new mapdisp()
            this.searchHold.innerHTML = '';
            this.vis.style.visibility = 'visible';
            searchRes.forEach((res, i)=>{
            let p= `<p class="hovera" id=${i} data-lng=${res.lng} data-lat=${res.lats}><i class="fas fa-map-marker-alt px2 colblue" ></i>${res.name}</p>`
            this.searchHold.innerHTML += p;   
        });

         document.querySelectorAll('.hovera').forEach((item) =>{
            //  listen on each result
         item.addEventListener('click', (e)=>{
         e.preventDefault()
        this.vis.style.visibility = 'hidden';
         let itemVal = item.textContent
         searchWord.value = itemVal;
         newLng = e.target.dataset.lng;
         newLat = e.target.dataset.lat;
        displayd.displayMap()
           })

        });
        
     }
    //  if form is submitted
     if(submits === true){
        this.submitsTrue(searchStr)
    }

    }

    submitsTrue(searchStr){
        // if no prediction on input, user input can be submitted for a thorough search
        const dataNoPred = new getData();
        let re = /[&\/\\#()$~%.'":*?<>{}]/g;
        let pe = /[\s]/g;
        lowRegStr = searchStr.replace(re, '');
        lowRegStr = lowRegStr.replace(pe, '+');
        submits = false;
        dataNoPred.mapsLoc();
        this.vis.style.visibility = 'hidden';
    }
}

class mapdisp {
    displayMap (){
        if(!newLng && !newLat){
    // display map using users location if no search 
            mapboxgl.accessToken = 'pk.eyJ1IjoiZ2xvd3JlZSIsImEiOiJja290cXB6djIwZTVmMndtd2Q3bWU0M3QxIn0.cMy5eJA-SvBuijq1L-a57A';
            let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            
        })
    //    Initialize the geolocate control.
    let geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    trackUserLocation: true
    });
    // Add the control to the map.
    map.addControl(geolocate);
    map.on('load', function() {
    geolocate.trigger();
    });
    }
        else if(newLng && newLat){
            // if search has  lat and lng, create map
            mapboxgl.accessToken = 'pk.eyJ1IjoiZ2xvd3JlZSIsImEiOiJja290cXB6djIwZTVmMndtd2Q3bWU0M3QxIn0.cMy5eJA-SvBuijq1L-a57A';
            let map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [newLng, newLat],
                zoom: 14,
            });
        //   add marker to location
            let marker = new mapboxgl.Marker()
            .setLngLat([newLng, newLat])
            .addTo(map)
            .setDraggable(true);
            // add ctrl
            var nav = new mapboxgl.NavigationControl();
            map.addControl(nav, 'bottom-left');

            // get weather for location
            const gets = new getData();
            // get weather for location
                gets.getWeather().then(()=>{
                const weatherDisplays = new weatherdisp();
                // display weather
                weatherDisplays.weatherui()
            });
            document.getElementById('hide').style.visibility = 'hidden';
           
        }
    }
}

class weatherdisp{
    constructor (){
        this.tggle = document.getElementById('rgt');
        this.tggler = document.querySelectorAll('#tggle');
        this.temConverter = document.getElementById('temLocBtn');
        this.temHold = document.getElementById('temLoc');
        this.windSpHold = document.getElementById('wspeedLoc');
        this.humidityHold = document.getElementById('humidityLoc');
        this.tggleContainer = document.getElementById('tggleDisp');
        this.tggleEff = document.getElementById('tggleEff');
        this.iconImg = document.getElementById('iconImg');
        this.descLoc = document.getElementById('descLoc');

    }

    tggles (e){
        // tggle to open or collapse weather details
        if(e.target.classList.contains('fa-caret-left')){
            this.tggleEff.style.visibility = 'hidden';
            this.tggle.style.visibility = 'visible';
        }
        else if(e.target.classList.contains('fa-caret-right')){
            this.tggleEff.style.visibility = 'visible';
            this.tggle.style.visibility = 'hidden';
        }
    }
    weatherui(){
        // this.tggleContainer.style.visibility = 'visible'
        const weatherDisplays = new weatherdisp();
        this.tggleEff.style.visibility = 'visible';
            this.tggle.style.visibility = 'hidden';
       this.tggler.forEach((tggle)=>{
        tggle.addEventListener('click', (e)=>{
            weatherDisplays.tggles(e)
        })
       })
    //    ui
        this.windSpHold.innerText = `${ weather.windspeed}km/hr`;
        this.humidityHold.innerText = `${weather.humidity}`;
        this.temHold.innerHTML = `<b>${weather.temperature.value}°C</b>`;
        this.descLoc.innerText = `${weather.description}`
        this.iconImg.innerHTML = `<img src='icons/${weather.IconId}.png'>`
 
    }
}
// on load
document.addEventListener('DOMContentLoaded', ()=>{
    // variable
    const searchFunct = new SEARCH();
    const displays = new mapdisp();
    let btns = document.getElementById('temLoc');
    // tem converter
   btns.addEventListener("click", ()=>{
        if (weather.unit == "celsius") {
            let temp = weather.temperature.value;
            let fahrenheit = (temp * 9) / 5 + 32;
            fahrenheit = Math.floor(fahrenheit);
            btns.innerHTML = `<b>${fahrenheit}°F</b>`;
            weather.unit = "fahrenheit";
          } else {
              btns.innerHTML = `<b>${weather.temperature.value}°C</b>`;
             weather.unit = "celsius";
          }
      });

    // invoke funct getWord on form input
    searchWord.addEventListener('input', (e)=>{
        e.preventDefault()
        let stringSearched = e.target.value;
        searchFunct.getword(stringSearched);   
    });
    // invoke funct getWord on form submisn
    myForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        let stringSearched = searchWord.value
        searchFunct.getword(stringSearched);
        submits =true;
    }); 
    // display map on load
   displays.displayMap();
   // sharing function to faceboook
    let urls = encodeURI(document.location.href);
    document.getElementById("fbs").setAttribute("href", `https://www.facebook.com/sharer.php?u=${urls}`);
})
