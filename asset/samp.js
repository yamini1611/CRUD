function loadTable() {
    const xhttp = new XMLHttpRequest
    xhttp.open("GET", "http://localhost:3000/Orders");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var trHTML = "";
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
                trHTML += "<tr>";
                trHTML += "<td>" + object["id"] + "</td>";
                trHTML += "<td>" + object["ProductName"] + "</td>";
                trHTML += "<td>" + object["ProductType"] + "</td>";
                trHTML += "<td>" + object["OrderDate"] + "</td>";
                trHTML += "<td>" + object["Quantity"] + "</td>";
                trHTML += "<td>" + object["Price"] + "</td>";
                trHTML += '<td><img width="50px" src="' + object["ProductImage"] + '" class="proimg"></td>';
                trHTML += '<td><button type="button" class="btn btn-outline-dark" onclick="ProductEditBox(' +
                    object["id"] + ')">EDIT</button></td>'
                trHTML += '<td><button type="button" class="btn btn-outline-danger" onclick="ProductDelete(' +
                    object["id"] + ')">DELETE</button></td>'
                trHTML += "</tr>";
            }
            document.getElementById("table1").innerHTML = trHTML;
        }
    }
}
loadTable();

function ProductCreateBox() {
    Swal.fire({
        title: "CREATE PRODUCT",
        html:
            '<input id="id" type="hidden">' +
            '<input id="ProductType" class="swal2-input" placeholder="Product Type">' +
            '<input id="ProductName" class="swal2-input" placeholder="Product Name">' +
            '<input id="OrderDate" type="date" class="swal2-input" placeholder="Order Date">' +
            '<input id="Quantity" type="input" class="swal2-input" placeholder="Quantity">' +
            '<input id="Price" class="swal2-input" placeholder="Price">',
        focusConfirm: false,
        preConfirm: () => {
            procreate();
        }
    })
}

function procreate() {
    const ProductType = document.getElementById("ProductType").value;
    const ProductName = document.getElementById("ProductName").value;
    const OrderDate = document.getElementById("OrderDate").value;
    const Quantity = document.getElementById("Quantity").value;
    const Price = document.getElementById("Price").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/Orders");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
        JSON.stringify({
            ProductType: ProductType,
            ProductName: ProductName,
            OrderDate: OrderDate,
            Quantity: Quantity,
            Price: Price,
            ProductImage: "https://www.melivecode.com/users/1.png",
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

function ProductEditBox(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:3000/Orders/${id}`);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            console.log(objects);
            Swal.fire({
                title: "Edit Product",
                html:
                    '<input id="id" type="hidden" value=' +
                    objects["id"] + ">" +
                    '<input id="ProductName" class="swal2-input" placeholder="Product Name" value="' +
                    objects["ProductName"] + '">' +
                    '<input id="ProductType" class="swal2-input" placeholder="Product Type" value="' +
                    objects["ProductType"] + '">' +
                    '<input id="OrderDate" type="date" class="swal2-input" placeholder="OrderDate" value="' +
                    objects["OrderDate"] + '">' +
                    '<input id="Quantity"  type="input" class="swal2-input" placeholder="Quantity" value="' +
                    objects["Quantity"] + '">' +
                    '<input id="Price" class="swal2-input" placeholder="Price" value="' +
                    objects["Price"] + '">',
                focusConfirm: false,
                preConfirm: () => {
                    userEdit();
                },
            });
        }
    };
}

function userEdit(id) {
    const ProductType = document.getElementById("ProductType").value;
    const ProductName = document.getElementById("ProductName").value;
    const OrderDate = document.getElementById("OrderDate").value;
    const Quantity = document.getElementById("Quantity").value;
    const Price = document.getElementById("Price").value;
    console.log(id);
    console.log(ProductName);
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `http://localhost:3000/Orders/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
        JSON.stringify({
            ProductType: ProductType,
            ProductName: ProductName,
            OrderDate: OrderDate,
            Quantity: Quantity,
            Price: Price,
            ProductImage: "https://www.melivecode.com/users/1.png",
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
function ProductDelete(id) {
    console.log(id);
    Swal.fire({
        title: "WANT TO DELETE?",
        text: "You won't be able to recover this!",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const xhttp = new XMLHttpRequest();
            xhttp.open("DELETE", `http://localhost:3000/Orders/${id}`);
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(
                JSON.stringify({
                    id: id,
                })
            );
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    const objects = JSON.parse(this.responseText);
                    Swal.fire(objects["message"]);
                }
            };
        }
    });
}
function subscribe() {
    Swal.fire({
        title: 'WELCOME',
        html:
            `<form>
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" class="form-control" id="username">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" class="form-control" id="password">
            </div>
          </form>`,
        showCancelButton: true,
        confirmButtonText: 'Subscribe',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        preConfirm: () => {
            const username = Swal.getPopup().querySelector('#username').value;
            const password = Swal.getPopup().querySelector('#password').value;
            if (!username || !password) {
                Swal.showValidationMessage('Please enter a username and password');
            }
            return { username: username, password: password };
        }
    }).then(result => {
        if (result.isConfirmed) {
        }
    });
}