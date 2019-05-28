import { prisma } from "../../../../generated/prisma-client";

export default {
  Subscription: {       //실시간
    newMessage: {
      subscribe: (_, args) => {
        const { roomId } = args;
        return prisma.$subscribe
          .message({
            AND: [
              { mutation_in: "CREATED" },
              {
                node: {
                  room: { id: roomId }
                }
              }
            ]
          })
          .node();
      },
      resolve: payload => payload
    }
  }
};