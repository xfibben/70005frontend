import Link from "next/link";

export default function Menu({name, link}){

    return(
        <div>
            <button>
                <Link href={link}>Crear {name}</Link>
            </button>
        </div>
    )
}