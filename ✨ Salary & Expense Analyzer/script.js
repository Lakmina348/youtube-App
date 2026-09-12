window.onload = function() {
    // Set default date if empty
    if (!document.getElementById('docDate').value) {
        document.getElementById('docDate').valueAsDate = new Date();
    }
    loadSavedData();
};

// Dynamic Rows එකතු කිරීම (Add Row)
function addExpenseRow(title = '', amount = '') {
    const container = document.getElementById('expenseContainer');
    const rowId = 'row_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

    const rowHTML = `
        <div class="expense-row" id="${rowId}">
            <input type="text" class="exp-title" placeholder="වියදම් වර්ගය (උදා: ණය, රීචාජ්)" value="${title}" oninput="calculate()">
            <input type="number" class="exp-amount" placeholder="0.00" value="${amount}" oninput="calculate()">
            <button class="btn-remove" onclick="removeRow('${rowId}')">✕</button>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', rowHTML);
    calculate();
}

// Row එකක් අයින් කිරීම (Remove Row)
function removeRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.remove();
        calculate();
    }
}

// මුදල් ගණනය කිරීම (Calculate Summary)
function calculate() {
    let salary = parseFloat(document.getElementById('salary').value) || 0;
    
    let totalExpense = 0;
    const amounts = document.querySelectorAll('.exp-amount');
    amounts.forEach(input => {
        totalExpense += parseFloat(input.value) || 0;
    });

    let balance = salary - totalExpense;

    document.getElementById('resSalary').innerText = "Rs. " + salary.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('resExpense').innerText = "Rs. " + totalExpense.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('resBalance').innerText = "Rs. " + balance.toLocaleString('en-US', {minimumFractionDigits: 2});

    const statusMsg = document.getElementById('statusMsg');
    if (salary > 0) {
        statusMsg.style.display = "block";
        let perc = ((totalExpense / salary) * 100).toFixed(1);
        if (balance < 0) {
            statusMsg.style.background = "#fce8e6";
            statusMsg.style.color = "#d93025";
            statusMsg.innerText = "⚠️ අවධානයයි: ආදායමට වඩා " + perc + "% ක් අධික වියදමක් සිදුවී ඇත!";
        } else {
            statusMsg.style.background = "#e6f4ea";
            statusMsg.style.color = "#188038";
            statusMsg.innerText = "✅ ඔබ ආදායමෙන් " + perc + "% ක් වියදම් කර ඇති අතර ඉතිරිය ආරක්ෂිතයි.";
        }
    } else {
        statusMsg.style.display = "none";
    }
}

// Data Save කිරීම (LocalStorage)
function saveData() {
    const expenses = [];
    const rows = document.querySelectorAll('.expense-row');
    rows.forEach(row => {
        const title = row.querySelector('.exp-title').value;
        const amount = row.querySelector('.exp-amount').value;
        if (title || amount) {
            expenses.push({ title, amount });
        }
    });

    const data = {
        name: document.getElementById('userName').value,
        date: document.getElementById('docDate').value,
        salary: document.getElementById('salary').value,
        expenses: expenses
    };

    localStorage.setItem('salary_analyzer_data', JSON.stringify(data));
    alert("ස්තූතියි! දත්ත සාර්ථකව Save විය.");
}

// Saved Data Load කිරීම
function loadSavedData() {
    const saved = localStorage.getItem('salary_analyzer_data');
    const container = document.getElementById('expenseContainer');
    container.innerHTML = '';

    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('userName').value = data.name || '';
        if (data.date) document.getElementById('docDate').value = data.date;
        document.getElementById('salary').value = data.salary || '';

        if (data.expenses && data.expenses.length > 0) {
            data.expenses.forEach(item => addExpenseRow(item.title, item.amount));
        } else {
            addExpenseRow('', '');
            addExpenseRow('', '');
        }
    } else {
        // Default rows
        addExpenseRow('', '');
        addExpenseRow('', '');
    }
    calculate();
}

// Reset කිරීම
function resetAll() {
    if (confirm("සියලුම දත්ත මකා දමා මුල සිට ආරම්භ කිරීමට අවශ්‍යද?")) {
        localStorage.removeItem('salary_analyzer_data');
        document.getElementById('userName').value = '';
        document.getElementById('salary').value = '';
        document.getElementById('docDate').valueAsDate = new Date();
        document.getElementById('expenseContainer').innerHTML = '';
        addExpenseRow('', '');
        addExpenseRow('', '');
        calculate();
    }
}

// ලස්සන Document Layout එකක් සහිතව PDF Download කිරීම
function downloadPDF() {
    saveData();
    
    let name = document.getElementById('userName').value || 'User';
    let date = document.getElementById('docDate').value || new Date().toISOString().split('T')[0];
    let salary = parseFloat(document.getElementById('salary').value) || 0;
    
    let totalExpense = 0;
    let expenseRowsHTML = '';
    
    const rows = document.querySelectorAll('.expense-row');
    rows.forEach((row, index) => {
        let title = row.querySelector('.exp-title').value || 'වියදම ' + (index + 1);
        let amount = parseFloat(row.querySelector('.exp-amount').value) || 0;
        totalExpense += amount;
        
        let num = (index + 1) < 10 ? '0' + (index + 1) : (index + 1);
        
        expenseRowsHTML += `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">${num}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 500;">${title}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #0f172a; font-weight: 600;">Rs. ${amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
            </tr>
        `;
    });

    let balance = salary - totalExpense;
    let perc = salary > 0 ? ((totalExpense / salary) * 100).toFixed(1) : 0;

    // Printable HTML Template (Clean PDF look)
    let pdfTemplate = document.createElement('div');
    pdfTemplate.innerHTML = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; padding: 25px; background: #ffffff; color: #2c3e50;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px solid #1a73e8; padding-bottom: 12px;">
                <tr>
                    <td>
                        <h1 style="color: #1a73e8; margin: 0; font-size: 22px;">Financial Summary Report</h1>
                        <p style="margin: 4px 0 0 0; color: #5f6368; font-size: 12px;">Monthly Salary & Expense Analysis</p>
                    </td>
                    <td style="text-align: right; vertical-align: top;">
                        <span style="background: #e8f0fe; color: #1a73e8; padding: 5px 12px; border-radius: 12px; font-size: 11px; font-weight: bold;">Salary Analyzer Pro</span>
                    </td>
                </tr>
            </table>

            <table style="width: 100%; margin-bottom: 20px; font-size: 13px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <tr>
                    <td><span style="color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: bold; display: block;">Prepared For</span><strong>${name}</strong></td>
                    <td style="text-align: right;"><span style="color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: bold; display: block;">Statement Date</span><strong>${date}</strong></td>
                </tr>
            </table>

            <div style="background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%); color: white; padding: 15px 20px; border-radius: 8px; margin-bottom: 20px;">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9;">Total Monthly Income</span>
                <h2 style="margin: 4px 0 0 0; font-size: 24px; font-weight: bold;">LKR ${salary.toLocaleString('en-US', {minimumFractionDigits: 2})}</h2>
            </div>

            <h3 style="color: #1e293b; font-size: 14px; margin-bottom: 10px; border-left: 4px solid #1a73e8; padding-left: 8px;">Itemized Expenses</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
                <thead>
                    <tr style="background: #f1f5f9; color: #475569; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; text-align: left;">
                        <th style="padding: 10px; border-bottom: 2px solid #cbd5e1; width: 10%;">#</th>
                        <th style="padding: 10px; border-bottom: 2px solid #cbd5e1; width: 60%;">Expense Description</th>
                        <th style="padding: 10px; border-bottom: 2px solid #cbd5e1; text-align: right; width: 30%;">Amount (LKR)</th>
                    </tr>
                </thead>
                <tbody>
                    ${expenseRowsHTML}
                </tbody>
            </table>

            <table style="width: 100%; margin-bottom: 20px; font-size: 13px;">
                <tr>
                    <td style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 8px; text-align: center; width: 48%;">
                        <span style="color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: bold; display: block;">Total Expenses</span>
                        <strong style="color: #dc2626; font-size: 16px;">LKR ${totalExpense.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong>
                    </td>
                    <td style="width: 4%;"></td>
                    <td style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 8px; text-align: center; width: 48%;">
                        <span style="color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: bold; display: block;">Net Savings</span>
                        <strong style="color: #16a34a; font-size: 16px;">LKR ${balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong>
                    </td>
                </tr>
            </table>

            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; padding: 10px; border-radius: 8px; text-align: center; font-size: 12px; font-weight: bold; margin-bottom: 30px;">
                STATUS: You have utilized ${perc}% of your total income. Savings are secure.
            </div>

            <table style="width: 100%; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 20px;">
                <tr>
                    <td style="font-size: 11px; color: #94a3b8;">Generated by Salary & Expense Analyzer Tool</td>
                    <td style="font-size: 12px; font-weight: bold; color: #64748b; text-align: right;">@Lakmina2005</td>
                </tr>
            </table>
        </div>
    `;

    let opt = {
        margin: [10, 10, 10, 10],
        filename: 'Salary_Analysis_' + name + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(pdfTemplate).save();
}