import Link from 'next/link';

const CustomLink = ({href="/", text = 'linkText', className, children, target="_self", onClick}) => {
    return <Link href={href}><a href={href} className={className} target={target} onClick={onClick}>{children ||  text}</a></Link>
}

export default CustomLink
