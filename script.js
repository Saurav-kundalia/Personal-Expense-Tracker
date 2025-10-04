let editMode = false;
let editId = null;

// Handle Form Submit
document.getElementById("expenseForm").addEventListener("submit", function(e) {
  e.preventDefault();
  if (editMode) {
    updateExpense(editId);
  } else {
    addExpense();
  }
});

// Local Storage Helpers
function getExpenses() {
  return JSON.parse(localStorage.getItem("expenses") || "[]");
}

function saveExpenses(expenses) {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Add Expense
function addExpense() {
  const expense = getFormData();
  if (!validateExpense(expense)) return;
  let expenses = getExpenses();
  expense.id = Date.now();
  expenses.push(expense);
  saveExpenses(expenses);
  alert("Expense added!");
  resetForm();
  loadExpenses();
}

// Update Expense
function updateExpense(id) {
  let expenses = getExpenses();
  const index = expenses.findIndex(e => e.id === id);
  expenses[index] = { ...getFormData(), id };
  saveExpenses(expenses);
  alert("Expense updated!");
  resetForm();
  loadExpenses();
}

// Delete Expense
function deleteExpense(id) {
  let expenses = getExpenses().filter(e => e.id !== id);
  saveExpenses(expenses);
  alert("Expense deleted!");
  loadExpenses();
}

// Edit Expense
function editExpense(exp) {
  editMode = true;
  editId = exp.id;
  document.getElementById("amount").value = exp.amount;
  document.getElementById("date").value = exp.date;
  document.getElementById("note").value = exp.note;
  document.getElementById("category").value = exp.category;
}

// Get Form Data
function getFormData() {
  return {
    amount: parseFloat(document.getElementById("amount").value),
    date: document.getElementById("date").value,
    note: document.getElementById("note").value,
    category: document.getElementById("category").value
  };
}

// Validate
function validateExpense(exp) {
  if (exp.amount <= 0) {
    alert("Amount must be positive!");
    return false;
  }
  if (!exp.date) {
    alert("Date is required!");
    return false;
  }
  return true;
}

// Reset Form
function resetForm() {
  editMode = false;
  editId = null;
  document.getElementById("expenseForm").reset();
}

// Load Expenses into Table
function loadExpenses() {
  const expenses = getExpenses();
  const tbody = document.querySelector("#expenseTable tbody");
  tbody.innerHTML = "";
  expenses.forEach(exp => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exp.id}</td>
      <td>${exp.amount}</td>
      <td>${exp.date}</td>
      <td>${exp.note}</td>
      <td>${exp.category}</td>
      <td>
        <button onclick='editExpense(${JSON.stringify(exp)})'>Edit</button>
        <button onclick='deleteExpense(${exp.id})'>Delete</button>
      </td>`;
    tbody.appendChild(row);
  });
  loadReports();
}

// Filters
function applyFilter() {
  let expenses = getExpenses();
  const cat = document.getElementById("filterCategory").value;
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  if (cat) expenses = expenses.filter(e => e.category.toLowerCase().includes(cat.toLowerCase()));
  if (start) expenses = expenses.filter(e => e.date >= start);
  if (end) expenses = expenses.filter(e => e.date <= end);

  const tbody = document.querySelector("#expenseTable tbody");
  tbody.innerHTML = "";
  expenses.forEach(exp => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exp.id}</td>
      <td>${exp.amount}</td>
      <td>${exp.date}</td>
      <td>${exp.note}</td>
      <td>${exp.category}</td>
      <td>
        <button onclick='editExpense(${JSON.stringify(exp)})'>Edit</button>
        <button onclick='deleteExpense(${exp.id})'>Delete</button>
      </td>`;
    tbody.appendChild(row);
  });
}

function clearFilter() {
  document.getElementById("filterCategory").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  loadExpenses();
}

// Reports
function loadReports() {
  const expenses = getExpenses();

  // By Category
  const categoryMap = {};
  expenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });
  let html = "<h3>By Category</h3><ul>";
  for (const cat in categoryMap) {
    html += `<li>${cat}: ${categoryMap[cat]}</li>`;
  }
  html += "</ul>";
  document.getElementById("reportCategory").innerHTML = html;

  // By Month
  const monthMap = {};
  expenses.forEach(e => {
    const month = new Date(e.date).getMonth() + 1;
    monthMap[month] = (monthMap[month] || 0) + e.amount;
  });
  html = "<h3>By Month</h3><ul>";
  for (const m in monthMap) {
    html += `<li>Month ${m}: ${monthMap[m]}</li>`;
  }
  html += "</ul>";
  document.getElementById("reportMonth").innerHTML = html;
}

// Download PDF
async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "pt", "a4");

  const element = document.getElementById("expenseTable");

  await html2canvas(element, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 550;
    const pageHeight = 780;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("expenses.pdf");
  });
}

window.onload = loadExpenses;
