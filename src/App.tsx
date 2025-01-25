import React, { useState } from "react";
import * as Components from './components'

const App: React.FC = () => {
  const [selectedPage,setSelectedPage] = useState('')

  return (
    <div className="">
      <Components.EmployeeListCard />
    </div>
  );
};

export default App;