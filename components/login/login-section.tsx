'use client';

import Github from '@/components/icons/github';
import Google from '@/components/icons/google';
import LoadingDots from '@/components/icons/loading-dots';
import { loginConfig } from '@/config/login';
import { supabase } from '@/utils/supabase-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import Image from 'next/image';

const getLoginRedirectPath = (pathname?: string | null): string => {
    return (
        process.env.NEXT_PUBLIC_APP_URL +
        '/auth/callback' + // Required for PKCE authentication.
        '?redirect=' + // Passed to auth/route/callback to redirect after auth
        (pathname ? pathname : '/dashboard')
    );
};

const FormSchema = z.object({
    email: z
        .string({
            required_error: loginConfig.emailRequiredError,
        })
        .email(),
});

interface LoginSectionProps {
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginSection: React.FC<LoginSectionProps> = ({ setOpen }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });
    const [signInGoogleClicked, setSignInGoogleClicked] = React.useState<boolean>(false);
    const [signInGithubClicked, setSignInGithubClicked] = React.useState<boolean>(false);
    const router = useRouter();
    const currentPathname = usePathname();
    const redirectTo = getLoginRedirectPath(currentPathname);

    async function signInWithGoogle() {
        setSignInGoogleClicked(true);
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
                queryParams: {
                    prompt: 'consent',
                },
            },
        });
        router.refresh();
    }

    async function signInWithGitHub() {
        setSignInGithubClicked(true);
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo,
                queryParams: {
                    prompt: 'consent',
                },
            },
        });
        router.refresh();
    }

    return (
        <>
            <div className="mx-auto w-full justify-center rounded-md border border-black/5 bg-gray-50 align-middle shadow-md">
                <div className="flex flex-col items-center justify-center space-y-3 border-b px-4 py-6 pt-8 text-center">
                    <a href="https://ub.cafe">
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            className="h-16 w-16 rounded-full"
                            width={64}
                            height={64}
                            priority
                        />
                    </a>
                    <h3 className="font-display text-2xl font-bold">{loginConfig.title}</h3>
                </div>

                {/* Sign in buttons with Social accounts */}
                <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
                    <button
                        disabled={signInGoogleClicked}
                        className={`${
                            signInGoogleClicked
                                ? 'cursor-not-allowed border-gray-200 bg-gray-100'
                                : 'border border-gray-200 bg-white text-black hover:bg-gray-50'
                        } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
                        onClick={() => signInWithGoogle()}
                    >
                        {signInGoogleClicked ? (
                            <LoadingDots color="#808080" />
                        ) : (
                            <>
                                <Google className="h-5 w-5" />
                                <p>{loginConfig.google}</p>
                            </>
                        )}
                    </button>

                    <button
                        disabled={signInGithubClicked}
                        className={`${
                            signInGithubClicked
                                ? 'cursor-not-allowed border-gray-200 bg-gray-100'
                                : 'border border-gray-200 bg-white text-black hover:bg-gray-50'
                        } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
                        onClick={() => signInWithGitHub()}
                    >
                        {signInGithubClicked ? (
                            <LoadingDots color="#808080" />
                        ) : (
                            <>
                                <Github className="h-5 w-5" />
                                <p>{loginConfig.github}</p>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default LoginSection;
