import React, { Context } from 'react';

const appContext: Context<IAppContext> = React.createContext<IAppContext>(undefined!);

export default appContext;
