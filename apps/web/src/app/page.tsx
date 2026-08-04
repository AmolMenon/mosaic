"use client";
export default function HomePage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Mosaic OS</h1>
      <p>The Evidence Layer for Investment Decisions.</p>
      <div style={{ marginTop: "2rem" }}>
        <h2>Placeholder Routes:</h2>
        <ul>
          <li>/projects</li>
          <li>/projects/[id]/data-room</li>
          <li>/projects/[id]/questions</li>
          <li>/projects/[id]/memo</li>
        </ul>
      </div>
    </main>
  );
}
