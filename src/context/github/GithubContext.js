import { createContext, useReducer } from 'react'
import githubReducer from './GithubReducer'

const GithubContext = createContext()

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

export const GithubProvider = ({ children }) => {
  // When using useState
  // const [users, setUsers] = useState([])
  // const [isLoading, setIsLoading] = useState(true)

  // When switch to useReducer
  const initialState = {
    users: [],
    user: {},
    repos: [],
    isLoading: false,
  }

  const [state, dispatch] = useReducer(githubReducer, initialState)

  // Set loading
  const setLoading = () => dispatch({ type: 'SET_LOADING' })

  // Clear search results from state
  const clearUsers = () => {
    dispatch({
      type: 'CLEAR_USERS',
    })
  }

  // Get search results (moved to GithubActions.js)
  // const searchUsers = async (text) => {
  //   setLoading()

  //   const params = new URLSearchParams({
  //     q: text,
  //   })

  //   const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
  //     headers: {
  //       Authorization: `token ${GITHUB_TOKEN}`,
  //     },
  //   })

  //   const { items } = await response.json() // from Github API

  //   dispatch({
  //     type: 'GET_USERS',
  //     payload: items,
  //   })
  // }

  // Get single user
  const getUser = async (login) => {
    setLoading()

    const response = await fetch(`${GITHUB_URL}/users/${login}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    })

    if (response.status === 404) {
      window.location = '/notfound'
    } else {
      const data = await response.json() // from Github API

      dispatch({
        type: 'GET_USER',
        payload: data,
      })
    }
  }

  // Get user repos
  const getUserRepos = async (login) => {
    setLoading()

    const params = new URLSearchParams({
      sort: 'created',
      per_page: 10,
    })

    const response = await fetch(
      `${GITHUB_URL}/users/${login}/repos?${params}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    )

    const data = await response.json()

    dispatch({
      type: 'GET_REPOS',
      payload: data,
    })
  }

  // Get initial users (testing purposes)
  // const fetchUsers = async () => {
  //   setLoading()

  //   const response = await fetch(`${GITHUB_URL}/users`, {
  //     headers: {
  //       Authorization: `token ${GITHUB_TOKEN}`,
  //     },
  //   })

  //   const data = await response.json()

  //   console.log(data)
  //   // When using useState
  //   // setUsers(data)
  //   // setIsLoading(false)

  //   // When switch to useReducer
  //   dispatch({
  //     type: 'GET_USERS',
  //     payload: data,
  //   })
  // }

  return (
    <GithubContext.Provider
      value={{
        ...state,
        dispatch,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export default GithubContext
