import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, FilePlus, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Content, Contentstatuss } from '../../types/content';
import ContentService from '../../services/content.service';
// import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import  fetchUserWithRole  from '../../services/user'; // ✅ Import here

const ContentList = () => {
  // const { user } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [rolename, setRoleName] = useState<string | null>(null);


  // const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  // const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  const isAdmin ="Admin";
  const isSuperAdmin = "Super Admin";

  useEffect(() => {
    fetchContents();
    fetchRole();

  }, []);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      const data = await ContentService.getAll();
      setContents(data);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };
  const fetchRole  = async () => {
    try {
      await fetchUserWithRole.updateLocalUserFromApi();
      setRoleName(localStorage.getItem('user'));
      console.log(rolename);
    } catch (error) {
      console.error('Failed to fetch user role:', error);
    } finally {
      setRoleName(null);
    }
  };


  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await ContentService.delete(id);
      setContents(contents.filter(content => content.id !== id));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePublishToggle = async (content: Content) => {
    try {
      setPublishingId(content.id);
      const newstatuss = content.statuss === Contentstatuss.PUBLISHED 
        ? Contentstatuss.DRAFT 
        : Contentstatuss.PUBLISHED;
        
      const updatedContent = await ContentService.publish({
        id: content.id,
        statuss: newstatuss
      });
      
      setContents(contents.map(c => 
        c.id === updatedContent.id ? updatedContent : c
      ));
      
      toast.success(`Content ${newstatuss === Contentstatuss.PUBLISHED ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Error toggling publish statuss:', error);
      toast.error('Failed to update publish statuss');
    } finally {
      setPublishingId(null);
    }
  };

  const renderstatussBadge = (statuss: Contentstatuss) => {
    const colors = {
      [Contentstatuss.PUBLISHED]: 'bg-green-100 text-green-800',
      [Contentstatuss.DRAFT]: 'bg-amber-100 text-amber-800',
    };

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[statuss]}`}>
        {statuss === Contentstatuss.PUBLISHED ? 'Published' : 'Draft'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Content List</h1>
          {isAdmin && (
            <Link to="/content/create">
              <Button variant="primary" leftIcon={<FilePlus className="h-5 w-5" />}>
                Create Content
              </Button>
            </Link>
          )}
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No content found</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no content items available yet.
          </p>
          {isAdmin && (
            <div className="mt-6">
              <Link to="/content/create">
                <Button variant="primary" leftIcon={<FilePlus className="h-5 w-5" />}>
                  Create Your First Content
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Content List</h1>
        {isAdmin && (
          <Link to="/content/create">
            <Button variant="primary" leftIcon={<FilePlus className="h-5 w-5" />}>
              Create Content
            </Button>
          </Link>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contents.map((content) => (
          <Card key={content.id} className="flex flex-col">
            <CardContent className="flex flex-1 flex-col p-4">
              <div className="mb-4 flex items-center justify-between">
                {renderstatussBadge(content.statuss)}
                <span className="text-xs text-gray-500">
                  By {content.authorName}
                </span>
              </div>
              
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{content.title}</h3>
              <p className="mb-4 flex-1 text-sm text-gray-600 line-clamp-3">
                {content.description}
              </p>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {new Date(content.updatedAt).toLocaleDateString()}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Eye className="h-4 w-4" />}
                    title="View Content"
                  >
                    View
                  </Button>
                  
                  {isSuperAdmin && (
                    <Link to={`/content/edit/${content.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Edit className="h-4 w-4" />}
                        title="Edit Content"
                      >
                        Edit
                      </Button>
                    </Link>
                  )}
                  
                  {isAdmin && (
                    <Button
                      variant={content.statuss === Contentstatuss.PUBLISHED ? "warning" : "success"}
                      size="sm"
                      onClick={() => handlePublishToggle(content)}
                      isLoading={publishingId === content.id}
                    >
                      {content.statuss === Contentstatuss.PUBLISHED ? 'Unpublish' : 'Publish'}
                    </Button>
                  )}
                  
                  {isSuperAdmin && (
                    <Button
                      variant="danger"
                      size="sm"
                      leftIcon={<Trash2 className="h-4 w-4" />}
                      onClick={() => handleDelete(content.id)}
                      isLoading={deletingId === content.id}
                      title="Delete Content"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentList;