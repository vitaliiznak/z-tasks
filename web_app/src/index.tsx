import React from 'react'
import ReactDOM from 'react-dom'
import createEmotion from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { init as consoleOutputHistoryInit } from './consoleOutputHistory'
import App from './App/App'
// import serviceWorker from './serviceWorker'
import './index.css'


const emotionCache = createEmotion({
  key: 'ztasks',
  container: document.body,
  prepend: true
})


consoleOutputHistoryInit()

const ToRenter = (
  <CacheProvider value={emotionCache}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </CacheProvider>
)
ReactDOM.render(
  ToRenter,
  document.getElementById('root'),
)
export default ToRenter
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA
// serviceWorker.unregister()
