import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
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
import { SignUpValidation } from '@/lib/validation';
import { useToast } from '@/components/ui/use-toast';
import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';
import CyberLoader from '@/components/shared/CyberLoader';

function SignUp() {
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();
  // Define our form.
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      username: '',
      name: '',
      email: '',
      password: '',
    },
  });
  // Handle form submission.
  async function onSubmit(values: z.infer<typeof SignUpValidation>) : Promise<void> {
    // Create new user.
    const newUser = await createUserAccount(values);
    // If user wasn't created throw the toast.
    if (!newUser) {
      toast({
        title: 'Sign up failed. Please try again.',
      });
      // Bail
      return;
    }
    // Get session.
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    // If there is no session throw the toast.
    if (!session) {
      toast({
        title: 'Sign in failed. Please try again.',
      });
      // Bail
      return;
    }
    // Check if authentication happened.
    const isLoggedIn = await checkAuthUser();
    // If login failed throw the toast.
    if (!isLoggedIn) {
      toast({
        title: 'Sign in failed. Please try again.',
      });
      // Bail
      return;
    }
    // Clear form and navigate to homepage.
    form.reset();
    navigate('/');
  }
  // Build form.
  return (
    <Form {...form}>
      <div className="sm:w-420 flex justify-center items-center flex-col">
        <img loading="lazy" src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">To use Cybergram enter your account details</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="The Legend" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Johny Silverhand" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Johny.Silverhand@cyberpunk.net" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="N0futur3" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button--primary">
            {isCreatingAccount ? (
              <div className="flex justify-center items-center gap-2">
                <CyberLoader />
                Loading...
              </div>
            ) : 'Sign up'}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Log in</Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignUp;
