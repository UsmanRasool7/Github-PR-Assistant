import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ReviewList from '../components/ReviewList';

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Reviews Content */}
        <main className="flex-1 ml-64 p-8">
          <ReviewList />
        </main>
      </div>
    </div>
  );
}
