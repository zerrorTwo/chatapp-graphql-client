'use client';

import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner'; // Assuming 'sonner' is your toast library
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';

// Improved schema with additional validation rules
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { email, password } = values;
      const res = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/', // URL to redirect to on successful login
        redirect: false,  // Crucial: prevents automatic redirect, allows custom error handling
      });

      console.log('signIn response:', res); // Log the full response for debugging

      if (res?.error) {
        if (res.error === 'CredentialsSignin') {
          // Auth.js returns 'CredentialsSignin' when authorize callback returns null.
          // This typically covers incorrect email/password.
          toast.error('Invalid email or password!'); // Default message for CredentialsSignin
          return { error: 'Invalid email or password!' };
        } else {
          // Handle other potential errors returned by signIn
          toast.error(`Login failed: ${res.error}`);
          return { error: res.error || 'Something went wrong during login!' };
        }
      }

      // If no error property, login was successful
      toast.success('Login successful!');
      window.location.href = '/'; // Manual redirect after successful login
      return { success: true };

    } catch (error) {
      // This catch block handles unexpected errors during the signIn call itself
      console.error('Unexpected error during form submission:', error);
      toast.error('Failed to submit the form. Please try again.');
      return { error: 'Failed to submit the form. Please try again.' };
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
                          type={'password'}
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

                <Button variant="outline" className="w-full flex items-center gap-2 cursor-pointer">
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
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}