import { gql } from "@apollo/client"

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            _id
            username
        }
    }
  }
`;

export const ADD_USER = gql`
mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        token
        user {
            _id
            username
            email
            bookCount
            savedBooks {
                authors
                bookId
                image
                title
                description
                link
            }
        }
    }
}`

export const SAVE_BOOK = gql`
mutation saveBook($newBook: InputBook!) {
    saveBook(newBook: $newBook) {
        _id
        username
        email
        savedBooks {
            authors
            bookId
            image
            title
            description
            link
            }
        }
    }
}`

export const REMOVE_BOOK = gql`
mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
        _id
        username
        email
        authors
        bookId
        savedBooks {
            image
            title
            description
            link
            }
        }
    }
}`