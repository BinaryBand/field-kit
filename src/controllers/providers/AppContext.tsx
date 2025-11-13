import React, { Context } from 'react';

const AppContext: Context<IAppContext> = React.createContext<IAppContext>(null!);

export default AppContext;
