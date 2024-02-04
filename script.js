const formTransaction = document.querySelector('.transaction');
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');

let transactions = localStorage.getItem('transactions') !== null ? JSON.parse(localStorage.getItem('transactions')) :[];

function updateStatistics(){
    const updatedIncome = transactions
                                    .filter(transaction => transaction.amount > 0)
                                    .reduce((total, transaction) => total += Number(transaction.amount), 0);
    const updatedExpense = transactions
                                    .filter(transaction => transaction.amount < 0)
                                    .reduce((total, transaction) => total += Math.abs(Number(transaction.amount)), 0);

    balance.innerText = updatedIncome - updatedExpense;
    income.innerText = updatedIncome;
    expense.innerText = updatedExpense;
}

updateStatistics();

function generateHtmlList(source, time, amount, id){
    const color = amount > 0 ? "green" : "red";
    return `<li data-id="${id}" class=${color}>
                <span>${source}
                    <p>${time}</p>
                </span>
                <span>₹ ${Math.abs(amount)}
                    <i class="fa fa-trash delete">
                    </i>
                </span>
            </li>`;
}

function addListToDOM(source, time, amount, id){
    if (amount > 0){
        incomeList.innerHTML += generateHtmlList(source, time, amount, id);
    } else {
        expenseList.innerHTML += generateHtmlList(source, time, amount, id);
    }
}

function addTransaction(source, amount){
    const time = new Date();
    let transaction = {
        id: Math.floor(Math.random()*10000),
        source: source,
        amount: amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };
    transactions.push(transaction)
    localStorage.setItem("transactions", JSON.stringify(transactions));
    addListToDOM(transaction.source, transaction.time, transaction.amount, transaction.id);
}


formTransaction.addEventListener('submit', (event) => {
    event.preventDefault();
    if (event.target.source.value.trim() === '' || event.target.amount.value =='' ) {
        formTransaction.reset();
        return alert('Please enter valid Data');   
    }
    addTransaction(event.target.source.value.trim(), event.target.amount.value);
    formTransaction.reset();
    updateStatistics();
})

function getTransaction() {
    transactions.forEach((transaction) =>{
        addListToDOM(transaction.source, transaction.time, transaction.amount, transaction.id);
    })
}

getTransaction();


function deleteTransaction(id) {
    transactions = transactions.filter((transaction) =>{
        return transaction.id !== id;
    })
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

incomeList.addEventListener("click", (event) =>{
    if(event.target.classList.contains("delete")){
        event.target.parentElement.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.parentElement.dataset.id));
        updateStatistics();
    }
})

expenseList.addEventListener("click", (event) =>{
    if(event.target.classList.contains("delete")){
        event.target.parentElement.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.parentElement.dataset.id));
        updateStatistics();
    }
})

