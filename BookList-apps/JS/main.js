books = [
    {
        id : 3657848524,
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K Rowling',
        year: 1997,
        isComplete: false,
    },
];
RENDER_EVENT = 'render-book';
BOOK_STORAGE_KEY = 'BOOK_APPS';
SAVE_EVENT = 'save-book';


saveBooksToLocalStorage = () => {
    localStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(books));
};

loadBooksFromLocalStorage = () => {
    const storedBooks = localStorage.getItem(BOOK_STORAGE_KEY);
    if (storedBooks) {
      books = JSON.parse(storedBooks);
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
};


document.addEventListener('DOMContentLoaded', ()=>{
    loadBooksFromLocalStorage();
    const submitBook = document.getElementById('inputBook')

    document.getElementById('searchBookTitle').addEventListener('input', function(event) {
        const searchTerm = event.target.value.toLowerCase();
        filterBooks(searchTerm);
    });

    submitBook.addEventListener('submit', (event)=>{
        event.preventDefault();
        addBook();
    })

})

addBook = ()=>{
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = parseInt(document.getElementById('inputBookYear').value);

    const generateId = generatedId()
    const isComplete = checkComplate()
    const bookObjek = generatedBookOjek(
        generateId,
        title,
        author,
        year,
        isComplete
    );

    books.push(bookObjek);

    document.dispatchEvent(new Event(RENDER_EVENT));

}

checkComplate = () =>{
    const check = document.getElementById('inputBookIsComplete');

    check.addEventListener('change', function() {
        if (check.checked) {
            return true
        } else {
            return false
        }
    });

    return check.checked;
}

generatedId = () =>{
    return +new Date()
}

generatedBookOjek = (id, title, author, year, isComplete)=>{
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

makeBook = (bookObjek) =>{

    const title = document.createElement('h3');
    title.innerText = bookObjek.title;

    const author = document.createElement('p');
    author.innerText = bookObjek.author;

    const year = document.createElement('p');
    year.innerText = bookObjek.year;

    const actionButton = document.createElement('div') 
    actionButton.classList.add('action')

    const bookItemContainer = document.createElement('article')
    bookItemContainer.classList.add('book_item')
    bookItemContainer.append(title, author, year, actionButton)
    bookItemContainer.setAttribute('id',`book-${bookObjek.id}`)

    if (bookObjek.isComplated){
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = 'Tandai Belum Selesai';
        undoButton.addEventListener('click', ()=>{
            undoBookFormComplate(bookObjek.id)
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus';
        trashButton.addEventListener('click', ()=>{
            alert("Anda yakin akan menghapus buku dari daftar buku")
            removeBook(bookObjek.id)
        });

        actionButton.append(undoButton, trashButton);
    }else{
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = 'Tandai Selesai';
        checkButton.addEventListener('click', ()=>{
            addBookComplate(bookObjek.id)
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus';
        trashButton.addEventListener('click', ()=>{
            alert("Anda yakin akan menghapus buku dari daftar buku")
            removeBook(bookObjek.id)
        });

        actionButton.append(checkButton, trashButton);
    }

    return bookItemContainer;
}


  

removeBook = (bookId) =>{

    const target = findBookIndex(bookId);

    if(target == -1) return;

    books.splice(target , 1);
    document.dispatchEvent(new Event(RENDER_EVENT))

}


addBookComplate = (bookId) =>{
    const target = findBook(bookId);

    if(target == null) return;

    target.isComplated = true;
    document.dispatchEvent(new Event(RENDER_EVENT))

    
}

undoBookFormComplate = (bookId) =>{
    const target = findBook(bookId);

    if(target == null) return;

    target.isComplated = false;
    document.dispatchEvent(new Event(RENDER_EVENT))
    
    
}


findBook = (bookId)=>{
    for(const bookItem of books){
        if(bookItem.id == bookId){
            return bookItem;
        }
    }

    return null
}

findBookIndex = (bookId) => {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
  
    return -1;
}



document.getElementById('searchBookTitle').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    filterBooks(searchTerm);
});


function filterBooks(searchTerm) {

    const allBooks = document.querySelectorAll('.book_item');

    allBooks.forEach(book => {
        const title = book.querySelector('h3').innerText.toLowerCase();
        const isMatch = title.includes(searchTerm);
        if (isMatch) {
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    });
}




document.addEventListener(RENDER_EVENT, () =>{
    console.log(books);
    saveBooksToLocalStorage();

    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    uncompletedBookList.innerHTML = "";

    const completeBookshelfList = document.getElementById("completeBookshelfList");
    completeBookshelfList.innerHTML = "";


    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
    
        if (!bookItem.isComplated){
            uncompletedBookList.append(bookElement);
        }else {
            completeBookshelfList.append(bookElement);
        }
    }


})