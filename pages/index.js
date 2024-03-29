import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-4xl mb-4">Stripe Demos</h1>
      <Link href="/demos/pe-multi-accounts">
        <p>
          &#10145;&#65039; Payment Element integration with multiple accounts
        </p>
      </Link>
      <Link href="/demos/payment-request-demo">
        <p>
          &#10145;&#65039; Payment Request Button integration with multiple
          accounts
        </p>
      </Link>
      <Link href="/demos/link-demo">
        <p>&#10145;&#65039; Link Demo with multiple accounts</p>
      </Link>
      <Link href="/demos/payment-request-api-demo">
        <p>&#10145;&#65039; Payment Request API Demo</p>
      </Link>
      <Link href="/demos/pe-pending-amount">
        <p>&#10145;&#65039; Payment Element with Unknown Amount upfront</p>
      </Link>
      <Link href="/demos/custom-checkout-demo">
        <p>&#10145;&#65039; Custom Checkout Demo</p>
      </Link>
      <Link href="/demos/ece-demo">
        <p>&#10145;&#65039; Express Checkout Element Demo</p>
      </Link>
    </Layout>
  );
}
