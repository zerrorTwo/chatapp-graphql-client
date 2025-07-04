"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLoading } from "@/app/context/loadingContext";
import { performLogin } from "@/app/graphql/apollo-client";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@apollo/client";
import { GOOGLE_LOGIN_MUTATION } from "@/app/graphql/mutations/login.mutation";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
});

export default function LoginPreview() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setLoading } = useLoading();
  const [googleLoginMutation] = useMutation(GOOGLE_LOGIN_MUTATION);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { email, password } = values;
      const data = await performLogin(email, password);
      setLoading(false);
      toast.success("Login successful!");
      window.location.href = "/";
    } catch (error: any) {
      setLoading(false);
      console.error("Unexpected error during form submission:", error);
      toast.error(error.message || "Failed to login. Please try again.");
    }
  }

  async function handleGoogleLogin(
    credentialResponse: CredentialResponse,
    googleLoginMutation: any,
    setLoading: (loading: boolean) => void
  ) {
    try {
      setLoading(true);

      const input = credentialResponse.credential;

      if (!input) {
        throw new Error("Google credential is missing");
      }

      const { data } = await googleLoginMutation({
        variables: { input },
      });

      if (!data?.loginWithGoogleIdToken?.accessToken) {
        throw new Error("Đăng nhập thất bại từ Google");
      }

      localStorage.setItem(
        "access_token",
        data.loginWithGoogleIdToken.accessToken
      );

      toast.success("Google login successful!");
      window.location.href = "/";
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed");
    } finally {
      setLoading(false);
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
              </div>
            </form>
          </Form>

          <div className="my-4 text-center text-sm">Or login with</div>
          <GoogleLogin
            onSuccess={(credentialResponse) =>
              handleGoogleLogin(
                credentialResponse,
                googleLoginMutation,
                setLoading
              )
            }
            onError={() => toast.error("Google login failed")}
          />

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
