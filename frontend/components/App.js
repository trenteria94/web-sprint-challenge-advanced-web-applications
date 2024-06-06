import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    localStorage.removeItem('token')
    redirectToLogin()
    setMessage('Goodbye!')
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = async ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const { data } = await axios.post(
        loginUrl,
        { username, password }
      )
    localStorage.setItem('token', data.token)
    setMessage(data.message)
    redirectToArticles()
    setSpinnerOn(false)
    }
    catch(err) {
      console.log(err)
      redirectToLogin()
    }

    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      logout()
    } else {
    setMessage('')
    setSpinnerOn(true)
    try {
      const response  = await axios.get(
        articlesUrl,
      { headers: { Authorization: token } }
    );
      setArticles(response.data.articles)
      setMessage(response.data.message)
      setSpinnerOn(false)
    }  
   
    
    catch(err) {
      console.log(err.data)
      setSpinnerOn(false)
      redirectToLogin()
      
    }
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }
}

  const postArticle = async ({ title, text, topic }) => {
    
    const token = localStorage.getItem('token')
    if (!token) {
      logout()
    } else {
    setMessage('')
    setSpinnerOn(true)
    try {
      const  data  = await axios.post(
        articlesUrl,
        { title, text, topic },
      { headers: { Authorization: token } }
    );
      setArticles(articles.concat(data.data.article))
      setSpinnerOn(false)
      setMessage(data.data.message)
      
      
      
      setCurrentArticleId(null)
    }
    
    catch(err) {
      console.log(err.data)
      setSpinnerOn(false)
      redirectToLogin()
      
    }
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }
}
  

  const updateArticle = async ({ article_id, title, text, topic }) => {
    const token = localStorage.getItem('token')
    if (!token) {
      logout()
    } else {
    setMessage('')
    setSpinnerOn(true)
    try {
      const { data } = await axios.put(
        `http://localhost:9000/api/articles/${article_id}`,
        { title, text, topic },
      { headers: { Authorization: token } }
    );
      setMessage(data.message)
      getArticles()
      setCurrentArticleId(null)
    }
    
    catch(err) {
      setSpinnerOn(false)
      redirectToLogin()
    }
    // ✨ implement
    // You got this!
  }
  }
  const deleteArticle = async article_id => {
    const token = localStorage.getItem('token')
    // ✨ implement
    setMessage('')
    setSpinnerOn(true)
    try {
      const { data } = await axios.delete(`http://localhost:9000/api/articles/${article_id}`,
      { headers: { Authorization: token } }
      )
      setMessage(data.message)
      setSpinnerOn(false)
      setArticles(data.articles)
      getArticles()
    }
    catch(err) {
      console.log(err.data.message)
      redirectToLogin()
    }
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner 
      on={spinnerOn}
      />
      <Message 
      message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
              postArticle={postArticle}
              currentArticle={currentArticleId && articles.find(art => art.article_id == currentArticleId)}
              updateArticle={updateArticle}
              setCurrentArticleId={setCurrentArticleId}
              reset={() => setCurrentArticleId(null)}
              />
              <Articles 
              getArticles={getArticles}
              articles={articles && articles}
              deleteArticle={deleteArticle}
              setCurrentArticleId={setCurrentArticleId}
              currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
