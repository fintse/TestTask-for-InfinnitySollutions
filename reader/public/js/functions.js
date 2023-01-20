let table = document.querySelector('#table-body'),
out = "",
usersBookList = getUsers(),
books = getBooks(),
authors = getAuthors(),
yearThElement = document.querySelector('.table-year-cell'),
authorThElement = document.querySelector('.table-author-cell');

const bookLabelByStatus = {
  0: "Буду читать",
  1: "Читаю",
  2: "Прочитано",
}

const statusStyle = {
  0: "btn-green",
  1: "btn-orange",
  2: "btn-red",
}

document.querySelector('.table-controller-btn[data-status="0"]').addEventListener("click", bookStatusFunction);
document.querySelector('.table-controller-btn[data-status="1"]').addEventListener("click", bookStatusFunction);
document.querySelector('.table-controller-btn[data-status="2"]').addEventListener("click", bookStatusFunction);


document.querySelector('.table-year-reset').addEventListener("click", resetYear)
document.querySelector('.table-author-reset').addEventListener("click", resetAuthor)

function validateBookList(bookList) {
  bookList.map(book => {if (book.status !== 2) {book.endDate = null}});
  return bookList;
}

function getBookById (bookId) {
  return books.find(book => book.id === bookId);
}

function getAuthorById (authorId) {
  return authors.find(author => author.id == authorId);
}

function getAuthorIdByBookId (bookId) {
  return getBookById(bookId).authorId;
}

function getBookTitle (bookId) {
  return getBookById(bookId).bookTitle;
}

function getAutorName (bookId) {
  let authorId = getAuthorIdByBookId(bookId)
  return getAuthorById(authorId).name
}

function getBookYear (bookId) {
  return getBookById(bookId).year;
}

function getBookPages (bookId) {
  return getBookById(bookId).pages;
}

function resetYear () {
  yearThElement.classList.remove("close");
  authorThElement.classList.remove("close");

  renderFilteredBookList(usersBookList);
}

function resetAuthor () {
  authorThElement.classList.remove("close");
  yearThElement.classList.remove("close");

  renderFilteredBookList(usersBookList);
}

function bookYearFunction (year) {
  yearThElement.classList.add("close");
  renderFilteredBookList(usersBookList, null, year, null);
}

function bookAuthorFunction (authorId) {
  let authorName = getAutorName(authorId)
  authorThElement.classList.add("close");
  renderFilteredBookList(usersBookList, null, null, authorName);
}
  
function bookStatusFunction (event) {
  let statusId = event.target.dataset['status'];
  renderFilteredBookList(usersBookList, statusId);
}

function bookStatusFilters (book, statusId)  {
  return book.status == statusId;
}

function bookYearFilters (entry, year)  {
  if (!year) {
    return usersBookList;
  } else {
    return getBookYear(entry.bookId) == year;
  }
}

function bookAuthorFilters (entry, authorName)  {
  if (!authorName) {
    return usersBookList;
  } else {
    return getAutorName(entry.bookId) == authorName;
  }
}

function validateEndDate (endDate, statusId) {
  if (statusId == 2) {
    return endDate;
  } else {
    return '-';
  }
}

function validateStartDate (startDate, statusId) {
  if (!statusId == 0) {
    return startDate;
  } else {
    return '-';
  }
}

function renderFilteredBookList(bookList, statusId = 1, year, authorName) {
  bookList = validateBookList(bookList)
  table.innerHTML = "";
  out = "";
  if (!statusId) {
    statusId = 1;
  }
  const filteredBookList = bookList.filter((entry) => bookYearFilters(entry, year)).filter((entry) => bookStatusFilters(entry, statusId)).filter((entry) => bookAuthorFilters(entry, authorName));
  for (let user of filteredBookList) {
    out += `
      <tr data-id="${user.id}">
        <td>${getBookTitle(user.bookId)}</td>
        <td class="table-filtred-fild" onclick="bookAuthorFunction(${(user.bookId)})">${getAutorName(user.bookId)}</td>
        <td class="table-filtred-fild" onclick="bookYearFunction(${getBookYear(user.bookId)})">${getBookYear(user.bookId)}</td>
        <td>
          <progress class="table-book-progress-bar" id="bookProgress" max="${getBookPages(user.bookId)}" value="${user.currentPage}"></progress>
          <!-- <input type="range" name="currentPage" min="0" max="${getBookPages(user.bookId)}" step="1" value="${user.currentPage}"> -->
          <span class="table-book-progress-pages" id="title">${user.currentPage}/${getBookPages(user.bookId)}</span>
        </td>
        <td class="flex-center book-status"><div class="btn btn-status ${statusStyle[user.status]}"><span">${bookLabelByStatus[user.status]}</span></div></td>
        <td>${validateStartDate(user.startDate, user.status)}</td>
        <td>${validateEndDate(user.endDate, user.status)}</td>
      </tr>
    `
    }
  table.innerHTML = out;
}

renderFilteredBookList(usersBookList)