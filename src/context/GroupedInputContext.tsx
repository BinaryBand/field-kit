import React, { Context } from 'react';

const GroupedInputContext: Context<IGroupedInputContext> =
  React.createContext<IGroupedInputContext>(null!);

export default GroupedInputContext;
