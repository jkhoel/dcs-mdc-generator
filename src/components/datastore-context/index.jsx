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

  // React.useEffect(() => {
  //   getStoreData();
  // }, []);

  // const compareObjectKeys = (a, b) => {
  //   var aKeys = Object.keys(a).sort();
  //   var bKeys = Object.keys(b).sort();
  //   return JSON.stringify(aKeys) === JSON.stringify(bKeys);
  // };

  // const getStoreData = () => {
  //   console.log('STORE - getStoreData()');

  //   window.appData.getStore().then((appData) => {
  //     // If the store-object contains the same keys as our defaultStore object - set our store state to that data
  //     if (compareObjectKeys(defaultStore, appData)) {
  //       setStore((prevState) => ({ ...prevState, ...appData }));
  //     } else {
  //       // ... if it is not, we need to initialize our default store
  //       setStore(defaultStore);
  //     }
  //   });
  // };

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
