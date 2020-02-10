import React from 'react';

import Setup from '../../setup';

import { StoreContext } from '../../datastore-context';

export default function Default() {
  const { store, setStore } = React.useContext(StoreContext);

  // Set defaults for the 388th
  React.useEffect(() => {
    const { theme } = store;
    theme.template = 'default';
    setStore(prev => ({ ...prev, theme }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Setup />;
}
