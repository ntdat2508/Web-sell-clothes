var imgsrc = document.getElementById('output');
var loadFile = function(event) {
    var reader = new FileReader();
    reader.onload = function(){
      imgsrc.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  };



var priceTag = document.getElementById('price')
var quantityTag = document.getElementById('quantity')
var totalPriceTag = document.getElementById('total_price')
function updateTotalPrice() {
	price = parseFloat(priceTag.value)
	quantity = quantityTag.value
	totalPriceTag.value = price * quantity
}

// Phan 2: Xu ly them/sua/xoa san pham
var productList = [] //Chua tat ca cac san pham => thuc hien add hien thi len table
var categoryTag= document.getElementById('category_name')
var productNameTag = document.getElementById('product_name')

var resultTag = document.getElementById('result')
var currentIndex = -1
function addProduct() {
    if(!productNameTag.value && !imgsrc.src && !priceTag.value & quantityTag.value <=0 && !totalPriceTag.value && !categoryTag.value){
        alert("chua nhap du lieu")
    }
    else{
    imageprd = imgsrc.src
	productName = productNameTag.value
	price = priceTag.value
	quantity = quantityTag.value
	totalPrice = totalPriceTag.value
	categoryName = categoryTag.options[categoryTag.selectedIndex].text;
    }
	var product = {
        'imageprd' : imageprd,
		'productName': productName,
		'categoryName': categoryName,
		'price': price,
		'quantity': quantity,
		'totalPrice': totalPrice,
	}

	if(currentIndex >= 0) {
		productList[currentIndex] = product
		currentIndex = -1
		saveBtn.innerHTML = 'Add Product'
	} else {
		productList.push(product)
	}
    showData()

	// Xoa du lieu di
	// document.getElementById('reset_btn').click()
	resetData()
}

function resetData() {
    imgsrc.src=''
	productNameTag.value = ''
	priceTag.value = ''
	quantityTag.value = ''
	totalPriceTag.value = ''
}

function deleteItem(index) {
	console.log(index)
	productList.splice(index, 1)
	
	showData()
}

function showData() {
	//Hien thi lai danh sach san pham trong table
	resultTag.innerHTML = ''   
        for (var i = 0; i < productList.length; i++) {
            product = productList[i]
            resultTag.innerHTML += `<tr>
                                <td>${i + 1}</td>
                                <td><img class="p-0" src="${product.imageprd}" alt="" width="90rem"></td>
                                <td>${product.productName}</td>
                                <td>${product.categoryName}</td>
                                <td>${product.price}</td>
                                <td>${product.quantity}</td>
                                <td>${product.totalPrice}</td>
                                <td><button class="btn btn-outline-dark" onclick="editItem(${i})">Edit</button></td>
                                <td><button class="btn btn-outline-danger" onclick="deleteItem(${i})">Delete</button></td>
                            </tr>`
        }
    
	
}

var saveBtn = document.getElementById('save_btn')
function editItem(index) {
	currentIndex = index
    imgsrc.src = productList[index].imageprd
	productNameTag.value = productList[index].productName
	priceTag.value = productList[index].price
	quantityTag.value = productList[index].quantity
	totalPriceTag.value = productList[index].totalPrice
	categoryTag.value = productList[index].categoryName
	saveBtn.innerHTML = 'Update Product'
}