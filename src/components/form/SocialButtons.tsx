import { FieldValues } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type SocialButtonsProps<T> = {
    label: string;
    styles?: string;
}

const SocialButtons = <T extends FieldValues,>({ label, styles }: SocialButtonsProps<T>) => {
    return (
        <div className="flex flex-col items-center gap-2 mt-6 w-[50%]">
            <button
                type="button"
                className={`btn-social ${styles || ""}`}
                onClick={() => console.log("Login with Google")}
            >
                <FcGoogle size={20} className="mr-2" />
                Google {label}
            </button>
            <button
                type="button"
                className={`btn-social ${styles || ""}`}
                onClick={() => console.log("Login with GitHub")}
            >
                <FaGithub size={20} className="mr-2 text-black" />
                Github {label}
            </button>
        </div>
    )
}

export default SocialButtons;