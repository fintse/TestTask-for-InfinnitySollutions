let table = document.querySelector('#table-body'),
out = "",
usersBookList = getUsers(),
books = getBooks(),
authors = getAuthors(),
yearThElement = document.querySelector('.table-year-cell'),
authorThElement = document.querySelector('.table-author-cell');

const bookLabelByStatus = {
  1: "Буду читать",
  2: "Читаю",
  3: "Прочитано",
}

const statusStyle = {
  1: "btn-green",
  2: "btn-orange",
  3: "btn-red",
}

document.querySelector('.table-controller-btn[data-status="1"]').addEventListener("click", bookStatusFunction);
document.querySelector('.table-controller-btn[data-status="2"]').addEventListener("click", bookStatusFunction);
document.querySelector('.table-controller-btn[data-status="3"]').addEventListener("click", bookStatusFunction);


document.querySelector('.table-year-reset').addEventListener("click", resetYear)
document.querySelector('.table-author-reset').addEventListener("click", resetAuthor)

function validateBookList(bookList) {
  bookList.map(book => book.status !== 3 ? book : {book, endDate: null });
  bookList.map(book => book.status === 1 ? book : {book, startDate: null });
  return bookList;
}

function getBookById (bookId) {
  return books.find(book => book.id === bookId);
}

function getAuthorById (authorId) {
  return authors.find(author => author.id === authorId);
}

function getAutorName (bookId) {
  let authorId = getBookById(bookId).authorId;
  return getAuthorById(authorId).name
}

function resetYear () {
  yearThElement.classList.remove("close");
  renderFilteredBookList(usersBookList);
}

function resetAuthor () {
  authorThElement.classList.remove("close");
  renderFilteredBookList(usersBookList);
}

function selectYear (year) {
  yearThElement.classList.add("close");
  renderFilteredBookList(usersBookList, null, year, null);
}

function selectAuthor (authorId) {
  let authorName = getAutorName(authorId)
  authorThElement.classList.add("close");
  renderFilteredBookList(usersBookList, null, null, authorName);
}
  
function bookStatusFunction (event) {
  let statusId = Number(event.target.dataset['status']);
  renderFilteredBookList(usersBookList, statusId);
}

function bookStatusFilters (book, statusId)  {
  return book.status === statusId;
}

function bookYearFilters (entry, year)  {
   return year === null ? true : getBookById(entry.bookId).year === year
}

function bookAuthorFilters (entry, authorName)  {
  return authorName === null ? true : getAutorName(entry.bookId) === authorName
}

function validateEndDate (endDate, statusId) {
  if (statusId === 3) {
    return endDate;
  } else {
    return '-';
  }
}

function validateStartDate (startDate, statusId) {
  if (statusId === 1) {
    return '-';
  } else {
    return startDate;
  }
}

function renderFilteredBookList(bookList, statusId = 2, year = null, authorName =null) {
  bookList = validateBookList(bookList)
  table.innerHTML = "";
  out = "";
  if (!statusId) {
    statusId = 2;
  }
  const filteredBookList = bookList.filter((entry) => bookYearFilters(entry, year)).filter((entry) => bookStatusFilters(entry, statusId)).filter((entry) => bookAuthorFilters(entry, authorName));
  for (let user of filteredBookList) {
    out += `
      <tr data-id="${user.id}">
        <td>${getBookById(user.bookId).bookTitle}</td>
        <td class="table-filtred-fild" onclick="selectAuthor(${(user.bookId)})">${getAutorName(user.bookId)}</td>
        <td class="table-filtred-fild" onclick="selectYear(${getBookById(user.bookId).year})">${getBookById(user.bookId).year}</td>
        <td>
          <progress class="table-book-progress-bar" id="bookProgress" max="${getBookById(user.bookId).pages}" value="${user.currentPage}"></progress>
          <span class="table-book-progress-pages" id="title">${user.currentPage}/${getBookById(user.bookId).pages}</span>
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