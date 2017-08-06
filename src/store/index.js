import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import fetchPonyfill from 'fetch-ponyfill'

const { fetch } = fetchPonyfill()

const SET = payload => ({ type: SET, payload })

const url = process.env.BROWSER ? '' : 'http://localhost:3000'

export const increment = (step = 1) => (dispatch) =>
  fetch(url + '/api', {
    method: 'POST',
    body: JSON.stringify({ step }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.text())
  .then(payload =>
    dispatch(SET(payload))
  )

export const decrement = () => increment(-1)

export const read = () => (dispatch) =>
  fetch(url + '/api')
  .then(response => response.text())
  .then(payload => dispatch(SET(payload)))

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */
function counter(state = process.env.BROWSER ? window.initialState : 0, action) {
  switch (action.type) {
  case SET:
    return action.payload
  default:
    return state
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counter, applyMiddleware(thunk))

export default store
