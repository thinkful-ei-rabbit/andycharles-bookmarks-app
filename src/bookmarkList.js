import  $ from 'jquery';
import cuid from 'cuid';
import bookmarkStore from './bookmarkStore';
import api from './api';

const generateBookmarksList = () => {
    let bookmarks = [];
    for(let bookmark of bookmarkStore.LIST.bookmarks){
      if(bookmark.rating >= bookmarkStore.LIST.filterRating || bookmark.rating === null){
        bookmarks.push(generateBookmarks(bookmark));
      }
    }
  
    return `
    <div class="bookmarks-list">
      <h1>MY BOOKMARKS</h1>
      <button class="add-bookmark">Add Your Bookmark</button>
      <select name="minimum-rating" id="minimum-rating">
        <option>Minimum Rating</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <hr>
      ${bookmarks.join('')}
    </div>
    `;
  };
  
  const generateBookmarks = (bookmark) => {
    const checkedRating = '<span class="rating-checked">&#9733</span>';
    const uncheckedRating = '<span class="rating-unchecked">&#9734</span>';
  
    let newRatings = [];
  
    for(let i = 0; i < bookmark.rating; i++){
      newRatings.push(checkedRating);
    }
  
    for(let i = 0; i < 5 - bookmark.rating; i++){
      newRatings.push(uncheckedRating);
    }
  
    return `
    <div class="bookmark" data-item-id="${bookmark.id}">
      <h3 class="bookmark-title">${bookmark.title}</h3>
      <p class="bookmark-description ${!bookmark.expanded ? 'bookmark-shrink':''}">${bookmark.desc === '' ? 'No description': bookmark.desc}</p>
      <a href="${bookmark.url}" target="_blank" class="bookmark-url ${!bookmark.expanded ? 'bookmark-shrink':''}">Visit Site</a>
      <div class="bookmark-rating">
      ${newRatings.join('')}
      </div>
      <button class="bookmark-delete ${!bookmark.expanded ? 'bookmark-shrink':''}">Delete</button>
    </div>
    `;
  };


  const addBookMarks = () => {
    return `
        <div class='form-container'>
            <h2>Create Your Bookmark</h2>
            <form class='add-form'>
            <label for="bookmark-title">Title:</label>
            <input type="text" name="bookmark-title" id="bookmark-title" class="data-bookmark-title" placeholder="title">
            
            <label for="bookmark-url">URL:</label>
            <input type="text" name="bookmark-url" id="bookmark-url" class="data-bookmark-url" placeholder="URL HERE">
            
            <label for="bookmark-url">Description:</label>
            <input type="text" name="bookmark-description" id="bookmark-description" class="data-bookmark-description" placeholder="description...">
            
            <p>Rating:</p>
            <label for="rating1">
              <input type="radio" name="rating" id="rating1" value="1" class="bookmark-rating">
              1 Star
            </label>
            
            <label for="rating2">
              <input type="radio" name="rating" id="rating2" value="2" class="bookmark-rating">
              2 Stars
            </label>
            
            <label for="rating3">
              <input type="radio" name="rating" id="rating3" value="3" class="bookmark-rating">
              3 Stars
            </label>
            
            <label for="rating4">
              <input type="radio" name="rating" id="rating4" value="4" class="bookmark-rating">
              4 Stars
            </label>
            
            <label for="rating5">
              <input type="radio" name="rating" id="rating5" value="5" class="bookmark-rating">
              5 Stars
            </label>
            <br/>
            <input type="submit" value="Add Bookmark" class="add-bookmark-button" id="add-bookmark-button">
          </form>
          
        </div>
        `
}

const render = () => {
    $('.container').html(generateBookmarksList());
    if(bookmarkStore.LIST.addBookmark){
      $('button.add-bookmark').replaceWith(addBookMarks());
    }
  };


const handleAddBookmarks = () => {
    // listens for click event on button add-bookmark child inside the body tag
    $(document).on('click', '.add-bookmark', (event) => {
      event.preventDefault();
      bookmarkStore.LIST.addBookmark = !bookmarkStore.LIST.addBookmark;
      //alert('add bookmark clicked');
      render();
    });
  };


  const handleAddBookmarksSubmit = () => {
    $(document).on('click submit', '.add-bookmark-button', (event) => {
      event.preventDefault();
      bookmarkStore.LIST.addBookmark = !bookmarkStore.LIST.addBookmark;
  
      let newBookmark = {
        id: cuid(),
        title: $('#bookmark-title').val(),
        url: $('#bookmark-url').val(),
        desc: $('#bookmark-description').val(),
        rating: $('input[name=rating]:checked').val(),
        expanded: false
      };
  
      api.createBookmark(newBookmark).then((newBookmark) => {
        bookmarkStore.LIST.bookmarks.push(newBookmark);
        render();
      }).catch((error) => {
        alert(`${error.message}. Unable to add bookmark. Please try again.`);
      });
      render();
    });
  };

  const getBookmarkIdFromElement = (bookmark) => {
    return $(bookmark).closest('.bookmark').data('item-id');
  };


  const handleFilterChange = () => {
    $(document).on('change', '#minimum-rating', (event) => {
      event.preventDefault();
      bookmarkStore.LIST.filterRating = $('#minimum-rating').val();
      console.log(bookmarkStore.LIST.filterRating);
      render();
    });
  };

  
  const handleBookmarkDelete = () => {
    $(document).on('click', '.bookmark-delete', (event) => {
      event.preventDefault();
      const id = getBookmarkIdFromElement(event.currentTarget);
      api.deleteBookmark(id).then(() => {
        bookmarkStore.deleteBookmark(id);
        render();
      }).catch((error) => {
        alert(`${error.message}. I can't delete your bookmark. Please try again.`);
      });
      render();
    });
  };
  

  const handleBookmarkToggle = () => {
    $(document).on('click', '.bookmark-title', (event) => {
      event.preventDefault();
      const id = getBookmarkIdFromElement(event.currentTarget);
      bookmarkStore.findAddUpdateBookmarkView(id);
      render();
    });
  };


  const bindEventListeners = () => {
    handleAddBookmarks();
    handleFilterChange();
    handleBookmarkToggle();
    handleAddBookmarksSubmit();
    handleBookmarkDelete();
  };
  
  
  export default {
    render,
    bindEventListeners
  };