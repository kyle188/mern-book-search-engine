const { User } = require('../models')
const { AuthenticationError } = require('@apollo-server-express')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent, args, { user }) => {
            return await User.findOne({ _id: user._id })
            }
        },

        Mutation: {

            createUser: async (parent, { username, email, password } ) => {
                const user = await User.create({ username, email, password })
                const token = signToken(user)
                return { token, user }
            },
            
            login: async (parent, { email, password }) => {
                const user = await User.findOne({ email })
                if (!user) {
                    throw new AuthenticationError('No user found with this email address')
                }
                const correctPassword = await user.isCorrectPassword(password)
                
                if (!correctPassword) {
                    throw new AuthenticationError('Incorrect credentials')
                }
                const token = signToken(user)

                return { token, user }
            },

            saveBook: async (parent, { input }, {user}) => {
                if (user) {
                    const updatedUser = await User.findByIdAndUpdate(
                        { _id: user._id },
                        { $addToSet: { savedBooks: input } },
                        { new: true }
                    ).populate('savedBooks')

                    return updatedUser
                }
                throw new AuthenticationError('Please log in')
            },
            
            removeBook: async (parent, { bookId }, { user }) => {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: user.id },
                    { $pull: { savedBooks: { bookId: bookId }}},
                    { new: true }
                ).populate('savedBooks')

                return updatedUser
            }
            throw new AuthenticationError('Please log in')
        },

    },
}

module.exports = resolvers