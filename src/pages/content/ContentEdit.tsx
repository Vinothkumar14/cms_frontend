import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ContentUpdateData } from '../../types/content';
import ContentService from '../../services/content.service';
import { toast } from 'react-toastify';

const ContentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContentUpdateData>();

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const content = await ContentService.getById(id);
        reset({
          id: content.id,
          title: content.title,
          description: content.description,
          body: content.body,
        });
      } catch (error) {
        console.error('Error fetching content:', error);
        toast.error('Failed to load content');
        navigate('/content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [id, navigate, reset]);

  const onSubmit = async (data: ContentUpdateData) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      await ContentService.update({ ...data, id });
      toast.success('Content updated successfully');
      navigate('/content');
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/content')}
            className="mr-4"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Content</h1>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Title"
            error={errors.title?.message}
            fullWidth
            placeholder="Enter a descriptive title"
            {...register('title', {
              required: 'Title is required',
              minLength: {
                value: 5,
                message: 'Title must be at least 5 characters long',
              },
              maxLength: {
                value: 100,
                message: 'Title must be less than 100 characters',
              },
            })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className={`w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              rows={3}
              placeholder="Enter a brief description"
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters long',
                },
                maxLength: {
                  value: 500,
                  message: 'Description must be less than 500 characters',
                },
              })}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Content Body
            </label>
            <textarea
              className={`w-full rounded-md border ${errors.body ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              rows={12}
              placeholder="Write your content here..."
              {...register('body', {
                required: 'Content body is required',
                minLength: {
                  value: 50,
                  message: 'Content body must be at least 50 characters long',
                },
              })}
            ></textarea>
            {errors.body && (
              <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/content')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="h-5 w-5" />}
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentEdit;