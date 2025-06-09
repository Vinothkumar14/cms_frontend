import { useEffect, useState } from 'react';
import { Newspaper, Users, BarChart } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import ContentService from '../../services/content.service';
import { Content, Contentstatuss } from '../../types/content';
import { fetchUserFromApi } from '../../services/user';


const Dashboard = () => {
  const { user } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rolename, setRoleName] = useState<string | null>(null);


  useEffect(() => {
    const fetchContents = async () => {
      try {
        setIsLoading(true);
        const data = await ContentService.getAll();
        setContents(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const fetchRole = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (!storedUser?.id) return;
  
        const updatedUser = await fetchUserFromApi(storedUser.id);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setRoleName(updatedUser.role);
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        setRoleName(null);
      }
    };
  
    fetchRole();
    fetchContents();
  }, []);
  
  const totalContent = contents.length;
  const publishedContent = contents.filter(c => c.statuss === Contentstatuss.PUBLISHED).length;
  const draftContent = contents.filter(c => c.statuss === Contentstatuss.DRAFT).length;

  const roleBasedMessage = () => {
    switch (rolename) {
      case "Super Admin":
        return "As a Super Admin, you have full control over all content. You can create, edit, publish, and manage all aspects of the platform.";
      case "Admin":
        return "As an Admin, you can create and publish content for users to view.";
      case "User":
        return "As a User, you can browse and view all published content.";
      default:
        return "Welcome to the Content Publishing Platform.";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {user?.name}!
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Role Information</h2>
        <p className="text-gray-600">{roleBasedMessage()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Content</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{totalContent}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Newspaper className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Published</p>
                <p className="mt-2 text-3xl font-semibold text-green-600">{publishedContent}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <BarChart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Drafts</p>
                <p className="mt-2 text-3xl font-semibold text-amber-600">{draftContent}</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(rolename === "Admin" || rolename === "Super Admin") && (
            <a 
              href="/content/create" 
              className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <div className="rounded-full bg-indigo-100 p-2 mr-3">
                <Newspaper className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-indigo-900">Create New Content</p>
                <p className="text-sm text-indigo-700">Start writing a new article</p>
              </div>
            </a>
          )}
          
          <a 
            href="/content" 
            className="flex items-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <div className="rounded-full bg-emerald-100 p-2 mr-3">
              <BarChart className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-emerald-900">View Content</p>
              <p className="text-sm text-emerald-700">Browse all available content</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;