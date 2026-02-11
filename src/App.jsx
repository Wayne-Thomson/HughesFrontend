import './App.css'
import { Routes, Route } from "react-router";
import HomePage from './pages/HomePage.jsx';
import CreatePage from './pages/CreatePage.jsx';
import NoteDetailsPage from './pages/NoteDetailsPage.jsx';

const App = () =>  {

  return (
    <div className="App" data-theme="forest">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailsPage />} />
      </Routes>
    </div>
  )
}

export default App;