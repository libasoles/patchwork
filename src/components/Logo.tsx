import Image from "next/image";
import logo from "./Logo.png";

export default function Logo() {
  return <Image src={logo} alt="Logo" priority />;
}
