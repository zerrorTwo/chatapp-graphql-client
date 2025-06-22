'use client';

import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';
import { useLoading } from '@/app/context/loadingContext';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
});

export default function LoginPreview() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { setLoading } = useLoading();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { email, password } = values;
      const res = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/',
        redirect: false,
      });

      if (res?.error) {
        setLoading(false);
        if (res.error === 'CredentialsSignin') {
          toast.error('Invalid email or password!');
          return { error: 'Invalid email or password!' };
        } else {
          toast.error(`Login failed: ${res.error}`);
          return { error: res.error || 'Something went wrong during login!' };
        }
      }
      setLoading(false);
      toast.success('Login successful!');
      window.location.href = '/';
      return { success: true };
    } catch (error) {
      console.error('Unexpected error during form submission:', error);
      toast.error('Failed to submit the form. Please try again.');
      return { error: 'Failed to submit the form. Please try again.' };
    }
  }

  async function handleGoogleSignIn() {
    try {
      const res = await signIn('google', { callbackUrl: '/', redirect: false });
      console.log('Google signIn response:', res);
      if (res?.error) {
        toast.error('Google login failed!');
        return { error: 'Google login failed!' };
      }
      toast.success('Google login successful!');
      window.location.href = res.url || '/';
      return { success: true };
    } catch (error) {
      console.error('Unexpected error during Google login:', error);
      toast.error('Google login failed. Please try again.');
      return { error: 'Google login failed. Please try again.' };
    }
  }

  return (
    <div className="flex flex-col min-h-[100vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm w-[100%] lg:w-[30%]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and password to log in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          id="password"
                          placeholder="******"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200"
                >
                  Login
                </Button>
                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  className="w-full flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src="/images/google.png"
                    alt="Google icon"
                    className="w-5 h-5 object-contain"
                  />
                  <span className="text-sm font-medium">Login with Google</span>
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}