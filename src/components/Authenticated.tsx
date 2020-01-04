import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { RootStoreContext } from 'src/stores/RootStore';

interface IProps {
  children: React.ReactElement
}

export const Authenticated = observer((props: IProps) => {
  const rootStore = useContext(RootStoreContext);

  return (
    rootStore.userStore.isAuthenticated 
    ? <div>{props.children}</div>
    : <div>Not signed in</div>
  )
})
