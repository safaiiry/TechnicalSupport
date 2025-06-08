import { z } from 'zod'
import { protectedProcedure, router } from '../../lib/trpc'

export const ticketAttachmentsTrpcRoute = router({
  upload: protectedProcedure
    .input(
      z.object({
        ticketId: z.string().uuid(),
        fileName: z.string(),
        fileData: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.prisma.ticket.findUnique({
        where: { id: input.ticketId },
        select: { user_id: true },
      })
      if (!ticket) {
        throw new Error('NOT_FOUND')
      }
      if (ctx.user!.id !== ticket.user_id) {
        throw new Error('FORBIDDEN')
      }
      const attachment = await ctx.prisma.attachment.create({
        data: {
          ticket_id: input.ticketId,
          file_name: input.fileName,
          file_url: input.fileData,
        },
      })
      return { attachment }
    }),
  delete: protectedProcedure.input(z.object({ attachmentId: z.string().uuid() })).mutation(async ({ ctx, input }) => {
    const attachment = await ctx.prisma.attachment.findUnique({
      where: { id: input.attachmentId },
      include: { ticket: { select: { user_id: true } } },
    })
    if (!attachment) {
      throw new Error('NOT_FOUND')
    }
    if (attachment.ticket.user_id !== ctx.user!.id) {
      throw new Error('FORBIDDEN')
    }
    await ctx.prisma.attachment.delete({ where: { id: input.attachmentId } })
    return { success: true }
  }),
})
