let searchWord = document.getElementById('searchs');
let lowRegStr;
let KEY = '0APCbQcxTRAh55cLG73H2GH0oOJmEY23'
let reqLocation;
let newLat;
let newLng;

 class getData{
   
      async predictns(searchStr) {
        const ss = new SEARCH()
        let url = `https://www.mapquestapi.com/search/v3/prediction?key=${KEY}&limit=14&collection=adminArea,poi,address,category,franchise,airport&q=${searchStr}`;
            try {
              let response = await fetch(url);
              let data = await response.json();
            let  newData = data.results;
            //  console.log(newData);
                const searchRes = []
           if(newData){
            newData.forEach((dispStr)=>{
              let  reqLocat = dispStr.place.geometry.coordinates
            //    console.log(reqLocat);
                   let searchdata = {
                      name: dispStr.name,
                      lngs: reqLocat[0],
                      lats: reqLocat[1],
                      optn: searchStr,
                   }
                   searchRes.push(searchdata);
               })
            ss.dispSearch(searchRes, searchStr); 
           }
           if(!newData  || newData.length === 0 && searchStr){
            ss.noPred(searchStr)
           } 
            } catch (error) {
              console.log(error);
            }
          }  

          async mapsLoc() {
        const nopredMap = new mapdisp

            let url = `https://open.mapquestapi.com/geocoding/v1/address?key=${KEY}&location=${lowRegStr}`;
                try {
                  let response = await fetch(url);
                  let data = await response.json();
                  reqLocation  = data.results[0].locations[0].latLng;
                  newLng = reqLocation.lng;
                  newLat = reqLocation.lat;
                nopredMap.displayMap()

                //   return reqLocation;
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
        this.stat = document.querySelector('.notfound');
    }
    
// get search value function
    getword(e){
        e.preventDefault();
       let searchStr = e.target.value.toLowerCase();
        const getdataMap = new getData();
        getdataMap.predictns(searchStr);
        if(e.target.value === ''){
            this.vis.style.visibility = 'hidden';

        }
        
    }

    // display search for predictns
    dispSearch(searchRes){
        if(searchRes){
            const displayd = new mapdisp()

            this.searchHold.innerHTML = '';
                this.vis.style.visibility = 'visible';
                searchRes.forEach((res, i)=>{
                 let p= `<p class="hovera" id=${i} data-lng=${res.lngs} data-lat=${res.lats}><i class="fas fa-map-marker-alt px2 colblue" ></i>${res.name}</p>`
                    this.searchHold.innerHTML += p; 
                
                });
                document.querySelectorAll('.hovera').forEach((item) =>{
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
            
        
    }

    noPred(searchStr){
        const dataNoPred = new getData();
            this.searchHold.innerHTML = '';

            if(searchStr){
                let p= `<p class="hovera"><i class="fas fa-map-marker-alt px2 colblue" ></i>${searchStr}</p>`
                this.searchHold.innerHTML += p; 
                    document.querySelector('.hovera').addEventListener('click', (e)=>{
                    e.preventDefault()
                    this.vis.style.visibility = 'hidden';
                    let itemVal = e.target.textContent;

                    searchWord.value = itemVal;
                    let re = /[&\/\\#()$~%.'":*?<>{}]/g;
                    let pe = /[\s]/g

                    lowRegStr = itemVal.replace(re, '');
                    lowRegStr = lowRegStr.replace(pe, '+')

                    // searchWord.value = itemVal;
                    dataNoPred.mapsLoc()
                });
            }
           


    }
}

class mapdisp {
    displayMap (){
        if(!newLng && !newLat){
            mapboxgl.accessToken = 'pk.eyJ1IjoiZ2xvd3JlZSIsImEiOiJja290cXB6djIwZTVmMndtd2Q3bWU0M3QxIn0.cMy5eJA-SvBuijq1L-a57A';
            let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
        })
    //    Initialize the geolocate control.
var geolocate = new mapboxgl.GeolocateControl({
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
        // console.log(' not avail');
        }
        else if(newLng && newLat){
            mapboxgl.accessToken = 'pk.eyJ1IjoiZ2xvd3JlZSIsImEiOiJja290cXB6djIwZTVmMndtd2Q3bWU0M3QxIn0.cMy5eJA-SvBuijq1L-a57A';
            let map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [newLng, newLat],
                zoom: 15,
                // shouldBeDraggable: true
            });
            // console.log(map);

            let marker = new mapboxgl.Marker()
            .setLngLat([newLng, newLat])
            // .setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>"))
            .addTo(map)
            .setDraggable(true);

            // marker.togglePopup()
            var nav = new mapboxgl.NavigationControl();
            map.addControl(nav, 'top-left');

            
        }
    }
}

// on load
document.addEventListener('DOMContentLoaded', ()=>{
    // variable
    const searchFunct = new SEARCH();
    const displays = new mapdisp();

    // invoke funct getWord on form input
    searchWord.addEventListener('input', (e)=>{
        searchFunct.getword(e);
        
    });

   displays.displayMap();

} )
