import React, { Context } from 'react';

const SelectInputContext: Context<ISelectInputContext> = React.createContext<ISelectInputContext>(
  null!
);

export default SelectInputContext;
