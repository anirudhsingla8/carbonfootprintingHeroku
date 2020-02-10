let user;
let user_id;
let host_url;

async function fetchUserId(){
    let cookie = '';
    console.log(cookie);
    let res = await fetch('https://carbonfootprinting1608.herokuapp.com/user/dashboard',
        {redirect: 'follow',
            headers:{
                "Cookie":cookie
            }});
    let userJson = await res.json();
    console.log(res);
    console.log(userJson._id);
    return userJson._id;
};


async function logOut(){

    fetch("https://carbonfootprinting1608.herokuapp.com/user/logout",{
        method: 'GET',
        redirect: 'follow'
    }).then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    localStorage.setItem("loggedInUser",'');
    localStorage.setItem("gender",'');
    alert('Successfully Logged Out');
    window.location="https://carbonfootprinting1608.herokuapp.com";
}

async function registration() {
    try {
        let firstname = document.getElementById("firstname").value;
        let lastname = document.getElementById("lastname").value;
        //let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let email = document.getElementById("email").value;
        let gender = '';
        if (document.getElementById('male').checked) {
            gender = document.getElementById('male').value;
        } else if (document.getElementById('female').checked) {
            gender = document.getElementById('female').value;
        }
        let data = JSON.stringify({
            firstName: firstname,
            lastName: lastname,
            gender: gender,
          //  username: username,
            email: email,
            password: password
        });
        let res = await fetch('https://carbonfootprinting1608.herokuapp.com/user/register', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //const myJson = await res.json();
        const myJson = res.json();
        if (res.status == 200){
            //console.log('Success:', JSON.stringify(myJson));
            console.log("the status is "+res.status);
            alert('User Successfully Registered, Please proceed with login');
            window.location="https://carbonfootprinting1608.herokuapp.com/login.html";
        } else {
            console.log("the status is "+res.status);
            alert('User with this ID already exists, Please try different one');
        }
    }
    catch(error){
        console.log('inside register catch');
        alert('Unexpected error occurred ,Please try Again');
        console.error('Error:', error);
    }
}


async function login() {
    try{
        event.preventDefault();
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let data = JSON.stringify({
            email: email,
            password: password
        });
        await fetch('https://carbonfootprinting1608.herokuapp.com/user/login', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res=> {
            data = res.json();
            return data;
        })
            .then(res=>{
                user = res.user_obj;
                user_id=user._id;
                console.log(user);
                console.log(user_id);
                console.log(user.firstName);
                alert('Successfully Logged in');
                window.location="https://carbonfootprinting1608.herokuapp.com/success.html";
                localStorage.setItem("loggedInUser", user.firstName+" "+user.lastName);
                localStorage.setItem("gender",user.gender);
                return user;
            });
    }
    catch (error) {
        alert('No User Exists or Wrong Password,Please Try Again');
        console.error('Error:', error);
    }
}

// incomplete part
async function add_Card(){
    try{
        let user_id = await fetchUserId();
        let HOST_URL='https://carbonfootprinting1608.herokuapp.com/user/add_card/';
        let URL = HOST_URL+user_id;
        console.log(user_id);
        let cardNumber = document.getElementById('cardNumber').value;
        let CVV = document.getElementById('CVV').value;
        let expiryYear = document.getElementById('expiryYear').value;
        let food = 0;
        let shopping = 0;
        let travel = 0;
        console.log('inside add_card',user_id);
        let data = JSON.stringify({
            card_number:cardNumber,
            CVV:CVV,
            expiryYear:expiryYear,
            shopping:shopping,
            food:food,
            travel:travel
        });
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
                alert(this.responseText);
                console.log(this.responseText);
            }
        });

        xhr.open("PUT", URL);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(data);


    }
    catch (error) {
        alert('Unexpected Error occurred,Please try again')
        console.error('Error:', error);
    }
}


async function fetchCards(){
    let user_id = await fetchUserId();
    let HOST_URL='https://carbonfootprinting1608.herokuapp.com/user/get_cards/';
    let URL = HOST_URL+user_id;
    console.log(URL);
    console.log(user_id);
    let data = '';
    let user_cards;
    let res = await fetch(URL)
        .then(res=>{
            data = res.json();
            return data;
        })
        .then(res=>{
            user = res.data;
            user_cards = user[0].cards;

            return user_cards;
        })
    console.log(res);
    console.log(user_id);
    return res;
}

async function update_details(){
    console.log('Clicked');
    try {
        let card_number = document.getElementById('cardNumber').value;
        let shopping_expense = document.getElementById('shoppingExpense').value;
        let food_expense = document.getElementById('foodExpense').value;
        let travel_expense = document.getElementById('travelExpense').value;
        let data = JSON.stringify({
            card_number: card_number,
            shopping: shopping_expense,
            food: food_expense,
            travel: travel_expense
        });

        let user_id = await fetchUserId();
        let HOST_URL='https://carbonfootprinting1608.herokuapp.com/user/update_card/';
        let URL = HOST_URL+user_id;
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                alert('Details Successfully Updated');
                console.log(this.responseText);
            }
        });
        xhr.open("PUT", URL);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }catch(error){
        alert('Unexpected Error Occurred, Please try again');
        console.error('Error:', error);
    }
    /*
    let my_modal = document.getElementById('myModal');
    let modal_dialog = document.createElement('div');
    modal_dialog.className='modal-dialog';
    let modal_content = document.createElement('div');
    modal_content.className='modal-content';
    let modal_header = document.createElement('div');
    modal_header.className='modal-header';
    let modal_body = document.createElement('div');
    modal_body.className='modal-body';
    let modal_footer = document.createElement('div');
    modal_footer.className='modal-footer';
    let update_button=document.createElement('button');
    update_button.innerText='update';

    modal_footer.appendChild(update_button);
    modal_content.appendChild(modal_header);
    modal_content.appendChild(modal_body);
    modal_content.appendChild(modal_footer);
    modal_dialog.appendChild(modal_content);
    my_modal.appendChild(modal_dialog);*/

    /*
    let modal_dialog = document.getElementsByClassName('modal-dialog');
    //modal_dialog.className='modal-dialog';
    let modal_content = document.getElementsByClassName('modal-content');
    //modal_content.className='modal-content';
    let modal_header = document.getElementsByClassName('modal-header');
    //modal_header.className='modal-header';
    let modal_footer = document.getElementsByClassName('modal-footer');
    //modal_footer.className='modal-footer';
    let header_content = document.createElement('p');
    header_content.innerText='Update';
    modal_header.appendChild(header_content);
    let modal_body = document.getElementById('modal-body');
    modal_body.className='modal-body';
    let shopping_input = document.createElement('input');
    let food_input = document.createElement('input');
    shopping_input.placeholder='Enter new shopping expense';
    food_input.placeholder='Enter new food expense';
    modal_body.appendChild(shopping_input);
    modal_body.appendChild(food_input);
    let update_button = document.createElement('button');
    update_button.className='btn btn-primary';
    update_button.innerText='Update';
    update_button.setAttribute('data-dismiss','modal');
    update_button.setAttribute('onclick','update_result()');
    modal_footer.appendChild(update_button);
    modal_content.appendChild(modal_header);
    modal_content.appendChild(modal_body);
    modal_content.appendChild(modal_footer);
    modal_dialog.appendChild(modal_content);
    //my_modal.appendChild(modal_dialog);

     */
}

let interestRate = (food,shopping,travel) => {
    let foodE = food*(105/100);
    let shoppingE = shopping*(112/100);
    let travelE = travel*(120/100);
    return (foodE+shoppingE+travelE);
}

let tree = (food,shopping,travel) => {
    let expense = food+shopping+travel;
    let no_of_tree = Math.ceil(expense/10000);
    return no_of_tree;
}

let createTaskCard = (user) => {
    let cardContainer = document.getElementById('card-container');
    let card = document.createElement('div');
    card.className = 'card shadow cursor-pointer';
    card.style.width='450px';
    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let title = document.createElement('h3');
    title.innerText = user.card_number;
    title.className = 'card-title';
    //title.style.fontSize='25px';

    let update_button = document.createElement('button')
    update_button.innerText = 'Update Transactions';
    update_button.setAttribute('onclick','update_details()');
    let shopping = document.createElement('h5');
    let food = document.createElement('h5');
    let travel = document.createElement('h5');
    let totalExpense = document.createElement('h5');
    let expenseInterest = document.createElement('h5');
    let no_of_tree = document.createElement('h5');
    food.innerText = "Food : "+user.food;
    shopping.innerText = "Shopping : "+user.shopping;
    travel.innerHTML = "Travel : "+user.travel;
    totalExpense.innerText = "Total Expenditure on card is : "+(user.food+user.shopping+user.travel);
    expenseInterest.innerText = "Total amount need to be paid is : "+interestRate(user.food,user.shopping,user.travel);
    no_of_tree.innerHTML = "Total trees need to be planted : "+tree(user.food,user.shopping,user.travel);
    cardBody.appendChild(title);
    cardBody.appendChild(shopping);
    cardBody.appendChild(food);
    cardBody.appendChild(travel);
    cardBody.appendChild(totalExpense);
    cardBody.appendChild(expenseInterest);
    cardBody.appendChild(no_of_tree);
    //cardBody.appendChild(update_button);
    card.appendChild(cardBody);
    cardContainer.appendChild(card);
}



async function displayCards(){
    let Cards = await fetchCards();
    console.log(Cards.length);
    if(Cards.length===0){
        alert('Sorry, you has no Cards linked with us');
    }else{
        Cards.forEach((user) => {
            createTaskCard(user);
        });
    }
};