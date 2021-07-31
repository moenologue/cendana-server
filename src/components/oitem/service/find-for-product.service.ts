import { prisma } from '@cend/commons/prisma';
import { OrderItem } from '@prisma/client';
import { FindResult, FindOptions } from '@cend/commons/find';

export async function findForProduct(productId: number, options: FindOptions.Marker) {
  const totalData = await prisma.orderItem.count({
    where: {
      productId
    }
  });
  const perPage = options.perPage == -1 ? totalData : options.perPage;
  const offset = options.page * perPage;
  const totalPage = perPage == totalData ? 1 : Math.ceil(totalData / perPage);
  const items = await prisma.orderItem.findMany({
    where: {
      productId
    },
    include: {
      order: {
        include: {
          targetUser: true
        }
      }
    }
  });
  return {
    totalPage,
    totalData,
    items
  };
}