"use server";
import Component from "@/components/Component";

export default async function Page() {

  const response = await fetch("http://localhost:3000/api/testendpoint");
  const json = await response.json();
  const content = json.content;

  return (
    <div>
      <h1>This is the component from the separate file:</h1>
      <Component content={content} />
    </div>
  );
}