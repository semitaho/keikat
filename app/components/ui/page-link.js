export default function PageLink({ href, children  }) {
    return <a className="hover:underline text-blue-500" href={href}>{children}</a>
}