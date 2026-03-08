"use client";

import Link from "next/link";

/**
 * Public Registration Disabled
 *
 * Registration is now restricted to authenticated users only.
 * New users can only be created by logged-in users through the user management dashboard.
 */
export default function Register() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
						Registration Unavailable
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Public registration is disabled for this application.
					</p>
				</div>

				<div className="mt-8 space-y-6 rounded-lg bg-white px-8 py-10 shadow">
					<div className="space-y-4">
						<div className="rounded-md bg-blue-50 p-4">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg
										className="h-5 w-5 text-blue-400"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div className="ml-3">
									<h3 className="text-sm font-medium text-blue-800">
										How to get an account
									</h3>
									<div className="mt-2 text-sm text-blue-700">
										<p>
											Only authenticated users can create new accounts.
											Please contact an existing user or administrator
											to create an account for you.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="text-center">
							<p className="text-sm text-gray-600">
								Already have an account?
							</p>
							<Link
								href="/login"
								className="mt-2 inline-block font-medium text-blue-600 hover:text-blue-500"
							>
								Sign in to your account
							</Link>
						</div>
					</div>
				</div>

				<div className="text-center">
					<Link
						href="/"
						className="text-sm font-medium text-gray-600 hover:text-gray-500"
					>
						← Back to home
					</Link>
				</div>
			</div>
		</div>
	);
}
