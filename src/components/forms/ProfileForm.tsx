import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Models } from 'appwrite';
import { useNavigate } from 'react-router-dom';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '../ui/textarea';
import FileUploader from '../shared/FileUploader';
import { UserUpdateValidation } from '@/lib/validation';
import { useToast } from '../ui/use-toast';
import { useUpdateUser } from '@/lib/react-query/queriesAndMutations';
import { ProfileFormProps } from '@/types';
import CyberButton from '../buttons/CyberButton';

function ProfileForm({ user }: ProfileFormProps) {
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  // Define form schema.
  const form = useForm<z.infer<typeof UserUpdateValidation>>({
    resolver: zodResolver(UserUpdateValidation),
    defaultValues: {
      file: [],
      bio: user ? user?.bio : '',
    },
  });
  // Handle form submit.
  async function onSubmit(values: z.infer<typeof UserUpdateValidation>) :
  Promise<Models.Document | undefined> {
    if (user) {
      const updatedUser = updateUser({
        ...values,
        bio: values.bio ?? '',
        userId: user.id,
        name: user.name,
        imageId: user.imageId,
        imageUrl: user?.imageUrl,
      });
      if (updatedUser) {
        navigate(`/profile/${user.id}`);
        return updatedUser;
      }
      toast({ title: 'Unable to perform user update.' });
      return undefined;
    }
    // Bail with undefined
    return undefined;
  }
  // Build component.
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Avatar</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={user?.imageUrl ?? ''} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Your bio" className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <CyberButton variant="cancel" disabled={isUpdating} loading={isUpdating}>
            Cancel
          </CyberButton>
          <CyberButton variant="accept" disabled={isUpdating} loading={isUpdating}>
            Update Profile
          </CyberButton>
        </div>
      </form>
    </Form>
  );
}

export default ProfileForm;
