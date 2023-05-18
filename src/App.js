import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import loadable from '@loadable/component'
import Gs from './Theme/globalStyles';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { AnimateSharedLayout, AnimatePresence } from "framer-motion";
import { theme } from './Theme/theme';
import LoaderGif from './Assets/images/loading.gif';
import { PrivateRoute } from './views/private.route';
import { PublicRoute } from './views/public.route';

const Header = loadable(() => import('./Component/header'))
const Footer = loadable(() => import('./Component/footer'))
const AuthLayout = loadable(() => import('./layouts/auth.layout'))
const UserLayout = loadable(() => import('./layouts/user.layout'))


const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
const DMainContainer = styled(FlexDiv)`
  width: 100%;
  justify-content: flex-start;
  overflow: hidden;
  flex-wrap: wrap;
  position: relative;
  align-content: flex-start;
  flex-direction: column;
`;
const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 50px auto;
`;


function App() {
  const [isDark, setDarkTheme] = useState(true);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem('avangartAuthToken') ? true : false
  );
  const selectedTheme = theme(isDark);

  function setTheme(flag) {
    setDarkTheme(flag);
  }

  return (
    <Router>
      <ThemeProvider theme={selectedTheme}>
        <AnimateSharedLayout>
          <AnimatePresence>
            <section className='MainBox clearfix'>
              <Gs.GlobalStyle />
              <DMainContainer>
                <Header loggedIn={loggedIn} />
                <Suspense
                  fallback={
                    <LoaderBX>
                      <img src={LoaderGif} alt='' />
                    </LoaderBX>
                  }
                >
                  <Switch>
                    <PrivateRoute
                      path='/user'
                      component={(props) => <UserLayout {...props} />}
                    />
                    <PublicRoute
                      path='/'
                      component={(props) => (
                        <AuthLayout {...props} loggedIn={loggedIn} />
                      )}
                    />
                    {loggedIn ? (
                      <Redirect to='/user' from='/' />
                    ) : (
                      <Redirect from='/user' to='/' />
                    )}
                  </Switch>
                </Suspense>
                <Footer loggedIn={loggedIn} />
              </DMainContainer>
            </section>
          </AnimatePresence>
        </AnimateSharedLayout>
      </ThemeProvider>
    </Router>
  );
}

export default App;
