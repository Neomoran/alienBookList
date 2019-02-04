//Coding begins at 5.50 am
//link bootswatch and embed yedi then paste url and link.

//CLASSES
//BOOK CLASS: Represents a Book object; everytime we create a new book, its gonna instantiate this Book object.
class Book {
  //constructor (an fx that runs when we instantiate the book object).
  constructor(title, author, isbn) {
    //Assigning properties to the Book object using arguments passed using 'this' keyword.
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI CLASS: Handles the UI tasks i.e when a Book is displayed, removed or an alert is shown.
class UI {
  //Has  methods, to add books, remove books, show alerts and display books.
  //We don't want to instantiate the UI class, therefore we want to make all the methods static.

  //Method to display the books on the UI.
  static displayBooks() {
    //Getting books from the local storage(STORE CLASS) as an array.
    const books = Store.getBooks();
    //using the foreach loop, looping through all the books in that array and adding UI fx; addBookToList(), that adds books.
    books.forEach(book => UI.addBookToList(book));
  }

  //Method to add books to the list on the UI
  static addBookToList(book) {
    //Grabbing the '#book-list' which is the table body(tbody) in order to add rows as new added books
    const list = document.querySelector("#book-list");
    //we create a row as tr inside for displaying books
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
    //Appending the created row to list
    list.appendChild(row);
  }

  //Method to delete a book from the UI
  static deleteBook(el) {
    //using el as parameter to represent targeted element in this case the delete button.
    // if an element contains a class; 'delete' remove that element.
    if (el.classList.contains("delete")) {
      //Traversing through the DOM nodes to the right parent element.
      //In this case the parent which is the whole row that is the tr.
      el.parentElement.parentElement.remove();
    }
  }

  //Method to show alerts.
  //Takes in message and className as args.
  static showAlerts(message, className) {
    //Creating a new div then append it later.
    const div = document.createElement("div");
    //Adding several classes to that div, hence backticks are useful.
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    //inserting the div before the form but inside the container.
    container.insertBefore(div, form);

    //Method to showAlerts() vanishes in 2 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  //Method to clear form inputs on submit.
  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

//STORE CLASS: Takes care of storage in the local storage within the browser and books entered do not go away when  refreshing the page, leaving the site or closing the browser, not until it is deleted.
//local storage basically stores data in  key value pairs
//NB: Cannot store data as object in the local storage, it has to be a string, then  parse it later.
class Store {
  //Method to get books
  static getBooks() {
    //books is a string version of entire array of books.
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      //converting string into js array of objects using JSON.parse()
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  //TAKE A BREAK NIGGGGGGGAAHHH!!!!!
  //Method to add book
  static addBook(book) {
    //get books from local storage
    const books = Store.getBooks();
    //Whatever is passed in as a book, we need to push to the array.
    books.push(book);
    //set it to the local storage
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    //We are using isbn as an id,something unique
    //get the books from the store
    const books = Store.getBooks();
    books.forEach((book, index) => {
      //if the isbn matches the one passed in as book,
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    //Reset localStorage with that  book removed
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//Events: To display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event: Add a book
document.querySelector("#book-form").addEventListener("submit", e => {
  //get form values.
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;
  //Validation
  if (title == "" || author == "" || isbn == "") {
    UI.showAlerts("Hey Boss, Please fill all fields!", "danger");
  } else {
    //once we get the values, we wanna instantiate the book from the book class.
    //we pass the values from the form field as parameters
    //Instantiate Book
    const book = new Book(title, author, isbn);
    //console.log(book); //looks like a normal object but is prefixed with word Book on the console, since its the class that it uses.

    //Add Book to the UI
    UI.addBookToList(book);
    //when we reload the added book goes away since we have not persisted it to local storage.

    //Add book to Store
    Store.addBook(book);
    //show success message on book add
    UI.showAlerts("Book added successfully!", "success");

    //clear input fields after submiting the added book
    UI.clearFields();
  }
});

//Event: Remove the book, both in UI and local storage.

//NB: we can't just grab the button and do delete since there are multiple delete buttons and this will only work on one, the best thing is to do event bubbling by targeting the bigger class and add an event listener that will propagate to the children elements.

document.querySelector("#book-list").addEventListener("click", e => {
  console.log(e.target);
  //we gonna pass that e,target to the UI class deleteBook
  //Remove book from UI
  UI.deleteBook(e.target);

  //Remove book from the local store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //show remove book message
  UI.showAlerts("Book removed!", "danger");
});

//coding ends at 9.15am
