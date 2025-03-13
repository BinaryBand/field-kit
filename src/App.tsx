import { ReactElement } from "react";
import AppContext from "@providers/AppContext";

function App({ children, root }: IAppProps): ReactElement {
  return <AppContext.Provider children={children} value={{ root }} />;
}

export default App;
