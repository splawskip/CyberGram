import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Models } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import FileUploader from '../shared/FileUploader';
import { PostUploadValidation } from '@/lib/validation';
import { useUserContext } from '@/context/AuthContext';
import { useToast } from '../ui/use-toast';
import { useCreatePost } from '@/lib/react-query/queriesAndMutations';
import { PostFormProps } from '@/types';

function PostForm({ post, action }: PostFormProps) {
  const { mutateAsync: createPost } = useCreatePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  // Define form schema.
  const form = useForm<z.infer<typeof PostUploadValidation>>({
    resolver: zodResolver(PostUploadValidation),
    defaultValues: {
      caption: post ? post?.caption : '',
      file: [],
      location: post ? post?.location : '',
      tags: post ? post.tags.join(',') : '',
    },
  });
  // Handle form submit.
  async function onSubmit(values: z.infer<typeof PostUploadValidation>) :
  Promise<Models.Document | undefined> {
    // Create post.
    const newPost = await createPost({ ...values, userId: user.id });
    // If we got a post navigate to the homepage.
    if (newPost) {
      navigate('/');
      return newPost;
    }
    // If newPost is missing throw a toast and bail.
    toast({ title: 'Unable to create a post, please try again later.' });
    // Bail with undefined
    return undefined;
  }
  // Build component.
  return (
    <Form {...form}>
      <form action={action} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea placeholder="shadcn" className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (separated by comma &quot;,&quot;)</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" placeholder="Art, Learn" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">Cancel</Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

export default PostForm;