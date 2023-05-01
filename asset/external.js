
// for loading the page
function loadTable() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/library");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      var trHTML = "";
      const objects = JSON.parse(this.responseText);
      for (let object of objects) {
        trHTML += "<tr>";
        trHTML += "<td>" + object["id"] + "</td>";
        trHTML += "<td>" + object["BookName"] + "</td>";
        trHTML += "<td>" + object["AuthorName"] + "</td>";
        trHTML += "<td>" + object["BookType"] + "</td>";
        trHTML += "<td>" + object["Publisher"] + "</td>";
        trHTML += "<td>" + object["Cost"] + "</td>";
        trHTML += '<td><img width="50px" src="' +
          object["CoverImage"] +
          '" class="CoverImage"></td>';
        trHTML +=
          '<td><button type="button" class="btn btn-outline-secondary" onclick="Edit(' +
          object["id"] +
          ')">Edit</button>';
        trHTML +=
          '<button type="button" class="btn btn-outline-danger" onclick="userDelete(' +
          object["id"] +
          ')">Del</button></td>';
        trHTML += "</tr>";
      }
      document.getElementById("table1").innerHTML = trHTML;
    }
  };
}

loadTable();

// for creating record
function Create() {
  Swal.fire({
    title: "BOOK DETAILS",
    html:
      '<label >ENTER BOOK NAME</label>' +
      '<input id="BookName" class="swal2-input" placeholder="Book Name" required >' +
      '<label >ENTER AUTHOR NAME</label>' +
      '<input id="AuthorName" class="swal2-input" placeholder="Author Name" required>' +
      '<label >ENTER BOOK TYPE</label>' +
      '<input id="BookType" class="swal2-input" placeholder="Book Type" required>' +
      '<label >ENTER PUBLISHER NAME</label>' +
      '<input id="Publisher" class="swal2-input" placeholder="Publisher" required><BR>' +
      '<label >ENTER COST</label><BR>' +
      '<input id="Cost" class="swal2-input" placeholder="Cost" required>' +
      '<label >UPLOAD COVER IMAGE</label>' +
      '<input id="CoverImage" type="file" class="swal2-input" placeholder=" upload Cover Image">',
    focusConfirm: false,
    preConfirm: () => {
      post().then(() => {
        Swal.fire({
          icon: "success",
          title: "Book added successfully"
        });
        loadTable();
      });
    },
  });
}

function post() {
  const BookName = document.getElementById("BookName").value;
  const AuthorName = document.getElementById("AuthorName").value;
  const BookType = document.getElementById("BookType").value;
  const Publisher = document.getElementById("Publisher").value;
  const Cost = document.getElementById("Cost").value;
  const CoverImageInput = document.getElementById("CoverImage");
  const CoverImage = CoverImageInput.files[0];

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects["message"]);
      loadTable();
    }
  };

  // Generate new ID
  const table = document.getElementById("table1");
  const maxId = Array.from(table.rows)
    .slice(1) // Skip header row
    .reduce((acc, row) => Math.max(acc, row.cells[0].innerText), 0);
  const newId = maxId + 1;

  if (CoverImage) {
    const reader = new FileReader();
    reader.onload = function() {
      const dataUrl = reader.result;
      xhttp.open("POST", "http://localhost:3000/library");
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(
        JSON.stringify({
          id: newId,
          BookName: BookName,
          AuthorName: AuthorName,
          BookType: BookType,
          Publisher: Publisher,
          Cost: Cost,
          CoverImage: dataUrl,
        })
      );
    }
    reader.readAsDataURL(CoverImage);
  } else {
    xhttp.open("POST", "http://localhost:3000/library");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
      JSON.stringify({
        id: newId,
        BookName: BookName,
        AuthorName: AuthorName,
        BookType: BookType,
        Publisher: Publisher,
        Cost: Cost,
        CoverImage: null,
      })
    );
  }}
 
function Edit(id) {
  console.log(id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", `http://localhost:3000/library/${id}`);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);

      console.log(objects);
      Swal.fire({
        title: "Edit Book Details",
        html:
          '<input id="id" type="hidden" value="' +
          objects[`${id}`] +
          '">' +
          '<input id="BookName" class="swal2-input" placeholder="Enter Book Name" value="' +
          objects["BookName"] +
          '">' +
          '<input id="AuthorName" class="swal2-input" placeholder="Enter Author Name" value="' +
          objects["AuthorName"] +
          '">' +
          '<input id="BookType" class="swal2-input" placeholder="Enter Book type" value="' +
          objects["BookType"] +
          '">' +
          '<input id="Publisher" class="swal2-input" placeholder="Publisher" value="' +
          objects["Publisher"] +
          '">' +
          '<input id="Cost" class="swal2-input" placeholder="Cost" value="' +
          objects["Cost"] +
          '">' +
          '<input id="CoverImage" class="swal2-input" placeholder="CoverImage" value="' +
          objects["CoverImage"] +
          '">',
        preConfirm: () => {
          userEdit(id);
        },
      });
    }
  };
}

function userEdit(id) {
  const BookName = document.getElementById("BookName").value;
  const AuthorName = document.getElementById("AuthorName").value;
  const BookType = document.getElementById("BookType").value;
  const Publisher = document.getElementById("Publisher").value;
  const Cost = document.getElementById("Cost").value;
  const CoverImage = document.getElementById("CoverImage").value;
  console.log(id);
  console.log(BookName);
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", `http://localhost:3000/library/${id}`);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      BookName: BookName,
      AuthorName: AuthorName,
      BookType: BookType,
      Publisher: Publisher,
      Cost: Cost,
      CoverImage: CoverImage,
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects["message"]);
      loadTable();
    }
  };
}

function userDelete(id) {
  console.log(id);

  Swal.fire({
    title: 'Delete Record?',
    text: "record will be deleted!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      const xhttp = new XMLHttpRequest();
      xhttp.open(`DELETE`, `http://localhost:3000/library/${id}`);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          const objects = JSON.parse(this.responseText);
          Swal.fire(objects["message"]);
          loadTable();
        }
      };
      xhttp.send(
        JSON.stringify({
          id: id,
        })
      );
    }
  });
}
