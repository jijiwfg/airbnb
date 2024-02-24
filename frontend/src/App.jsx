import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import CreateListing from './pages/createListing';
import HostedListing from './pages/HostedListing';
import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute';
import EditListing from './pages/EditListing';
import ShowListing from './pages/showListing';
import ShowHostedListing from './pages/showHostedListing';

function App () {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Header></Header>
          <div className='content' style={ { paddingTop: '30px', paddingLeft: '10%', paddingRight: '10%' } }>
            <Switch>
              <Route exact path="/" component={ Home } />
              <Route exact path="/register" component={ Register } />
              <PublicRoute path="/login" component={ Login } />
              <PrivateRoute path="/createListing" component={ CreateListing } />
              <Route path="/editListing/:id">
                <EditListing />
              </Route>
              <Route path="/showListing/:id">
                <ShowListing />
              </Route>
              <Route path="/showHostedListing/:id">
                <ShowHostedListing />
              </Route>
              <PrivateRoute path="/hostedListing" component={ HostedListing } />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
