const { User } = require('../models')
const { GraphQLError } =require('graphql') 
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent, args, { user }) => {
            return await User.findOne({ _id: user._id })
            }
        },

        Mutation: {

            addUser: async (parent, { username, email, password } ) => {
                const user = await User.create({ username, email, password })
                const token = signToken(user)
                return { token, user }
            },
            
            login: async (parent, { email, password }) => {
                const user = await User.findOne({ email })
                if (!user) {
                    throw new GraphQLError('No user found with this email address', {
                        extensions: {
                          code: 'NO_USER_FOUND',
                          http: {
                            status: 404,
                          }
                        },
                      })
                }
                const correctPassword = await user.isCorrectPassword(password)
                
                if (!correctPassword) {
                    throw new GraphQLError('Incorrect Credentials', {
                        extensions: {
                          code: 'INCORRECT_CREDENTIALS',
                          http: {
                            status: 400,
                          }
                        },
                      })
                }
                const token = signToken(user)

                return { token, user }
            },

            saveBook: async (parent, { input }, {user}) => {
                console.log(input, user)
                if (user) {
                    const updatedUser = await User.findByIdAndUpdate(
                        { _id: user._id },
                        { $addToSet: { savedBooks: input } },
                        { new: true }
                    ).populate('savedBooks')

                    return updatedUser
                }
                throw new GraphQLError('Please log in', {
                    extensions: {
                      code: 'LOG_IN_REQUIRED',
                      http: {
                        status: 401,
                      }
                    },
                  })
            },
            
            removeBook: async (parent, { bookId }, { user }) => {
                if (user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks: { bookId: bookId }}},
                    { new: true }
                ).populate('savedBooks')

                return updatedUser
            }
            throw new GraphQLError('Please log in', {
                extensions: {
                  code: 'LOG_IN_REQUIRED',
                  http: {
                    status: 401,
                  }
                },
              })
        },

    },
}

module.exports = resolvers