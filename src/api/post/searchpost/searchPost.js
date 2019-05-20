import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    searchPost: async (_, args) => {
      if (args.category === undefined) {
        return  prisma.posts({
          where: {
            OR: [
              { location_starts_with: args.term },
              { caption_starts_with: args.term }
            ]
          }
        })
      }
      else {
        return prisma.posts({
          where: {
            AND: [
              { category: args.category }, {
                OR: [
                  { location_starts_with: args.term },
                  { caption_starts_with: args.term }
                ]
              }
            ]
          }
        })
      }
    }
  }
};