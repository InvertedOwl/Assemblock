import './App.css'
import { Nav } from './components/Nav.jsx';
import { ScriptPage } from './ScriptPage.jsx';
import { ExplorePage } from './ExplorePage.jsx';
import { Route, Routes } from 'react-router-dom';
import { CollectionPage } from './CollectionPage.jsx';
import { ProfilePage } from './ProfilePage.jsx';
function App() {
 
  return (
    <div className="app">
      <Nav/>
      <Routes>
        <Route path="/" element={<ScriptPage/>}/>
        <Route path="/shared-scripts/" element={<ExplorePage/>}/>
        <Route path="/favorites/" element={<CollectionPage/>}/>
        <Route path="/profile/" element={<ProfilePage/>}/>
      </Routes>
    </div>
  )
}

export default App
