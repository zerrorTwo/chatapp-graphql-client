'use client';

import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '@/app/graphql/queries/user/getById.query';
import { SET_REFRESH_TOKEN_MUTATION } from '@/app/graphql/mutations/setRefreshToken.mutation';
import { useEffect } from 'react';

const HomePage = () => {
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: {
      id: 5,
    },
  });
  const [setRefreshToken, { data: hihi }] = useMutation(SET_REFRESH_TOKEN_MUTATION);

  useEffect(() => {
    // Gọi mutation khi component mount
    setRefreshToken();
  }, []);

  useEffect(() => {
    console.log('Mutation result:', hihi);  // Sau khi gọi xong sẽ có dữ liệu
  }, [hihi]);


  console.log(data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const users = data?.users?.data || [];
  const { total, itemsPerPage, currentPage } = data?.users || {};

  return (
    <div>
      <h1>Home Page</h1>
      <h2>Users List</h2>
      <ul>
        {users.map((user: { id: string; username: string; email: string; phone: string }) => (
          <li key={user.id}>
            {user.username} ({user.email}, {user.phone})
          </li>
        ))}
      </ul>
      <p>Total: {total}</p>
      <p>Items per page: {itemsPerPage}</p>
      <p>Current page: {currentPage}</p>
    </div>
  );
};

export default HomePage;