import { Button } from "@/components/ui/button";
import { ChefHat, ArrowLeft } from "lucide-react";
import { APP_TITLE } from "@/const";
import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <header className="sticky top-0 z-50 glass-morphism border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full tesla-gradient flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold gradient-text">{APP_TITLE}</h1>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="neumorphic-flat p-8 rounded-2xl">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-foreground/80">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Kitchen Spark, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. Description of Service</h2>
              <p className="mb-3">
                Kitchen Spark provides:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access to a curated collection of recipes</li>
                <li>AI-powered cooking assistance and recommendations</li>
                <li>Price comparison for grocery items across New Zealand supermarkets</li>
                <li>Meal planning and shopping list management tools</li>
                <li>Video tutorials and cooking guides</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. User Accounts</h2>
              <p className="mb-3">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Subscription and Payments</h2>
              <p className="mb-3">
                Premium features require a paid subscription:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Subscriptions are billed monthly or annually</li>
                <li>Payments are processed securely through Stripe</li>
                <li>You can cancel your subscription at any time</li>
                <li>Refunds are provided according to our refund policy</li>
                <li>Prices are subject to change with 30 days notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Acceptable Use</h2>
              <p className="mb-3">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Share your account credentials with others</li>
                <li>Scrape or copy content without permission</li>
                <li>Use automated systems to access the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. Content and Intellectual Property</h2>
              <p className="mb-3">
                All content on Kitchen Spark, including recipes, images, videos, and text, is protected by copyright and other intellectual property laws. You may:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>View and print content for personal, non-commercial use</li>
                <li>Share links to our recipes on social media</li>
              </ul>
              <p className="mt-3">
                You may not reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Disclaimer of Warranties</h2>
              <p>
                Kitchen Spark is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. Recipe information and pricing data are provided for informational purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Kitchen Spark shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">9. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at any time for violation of these terms. Upon termination, your right to use the service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">10. Changes to Terms</h2>
              <p>
                We may modify these terms at any time. We will notify you of significant changes by email or through the service. Continued use after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">11. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of New Zealand, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">12. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at legal@kitchenspark.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
