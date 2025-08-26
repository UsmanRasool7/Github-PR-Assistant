import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Dashboard */}
        <main className="flex-1 ml-64">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}
