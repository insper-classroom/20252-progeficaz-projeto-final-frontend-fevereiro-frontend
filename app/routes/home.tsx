import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "..." },
    { name: "description", content: "..." },
  ];
}

export default function Home() {
  return <div className="text-center mt-32">Comming soon!</div>
}
