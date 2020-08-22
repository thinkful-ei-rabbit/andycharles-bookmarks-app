import $ from 'jquery';
import './index.css';
import bookmarks from './store';
import cuid from 'cuid';
const urlEndpoint = "https://thinkful-list-api.herokuapp.com/andycharles/bookmarks";
//Add bookmarks to my bookmark list
//I can see a list of my bookmarks
//I can click on a bookmark to display the detailed view
//I can remove bookmarks from my bookmark list
// I receive appropriate server feedback when I cannot add/update a bookmark
//I can select froma dropdown a "minimum rating" to filter the list by all bookmarks
//rated equal or above the chosen selection

function main() {
  console.log('DOM is loaded');
  console.log(bookmarks);
  const startMsg = $('<p>Webpack is working!</p>');
  $('#root').append(startMsg);
  $("#js-bookmark-form").submit(function (event) {
    event.preventDefault();
    let bookmarkEntry = $("#bookmark-entry").val();
    let bookmarkUrl = $('#bookmark-url').val();
    let newBookmark = {
      'id': cuid(),
      'title': bookmarkEntry,
      'url': bookmarkUrl

    }
    addBookmark(newBookmark)
    clearBookmarkList()
    setTimeout(function(){ loadBookMarks(); }, 1000);
    console.log('test');
  });
  loadBookMarks();
}

let loadBookMarks = function () {
  fetch(urlEndpoint, { method: 'GET' })
    .then(res => res.json())
    .then(json => {
      const bookmarks = json;
      console.log(Array.isArray(bookmarks));
     bookmarks.forEach((bookmark) => {
        $('#bookmarkList').append('<ul>')
        $('#bookmarkList').append(`<li class= "title">${bookmark.title}</li>`)
        $('#bookmarkList').append(`<li>${bookmark.description}</li>`)
        $('#bookmarkList').append(`<li>${bookmark.url}</li>`)
        $('#bookmarkList').append(`<li>${bookmark.rating}</li>`)
        $('#bookmarkList').append('<button>Click to view detail</button><button>Remove</button>')
        $('#bookmarkList').append('</ul>')
      })
   
  })
}

let addBookmark = function (bookmark) {
  //console.log(JSON.stringify(bookmark));

  fetch(urlEndpoint, {
    method: 'post', body: JSON.stringify(bookmark), headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json()).then(json => console.log(json));





  //bookmarks.push(bookmark);
  //return bookmarks

}

let clearBookmarkList = function () {
  $('#bookmarkList').html('');
}

let deleteButton = function () {
  
}


$(main);


