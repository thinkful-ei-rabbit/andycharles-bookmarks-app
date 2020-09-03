import $ from 'jquery';
import bookmarkStore from './bookmarkStore';
import bookmarkList from './bookmarkList';
import api from './api';
import 'normalize.css';
import './index.css';


const main = () => {
  api.getBookmarks().then((bookmarks) => {
    bookmarks.forEach((bookmark) => bookmarkStore.addBookmark(bookmark));
    bookmarkList.render();
  });

  bookmarkList.bindEventListeners();
  bookmarkList.render();
};


$(main);