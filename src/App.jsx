import './App.css'
import { Routes, Route } from "react-router";
import LoginPage from './pages/LoginPage.jsx';
import VehicleListPage from './pages/VehicleListPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import RemovedVehicleList from './pages/RemovedVehicleList.jsx';

const App = () =>  {

  return (
    <div className="App" data-theme="forest">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/vehicles" element={<VehicleListPage />} />
        <Route path="/deleted" element={<RemovedVehicleList />} />
        <Route path="/users" element={<UsersPage />} />

        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route path="/create" element={<CreatePage />} /> */}
        {/* <Route path="/note/:id" element={<NoteDetailsPage />} /> */}
      </Routes>
    </div>
  )
}

export default App;