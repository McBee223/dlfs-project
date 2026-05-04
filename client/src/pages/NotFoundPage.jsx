import { Link } from "react-router-dom";


function NotFoundPage() {



    return (
        <div className="justify-center">
            <h1>404 Not Found ❌</h1>
            <Link to={"/"}>
                <button>Go back</button>
            </Link>
        </div>
    )
}

export default NotFoundPage;