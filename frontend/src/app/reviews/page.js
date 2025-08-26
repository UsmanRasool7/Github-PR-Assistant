import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ReviewsList from '../components/ReviewsList';

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Reviews Content */}
        <main className="flex-1 ml-64">
          <ReviewsList />
        </main>
      </div>
    </div>
  );
}
