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
import { useToast } from '@/components/ui/use-toast';
import { SignInValidation } from '@/lib/validation';
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';
import CyberLoader from '@/components/shared/CyberLoader';

function SignIn() {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: signInAccount } = useSignInAccount();
  // Define our form.
  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  // Handle form submission.
  async function onSubmit(values: z.infer<typeof SignInValidation>) : Promise<void> {
    // Get session.
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    }).catch((error) => {
      toast({
        title: `Sign in failed. ${error.message ?? ''}`,
      });
    });
    // Bail.
    if (!session) {
      return;
    }
    // Check if authentication happened.
    const isLoggedIn = await checkAuthUser().catch((error) => {
      toast({
        title: `Sign in failed. ${error.message ?? ''}`,
      });
    });
    // Bail.
    if (!isLoggedIn) {
      return;
    }
    // Clear form and navigate to homepage.
    form.reset();
    navigate('/');
  }
  // Render form.
  return (
    <Form {...form}>
      <div className="sm:w-420 flex justify-center items-center flex-col">
        <img loading="lazy" src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log In</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back!</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Johny.Silverhand@cyberpunk.net" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form-message" />
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
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button--primary">
            {isUserLoading ? (
              <div className="flex justify-center items-center gap-2">
                <CyberLoader />
                Loading...
              </div>
            ) : 'Sign In'}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign up</Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignIn;
