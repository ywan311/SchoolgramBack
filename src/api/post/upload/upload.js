import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    upload: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const tmp = args.caption.split('#');
      const tags =[];
       tmp.slice(1).forEach(
        x =>{
          if(x.includes(" ")){
            return tags.push(x.slice(0,x.indexOf(" ")))
          }else{
            return tags.push(x);
          }
        }
      );

      const { caption, location, files,category} = args;
      const post = await prisma.createPost({
        caption,
        location,
        category,
        user: { connect: { id: user.id } }
      });
      files.forEach(
        async file =>
          await prisma.createFile({
            url: file,
            post: {
              connect: {
                id: post.id
              }
            }
          })
      );
      tags.forEach(
        async tag => {
          if (await prisma.$exists.tag({
            name: tag
          })) {
            await prisma.upsertTag({
              where: { name: tag },
              create:{
                name:tag,
                post: {
                  connect: {
                    id: post.id
                  }
                }
              }          
              ,
              update: {
                post: {
                  connect: {
                    id: post.id

                  }
                }
              }
            })
          }
          else {
            await prisma.createTag({
              name: tag,
              post: {
                connect: {
                  id: post.id
                }
              }
            })
          }
        }
      );

      return post;
    }
  }
};