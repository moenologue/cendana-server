import { Decimal } from '@prisma/client/runtime';
import {
  Order,
  StockItem
} from '@prisma/client';

export function calculateTotal(order: Order, stockItems: StockItem[]) {
  // SUB_TOTAL
  const subTotal = stockItems
    .map(x => x.buyPrice.mul(x.quantity))
    .reduce((a, b) => a.plus(b), new Decimal('0'));

    // TOTAL
  const totalPlusShipping = subTotal.plus(order.shipping);
  const totalPlusShippingAndTax = totalPlusShipping.plus(totalPlusShipping.mul(order.tax));
  const total = totalPlusShippingAndTax;
  
  // GRAND TOTAL
  const itemsDiscountedTotal = stockItems
    .map(si => {
      const totalItemPrice = si.buyPrice.mul(si.quantity)
      const discountedTotalItemPrice = totalItemPrice.mul(si.discount)
      const totalMinusDiscount = totalItemPrice.sub(discountedTotalItemPrice)
      return totalMinusDiscount
    })
    .reduce((a, b) => a.plus(b), new Decimal('0'));
  const taxedItemsDiscounted = itemsDiscountedTotal.sub( itemsDiscountedTotal.mul(order.tax) );
  const itemsDiscountedPlusShipping = taxedItemsDiscounted.plus(order.shipping);
  const grandTotal = itemsDiscountedPlusShipping;

  return {
    total,
    subTotal,
    grandTotal
  }
}