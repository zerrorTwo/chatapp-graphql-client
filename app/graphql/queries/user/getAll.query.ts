import { gql } from '@apollo/client';

export const FETCH_USER = gql`
    query getAllUser {
        users(filter:{
            itemsPerPage:20
            page:1
        }){
            data{
                id
                username
                email
                phone
            }
            total
            itemsPerPage
            currentPage
        }
    }`;