import { prisma } from "../../../../generated/prisma-client";

const DELETE = "DELETE";
const EDIT = "EDIT";

export default {
  Mutation: {
    editComment: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { text, id, action } = args;
      const { user } = request;
      const comment = await prisma.$exists.comment({
        id,
        user: { id: user.id }
      });
      console.log(action)
      if (comment) {
        if (action === EDIT) {
          return prisma.updateComment({
            data: { text },
            where: { id }
          });
        } else if (action === DELETE) {
          return prisma.deleteComment({ id });
        }
      } else {
        throw Error("You can't do that");
      }
    }
  }
};