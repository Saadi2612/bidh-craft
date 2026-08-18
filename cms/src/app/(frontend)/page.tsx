import { redirect } from "next/navigation";

// This deployment exists only to serve the admin panel and the content API.
export default function Home() {
  redirect("/admin");
}
