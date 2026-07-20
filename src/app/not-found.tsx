// Root-level fallback for a locale segment that fails validation (e.g. /xx/...).
// The [locale] layout calls notFound() before it ever returns <html>/<body>, so
// this file — outside the [locale] segment — must supply its own minimal shell.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <p>Page not found.</p>
      </body>
    </html>
  );
}
