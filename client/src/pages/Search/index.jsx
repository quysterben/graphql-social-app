import { Box, Flex } from '@chakra-ui/react';
import Navbar from '../../components/Navbar';
import SearchFilter from '../../components/SearchFilter';
import RightSideBar from '../../components/HomePage/RightSideBar';
import Loader from '../../components/Loader';

import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { gql, useQuery } from '@apollo/client';
import Post from '../../components/Post';
import User from '../../components/User';
const SEARCH_USERS_QUERY = gql`
  query SearchUsers($searchQuery: String!) {
    searchUsers(searchQuery: $searchQuery) {
      id
      name
      email
      dateOfBirth
      from
      avatar
      wallpaper
      isOnline
      createdAt
    }
  }
`;
const SEARCH_FRIENDS_QUERY = gql`
  query SearchFriends($searchQuery: String!) {
    searchFriends(searchQuery: $searchQuery) {
      id
      name
      email
      dateOfBirth
      from
      avatar
      wallpaper
      isOnline
      createdAt
    }
  }
`;
const SEARCH_POSTS_QUERY = gql`
  query SearchPosts($searchQuery: String!) {
    searchPosts(searchQuery: $searchQuery) {
      id
      content
      author {
        id
        name
        avatar
      }
      likes {
        id
        postId
        user {
          id
          name
          email
          avatar
          wallpaper
        }
        createdAt
      }
      comments {
        id
        content
        author {
          id
          name
          avatar
        }
        childrenComments {
          author {
            avatar
            id
            name
          }
          content
          createdAt
          id
        }
        parentId
        createdAt
      }
      createdAt
      images {
        id
        imageUrl
      }
    }
  }
`;

export default function Search() {
  const location = useLocation();

  const [searchFilter, setSearchFilter] = useState('all');
  const handleSetSearchFilter = (filter) => {
    setSearchFilter(filter);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      setUserData(await JSON.parse(localStorage.getItem('user')));
      setIsLoading(false);
    };

    fetchData().catch(console.error);
  }, []);

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError
  } = useQuery(SEARCH_USERS_QUERY, {
    variables: { searchQuery: location.state.searchQuery }
  });
  const {
    data: friendsData,
    loading: friendsLoading,
    error: friendsError
  } = useQuery(SEARCH_FRIENDS_QUERY, {
    variables: { searchQuery: location.state.searchQuery }
  });
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError
  } = useQuery(SEARCH_POSTS_QUERY, {
    variables: { searchQuery: location.state.searchQuery }
  });

  if (usersError || friendsError || postsError) return <p>Error</p>;

  return (
    <Box h="100vh" overflowY="auto" bg="gray.100">
      <Navbar searchQueryString={location.state.searchQuery} />
      <SearchFilter handleSetSearchFilter={handleSetSearchFilter} searchFilter={searchFilter} />
      <RightSideBar />
      <Flex
        mt={16}
        flexDirection="column"
        w="40%"
        mx="auto"
        maxH={682}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px'
          },
          '&::-webkit-scrollbar-track': {
            width: '6px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'green',
            borderRadius: '24px'
          }
        }}>
        {usersLoading || friendsLoading || postsLoading || isLoading ? (
          <Flex h="400" alignItems="center" justifyContent="center" marginTop={32}>
            <Loader />
          </Flex>
        ) : (
          <Flex alignItems="center" flexDirection="column" gap={2}>
            {searchFilter == 'posts' ? (
              postsData.searchPosts.map((post, index) => (
                <Post key={index} postData={post} userData={userData} />
              ))
            ) : searchFilter == 'users' ? (
              usersData.searchUsers.map((user, index) => (
                <User key={index} userData={user} currentUserData={userData} />
              ))
            ) : searchFilter == 'friends' ? (
              friendsData.searchFriends.map((user, index) => (
                <User key={index} userData={user} currentUserData={userData} />
              ))
            ) : searchFilter == 'all' ? (
              <>
                {postsData.searchPosts.map((post, index) => (
                  <Post key={index} postData={post} userData={userData} />
                ))}
                {usersData.searchUsers.map((user, index) => (
                  <User key={index} userData={user} currentUserData={userData} />
                ))}
              </>
            ) : null}
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
