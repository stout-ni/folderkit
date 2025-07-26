import type { Metadata } from "next";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import "nextra-theme-docs/style.css";

export const metadata: Metadata = {
  generator: "Next.js",
  applicationName: "FolderKit",
  appleWebApp: {
    title: "FolderKit",
  },
  title: {
    default: "FolderKit: Pixel-Perfect MacOS Folder Icons Generator",
    template: "%s | FolderKit",
  },
};

const navbar = <Navbar logo={<b>FolderKit</b>} projectLink="https://github.com/stout-ni/folderkit" />;
const footer = <Footer>MIT {new Date().getFullYear()} © FolderKit.</Footer>;

export default async ({ children }: { children: React.ReactNode }) => (
  <html lang="en" dir="ltr" suppressHydrationWarning>
    <Head />
    <body>
      <Layout
        navbar={navbar}
        pageMap={await getPageMap()}
        docsRepositoryBase="https://github.com/stout-ni/folderkit/tree/main/docs"
        footer={footer}
      >
        {children}
      </Layout>
    </body>
  </html>
);
