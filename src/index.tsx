import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { store, history } from "./store"

import { Route, Switch } from "react-router-dom"
import { ConnectedRouter } from "react-router-redux"

import App from "./components/App"

ReactDOM.render(
  <Provider store={store as any}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </ConnectedRouter>
  </Provider>,

  document.getElementById("root"),
)
