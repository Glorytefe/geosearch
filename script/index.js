// variables
let searchInp = document.getElementById('se');
let searchWord = document.getElementById('searchs')
let searchHold = document.getElementById('hold');
let vis = document.getElementById('hide');
// arrs
const arr1 = ['germany', 'italy', 'france', 'gambia', 'germanya'];

// get search value function
const getWord = (e) =>{
        e.preventDefault();
       let searchStr= e.target.value.toLowerCase();
        // call filtersearch
        filterSearch(searchStr);
}
// getword ends
// invoke funct getWord on form submission
searchWord.addEventListener('input', getWord);
// filter for location
 const filterSearch = (searchStr) =>  {
    //  arr to hold search result
    const searchRes = []
    if(searchStr !== ''){
        arr1.forEach((val) =>{
        if(val.toLowerCase().includes(searchStr)){
            searchRes.push(val);
        }
    });
}
// call display search result funct
      dispSearch(searchRes) 
    }
// filter ends

// display search
const dispSearch = (searchRes)=>{
    if(searchRes){
    searchHold.innerHTML = '';
        vis.style.visibility = 'visible';
       searchRes.forEach((res)=>{
         let p= `<p class="hovera"><i class="fas fa-map-marker-alt px2 colblue"></i>${res}</p>`
            searchHold.innerHTML += p; 
        })
    }
}
    