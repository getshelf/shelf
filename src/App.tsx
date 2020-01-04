import { hot } from 'react-hot-loader/root';
import React, { useRef, RefObject, Ref, createContext, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Authenticated } from './components/Authenticated';
import { Sidebar } from './components/Sidebar/Sidebar';
import { NotePage } from './pages/NotePage/NotePage';

import styles from './App.css';
import { RootStoreContext } from '@stores/RootStore';

function App() {
  const rootStore = useContext(RootStoreContext);

  useEffect(() => {
    async function init() {
      await rootStore.userStore.signIn();
      await rootStore.notesStore.fetchNotes();
    }

    init();
  }, []);

  return (
    <Authenticated>
      <Router>
        <main className={styles.root}>
          <aside className={styles.sidebar}>
            <Sidebar />
          </aside>
          <div className={styles.content}>
            <Switch>
              <Route path="/note/:noteId" component={NotePage} />
            </Switch>
          </div>
        </main>
      </Router>
    </Authenticated>
  );
}

export default hot(App);
