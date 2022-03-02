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
    isLoading: true
  }

  const [state, dispatch] = useReducer(githubReducer, initialState)

  const fetchUsers = async () => {
    const response = await fetch(`${GITHUB_URL}/users`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    })

    const data = await response.json()

    console.log(data)
    // When using useState
    // setUsers(data)
    // setIsLoading(false)

    // When switch to useReducer
    dispatch({
      type: 'GET_USERS',
      payload: data,
    })
  }

  return (
    <GithubContext.Provider value={{ users: state.users, isLoading: state.isLoading, fetchUsers }}>
      {children}
    </GithubContext.Provider>
  )
}

export default GithubContext
