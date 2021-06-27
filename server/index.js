const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const { typeDefs } = require("./typeDefs.graphql");

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const prisma = new PrismaClient();

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: async (parent, args, context) => {
      return context.prisma.book.findMany();
    },
    book: async (parent, args, context) => {
      return context.prisma.book.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createBook: async (parent, args, context) => {
      // const book = { title: "Book Title", author: "Book Author" };
      const newBook = context.prisma.book.create({
        data: {
          title: args.title,
          author: args.author,
        },
      });
      return newBook;
    },
    updateBook: async (parent, args, context) => {
      const updatedBook = context.prisma.book.update({
        where: {
          id: args.id,
        },
        data: {
          title: args.title,
          author: args.author,
        },
      });
      return updatedBook;
    },
    deleteBook: async (parent, args, context) => {
      const deletedBook = context.prisma.book.delete({
        where: {
          id: args.id,
        },
      });
      return deletedBook;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers, context: { prisma } });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
