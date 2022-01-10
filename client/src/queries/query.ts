import { gql  } from '@apollo/client'

export const ALL_USERS = gql`
query {
  allUsers {
    username
    name
    id
  }
}
`
  
export const ALL_BOOKS = gql`
query {
  allBooks {
      title
      author {
        name
        born
      }
      published
      genres
    }
}
`

export const BOOKS_BY_GENRE = gql`
query findBooksByGenre($genreToSearch: String, $authorToSearch: String, $byBackUser: Boolean ) {
  allBooks(author: $authorToSearch, genre: $genreToSearch, byUserFavoriteGenre: $byBackUser ) {
      title
      author {
        name
        born
      }
      published
    }
}
`

export const ALL_BOOKS_AND_AUTHORS = gql`
  query {
    allBooks {
      title
      author {
        name
        born
      }
      published
    }
}
`
export const ME = gql`
  query {
        me {
            username
            name
          }
 }

`