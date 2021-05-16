
class SEARCH {

    constructor(){
        // this.searchInp = document.getElementById('se');
        this.searchHold = document.getElementById('hold');
        this.vis = document.getElementById('hide');
        this.arr1 = ['germany', 'italy', 'france', 'gambia', 'germanya'];
    }
    
// get search value function
    getword(e){
        e.preventDefault();
        let searchStr= e.target.value.toLowerCase();
         // call filtersearch
         this.filterSearch(searchStr);
    }
// filter search
    filterSearch (searchStr){
        //  arr to hold search result
    const searchRes = []
    if(searchStr !== ''){
        this.arr1.forEach((val) =>{
        if(val.toLowerCase().includes(searchStr)){
            searchRes.push(val);
        }
    });
}
// call display search result funct
      this.dispSearch(searchRes) 
    }

    // display search 
    dispSearch(searchRes){
        if(searchRes){
            this.searchHold.innerHTML = '';
                this.vis.style.visibility = 'visible';
                searchRes.forEach((res)=>{
                 let p= `<p class="hovera"><i class="fas fa-map-marker-alt px2 colblue"></i>${res}</p>`
                    this.searchHold.innerHTML += p; 
                })
            }
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
    // variable
    let searchWord = document.getElementById('searchs');
const searchFunct = new SEARCH();
    // invoke funct getWord on form submission
    searchWord.addEventListener('input', (e)=>{
        searchFunct.getword(e)
    });

} )