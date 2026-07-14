import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="rounded-2xl border bg-card p-10 text-center shadow-lg">
        <h1 className="text-8xl font-extrabold tracking-tight text-primary">
          404
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">Not Found</p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Return
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
