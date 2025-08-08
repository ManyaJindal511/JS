// Sample Data
const items = [
  {
    id: "item1",
    itemName: "Butter Roti",
    rate: 20,
    taxes: [
      { name: "Service Charge", rate: 10, isInPercent: "Y" }
    ],
    category: { categoryId: "C2" }
  },
  {
    id: "item2",
    itemName: "Paneer Butter Masala",
    rate: 150,
    taxes: [
      { name: "Service Charge", rate: 10, isInPercent: "Y" }
    ],
    category: { categoryId: "C1" }
  }
];

const categories = [
  {
    id: "C1",
    categoryName: "Platters",
    superCategory: { superCategoryName: "North Indian", id: "SC1" }
  },
  {
    id: "C2",
    categoryName: "Breads",
    superCategory: { superCategoryName: "North Indian", id: "SC1" }
  }
];

const bill = {
  id: "B1",
  billNumber: 1,
  opentime: "06 Nov 2020 14:19",
  customerName: "CodeQuotient",
  billItems: [
    { id: "item2", quantity: 3, discount: { rate: 10, isInPercent: "Y" } },
    { id: "item1", quantity: 5, discount: { rate: 5, isInPercent: "Y" } }
  ]
};

// Task 1
function generateBillBasic(bill, items) {
  return {
    id: bill.id,
    billNumber: bill.billNumber,
    opentime: bill.opentime,
    customerName: bill.customerName,
    billItems: bill.billItems.map(billItem => {
      const itemInfo = items.find(it => it.id === billItem.id);
      return {
        id: billItem.id,
        name: itemInfo ? itemInfo.itemName : "",
        quantity: billItem.quantity
      };
    })
  };
}

// Task 2
function generateBillDetailed(bill, items, categories) {
  let totalAmount = 0;

  const billItemsDetailed = bill.billItems.map(billItem => {
    const itemInfo = items.find(it => it.id === billItem.id);
    const categoryInfo = categories.find(cat => cat.id === itemInfo.category.categoryId);

    let baseAmount = itemInfo.rate * billItem.quantity;

    // Apply discount
    let discountAmt = billItem.discount.isInPercent === "Y"
      ? (baseAmount * billItem.discount.rate) / 100
      : billItem.discount.rate;

    let afterDiscount = baseAmount - discountAmt;

    // Apply taxes
    let taxTotal = 0;
    itemInfo.taxes.forEach(tax => {
      if (tax.isInPercent === "Y") {
        taxTotal += (afterDiscount * tax.rate) / 100;
      } else {
        taxTotal += tax.rate;
      }
    });

    let finalAmount = afterDiscount + taxTotal;
    totalAmount += finalAmount;

    return {
      id: billItem.id,
      name: itemInfo.itemName,
      quantity: billItem.quantity,
      discount: billItem.discount,
      taxes: itemInfo.taxes,
      amount: finalAmount,
      superCategoryName: categoryInfo ? categoryInfo.superCategory.superCategoryName : "",
      categoryName: categoryInfo ? categoryInfo.categoryName : ""
    };
  });

  return {
    id: bill.id,
    billNumber: bill.billNumber,
    opentime: bill.opentime,
    customerName: bill.customerName,
    billItems: billItemsDetailed,
    "Total Amount": totalAmount
  };
}

// --- Example Usage ---
console.log("Task 1 Output:");
console.log(JSON.stringify(generateBillBasic(bill, items), null, 2));

console.log("\nTask 2 Output:");
console.log(JSON.stringify(generateBillDetailed(bill, items, categories), null, 2));
