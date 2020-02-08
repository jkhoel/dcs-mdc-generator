import React from 'react';
import PropTypes from 'prop-types';

import defaultStore from '../../data/test-mission.json';

export const StoreContext = React.createContext({
  store: defaultStore,
  setStore: () => null,
  updateStore: () => null
});

export const StoreConsumer = StoreContext.Consumer;

export function StoreProvider({ children }) {
  const [store, setStore] = React.useState(defaultStore);

  return (
    <StoreContext.Provider value={{ store, setStore }}>
      {children}
    </StoreContext.Provider>
  );
}

StoreContext.propTypes = {
  children: PropTypes.any
};

StoreContext.defaultProps = {
  children: {}
};
