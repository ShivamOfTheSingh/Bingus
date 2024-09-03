"use server";
import Component from "@/components/Component";

export default async function Page() {

  const baseUrl = process.env.BASE_URL;
  const response = await fetch(`${baseUrl}/api/testendpoint`);
  const json = await response.json();
  const content = json.content;

  return (
    <div>
      <h1>This is the component from the separate file:</h1>
      <Component content={content} />
    </div>
  );
}