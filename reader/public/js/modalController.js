const openModalButtons = document.querySelectorAll('[data-modal-target]');
const overlay = document.getElementById('overlay');

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        let form = document.getElementById('myForm');
        form.reset();
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
})

function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}

document.getElementById("status").addEventListener('change', function() {
    let currentPageEl = document.querySelector("#currentPage");
    if (Number(this.value) !== 1) {
        currentPageEl.classList.remove('hidden')
    } else {
        currentPageEl.classList.add('hidden')
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document
      .getElementById('myForm')
      .addEventListener('submit', handleForm);
  });

  function handleForm(ev) {

    ev.preventDefault();
    let myForm = ev.target;
    let fd = new FormData(myForm);

    let json = convertFD2JSON(fd);

    function getHighestIdAuthors () {
        let id = 0;
        JSON.parse(localStorage.getItem("authors")).forEach(author => {
            if (author.id >= id) {
                id = author.id + 1;
            }
        })
        if (localStorage.getItem("authors_new")) {
            JSON.parse(localStorage.getItem("authors_new")).forEach(author => {
                if (author.id >= id) {
                    id = author.id + 1;
                }
            })
        } 
        return id;
    }

    function getHighestIdBooks () {
        let id = 0;
        JSON.parse(localStorage.getItem("books")).forEach(book => {
            if (book.id >= id) {
                id = book.id + 1;
            }
        })
        if (localStorage.getItem("books_new")) {
            JSON.parse(localStorage.getItem("books_new")).forEach(book => {
                if (book.id >= id) {
                    id = book.id + 1;
                }
            })
        } 
        return id;
    }

    function getHighestId (array1, array2) {
        let id = 0;
        JSON.parse(localStorage.getItem(array1)).forEach(el => {
            if (el.id >= id) {
                id = el.id + 1;
            }
        })
        if (localStorage.getItem(array2)) {
            JSON.parse(localStorage.getItem(array2)).forEach(el => {
                if (el.id >= id) {
                    id = el.id + 1;
                }
            })
        } 
        return id;
    }

    function getAuthorIdByName (name) {
        let id = 0;
        JSON.parse(localStorage.getItem("authors")).forEach(author => {
            if (author.name === name) {
                id = author.id;
            }
        })
        if (JSON.parse(localStorage.getItem("authors_new"))) {
            JSON.parse(localStorage.getItem("authors_new")).forEach(author => {
                if (author.name === name) {
                    id = author.id;
                }
            })
        }
        return id;
    }

    function getStartDate (statusId) {
        if (statusId !== 1) {
            return new Date().toJSON().slice(0, 10) + " " + new Date().toLocaleTimeString('en-US', { hour12: false, 
                hour: "numeric", 
                minute: "numeric"});
        } 
    }

    function getEndDate (statusId) {
        if (statusId === 3) {
            return new Date().toJSON().slice(0, 10) + " " + new Date().toLocaleTimeString('en-US', { hour12: false, 
                hour: "numeric", 
                minute: "numeric"});
        } 
    }

    if(!localStorage.getItem("authors").includes(JSON.parse(json).name)) {
        completeLocalStarage({"id":getHighestIdAuthors(),"name":JSON.parse(json).name}, "authors_new");
    }

    if(!localStorage.getItem("books").includes(JSON.parse(json).bookTitle)) {
        completeLocalStarage({"id":getHighestIdBooks(),"authorId":getAuthorIdByName(JSON.parse(json).name),"bookTitle":JSON.parse(json).bookTitle,"year":JSON.parse(json).year,"pages":JSON.parse(json).pages},  "books_new");
    }

    if(!localStorage.getItem("usersBookList").includes(JSON.parse(json).bookTitle)) {
        completeLocalStarage({"id":getHighestId("usersBookList", "usersBookList_new"),"userId":0,"bookId":getHighestId("usersBookList", "usersBookList_new"),"currentPage":Number(JSON.parse(json).currentPage),"status":Number(JSON.parse(json).status), "startDate": getStartDate(Number(JSON.parse(json).status)), "endDate": getEndDate(Number(JSON.parse(json).status))},  "usersBookList_new");
    }

    function completeLocalStarage (json, title) {
        let localArray = JSON.parse(localStorage.getItem(title));
        if (localArray === null) {
            localArray = [];
        }
        localArray.push(json);
        localStorage.setItem(title, JSON.stringify(localArray))
    }

    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
    myForm.reset(); 
  }

  function convertFD2JSON(formData) {
    let obj = {};
    for (let key of formData.keys()) {
      obj[key] = formData.get(key);
    }
    return JSON.stringify(obj);
  }

  function editForm (userBookId, authorId) {
    openModalButtons.forEach(button => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
    modal.querySelectorAll(".formBox.input").forEach(section => {
        fillForm(section, userBookId, authorId)
        // if (section.querySelector("[name='bookTitle']")) {
        //     let target = section.querySelector("[name='bookTitle']");
        //     books.forEach(book => {
        //         if (book.id === userBookId) {
        //             target.value = book.bookTitle;
        //         }
        //     })
        // }
        // if (section.querySelector("[name='name']")) {
        //     let target = section.querySelector("[name='name']");
        //     books.forEach(book => {
        //         if (book.id === userBookId) {
        //             target.value = book.name;
        //         }
        //     })
        // }
    })
}   

    function fillForm(section, userBookId, authorId) {
        let sectionName = section.querySelector('label').htmlFor;
        let target = section.querySelector("[name="+sectionName+"]");
        // if (sectionName === "status") {
        //     console.log(target);
        // }
        books.forEach(book => {
            if (sectionName === "status") {
                console.log(book);
                target.options[target.selectedIndex].value = book.status;
            }
            if (book.id === userBookId && book[sectionName]) {

                target.value = book[sectionName];
            }
        })

        authors.forEach(author => {
            if (author.id === authorId && author[sectionName]) {
                target.value = author[sectionName];
            }
        })

        usersBookList.forEach(book => {
            if (sectionName === "status") {
                console.log(target);
                target.options[target.selectedIndex].value = book.status;
            }
        })
    }
  