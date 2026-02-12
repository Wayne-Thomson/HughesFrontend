import './App.css'
import { Routes, Route } from "react-router";
import HomePage from './pages/HomePage.jsx';
import CreatePage from './pages/CreatePage.jsx';
import NoteDetailsPage from './pages/NoteDetailsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import VehicleListPage from './pages/VehicleListPage.jsx';
import UsersPage from './pages/UsersPage.jsx';

const App = () =>  {

  return (
    <div className="App" data-theme="forest">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/vehicles" element={<VehicleListPage />} />
        <Route path="/users" element={<UsersPage />} />

        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route path="/create" element={<CreatePage />} /> */}
        {/* <Route path="/note/:id" element={<NoteDetailsPage />} /> */}
      </Routes>
    </div>
  )
}

export default App;