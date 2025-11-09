import prisma from '../prismaClient.js';

// returns number available for given equipmentId and date range
export async function getAvailableQuantity(equipmentId: number, startDate: Date, endDate: Date) {
  const agg = await prisma.loanRequest.aggregate({
    _sum: { quantity: true },
    where: {
      equipmentId,
      status: 'APPROVED',
      AND: [
        { startDate: { lte: endDate } },
        { endDate: { gte: startDate } }
      ]
    }
  });
  const reserved = agg._sum.quantity || 0;
  const equipment = await prisma.equipment.findUnique({ where: { id: equipmentId }});
  const total = equipment?.totalQty || 0;
  return total - reserved;
}
