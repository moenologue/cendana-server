"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotal = void 0;
var runtime_1 = require("@prisma/client/runtime");
function calculateTotal(order, orderItems) {
    // SUB_TOTAL
    var subTotal = orderItems
        .map(function (x) { return x.sellPrice.mul(x.quantity); })
        .reduce(function (a, b) { return a.plus(b); }, new runtime_1.Decimal('0'));
    // TOTAL
    var tax = new runtime_1.Decimal(order.tax / 100);
    var totalPlusShipping = subTotal.plus(order.shipping);
    var totalPlusShippingAndTax = totalPlusShipping.plus(totalPlusShipping.mul(tax));
    var total = totalPlusShippingAndTax;
    // GRAND TOTAL
    var itemsDiscountedTotal = orderItems
        .map(function (si) {
        var discount = new runtime_1.Decimal(si.discount).div(100);
        var totalItemPrice = si.sellPrice.mul(si.quantity);
        var discountedTotalItemPrice = totalItemPrice.mul(discount);
        var totalMinusDiscount = totalItemPrice.sub(discountedTotalItemPrice);
        return totalMinusDiscount;
    })
        .reduce(function (a, b) { return a.plus(b); }, new runtime_1.Decimal('0'));
    var taxedItemsDiscounted = itemsDiscountedTotal.plus(itemsDiscountedTotal.mul(tax));
    var itemsDiscountedPlusShipping = taxedItemsDiscounted.plus(order.shipping);
    var grandTotal = itemsDiscountedPlusShipping;
    return {
        total: total,
        subTotal: subTotal,
        grandTotal: grandTotal
    };
}
exports.calculateTotal = calculateTotal;
