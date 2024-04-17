'use strict';
const fs = require('fs');

function readTransactions(path) {
  const data = fs.readFileSync(path);

  const array = data.toString().trim().split('\n');

  return array.map((element) => {
    const item = element.split(';');

    let category = '';
    let amount = 0;
    const description = item[0];
    const date = new Date(item[1]);

    category += item[2];
    amount += parseFloat(item[3]);

    if (category.includes(',')) {
      const sanitizedItem = category.split(',');
      category = sanitizedItem[0];
      amount = parseFloat(sanitizedItem[1]);
    }

    return {
      description,
      amount,
      date,
      category,
    }
  });
}

function totalSpentPerCategory(transactions) {
  const spentPerCategory = {};

  for (let i = 0; i < transactions.length; i++) {
    const category = transactions[i].category;
    const amount = transactions[i].amount;

    if (category !== 'Incomes') {
      if (category in spentPerCategory) {
        spentPerCategory[category] += amount;
      } else {
        spentPerCategory[category] = amount;
      }
    }
  }
  return spentPerCategory;
}

function totalSpentPerMonth(transactions) {
  const spentPerMonth = {};

  for (let i = 0; i < transactions.length; i++) {
    const year = transactions[i].date.getFullYear();
    const month = transactions[i].date.getMonth();
    const amount = transactions[i].amount;

    const monthName = convertToMonthName(month + 1);

    if (amount < 0) {
      if (year in spentPerMonth) {
        if (monthName in spentPerMonth[year]) {
          spentPerMonth[year][monthName] += amount;
        } else {
          spentPerMonth[year][monthName] = amount;
        }
      } else {
        spentPerMonth[year] = { [monthName]: amount };
      }
    }
  }

  return spentPerMonth;
}

function spentPerMonthOnAverage(transactions) {
  let total = 0;
  let totalOfMonths = 0;
  const spentPerMonth = totalSpentPerMonth(transactions);

  for (const year in spentPerMonth) {
    for (const month in spentPerMonth[year]) {
      total += spentPerMonth[year][month];
      totalOfMonths++;
    }
  }

  const spentOnAverage = total / totalOfMonths;
  return spentOnAverage.toFixed(2);
}

function totalSpentPerMonthPerCategory(transactions) {
  const result = {};

  for (let i = 0; i < transactions.length; i++) {
    const year = transactions[i].date.getFullYear();
    const month = transactions[i].date.getMonth();
    const amount = transactions[i].amount;
    const category = transactions[i].category;

    const monthName = convertToMonthName(month + 1);
    const monthKey = `${monthName} ${year}`;

    if (amount < 0) {
      if (!(monthKey in result)) {
        result[monthKey] = {}
      }

      if (!(category in result[monthKey])) {
        result[monthKey][category] = 0;
      }

      result[monthKey][category] += amount;
    }

  }

  return result;
}

function convertToMonthName(number) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[number - 1];
}

const transactions = readTransactions('transactions.txt');
console.log(transactions);

const totalPerCategory = totalSpentPerCategory(transactions);
console.log('Total spent per category:', totalPerCategory);

const totalPerMonth = totalSpentPerMonth(transactions);
console.log('Total spent per month:', totalPerMonth);

const totalPerMonthOnAverage = spentPerMonthOnAverage(transactions);
console.log('Total spent per month on average:', totalPerMonthOnAverage);

const spentPerMonthPerCategory = totalSpentPerMonthPerCategory(transactions);
console.log('Total spent per month per category', spentPerMonthPerCategory);
