import Link from 'next/link'

export const Header = () => {
    return (
        <header className="px-10 p-3 border-b-2 border-[#ED77AC]">
            <Link href="/">
                <span className="text-xl font-extrabold text-[#ED77AC]">
                    モバイルPASMOクローラー
                </span>
            </Link>
        </header>
    )
}

export default Header;
