import gql from 'graphql-tag'

export default gql`
  query monetizations($start: DateTime!, $end: DateTime!) {
    monetizations(start: $start, end: $end) {
      revenue
      game
      date
      country
      format
      os
    }
  }
`