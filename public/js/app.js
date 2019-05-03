//Define global variables
const bookList = document.querySelectorAll('.bookRow');
const div = document.querySelector('.links');

//search form, checks for empty string
const searchForm = document.querySelector('.search-form');
if(searchForm){
    searchForm.addEventListener('submit', (e) => {
        if(searchForm.firstElementChild.value === ''){
            e.preventDefault();
        }
    });
}

//Clears all rows
const clearPage = () => {
    for(let i = 0; i < bookList.length; i++){
      bookList[i].style.display = 'none';
    }
  }

//shows page @param1 (integer) - page to display. @param2 (array) - of row nodes
const showPage = (pageNumber, list) => {
    //declare 2 const, we will show the numbers between these 2 const
    let higherThan = pageNumber * 10;
    let lowerThan = higherThan - 10;
    if(list.length < 10){
      higherThan = list.length;
      lowerThan = 0;
    }
    //clear page, then loop thorugh list and display rows
    clearPage();
  
    for(let i = 0; i < list.length; i++){
        if(i < lowerThan || i >= higherThan){
          list[i].style.display = 'none';
          } else{
            list[i].style.display = '';
          }
    }
  }
//to append links onto the page @param (array) - array of rows
  const appendLinks = (list) => {
      const ul = document.createElement('ul');
      const numOfLinks = Math.ceil((list.length / 10));
      for(let i = 0; i < numOfLinks; i++){
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.textContent = i + 1;
          a.addEventListener('click', (e) =>{
              let links = document.querySelectorAll('li a');
              for(let i = 0; i < links.length; i++){
                  links[i].className = '';
              }
              links[e.target.textContent - 1].className = 'active';
              showPage(e.target.textContent, bookList);
          })
          li.appendChild(a);
          ul.appendChild(li);
          ul.firstElementChild.firstElementChild.className = 'active';
      }
      div.appendChild(ul);
  }

//call on page load
  showPage(1, bookList);
  appendLinks(bookList);