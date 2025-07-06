// shift.js - Shift closing logic

document.addEventListener('DOMContentLoaded', () => {
  const $ = window.$;
  $('#shiftForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const getVal = id => parseFloat($(id).value) || 0;
    const totalRevenue = getVal('#cashBox') + getVal('#cashSales') + getVal('#otherIncome');
    const totalExpenses = getVal('#expenses') + getVal('#discounts') + getVal('#visaPayments');
    const netRevenue = totalRevenue - totalExpenses;
    let carriedOver = Math.floor(netRevenue / 100) * 100;
    let cashBoxLeft = netRevenue - carriedOver;
    let carryMsg = '';
    if (netRevenue < 100) {
      carriedOver = 0;
      cashBoxLeft = netRevenue;
      carryMsg = 'المبلغ لا يكفي للترحيل، سيتم تركه كحصالة فقط.';
    }
    const formatCurrency = (num) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(num);
    $('#totalRevenueResult').textContent = formatCurrency(totalRevenue);
    $('#totalExpensesResult').textContent = formatCurrency(totalExpenses);
    $('#netRevenueResult').textContent = formatCurrency(netRevenue);
    $('#carriedOverResult').textContent = formatCurrency(carriedOver);
    let cashBoxHtml = `<div class="p-3 rounded-lg flex justify-between bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200 font-bold text-lg">
      <span>المتبقي للدرج (حصالة)</span><span id="cashBoxLeftResult">${formatCurrency(cashBoxLeft)}</span>
    </div>`;
    let msgHtml = carryMsg ? `<div class="p-2 text-center text-primary font-semibold">${carryMsg}</div>` : '';
    $('#shiftResults').classList.remove('hidden');
    $('#shiftResults').innerHTML = `
      <h3 class="font-bold text-xl mb-2">نتائج الوردية</h3>
      <div class="p-3 rounded-lg flex justify-between bg-green-500/10 text-green-500"><span>إجمالي الإيرادات</span><span>${formatCurrency(totalRevenue)}</span></div>
      <div class="p-3 rounded-lg flex justify-between bg-red-500/10 text-red-500"><span>إجمالي المصروفات</span><span>${formatCurrency(totalExpenses)}</span></div>
      <div class="p-3 rounded-lg flex justify-between bg-accent/10 text-accent font-semibold"><span>صافي الوردية</span><span>${formatCurrency(netRevenue)}</span></div>
      <div class="p-3 rounded-lg flex justify-between bg-gray-200 dark:bg-gray-700">
        <span class="font-bold">المبلغ المرحّل لليوم التالي</span><span class="font-bold text-xl">${formatCurrency(carriedOver)}</span>
      </div>
      ${cashBoxHtml}
      ${msgHtml}
      <button type="button" id="printShiftBtn" class="btn bg-accent text-white px-4 py-2 rounded-lg mt-2 transition-all hover:scale-105">طباعة التقرير</button>
    `;
    localStorage.setItem('shiftReport', JSON.stringify({
      totalRevenue, totalExpenses, netRevenue, carriedOver, cashBoxLeft, date: new Date().toLocaleString('ar-EG')
    }));
    setTimeout(() => {
      document.getElementById('printShiftBtn')?.addEventListener('click', () => { window.print(); });
    }, 100);
  });
  // استرجاع بيانات الوردية عند التحميل
  if(localStorage.getItem('shiftReport')) {
    try {
      const r = JSON.parse(localStorage.getItem('shiftReport'));
      const formatCurrency = (num) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(num);
      $('#totalRevenueResult')?.textContent = formatCurrency(r.totalRevenue);
      $('#totalExpensesResult')?.textContent = formatCurrency(r.totalExpenses);
      $('#netRevenueResult')?.textContent = formatCurrency(r.netRevenue);
      $('#carriedOverResult')?.textContent = formatCurrency(r.carriedOver > 0 ? r.carriedOver : 0);
    } catch (error) {
      console.error('خطأ في استرجاع بيانات الوردية:', error);
    }
  }
});
