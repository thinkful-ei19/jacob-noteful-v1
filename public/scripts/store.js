// eslint-disable-next-line no-unused-vars
'use strict';

const store = (function(){

  const findById = function(id) {
    return store.notes.find(note => note.id === id);
  };

  const findAndDelete = function(note) { 
    store.notes.splice(note, 1);
    console.log(store.notes);
  };

  return {
    notes: [],
    currentNote: false,
    currentSearchTerm: '',
    findAndDelete,
    findById
  };
  
}());
