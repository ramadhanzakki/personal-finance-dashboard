import React, { useState } from 'react';
import { loginUser, registerUser, parseApiError } from '../lib/api';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Login flow
                const response = await loginUser(formData.email, formData.password);
                localStorage.setItem('access_token', response.access_token);
                onLogin(); // Notify parent component
            } else {
                // Register flow
                await registerUser(formData.email, formData.password, formData.fullName);
                // After successful registration, auto-login
                const loginResponse = await loginUser(formData.email, formData.password);
                localStorage.setItem('access_token', loginResponse.access_token);
                onLogin(); // Notify parent component
            }
        } catch (err) {
            // Use parseApiError for specific FastAPI error messages
            const errorMessage = parseApiError(err);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ email: '', password: '', fullName: '' });
    };

    return (
        <div className="w-full h-full flex bg-white dark:bg-[#0f172a] font-display transition-colors duration-300">
            {/* Left Side - Form Section */}
            <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 xl:p-24 relative z-10 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center gap-2 mb-12">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">payments</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">FinanceApp</h2>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    {/* Greeting */}
                    <div className="mb-8">
                        <h1 className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
                            {isLogin ? "Welcome back" : "Create an account"}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base">
                            {isLogin ? "Please enter your details to sign in." : "Join FinanceApp and start tracking your wealth today."}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Full Name</label>
                                <input
                                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-[#1e293b] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-slate-400"
                                    placeholder="John Doe"
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Email Address</label>
                            <input
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-[#1e293b] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-slate-400"
                                placeholder="name@example.com"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Password</label>
                                {isLogin && <a className="text-primary text-xs font-semibold hover:underline cursor-pointer">Forgot Password?</a>}
                            </div>
                            <div className="relative">
                                <input
                                    className="w-full h-12 px-4 pr-12 rounded-xl bg-slate-50 dark:bg-[#1e293b] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                </button>
                            </div>
                        </div>

                        <button
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 mt-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                                    {isLogin ? "Signing in..." : "Creating account..."}
                                </>
                            ) : (
                                <>
                                    {isLogin ? "Sign In" : "Sign Up"}
                                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-[#0f172a] px-4 text-slate-500 font-medium">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-slate-700 dark:text-slate-300 text-sm font-medium">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB35qmEzCc1kvZM8k4Y2cKzovhI2bCymowQYemKeFjYBK4ufCp7NvydUE44bMNq8sNv9rJyvhWg9Nk6qKQsHA3f8wdHfjvUrNKRiOXoR0UtFA_AluEj9uJciu1DcwRduhZlI4q368fTIXRr2I81KLkNWdyC2s3mNcQHL4enFbZNombEozl9TRn-QHqP_Z1ZBRje1XlthEMCE2IcFY30DZgQCF4ieohXUEQ-cNgmDOT9fHyHRspmagrrnuhL5IWa41A7-raiV1v0d6ad" alt="Google" className="size-5" />
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-slate-700 dark:text-slate-300 text-sm font-medium">
                            <span className="material-symbols-outlined text-[20px]">laptop_mac</span>
                            Apple
                        </button>
                    </div>

                    {/* Switch Mode */}
                    <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={switchMode} className="text-primary font-bold hover:text-primary/80 ml-1">
                            {isLogin ? "Sign up for free" : "Sign in"}
                        </button>
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center sm:text-left text-xs text-slate-400 dark:text-slate-500">
                    &copy; 2026 FinanceApp Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side - Hero Image & Branding */}
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] relative overflow-hidden items-center justify-center text-white p-12">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-primary/20 to-purple-500/20 z-0"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3"></div>

                {/* Content Overlay */}
                <div className="relative z-10 max-w-lg text-center">
                    <div className="mb-8 inline-flex items-center justify-center size-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
                        <span className="material-symbols-outlined text-4xl text-white">monitoring</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-6 leading-tight">Master Your Money with FinanceApp</h2>
                    <p className="text-lg text-slate-300 leading-relaxed mb-8">
                        Track expenses, manage subscriptions, and reach your financial goals with our intuitive dashboard. Join over 10,000 users today.
                    </p>

                    {/* Feature/Testimonial Pills */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm font-medium">
                            <span className="material-symbols-outlined text-green-400 text-lg">check_circle</span>
                            Real-time Tracking
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm font-medium">
                            <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                            Smart Budgets
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm font-medium">
                            <span className="material-symbols-outlined text-purple-400 text-lg">check_circle</span>
                            Secure Encryption
                        </div>
                    </div>
                </div>

                {/* Overlay Texture/Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none"></div>
            </div>
        </div>
    );
};

export default Auth;
