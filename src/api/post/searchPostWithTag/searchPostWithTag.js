import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    searchPostWithTag: async (_, args) =>
      prisma.posts({
        where:           
            { tags_some:{
                name: args.tag
            }       
      }
    })
  }
};