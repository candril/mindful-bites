import { Layout } from "@/components/Layout";

const AboutPage = () => {
  return (
    <Layout title="About">
      <div
        style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
      >
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
          title="Rick Astley - Never Gonna Give You Up"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </Layout>
  );
};

export default AboutPage;
