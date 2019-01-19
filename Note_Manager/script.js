// Lecture: Project - Coding Task 3 - Solution

var ul = document.querySelector('ul');
//*************ADD ITEM */
document.getElementById('add-btn').addEventListener('click',
function(e)
{
    e.preventDefault();
    var addInput = document.getElementById('add-input');
    if(addInput.value !== ''){
    var li = document.createElement('li'),
        firstPar = document.createElement('p'),
        secondPar = document.createElement('p'),
        firstIcon = document.createElement('i'),
        SecondIcon = document.createElement('i'),
        input = document.createElement('input');

    firstIcon.className = "fa fa-pencil-square-o";
    SecondIcon.className = "fa fa-times";
    input.className = "edit-note";
    input.setAttribute('type','text');

    firstPar.textContent = addInput.value;
    secondPar.appendChild(firstIcon);
    secondPar.appendChild(SecondIcon);
    li.appendChild(firstPar);
    li.appendChild(secondPar);
    li.appendChild(input);
    
    ul.appendChild(li);
    
    addInput.value = '';
    }
    
});
//**************Edit and Delete Item */

ul.addEventListener('click', function(e)
{
   
    if(e.target.classList[1] === "fa-pencil-square-o"){
       var parentPar = e.target.parentNode;
       parentPar.style.display = 'none';

       var note = parentPar.previousElementSibling;
       var input = parentPar.nextElementSibling;

       input.style.display = 'block';
       input.value = note.textContent;

       input.addEventListener('keypress',function(e){
         if(e.keyCode === 13)
         {
             if(input.value !== '')
             {
                 note.textContent = input.value;
                 parentPar.style.display = 'block';
                 input.style.display = 'none';
             }
             else
             {
                 var li = parentPar.parentNode;
                 li.parentNode.removeChild(li);
             }
         }       
       });
    }
    else if(e.target.classList[1] === "fa-times")
    {
        var list = e.target.parentNode.parentNode;
        list.parentNode.removeChild(list);
    }

});


//***********************Hide Items */

var hideItems = document.getElementById('hide');
hideItems.addEventListener('click', function()
{

    var label = document.querySelector('label');

    if(hideItems.checked)
    {
        label.textContent = 'Unhide Notes';
        ul.style.display = 'none' ;
    }
    else
    {
        label.textContent = 'hide Notes';
        ul.style.display = 'block'
    }
});


//********Search Filter */

var searchInput = document.querySelector('#search-note input');

searchInput.addEventListener('keyup', function(e)
{

     var searchChar = e.target.value.toUpperCase();
     console.log(searchChar);
     var notes = ul.getElementsByTagName('li');

     Array.from(notes).forEach(function(note){
         var parText = note.firstElementChild.textContent;
         if(parText.toUpperCase().indexOf(searchChar) !== -1)
         {
              note.style.display = 'block';
         }
         else
         {
             note.style.display = 'none';
         }
     });
});