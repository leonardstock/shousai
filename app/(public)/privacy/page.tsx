const PrivacyPage = () => {
    return (
        <div className='max-w-4xl mx-auto px-6 py-16 text-gray-800'>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                Our Privacy Policy
            </h1>
            <p className='text-sm text-gray-500 mb-8'>
                Last updated: 6th February 2025
            </p>

            <div className='space-y-6'>
                <p>
                    Welcome to <span className='font-semibold'>shousai</span>!
                    We are committed to protecting your privacy and ensuring
                    that your personal information is handled responsibly. This
                    Privacy Policy outlines the types of personal information we
                    collect, how we use it, and the measures we take to
                    safeguard your data when you use our services.
                </p>

                <h2 className='text-xl font-semibold'>
                    1. Information We Collect
                </h2>
                <p>
                    When you use <span className='font-semibold'>shousai</span>
                    &apos;s services, we may collect the following types of
                    information:
                </p>
                <ul className='list-disc list-inside space-y-2'>
                    <li>
                        <span className='font-semibold'>
                            Personal Information:
                        </span>{" "}
                        Your name, email address, and billing information.
                    </li>
                    <li>
                        <span className='font-semibold'>Usage Data:</span> How
                        you interact with the web app, including pages visited
                        and features used.
                    </li>
                    <li>
                        <span className='font-semibold'>
                            Device Information:
                        </span>{" "}
                        Details about the device you use, such as type and
                        operating system.
                    </li>
                </ul>

                <h2 className='text-xl font-semibold'>
                    2. How We Use Your Information
                </h2>
                <p>We use the collected information to:</p>
                <ul className='list-disc list-inside space-y-2'>
                    <li>
                        <span className='font-semibold'>Provide Services:</span>{" "}
                        Ensure a seamless user experience and enable access to
                        billing.
                    </li>
                    <li>
                        <span className='font-semibold'>Customer Support:</span>{" "}
                        Respond to inquiries and address issues.
                    </li>
                    <li>
                        <span className='font-semibold'>Improve Services:</span>{" "}
                        Analyze usage patterns and enhance functionality.
                    </li>
                    <li>
                        <span className='font-semibold'>Communications:</span>{" "}
                        Send updates, promotional offers, and relevant
                        information.
                    </li>
                </ul>

                <h2 className='text-xl font-semibold'>3. Data Security</h2>
                <p>
                    We implement industry-standard measures to protect your
                    personal information from unauthorized access, disclosure,
                    and destruction.
                </p>

                <h2 className='text-xl font-semibold'>
                    4. Sharing Your Information
                </h2>
                <p>
                    We do not sell or rent your personal data. However, we may
                    share it in the following cases:
                </p>
                <ul className='list-disc list-inside space-y-2'>
                    <li>
                        <span className='font-semibold'>
                            Service Providers:
                        </span>{" "}
                        Third parties assisting in delivering our services.
                    </li>
                    <li>
                        <span className='font-semibold'>Legal Compliance:</span>{" "}
                        If required by law or legal requests.
                    </li>
                </ul>

                <h2 className='text-xl font-semibold'>5. Your Choices</h2>
                <p>
                    You can access, correct, or delete your personal
                    information. You can also opt out of promotional
                    communications.
                </p>

                <h2 className='text-xl font-semibold'>
                    6. Changes to This Privacy Policy
                </h2>
                <p>
                    We may update this policy to reflect changes in our
                    practices. We will notify you of significant updates.
                </p>

                <h2 className='text-xl font-semibold'>7. Contact Us</h2>
                <p>
                    For any questions or concerns, please contact us at
                    <a
                        href='mailto:support@shousai.co.uk'
                        className='text-blue-600 hover:underline'>
                        {" "}
                        support@shousai.co.uk
                    </a>
                    .
                </p>

                <p>
                    Thank you for choosing{" "}
                    <span className='font-semibold'>shousai</span>. We are
                    dedicated to optimizing your experience.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPage;
