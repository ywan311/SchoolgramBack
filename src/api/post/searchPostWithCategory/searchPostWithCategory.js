import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    searchPostWithCategory: async (_, args) =>
      prisma.posts({
        where:           
            { category: args.category}       
      })
  }
};