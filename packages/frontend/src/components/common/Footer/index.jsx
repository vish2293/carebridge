import { Link } from "react-router-dom"
import { PATH_LIST } from "../../../constant/path-list"
import CopyrightFooter from "../CopyRightFooter"
import "./style.scss"

const columns = [
    {
        title: 'Get help',
        links: [
            { to: PATH_LIST.onBoarding, label: 'Request support' },
            { to: PATH_LIST.contactus, label: 'Contact us' },
        ],
    },
    {
        title: 'Care teams',
        links: [
            { to: PATH_LIST.login, label: 'Log in' },
            { to: PATH_LIST.signup, label: 'Create an account' },
        ],
    },
]

const Footer = () => (
    <div className="container">
        <div className="footer_grid">
            <div className="footer_brand">
                <Link to={PATH_LIST.home} className="footer_logo">care<span>bridge</span></Link>
                <p>Connecting communities with Community Health Workers, from first request to follow-up.</p>
            </div>
            {columns.map(col => (
                <nav key={col.title} aria-label={col.title}>
                    <h4>{col.title}</h4>
                    <ul>
                        {col.links.map(l => <li key={l.label}><Link to={l.to}>{l.label}</Link></li>)}
                    </ul>
                </nav>
            ))}
        </div>
        <CopyrightFooter />
    </div>
)

export default Footer
