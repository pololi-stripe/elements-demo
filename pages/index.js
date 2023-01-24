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
      <h1>Stripe Demos</h1>
      <Link href="/demos/pe-multi-accounts">
        <p>Payment Element integration with multiple accounts</p>
      </Link>
    </Layout>
  );
}
