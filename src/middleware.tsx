import agent from "./agent"
import { Middleware } from "redux"
import { ASYNC_START, ASYNC_END, LOGIN, LOGOUT, REGISTER } from "./constants/actionTypes"

const promiseMiddleware: Middleware = (store: any) => (next) => (action: any): any => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type })

    const currentView = store.getState().viewChangeCounter
    const skipTracking = action.skipTracking

    action.payload.then(
      (res: any) => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        console.log("RESULT", res)
        action.payload = res
        store.dispatch({ type: ASYNC_END, promise: action.payload })
        store.dispatch(action)
      },
      (error: { response: { body: any } }) => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        console.log("ERROR", error)
        action.error = true
        action.payload = error.response.body
        if (!action.skipTracking) {
          store.dispatch({ type: ASYNC_END, promise: action.payload })
        }
        store.dispatch(action)
      },
    )

    return
  }

  next(action)
}

const localStorageMiddleware: Middleware = (store) => (next) => (action: any): any => {
  if (action.type === REGISTER || action.type === LOGIN) {
    if (!action.error) {
      window.localStorage.setItem("jwt", action.payload.user.token)
      agent.setToken(action.payload.user.token)
    }
  } else if (action.type === LOGOUT) {
    window.localStorage.setItem("jwt", "")
    agent.setToken(null)
  }

  next(action)
}

function isPromise(v: Promise<any>) {
  return v && typeof v.then === "function"
}

export { promiseMiddleware, localStorageMiddleware }
