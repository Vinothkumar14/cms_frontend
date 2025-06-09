import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-amber-500" />
      
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h1>
      
      <p className="mt-3 max-w-md text-lg text-gray-600">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <div className="mt-8">
        <Link to="/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;