# Personal Expense Tracker

A basic web-based personal expense tracker to save, handle, filter, and report on your expenses. You can also export your expenses as a PDF.

---

## Table of Contents

- [Features](#features)  
- [How to Run](#how-to-run)  
- [Assumptions](#assumptions)  
- [Design](#design)  
- [Sample Inputs/Outputs](#sample-inputsoutputs)  

---

## Features

- Add, modify, and remove expenses.  
- Save expenses locally in the browser using Local Storage.
- Sort expenses by category or date range.  
- Produce reports:  
  - Total expenses by Category  
  - Total expenses by Month  
- Export the expense table as a PDF.  

----

## How to Run

1. **Download the project files:
   - `index.html`  
   - `style.css`  
   - `script.js`

2. Open `index.html` using any contemporary web browser (Chrome, Firefox, Edge).

3. Usage:
   - Fill in expense information in the form (Amount, Date, Note, Category) and press Add Expense.
   - Press Edit/Delete** buttons to edit or delete entries.
   - Utilize Filters to display certain expenses.
- Tap Download PDF to download the table as a PDF.

> No backend needed — everything is saved in your browser's local storage.

---


## Assumptions

- Amounts need to be **positive numbers**.
- Date is **mandatory** for all expenses.
- Categories and notes are optional.
- Expenses are saved only in the **browser's local storage**, so clearing the browser will remove the data.

---

## Design

- **Frontend**: HTML + CSS + JavaScript  
- **Data Storage**: Browser **Local Storage**  
- **Reports**:
  - Category-wise: Total all expenses per category  
  - Month-wise: Total all expenses by month  
- **PDF Generation**: With `html2canvas` + `jsPDF`  

**UI Layout:**

