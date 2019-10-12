import mergeSchema from "../src";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} from "graphql";

test("Basic GraphQL Schema Merge", () => {
  const customSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "RootQueryType",
      fields: {
        health: {
          type: GraphQLString,
          resolve() {
            return "OK";
          }
        }
      }
    }),
    mutation: new GraphQLObjectType({
      name: "RootMutationType",
      fields: {
        sendMessage: {
          type: new GraphQLObjectType({
            name: "sendMessageMutation",
            fields: {
              text: {
                type: GraphQLString
              },
              id: {
                type: GraphQLID
              },
              type: {
                type: GraphQLString
              }
            }
          }),
          args: {
            text: {
              type: GraphQLString
            },
            type: {
              type: GraphQLString
            }
          },
          description: "Send a new message to all",
          async resolve(_, { text, type }) {
            console.log("{ text, type }", { text, type });
            const payload = { id: String(Math.random() * 1000), text, type };
            console.log("send new message!", payload);
            return payload; // { success: true };
          }
        }
      }
    })
  });

  const resultSchema = mergeSchema({ schemas: [customSchema] })

  expect(resultSchema).toMatchSnapshot()

});
