import Link from 'next/link';

export default function Home(): any {
  return (
    <main className="p-12">
      <ul>
        <li>
          <Link href="/layered">Layered</Link>
        </li>
        <li>
          <Link href="/eager">Eager loading</Link>
        </li>
      </ul>
    </main>
  );
}
