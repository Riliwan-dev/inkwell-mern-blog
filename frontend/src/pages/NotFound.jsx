import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="max-w-md mx-auto px-6 py-24 text-center">
    <p className="font-display text-6xl mb-4">404</p>
    <h1 className="font-display text-2xl font-semibold mb-2">Lost page</h1>
    <p className="text-ink-soft dark:text-paper/60 mb-6">The page you're looking for doesn't exist or was moved.</p>
    <Link to="/" className="text-moss dark:text-moss-dark underline">
      Back to home
    </Link>
  </div>
);

export default NotFound;
