import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  return (
    <nav>
      <div className="flex items-center justify-between px-10 py-3 bg-gray-200 dark:bg-gray-800">
        <Link to="/" className="text-xl font-bold">
          TinyMeet
        </Link>
        <div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
